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
} from 'lucide-react';
import { useState } from 'react';
import { logoutAdminAction } from '@/lib/actions/admin/auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

interface AdminNavProps {
  userEmail?: string;
  adminName?: string;
}

function AdminNavContent({ userEmail, adminName }: AdminNavProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toggleSidebar } = useSidebar();

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
      {/* Mobile Top Header with trigger */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex h-14 items-center justify-between border-b border-stone-800 bg-[#101010] px-4 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-700 font-mono text-xs font-bold text-white">
            D
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">DOAMANDEH</span>
          <span className="text-[10px] font-mono uppercase bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">OPS</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* shadcn Sidebar Component */}
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-700 font-mono text-xs font-bold text-white">
              D
            </div>
            <div>
              <span className="font-mono text-xs font-bold tracking-wider text-white">DOAMANDEH</span>
              <span className="block text-[10px] text-stone-400 font-mono tracking-tight">OPERATIONS</span>
            </div>
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} className="w-full block">
                        <SidebarMenuButton isActive={item.active}>
                          <Icon className={`h-4 w-4 shrink-0 ${item.active ? 'text-teal-400' : 'text-stone-500'}`} />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter>
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
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-800 bg-transparent px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:bg-stone-900 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? 'Keluar...' : 'Keluar (Logout)'}</span>
          </button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export function AdminNav(props: AdminNavProps) {
  return (
    <SidebarProvider>
      <AdminNavContent {...props} />
    </SidebarProvider>
  );
}
