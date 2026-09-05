'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const performScroll = () => {
      // 1. Ambil targetId dari sessionStorage (jika navigasi lintas halaman)
      let targetId = sessionStorage.getItem('scroll_target');
      if (targetId) {
        sessionStorage.removeItem('scroll_target');
      } else if (window.location.hash) {
        // 2. Atau ambil dari hash URL (direct URL / bookmark / redirect)
        targetId = window.location.hash.replace('#', '');
      }

      if (!targetId) return;

      // Pastikan body scroll tidak terkunci
      document.body.style.overflow = '';

      // Fungsi retry untuk menunggu DOM selesai di-render (Server Components / streaming)
      let attempts = 0;
      const maxAttempts = 10;
      const intervalMs = 60;

      const tryScroll = () => {
        attempts++;
        const element = document.getElementById(targetId!);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({
            top: Math.max(0, y),
            behavior: 'smooth',
          });
        } else if (attempts < maxAttempts) {
          setTimeout(tryScroll, intervalMs);
        }
      };

      // Beri jeda sejenak agar Next.js scroll-to-top bawaan selesai berjalan
      setTimeout(tryScroll, 100);
    };

    performScroll();

    window.addEventListener('hashchange', performScroll);
    return () => {
      window.removeEventListener('hashchange', performScroll);
    };
  }, [pathname]);

  return null;
}
