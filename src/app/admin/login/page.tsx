'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/lib/actions/admin/auth';
import { Lock, Mail, Loader2, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-softyellow px-4 py-12 text-black font-sans selection:bg-brown selection:text-softyellow">
      <div className="w-full max-w-sm space-y-5">
        {/* Brand Monogram Header */}
        <div className="text-center">
          <Link href="/" className="inline-block group mb-3">
            <div className="h-14 w-14 bg-brown text-softyellow flex items-center justify-center text-3xl font-light tracking-tighter border-2 border-brown rounded-none mx-auto group-hover:bg-black transition-colors">
              D.
            </div>
          </Link>
          <h1 className="text-lg font-bold tracking-widest uppercase text-brown">
            DOAMANDEH CMS
          </h1>
          <p className="text-[11px] font-medium tracking-wider uppercase text-brown/70 mt-0.5">
            Portal Administrasi &amp; Operasional
          </p>
        </div>

        {/* Editorial Geometric Card */}
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 sm:p-8 shadow-none">
          <div className="mb-5 pb-3 border-b-2 border-brown/30 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
                Autentikasi Staf
              </h2>
              <p className="text-[10px] text-brown/70 mt-0.5">
                Masukkan kredensial administrator resmi.
              </p>
            </div>
            <Shield className="h-4 w-4 text-brown/70" />
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-none bg-softyellow border-2 border-brown p-3 text-xs text-brown">
              <AlertCircle className="h-4 w-4 text-brown shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brown/60" />
                <input
                  type="email"
                  required
                  placeholder="admin@doamandeh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-none border-2 border-brown bg-softyellow/50 pl-9 pr-3 py-2.5 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brown/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-none border-2 border-brown bg-softyellow/50 pl-9 pr-3 py-2.5 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-none bg-brown py-3 text-xs font-bold uppercase tracking-widest text-softyellow hover:bg-black hover:border-black border-2 border-brown transition-colors disabled:opacity-50 mt-5 cursor-pointer shadow-none"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Masuk ke Dashboard</span>
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-widest font-medium text-brown/60">
            Akses Terbatas © {new Date().getFullYear()} DOAMANDEH.
          </p>
          <Link
            href="/"
            className="inline-block text-[10px] uppercase tracking-widest text-brown underline hover:text-black font-semibold"
          >
            ← Kembali ke Website Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
