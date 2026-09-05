'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAdminAction } from '@/lib/actions/admin/auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { AdminThemeToggle } from '@/components/admin/admin-theme-toggle';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 text-foreground font-sans">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <AdminThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="size-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-none">
            D
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Doamandeh Admin
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Operations &amp; Content Management System
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-card border-border shadow-none">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base font-semibold">Masuk ke Akun</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Masukkan kredensial administrator untuk melanjutkan.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@doamandeh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-sm"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 text-sm"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs font-medium"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin mr-2" />}
                <span>Masuk ke Dashboard</span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              ← Kembali ke Website Publik
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground">
          Doamandeh Tours &amp; Travel © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
