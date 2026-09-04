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
    <header className="sticky top-0 z-40 bg-softyellow/95 backdrop-blur-md border-b-2 border-brown font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-brown text-softyellow flex items-center justify-center font-light text-2xl rounded-none border-2 border-brown shadow-none">
              D.
            </div>
            <div>
              <span className="text-xl font-bold uppercase tracking-widest text-black block leading-none">
                Doamandeh
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-brown/70 block mt-1">
                Tours &amp; Travel Bali
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-bold">
            <Link
              href="/"
              className={`transition-colors py-1 ${
                pathname === '/'
                  ? 'text-brown border-b-2 border-brown'
                  : 'text-black/70 hover:text-brown'
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
                className={`flex items-center gap-1.5 transition-colors py-1 ${
                  pathname.startsWith('/category')
                    ? 'text-brown border-b-2 border-brown'
                    : 'text-black/70 hover:text-brown'
                }`}
              >
                <span>Layanan Wisata</span>
                <ChevronDown className="h-3.5 w-3.5 text-brown" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-none bg-softwhite p-2 border-2 border-brown shadow-none animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-none transition-colors ${
                          pathname === `/category/${cat.slug}`
                            ? 'bg-brown text-softyellow font-bold'
                            : 'text-black hover:bg-softyellow'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-xs uppercase tracking-wider">{cat.label}</span>
                        </div>
                        <span className="text-[10px] uppercase opacity-60">{cat.num}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`transition-colors py-1 ${
                pathname === '/about'
                  ? 'text-brown border-b-2 border-brown'
                  : 'text-black/70 hover:text-brown'
              }`}
            >
              Tentang Kami
            </Link>

            <Link
              href="/contact"
              className={`transition-colors py-1 ${
                pathname === '/contact'
                  ? 'text-brown border-b-2 border-brown'
                  : 'text-black/70 hover:text-brown'
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
              className="flex items-center gap-2 rounded-none bg-brown text-softyellow px-6 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-black transition-all border-2 border-brown shadow-none"
            >
              <Phone className="h-3.5 w-3.5 text-softyellow" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-none bg-brown text-softyellow hover:bg-black transition-colors border-2 border-brown shadow-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-brown bg-softyellow px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-2 text-xs uppercase tracking-widest font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-none px-4 py-3 border-2 border-brown ${
                pathname === '/' ? 'bg-brown text-softyellow' : 'bg-softwhite text-black hover:bg-white'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-none px-4 py-3 border-2 border-brown ${
                pathname === '/about' ? 'bg-brown text-softyellow' : 'bg-softwhite text-black hover:bg-white'
              }`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-none px-4 py-3 border-2 border-brown ${
                pathname === '/contact' ? 'bg-brown text-softyellow' : 'bg-softwhite text-black hover:bg-white'
              }`}
            >
              Hubungi Kami
            </Link>
          </div>

          <div className="pt-3 border-t-2 border-brown">
            <p className="px-1 text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70 mb-3">
              Kategori Layanan
            </p>
            <div className="space-y-1 text-xs uppercase tracking-widest font-bold">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-none px-4 py-2.5 border-2 border-brown ${
                      pathname === `/category/${cat.slug}`
                        ? 'bg-brown text-softyellow'
                        : 'bg-softwhite text-black hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-[10px] opacity-60">{cat.num}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-brown space-y-2 text-xs uppercase tracking-widest font-bold">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-none bg-brown text-softyellow px-6 py-3 border-2 border-brown hover:bg-black transition-colors"
            >
              <Phone className="h-4 w-4 text-softyellow" />
              <span>WhatsApp Kami</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-softwhite text-brown border-2 border-brown px-6 py-3 hover:bg-white transition-colors"
            >
              <Shield className="h-4 w-4 text-brown" />
              <span>Portal Administrator</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
