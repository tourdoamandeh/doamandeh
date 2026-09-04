import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Service, ServiceCategory } from '@/types/database';
import { getServiceImageUrl } from '@/lib/constants';
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
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES: Record<
  ServiceCategory,
  {
    num: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    highlights: string[];
    bgColor: string;
  }
> = {
  'vehicle-rental': {
    num: '01',
    label: 'Sewa Kendaraan',
    icon: Car,
    title: 'Sewa Kendaraan Motor & Mobil di Bali',
    description:
      'Layanan sewa kendaraan motor matic dan mobil pribadi dengan kondisi prima, bersih, dan siap antar ke lokasi penginapan atau bandara.',
    highlights: ['Unit Terawat & Servis Rutin', 'Helm & Jas Hujan Gratis', 'Antar Jemput Bandara/Hotel', 'Proses Cepat Tanpa Ribet'],
    bgColor: 'bg-lightblue',
  },
  'tattoo': {
    num: '02',
    label: 'Tato Studio',
    icon: Palette,
    title: 'Professional Tattoo Studio Bali',
    description:
      'Layanan pembuatan tato custom oleh tattoo artist berpengalaman. Mengutamakan standar higienis internasional, jarum single-use steril, dan tinta premium.',
    highlights: ['Jarum & Alat 100% Steril', 'Desain Custom Bebas Konsultasi', 'Artist Berpengalaman', 'Aftercare Guidance Lengkap'],
    bgColor: 'bg-peach',
  },
  'villa': {
    num: '03',
    label: 'Villa & Stay',
    icon: Home,
    title: 'Sewa Villa Eksklusif & Nyaman',
    description:
      'Pilihan villa estetik, private pool, dan fasilitas lengkap untuk liburan keluarga, pasangan, maupun teman di area strategis Bali.',
    highlights: ['Private Pool & WiFi Cepat', 'Suasana Tenang & Nyaman', 'Dekat Pusat Wisata & Pantai', 'Layanan Housekeeping'],
    bgColor: 'bg-yellow',
  },
  'travel': {
    num: '04',
    label: 'Paket Travel',
    icon: Compass,
    title: 'Paket Tour Wisata Bali Terfavorit',
    description:
      'Paket perjalanan wisata terencana untuk menjelajahi keindahan alam, budaya, dan spot foto terhits di Bali didampingi driver/guide ramah.',
    highlights: ['Mobil Nyaman Ber-AC', 'Driver Ramah & Berpengalaman', 'Itinerary Fleksibel', 'Bebas Pilih Destinasi'],
    bgColor: 'bg-softpink',
  },
  'surfing-lesson': {
    num: '05',
    label: 'Surfing Lesson',
    icon: Waves,
    title: 'Kelas Surfing Pemula & Intermediate',
    description:
      'Belajar selancar ombak di pantai Bali bersama instruktur ramah dan bersertifikat. Dijamin bisa berdiri di atas papan selancar di sesi pertama!',
    highlights: ['Papan Surfing & Rashguard Disediakan', 'Instruktur Sabar & Bersertifikat', 'Spot Pantai Ramah Pemula', 'Foto & Video Sesi Surfing'],
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

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug as ServiceCategory];

  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan',
    };
  }

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: `${category.title} | Doamandeh Bali`,
      description: category.description,
    },
  };
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
    <div className="min-h-screen flex flex-col bg-tissue text-black selection:bg-peach selection:text-black">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Editorial Category Navigation Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none font-sans">
          {(Object.keys(CATEGORIES) as ServiceCategory[]).map((key) => {
            const cat = CATEGORIES[key];
            const Icon = cat.icon;
            const isActive = key === categorySlug;
            return (
              <Link
                key={key}
                href={`/category/${key}`}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg whitespace-nowrap transition-all shadow-sm ${isActive
                    ? 'bg-black text-tissue'
                    : 'bg-tissue text-black hover:bg-peach'
                  }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-tissue' : 'text-black'}`} />
                <span>{cat.label}</span>
                <span className="text-xs opacity-60 italic font-sans">({cat.num})</span>
              </Link>
            );
          })}
        </div>

        {/* Category Editorial Banner Card */}
        <section className={`relative overflow-hidden rounded-[36px] border-none ${currentCategory.bgColor} p-8 sm:p-14 mb-12 shadow-sm`}>
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center justify-between gap-4 mb-4 font-sans">
              <span className="text-sm bg-tissue text-black px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm">
                <CategoryIcon className="h-4 w-4 text-black" />
                <span>Kategori {currentCategory.num}</span>
              </span>
              <span className="italic text-3xl text-black/40">
                {currentCategory.num} / 05
              </span>
            </div>

            <h1 className="font-sans text-4xl sm:text-6xl text-black leading-tight mb-4">
              {currentCategory.title}
            </h1>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed font-sans font-normal mb-8">
              {currentCategory.description}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-6 border-t border-black/15 font-sans">
              {currentCategory.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-black">
                  <CheckCircle2 className="h-4 w-4 text-black shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Database Query Error */}
        {errorMessage && (
          <div className="mb-8 p-5 rounded-[24px] bg-yellow border-none text-black flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-sans text-black">Gagal Mengambil Data Layanan</h3>
              <p className="text-xs text-black/80 mt-0.5 font-sans">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Services List / Empty State */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-sans text-3xl sm:text-4xl text-black">Pilihan Paket & Layanan</h2>
              <p className="text-xs text-black/70 mt-1 font-sans">Pilih layanan untuk melihat detail dan melakukan reservasi</p>
            </div>
            <span className="font-sans text-base text-black bg-yellow px-4 py-1.5 rounded-full shadow-sm">
              {services.length} Paket Tersedia
            </span>
          </div>

          {services.length === 0 && !errorMessage ? (
            <div className="text-center py-20 px-6 rounded-[32px] border-none bg-[#F9F9FB] shadow-sm">
              <CategoryIcon className="h-12 w-12 text-black mx-auto mb-4 opacity-50" />
              <h3 className="font-sans text-2xl text-black mb-2">Belum Ada Layanan Tersedia</h3>
              <p className="text-xs text-black/70 max-w-sm mx-auto mb-6 font-sans">
                Saat ini belum ada paket layanan aktif pada kategori ini. Silakan hubungi kami via WhatsApp untuk permintaan khusus.
              </p>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-sans text-lg text-tissue hover:bg-black/90 transition-colors shadow-sm"
              >
                <span>Tanya Ketersediaan via WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border-none bg-tissue hover:-translate-y-1 transition-all duration-200 shadow-md"
                >
                  {/* Card Image Header */}
                  <div className={`relative h-56 w-full ${currentCategory.bgColor} p-3 overflow-hidden border-none`}>
                    <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getServiceImageUrl(service)}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="absolute top-5 left-5">
                      <span className="font-sans text-xs bg-tissue text-black px-3.5 py-1 rounded-full shadow-sm">
                        Tersedia
                      </span>
                    </div>

                    {service.duration && (
                      <div className="absolute top-5 right-5">
                        <span className="font-sans text-xs text-black bg-tissue px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Clock className="h-3 w-3 text-black" />
                          {service.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="font-sans text-2xl text-black group-hover:underline mb-2">
                        <Link href={`/services/${service.id}`}>{service.title}</Link>
                      </h3>
                      <p className="text-xs text-black/75 leading-relaxed font-sans line-clamp-3">
                        {service.description || 'Layanan berkualitas prima dari Doamandeh.'}
                      </p>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-5 border-t border-gray-100 space-y-4 font-sans">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs italic text-black/60 block mb-0.5">
                            Harga
                          </span>
                          <span className="font-sans text-3xl font-normal text-black">
                            {formatRupiah(service.price)}
                          </span>
                        </div>
                        {service.unit && (
                          <span className="text-xs text-black bg-yellow px-3.5 py-1 rounded-full shadow-sm">
                            /{service.unit.replace(/^per\s+/i, '')}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/services/${service.id}`}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-black text-tissue text-lg py-3.5 px-6 hover:bg-black/90 transition-all shadow-sm"
                      >
                        <span>Detail & Booking</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
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
