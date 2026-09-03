'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface FaqItem {
  num: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    num: '01',
    question: 'Gimana Cara Booking Layanan Doamandeh?',
    answer: 'Gampang banget! Kamu bisa langsung pilih layanan di website ini dan klik tombol pesan, atau langsung chat admin kami via WhatsApp. Nanti tim Doamandeh bakal secepatnya konfirmasi jadwal buat kamu.',
  },
  {
    num: '02',
    question: 'Apa Saja Syarat Sewa Motor Atau Mobil? ',
    answer: 'Cukup siapkan identitas asli (KTP atau Paspor) dan SIM yang masih aktif (SIM C buat motor, SIM A buat mobil). Asyiknya lagi, Doamandeh kasih gratis antar-jemput kendaraan langsung ke hotelmu untuk area tertentu lho!',
  },
  {
    num: '03',
    question: 'Studio Tattonya Aman Dan Steril Kan?',
    answer: 'Pasti dong! Keamananmu itu nomor satu buat kami. Doamandeh pakai jarum dan alat sekali pakai (single-use) yang dibuka langsung di depanmu, tinta impor standar medis, plus studionya selalu rutin didisinfeksi.',
  },
  {
    num: '04',
    question: 'Sewa Villa Sudah Termasuk Bersih-Bersih?',
    answer: 'Sudah all-in! Nginep di villa Doamandeh udah pasti dapet private pool, WiFi kenceng, AC, alat mandi, sampai layanan bersih-bersih tiap hari (daily housekeeping). Kamu tinggal santai aja tanpa ada biaya tambahan.',
  },
  {
    num: '05',
    question: 'Belum Pernah Surfing, Bisa Ikut Kelasnya?',
    answer: 'Bisa banget! Instruktur selancar Doamandeh udah terbiasa dan sabar banget ngajarin pemula. Awalnya kita akan latihan santai di air dangkal dulu dengan pengawasan 1-on-1, jadi dijamin aman dan fun.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full bg-[#504139] text-[#FFF6C6] font-sans overflow-hidden">

      {/* 1. TAMPILAN MOBILE: Foto Banner dengan Title Overlay di Atas Foto */}
      <div className="md:hidden relative w-full h-[52vh] min-h-[350px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
          alt="Alam & Budaya Bali"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h2 className="text-4xl sm:text-4xl font-medium leading-[1.08] tracking-tight text-[#FFF6C6] drop-shadow-md">
            Jawaban untuk <br /> setiap pertanyaanmu
          </h2>
        </div>
      </div>

      {/* Konten Utama: 2-Kolom Split di Desktop & Stack Rapi di Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-0 md:min-h-[100dvh]">

        {/* Kolom Kiri: Teks & FAQ Accordion */}
        <FadeIn direction="up" className="flex flex-col justify-center px-6 py-10 md:p-12 lg:p-20">

          {/* Header Judul (Sembunyi di Mobile karena sudah ada overlay di atas foto) */}
          <div className="hidden md:block mb-12 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight text-[#FFF6C6] mb-4">
              Jawaban untuk <br /> setiap pertanyaanmu.
            </h2>
            <p className="text-sm leading-relaxed text-[#FFF6C6]/80 font-light max-w-md">
              Jawaban jelas mengenai proses pemesanan, fasilitas layanan, jadwal, dan semua kebutuhan perjalanan Anda di Bali.
            </p>
          </div>

          {/* Deskripsi Khusus Mobile (Di bawah foto) */}


          {/* Garis Pembatas */}
          <div className="w-full border-t border-white/20 mb-6 md:mb-8"></div>

          {/* Daftar Accordion FAQ */}
          <div className="w-full">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-white/20">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-4 sm:py-5 focus:outline-none text-left group cursor-pointer"
                  >
                    <h3 className="text-xs sm:text-sm font-medium tracking-wider pr-6 text-[#FFF6C6] group-hover:opacity-80 transition-opacity">
                      {faq.num}. {faq.question}
                    </h3>
                    <div className="shrink-0 text-[#FFF6C6]">
                      {isOpen ? (
                        <Minus className="w-4 h-4 stroke-[2]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[2]" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'
                      }`}
                  >
                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-light pr-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </FadeIn>

        {/* 2. TAMPILAN DESKTOP: Foto Full-Height Kolom Kanan (Mengisi 100% tinggi tanpa celah kosong) */}
        <div className="relative hidden md:block w-full h-full min-h-[100dvh] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
            alt="Tarian Kecak & Alam Bali"
            fill
            sizes="50vw"
            priority
            className="object-cover object-top"
          />
        </div>

      </div>
    </section>
  );
}