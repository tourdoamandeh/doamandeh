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
  '/admin': 'Dashboard Overview',
  '/admin/services': 'Katalog Layanan',
  '/admin/bookings': 'Daftar Pemesanan',
  '/admin/settings': 'Pengaturan Website & CMS',
};

export function AdminHeader() {
  const pathname = usePathname();
  const currentTitle = PATH_TITLES[pathname] || 'Operasional CMS';

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b-2 border-brown bg-softwhite px-4 sm:px-6 transition-[width,height] ease-linear font-sans">
      <div className="flex items-center gap-2.5">
        <SidebarTrigger className="-ml-1 rounded-none text-brown hover:bg-brown/15 p-1.5 transition-colors cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-brown/30" />
        <Breadcrumb>
          <BreadcrumbList className="text-[11px] uppercase tracking-wider font-semibold">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="/admin" className="text-brown/70 hover:text-brown">
                Doamandeh Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:inline-flex text-brown/40" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brown font-bold tracking-widest">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-brown hover:text-black border-b-2 border-brown/30 pb-0.5 hover:border-black transition-colors"
        >
          <span className="hidden sm:inline">Website Publik</span>
          <ExternalLink className="h-3.5 w-3.5 stroke-[2]" />
        </Link>
      </div>
    </header>
  );
}
