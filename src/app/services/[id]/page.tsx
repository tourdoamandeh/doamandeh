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
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const CATEGORY_INFO: Record<
  ServiceCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  'vehicle-rental': {
    label: 'Sewa Kendaraan',
    icon: Car,
    description: 'Sewa motor & mobil bersih, terawat, dan siap pakai untuk keliling Bali.',
  },
  'tattoo': {
    label: 'Tato Studio',
    icon: Palette,
    description: 'Studio tato steril, higienis, dan dikerjakan oleh artist profesional.',
  },
  'villa': {
    label: 'Villa & Stay',
    icon: Home,
    description: 'Akomodasi villa eksklusif dengan kenyamanan maksimal untuk liburan Anda.',
  },
  'travel': {
    label: 'Paket Travel',
    icon: Compass,
    description: 'Paket perjalanan wisata terarah mengelilingi spot terbaik di Bali.',
  },
  'surfing-lesson': {
    label: 'Surfing Lesson',
    icon: Waves,
    description: 'Belajar selancar aman dan seru dipandu instruktur bersertifikat.',
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
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Accessible Breadcrumb & Back */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400 mb-8 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/category/${service.category}`}
            className="hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
          >
            {categoryInfo.label}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-200 font-semibold truncate max-w-xs" aria-current="page">
            {service.title}
          </span>
        </nav>

        {/* Inactive Notice Banner */}
        {!service.is_active && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-xs font-semibold text-amber-300">Layanan Sedang Tidak Aktif</h3>
              <p className="text-xs text-amber-400/90 mt-0.5">
                Layanan ini sedang dalam pembaruan ketersediaan. Anda tetap dapat bertanya ketersediaan via WhatsApp kami.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Service Details */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              {/* Category Badge & Duration */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`/category/${service.category}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-amber-400 hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{categoryInfo.label}</span>
                </Link>

                {service.duration && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                    <span>{service.duration}</span>
                  </span>
                )}

                {service.is_active && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Siap Dipesan
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {service.title}
              </h1>

              {/* Price Banner */}
              <div className="inline-flex items-baseline gap-2 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 mb-6">
                <span className="text-xs text-zinc-400 font-medium">Harga Layanan:</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400">
                  {formatRupiah(service.price)}
                </span>
                {service.unit && (
                  <span className="text-xs font-medium text-zinc-400">
                    /{service.unit.replace(/^per\s+/i, '')}
                  </span>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Deskripsi & Ketentuan Layanan
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {service.description ||
                  'Layanan berkualitas tinggi dari Doamandeh Tours and Travel yang siap melengkapi kenyamanan dan keseruan aktivitas Anda di Bali.'}
              </p>

              {/* Value Inclusions */}
              <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>Pelayanan ramah & profesional</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>Jaminan kualitas & kenyamanan</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>Konfirmasi pemesanan cepat via WA</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>Harga transparan tanpa biaya tersembunyi</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Help Banner */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  Ada Pertanyaan Khusus?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
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
                className="shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Chat WhatsApp
              </a>
            </div>

            {/* Related Services in Category */}
            {relatedServices.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="text-sm font-bold text-white">
                  Layanan Lainnya di Kategori {categoryInfo.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/services/${rel.id}`}
                      className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-amber-500/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <h4 className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] font-bold text-amber-400">
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
