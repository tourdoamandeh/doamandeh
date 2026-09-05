'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
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
    label: 'Tour',
    tag: 'Paket Tour',
    title: 'Paket Tour Wisata Bali',
    quote: 'Biar kami yang merencanakan,\nkamu cukup menikmati\n— momennya.',
    description:
      'Temukan Bali yang sebenarnya. Dari pesona pura sakral hingga pantai tersembunyi, paket perjalanan kami dirancang agar kamu bisa bersantai penuh tanpa pusing memikirkan rute atau tiket.',
    carouselImage: '/assets/service-travel.jpg',
  },
  {
    id: 2,
    category: 'villa',
    label: 'Villa',
    tag: 'Villa Stay',
    title: 'Villa & Private Pool Stay',
    quote: 'Ruang tenang untuk\nkembali berpulang\n— di tengah surga tropis.',
    description:
      "Setelah seharian menjelajah, rebahkan diri di villa eksklusif pilihan Do'amandeh. Nikmati privasi penuh, kolam renang pribadi, dan suasana tenang yang membuatmu merasa seperti di rumah sendiri.",
    carouselImage: '/assets/service-villa.jpg',
  },
  {
    id: 3,
    category: 'surfing-lesson',
    label: 'Surfing',
    tag: 'Surfing Lesson',
    title: 'Surfing Lesson Bali',
    quote: 'Taklukkan ombak,\nbebaskan jiwa\n— di pantai Bali.',
    description:
      'Belum pernah menyentuh papan selancar? Tidak masalah. Instruktur ramah kami siap membantumu berdiri dan menunggangi ombak pertamamu dengan aman, seru, dan penuh tawa.',
    carouselImage: '/assets/service-surfing.png',
  },
  {
    id: 4,
    category: 'vehicle-rental',
    label: 'Rental',
    tag: 'Sewa Kendaraan',
    title: 'Sewa Kendaraan Motor & Mobil',
    quote: 'Jelajahi setiap sudutnya,\ntemukan ceritamu sendiri\n— di Bali.',
    description:
      'Tinggalkan jadwal yang kaku. Dengan pilihan motor matic dan mobil pribadi kami yang terawat rapi, kamu bebas menentukan sendiri ke mana angin Bali akan membawamu hari ini.',
    carouselImage: '/assets/service-vehicle.jpg',
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
    carouselImage: '/assets/service-tattoo.jpg',
  },
];

const LEFT_BACKGROUND_IMAGE = '/assets/hero-bali.jpg';
const SLIDE_DURATION = 5000; // 5 detik per slide auto-advance

import { SiteSettingsInput } from '@/lib/validations/admin';

interface HeroSectionProps {
  heroTitle?: string;
  heroSubtitle?: string;
  whatsappNumber?: string;
  settings?: Partial<SiteSettingsInput>;
}

