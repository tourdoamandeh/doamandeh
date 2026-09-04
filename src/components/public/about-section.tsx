import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface AboutSectionProps {
  aboutTagline?: string;
  aboutTitle?: string;
  aboutText?: string;
  stat1Val?: string;
  stat1Label?: string;
  stat2Val?: string;
  stat2Label?: string;
}

export function AboutSection({
  aboutTagline = '// TENTANG DOAMANDEH',
  aboutTitle = 'Bersama Doamandeh, liburan di Bali tak seharusnya terasa melelahkan. Kami mengurus setiap detail perjalanannya, agar kamu bisa benar-benar rileks, menikmati momen, dan menemukan ketenangan.',
  aboutText,
  stat1Val = '100%',
  stat1Label = 'Sepenuh Hati',
  stat2Val = '24/7',
  stat2Label = 'Teman Perjalanan',
}: AboutSectionProps = {}) {
  return (
    <section
      id="about"
      className="relative bg-softblue text-softyellow py-16 lg:py-24 font-sans overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-10">

        {/* Bagian Atas: Tagline & Judul */}
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-12 lg:mb-16">
            <div className="md:col-span-2 pt-1 md:pt-2">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-softyellow/70 flex items-center gap-2">
                <span>{aboutTagline}</span>
              </p>
            </div>
            <div className="md:col-span-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium leading-[1.15] tracking-tight text-softyellow">
                {aboutTitle}
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Bagian Bawah: Statistik + Tombol Selengkapnya, Gambar Asimetris & Teks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Kolom Kiri: Statistik + Link (Di atas foto) & Foto Alam Rumah Pohon */}
          <FadeIn direction="up" delay={0.15} className="md:col-span-5 md:col-start-2 mt-0 md:mt-6 space-y-6">
            {/* Statistik & Tombol Link Selengkapnya di Atas Foto */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/20">
              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <p className="text-3xl lg:text-4xl font-medium tracking-tighter mb-0.5 text-softyellow">
                    {stat1Val}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-softyellow/70 font-medium">
                    {stat1Label}
                  </p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-medium tracking-tighter mb-0.5 text-softyellow">
                    {stat2Val}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-softyellow/70 font-medium">
                    {stat2Label}
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold bg-softyellow text-softblue px-4 py-2.5 hover:bg-softyellow/90 hover:text-brown transition-all group cursor-pointer shadow-none rounded-none border border-softyellow"
              >
                <span>Kenal kami lebih dekat</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2]" />
              </Link>
            </div>

            {/* Foto 1: Rumah Pohon & Alam Bali (Offline SVG) */}
            <div className="space-y-4 pt-2">
              <div className="relative aspect-[3/4] sm:aspect-[3/2] w-full bg-softblue overflow-hidden border-2 border-softyellow shadow-none rounded-none">
                <Image
                  src="/assets/about-photo-1.svg"
                  alt="Rumah Pohon & Alam Bali - Doamandeh"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-softyellow/70 px-4">
                <span>[01] RUMAH POHON &amp; ALAM BALI</span>
                <span>@2026</span>
              </div>
            </div>
          </FadeIn>

          {/* Kolom Kanan: Teks Paragraf dan Foto Tebing & Laut Bali */}
          <FadeIn direction="up" delay={0.3} className="md:col-span-4 md:col-start-8 flex flex-col gap-10 mt-6 md:mt-0">
            <div className="text-base md:text-lg leading-relaxed text-softyellow/90 font-light pr-0 md:pr-4 pt-1">
              {aboutText || 'Doamandeh hadir untuk jadi teman perjalananmu selama di pulau dewata. Apa pun gaya liburan yang kamu inginkan—mulai dari sewa kendaraan untuk keliling bebas, bersantai tenang di villa, menantang ombak lewat kelas surfing, ikut paket tour seru, sampai membuat tato sebagai kenang-kenangan—semuanya sudah kami siapkan dengan aman dan nyaman untukmu.'}
              <br /><br />
              <span className="tracking-[0.5em] text-lg text-softyellow">✦ ✦ ✦</span>
            </div>

            {/* Foto 2: Tebing & Tepi Laut Bali (Offline SVG) */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full sm:w-4/5 bg-softblue overflow-hidden border-2 border-softyellow shadow-none rounded-none">
                <Image
                  src="/assets/about-photo-2.svg"
                  alt="Tebing & Laut Bali - Doamandeh"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-softyellow/70 sm:w-4/5 px-4">
                <span>[02] TEBING &amp; TEPI LAUT BALI</span>
                <span>@2026</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}