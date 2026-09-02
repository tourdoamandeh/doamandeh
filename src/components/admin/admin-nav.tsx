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
      label: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Layanan',
      href: '/admin/services',
      icon: Package,
      active: pathname.startsWith('/admin/services'),
    },
    {
      label: 'Booking',
      href: '/admin/bookings',
      icon: CalendarCheck,
      active: pathname.startsWith('/admin/bookings'),
    },
    {
      label: 'Pengaturan',
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
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex h-14 items-center justify-between border-b border-stone-800 bg-[#101010] px-4 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-700 font-mono text-xs font-bold text-white">
            D
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">DOAMANDEH</span>
          <span className="text-[10px] font-mono uppercase bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">OPS</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
        />
      )}

      {/* Fixed Left Sidebar (240px / w-60) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col justify-between border-r border-stone-800 bg-[#101010] p-4 transition-transform duration-150 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="mb-6 flex items-center justify-between px-2 pt-1 pb-3 border-b border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-700 font-mono text-xs font-bold text-white">
                D
              </div>
              <div>
                <span className="font-mono text-xs font-bold tracking-wider text-white">DOAMANDEH</span>
                <span className="block text-[10px] text-stone-400 font-mono tracking-tight">OPERATIONS</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-2 mb-2">
            <p className="text-[10px] font-mono font-medium uppercase tracking-wider text-stone-500">
              Menu Utama
            </p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    item.active
                      ? 'bg-stone-800/90 text-white font-semibold'
                      : 'text-[#A3A3A3] hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${item.active ? 'text-teal-400' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="border-t border-stone-800/80 pt-3 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-900/60 px-2.5 py-1.5 text-[11px] font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
              Website Public
            </span>
          </Link>

          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-2.5">
            <p className="truncate text-xs font-medium text-white">{adminName || 'Administrator'}</p>
            <p className="truncate text-[11px] font-mono text-stone-400 mt-0.5">{userEmail || 'admin@doamandeh.com'}</p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-800 bg-transparent px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:bg-stone-900 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? 'Keluar...' : 'Keluar (Logout)'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
