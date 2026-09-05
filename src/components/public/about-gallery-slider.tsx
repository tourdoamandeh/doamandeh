'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GALLERY_IMAGES = [
  { id: 1, src: '/assets/about-photo-1.svg', alt: 'Nusa Penida Treehouse' },
  { id: 2, src: '/assets/about-photo-2.svg', alt: 'Tebing Uluwatu & Ocean View' },
  { id: 3, src: '/assets/service-villa.svg', alt: 'Private Pool Villa Bali' },
  { id: 4, src: '/assets/service-surfing.svg', alt: 'Surfing Lesson Beach' },
  { id: 5, src: '/assets/service-tattoo.svg', alt: 'Professional Tattoo Studio' },
  { id: 6, src: '/assets/service-vehicle.svg', alt: 'Sewa Kendaraan Matik' },
  { id: 7, src: '/assets/service-travel.svg', alt: 'Paket Tour Wisata Bali' },
];

export function AboutGallerySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = GALLERY_IMAGES.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const firstImg = GALLERY_IMAGES[currentIndex];
  const secondImg = GALLERY_IMAGES[(currentIndex + 1) % total];

  return (
    <div className="flex flex-col gap-3">
      {/* 2 Side-by-Side Thumbnails */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative aspect-[4/3] w-full border border-line overflow-hidden rounded-none bg-brown group">
          <AnimatePresence mode="wait">
            <motion.div
              key={firstImg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={firstImg.src}
                alt={firstImg.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[10px] text-softyellow truncate z-10">
            {firstImg.alt}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full border border-line overflow-hidden rounded-none bg-brown group">
          <AnimatePresence mode="wait">
            <motion.div
              key={secondImg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={secondImg.src}
                alt={secondImg.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[10px] text-softyellow truncate z-10">
            {secondImg.alt}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Counter */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto Sebelumnya"
            className="p-1.5 border border-softyellow/40 text-softyellow hover:bg-softyellow hover:text-brown transition-colors rounded-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto Selanjutnya"
            className="p-1.5 border border-softyellow/40 text-softyellow hover:bg-softyellow hover:text-brown transition-colors rounded-none"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs font-semibold text-softyellow tracking-wider">
          {currentIndex + 1} - {total}
        </span>
      </div>
    </div>
  );
}
