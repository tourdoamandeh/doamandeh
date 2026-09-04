import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import Link from 'next/link';
import {
  Users,
  MapPin,
  HeartHandshake,
  ArrowUpRight,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami | Doamandeh Tours & Travel Bali',
  description:
    'Profil resmi Doamandeh Tours and Travel: Penyedia sewa motor, mobil, studio tato higienis, villa eksklusif, paket tour Bali, dan kelas surfing.',
  openGraph: {
    title: 'Tentang Kami | Doamandeh Tours & Travel',
    description:
      'Agen wisata & lifestyle terpercaya di Bali dengan standar pelayanan ramah dan profesional.',
    type: 'website',
  },
};

export default async function AboutPage() {
  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  const cleanWa = (siteSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Doamandeh, saya ingin menanyakan informasi tentang layanan wisata Anda.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-tissue text-black selection:bg-peach selection:text-black">
      <PublicHeader whatsappNumber={siteSettings.contact_whatsapp} />

      <main className="flex-1">
        {/* About Editorial Hero */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-gray-100 bg-tissue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="font-serif italic text-sm text-black/60 bg-lightblue px-5 py-2 rounded-full inline-block mb-6 shadow-sm">
                Mengenal Lebih Dekat Doamandeh
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-black leading-tight mb-6">
                Menciptakan Momen Liburan <span className="italic font-normal underline decoration-peach">Tak Terlupakan</span> di Bali
              </h1>

              <p className="text-base sm:text-lg text-black/80 leading-relaxed max-w-2xl mx-auto mb-8 font-sans">
                {siteSettings.about_text}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 font-serif text-base">
                <div className="flex items-center gap-2 bg-yellow px-5 py-2.5 rounded-full shadow-sm">
                  <MapPin className="h-4 w-4 text-black" />
                  <span>Berbasis di Canggu, Bali</span>
                </div>
                <div className="flex items-center gap-2 bg-lightblue px-5 py-2.5 rounded-full shadow-sm">
                  <Users className="h-4 w-4 text-black" />
                  <span>Ribuan Wisatawan Puas</span>
                </div>
                <div className="flex items-center gap-2 bg-softpink px-5 py-2.5 rounded-full shadow-sm">
                  <HeartHandshake className="h-4 w-4 text-black" />
                  <span>Layanan 24/7 Respon Cepat</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles & Values Bento Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-serif italic text-sm text-black/60 block mb-2">
              Prinsip & Nilai Kami
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-black">
              Mengapa Wisatawan <span className="italic font-normal">Memilih</span> Doamandeh?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-[28px] border-none bg-lightblue p-8 space-y-4 shadow-sm hover:-translate-y-1 transition-transform">
              <span className="font-serif italic text-2xl opacity-40">01</span>
              <h3 className="font-serif text-2xl text-black">Keamanan & Higienis</h3>
              <p className="text-xs text-black/75 leading-relaxed font-sans">
                Setiap unit kendaraan diperiksa rutin, studio tato menerapkan standar jarum single-use steril, dan instruktur selancar bersertifikat resmi.
              </p>
            </div>

            <div className="rounded-[28px] border-none bg-peach p-8 space-y-4 shadow-sm hover:-translate-y-1 transition-transform">
              <span className="font-serif italic text-2xl opacity-40">02</span>
              <h3 className="font-serif text-2xl text-black">Booking Cepat</h3>
              <p className="text-xs text-black/75 leading-relaxed font-sans">
                Reservasi fleksibel langsung dari website atau WhatsApp. Bebas ribet dengan transparansi ketersediaan jadwal real-time.
              </p>
            </div>

            <div className="rounded-[28px] border-none bg-yellow p-8 space-y-4 shadow-sm hover:-translate-y-1 transition-transform">
              <span className="font-serif italic text-2xl opacity-40">03</span>
              <h3 className="font-serif text-2xl text-black">Kualitas Pelayanan</h3>
              <p className="text-xs text-black/75 leading-relaxed font-sans">
                Staf lokal yang ramah dan komunikatif siap membantu kebutuhan khusus Anda selama berlibur di Pulau Dewata.
              </p>
            </div>

            <div className="rounded-[28px] border-none bg-softpink p-8 space-y-4 shadow-sm hover:-translate-y-1 transition-transform">
              <span className="font-serif italic text-2xl opacity-40">04</span>
              <h3 className="font-serif text-2xl text-black">Harga Transparan</h3>
              <p className="text-xs text-black/75 leading-relaxed font-sans">
                Tidak ada biaya tersembunyi. Seluruh tarif tertera jelas sehingga Anda dapat merencanakan anggaran liburan dengan tenang.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Core Services Bento List */}
        <section className="border-t border-gray-100 bg-[#FBFBFB] py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-serif italic text-sm text-black/60 bg-yellow px-4 py-1.5 rounded-full inline-block">
                Ekosistem Layanan
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-black mt-3">
                5 Layanan <span className="italic font-normal">Utama</span> Doamandeh
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border-none bg-lightblue p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <span className="font-serif italic text-sm text-black/60">01 / Kategori</span>
                  <h3 className="font-serif text-3xl text-black">Sewa Kendaraan Motor & Mobil</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-sans">
                    Unit motor matic (Scoopy, NMAX, PCX) dan mobil pribadi terawat dengan fasilitas helm, jas hujan, serta gratis antar-jemput ke area hotel/bandara.
                  </p>
                </div>
                <Link
                  href="/category/vehicle-rental"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-base text-tissue hover:bg-black/90 transition-colors shadow-sm"
                >
                  <span>Lihat Kendaraan</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-[28px] border-none bg-peach p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <span className="font-serif italic text-sm text-black/60">02 / Kategori</span>
                  <h3 className="font-serif text-3xl text-black">Tattoo Studio & Artist</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-sans">
                    Studio tato modern higienis dengan peralatan single-use steril dan seniman tato berpengalaman dalam berbagai style (realism, fineline, traditional, tribal).
                  </p>
                </div>
                <Link
                  href="/category/tattoo"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-base text-tissue hover:bg-black/90 transition-colors shadow-sm"
                >
                  <span>Lihat Studio & Artist</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-[28px] border-none bg-yellow p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <span className="font-serif italic text-sm text-black/60">03 / Kategori</span>
                  <h3 className="font-serif text-3xl text-black">Villa & Vacation Stay</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-sans">
                    Akomodasi villa privat estetik lengkap dengan private pool, dapur modern, WiFi kencang, dan suasana tenang dekat pusat hiburan Canggu & Seminyak.
                  </p>
                </div>
                <Link
                  href="/category/villa"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-base text-tissue hover:bg-black/90 transition-colors shadow-sm"
                >
                  <span>Lihat Pilihan Villa</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-[28px] border-none bg-softpink p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <span className="font-serif italic text-sm text-black/60">04 / Kategori</span>
                  <h3 className="font-serif text-3xl text-black">Paket Travel & Wisata Tour</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-sans">
                    Paket wisata keliling destinasi eksotis Bali (Ubud, Uluwatu, Nusa Penida, Bedugul) lengkap dengan driver ramah dan kendaraan ber-AC yang nyaman.
                  </p>
                </div>
                <Link
                  href="/category/travel"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-base text-tissue hover:bg-black/90 transition-colors shadow-sm"
                >
                  <span>Lihat Paket Tour</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-[28px] border-none bg-lightblue p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <span className="font-serif italic text-sm text-black/60">05 / Kategori</span>
                  <h3 className="font-serif text-3xl text-black">Surfing Lesson Pemula & Lanjutan</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-sans">
                    Sekolah selancar bersertifikat dengan bimbingan 1-on-1 dari instruktur profesional. Perlengkapan surf board, rashguard, dan dokumentasi foto/video gratis.
                  </p>
                </div>
                <Link
                  href="/category/surfing-lesson"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-base text-tissue hover:bg-black/90 transition-colors shadow-sm"
                >
                  <span>Lihat Kelas Surfing</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Contact CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-[36px] border-none bg-lightblue p-8 sm:p-14 text-center space-y-4 shadow-sm">
            <h2 className="font-serif text-3xl sm:text-5xl text-black">
              Ingin Diskusi atau Tanya <span className="italic font-normal">Rencana Liburan?</span>
            </h2>
            <p className="text-xs sm:text-sm text-black/80 max-w-xl mx-auto font-sans font-medium">
              Tim kami selalu siap membantu memberikan rekomendasi terbaik sesuai dengan budget dan preferensi Anda.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-serif">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-full bg-black text-tissue px-8 py-4 text-xl hover:bg-black/90 transition-colors shadow-sm"
              >
                <Phone className="h-4 w-4 text-tissue" />
                <span>Konsultasi WhatsApp Sekarang</span>
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-full bg-tissue text-black px-8 py-4 text-xl hover:bg-slate-50 transition-colors shadow-sm border-none"
              >
                <span>Halaman Kontak Lengkap</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
