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
    <header className="sticky top-0 z-40 bg-transparent text-softyellow backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group text-softyellow">
            <div>
              <span className="text-xl sm:text-2xl text-softyellow block leading-none font-medium tracking-wide">
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
              className={`font-sans text-sm font-medium transition-all ${pathname === '/'
                ? 'text-softyellow underline underline-offset-8 decoration-2 decoration-softyellow'
                : 'text-softyellow opacity-80 hover:opacity-100'
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
                className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-all ${pathname.startsWith('/category')
                  ? 'text-softyellow underline underline-offset-8 decoration-2 decoration-softyellow'
                  : 'text-softyellow opacity-80 hover:opacity-100'
                  }`}
              >
                <span>Layanan Wisata</span>
                <ChevronDown className="h-4 w-4 text-softyellow opacity-70" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-none bg-brown p-2 shadow-xl border border-softyellow/30 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = pathname === `/category/${cat.slug}`;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between rounded-none px-4 py-3 font-sans text-xs font-medium tracking-wide transition-colors ${isActive
                          ? 'bg-softyellow text-brown'
                          : 'text-softyellow hover:bg-softyellow/20'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-brown' : 'text-softyellow'}`} />
                          <span>{cat.label}</span>
                        </div>
                        <span className="text-[10px] font-sans opacity-70">{cat.num}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`font-sans text-sm font-medium transition-all ${pathname === '/about'
                ? 'text-softyellow underline underline-offset-8 decoration-2 decoration-softyellow'
                : 'text-softyellow opacity-80 hover:opacity-100'
                }`}
            >
              Tentang Kami
            </Link>

            <Link
              href="/contact"
              className={`font-sans text-sm font-medium transition-all ${pathname === '/contact'
                ? 'text-softyellow underline underline-offset-8 decoration-2 decoration-softyellow'
                : 'text-softyellow opacity-80 hover:opacity-100'
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
              className="flex items-center gap-2 rounded-none bg-softyellow px-6 py-2.5 font-sans text-xs font-bold text-brown hover:bg-white hover:text-brown transition-all border border-softyellow shadow-none"
            >
              <Phone className="h-4 w-4 text-brown" />
              <span className="text-brown font-bold">WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-none bg-softyellow text-brown hover:bg-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-brown" /> : <Menu className="h-5 w-5 text-brown" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-softyellow/30 bg-brown text-softyellow px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-lg rounded-none">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-none px-4 py-3 font-sans text-sm font-medium ${pathname === '/' ? 'bg-softyellow text-brown' : 'text-softyellow hover:bg-softyellow/20'
                }`}
            >
              Beranda
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-none px-4 py-3 font-sans text-sm font-medium ${pathname === '/about' ? 'bg-softyellow text-brown' : 'text-softyellow hover:bg-softyellow/20'
                }`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-none px-4 py-3 font-sans text-sm font-medium ${pathname === '/contact' ? 'bg-softyellow text-brown' : 'text-softyellow hover:bg-softyellow/20'
                }`}
            >
              Hubungi Kami
            </Link>
          </div>

          <div className="pt-3 border-t border-softyellow/30">
            <p className="px-4 text-[11px] font-sans font-medium text-softyellow opacity-70 mb-3">
              Kategori Layanan
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-none px-4 py-2.5 font-sans text-xs font-medium ${isActive
                      ? 'bg-softyellow text-brown'
                      : 'text-softyellow hover:bg-softyellow/20'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-brown' : 'text-softyellow'}`} />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-[10px] font-sans opacity-70">{cat.num}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-softyellow/30 space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-none bg-softyellow px-6 py-3 font-sans text-xs font-bold text-brown hover:bg-white transition-colors"
            >
              <Phone className="h-4 w-4 text-brown" />
              <span className="text-brown font-bold">WhatsApp Kami</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-softyellow/20 border border-softyellow/30 px-6 py-3 font-sans text-xs font-medium text-softyellow hover:bg-softyellow hover:text-brown transition-colors"
            >
              <Shield className="h-4 w-4 text-softyellow" />
              <span>Portal Administrator</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
