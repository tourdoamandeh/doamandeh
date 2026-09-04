'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Calendar,
  Settings,
  LogOut,
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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

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
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: pathname === '/admin',
    },
    {
      title: 'Services',
      url: '/admin/services',
      icon: Package,
      isActive: pathname.startsWith('/admin/services'),
    },
    {
      title: 'Bookings',
      url: '/admin/bookings',
      icon: Calendar,
      isActive: pathname.startsWith('/admin/bookings'),
    },
    {
      title: 'Settings',
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
    <TooltipProvider delay={100}>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar font-sans" {...props}>
        {/* Sidebar Header: Clean Brand Typography (Without Logo D) */}
        {!isCollapsed && (
          <SidebarHeader className="border-b border-sidebar-border px-4 py-3.5">
            <div className="flex flex-col text-left leading-tight">
              <span className="truncate font-semibold text-sidebar-foreground text-sm tracking-tight">
                Doamandeh
              </span>
              <span className="truncate text-[11px] text-muted-foreground mt-0.5">
                Admin Operations
              </span>
            </div>
          </SidebarHeader>
        )}

        {/* Sidebar Content */}
        <SidebarContent className={isCollapsed ? 'px-0 py-3 overflow-x-hidden' : 'px-2 py-3'}>
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-1">
                Navigasi
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={isCollapsed ? 'items-center' : ''}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title} className={isCollapsed ? 'flex justify-center' : ''}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Link href={item.url} className="flex items-center justify-center">
                                <SidebarMenuButton
                                  isActive={item.isActive}
                                  className="size-8 justify-center p-0 rounded-md shrink-0"
                                >
                                  <Icon className="size-4 shrink-0" />
                                </SidebarMenuButton>
                              </Link>
                            }
                          >
                            <span className="sr-only">{item.title}</span>
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={22}>
                            <span className="text-xs font-medium">{item.title}</span>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link href={item.url} className="w-full">
                          <SidebarMenuButton
                            isActive={item.isActive}
                            className="rounded-md text-xs px-2.5 h-8 gap-2.5"
                          >
                            <Icon className="size-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer: User info + Logout */}
        <SidebarFooter className={isCollapsed ? 'px-0 py-3 space-y-1 overflow-x-hidden border-t border-sidebar-border' : 'p-2.5 space-y-1 border-t border-sidebar-border'}>
          <SidebarMenu className={isCollapsed ? 'items-center' : ''}>
            {/* User Profile Card */}
            <SidebarMenuItem className={isCollapsed ? 'flex justify-center' : ''}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <div className="flex items-center justify-center size-8 rounded cursor-pointer mx-auto">
                        <div className="size-7 rounded-full bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                          {(adminName || 'A').charAt(0).toUpperCase()}
                        </div>
                      </div>
                    }
                  >
                    <span className="sr-only">{adminName || 'Admin'}</span>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={22}>
                    <p className="font-semibold text-xs">{adminName || 'Admin'}</p>
                    <p className="text-[11px] opacity-80 font-mono">{userEmail || 'admin@doamandeh.com'}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="flex items-center gap-2.5 rounded bg-sidebar-accent/50 p-2 text-xs">
                  <div className="size-7 rounded-full bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center font-semibold text-xs shrink-0">
                    {(adminName || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-medium text-sidebar-foreground">{adminName || 'Admin'}</span>
                    <span className="truncate text-[11px] text-muted-foreground font-mono">{userEmail || 'admin@doamandeh.com'}</span>
                  </div>
                </div>
              )}
            </SidebarMenuItem>

            {/* Logout Action */}
            <SidebarMenuItem className={isCollapsed ? 'flex justify-center' : ''}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <SidebarMenuButton
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="size-8 justify-center p-0 mx-auto rounded-md shrink-0 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <LogOut className="size-4 shrink-0" />
                      </SidebarMenuButton>
                    }
                  >
                    <span className="sr-only">Keluar</span>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={22}>
                    <span className="text-xs">Keluar</span>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <SidebarMenuButton
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded text-muted-foreground hover:text-destructive cursor-pointer text-xs"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span className="truncate">{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        {/* Interactive Desktop Rail */}
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
