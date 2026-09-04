'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Car,
  Palette,
  Home,
  Compass,
  Waves,
  Menu,
  X,
  Phone,
  Shield,
  ChevronDown,
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'vehicle-rental', label: 'Sewa Kendaraan', icon: Car, num: '01' },
  { slug: 'tattoo', label: 'Tato Studio', icon: Palette, num: '02' },
  { slug: 'villa', label: 'Villa & Stay', icon: Home, num: '03' },
  { slug: 'travel', label: 'Paket Travel', icon: Compass, num: '04' },
  { slug: 'surfing-lesson', label: 'Surfing Lesson', icon: Waves, num: '05' },
];

interface PublicHeaderProps {
  whatsappNumber?: string;
}

export function PublicHeader({ whatsappNumber = '+62 812-3456-7890' }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Halo Doamandeh Tours and Travel, saya ingin konsultasi layanan wisata.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-tissue/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div>
              <span className="font-serif text-2xl sm:text-3xl text-black block leading-none font-semibold">
                Doamandeh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className={`font-serif text-lg font-normal transition-colors ${pathname === '/'
                ? 'text-black underline underline-offset-8 decoration-2 decoration-peach'
                : 'text-black/70 hover:text-black'
                }`}
            >
              Beranda
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 font-serif text-lg font-normal transition-colors ${pathname.startsWith('/category')
                  ? 'text-black underline underline-offset-8 decoration-2 decoration-peach'
                  : 'text-black/70 hover:text-black'
                  }`}
              >
                <span>Layanan Wisata</span>
                <ChevronDown className="h-4 w-4 text-black/60" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-3xl bg-tissue p-3 shadow-xl border border-gray-100 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 font-serif text-lg transition-colors ${pathname === `/category/${cat.slug}`
                          ? 'bg-peach text-black'
                          : 'text-black hover:bg-lightblue/50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-black" />
                          <span>{cat.label}</span>
                        </div>
                        <span className="text-xs font-serif italic opacity-60">{cat.num}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`font-serif text-lg font-normal transition-colors ${pathname === '/about'
                ? 'text-black underline underline-offset-8 decoration-2 decoration-peach'
                : 'text-black/70 hover:text-black'
                }`}
            >
              Tentang Kami
            </Link>

            <Link
              href="/contact"
              className={`font-serif text-lg font-normal transition-colors ${pathname === '/contact'
                ? 'text-black underline underline-offset-8 decoration-2 decoration-peach'
                : 'text-black/70 hover:text-black'
                }`}
            >
              Kontak
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-black px-6 py-2.5 font-serif text-lg text-tissue hover:bg-black/90 transition-all border-none shadow-sm"
            >
              <Phone className="h-4 w-4 text-tissue" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-black text-tissue hover:bg-black/80 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-tissue px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-2xl px-4 py-3 font-serif text-lg ${pathname === '/' ? 'bg-peach text-black' : 'text-black hover:bg-lightblue/40'
                }`}
            >
              Beranda
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-2xl px-4 py-3 font-serif text-lg ${pathname === '/about' ? 'bg-peach text-black' : 'text-black hover:bg-lightblue/40'
                }`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-2xl px-4 py-3 font-serif text-lg ${pathname === '/contact' ? 'bg-peach text-black' : 'text-black hover:bg-lightblue/40'
                }`}
            >
              Hubungi Kami
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="px-4 text-xs font-serif italic text-black/50 mb-3">
              Kategori Layanan
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-2.5 font-serif text-lg ${pathname === `/category/${cat.slug}`
                      ? 'bg-peach text-black'
                      : 'text-black hover:bg-lightblue/40'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-black" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-xs font-serif italic opacity-50">{cat.num}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-lg text-tissue"
            >
              <Phone className="h-4 w-4 text-tissue" />
              <span>WhatsApp Kami</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 font-serif text-lg text-tissue"
            >
              <Shield className="h-4 w-4 text-tissue" />
              <span>Portal Administrator</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
