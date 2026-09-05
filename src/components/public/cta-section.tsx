'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface CtaSectionProps {
  ctaTagline?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  whatsappNumber?: string;
  cardImages?: {
    travel?: string;
    vehicle?: string;
    villa?: string;
    tattoo?: string;
    surfing?: string;
  };
}

interface ServiceCard {
  id: string;
  title: string;
  category: string;
  badgeText: string;
  rating: string;
  description: string;
  imageUrl: string;
  waText: string;
}

const SERVICES_DATA: ServiceCard[] = [
  {
    id: 'paket-tour',
    title: 'Paket Tour & Travel',
    category: 'TOUR & TRAVEL',
    badgeText: 'Mulai Rp 500rb',
    rating: '4.9',
    description:
      'Jelajahi keindahan destinasi terbaik Bali seharian penuh tanpa pusing rute. Pesan paket tour impianmu bersama Doamandeh sekarang!',
    imageUrl: '/assets/service-travel.jpg',
    waText: 'Halo Doamandeh, saya ingin pesan Paket Tour & Travel di Bali.',
  },
  {
    id: 'sewa-kendaraan',
    title: 'Sewa Motor & Mobil',
    category: 'SEWA KENDARAAN',
    badgeText: 'Mulai Rp 75rb',
    rating: '4.9',
    description:
      'Nikmati kebebasan keliling Pulau Bali dengan armada kendaraan matic bersih, terawat, dan gratis antar-jemput. Sewa kendaraanmu hari ini!',
    imageUrl: '/assets/service-vehicle.jpg',
    waText: 'Halo Doamandeh, saya ingin sewa kendaraan (motor/mobil) di Bali.',
  },
  {
    id: 'villa-stay',
    title: 'Villa Private Pool',
    category: 'VILLA STAY',
    badgeText: 'Mulai Rp 1.5jt',
    rating: '4.9',
    description:
      'Bersantai penuh di villa eksklusif private pool berfasilitas lengkap & housekeeping harian. Booking tempat menginap terbaikmu sekarang!',
    imageUrl: '/assets/service-villa.jpg',
    waText: 'Halo Doamandeh, saya ingin booking Villa Private Pool di Bali.',
  },
  {
    id: 'tattoo-studio',
    title: 'Professional Tattoo Studio',
    category: 'TATTOO STUDIO',
    badgeText: '100% Steril & Higienis',
    rating: '5.0',
    description:
      'Abadikan kenangan liburan di Bali dengan tato custom dari artist profesional. Jarum sekali pakai & standar medis higienis. Konsultasikan tatomu!',
    imageUrl: '/assets/service-tattoo.jpg',
    waText: 'Halo Doamandeh, saya ingin konsultasi & booking di Tattoo Studio.',
  },
  {
    id: 'surfing-lesson',
    title: 'Surfing Lesson Pemula',
    category: 'SURFING LESSON',
    badgeText: 'Mulai Rp 350rb',
    rating: '4.9',
    description:
      'Taklukkan ombak pertamamu dengan aman & fun bareng instruktur lokal berpengalaman 1-on-1. Daftarkan dirimu untuk kelas surfing sekarang!',
    imageUrl: '/assets/service-surfing.png',
    waText: 'Halo Doamandeh, saya tertarik ikut Surfing Lesson di Bali.',
  },
];

