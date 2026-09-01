import { createClient } from '@/lib/supabase/server';
import { Service, ServiceCategory } from '@/types/database';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import Link from 'next/link';
import {
  Car,
  Palette,
  Home as HomeIcon,
  Compass,
  Waves,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Phone,
  Star,
  Zap,
  Award,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES: Record<
  ServiceCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  'vehicle-rental': {
    label: 'Sewa Kendaraan',
    icon: Car,
    description: 'Motor & Mobil matic terawat siap keliling Bali',
  },
  'tattoo': {
    label: 'Tato Studio',
    icon: Palette,
    description: 'Custom tattoo higienis & artist profesional',
  },
  'villa': {
    label: 'Villa & Stay',
    icon: HomeIcon,
    description: 'Villa eksklusif private pool di lokasi strategis',
  },
  'travel': {
    label: 'Paket Travel',
    icon: Compass,
    description: 'Tour wisata seru explore destinasi terbaik Bali',
  },
  'surfing-lesson': {
    label: 'Surfing Lesson',
    icon: Waves,
    description: 'Kelas selancar pemula & intermediate bersertifikat',
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  let services: Service[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      errorMessage = error.message;
    } else if (data) {
      services = data as Service[];
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Gagal menghubungi database Supabase.';
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-zinc-900 bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 mb-6 shadow-md shadow-amber-500/5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Travel & Lifestyle Agent Terpercaya di Bali</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
                Nikmati Liburan Terbaik Bersama{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Doamandeh
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
                Solusi lengkap kebutuhan aktivitas liburan Anda di Bali: Sewa Motor & Mobil, Tato Artistik, Villa Nyaman, Paket Wisata Tour, hingga Kelas Surfing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#services-section"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 py-3.5 px-8 text-sm font-bold text-black transition-all shadow-xl shadow-amber-500/20"
                >
                  <span>Jelajahi Layanan</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20Doamandeh%20Tours%20and%20Travel,%20saya%20ingin%20konsultasi%20layanan%20wisata."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 py-3.5 px-6 text-sm font-semibold text-zinc-200 transition-colors"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>Konsultasi WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Category Cards Carousel / Grid */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {(Object.keys(CATEGORIES) as ServiceCategory[]).map((key) => {
                const cat = CATEGORIES[key];
                const Icon = cat.icon;
                return (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 hover:border-amber-500/40 transition-all duration-200"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 line-clamp-1 mt-1">
                      {cat.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Database Query Error Banner */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold text-red-300">Gagal Mengambil Data Supabase</h3>
                <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Services Showcase Section */}
        <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-amber-400 border border-zinc-800 mb-3">
                <Sparkles className="h-3 w-3" />
                <span>Katalog Layanan Pilihan</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Pilih Aktivitas & Layanan Anda
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Semua layanan langsung terhubung dan siap dipesan secara online.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                {services.length} Layanan Aktif
              </span>
            </div>
          </div>

          {/* Services Grid */}
          {services.length === 0 && !errorMessage ? (
            <div className="text-center py-20 px-6 rounded-3xl border border-zinc-800 bg-zinc-900/40">
              <p className="text-zinc-400 text-sm">Belum ada layanan aktif di database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const categoryConfig = CATEGORIES[service.category] || {
                  label: service.category,
                  icon: Compass,
                  description: '',
                };
                const CategoryIcon = categoryConfig.icon;

                return (
                  <article
                    key={service.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800/90 bg-zinc-900/70 p-6 sm:p-7 hover:border-amber-500/40 hover:bg-zinc-900 transition-all duration-200 hover:shadow-2xl hover:shadow-black/60"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <Link
                          href={`/category/${service.category}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 hover:text-amber-400 transition-colors"
                        >
                          <CategoryIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>{categoryConfig.label}</span>
                        </Link>

                        {service.is_active && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Siap Booking
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2.5">
                        <Link href={`/services/${service.id}`}>{service.title}</Link>
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                        {service.description || 'Layanan unggulan dari Doamandeh Tours and Travel.'}
                      </p>
                    </div>

                    {/* Bottom Meta & Button */}
                    <div className="pt-5 border-t border-zinc-800/80 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 block mb-0.5">Mulai dari</span>
                          <span className="text-xl sm:text-2xl font-black text-white">
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
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 group-hover:bg-amber-400 py-3.5 px-4 text-xs font-bold text-black transition-all shadow-md shadow-amber-500/10"
                      >
                        <span>Pesan Layanan</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Why Choose Doamandeh Section */}
        <section className="border-t border-zinc-900 bg-zinc-900/30 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                Keunggulan Kami
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Mengapa Memilih Doamandeh Tours & Travel?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Pelayanan Berpengalaman</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Didukung staf dan instruktur profesional yang berdedikasi memberikan pengalaman terbaik.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Unit Prima & Steril</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Kendaraan rutin diservis, studio tato higienis standar tinggi, dan villa terawat bersih.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Konfirmasi Cepat</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Proses booking simpel dan tim kami langsung memproses konfirmasi jadwal via WhatsApp.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Harga Transparan</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tarif tertera jelas tanpa biaya tersembunyi, jaminan penawaran terbaik untuk liburan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              Siap Memulai Liburan Impian di Bali?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8">
              Pesan sekarang melalui website atau hubungi tim customer service kami untuk permintaan kustom.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Doamandeh,%20saya%20ingin%20booking%20layanan%20wisata."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs font-bold text-black transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Phone className="h-4 w-4" />
                <span>Hubungi via WhatsApp</span>
              </a>
              <a
                href="#services-section"
                className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-6 py-3.5 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <span>Lihat Semua Layanan</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
