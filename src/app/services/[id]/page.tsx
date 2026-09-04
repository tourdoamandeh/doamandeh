import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Service, ServiceCategory } from '@/types/database';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { BookingForm } from '@/components/public/booking-form';
import { ToastProvider } from '@/components/public/toast';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Car,
  Palette,
  Home,
  Compass,
  Waves,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const CATEGORY_INFO: Record<
  ServiceCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string; bgColor: string }
> = {
  'vehicle-rental': {
    label: 'Sewa Kendaraan',
    icon: Car,
    description: 'Sewa motor & mobil bersih, terawat, dan siap pakai untuk keliling Bali.',
    bgColor: 'bg-lightblue',
  },
  'tattoo': {
    label: 'Tato Studio',
    icon: Palette,
    description: 'Studio tato steril, higienis, dan dikerjakan oleh artist profesional.',
    bgColor: 'bg-peach',
  },
  'villa': {
    label: 'Villa & Stay',
    icon: Home,
    description: 'Akomodasi villa eksklusif dengan kenyamanan maksimal untuk liburan Anda.',
    bgColor: 'bg-yellow',
  },
  'travel': {
    label: 'Paket Travel',
    icon: Compass,
    description: 'Paket perjalanan wisata terarah mengelilingi spot terbaik di Bali.',
    bgColor: 'bg-softpink',
  },
  'surfing-lesson': {
    label: 'Surfing Lesson',
    icon: Waves,
    description: 'Belajar selancar aman dan seru dipandu instruktur bersertifikat.',
    bgColor: 'bg-lightblue',
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

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
        title: 'Layanan Tidak Ditemukan',
      };
    }

    return {
      title: `${service.title} | Doamandeh Tours & Travel`,
      description:
        service.description ||
        'Pesan layanan wisata & lifestyle Bali online bersama Doamandeh Tours and Travel.',
      openGraph: {
        title: `${service.title} | Doamandeh Bali`,
        description: service.description || undefined,
      },
    };
  } catch {
    return {
      title: 'Detail Layanan Wisata',
    };
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch service detail
  const { data: serviceData, error: serviceError } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (serviceError || !serviceData) {
    notFound();
  }

  const service = serviceData as Service;
  const categoryInfo = CATEGORY_INFO[service.category] || {
    label: service.category,
    icon: Compass,
    description: 'Layanan wisata terpercaya dari Doamandeh.',
    bgColor: 'bg-lightblue',
  };
  const CategoryIcon = categoryInfo.icon;

  // Fetch related services in the same category
  const { data: relatedData } = await supabase
    .from('services')
    .select('*')
    .eq('category', service.category)
    .neq('id', service.id)
    .eq('is_active', true)
    .limit(3);

  const relatedServices = (relatedData as Service[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-tissue text-black selection:bg-peach selection:text-black">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Accessible Breadcrumb & Back */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-base font-sans text-black/70 mb-8 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Beranda</span>
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/category/${service.category}`}
            className="hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md"
          >
            {categoryInfo.label}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-black font-sans truncate max-w-xs" aria-current="page">
            {service.title}
          </span>
        </nav>

        {/* Inactive Notice Banner */}
        {!service.is_active && (
          <div
            role="alert"
            className="mb-8 p-5 rounded-[24px] bg-yellow border-none text-black flex items-start gap-3 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-sans text-lg">Layanan Sedang Tidak Aktif</h3>
              <p className="text-xs text-black/80 mt-0.5 font-sans">
                Layanan ini sedang dalam pembaruan ketersediaan. Anda tetap dapat bertanya ketersediaan via WhatsApp kami.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Service Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Service Main Image Header */}
            {service.image_url && (
              <div className="relative h-72 sm:h-96 w-full rounded-[36px] overflow-hidden shadow-sm border-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              {/* Category Badge & Duration */}
              <div className="flex flex-wrap items-center gap-2 mb-4 font-sans">
                <Link
                  href={`/category/${service.category}`}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm bg-lightblue text-black shadow-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <CategoryIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{categoryInfo.label}</span>
                </Link>

                {service.duration && (
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm bg-yellow text-black shadow-sm">
                    <Clock className="h-3.5 w-3.5 text-black" aria-hidden="true" />
                    <span>{service.duration}</span>
                  </span>
                )}

                {service.is_active && (
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm bg-softpink text-black shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Siap Dipesan
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-sans text-4xl sm:text-6xl text-black leading-tight mb-4">
                {service.title}
              </h1>

              {/* Price Banner */}
              <div className="inline-flex items-baseline gap-3 p-5 rounded-[24px] bg-yellow shadow-sm mb-6 border-none">
                <span className="font-sans italic text-xs text-black/70">Harga Layanan:</span>
                <span className="font-sans text-3xl sm:text-4xl font-normal text-black">
                  {formatRupiah(service.price)}
                </span>
                {service.unit && (
                  <span className="font-sans text-sm text-black">
                    /{service.unit.replace(/^per\s+/i, '')}
                  </span>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-[32px] border-none bg-[#FBFBFB] p-8 sm:p-10 space-y-5 shadow-sm">
              <h2 className="font-sans text-2xl text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles className="h-5 w-5 text-black" aria-hidden="true" />
                Deskripsi & Ketentuan Layanan
              </h2>
              <p className="text-sm text-black/90 leading-relaxed whitespace-pre-line font-sans font-normal">
                {service.description ||
                  'Layanan berkualitas tinggi dari Doamandeh Tours and Travel yang siap melengkapi kenyamanan dan keseruan aktivitas Anda di Bali.'}
              </p>

              {/* Value Inclusions */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="flex items-center gap-2 text-black">
                  <CheckCircle2 className="h-4 w-4 text-black shrink-0" aria-hidden="true" />
                  <span>Pelayanan ramah & profesional</span>
                </div>
                <div className="flex items-center gap-2 text-black">
                  <CheckCircle2 className="h-4 w-4 text-black shrink-0" aria-hidden="true" />
                  <span>Jaminan kualitas & kenyamanan</span>
                </div>
                <div className="flex items-center gap-2 text-black">
                  <CheckCircle2 className="h-4 w-4 text-black shrink-0" aria-hidden="true" />
                  <span>Konfirmasi pemesanan cepat via WA</span>
                </div>
                <div className="flex items-center gap-2 text-black">
                  <CheckCircle2 className="h-4 w-4 text-black shrink-0" aria-hidden="true" />
                  <span>Harga transparan tanpa hidden fee</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Help Banner */}
            <div className="rounded-[32px] border-none bg-peach p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="font-sans text-2xl text-black flex items-center gap-2">
                  <Phone className="h-5 w-5 text-black" aria-hidden="true" />
                  Ada Pertanyaan Khusus?
                </h3>
                <p className="text-xs text-black/80 mt-1 font-sans">
                  Konsultasikan jadwal, kebutuhan khusus, atau permintaan kustom langsung dengan tim kami.
                </p>
              </div>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo Doamandeh, saya ingin bertanya tentang layanan: ${service.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat WhatsApp seputar layanan ${service.title}`}
                className="shrink-0 rounded-full bg-black text-tissue px-6 py-3 font-sans text-lg hover:bg-black/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Chat WhatsApp
              </a>
            </div>

            {/* Related Services in Category */}
            {relatedServices.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="font-sans text-2xl text-black">
                  Layanan Lainnya di Kategori {categoryInfo.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/services/${rel.id}`}
                      className="group rounded-[24px] border-none bg-tissue p-6 shadow-sm hover:bg-lightblue transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <h4 className="font-sans text-xl text-black group-hover:underline line-clamp-1 mb-1">
                        {rel.title}
                      </h4>
                      <p className="font-sans text-lg text-black">
                        {formatRupiah(rel.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Form with Toast Context */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ToastProvider>
              <BookingForm service={service} />
            </ToastProvider>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
