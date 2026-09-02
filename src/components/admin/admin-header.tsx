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

const PATH_TITLES: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/services': 'Katalog Layanan',
  '/admin/bookings': 'Daftar Booking',
  '/admin/settings': 'Pengaturan Website',
};

export function AdminHeader() {
  const pathname = usePathname();
  const currentTitle = PATH_TITLES[pathname] || 'Operations';

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-stone-200 bg-white px-4 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-stone-200" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:inline-flex" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Lihat Website Public</span>
        </Link>
      </div>
    </header>
  );
}
