import { createClient } from '@/lib/supabase/server';
import { Service, ServiceCategory } from '@/types/database';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Car,
  Palette,
  Home,
  Compass,
  Waves,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES: Record<
  ServiceCategory,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    highlights: string[];
  }
> = {
  'vehicle-rental': {
    label: 'Sewa Kendaraan',
    icon: Car,
    title: 'Sewa Kendaraan Motor & Mobil di Bali',
    description:
      'Layanan sewa kendaraan motor matic dan mobil pribadi dengan kondisi prima, bersih, dan siap antar ke lokasi penginapan atau bandara.',
    highlights: ['Unit Terawat & Servis Rutin', 'Helm & Jas Hujan Gratis', 'Antar Jemput Bandara/Hotel', 'Proses Cepat Tanpa Ribet'],
  },
  'tattoo': {
    label: 'Tato Studio',
    icon: Palette,
    title: 'Professional Tattoo Studio Bali',
    description:
      'Layanan pembuatan tato custom oleh tattoo artist berpengalaman. Mengutamakan standar higienis internasional, jarum single-use steril, dan tinta premium.',
    highlights: ['Jarum & Alat 100% Steril', 'Desain Custom Bebas Konsultasi', 'Artist Berpengalaman', 'Aftercare Guidance Lengkap'],
  },
  'villa': {
    label: 'Villa & Stay',
    icon: Home,
    title: 'Sewa Villa Eksklusif & Nyaman',
    description:
      'Pilihan villa estetik, private pool, dan fasilitas lengkap untuk liburan keluarga, pasangan, maupun teman di area strategis Bali.',
    highlights: ['Private Pool & WiFi Cepat', 'Suasana Tenang & Nyaman', 'Dekat Pusat Wisata & Pantai', 'Layanan Housekeeping'],
  },
  'travel': {
    label: 'Paket Travel',
    icon: Compass,
    title: 'Paket Tour Wisata Bali Terfavorit',
    description:
      'Paket perjalanan wisata terencana untuk menjelajahi keindahan alam, budaya, dan spot foto terhits di Bali didampingi driver/guide ramah.',
    highlights: ['Mobil Nyaman Ber-AC', 'Driver Ramah & Berpengalaman', 'Itinerary Fleksibel', 'Bebas Pilih Destinasi'],
  },
  'surfing-lesson': {
    label: 'Surfing Lesson',
    icon: Waves,
    title: 'Kelas Surfing Pemula & Intermediate',
    description:
      'Belajar selancar ombak di pantai Bali bersama instruktur ramah dan bersertifikat. Dijamin bisa berdiri di atas papan selancar di sesi pertama!',
    highlights: ['Papan Surfing & Rashguard Disediakan', 'Instruktur Sabar & Bersertifikat', 'Spot Pantai Ramah Pemula', 'Foto & Video Sesi Surfing'],
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!CATEGORIES[slug as ServiceCategory]) {
    notFound();
  }

  const categorySlug = slug as ServiceCategory;
  const currentCategory = CATEGORIES[categorySlug];
  const CategoryIcon = currentCategory.icon;

  const supabase = await createClient();
  let services: Service[] = [];
  let errorMessage: string | null = null;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', categorySlug)
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      errorMessage = error.message;
    } else {
      services = (data as Service[]) || [];
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Gagal memuat data kategori.';
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {(Object.keys(CATEGORIES) as ServiceCategory[]).map((key) => {
            const cat = CATEGORIES[key];
            const Icon = cat.icon;
            const isActive = key === categorySlug;
            return (
              <Link
                key={key}
                href={`/category/${key}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Category Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-8 sm:p-12 mb-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-4">
              <CategoryIcon className="h-3.5 w-3.5 text-amber-400" />
              <span>Kategori: {currentCategory.label}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              {currentCategory.title}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
              {currentCategory.description}
            </p>

            {/* Category Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-zinc-800/80">
              {currentCategory.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium text-[11px]">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Database Query Error */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-red-300">Gagal Mengambil Data Layanan</h3>
              <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Services List / Empty State */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Pilihan Paket & Layanan</h2>
              <p className="text-xs text-zinc-400">Pilih layanan untuk melihat detail dan melakukan reservasi</p>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              {services.length} Paket Tersedia
            </span>
          </div>

          {services.length === 0 && !errorMessage ? (
            <div className="text-center py-20 px-6 rounded-3xl border border-zinc-800 bg-zinc-900/40">
              <CategoryIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-1">Belum Ada Layanan Tersedia</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                Saat ini belum ada paket layanan aktif pada kategori ini. Silakan hubungi kami via WhatsApp untuk permintaan khusus.
              </p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
              >
                <span>Tanya Ketersediaan via WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 hover:border-amber-500/40 hover:bg-zinc-900 transition-all duration-200 hover:shadow-2xl hover:shadow-black/60"
                >
                  <div>
                    {/* Top Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Tersedia
                      </span>
                      {service.duration && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3 text-zinc-500" />
                          {service.duration}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                      {service.description || 'Layanan berkualitas prima dari Doamandeh.'}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-zinc-800/80 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Harga</span>
                        <span className="text-xl font-black text-white">
                          {formatRupiah(service.price)}
                        </span>
                      </div>
                      {service.unit && (
                        <span className="text-xs font-medium text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-lg">
                          /{service.unit.replace(/^per\s+/i, '')}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/services/${service.id}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 py-3 px-4 text-xs font-bold text-black transition-all shadow-md shadow-amber-500/10"
                    >
                      <span>Lihat Detail & Booking</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
