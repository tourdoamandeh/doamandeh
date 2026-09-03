'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  serviceCategory: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rizky & Amelia',
    location: 'Jakarta',
    serviceCategory: 'Paket Tour',
    rating: 5,
    comment: 'Awalnya ragu ikut one-day tour ke Nusa Penida karena takut capek. Ternyata seru banget! Driver-nya super sabar, on-time, dan jago banget cari spot foto sepi buat kita.',
    date: 'Agustus 2026',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    location: 'Surabaya',
    serviceCategory: 'Villa Stay',
    rating: 5,
    comment: 'Nyari villa buat keluarga tuh lumayan tricky, tapi Doamandeh ngasih rekomendasi yang pas banget. Villanya asri, bersih, dan private pool-nya aman buat anak-anak main seharian.',
    date: 'Agustus 2026',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Kevin & Partner',
    location: 'Jakarta',
    serviceCategory: 'Sewa Motor',
    rating: 5,
    comment: 'Sewa NMAX di sini prosesnya gampang banget, nggak ribet. Motornya diantar langsung ke villa kita di Canggu, kondisinya mulus dan bensin udah keisi penuh. Thanks, Doamandeh!',
    date: 'Juli 2026',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Keluarga Pratama',
    location: 'Medan',
    serviceCategory: 'Sewa Mobil',
    rating: 5,
    comment: 'Bawa rombongan keluarga besar jadi gampang karena sewa Innova Reborn plus driver. Bapak supirnya ramah banget dan hafal jalan tikus, jadi kita nggak tua di jalan karena macet.',
    date: 'Juli 2026',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Julian M.',
    location: 'Australia',
    serviceCategory: 'Tattoo Studio',
    rating: 5,
    comment: 'Ini pengalaman tato pertama gue di Bali dan studionya bersih banget! Jarumnya baru dan dibuka di depan kita. Senimannya teliti banget ngerjain fineline custom design gue.',
    date: 'Juni 2026',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Sarah & Friends',
    location: 'Bandung',
    serviceCategory: 'Surfing Lesson',
    rating: 5,
    comment: 'Nekat nyoba surfing walau nggak terlalu jago berenang, haha! Untung instrukturnya sabar banget ngajarin teknik dasar sampai akhirnya aku bisa berdiri di papan pas ombak datang.',
    date: 'Juni 2026',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#607a8f] text-[#fff6c6] font-sans py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">

          {/* Kolom Kiri: Teks & Kontrol Navigasi */}
          <div className="lg:col-span-3 flex flex-col justify-end lg:pb-6">

            <h2 className="text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight mb-12 text-[#fff6c6]">
              Kisah &amp; pengalaman liburan impian.
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <Link
                href="/reviews"
                className="text-[10px] uppercase tracking-widest font-bold border-b border-[#FFFFFF]/40 pb-1 text-[#fff6c6] hover:text-white hover:border-white transition-colors"
              >
                Lihat Semua Ulasan
              </Link>

              {/* Tombol Panah Navigasi Minimalis */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Ulasan sebelumnya"
                  className="p-3 rounded-full border border-[#FFF6C6]/30 text-[#fff6c6] hover:bg-[#FFF6C6] hover:text-[#607a8f] transition-all cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Ulasan selanjutnya"
                  className="p-3 rounded-full border border-[#FFF6C6]/30 text-[#fff6c6] hover:bg-[#FFF6C6] hover:text-[#607a8f] transition-all cursor-pointer shadow-sm"
                >
                  <ArrowRight className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Carousel Gambar Kotak */}
          <div className="lg:col-span-9 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                // Menggeser kartu berdasarkan lebar persen agar responsif
                transform: `translateX(calc(-${currentIndex} * (100% / 1.1)))`,
              }}
            >
              {TESTIMONIALS.map((item) => (
                <article
                  key={item.id}
                  className="w-[85vw] sm:w-[50vw] lg:w-[33.333%] shrink-0 px-3 lg:px-4 flex flex-col group cursor-grab active:cursor-grabbing"
                >
                  {/* Foto Persegi Warna Asli (Aspect Square) */}
                  <div className="relative aspect-square w-full mb-5 bg-[#4a6173] rounded-none overflow-hidden border-2 border-[#fff6c6] shadow-sm">
                    <Image
                      src={item.image}
                      alt={`Testimonial dari ${item.name}`}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Header Konten: Nama (FFFFFF) & Layanan/Lokasi (Peach) */}
                  <div className="mb-3">
                    <h3 className="text-sm font-medium uppercase tracking-widest text-[#fff6c6] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-[#fff6c6]">
                      {item.location}, {item.serviceCategory}
                    </p>
                  </div>

                  {/* Teks Ulasan */}
                  <p className="text-sm text-[#fff6c6]/85 leading-relaxed font-normal line-clamp-3 mb-4 pr-4">
                    &ldquo;{item.comment}&rdquo;
                  </p>

                  {/* Bintang & Tanggal */}
                  <div className="flex items-center gap-1 mt-auto pt-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#FFFFFF] text-[#fff6c6]" />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
        </FadeIn>
      </div>
    </section>
  );
}