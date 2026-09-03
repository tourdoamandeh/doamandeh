import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface AboutSectionProps {
  aboutText?: string;
}

export function AboutSection({ aboutText }: AboutSectionProps = {}) {
  return (
    <section
      id="about"
      className="relative bg-[#607a8f] text-[#FFF6C6] py-16 lg:py-24 font-sans overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-10">

        {/* Bagian Atas: Tagline & Judul */}
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-12 lg:mb-16">
            <div className="md:col-span-2 pt-1 md:pt-2">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[#FFF6C6]/70 flex items-center gap-2">
                <span>//</span> TENTANG DOAMANDEH
              </p>
            </div>
            <div className="md:col-span-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium leading-[1.15] tracking-tight text-[#FFF6C6]">
                Bersama Doamandeh, liburan di Bali tak seharusnya terasa melelahkan. Kami mengurus setiap detail perjalanannya, agar kamu bisa benar-benar rileks, menikmati momen, dan menemukan ketenangan.
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Bagian Bawah: Statistik + Tombol Selengkapnya, Gambar Asimetris & Teks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Kolom Kiri: Statistik + Link (Di atas foto) & Foto Alam & Kendaraan */}
          <FadeIn direction="up" delay={0.15} className="md:col-span-5 md:col-start-2 mt-0 md:mt-6 space-y-6">
            {/* Statistik & Tombol Link Selengkapnya di Atas Foto */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#FFFFFF]/20">
              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <p className="text-3xl lg:text-4xl font-medium tracking-tighter mb-0.5 text-[#FFF6C6]">100<span className="text-xl">%</span></p>
                  <p className="text-[10px] uppercase tracking-widest text-[#FFF6C6]/70 font-medium">Sepenuh Hati</p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-medium tracking-tighter mb-0.5 text-[#FFF6C6]">24<span className="text-xl">/7</span></p>
                  <p className="text-[10px] uppercase tracking-widest text-[#FFF6C6]/70 font-medium">Teman Perjalanan</p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold bg-[#FFF6C6] text-[#607a8f] px-4 py-2.5 hover:bg-[#fff6c6]/90 hover:text-[#504139] transition-all group cursor-pointer shadow-sm rounded-none"
              >
                <span>Kenal kami lebih dekat</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2]" />
              </Link>
            </div>

            {/* Foto Alam & Kendaraan - BENTUK ELIPS */}
            <div className="space-y-4 pt-2">
              <div className="relative aspect-[3/2] w-full bg-gray-200 overflow-hidden border-2 border-[#fff6c6] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                  alt="Doamandeh Services"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#FFF6C6]/70 px-4">
                <span>[01] ALAM &amp; KENDARAAN</span>
                <span>@2026</span>
              </div>
            </div>
          </FadeIn>

          {/* Kolom Kanan: Teks Paragraf dan Foto Villa & Relaksasi */}
          <FadeIn direction="up" delay={0.3} className="md:col-span-4 md:col-start-8 flex flex-col gap-10 mt-6 md:mt-0">
            <div className="text-base md:text-lg leading-relaxed text-[#FFF6C6]/90 font-light pr-0 md:pr-4 pt-1">
              {aboutText || 'Doamandeh hadir untuk jadi teman perjalananmu selama di pulau dewata. Apa pun gaya liburan yang kamu inginkan—mulai dari sewa kendaraan untuk keliling bebas, bersantai tenang di villa, menantang ombak lewat kelas surfing, ikut paket tour seru, sampai membuat tato sebagai kenang-kenangan—semuanya sudah kami siapkan dengan aman dan nyaman untukmu.'}
              <br /><br />
              <span className="tracking-[0.5em] text-lg text-[#FFF6C6]">✦ ✦ ✦</span>
            </div>

            {/* Foto Kanan (Villa & Relaksasi) - BENTUK ELIPS */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full sm:w-4/5 bg-gray-200 overflow-hidden border-2 border-[#fff6c6] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
                  alt="Doamandeh Experiences"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#FFF6C6]/70 sm:w-4/5 px-4">
                <span>[02] VILLA &amp; RELAKSASI</span>
                <span>@2026</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}