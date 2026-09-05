import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  aboutTagline?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutText?: string;
  aboutSecondaryText?: string;
  aboutBtnText?: string;
  stat1Val?: string;
  stat1Label?: string;
  stat2Val?: string;
  stat2Label?: string;
  stat3Val?: string;
  stat3Label?: string;
  stat4Val?: string;
  stat4Label?: string;
  aboutImage1?: string;
  aboutImage2?: string;
  principles?: Array<{ num: string; title: string; desc: string }>;
  whatsappNumber?: string;
}

const DEFAULT_PRINCIPLES = [
  {
    num: '01',
    title: 'Kurasi Mandiri Tanpa Pihak Ketiga',
    desc: 'Setiap armada kendaraan, villa mitra privat, jarum studio tato steril, dan papan selancar kami inspeksi langsung demi menjamin higienitas, kebersihan, dan standar keamanan tertinggi.',
  },
  {
    num: '02',
    title: 'Responsivitas Nyata Tanpa Bot Kaku',
    desc: 'Anda terhubung langsung dengan tim lokal berpengalaman di Canggu dan Denpasar yang memahami rute, cuaca, dan kondisi lapangan secara real-time—bukan balasan bot otomatis.',
  },
  {
    num: '03',
    title: 'Transparansi Tarif Tanpa Biaya Tersembunyi',
    desc: 'Tarif yang tercantum di katalog adalah biaya pasti. Tanpa biaya tambahan helm, jas hujan, atau mark-up tersembunyi yang merepotkan liburan Anda.',
  },
  {
    num: '04',
    title: 'Fleksibilitas Penjemputan & Jadwal Liburan',
    desc: 'Kami menyesuaikan ritme santaimu. Gratis pengantaran armada ke hotel/villa di area Canggu, Seminyak, Kuta, maupun koordinasi meeting point yang mudah dijangkau.',
  },
];

