'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ExternalLink } from 'lucide-react';
import { AdminThemeToggle } from '@/components/admin/admin-theme-toggle';

const PATH_TITLES: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/services': 'Katalog Layanan',
  '/admin/bookings': 'Daftar Pemesanan',
  '/admin/settings': 'Pengaturan Website & CMS',
};

export function AdminHeader() {
  const pathname = usePathname();
  const currentTitle = PATH_TITLES[pathname] || 'Operasional CMS';

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card/95 backdrop-blur-sm px-4 sm:px-6 transition-[width,height] ease-linear font-sans shadow-xs">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="/admin" className="text-muted-foreground hover:text-foreground">
                Doamandeh Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:inline-flex" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <AdminThemeToggle />
        <Separator orientation="vertical" className="h-4" />
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="hidden sm:inline">Website Publik</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </header>
  );
}
