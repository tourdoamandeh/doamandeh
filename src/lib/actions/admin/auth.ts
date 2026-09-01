'use server';

import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerAdminSchema, LoginInput, RegisterAdminInput } from '@/lib/validations/admin';
import { Profile } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAdminAction(input: LoginInput): Promise<ActionResult<{ redirectUrl: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input login tidak valid',
    };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message === 'Invalid login credentials'
          ? 'Email atau password salah.'
          : (authError?.message || 'Gagal login ke akun admin.'),
      };
    }

    const userId = authData.user.id;

    // Check user profile role in public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      // If profile does not exist, check if there are any profiles at all.
      // If none, bootstrap this first user as admin profile
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          email: authData.user.email ?? email,
          full_name: authData.user.user_metadata?.full_name || 'Super Admin',
          role: 'admin',
        });

        if (insertError) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Gagal menginisialisasi role profile admin: ' + insertError.message,
          };
        }
      } else {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Profil akun tidak ditemukan atau belum memiliki role admin.',
        };
      }
    } else if (profile.role !== 'admin') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Akses ditolak. Akun Anda bukan admin.',
      };
    }

    revalidatePath('/admin', 'layout');
    return {
      success: true,
      data: { redirectUrl: '/admin' },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat login.',
    };
  }
}

export async function registerAdminAction(input: RegisterAdminInput): Promise<ActionResult<{ email: string }>> {
  const parsed = registerAdminSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Input pendaftaran tidak valid',
    };
  }

  const { fullName, email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Gagal mendaftarkan akun admin.',
      };
    }

    const userId = authData.user.id;

    // Create or ensure profile has admin role
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      full_name: fullName,
      role: 'admin',
    });

    if (profileError) {
      return {
        success: false,
        error: 'Akun terbuat namun gagal mendaftarkan role admin: ' + profileError.message,
      };
    }

    return {
      success: true,
      data: { email },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mendaftar.',
    };
  }
}

export async function logoutAdminAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}

export async function getCurrentAdmin(): Promise<{ user: { id: string; email?: string } | null; profile: Profile | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      user: { id: user.id, email: user.email },
      profile: profile as Profile | null,
    };
  } catch {
    return { user: null, profile: null };
  }
}
