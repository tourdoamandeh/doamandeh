'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  Minus,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublicHeaderProps {
  whatsappNumber?: string;
  brandName?: string;
  brandTagline?: string;
}

export function PublicHeader({
  whatsappNumber = '+62 878-6519-0335',
  brandName = "Do'amandeh",
  brandTagline = 'TOURS & TRAVEL',
}: PublicHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isCardOpen, setIsCardOpen] = useState(false);

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    "Halo Do'amandeh Tours and Travel, saya ingin konsultasi layanan wisata."
  )}`;

  // Kunci scroll body saat card modal terbuka
  useEffect(() => {
    if (isCardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCardOpen]);

  // Tutup card jika rute berganti
  useEffect(() => {
    setIsCardOpen(false);
  }, [pathname]);

  // Tutup card jika tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCardOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsCardOpen(false);
    document.body.style.overflow = '';

    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.replace(/^\/?#/, '');
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      } else {
        sessionStorage.setItem('scroll_target', targetId);
      }
    }
  };

  // Di beranda (homepage), navbar ditiadakan sepenuhnya (murni mengandalkan Hero Section native drawer)
  if (isHome) {
    return null;
  }

  return (
    <>
      {/* Top Spacer di semua subpage agar konten halaman tidak tertutup oleh floating bar */}
      <div className="h-16 sm:h-20 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* FLOATING COMPACT NAVBAR & EXPANDABLE CARD MODAL
          - Selalu aktif dalam compact mode di seluruh subpage
          - Stroke 1px halus (border border-softyellow/80)
          - Animasi mengembang/menyusut instan tanpa jeda & tanpa distorsi stretching */}
      {/* Backdrop Gelap saat Mode Card Terbuka */}
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCardOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Floating Container Melayang di Tengah Atas */}
      <motion.div
        key="floating-navbar-container"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-[380px] sm:max-w-[420px] bg-ink border border-line text-paper font-sans rounded-none shadow-none overflow-hidden"
      >
        {/* === BARIS HEADER PERMANEN (Tinggi presisi h-12 sm:h-13, stroke halus 1px) === */}
        <div
          onClick={() => setIsCardOpen(!isCardOpen)}
          className="w-full h-12 sm:h-13 flex items-center justify-between px-4 sm:px-5 cursor-pointer group select-none transition-colors hover:bg-sun/5 shrink-0"
        >
          {/* Sisi Kiri: Tulisan Do'amandeh / Brand Name */}
          <span className="font-medium uppercase tracking-[0.2em] text-xs sm:text-sm text-paper group-hover:text-sun transition-colors">
            {brandName}
          </span>

          {/* Sisi Tengah: Tagline halus */}
          <span className="text-[9px] uppercase tracking-[0.25em] text-paper/60 font-mono transition-opacity">
            {isCardOpen ? '// NAVIGATION' : `// ${brandTagline.toUpperCase()}`}
          </span>

          {/* Sisi Kanan: Tombol Toggle (Ikon Menu <-> Minus Strip) */}
          <div className="p-1 border border-line/60 group-hover:border-sun text-paper group-hover:text-sun transition-colors rounded-none flex items-center justify-center">
            <motion.div
              key={isCardOpen ? 'minus-icon' : 'menu-icon'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isCardOpen ? (
                <Minus className="size-3.5" strokeWidth={1.5} />
              ) : (
                <Menu className="size-3.5" strokeWidth={1.5} />
              )}
            </motion.div>
          </div>
        </div>

        {/* === AREA KONTEN KARTU YANG MENGEMBANG & MENYUSUT TANPA JEDA === */}
        <AnimatePresence initial={false}>
          {isCardOpen && (
            <motion.div
              key="card-accordion-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.2, delay: 0.05 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.15 },
                },
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-line/30 px-5 sm:px-6 pb-2 pt-1 flex flex-col">
                {/* Daftar Menu Vertikal Bergaris Tipis Murni */}
                <nav className="flex flex-col my-1">
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
                      className={`py-3.5 border-b border-line/20 hover:border-sun flex items-center justify-between text-sm sm:text-base font-medium tracking-wide transition-all ${
                        pathname === item.href
                          ? 'text-sun border-sun font-bold translate-x-1'
                          : 'text-paper/90 hover:text-sun hover:translate-x-1'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="size-3.5 opacity-40 hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
