import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { AboutGallerySlider } from '@/components/public/about-gallery-slider';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';
import { ArrowRight, MapPin, Star, ShieldCheck, Zap, HeartHandshake, BadgePercent } from 'lucide-react';

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

const CATEGORIES = [
  {
    num: '01',
    slug: 'vehicle-rental',
    label: 'Sewa Kendaraan',
    desc: 'Mau motoran santai ngelewatin sawah atau bawa keluarga pakai mobil nyaman? Pilih aja armadanya, kami antar langsung ke tempatmu.',
    tags: ['Motor & Mobil Terawat', 'Helm & Jas Hujan', 'Free Antar-Jemput Area'],
    image: '/assets/service-vehicle.svg',
  },
  {
    num: '02',
    slug: 'tattoo',
    label: 'Tattoo Studio & Art',
    desc: 'Bawa pulang kenangan yang nempel seumur hidup. Dikerjain sama seniman lokal yang detail di studio yang super steril.',
    tags: ['100% Higienis Medis', 'Custom Art Design', 'Jarum Single-Use Steril'],
    image: '/assets/service-tattoo.svg',
  },
  {
    num: '03',
    slug: 'villa',
    label: 'Villa & Accommodation',
    desc: 'Cari tempat healing yang tenang? Nginep di villa kami aja. Lengkap dengan kolam renang pribadi, pas banget buat rebahan seharian.',
    tags: ['Private Pool Villa', 'Lokasi Strategis', 'Pelayanan 24/7'],
    image: '/assets/service-villa.svg',
  },
  {
    num: '04',
    slug: 'travel',
    label: 'Paket Tour & Trip Bali',
    desc: 'Nggak usah pusing baca map. Duduk manis, dan biarin driver ramah kami nganterin kamu ke spot-spot paling cakep di Bali.',
    tags: ['Custom Itinerary', 'Driver & BBM Inklusi', 'Spot Foto Ikonik'],
    image: '/assets/service-travel.svg',
  },
  {
    num: '05',
    slug: 'surfing-lesson',
    label: 'Private Surfing Lesson',
    desc: 'Belum pernah pegang papan selancar? Tenang, instruktur kami sabar banget ngajarin dari nol sampai kamu bisa naklukin ombak.',
    tags: ['Instruktur Sertifikasi', 'Papan Selancar & Rashguard', 'Foto & Video Dokumentasi'],
    image: '/assets/service-surfing.svg',
  },
];

