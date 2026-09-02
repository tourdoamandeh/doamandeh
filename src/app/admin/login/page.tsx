'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/lib/actions/admin/auth';
import { Shield, Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100 selection:bg-amber-500 selection:text-black">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 font-black text-black text-2xl shadow-xl shadow-amber-500/20 mb-4">
            D
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Doamandeh Tours & Travel
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Panel Administrasi & Pengelolaan Layanan
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" />
              <span>Login Administrator</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Masukkan kredensial akun administrator Anda untuk melanjutkan.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2 rounded-xl bg-red-950/40 border border-red-800/80 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Akun Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@doamandeh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-6"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              <span>Masuk ke Dashboard</span>
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500/60" />
          <span>Akses terbatas hanya untuk administrator Doamandeh.</span>
        </div>
      </div>
    </div>
  );
}
