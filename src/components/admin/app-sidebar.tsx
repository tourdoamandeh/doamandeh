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
      <Sidebar collapsible="icon" className="border-r-2 border-brown bg-black font-sans" {...props}>
        {/* Sidebar Header: Brand Doamandeh */}
        <SidebarHeader className="border-b border-brown/30 p-3">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex items-center justify-center p-1 cursor-pointer w-full" />
                }
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-softyellow text-brown border-2 border-softyellow text-xs font-bold shadow-none">
                  D.
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="rounded-none border border-brown bg-softyellow text-black">
                <p className="font-semibold uppercase tracking-wider text-xs">Doamandeh</p>
                <p className="text-[10px] text-brown">Editorial CMS</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-softyellow text-brown border-2 border-softyellow text-sm font-bold shadow-none">
                D.
              </div>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-bold tracking-widest text-softyellow uppercase">
                  Doamandeh
                </span>
                <span className="truncate text-[10px] tracking-wider text-softyellow/60 uppercase">
                  Editorial CMS
                </span>
              </div>
            </div>
          )}
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-softyellow/50 px-2 mb-1">
                // Navigasi Utama
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link href={item.url} className="w-full block">
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <SidebarMenuButton
                                  isActive={item.isActive}
                                  className={`justify-center px-0 h-9 w-9 mx-auto rounded-none transition-colors ${
                                    item.isActive
                                      ? 'bg-brown text-softyellow border border-softyellow'
                                      : 'text-softyellow/70 hover:text-softyellow hover:bg-brown/40'
                                  }`}
                                />
                              }
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={12} className="rounded-none border border-brown bg-softyellow text-black">
                              <span className="uppercase text-xs font-medium tracking-wider">{item.title}</span>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <SidebarMenuButton
                            isActive={item.isActive}
                            className={`rounded-none px-3 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                              item.isActive
                                ? 'bg-brown text-softyellow border-l-4 border-softyellow'
                                : 'text-softyellow/70 hover:text-softyellow hover:bg-brown/40'
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </SidebarMenuButton>
                        )}
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer: User info + Logout */}
        <SidebarFooter className="border-t border-brown/30 p-2.5 space-y-2">
          <SidebarMenu className="space-y-1">
            {/* Website Public Link */}
            <SidebarMenuItem>
              <Link href="/" target="_blank" className="w-full block">
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <SidebarMenuButton className="justify-center px-0 h-9 w-9 mx-auto rounded-none text-softyellow/70 hover:text-softyellow hover:bg-brown/40" />
                      }
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12} className="rounded-none border border-brown bg-softyellow text-black">
                      <span className="text-xs uppercase tracking-wider">Website Publik</span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <SidebarMenuButton className="rounded-none text-softyellow/70 hover:text-softyellow hover:bg-brown/40 text-xs uppercase tracking-wider">
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span className="truncate">Website Publik</span>
                  </SidebarMenuButton>
                )}
              </Link>
            </SidebarMenuItem>

            {/* User Profile Card */}
            <SidebarMenuItem>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <div className="flex items-center justify-center rounded-none border border-brown bg-brown/50 p-1.5 cursor-pointer w-9 h-9 mx-auto" />
                    }
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-softyellow text-brown text-xs font-bold">
                      {(adminName || 'A').charAt(0).toUpperCase()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="rounded-none border border-brown bg-softyellow text-black">
                    <p className="font-semibold uppercase tracking-wider text-xs">{adminName || 'Admin'}</p>
                    <p className="text-[10px] text-brown/70">{userEmail || 'admin@doamandeh.com'}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="flex items-center gap-2.5 rounded-none border border-brown/60 bg-brown/30 p-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-softyellow text-brown text-xs font-bold">
                    {(adminName || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-semibold uppercase tracking-wider text-softyellow">{adminName || 'Admin'}</span>
                    <span className="truncate text-[10px] text-softyellow/60 font-mono">{userEmail || 'admin@doamandeh.com'}</span>
                  </div>
                </div>
              )}
            </SidebarMenuItem>

            {/* Logout Action */}
            <SidebarMenuItem>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <SidebarMenuButton
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="justify-center px-0 h-9 w-9 mx-auto rounded-none text-softyellow/70 hover:text-softyellow hover:bg-black cursor-pointer"
                      />
                    }
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="rounded-none border border-brown bg-softyellow text-black">
                    <span className="text-xs uppercase tracking-wider">Keluar</span>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <SidebarMenuButton
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-none text-softyellow/70 hover:text-softyellow hover:bg-black cursor-pointer text-xs uppercase tracking-wider"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isLoggingOut ? 'Keluar...' : 'Keluar (Logout)'}</span>
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