export default async function AboutPage() {
  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  const cleanWa = (siteSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Doamandeh, saya butuh teman ngobrol untuk merencanakan liburan di Bali.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-brown text-softyellow font-sans selection:bg-softyellow selection:text-brown">
      <PublicHeader whatsappNumber={siteSettings.contact_whatsapp} />

      <main className="flex-1">

        {/* 1. EDITORIAL 3-COLUMN HERO SECTION (Background Brown) */}
        <section className="bg-brown pt-2 sm:pt-4 pb-12 lg:pb-16 border-b-2 border-softyellow/30 font-sans overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

              {/* KOLOM KIRI (Headline, Subtitle, CTA Button, & Stats Avatars) */}
              <FadeIn direction="up" delay={0.1} className="lg:col-span-4 flex flex-col justify-between gap-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-medium text-softyellow tracking-tight leading-[0.95] mb-6">
                    {siteSettings.about_title || 'Eksplor Bali Bersama Doamandeh'}
                  </h1>

                  <p className="text-sm md:text-base text-softyellow/85 font-light leading-relaxed mb-8 max-w-md">
                    {siteSettings.about_text || 'Nggak perlu pusing mikirin itinerary. Doamandeh siap jadi teman jalan lokalmu buat wujudin liburan impian. Mau keliling naik motor, nyantai seharian di villa private, belajar surfing, ikut tur asyik, atau bikin tato buat kenang-kenangan? Tinggal bilang, biar kami yang siapkan semuanya dengan aman dan nyaman.'}
                  </p>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-softyellow text-brown px-7 py-4 text-xs font-medium border-2 border-softyellow hover:bg-white hover:text-brown transition-colors shadow-none rounded-none w-fit font-bold uppercase tracking-wider"
                  >
                    <span>Yuk, ngobrolin rencanamu</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Stat & Overlapping Avatars */}
                <div className="pt-6 border-t-2 border-softyellow/20">
                  <span className="text-2xl sm:text-3xl font-medium tracking-tight text-softyellow block mb-1">
                    {siteSettings.about_stat_1_val ? `${siteSettings.about_stat_1_val} ${siteSettings.about_stat_1_label}` : '10.000+ Teman Jalan'}
                  </span>
                  <p className="text-xs text-softyellow/75 font-light leading-relaxed max-w-[280px] mb-3">
                    Udah nemenin ribuan orang bikin kenangan manis selama di Bali.
                  </p>

                  {/* Square Avatar Photos with Gap */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 border-2 border-softyellow bg-brown overflow-hidden rounded-none shrink-0">
                      <Image src="/assets/testimonial-tour.svg" alt="Wisatawan Doamandeh" fill className="object-cover" />
                    </div>
                    <div className="relative w-12 h-12 border-2 border-softyellow bg-brown overflow-hidden rounded-none shrink-0">
                      <Image src="/assets/testimonial-villa.svg" alt="Wisatawan Doamandeh" fill className="object-cover" />
                    </div>
                    <div className="relative w-12 h-12 border-2 border-softyellow bg-brown overflow-hidden rounded-none shrink-0">
                      <Image src="/assets/testimonial-motor.svg" alt="Wisatawan Doamandeh" fill className="object-cover" />
                    </div>
                    <div className="relative w-12 h-12 border-2 border-softyellow bg-brown overflow-hidden rounded-none shrink-0">
                      <Image src="/assets/testimonial-mobil.svg" alt="Wisatawan Doamandeh" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* KOLOM TENGAH (Tall Portrait Featured Hero Image) */}
              <FadeIn direction="up" delay={0.25} className="lg:col-span-4 h-full">
                <div className="relative w-full h-[480px] sm:h-[580px] lg:h-full min-h-[480px] border-2 border-softyellow overflow-hidden bg-brown rounded-none shadow-none">
                  <Image
                    src="/assets/hero-bali.svg"
                    alt="Keindahan Alam & Wisata Bali"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </FadeIn>

              {/* KOLOM KANAN (Top Location, Rating, 2 Thumbnails & Award Section) */}
              <FadeIn direction="up" delay={0.4} className="lg:col-span-4 flex flex-col justify-between gap-8">
                {/* Top Location Bar */}
                <div className="flex items-center justify-between gap-4 border-b-2 border-softyellow/20 pb-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-softyellow">
                    <MapPin className="w-4 h-4 stroke-[2]" />
                    <span>Canggu, Bali</span>
                  </div>
                </div>

                {/* Rating & 2 Thumbnails Side-by-Side */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5 text-softyellow">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-softyellow text-softyellow" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-softyellow">4.9</span>
                  </div>
                  <span className="text-xs text-softyellow/75 font-light block mb-4">
                    Rating rata-rata ulasan wisatawan
                  </span>

                  {/* Interactive Photo Gallery Slider */}
                  <AboutGallerySlider />
                </div>

                {/* Lower Excellence Section */}
                <div className="pt-6 border-t-2 border-dashed border-softyellow/30">
                  <h2 className="text-2xl sm:text-3xl font-medium text-softyellow tracking-tight leading-tight mb-3">
                    Pelayanan Sepenuh Hati
                  </h2>
                  <p className="text-xs sm:text-sm text-softyellow/85 font-light leading-relaxed">
                    Nyaman, aman, dan pastinya berkesan—ini alasan kenapa banyak banget yang balik lagi liburan bareng kami.
                  </p>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* 2. PRINSIP & NILAI KAMI / MENGAPA MEMILIH DOAMANDEH (2-Column Grid Layout) */}
        <section className="py-12 lg:py-20 border-b-2 border-softyellow/30 bg-brown text-softyellow font-sans overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

              {/* LEFT COLUMN: Subtitle, Large Title, Paragraph, & Featured Bottom Image (40% width) */}
              <FadeIn direction="up" delay={0.1} className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div>
                  {/* Large Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-softyellow leading-[1.05] mb-5">
                    Kenapa Jalan Bareng Doamandeh?
                  </h2>

                  {/* Paragraph */}
                  <p className="text-[13px] sm:text-sm text-softyellow/85 font-light leading-relaxed max-w-md">
                    Liburan itu waktunya buang penat, bukan malah nambah ribet. Makanya, kami pastiin semua urusanmu aman terkendali.
                  </p>
                </div>

                {/* Featured Image at bottom left */}
                <div className="relative w-full aspect-[4/3] border-2 border-softyellow overflow-hidden bg-brown rounded-none shadow-none mt-2">
                  <Image
                    src="/assets/service-travel.svg"
                    alt="Pengalaman Liburan Doamandeh Bali"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>

              {/* RIGHT COLUMN: Full-Height 2x2 Grid with Center + Divider */}
              <div className="lg:col-span-7 h-full">
                <FadeInStagger className="grid grid-cols-2 grid-rows-2 h-full">
                  {/* Cell 01 */}
                  <FadeIn direction="up" className="h-full p-4 sm:p-5 lg:p-6 border-b border-r border-softyellow/30 flex flex-col justify-between group hover:bg-softyellow/5 transition-colors">
                    <div>
                      {/* Soft Icon Badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-softyellow/15 border border-softyellow/30 flex items-center justify-center text-softyellow mb-3 sm:mb-4 rounded-none">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-softyellow" />
                      </div>

                      <h3 className="text-base sm:text-xl lg:text-[22px] font-medium text-softyellow mb-1.5 sm:mb-2">
                        Keamanan &amp; Higienis
                      </h3>

                      <p className="text-[11px] sm:text-[13px] lg:text-sm text-softyellow/80 font-light leading-snug sm:leading-relaxed">
                        Mulai dari kendaraan yang rajin diservis sampai studio tato berstandar medis, kesehatan dan keamananmu selalu jadi prioritas.
                      </p>
                    </div>
                  </FadeIn>

                  {/* Cell 02 */}
                  <FadeIn direction="up" className="h-full p-4 sm:p-5 lg:p-6 border-b border-softyellow/30 flex flex-col justify-between group hover:bg-softyellow/5 transition-colors">
                    <div>
                      {/* Soft Icon Badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-softyellow/15 border border-softyellow/30 flex items-center justify-center text-softyellow mb-3 sm:mb-4 rounded-none">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-softyellow" />
                      </div>

                      <h3 className="text-base sm:text-xl lg:text-[22px] font-medium text-softyellow mb-1.5 sm:mb-2">
                        Booking Cepat
                      </h3>

                      <p className="text-[11px] sm:text-[13px] lg:text-sm text-softyellow/80 font-light leading-snug sm:leading-relaxed">
                        Mau nanya-nanya atau langsung booking? Cukup chat WhatsApp aja, admin kami bakal langsung respon tanpa proses ribet.
                      </p>
                    </div>
                  </FadeIn>

                  {/* Cell 03 */}
                  <FadeIn direction="up" className="h-full p-4 sm:p-5 lg:p-6 border-r border-softyellow/30 flex flex-col justify-between group hover:bg-softyellow/5 transition-colors">
                    <div>
                      {/* Soft Icon Badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-softyellow/15 border border-softyellow/30 flex items-center justify-center text-softyellow mb-3 sm:mb-4 rounded-none">
                        <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-softyellow" />
                      </div>

                      <h3 className="text-base sm:text-xl lg:text-[22px] font-medium text-softyellow mb-1.5 sm:mb-2">
                        Kualitas Pelayanan
                      </h3>

                      <p className="text-[11px] sm:text-[13px] lg:text-sm text-softyellow/80 font-light leading-snug sm:leading-relaxed">
                        Tim lokal kami udah anggap kamu kayak teman sendiri. Santai, ramah, dan pastinya siap bantu kebutuhan liburanmu kapan aja.
                      </p>
                    </div>
                  </FadeIn>

                  {/* Cell 04 */}
                  <FadeIn direction="up" className="h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between group hover:bg-softyellow/5 transition-colors">
                    <div>
                      {/* Soft Icon Badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-softyellow/15 border border-softyellow/30 flex items-center justify-center text-softyellow mb-3 sm:mb-4 rounded-none">
                        <BadgePercent className="w-4 h-4 sm:w-5 sm:h-5 text-softyellow" />
                      </div>

                      <h3 className="text-base sm:text-xl lg:text-[22px] font-medium text-softyellow mb-1.5 sm:mb-2">
                        Harga Transparan
                      </h3>

                      <p className="text-[11px] sm:text-[13px] lg:text-sm text-softyellow/80 font-light leading-snug sm:leading-relaxed">
                        Nggak ada biaya kaget di akhir liburan. Semua harga yang kamu lihat udah jujur dan transparan dari awal.
                      </p>
                    </div>
                  </FadeIn>
                </FadeInStagger>
              </div>

            </div>
          </div>
        </section>

        {/* 3. EKOSISTEM LAYANAN (Background Brown) */}
        <section className="py-16 sm:py-24 border-b-2 border-softyellow/30 bg-brown text-softyellow font-sans overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">

            {/* Header Centered */}
            <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-softyellow leading-[1.05] mb-4">
                Semua Ada di Doamandeh
              </h2>
              <p className="text-sm sm:text-base text-softyellow/85 font-light leading-relaxed max-w-2xl mx-auto">
                Apa pun gaya liburanmu, kami punya pilihan yang pas buat bikin momenmu di Bali makin berkesan.
              </p>
            </FadeIn>

            {/* Numbered List Stack */}
            <FadeInStagger className="border-t border-softyellow/30 flex flex-col">
              {CATEGORIES.map((cat) => (
                <FadeIn key={cat.slug} direction="up">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group flex flex-row items-start justify-between gap-4 sm:gap-8 py-6 sm:py-9 border-b border-softyellow/30 hover:bg-softyellow/5 px-2 sm:px-6 transition-colors rounded-none"
                  >
                    {/* Left Numbering & Text Content */}
                    <div className="flex items-start gap-3 sm:gap-6 flex-1 min-w-0">
                      {/* Numbering */}
                      <span className="text-sm sm:text-lg font-medium text-softyellow/80 pt-0.5 shrink-0 w-6 sm:w-7">
                        {cat.num}
                      </span>

                      {/* Details (Title, Description, & Badges aligned) */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <h3 className="text-base sm:text-2xl font-medium text-softyellow group-hover:text-white transition-colors">
                          {cat.label}
                        </h3>

                        <p className="text-[11px] sm:text-sm text-softyellow/80 font-light leading-relaxed max-w-xl">
                          {cat.desc}
                        </p>

                        {/* Tag Badges (Aligned cleanly with title & text) */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                          {cat.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] sm:text-xs font-light text-softyellow/90 bg-softyellow/10 border border-softyellow/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-none inline-block"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Portrait Image with 2px Border */}
                    <div className="relative w-24 h-32 sm:w-36 sm:h-48 md:w-44 md:h-56 aspect-[3/4] border-2 border-softyellow overflow-hidden bg-brown rounded-none shrink-0 group-hover:border-white transition-colors">
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </FadeInStagger>

          </div>
        </section>

        {/* 5. CTA SECTION (Background Photo with Overlay Text) */}
        <section className="bg-brown border-b-2 border-softyellow/30 font-sans overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
            <FadeIn direction="up">
              <div className="relative border-2 border-softyellow p-10 md:p-20 text-center flex flex-col items-center justify-center rounded-none overflow-hidden min-h-[420px]">
                {/* Background Image */}
                <Image
                  src="/assets/hero-bali.jpg"
                  alt="Liburan Impian Bali Doamandeh"
                  fill
                  className="object-cover"
                />

                {/* Dark Overlay Mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-brown/95 via-brown/85 to-brown/75" />

                {/* Content Box */}
                <FadeInStagger className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                  <FadeIn direction="up">
                    <span className="text-xs font-medium text-softyellow/90 tracking-wider uppercase mb-4 block">
                      ✦ MULAI CERITAMU ✦
                    </span>
                  </FadeIn>

                  <FadeIn direction="up">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-softyellow mb-5 leading-tight">
                      Udah Kebayang Serunya Liburan di Bali?
                    </h2>
                  </FadeIn>

                  <FadeIn direction="up">
                    <p className="text-sm md:text-base font-light text-softyellow/85 max-w-xl mb-9 leading-relaxed">
                      Nggak usah sungkan buat tanya-tanya dulu. Ceritain aja liburan kayak apa yang kamu mau, dan tim Doamandeh bakal bantu susun rencana paling asyik buat kamu.
                    </p>
                  </FadeIn>

                  <FadeIn direction="up">
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-softyellow text-brown px-8 py-4 border-2 border-softyellow hover:bg-white hover:text-brown transition-colors text-xs font-bold rounded-none shadow-lg uppercase tracking-wider"
                      >
                        {siteSettings.cta_button_text || 'Tanya-tanya via WhatsApp'}
                      </a>
                      <Link
                        href="/contact"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brown/60 backdrop-blur-md text-softyellow px-8 py-4 border-2 border-softyellow hover:bg-softyellow hover:text-brown transition-colors text-xs font-bold rounded-none uppercase tracking-wider"
                      >
                        Liat Kontak Kami
                      </Link>
                    </div>
                  </FadeIn>
                </FadeInStagger>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
