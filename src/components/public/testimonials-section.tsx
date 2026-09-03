'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

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
    comment: 'Paket perjalanan 1 hari ke Nusa Penida sangat terorganisir. Driver ramah dan banyak membantu mengambil foto tempat indah!',
    date: 'Agustus 2026',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    location: 'Surabaya',
    serviceCategory: 'Villa Stay',
    rating: 5,
    comment: 'Villanya bersih, private pool luas dan sangat privat. Proses booking cepat tanpa hambatan via website.',
    date: 'Agustus 2026',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Kevin & Partner',
    location: 'Jakarta',
    serviceCategory: 'Sewa Motor',
    rating: 5,
    comment: 'Sewa motor NMAX mulus dan mesin terawat prima. Langsung diantar tepat waktu ke penginapan di Canggu. Recommended!',
    date: 'Juli 2026',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Keluarga Pratama',
    location: 'Medan',
    serviceCategory: 'Sewa Mobil',
    rating: 5,
    comment: 'Mobil Innova Reborn sangat bersih dan AC dingin. Driver ramah serta paham rute Bali untuk menghindari kemacetan.',
    date: 'Juli 2026',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Julian M.',
    location: 'Australia',
    serviceCategory: 'Tattoo Studio',
    rating: 5,
    comment: 'Super clean studio with meticulous fineline tattoo design. Needle unsealed right in front of me! Professional artist.',
    date: 'Juni 2026',
    image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    name: 'Sarah & Friends',
    location: 'Bandung',
    serviceCategory: 'Surfing Lesson',
    rating: 5,
    comment: 'Instruktur surfing sangat sabar & ramah. Langsung bisa stand up di surfboard pada sesi pertama di Pantai Kuta!',
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
    <section className="bg-[#504139] text-[#FFF6C6] font-sans py-20 lg:py-32 overflow-hidden border-y border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">

          {/* Kolom Kiri: Teks & Kontrol Navigasi */}
          <div className="lg:col-span-3 flex flex-col justify-end lg:pb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#FEC29F] mb-6">
              Ulasan Pelanggan
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-12 text-[#FFF6C6]">
              Kisah &amp; pengalaman liburan impian.
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <Link
                href="/reviews"
                className="text-[10px] uppercase tracking-widest font-bold border-b border-[#FFF6C6]/40 pb-1 text-[#FFF6C6] hover:text-white hover:border-white transition-colors"
              >
                Lihat Semua Ulasan
              </Link>

              {/* Tombol Panah Navigasi Minimalis */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Ulasan sebelumnya"
                  className="p-2 text-[#FFF6C6] hover:text-white hover:opacity-75 transition-opacity cursor-pointer"
                >
                  <ArrowLeft className="w-6 h-6 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Ulasan selanjutnya"
                  className="p-2 text-[#FFF6C6] hover:text-white hover:opacity-75 transition-opacity cursor-pointer"
                >
                  <ArrowRight className="w-6 h-6 stroke-[1.5]" />
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
                  <div className="relative aspect-square w-full mb-5 bg-[#3D312A] rounded-none overflow-hidden border border-white/10">
                    <Image
                      src={item.image}
                      alt={`Testimonial dari ${item.name}`}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Header Konten: Nama (Cream) & Layanan/Lokasi (Peach) */}
                  <div className="mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#FFF6C6] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#FEC29F]">
                      {item.location}, {item.serviceCategory}
                    </p>
                  </div>

                  {/* Teks Ulasan */}
                  <p className="text-sm text-white/85 leading-relaxed font-normal line-clamp-3 mb-4 pr-4">
                    &ldquo;{item.comment}&rdquo;
                  </p>

                  {/* Bintang & Tanggal */}
                  <div className="flex items-center gap-1 mt-auto pt-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#FFF6C6] text-[#FFF6C6]" />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}