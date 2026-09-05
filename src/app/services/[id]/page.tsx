import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Service, ServiceCategory } from '@/types/database';
import { getServiceImageUrl, formatRupiah } from '@/lib/constants';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { BookingForm } from '@/components/public/booking-form';
import { ToastProvider } from '@/components/public/toast';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  ArrowUpRight,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Compass,
  AlertCircle,
} from 'lucide-react';

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_META: Record<
  ServiceCategory,
  { label: string; tag: string; defaultMeetingPoint: string; galleryImages: [string, string] }
> = {
  'vehicle-rental': {
    label: 'Sewa Kendaraan',
    tag: '// SEWA KENDARAAN',
    defaultMeetingPoint: 'Antar-jemput gratis ke Villa / Hotel area Canggu, Seminyak, Kerobokan & Bandara Ngurah Rai',
    galleryImages: ['/assets/service-vehicle.jpg', '/assets/hero-bali.svg'],
  },
  tattoo: {
    label: 'Tato Studio',
    tag: '// TATO STUDIO',
    defaultMeetingPoint: "Studio Do'amandeh Canggu, Jl. Pantai Batu Bolong, Badung, Bali",
    galleryImages: ['/assets/service-tattoo.jpg', '/assets/testimonial-tattoo.svg'],
  },
  villa: {
    label: 'Villa Stay',
    tag: '// VILLA & STAY',
    defaultMeetingPoint: 'Private Villa Complex Canggu / Pererenan (Alamat & pinpoint dikirim via WhatsApp saat konfirmasi)',
    galleryImages: ['/assets/service-villa.jpg', '/assets/hero-bali.svg'],
  },
  travel: {
    label: 'Tour & Trip',
    tag: '// PAKET TOUR',
    defaultMeetingPoint: 'Lobby Hotel / Villa penjemputan seluruh area Bali Selatan (Kuta, Seminyak, Canggu, Sanur, Ubud)',
    galleryImages: ['/assets/service-travel.jpg', '/assets/testimonial-tour.svg'],
  },
  'surfing-lesson': {
    label: 'Surfing Lesson',
    tag: '// SURFING LESSON',
    defaultMeetingPoint: "Do'amandeh Surf Camp, Pantai Batu Bolong / Pantai Berawa Canggu",
    galleryImages: ['/assets/service-surfing.png', '/assets/hero-bali.svg'],
  },
};

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from('services')
      .select('title, description')
      .eq('id', id)
      .single();

    if (!service) {
      return {
        title: "Layanan Tidak Ditemukan | Do'amandeh",
      };
    }

    return {
      title: `${service.title} | Do'amandeh Tours & Travel Bali`,
      description:
        service.description ||
        "Pesan layanan wisata & lifestyle Bali online bersama Do'amandeh Tours and Travel.",
      openGraph: {
        title: `${service.title} | Do'amandeh Bali`,
        description: service.description || undefined,
      },
    };
  } catch {
    return {
      title: "Katalog Layanan | Do'amandeh Bali",
    };
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;

  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  let service: Service | null = null;
  let relatedServices: Service[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      service = data as Service;

      const { data: relatedData } = await supabase
        .from('services')
        .select('*')
        .eq('category', service.category)
        .neq('id', id)
        .eq('is_active', true)
        .limit(4);

      if (relatedData) {
        relatedServices = relatedData as Service[];
      }
    }
  } catch {
    // Database connection fallback
  }

  if (!service) {
    notFound();
  }

  const categoryMeta = CATEGORY_META[service.category] || {
    label: service.category,
    tag: `// ${service.category.toUpperCase()}`,
    defaultMeetingPoint: "Konfirmasi via WhatsApp tim Do'amandeh",
    galleryImages: ['/assets/service-travel.jpg', '/assets/hero-bali.svg'],
  };

  const cleanWa = (siteSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waDirectUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Halo Do'amandeh, saya ingin konsultasi langsung untuk layanan: ${service.title}`
  )}`;

  const mainImageUrl = getServiceImageUrl(service);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-sun selection:text-ink">
      <PublicHeader
        whatsappNumber={siteSettings.contact_whatsapp}
        brandName={siteSettings.brand_name}
        brandTagline={siteSettings.brand_tagline}
      />

      <main className="flex-1 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 w-full">
        {/* 1. BREADCRUMB (shadcn) DI ATAS */}
        <div className="pb-8">
          <Breadcrumb>
            <BreadcrumbList className="text-xs uppercase tracking-widest font-mono text-ink/60">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-ink transition-colors">
                  Beranda
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-ink/40">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/services?category=${service.category}`}
                  className="hover:text-ink transition-colors"
                >
                  {categoryMeta.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-ink/40">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-ink font-medium truncate max-w-xs sm:max-w-md">
                  {service.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* 2. HEADER SPLIT 12 KOLOM (DESIGN.md v2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-line items-start">
          {/* col-8: tag category + judul besar + deskripsi */}
          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-3">
              {categoryMeta.tag}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-ink leading-[1.05] mb-5">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-ink/80 font-light leading-relaxed max-w-2xl">
              {service.description ||
                "Layanan wisata berkualitas tinggi dari Do'amandeh Tours & Travel yang disiapkan dengan standar kepuasan, kebersihan, dan kenyamanan terbaik di Bali."}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Badge
                variant="outline"
                className="rounded-none border-line bg-foam text-ink text-[11px] uppercase tracking-widest font-mono py-1 px-3"
              >
                {categoryMeta.label}
              </Badge>
              {service.duration && (
                <span className="text-xs text-ink/70 font-mono flex items-center gap-1.5">
                  <Clock className="size-3.5 text-ocean" strokeWidth={1.5} />
                  {service.duration}
                </span>
              )}
              {service.is_active ? (
                <span className="text-xs text-ocean font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" strokeWidth={1.5} />
                  Unit Siap Dipesan
                </span>
              ) : (
                <span className="text-xs text-red-600 font-mono flex items-center gap-1.5">
                  <AlertCircle className="size-3.5" strokeWidth={1.5} />
                  Ketersediaan Terbatas
                </span>
              )}
            </div>
          </div>

          {/* col-4: Card sticky (border-line, rounded-none, shadow-none) */}
          <div className="lg:col-span-4">
            <Card className="border border-line rounded-none shadow-none bg-foam p-6 lg:p-7 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-ink/50 block">
                  FROM
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-medium text-ink font-mono tracking-tight">
                    {formatRupiah(service.price)}
                  </span>
                  {service.unit && (
                    <span className="text-xs text-ink/60 font-light">
                      /{service.unit.replace(/^per\s+/i, '')}
                    </span>
                  )}
                </div>
              </div>

              <Separator className="bg-line" />

              <div className="space-y-2.5 pt-1">
                <a
                  href="#booking-section"
                  className="w-full block text-center bg-ink text-paper hover:bg-ocean transition-colors font-medium uppercase tracking-widest text-xs py-3.5 px-4 rounded-none border-0"
                >
                  Pesan Sekarang
                </a>
                <a
                  href={waDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-line bg-paper text-ink hover:bg-sun hover:border-line transition-colors font-medium uppercase tracking-widest text-xs py-3.5 px-4 rounded-none"
                >
                  <Phone className="size-3.5" strokeWidth={1.5} />
                  <span>WhatsApp Tanya Dulu</span>
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* 3. GALERI: GRID 12 (DESIGN.md v2)
            Foto utama col-span-8, 2 foto col-span-4 stack.
            Semua foto border border-line, rounded-none, AspectRatio 4/3 & 1/1. */}
        <div className="py-10 border-b border-line">
          <p className="text-[10px] uppercase tracking-widest font-mono text-ocean mb-4">
            // DOKUMENTASI VISUAL
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Foto Utama col-span-8 */}
            <div className="lg:col-span-8">
              <AspectRatio ratio={16 / 10} className="border border-line rounded-none overflow-hidden relative bg-foam">
                <Image
                  src={mainImageUrl}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </AspectRatio>
            </div>

            {/* 2 Foto col-span-4 stack */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="w-full">
                <AspectRatio ratio={16 / 10} className="border border-line rounded-none overflow-hidden relative bg-foam">
                  <Image
                    src={categoryMeta.galleryImages[0]}
                    alt={`${service.title} preview 1`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
              <div className="w-full">
                <AspectRatio ratio={16 / 10} className="border border-line rounded-none overflow-hidden relative bg-foam">
                  <Image
                    src={categoryMeta.galleryImages[1]}
                    alt={`${service.title} preview 2`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>

        {/* 4. KONTEN 2 KOLOM (DESIGN.md v2)
            Kiri: section "Deskripsi / Termasuk / Durasi / Meeting point" dipisah Separator
            Kanan: Card form booking sticky */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 py-12 items-start" id="booking-section">
          {/* Kolom Kiri: Detail & Informasi Section */}
          <div className="lg:col-span-7 space-y-10">
            {/* 4.1 Deskripsi */}
            <div>
              <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-2">
                // DESKRIPSI LAYANAN
              </p>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-4">
                Tentang Aktivitas / Fasilitas Ini
              </h2>
              <p className="text-sm sm:text-base text-ink/80 font-light leading-relaxed whitespace-pre-line">
                {service.description ||
                  'Layanan kami dipersiapkan untuk memastikan Anda mendapatkan pengalaman liburan terbaik tanpa rasa khawatir. Seluruh perlengkapan dicek berkala dan dipandu oleh staf ramah berwawasan lokal Bali.'}
              </p>
            </div>

            <Separator className="bg-line" />

            {/* 4.2 Termasuk & Keuntungan */}
            <div>
              <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-2">
                // FASILITAS &amp; JAMINAN
              </p>
              <h2 className="text-2xl font-medium tracking-tight text-ink mb-4">
                Yang Anda Dapatkan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-line p-3.5 bg-foam flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-ocean shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-ink font-light">Unit / Fasilitas terawat prima dengan inspeksi berkala</span>
                </div>
                <div className="border border-line p-3.5 bg-foam flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-ocean shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-ink font-light">Bantuan &amp; pendampingan operasional lokal 24/7</span>
                </div>
                <div className="border border-line p-3.5 bg-foam flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-ocean shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-ink font-light">Transparansi harga tanpa biaya tersembunyi</span>
                </div>
                <div className="border border-line p-3.5 bg-foam flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-ocean shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-ink font-light">Konfirmasi dan koordinasi langsung via WhatsApp</span>
                </div>
              </div>
            </div>

            <Separator className="bg-line" />

            {/* 4.3 Durasi & Jadwal */}
            <div>
              <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-2">
                // DURASI &amp; WAKTU
              </p>
              <h2 className="text-2xl font-medium tracking-tight text-ink mb-4">
                Informasi Waktu Pelaksanaan
              </h2>
              <div className="border border-line p-5 bg-foam flex items-start gap-3">
                <Clock className="size-4 text-ocean shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-xs text-ink leading-relaxed">
                  <p className="font-medium text-ink mb-1">
                    Durasi Standar: {service.duration || 'Fleksibel per hari / sesi'}
                  </p>
                  <p className="text-ink/75 font-light">
                    Jadwal dapat disesuaikan dengan rencana perjalanan Anda. Tim kami siap mengatur penyesuaian jam mulai untuk kenyamanan maksimal.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-line" />

            {/* 4.4 Titik Kumpul / Meeting Point */}
            <div>
              <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-2">
                // TITIK TEMU &amp; LOKASI
              </p>
              <h2 className="text-2xl font-medium tracking-tight text-ink mb-4">
                Meeting Point &amp; Area Layanan
              </h2>
              <div className="border border-line p-5 bg-foam flex items-start gap-3">
                <MapPin className="size-4 text-ocean shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-xs text-ink leading-relaxed">
                  <p className="font-medium text-ink mb-1">
                    Area Operasional Do'amandeh Bali
                  </p>
                  <p className="text-ink/75 font-light">
                    {categoryMeta.defaultMeetingPoint}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Card Form Booking Sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ToastProvider>
              <BookingForm service={service} />
            </ToastProvider>
          </div>
        </div>

        {/* 5. RELATED SERVICES: ROW HORIZONTAL KECIL (FOTO + NAMA + HARGA) (DESIGN.md v2)
            Border-t/b border-line, BUKAN card grid. */}
        {relatedServices.length > 0 && (
          <div className="pt-12 pb-8 border-t border-line">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-mono text-ocean mb-1">
                  // LAYANAN TERKAIT
                </p>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                  Pilihan Lain di Kategori {categoryMeta.label}
                </h3>
              </div>
              <Link
                href={`/services?category=${service.category}`}
                className="text-xs uppercase tracking-widest font-mono text-ocean hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="border-t border-b border-line divide-y divide-line">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/services/${rel.id}`}
                  className="group flex items-center justify-between gap-4 py-4 px-3 sm:px-4 hover:bg-sun transition-colors duration-150"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-14 relative border border-line overflow-hidden rounded-none bg-foam shrink-0">
                      <Image
                        src={getServiceImageUrl(rel)}
                        alt={rel.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-ink tracking-tight group-hover:text-ink truncate">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink/50 block mt-0.5">
                        {rel.duration ? `// ${rel.duration}` : '// Bali Experience'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-ink/40 block font-mono">
                        FROM
                      </span>
                      <span className="text-sm sm:text-base font-medium text-ink font-mono">
                        {formatRupiah(rel.price)}
                      </span>
                    </div>
                    <ArrowUpRight
                      className="size-4 text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-transform"
                      strokeWidth={1.5}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
