'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { logoutAdminAction } from '@/lib/actions/admin/auth';
import {
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
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userEmail?: string;
  adminName?: string;
}

export function AppSidebar({ userEmail, adminName, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { state, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === 'collapsed';

  const navItems = [
    {
      title: 'Overview',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: pathname === '/admin',
    },
    {
      title: 'Katalog Layanan',
      url: '/admin/services',
      icon: Package,
      isActive: pathname.startsWith('/admin/services'),
    },
    {
      title: 'Daftar Booking',
      url: '/admin/bookings',
      icon: CalendarCheck,
      isActive: pathname.startsWith('/admin/bookings'),
    },
    {
      title: 'Pengaturan Website',
      url: '/admin/settings',
      icon: Settings,
      isActive: pathname.startsWith('/admin/settings'),
    },
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAdminAction();
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar Header: Brand Team Switcher */}
      <SidebarHeader>
        <div className={`flex items-center gap-2.5 px-1 py-1 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white font-mono text-xs font-bold shadow-xs">
            D
          </div>
          {!isCollapsed && (
            <div className="grid flex-1 text-left text-xs leading-tight">
              <span className="truncate font-mono font-bold tracking-wider text-white">
                DOAMANDEH
              </span>
              <span className="truncate text-[10px] font-mono text-stone-400">
                OPERATIONS CMS
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className="w-full block" title={item.title}>
                      <SidebarMenuButton
                        isActive={item.isActive}
                        tooltip={item.title}
                        className={isCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${item.isActive ? 'text-teal-400' : 'text-stone-500'}`} />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: User Nav & Actions */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Website Public Link */}
          <SidebarMenuItem>
            <Link href="/" target="_blank" className="w-full block" title="Website Public">
              <SidebarMenuButton
                tooltip="Website Public"
                className={isCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''}
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-stone-500" />
                {!isCollapsed && (
                  <span className="truncate text-xs text-stone-400">
                    Website Public
                  </span>
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          {/* User Card */}
          <SidebarMenuItem>
            <div
              className={`flex items-center gap-2 rounded-lg border border-stone-800/80 bg-stone-900/50 p-2 ${
                isCollapsed ? 'justify-center p-1.5' : ''
              }`}
              title={`${adminName || 'Admin'} (${userEmail || 'admin@doamandeh.com'})`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-800 font-mono text-xs font-semibold text-stone-200">
                {(adminName || 'A').charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                  <span className="truncate font-medium text-white">{adminName || 'Admin'}</span>
                  <span className="truncate text-[10px] text-stone-500">{userEmail || 'admin@doamandeh.com'}</span>
                </div>
              )}
            </div>
          </SidebarMenuItem>

          {/* Logout Action */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`text-stone-400 hover:text-rose-400 hover:bg-stone-900 cursor-pointer ${
                isCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''
              }`}
              tooltip="Keluar (Logout)"
              title="Keluar (Logout)"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Keluar (Logout)</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Interactive Desktop Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