export function HeroSection({
  heroTitle,
  heroSubtitle,
  whatsappNumber = '+62 812-3456-7890',
  settings,
}: HeroSectionProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const dynamicServices = React.useMemo(() => {
    return services.map((s) => {
      let customImg = s.carouselImage;
      if (s.category === 'travel' && settings?.hero_slide_travel_img) customImg = settings.hero_slide_travel_img;
      if (s.category === 'villa' && settings?.hero_slide_villa_img) customImg = settings.hero_slide_villa_img;
      if (s.category === 'surfing-lesson' && settings?.hero_slide_surfing_img) customImg = settings.hero_slide_surfing_img;
      if (s.category === 'vehicle-rental' && settings?.hero_slide_vehicle_img) customImg = settings.hero_slide_vehicle_img;
      if (s.category === 'tattoo' && settings?.hero_slide_tattoo_img) customImg = settings.hero_slide_tattoo_img;

      return {
        ...s,
        carouselImage: customImg,
      };
    });
  }, [settings]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === dynamicServices.length - 1 ? 0 : prev + 1));
  }, [dynamicServices.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? dynamicServices.length - 1 : prev - 1));
  }, [dynamicServices.length]);

  // Auto-advance timer (ganti slide otomatis tiap 5 detik di latar belakang)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
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

  // Smooth auto-scroll saat mendarat dengan hash pada URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, []);

  // Smooth scroll handler untuk menu navigasi internal
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.replace(/^\/?#/, '');
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        setTimeout(() => {
          const y = element.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }, 50);
      }
    }
  };

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

  const leftBgImage =
    settings?.hero_bg_image && settings.hero_bg_image.trim() !== ''
      ? settings.hero_bg_image
      : settings?.hero_image_url && settings.hero_image_url.trim() !== ''
      ? settings.hero_image_url
      : LEFT_BACKGROUND_IMAGE;


  const currentService = dynamicServices[currentIndex] || services[0];

  const currentQuote =
    currentService.category === 'travel' && settings?.hero_slide_travel_quote ? settings.hero_slide_travel_quote :
    currentService.category === 'villa' && settings?.hero_slide_villa_quote ? settings.hero_slide_villa_quote :
    currentService.category === 'surfing-lesson' && settings?.hero_slide_surfing_quote ? settings.hero_slide_surfing_quote :
    currentService.category === 'vehicle-rental' && settings?.hero_slide_vehicle_quote ? settings.hero_slide_vehicle_quote :
    currentService.category === 'tattoo' && settings?.hero_slide_tattoo_quote ? settings.hero_slide_tattoo_quote :
    currentService.quote;

  const currentDescription =
    currentService.category === 'travel' && settings?.hero_slide_travel_desc ? settings.hero_slide_travel_desc :
    currentService.category === 'villa' && settings?.hero_slide_villa_desc ? settings.hero_slide_villa_desc :
    currentService.category === 'surfing-lesson' && settings?.hero_slide_surfing_desc ? settings.hero_slide_surfing_desc :
    currentService.category === 'vehicle-rental' && settings?.hero_slide_vehicle_desc ? settings.hero_slide_vehicle_desc :
    currentService.category === 'tattoo' && settings?.hero_slide_tattoo_desc ? settings.hero_slide_tattoo_desc :
    currentService.description;

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    "Halo Do'amandeh, saya butuh teman ngobrol untuk merencanakan liburan."
  )}`;

  return (
    <section className="relative w-full min-h-[100dvh] md:h-screen md:max-h-screen flex flex-col md:flex-row bg-white font-sans text-black overflow-hidden">
      {/* Kolom Kiri: Desktop Only */}
      <div className="hidden md:block relative md:w-1/2 md:h-full overflow-hidden group shrink-0">
        <Image
          src={leftBgImage}
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
            {currentQuote}
          </p>
        </div>
      </div>

      {/* Kolom Kanan / Kontainer Mobile Utama */}
      <div className="relative w-full md:w-1/2 min-h-[100dvh] md:min-h-0 md:h-full flex flex-col justify-between bg-brown p-5 sm:p-7 md:p-8 lg:p-10 xl:p-12 overflow-hidden">

        {/* Animated Editorial Hamburger Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />

              {/* Drawer Content — Murni Daftar Navigasi */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full sm:w-[360px] bg-ink border-l border-line z-50 p-6 sm:p-8 flex flex-col justify-start rounded-none shadow-none text-paper overflow-y-auto"
              >
                {/* Top Header Bar */}
                <div className="flex items-center justify-between pb-5 border-b border-line/30 mb-2 shrink-0">
                  <span className="font-medium uppercase tracking-[0.2em] text-xs sm:text-sm text-paper">
                    {settings?.brand_name || "Do'amandeh"}
                  </span>

                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Tutup Menu"
                    className="p-1 border border-line/60 text-paper hover:bg-sun hover:text-ink transition-colors rounded-none cursor-pointer flex items-center justify-center"
                  >
                    <X className="size-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Nav Links Murni (Hanya List) */}
                <nav className="flex flex-col">
                  {[
                    { href: '/', label: 'Beranda' },
                    { href: '/#about', label: 'Tentang Kami' },
                    { href: '/services', label: 'Katalog Layanan' },
                    { href: '/#testimonials', label: 'Ulasan & Testimoni' },
                    { href: '/#faq', label: 'Tanya Jawab (FAQ)' },
                    { href: '/contact', label: 'Hubungi Kami' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="py-4 border-b border-line/20 hover:border-sun flex items-center justify-between text-sm sm:text-base font-medium tracking-wide text-paper/90 hover:text-sun hover:translate-x-1 transition-all"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="size-3.5 opacity-40 hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    </Link>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 1. Bagian Atas: Tagline, Title, Subtitle & Hamburger Button */}
        <div className="shrink-0 pt-1 md:pt-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-softyellow/70 mb-2">
                {settings?.hero_tagline || "// DO'AMANDEH TOURS & TRAVEL BALI"}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-[2.75rem] font-medium tracking-tight text-softyellow leading-[1.05] md:leading-[1.08] whitespace-pre-line">
                {heroTitle || "Do'amandeh, \n— Rencanakan \nPerjalanan"}
              </h1>
              <p className="text-xs sm:text-sm text-softyellow/80 font-light leading-relaxed max-w-md mt-2.5 sm:mt-3">
                {heroSubtitle || 'Layanan wisata, rental kendaraan matic, villa privat, tato higienis & surfing terlengkap untuk liburan berkesan di Pulau Dewata.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Buka Menu"
              className="p-2 border border-line text-softyellow hover:bg-sun hover:text-ink transition-colors shrink-0 rounded-none cursor-pointer mt-1"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* 2. Bagian Tengah: Focus Slice Carousel (Responsive Mobile & Desktop - Siku Tajam Sesuai DESIGN.md) */}
        <div
          className="flex-1 min-h-[280px] sm:min-h-[340px] md:min-h-[360px] max-h-[460px] my-3 sm:my-4 md:my-3 lg:my-4 flex flex-col justify-center select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-row items-stretch gap-1.5 sm:gap-2 md:gap-2.5 w-full h-[280px] sm:h-[340px] md:h-[360px] lg:h-[400px]">
            {dynamicServices.map((service, idx) => {
              const isActive = currentIndex === idx;

              return (
                <div
                  key={service.id}
                  onClick={() => goToSlide(idx)}
                  onMouseEnter={() => goToSlide(idx)}
                  className={`relative overflow-hidden cursor-pointer rounded-none border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? 'flex-[4.5] sm:flex-[4] lg:flex-[4.5] border-line'
                      : 'flex-1 min-w-[20px] xs:min-w-[24px] sm:min-w-[32px] md:min-w-[42px] border-line/30 hover:border-sun/60'
                  }`}
                >
                  {/* Background Image */}
                  <Image
                    src={service.carouselImage}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    priority={idx === 0}
                    className={`object-cover rounded-none transition-transform duration-700 ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />

                  {/* Gradient Shading */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                      isActive
                        ? 'bg-gradient-to-t from-black/90 via-black/35 to-black/20 opacity-100'
                        : 'bg-black/60 hover:bg-black/35 opacity-100'
                    }`}
                  />

                  {/* Konten Slice Aktif */}
                  {isActive ? (
                    <div className="absolute inset-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between z-10">
                      {/* Top Badge Overlay */}
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest bg-ink/80 text-sun border border-line/30 rounded-none shadow-none">
                          [0{service.id}/0{dynamicServices.length}] // {service.tag.toUpperCase()}
                        </span>
                      </div>

                      {/* Bottom Title & Action Button */}
                      <div className="flex items-end justify-between gap-2 sm:gap-3 pt-3 sm:pt-4">
                        <div className="min-w-0 pr-1 sm:pr-2">
                          <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-softyellow leading-tight line-clamp-1 sm:line-clamp-2">
                            {service.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-softyellow/80 font-light line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 max-w-sm">
                            {service.description}
                          </p>
                        </div>

                        <Link
                          href={`/services?category=${service.category}`}
                          aria-label={`Jelajahi ${service.label}`}
                          className="size-8 sm:size-9 md:size-10 bg-sun text-ink hover:bg-paper hover:text-ink transition-colors rounded-none flex items-center justify-center shrink-0 border border-line/50 cursor-pointer shadow-none"
                        >
                          <ArrowUpRight className="size-4" strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Konten Slice Tidak Aktif (Strip Vertikal Bersih) */
                    <div className="absolute inset-0 flex flex-col items-center justify-between py-3 sm:py-4 z-10 pointer-events-none">
                      <span className="text-[8px] xs:text-[9px] font-mono text-softyellow/50 tracking-wider">
                        0{service.id}
                      </span>
                      <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.12em] sm:tracking-[0.2em] text-softyellow/75 [writing-mode:vertical-rl] rotate-180">
                        {service.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bagian Bawah: Bar Minimalis Tanpa Duplikasi Teks & Tanpa Indikator (Leluasa & Bersih) */}
        <div className="shrink-0 pt-2 pb-1 md:pb-0 flex items-center justify-between gap-3 border-t border-line/20">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono tracking-wider">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-softyellow/80 hover:text-softyellow transition-colors"
            >
              <Phone className="size-3.5" strokeWidth={1.5} />
              <span>Konsultasi WhatsApp</span>
            </a>

            <span className="text-softyellow/30">•</span>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-softyellow/80 hover:text-softyellow transition-colors"
            >
              <span>Semua Layanan</span>
              <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}