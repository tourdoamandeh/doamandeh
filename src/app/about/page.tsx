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
    <div className="min-h-screen flex flex-col bg-softyellow text-black font-sans selection:bg-brown selection:text-softyellow">
      <PublicHeader whatsappNumber={siteSettings.contact_whatsapp} />

      <main className="flex-1">
        {/* About Editorial Hero */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b-2 border-brown bg-softyellow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brown border-2 border-brown bg-softwhite px-5 py-2 inline-block mb-6 rounded-none shadow-none">
                {siteSettings.about_tagline || 'Mengenal Lebih Dekat Doamandeh'}
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-black tracking-tight leading-tight mb-6 uppercase">
                {siteSettings.about_title || 'Menciptakan Momen Liburan Tak Terlupakan di Bali'}
              </h1>

              <p className="text-base sm:text-lg text-black/80 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
                {siteSettings.about_text}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest font-bold">
                <div className="flex items-center gap-2 bg-softwhite border-2 border-brown px-5 py-2.5 rounded-none shadow-none text-brown">
                  <MapPin className="h-4 w-4 text-brown" />
                  <span>Canggu, Bali</span>
                </div>
                <div className="flex items-center gap-2 bg-softwhite border-2 border-brown px-5 py-2.5 rounded-none shadow-none text-brown">
                  <Users className="h-4 w-4 text-brown" />
                  <span>{siteSettings.about_stat_1_val} {siteSettings.about_stat_1_label}</span>
                </div>
                <div className="flex items-center gap-2 bg-softwhite border-2 border-brown px-5 py-2.5 rounded-none shadow-none text-brown">
                  <HeartHandshake className="h-4 w-4 text-brown" />
                  <span>{siteSettings.about_stat_2_val} {siteSettings.about_stat_2_label}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles & Values Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brown block mb-2">
              Prinsip &amp; Nilai Kami
            </span>
            <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-black">
              Mengapa Memilih Doamandeh?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-none border-2 border-brown bg-softwhite p-8 space-y-4 shadow-none">
              <span className="text-2xl font-light text-brown opacity-50 block">01</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-brown">Keamanan &amp; Higienis</h3>
              <p className="text-xs text-black/75 leading-relaxed font-light">
                Setiap unit kendaraan diperiksa rutin, studio tato menerapkan standar jarum single-use steril, dan instruktur selancar bersertifikat resmi.
              </p>
            </div>

            <div className="rounded-none border-2 border-brown bg-softwhite p-8 space-y-4 shadow-none">
              <span className="text-2xl font-light text-brown opacity-50 block">02</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-brown">Booking Cepat</h3>
              <p className="text-xs text-black/75 leading-relaxed font-light">
                Reservasi fleksibel langsung dari website atau WhatsApp. Bebas ribet dengan transparansi ketersediaan jadwal real-time.
              </p>
            </div>

            <div className="rounded-none border-2 border-brown bg-softwhite p-8 space-y-4 shadow-none">
              <span className="text-2xl font-light text-brown opacity-50 block">03</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-brown">Kualitas Pelayanan</h3>
              <p className="text-xs text-black/75 leading-relaxed font-light">
                Staf lokal yang ramah dan komunikatif siap membantu kebutuhan khusus Anda selama berlibur di Pulau Dewata.
              </p>
            </div>

            <div className="rounded-none border-2 border-brown bg-softwhite p-8 space-y-4 shadow-none">
              <span className="text-2xl font-light text-brown opacity-50 block">04</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-brown">Harga Transparan</h3>
              <p className="text-xs text-black/75 leading-relaxed font-light">
                Tidak ada biaya tersembunyi. Seluruh tarif tertera jelas sehingga Anda dapat merencanakan anggaran liburan dengan tenang.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Core Services List */}
        <section className="border-t-2 border-b-2 border-brown bg-softwhite py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brown border-2 border-brown bg-softyellow px-4 py-1.5 inline-block rounded-none">
                Ekosistem Layanan
              </span>
              <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-black mt-4">
                5 Layanan Utama Doamandeh
              </h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-none border-2 border-brown bg-softyellow p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-none">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs uppercase tracking-widest font-bold text-brown/70">01 / Kategori</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide text-brown">Sewa Kendaraan Motor &amp; Mobil</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-light">
                    Unit motor matic (Scoopy, NMAX, PCX) dan mobil pribadi terawat dengan fasilitas helm, jas hujan, serta gratis antar-jemput ke area hotel/bandara.
                  </p>
                </div>
                <Link
                  href="/category/vehicle-rental"
                  className="shrink-0 flex items-center gap-2 rounded-none bg-brown text-softyellow px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-none"
                >
                  <span>Lihat Kendaraan</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-none border-2 border-brown bg-softyellow p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-none">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs uppercase tracking-widest font-bold text-brown/70">02 / Kategori</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide text-brown">Tattoo Studio &amp; Artist</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-light">
                    Studio tato modern higienis dengan peralatan single-use steril dan seniman tato berpengalaman dalam berbagai style (realism, fineline, traditional, tribal).
                  </p>
                </div>
                <Link
                  href="/category/tattoo"
                  className="shrink-0 flex items-center gap-2 rounded-none bg-brown text-softyellow px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-none"
                >
                  <span>Lihat Studio &amp; Artist</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-none border-2 border-brown bg-softyellow p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-none">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs uppercase tracking-widest font-bold text-brown/70">03 / Kategori</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide text-brown">Villa &amp; Vacation Stay</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-light">
                    Akomodasi villa privat estetik lengkap dengan private pool, dapur modern, WiFi kencang, dan suasana tenang dekat pusat hiburan Canggu &amp; Seminyak.
                  </p>
                </div>
                <Link
                  href="/category/villa"
                  className="shrink-0 flex items-center gap-2 rounded-none bg-brown text-softyellow px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-none"
                >
                  <span>Lihat Pilihan Villa</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-none border-2 border-brown bg-softyellow p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-none">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs uppercase tracking-widest font-bold text-brown/70">04 / Kategori</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide text-brown">Paket Travel &amp; Wisata Tour</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-light">
                    Paket wisata keliling destinasi eksotis Bali (Ubud, Uluwatu, Nusa Penida, Bedugul) lengkap dengan driver ramah dan kendaraan ber-AC yang nyaman.
                  </p>
                </div>
                <Link
                  href="/category/travel"
                  className="shrink-0 flex items-center gap-2 rounded-none bg-brown text-softyellow px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-none"
                >
                  <span>Lihat Paket Tour</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-none border-2 border-brown bg-softyellow p-8 sm:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-none">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs uppercase tracking-widest font-bold text-brown/70">05 / Kategori</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide text-brown">Surfing Lesson Pemula &amp; Lanjutan</h3>
                  <p className="text-xs text-black/75 leading-relaxed font-light">
                    Sekolah selancar bersertifikat dengan bimbingan 1-on-1 dari instruktur profesional. Perlengkapan surf board, rashguard, dan dokumentasi foto/video gratis.
                  </p>
                </div>
                <Link
                  href="/category/surfing-lesson"
                  className="shrink-0 flex items-center gap-2 rounded-none bg-brown text-softyellow px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-none"
                >
                  <span>Lihat Kelas Surfing</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection
          testimonialsTitle={siteSettings.testimonials_title}
          testimonialsJson={siteSettings.testimonials_data}
        />

        {/* Contact CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-none border-2 border-brown bg-brown text-softyellow p-8 sm:p-14 text-center space-y-4 shadow-none">
            <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-softyellow">
              {siteSettings.cta_title || 'Ingin Diskusi atau Tanya Rencana Liburan?'}
            </h2>
            <p className="text-xs sm:text-sm text-softyellow/80 max-w-xl mx-auto font-light leading-relaxed">
              {siteSettings.cta_subtitle || 'Tim kami selalu siap membantu memberikan rekomendasi terbaik sesuai dengan budget dan preferensi Anda.'}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs uppercase tracking-widest font-bold">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-none bg-softyellow text-brown px-8 py-4 hover:bg-white transition-colors shadow-none"
              >
                <Phone className="h-4 w-4 text-brown" />
                <span>{siteSettings.cta_button_text || 'Konsultasi WhatsApp Sekarang'}</span>
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-none bg-transparent border-2 border-softyellow text-softyellow px-8 py-4 hover:bg-softyellow hover:text-brown transition-colors shadow-none"
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
