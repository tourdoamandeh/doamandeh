import React from 'react';
import { ServiceCategory } from '@/types/database';
import {
  Car,
  Palette,
  Home as HomeIcon,
  Compass,
  Waves,
} from 'lucide-react';

export interface CategoryDetail {
  num: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  bgColor: string;
}

export const CATEGORIES: Record<ServiceCategory, CategoryDetail> = {
  'vehicle-rental': {
    num: '01',
    label: 'Sewa Kendaraan',
    icon: Car,
    description: 'Motor & Mobil matic terawat siap keliling Bali',
    bgColor: 'bg-lightblue',
  },
  'tattoo': {
    num: '02',
    label: 'Tato Studio',
    icon: Palette,
    description: 'Custom tattoo higienis & artist profesional',
    bgColor: 'bg-peach',
  },
  'villa': {
    num: '03',
    label: 'Villa & Stay',
    icon: HomeIcon,
    description: 'Villa eksklusif private pool di lokasi strategis',
    bgColor: 'bg-yellow',
  },
  'travel': {
    num: '04',
    label: 'Paket Travel',
    icon: Compass,
    description: 'Tour wisata seru explore destinasi terbaik Bali',
    bgColor: 'bg-softpink',
  },
  'surfing-lesson': {
    num: '05',
    label: 'Surfing Lesson',
    icon: Waves,
    description: 'Kelas selancar pemula & intermediate bersertifikat',
    bgColor: 'bg-lightblue',
  },
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Pemetaan gambar fallback resmi dari folder public/assets untuk setiap kategori layanan.
 * Digunakan jika layanan di CMS belum memiliki foto yang diunggah.
 */
export const SERVICE_FALLBACK_IMAGES: Record<ServiceCategory, string> = {
  'vehicle-rental': '/assets/service-vehicle.jpg',
  'tattoo': '/assets/service-tattoo.jpg',
  'villa': '/assets/service-villa.jpg',
  'travel': '/assets/service-travel.jpg',
  'surfing-lesson': '/assets/service-surfing.png',
};

/**
 * Daftar preset gambar brand resmi dari folder public/assets.
 * Memudahkan admin CMS memilih foto resmi Doamandeh tanpa perlu upload manual.
 */
export const SERVICE_PRESET_IMAGES: Record<
  ServiceCategory,
  { label: string; url: string }[]
> = {
  'vehicle-rental': [
    { label: 'Foto Kendaraan (Default)', url: '/assets/service-vehicle.jpg' },
    { label: 'Vector Kendaraan', url: '/assets/service-vehicle.svg' },
    { label: 'Ilustrasi Sewa Motor', url: '/assets/testimonial-motor.svg' },
    { label: 'Ilustrasi Sewa Mobil', url: '/assets/testimonial-mobil.svg' },
  ],
  tattoo: [
    { label: 'Foto Studio Tato (Default)', url: '/assets/service-tattoo.jpg' },
    { label: 'Vector Studio Tato', url: '/assets/service-tattoo.svg' },
    { label: 'Ilustrasi Tato Artist', url: '/assets/testimonial-tattoo.svg' },
  ],
  villa: [
    { label: 'Foto Villa Stay (Default)', url: '/assets/service-villa.jpg' },
    { label: 'Vector Villa Stay', url: '/assets/service-villa.svg' },
    { label: 'Ilustrasi Villa Tropis', url: '/assets/testimonial-villa.svg' },
  ],
  travel: [
    { label: 'Foto Paket Tour (Default)', url: '/assets/service-travel.jpg' },
    { label: 'Vector Paket Tour', url: '/assets/service-travel.svg' },
    { label: 'Ilustrasi Tour Wisata', url: '/assets/testimonial-tour.svg' },
  ],
  'surfing-lesson': [
    { label: 'Foto Surfing Lesson (Default)', url: '/assets/service-surfing.png' },
    { label: 'Vector Surfing Lesson', url: '/assets/service-surfing.svg' },
    { label: 'Ilustrasi Surfing Pantai', url: '/assets/testimonial-surfing.svg' },
  ],
};

/**
 * Mengambil URL gambar fallback berdasarkan kategori layanan.
 */
export function getServiceFallbackImage(category?: string | null): string {
  if (category && category in SERVICE_FALLBACK_IMAGES) {
    return SERVICE_FALLBACK_IMAGES[category as ServiceCategory];
  }
  return '/assets/hero-bali.jpg';
}

/**
 * Mengambil URL gambar layanan yang valid.
 * Jika `image_url` kosong/null/undefined, otomatis fallback ke aset lokal public/assets.
 */
export function getServiceImageUrl(service?: {
  image_url?: string | null;
  category?: string | null;
} | null): string {
  if (service?.image_url && service.image_url.trim() !== '') {
    return service.image_url;
  }
  return getServiceFallbackImage(service?.category);
}
