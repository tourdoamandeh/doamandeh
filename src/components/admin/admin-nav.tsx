'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { logoutAdminAction } from '@/lib/actions/admin/auth';

interface AdminNavProps {
  userEmail?: string;
  adminName?: string;
}

export function AdminNav({ userEmail, adminName }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Kelola Layanan',
      href: '/admin/services',
      icon: Package,
      active: pathname.startsWith('/admin/services'),
    },
    {
      label: 'Daftar Booking',
      href: '/admin/bookings',
      icon: CalendarCheck,
      active: pathname.startsWith('/admin/bookings'),
    },
    {
      label: 'Pengaturan Website',
      href: '/admin/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/settings'),
    },
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAdminAction();
  }

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-bold text-black text-sm">
            D
          </div>
          <span className="font-bold text-sm tracking-tight">Doamandeh Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-zinc-800/80 bg-zinc-950 p-4 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="mb-8 flex items-center gap-3 px-2 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-black text-black text-lg shadow-md shadow-amber-500/20">
              D
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-white">Doamandeh</h2>
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <Shield className="h-3 w-3" />
                <span>Admin CMS</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${item.active ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="border-t border-zinc-800/80 pt-4 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
              Lihat Website Public
            </span>
          </Link>

          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
            <p className="truncate text-xs font-semibold text-white">{adminName || 'Admin'}</p>
            <p className="truncate text-[11px] text-zinc-400">{userEmail || 'admin@doamandeh.com'}</p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/30 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? 'Keluar...' : 'Logout Admin'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
