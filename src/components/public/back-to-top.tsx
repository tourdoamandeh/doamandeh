'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 280);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 transition-all duration-300 ease-in-out',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        className="relative size-11 sm:size-12 flex items-center justify-center rounded-none bg-ink text-paper hover:bg-ocean transition-colors duration-200 border border-line shadow-none cursor-pointer group select-none overflow-hidden"
      >
        {/* Sleek Minimalist Arrow */}
        <ArrowUp
          className="size-5 transition-transform duration-300 group-hover:-translate-y-1 text-paper"
          strokeWidth={1.5}
        />

        {/* Signature 2px Scroll Progress Bar at the bottom edge */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2.5px] bg-sun transition-all duration-75 pointer-events-none"
          style={{ width: `${scrollProgress}%` }}
        />
      </button>
    </div>
  );
}