export function AboutSection({
  aboutTagline = "// TENTANG DO'AMANDEH",
  aboutTitle = "Bersama Do'amandeh, liburan di Bali tak seharusnya terasa melelahkan. Kami mengurus setiap detail perjalanannya, agar kamu bisa benar-benar rileks, menikmati momen, dan menemukan ketenangan.",
  aboutSubtitle = '// BALI TOURS, STAYS & LIFESTYLE CURATION',
  aboutText,
  aboutSecondaryText = 'Dengan berfokus pada transparansi tarif, keramahan komunikasi lokal yang cepat, dan kualitas unit yang terinspeksi setiap saat, kami memastikan liburan santai Anda di Pulau Dewata berlangsung tenang dari awal penjemputan hingga kepulangan.',
  aboutBtnText = 'Konsultasi Liburan',
  stat1Val = '10.000+',
  stat1Label = 'Wisatawan Terlayani',
  stat2Val = '99.4%',
  stat2Label = 'Tingkat Kepuasan',
  stat3Val = '50+',
  stat3Label = 'Armada & Fasilitas Aktif',
  stat4Val = '24/7',
  stat4Label = 'Dukungan Staf Lokal',
  aboutImage1,
  aboutImage2,
  principles,
  whatsappNumber = '+62 812-3456-7890',
}: AboutSectionProps = {}) {
  const activePrinciples = principles && principles.length > 0 ? principles : DEFAULT_PRINCIPLES;
  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    "Halo Do'amandeh, saya ingin konsultasi rencana liburan di Bali."
  )}`;

  const heroImage = aboutImage1 || '/assets/about-photo-1.svg';

  return (
    <section
      id="about"
      className="relative bg-paper text-ink pt-16 lg:pt-24 font-sans border-b border-line scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
        {/* 1. STICKY SPLIT SECTION (DESIGN.md v2)
            Kiri header & fondasi pelayanan (panjang ke bawah),
            Kanan sticky visual + narasi (ikut scroll ke bawah di samping kiri) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">
          {/* Kolom Kiri: Header, Fondasi Pelayanan & CTA (Dibuat Panjang ke Bawah) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header Block */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest font-mono text-ocean">
                {aboutTagline}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink leading-[1.08]">
                {aboutTitle}
              </h2>
              <p className="text-xs uppercase tracking-widest font-mono text-ink/60 pt-1">
                {aboutSubtitle}
              </p>
            </div>

            {/* 3 Fondasi Filosofi Pelayanan (Memperpanjang ruang scroll kiri) */}
            <div className="border-t border-line/60 pt-6 space-y-5">
              <p className="text-xs uppercase tracking-widest font-mono text-ocean">
                // FONDASI KAMI
              </p>

              <div className="space-y-4">
                <div className="border border-line/50 p-4 sm:p-5 bg-foam/40 hover:bg-foam transition-colors rounded-none">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-ocean">[01]</span>
                    <h4 className="text-sm sm:text-base font-medium tracking-tight text-ink">
                      Kurasi Mandiri Tanpa Pihak Ketiga
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-ink/75 font-light leading-relaxed">
                    Setiap unit motor matic, mobil sewa, private pool villa, dan jarum tato steril kami inspeksi langsung secara berkala demi menjamin higienitas, kebersihan, dan kenyamanan tertinggi.
                  </p>
                </div>

                <div className="border border-line/50 p-4 sm:p-5 bg-foam/40 hover:bg-foam transition-colors rounded-none">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-ocean">[02]</span>
                    <h4 className="text-sm sm:text-base font-medium tracking-tight text-ink">
                      Responsivitas Tim Lokal 24/7
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-ink/75 font-light leading-relaxed">
                    Anda terhubung langsung dengan tim lokal ramah di Canggu dan Denpasar yang memahami rute dan kondisi lapangan secara aktual—bukan balasan bot otomatis yang kaku.
                  </p>
                </div>

                <div className="border border-line/50 p-4 sm:p-5 bg-foam/40 hover:bg-foam transition-colors rounded-none">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-ocean">[03]</span>
                    <h4 className="text-sm sm:text-base font-medium tracking-tight text-ink">
                      Tarif Pasti Tanpa Biaya Tersembunyi
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-ink/75 font-light leading-relaxed">
                    Biaya yang Anda lihat di katalog adalah tarif final. Tanpa pungutan siluman untuk helm, jas hujan, atau mark-up mendadak saat tiba di lokasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Ekosistem Layanan Terpadu & CTA Button */}
            <div className="border-t border-line/60 pt-6 space-y-4">
              <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-ink/70">
                <span className="px-2.5 py-1 border border-line bg-foam/30">Tour Bali</span>
                <span className="px-2.5 py-1 border border-line bg-foam/30">Rental Motor & Mobil</span>
                <span className="px-2.5 py-1 border border-line bg-foam/30">Villa Stay</span>
                <span className="px-2.5 py-1 border border-line bg-foam/30">Tato Studio</span>
                <span className="px-2.5 py-1 border border-line bg-foam/30">Surfing Lesson</span>
              </div>

              <div className="pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-ink text-paper hover:bg-ocean transition-colors text-xs uppercase tracking-widest font-medium py-3.5 px-6 rounded-none shadow-none"
                >
                  <span>{aboutBtnText}</span>
                  <ArrowRight className="size-4" strokeWidth={1.5} />
                </a>
                <p className="text-[11px] text-ink/60 font-light mt-2">
                  Konsultasikan rute, ketersediaan unit, atau rekomendasi villa santai Anda langsung bersama tim kami.
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Sticky Visual Container (Mengikuti Scroll di Sebelah Kanan) */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-5">
              {/* Foto Editorial Utama 1px Border */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] border border-line rounded-none overflow-hidden bg-foam">
                <Image
                  src={heroImage}
                  alt="Tentang Do'amandeh Bali"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-ink/80 text-sun border border-line/30 rounded-none shadow-none">
                    [01] // EST. BALI CURATION
                  </span>
                </div>
              </div>

              {/* Dua Paragraf Teks Narasi yang Mengikuti Sticky Scroll */}
              <div className="space-y-3.5 pt-1">
                <p className="text-sm sm:text-base text-ink/85 font-light leading-relaxed">
                  {aboutText ||
                    "Do'amandeh hadir untuk jadi teman perjalananmu selama di pulau dewata. Apa pun gaya liburan yang kamu inginkan—mulai dari sewa kendaraan untuk keliling bebas, bersantai tenang di villa, menantang ombak lewat kelas surfing, ikut paket tour seru, sampai membuat tato sebagai kenang-kenangan—semuanya sudah kami siapkan dengan aman dan nyaman untukmu."}
                </p>

                <p className="text-xs sm:text-sm text-ink/75 font-light leading-relaxed">
                  {aboutSecondaryText ||
                    "Dengan berfokus pada transparansi tarif, keramahan komunikasi lokal yang cepat, dan kualitas unit yang terinspeksi setiap saat, kami memastikan liburan santai Anda di Pulau Dewata berlangsung tenang dari awal penjemputan hingga kepulangan."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. STATS ROW: 4 ANGKA BESAR DALAM 1 BARIS (DESIGN.md v2)
            Dipisah border-l border-line — BUKAN card, BUKAN icon lingkaran. */}
        <div className="border-t border-b border-line py-12 sm:py-16 my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {/* Stat 1 */}
            <div className="pr-4 sm:pr-8">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-medium text-ink font-mono tracking-tight block leading-none">
                {stat1Val}
              </span>
              <span className="text-xs uppercase tracking-widest text-ink/60 font-mono block mt-3">
                {stat1Label}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="border-l border-line pl-6 sm:pl-8 pr-4">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-medium text-ink font-mono tracking-tight block leading-none">
                {stat2Val}
              </span>
              <span className="text-xs uppercase tracking-widest text-ink/60 font-mono block mt-3">
                {stat2Label}
              </span>
            </div>

            {/* Stat 3 */}
            <div className="border-l border-line pl-6 sm:pl-8 pr-4">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-medium text-ink font-mono tracking-tight block leading-none">
                {stat3Val}
              </span>
              <span className="text-xs uppercase tracking-widest text-ink/60 font-mono block mt-3">
                {stat3Label}
              </span>
            </div>

            {/* Stat 4 */}
            <div className="border-l border-line pl-6 sm:pl-8">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-medium text-ink font-mono tracking-tight block leading-none">
                {stat4Val}
              </span>
              <span className="text-xs uppercase tracking-widest text-ink/60 font-mono block mt-3">
                {stat4Label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NILAI / CARA KERJA: STANDAR PELAYANAN KAMI (Background Biru Testimoni - bg-softblue) */}
      <div className="w-full bg-softblue text-softyellow py-16 sm:py-20 lg:py-24 border-t border-line/30">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-xl mb-10 sm:mb-12">
            <p className="text-xs uppercase tracking-widest font-mono text-softyellow/70 mb-2">
              // PRINSIP KERJA
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-softyellow">
              Standar Pelayanan Kami
            </h3>
          </div>

          <div className="border-t border-b border-line/30 divide-y divide-line/20">
            {activePrinciples.map((item) => (
              <div
                key={item.num}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 px-4 sm:px-6 hover:bg-sun hover:text-ink transition-colors duration-200 cursor-default"
              >
                {/* Nomor 01/02/03 */}
                <div className="md:col-span-2">
                  <span className="text-2xl sm:text-3xl font-medium font-mono text-softyellow group-hover:text-ocean transition-colors">
                    {item.num}
                  </span>
                </div>

                {/* Judul Prinsip */}
                <div className="md:col-span-4">
                  <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-softyellow group-hover:text-ink leading-tight transition-colors">
                    {item.title}
                  </h4>
                </div>

                {/* Penjelasan Ringkas */}
                <div className="md:col-span-6">
                  <p className="text-sm sm:text-base text-softyellow/80 group-hover:text-ink/85 font-light leading-relaxed transition-colors">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}