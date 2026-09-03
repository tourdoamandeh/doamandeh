import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';

interface CtaSectionProps {
  whatsappNumber?: string;
}

export function CtaSection({
  whatsappNumber = '+62 812-3456-7890',
}: CtaSectionProps) {
  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Doamandeh Tours and Travel, saya siap memulai liburan.'
  )}`;

  return (
    <section
      id="contact"
      className="bg-[#FFF6C6] font-sans flex items-center justify-center py-0"
    >
      {/* Kontainer Utama meniru layar HP pada referensi gambar */}
      <div className="w-full bg-[#607a8f] text-[#FFF6C6] flex flex-col items-center justify-between py-16 px-6 lg:px-16 min-h-[85vh] lg:min-h-[80vh]">

        {/* Gambar dengan Masking Geometris Organik & Border #FFF6C6 */}
        <FadeIn direction="up" className="w-full max-w-[250px] sm:max-w-[300px] lg:max-w-[330px] aspect-square relative mb-8 sm:mb-10">
          <div
            className="w-full h-full relative p-[3px] bg-[#FFF6C6]"
            style={{
              clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'
            }}
          >
            <div
              className="w-full h-full relative overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
                alt="Pemandangan Bali"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </FadeIn>

        {/* Area Teks & Tombol (Rata Kiri) */}
        <FadeIn direction="up" delay={0.2} className="w-full max-w-sm lg:max-w-md flex flex-col items-start gap-4 text-left">
          <h2 className="text-4xl md:text-5xl lg:text-5xl tracking-tight leading-[1.08]">
            Jelajahi Bali dengan santai.
          </h2>

          <p className="text-sm md:text-base text-[#FFF6C6]/80 leading-relaxed font-light mt-2 mb-4">
            Temukan rencana perjalanan yang paling pas buatmu dan wujudkan liburan tak terlupakan bareng Doamandeh. Semuanya semudah ngobrol bareng teman.
          </p>

          {/* Tombol Aksi: Hubungi Kami & Cek Semua Layanan */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3.5 mt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 flex items-center justify-center bg-[#FFF6C6] text-[#131718] py-4 px-6 hover:bg-[#fff6c6]/90 transition-colors cursor-pointer text-xs md:text-sm font-bold tracking-widest uppercase rounded-none"
            >
              Hubungi Kami
            </a>
            <Link
              href="#services"
              className="w-full sm:flex-1 flex items-center justify-center border border-[#FFF6C6] text-[#FFF6C6] py-4 px-6 hover:bg-[#FFF6C6] hover:text-[#131718] transition-colors cursor-pointer text-xs md:text-sm font-bold tracking-widest uppercase rounded-none"
            >
              Cek Semua Layanan
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}