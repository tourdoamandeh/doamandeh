'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Menu, X, Phone } from 'lucide-react';
import { ServiceCategory } from '@/types/database';

interface ServiceSlide {
  id: number;
  category: ServiceCategory;
  label: string;
  tag: string;
  title: string;
  quote: string;
  description: string;
  carouselImage: string;
}

const services: ServiceSlide[] = [
  {
    id: 1,
    category: 'travel',
    label: 'Travel',
    tag: 'Paket Travel',
    title: 'Paket Tour Wisata Bali',
    quote: 'Biar kami yang merencanakan,\nkamu cukup menikmati\n— momennya.',
    description:
      'Temukan Bali yang sebenarnya. Dari pesona pura sakral hingga pantai tersembunyi, paket perjalanan kami dirancang agar kamu bisa bersantai penuh tanpa pusing memikirkan rute atau tiket.',
    carouselImage: '/assets/service-travel.svg',
  },
  {
    id: 2,
    category: 'villa',
    label: 'Villa',
    tag: 'Villa Stay',
    title: 'Villa & Private Pool Stay',
    quote: 'Ruang tenang untuk\nkembali berpulang\n— di tengah surga tropis.',
    description:
      'Setelah seharian menjelajah, rebahkan diri di villa eksklusif pilihan Doamandeh. Nikmati privasi penuh, kolam renang pribadi, dan suasana tenang yang membuatmu merasa seperti di rumah sendiri.',
    carouselImage: '/assets/service-villa.svg',
  },
  {
    id: 3,
    category: 'surfing-lesson',
    label: 'Surfing Lesson',
    tag: 'Surfing Lesson',
    title: 'Surfing Lesson Bali',
    quote: 'Taklukkan ombak,\nbebaskan jiwa\n— di pantai Bali.',
    description:
      'Belum pernah menyentuh papan selancar? Tidak masalah. Instruktur ramah kami siap membantumu berdiri dan menunggangi ombak pertamamu dengan aman, seru, dan penuh tawa.',
    carouselImage: '/assets/service-surfing.svg',
  },
  {
    id: 4,
    category: 'vehicle-rental',
    label: 'Sewa Kendaraan',
    tag: 'Sewa Kendaraan',
    title: 'Sewa Kendaraan Motor & Mobil',
    quote: 'Jelajahi setiap sudutnya,\ntemukan ceritamu sendiri\n— di Bali.',
    description:
      'Tinggalkan jadwal yang kaku. Dengan pilihan motor matic dan mobil pribadi kami yang terawat rapi, kamu bebas menentukan sendiri ke mana angin Bali akan membawamu hari ini.',
    carouselImage: '/assets/service-vehicle.svg',
  },
  {
    id: 5,
    category: 'tattoo',
    label: 'Tato',
    tag: 'Tato Studio',
    title: 'Professional Tattoo Studio',
    quote: 'Bawa pulang kenangan\nyang tak akan pernah pudar\n— bersama seniman terbaik.',
    description:
      'Ceritakan perjalananmu lewat seni tubuh custom di studio higienis kami. Dikerjakan oleh seniman lokal Bali dengan standar kebersihan internasional yang ketat.',
    carouselImage: '/assets/service-tattoo.svg',
  },
];

const LEFT_BACKGROUND_IMAGE = '/assets/hero-bali.svg';

interface HeroSectionProps {
  heroSubtitle?: string;
  whatsappNumber?: string;
}

