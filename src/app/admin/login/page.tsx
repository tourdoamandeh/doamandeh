'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/lib/actions/admin/auth';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await loginAdminAction({ email, password });
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal login ke akun admin.');
      } else {
        router.push(res.data?.redirectUrl || '/admin');
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-4 py-12 text-[#171717] font-sans antialiased selection:bg-teal-700 selection:text-white">
      <div className="w-full max-w-sm space-y-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#101010] text-white font-mono text-sm font-bold mb-2">
            D
          </div>
          <h1 className="font-mono text-sm font-bold tracking-wider text-stone-900 uppercase">
            DOAMANDEH OPERATIONS
          </h1>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Panel Administrasi & Pengelolaan Layanan
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-xs">
          <div className="mb-4 pb-3 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Autentikasi Admin
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Masukkan email dan password terdaftar.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@doamandeh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white pl-8 pr-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white pl-8 pr-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] py-2 text-xs font-medium text-white hover:bg-[#115E59] transition-colors disabled:opacity-50 mt-4"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Masuk ke Dashboard</span>
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-stone-400">
          Akses terbatas hanya untuk administrator Doamandeh.
        </p>
      </div>
    </div>
  );
}
