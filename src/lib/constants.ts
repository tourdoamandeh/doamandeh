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