export function HeroSection({
  heroSubtitle,
  whatsappNumber = '+62 812-3456-7890',
}: HeroSectionProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) nextSlide();
    if (diff < -40) prevSlide();
    setTouchStartX(null);
  };

  const currentService = services[currentIndex];
  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Doamandeh, saya butuh teman ngobrol untuk merencanakan liburan.'
  )}`;

  return (
    <section className="relative w-full min-h-[100dvh] md:h-screen md:max-h-screen flex flex-col md:flex-row bg-white font-sans text-black overflow-hidden">
      {/* Kolom Kiri: Desktop Only */}
      <div className="hidden md:block relative md:w-1/2 md:h-full overflow-hidden group shrink-0">
        <Image
          src={LEFT_BACKGROUND_IMAGE}
          alt="Bali Paradise Landscape"
          fill
          priority
          sizes="50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
        <a
          href="#services"
          aria-label="Scroll ke katalog layanan"
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 text-softyellow/90 hover:text-softyellow p-2 hover:scale-110 transition-transform"
        >
          <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 font-light stroke-[1.2]" />
        </a>
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 max-w-sm z-10">
          <p className="text-softyellow text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight drop-shadow-lg whitespace-pre-line">
            {currentService.quote}
          </p>
        </div>
      </div>

      {/* Kolom Kanan / Kontainer Mobile Utama */}
      <div className="relative w-full md:w-1/2 min-h-[100dvh] md:min-h-0 md:h-full flex flex-col justify-between bg-brown p-5 sm:p-7 md:p-8 lg:p-10 xl:p-12 overflow-hidden">

        {/* Dropdown Mobile */}
        {menuOpen && (
          <div className="absolute top-16 right-5 z-30 bg-white border border-gray-200 rounded-none shadow-xl p-5 w-60 space-y-3 animate-fadeIn">
            <p className="text-[10px] uppercase tracking-widest text-black/50 font-semibold mb-2">
              Menu Navigasi
            </p>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-peach transition-colors">Beranda</Link>
            <Link href="#services" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-peach transition-colors">Layanan</Link>
            <Link href="#about" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-peach transition-colors">Tentang Kami</Link>
            <Link href="#contact" onClick={() => setMenuOpen(false)} className="block text-sm font-medium hover:text-peach transition-colors">Hubungi Kami</Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-xs font-medium text-emerald-700 pt-2 border-t border-gray-100">
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Admin</span>
            </a>
          </div>
        )}

        {/* 1. Bagian Atas: Title & Navigasi */}
        <div className="shrink-0 pt-1 md:pt-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-4xl sm:text-5xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight text-softyellow leading-[1.05] md:leading-[1.08]">
              Doamandeh, <br />
              — Rencanakan <br />
              Perjalanan
            </h1>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Buka Menu"
              className="p-1 text-softyellow hover:bg-white/10 transition-colors shrink-0 rounded-none"
            >
              {menuOpen ? <X className="w-7 h-7 stroke-[1.5]" /> : <Menu className="w-7 h-7 stroke-[1.5]" />}
            </button>
          </div>

          <nav aria-label="Navigasi Halaman" className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-7 mt-6 sm:mt-8 md:mt-3 lg:mt-4">
            <Link href="/" className="text-sm md:text-sm text-softyellow/60 hover:text-softyellow transition-colors font-medium cursor-pointer">Beranda</Link>
            <Link href="#about" className="text-sm md:text-sm text-softyellow/60 hover:text-softyellow transition-colors font-medium cursor-pointer">Tentang Kami</Link>
            <Link href="#services" className="text-sm md:text-sm text-softyellow/60 hover:text-softyellow transition-colors font-medium cursor-pointer">Layanan</Link>
            <Link href="#contact" className="text-sm md:text-sm text-softyellow/60 hover:text-softyellow transition-colors font-medium cursor-pointer">Hubungi Kami</Link>
          </nav>
        </div>

        {/* 2. Bagian Tengah: Foto Carousel */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center my-6 sm:my-8 md:my-2 lg:my-3">
          <div className="flex items-center justify-center gap-0 md:gap-6 w-full h-full md:h-auto relative">

            {/* Panah Kiri Desktop */}
            <button
              type="button"
              onClick={prevSlide}
              className="hidden md:flex p-2 text-softyellow/40 hover:text-softyellow transition-all hover:scale-125 cursor-pointer shrink-0 select-none items-center justify-center"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><polygon points="18,3 6,12 18,21" /></svg>
            </button>

            {/* Container Foto */}
            <div
              className="relative w-full md:w-auto h-full max-h-[50vh] md:h-[24vh] lg:h-[28vh] xl:h-[30vh] md:max-h-[230px] lg:max-h-[260px] xl:max-h-[280px] aspect-square md:aspect-[3/4] bg-transparent overflow-hidden shadow-md rounded-none shrink-0 select-none cursor-grab active:cursor-grabbing border-2 border-softyellow"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {services.map((service) => (
                  <div key={service.id} className="relative w-full h-full shrink-0 rounded-none overflow-hidden">
                    <Image
                      src={service.carouselImage}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      priority={service.id === 1}
                      className="object-cover w-full h-full rounded-none"
                    />
                  </div>
                ))}
              </div>

              {/* Panah Kiri Mobile */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-softyellow/80 hover:text-softyellow transition-all active:scale-90 cursor-pointer drop-shadow-md"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <polygon points="16,3 4,12 16,21" />
                </svg>
              </button>

              {/* Panah Kanan Mobile */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-softyellow/80 hover:text-softyellow transition-all active:scale-90 cursor-pointer drop-shadow-md"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <polygon points="8,3 20,12 8,21" />
                </svg>
              </button>
            </div>

            {/* Panah Kanan Desktop */}
            <button
              type="button"
              onClick={nextSlide}
              className="hidden md:flex p-2 text-softyellow/40 hover:text-softyellow transition-all hover:scale-125 cursor-pointer shrink-0 select-none items-center justify-center"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><polygon points="6,3 18,12 6,21" /></svg>
            </button>
          </div>

          {/* Indikator Dots / Baris Slide di Bawah Foto */}
          <div className="flex items-center justify-center gap-2 mt-3 mb-1">
            {services.map((service, idx) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ke layanan ${service.label}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                  ? 'w-7 bg-softyellow shadow-sm'
                  : 'w-2 bg-softyellow/30 hover:bg-softyellow/60'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* 3. Bagian Bawah: Penjelasan */}
        <div className="shrink-0 space-y-3 md:space-y-2 max-w-lg mx-auto md:mx-0 w-full text-left pb-4 md:pb-0">
          <div className="flex items-center justify-start">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-softyellow/60 font-medium">
              LAYANAN 0{currentService.id} / 0{services.length} — {currentService.title.toUpperCase()}
            </span>
          </div>

          <p className="text-sm md:text-base text-softyellow/85 leading-relaxed font-normal line-clamp-3 md:line-clamp-2 lg:line-clamp-3 transition-all duration-300 text-justify md:text-left">
            {currentService.description}
          </p>

          <div className="pt-1 flex items-center justify-start gap-4 md:gap-5 text-xs md:text-sm font-medium">
            <Link
              href={`/category/${currentService.category}`}
              className="inline-flex items-center gap-1.5 text-softyellow hover:opacity-75 transition-opacity"
            >
              <span>Jelajahi {currentService.label}</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </Link>

            <span className="text-softyellow/30">•</span>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-softyellow/70 hover:text-softyellow transition-colors"
            >
              <span>Konsultasi</span>
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}