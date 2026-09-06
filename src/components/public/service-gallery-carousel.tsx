'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ServiceGalleryCarouselProps {
  images: string[];
  title: string;
  categoryLabel?: string;
}

export function ServiceGalleryCarousel({
  images,
  title,
  categoryLabel,
}: ServiceGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const total = images.length;

  // Pastikan currentIndex valid jika jumlah gambar berubah
  useEffect(() => {
    if (currentIndex >= total) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  if (total === 0) {
    return null;
  }

  // Jika hanya 1 gambar: Tampilkan 1 foto banner lebar yang fokus
  if (total === 1) {
    return (
      <div className="py-10 border-b border-line">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] uppercase tracking-widest font-mono text-ocean">
            // DOKUMENTASI VISUAL
          </p>
          <span className="text-[10px] font-mono text-ink/50 uppercase">
            [1 FOTO TERSEDIA]
          </span>
        </div>
        <div className="relative w-full h-[300px] sm:h-[380px] md:h-[460px] lg:h-[500px] border border-line rounded-none overflow-hidden bg-foam group">
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest bg-ink/85 text-sun border border-line/30 rounded-none">
              [01/01] // FOTO UTAMA
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Jika 2 atau 3 gambar: Tampilkan Focus Slice Carousel (selaras dengan Hero Homepage)
  return (
    <div className="py-10 border-b border-line">
      {/* Header Bar dengan Kontrol Navigasi Panah */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-widest font-mono text-ocean">
            // DOKUMENTASI VISUAL
          </p>
          <span className="text-[10px] font-mono text-ink/40">
            [{total} FOTO]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            className="p-1.5 border border-line bg-paper text-ink hover:bg-sun transition-colors rounded-none cursor-pointer"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          </button>
          <span className="text-[11px] font-mono text-ink/70 px-1 select-none">
            0{currentIndex + 1} / 0{total}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            className="p-1.5 border border-line bg-paper text-ink hover:bg-sun transition-colors rounded-none cursor-pointer"
          >
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Focus Slice Carousel Container */}
      <div
        className="flex flex-row items-stretch gap-1.5 sm:gap-2.5 w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, idx) => {
          const isActive = currentIndex === idx;
          const label =
            idx === 0
              ? 'COVER UTAMA'
              : `DOKUMENTASI ${idx}`;

          return (
            <div
              key={`${img}-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              onMouseEnter={() => setCurrentIndex(idx)}
              className={`relative overflow-hidden cursor-pointer rounded-none border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? 'flex-[3.8] sm:flex-[4.2] lg:flex-[4.5] border-line'
                  : 'flex-1 min-w-[34px] sm:min-w-[46px] md:min-w-[56px] border-line/40 hover:border-sun/60'
              }`}
            >
              {/* Gambar Background */}
              <Image
                src={img}
                alt={`${title} - ${label}`}
                fill
                sizes="(max-width: 768px) 100vw, 850px"
                priority={idx === 0}
                className={`object-cover rounded-none transition-transform duration-700 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Gradient Shading Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isActive
                    ? 'bg-gradient-to-t from-black/85 via-black/25 to-black/20 opacity-100'
                    : 'bg-black/60 hover:bg-black/35 opacity-100'
                }`}
              />

              {/* Slice Aktif: Badge & Caption */}
              {isActive ? (
                <div className="absolute inset-0 p-3.5 sm:p-5 flex flex-col justify-between z-10 pointer-events-none">
                  {/* Top Badge Overlay */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest bg-ink/85 text-sun border border-line/30 rounded-none shadow-none">
                      [0{idx + 1}/0{total}] // {label}
                    </span>
                    {categoryLabel && (
                      <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-white/70 bg-black/40 border border-white/10">
                        {categoryLabel}
                      </span>
                    )}
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="pt-3">
                    <p className="text-sm sm:text-base font-medium tracking-tight text-white/95 truncate">
                      {title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/70 font-light font-mono mt-0.5">
                      // Arahkan kursor atau klik foto lain untuk beralih fokus
                    </p>
                  </div>
                </div>
              ) : (
                /* Slice Tidak Aktif: Nomor & Label Vertikal */
                <div className="absolute inset-0 flex flex-col items-center justify-between py-3.5 sm:py-5 z-10 pointer-events-none">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/80 tracking-wider">
                    0{idx + 1}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] text-white/85 [writing-mode:vertical-rl] rotate-180 truncate max-h-[220px]">
                    {label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
