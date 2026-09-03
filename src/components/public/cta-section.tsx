import Image from 'next/image';
import Link from 'next/link';

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
      className="bg-[#FFFFFF] font-sans border-y border-[#131718] flex items-center justify-center py-0"
    >
      {/* Kontainer Utama meniru layar HP pada referensi gambar */}
      <div className="w-full bg-[#607a8f] text-[#FFF6C6] flex flex-col items-center justify-between py-16 px-6 lg:px-16 min-h-[85vh] lg:min-h-[80vh]">

        {/* Gambar dengan Masking Geometris Organik (Mirip bentuk 4 kelopak bunga/clover) */}
        <div className="w-full max-w-sm lg:max-w-md aspect-square relative mb-12">
          {/* Masking Style menggunakan Tailwind arbitrary variants */}
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
              className="object-cover"
            />
          </div>
        </div>

        {/* Area Teks & Tombol (Rata Kiri) */}
        <div className="w-full max-w-sm lg:max-w-md flex flex-col items-start gap-4 text-left">

          <h2 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.05]">
            Explore
            the world
            with ease
          </h2>

          <p className="text-sm text-[#FFF6C6]/80 leading-relaxed font-light mt-2 mb-4">
            Find your perfect trip and book unforgettable experiences in just a few taps.
          </p>

          {/* Tombol Aksi: Hubungi Kami & Cek Semua Layanan */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3.5 mt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 flex items-center justify-center bg-[#FFF6C6] text-[#131718] py-4 px-6 hover:bg-white transition-colors cursor-pointer text-xs md:text-sm font-bold tracking-widest uppercase rounded-none"
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
        </div>
      </div>
    </section>
  );
}