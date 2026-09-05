'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rizky & Amelia',
    location: 'Jakarta',
    serviceCategory: 'Paket Tour',
    rating: 5,
    comment: 'Awalnya ragu ikut one-day tour ke Nusa Penida karena takut capek. Ternyata seru banget! Driver-nya super sabar, on-time, dan jago banget cari spot foto sepi buat kita.',
    date: 'Agustus 2026',
    image: '/assets/testimonial-tour.svg',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    location: 'Surabaya',
    serviceCategory: 'Villa Stay',
    rating: 5,
    comment: "Nyari villa buat keluarga tuh lumayan tricky, tapi Do'amandeh ngasih rekomendasi yang pas banget. Villanya asri, bersih, dan private pool-nya aman buat anak-anak main seharian.",
    date: 'Agustus 2026',
    image: '/assets/testimonial-villa.svg',
  },
  {
    id: '3',
    name: 'Kevin & Partner',
    location: 'Jakarta',
    serviceCategory: 'Sewa Motor',
    rating: 5,
    comment: "Sewa NMAX di sini prosesnya gampang banget, nggak ribet. Motornya diantar langsung ke villa kita di Canggu, kondisinya mulus dan bensin udah keisi penuh. Thanks, Do'amandeh!",
    date: 'Juli 2026',
    image: '/assets/testimonial-motor.svg',
  },
  {
    id: '4',
    name: 'Keluarga Pratama',
    location: 'Medan',
    serviceCategory: 'Sewa Mobil',
    rating: 5,
    comment: 'Bawa rombongan keluarga besar jadi gampang karena sewa Innova Reborn plus driver. Bapak supirnya ramah banget dan hafal jalan tikus, jadi kita nggak tua di jalan karena macet.',
    date: 'Juli 2026',
    image: '/assets/testimonial-mobil.svg',
  },
  {
    id: '5',
    name: 'Julian M.',
    location: 'Australia',
    serviceCategory: 'Tattoo Studio',
    rating: 5,
    comment: 'Ini pengalaman tato pertama gue di Bali dan studionya bersih banget! Jarumnya baru dan dibuka di depan kita. Senimannya teliti banget ngerjain fineline custom design gue.',
    date: 'Juni 2026',
    image: '/assets/testimonial-tattoo.svg',
  },
  {
    id: '6',
    name: 'Sarah & Friends',
    location: 'Bandung',
    serviceCategory: 'Surfing Lesson',
    rating: 5,
    comment: 'Nekat nyoba surfing walau nggak terlalu jago berenang, haha! Untung instrukturnya sabar banget ngajarin teknik dasar sampai akhirnya aku bisa berdiri di papan pas ombak datang.',
    date: 'Juni 2026',
    image: '/assets/testimonial-surfing.svg',
  },
];

interface TestimonialsSectionProps {
  testimonialsTitle?: string;
  testimonialsCtaText?: string;
  testimonialsJson?: string;
}

export function TestimonialsSection({
  testimonialsTitle = 'Kisah & pengalaman liburan impian.',
  testimonialsCtaText = 'Bagikan Ceritamu',
  testimonialsJson,
}: TestimonialsSectionProps = {}) {
  let list: Testimonial[] = DEFAULT_TESTIMONIALS;
  if (testimonialsJson) {
    try {
      const parsed = JSON.parse(testimonialsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } catch {
      // fallback to DEFAULT_TESTIMONIALS
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, list.length - itemsPerView);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 45) nextSlide();
    if (diff < -45) prevSlide();
    touchStartXRef.current = null;
  };

  const stepPercent = itemsPerView === 3 ? 33.333333 : itemsPerView === 2 ? 50 : 100;

  return (
    <section
      id="testimonials"
      className="bg-softblue text-softyellow font-sans py-20 lg:py-32 overflow-hidden scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">

            {/* Kolom Kiri: Teks & Kontrol Navigasi */}
            <div className="lg:col-span-3 flex flex-col justify-end lg:pb-6">

              <h2 className="text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight mb-12 text-softyellow">
                {testimonialsTitle}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <Link
                  href="/contact"
                  className="text-[10px] uppercase tracking-widest font-bold border-b border-line pb-1 text-softyellow hover:text-white hover:border-white transition-colors"
                >
                  {testimonialsCtaText}
                </Link>

                {/* Tombol Panah Navigasi Minimalis (Sudut Tajam 90°) & Status Slide */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-softyellow/70 mr-1">
                    0{currentIndex + 1} / 0{maxIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Ulasan sebelumnya"
                    className="p-3 rounded-none border border-line text-softyellow hover:bg-sun hover:text-ink transition-all cursor-pointer shadow-none"
                  >
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Ulasan selanjutnya"
                    className="p-3 rounded-none border border-line text-softyellow hover:bg-sun hover:text-ink transition-all cursor-pointer shadow-none"
                  >
                    <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Carousel Gambar Kotak */}
            <div
              className="lg:col-span-9 overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * stepPercent}%)`,
                }}
              >
                {list.map((item) => (
                  <article
                    key={item.id}
                    className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3 lg:px-4 flex flex-col group select-none"
                  >
                    {/* Foto Persegi Warna Asli (Border 1px DESIGN.md v2) */}
                    <div className="relative aspect-square w-full mb-5 bg-softblue rounded-none overflow-hidden border border-line shadow-none">
                      <Image
                        src={item.image || '/assets/testimonial-tour.svg'}
                        alt={`Testimonial dari ${item.name}`}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Header Konten: Nama & Layanan/Lokasi */}
                    <div className="mb-3">
                      <h3 className="text-sm font-medium uppercase tracking-widest text-softyellow mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[11px] font-medium uppercase tracking-widest text-softyellow/80">
                        {item.location}, {item.serviceCategory}
                      </p>
                    </div>

                    {/* Teks Ulasan */}
                    <p className="text-sm text-softyellow/85 leading-relaxed font-normal line-clamp-3 mb-4 pr-4">
                      &ldquo;{item.comment}&rdquo;
                    </p>

                    {/* Bintang & Tanggal */}
                    <div className="flex items-center gap-1 mt-auto pt-2">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-softyellow text-softyellow" />
                      ))}
                      <span className="text-[10px] text-softyellow/60 uppercase tracking-wider ml-2 font-mono">
                        {item.date}
                      </span>
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