import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  aboutText?: string;
}

export function AboutSection({ aboutText }: AboutSectionProps = {}) {
  return (
    <section
      id="about"
      className="relative bg-[#FFF6C6] text-[#131718] py-16 lg:py-24 font-sans overflow-hidden border-y border-[#131718]/15"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

        {/* Bagian Atas: Tagline & Judul */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-12 lg:mb-16">
          <div className="md:col-span-2 pt-1 md:pt-2">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[#131718]/60 flex items-center gap-2">
              <span>//</span> TENTANG DOAMANDEH
            </p>
          </div>
          <div className="md:col-span-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-[1.15] tracking-tight">
              Di Doamandeh, kami melihat perjalanan sebagai bentuk kedamaian pikiran. Setiap elemen layanan kami dirancang untuk menghadirkan pengalaman mutlak bagi Anda.
            </h2>
          </div>
        </div>

        {/* Bagian Bawah: Statistik + Tombol Selengkapnya, Gambar Asimetris & Teks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Kolom Kiri: Statistik + Link (Di atas foto) & Foto Alam & Kendaraan */}
          <div className="md:col-span-5 md:col-start-2 mt-0 md:mt-6 space-y-6">

            {/* Statistik & Tombol Link Selengkapnya di Atas Foto */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#131718]">
              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <p className="text-3xl lg:text-4xl font-medium tracking-tighter mb-0.5">100<span className="text-xl">%</span></p>
                  <p className="text-[10px] uppercase tracking-widest text-[#131718]/60 font-medium">Terpercaya</p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-medium tracking-tighter mb-0.5">24<span className="text-xl">/7</span></p>
                  <p className="text-[10px] uppercase tracking-widest text-[#131718]/60 font-medium">Pelayanan</p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-[#131718] hover:opacity-70 transition-all group cursor-pointer"
              >
                <span>Selengkapnya tentang Doamandeh</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
              </Link>
            </div>

            {/* Foto Alam & Kendaraan */}
            <div className="space-y-3 pt-2">
              <div className="relative aspect-[4/3] w-full bg-gray-200 rounded-none overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                  alt="Doamandeh Services"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#131718]/60">
                <span>[01] ALAM & KENDARAAN</span>
                <span>@2026</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Teks Paragraf dan Foto Villa & Relaksasi */}
          <div className="md:col-span-4 md:col-start-8 flex flex-col gap-10 mt-6 md:mt-0">

            <div className="text-base md:text-lg leading-relaxed text-[#131718]/85 font-light pr-0 md:pr-4 pt-1">
              {aboutText || 'Kami bekerja bersama individu yang menghargai cerita puitis dari sebuah perjalanan. Kami percaya bahwa makna kemewahan dan kedamaian seringkali hidup di sudut-sudut paling tenang dari sebuah destinasi, bukan dalam kebisingan.'}
              <br /><br />
              <span className="tracking-[0.5em] text-lg">✦ ✦ ✦</span>
            </div>

            {/* Foto Kanan (Villa & Relaksasi) */}
            <div className="space-y-3">
              <div className="relative aspect-square w-full sm:w-4/5 bg-gray-200 rounded-none overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
                  alt="Doamandeh Experiences"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#131718]/60 sm:w-4/5">
                <span>[02] VILLA & RELAKSASI</span>
                <span>@2026</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}