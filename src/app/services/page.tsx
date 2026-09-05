import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { Service } from '@/types/database';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { ServicesCatalog } from '@/components/public/services-catalog';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: "Katalog Layanan Wisata & Lifestyle Bali | Do'amandeh",
  description:
    "Pilihan lengkap aktivitas dan fasilitas wisata Do'amandeh: Sewa Motor & Mobil matic, Tattoo Studio higienis, Villa Private Pool, Paket Tour Bali, dan Surfing Lesson.",
  openGraph: {
    title: "Katalog Layanan | Do'amandeh Tours & Travel Bali",
    description:
      'Pesan paket tour, rental kendaraan, villa estetik, tato steril, dan kelas selancar di Bali tanpa ribet.',
  },
};

const DEFAULT_FALLBACK_SERVICES: Service[] = [
  {
    id: 'travel-default',
    category: 'travel',
    title: 'Paket One Day Tour Nusa Penida',
    description: 'Jelajahi keindahan Kelingking Beach, Broken Beach, dan Crystal Bay seharian penuh dengan driver lokal berpengalaman.',
    price: 500000,
    unit: 'orang',
    duration: '10 Jam',
    image_url: '/assets/service-travel.jpg',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'vehicle-default',
    category: 'vehicle-rental',
    title: 'Sewa Motor Matic Yamaha NMAX 155cc',
    description: 'Motor matic nyaman, bertenaga, helm bersih & jas hujan disertakan. Gratis antar-jemput ke villa area Canggu & Seminyak.',
    price: 120000,
    unit: 'hari',
    duration: '24 Jam',
    image_url: '/assets/service-vehicle.jpg',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'villa-default',
    category: 'villa',
    title: 'Tropical Private Pool Villa Canggu',
    description: 'Villa 2 kamar tidur dengan kolam renang pribadi, dapur lengkap, WiFi kencang, dan housekeeping harian.',
    price: 1500000,
    unit: 'malam',
    duration: 'Check-in 14:00',
    image_url: '/assets/service-villa.jpg',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tattoo-default',
    category: 'tattoo',
    title: 'Custom Fineline & Realism Tattoo',
    description: 'Studio bersertifikasi medis, jarum sekali pakai baru dibuka di depan klien, tinta standar internasional.',
    price: 350000,
    unit: 'desain',
    duration: '2-4 Jam',
    image_url: '/assets/service-tattoo.jpg',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'surfing-default',
    category: 'surfing-lesson',
    title: 'Private Surfing Lesson Pemula (1-on-1)',
    description: 'Instruktur bersertifikat sabar mengajari dasar meluncur hingga bisa berdiri di atas ombak pantai Kuta / Batu Bolong.',
    price: 350000,
    unit: 'sesi',
    duration: '2 Jam',
    image_url: '/assets/service-surfing.png',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default async function ServicesPage() {
  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  let services: Service[] = DEFAULT_FALLBACK_SERVICES;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      services = data as Service[];
    }
  } catch {
    // fallback to DEFAULT_FALLBACK_SERVICES
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-sun selection:text-ink">
      <PublicHeader
        whatsappNumber={siteSettings.contact_whatsapp}
        brandName={siteSettings.brand_name}
        brandTagline={siteSettings.brand_tagline}
      />

      <main className="flex-1 py-8 sm:py-12 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
        {/* Breadcrumb (shadcn) */}
        <div className="pb-6">
          <Breadcrumb>
            <BreadcrumbList className="text-xs uppercase tracking-widest font-mono text-ink/60">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-ink transition-colors">
                  Beranda
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-ink/40">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-ink font-medium">
                  Services
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ServicesCatalog
            services={services}
            whatsappNumber={siteSettings.contact_whatsapp}
            settings={siteSettings}
          />
        </Suspense>
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