export function CtaSection({
  ctaTagline = '// LAYANAN UNGGULAN DOAMANDEH',
  ctaTitle = 'Solusi lengkap \nliburanmu di Bali.',
  ctaSubtitle = 'Pilih layanan favoritmu dari Doamandeh untuk pengalaman wisata, akomodasi, serta lifestyle terbaik di Pulau Dewata.',
  ctaButtonText = 'Pesan Layanan Sekarang',
  whatsappNumber = '+62 812-3456-7890',
  cardImages,
}: CtaSectionProps = {}) {
  const services: ServiceCard[] = [
    {
      ...SERVICES_DATA[0],
      imageUrl: cardImages?.travel || SERVICES_DATA[0].imageUrl,
    },
    {
      ...SERVICES_DATA[1],
      imageUrl: cardImages?.vehicle || SERVICES_DATA[1].imageUrl,
    },
    {
      ...SERVICES_DATA[2],
      imageUrl: cardImages?.villa || SERVICES_DATA[2].imageUrl,
    },
    {
      ...SERVICES_DATA[3],
      imageUrl: cardImages?.tattoo || SERVICES_DATA[3].imageUrl,
    },
    {
      ...SERVICES_DATA[4],
      imageUrl: cardImages?.surfing || SERVICES_DATA[4].imageUrl,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const mainWaUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Doamandeh Tours & Travel, saya ingin berkonsultasi mengenai layanan wisata & liburan di Bali.'
  )}`;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + services.length) % services.length
    );
  };

  // Drag / Swipe Handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 60;
    if (dragOffset.x < -threshold) {
      nextSlide();
    } else if (dragOffset.x > threshold) {
      prevSlide();
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const activeService = services[currentIndex] || services[0];
  const activeWaUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    activeService.waText
  )}`;

  return (
    <section
      id="contact"
      className="relative bg-softyellow text-brown py-16 md:py-24 lg:py-28 font-sans overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Kolom Kiri: Header, Subtitle & Tombol Utama */}
          <FadeIn direction="up" className="md:col-span-6 lg:col-span-5 flex flex-col justify-center">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-brown/80 flex items-center gap-2 mb-3">
                <span>{ctaTagline}</span>
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight text-brown mb-4 whitespace-pre-line">
                {ctaTitle}
              </h2>

              <p className="text-sm md:text-base text-brown/80 leading-relaxed font-light mb-8 max-w-md">
                {ctaSubtitle}
              </p>

              <a
                href={mainWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brown text-softyellow px-6 py-3.5 text-xs md:text-sm font-medium tracking-wider uppercase hover:bg-black rounded-none border-2 border-brown hover:border-black transition-colors cursor-pointer shadow-none"
              >
                <span>{ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>

          {/* Kolom Kanan: Tumpukan Kartu Foto (Sudut Tajam 0px DESIGN.md) */}
          <FadeIn direction="up" delay={0.15} className="md:col-span-6 lg:col-span-7 flex flex-col items-center justify-center py-4">

            {/* Tumpukan Kartu Sharp 90° Border-2 */}
            <div className="relative w-full max-w-[300px] sm:max-w-[330px] md:max-w-[350px] h-[440px] sm:h-[470px] mx-auto select-none touch-none flex items-center justify-center">
              {services.map((service, index) => {
                const len = services.length;
                const isCurrent = index === currentIndex;
                const isNext = index === (currentIndex + 1) % len;
                const isPrev = index === (currentIndex - 1 + len) % len;

                if (!isCurrent && !isNext && !isPrev) return null;

                let zIndex = 10;
                let scale = 0.88;
                let translateX = 0;
                let rotate = 0;
                let opacity = 0.75;

                if (isCurrent) {
                  zIndex = 30;
                  scale = 1;
                  translateX = dragOffset.x;
                  rotate = dragOffset.x * 0.04;
                  opacity = 1;
                } else if (isNext) {
                  zIndex = 15;
                  scale = 0.88;
                  translateX = 36;
                  rotate = 4;
                  opacity = 0.75;
                } else if (isPrev) {
                  zIndex = 15;
                  scale = 0.88;
                  translateX = -36;
                  rotate = -4;
                  opacity = 0.75;
                }

                return (
                  <div
                    key={service.id}
                    onMouseDown={(e) => isCurrent && handleStart(e.clientX, e.clientY)}
                    onMouseMove={(e) => isCurrent && handleMove(e.clientX, e.clientY)}
                    onMouseUp={() => isCurrent && handleEnd()}
                    onMouseLeave={() => isCurrent && handleEnd()}
                    onTouchStart={(e) =>
                      isCurrent && handleStart(e.touches[0].clientX, e.touches[0].clientY)
                    }
                    onTouchMove={(e) =>
                      isCurrent && handleMove(e.touches[0].clientX, e.touches[0].clientY)
                    }
                    onTouchEnd={() => isCurrent && handleEnd()}
                    style={{
                      zIndex: zIndex,
                      transform: `translate3d(${translateX}px, 0px, 0px) scale(${scale}) rotate(${rotate}deg)`,
                      opacity: opacity,
                      transition: isDragging && isCurrent ? 'none' : 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                    className={`absolute inset-0 w-full h-full rounded-none overflow-hidden border-2 border-softyellow shadow-none flex flex-col justify-between p-6 bg-brown ${
                      isCurrent ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                    }`}
                  >
                    {/* Background Image */}
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      priority={isCurrent}
                      sizes="350px"
                      className="object-cover pointer-events-none"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                    {/* Card Top: Category Badge & Title Overlay */}
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center pt-2">
                      <span className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-brown/80 text-softyellow border-2 border-softyellow rounded-none">
                        {service.category}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-medium text-softyellow tracking-tight leading-tight mt-1">
                        {service.title}
                      </h3>
                    </div>

                    {/* Card Bottom: Description, Price & Button */}
                    <div className="relative z-10 flex flex-col gap-3">
                      <p className="text-xs text-softyellow/85 leading-relaxed font-light line-clamp-2 text-left">
                        {service.description}
                      </p>

                      <div className="flex items-end justify-between gap-3 pt-3 border-t border-softyellow/25">
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-softyellow/70 font-light uppercase tracking-wider">
                            Mulai Dari
                          </span>
                          <span className="text-base sm:text-lg font-bold text-softyellow">
                            {service.badgeText}
                          </span>
                        </div>

                        <a
                          href={activeWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 bg-softyellow text-brown font-bold text-xs uppercase tracking-wider rounded-none hover:bg-white hover:text-black transition-all shadow-none shrink-0 border border-softyellow"
                        >
                          Pesan
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Indikator Geser Minimalis Natural & Bar Navigasi Sharp */}
            <div className="flex flex-col items-center justify-center gap-2.5 mt-6 z-30">
              <div className="flex items-center gap-2 text-[11px] font-light tracking-[0.2em] uppercase text-brown/70">
                <span className="text-brown/40 font-normal">‹</span>
                <span>Geser kartu</span>
                <span className="text-brown/40 font-normal">›</span>
              </div>

              {/* Bar Indicator Minimalis Sharp */}
              <div className="flex items-center gap-1.5">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-brown'
                        : 'w-1.5 bg-brown/25 hover:bg-brown/40'
                    }`}
                  />
                ))}
              </div>
            </div>

          </FadeIn>
        </div>
      </div>
    </section>
  );
}