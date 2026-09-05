import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const serviceCategoryEnum = z.enum([
  'vehicle-rental',
  'tattoo',
  'villa',
  'travel',
  'surfing-lesson',
]);

export const serviceSchema = z.object({
  category: serviceCategoryEnum,
  title: z.string().min(3, 'Judul layanan minimal 3 karakter'),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  unit: z.string().min(1, 'Satuan harga wajib diisi (misal: per hari, per sesi)'),
  duration: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const bookingStatusEnum = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);

export const bookingSchema = z.object({
  service_id: z.string().uuid('ID layanan tidak valid'),
  customer_name: z.string().min(2, 'Nama customer minimal 2 karakter'),
  customer_email: z.string().email('Format email tidak valid'),
  customer_phone: z.string().min(6, 'Nomor telepon minimal 6 digit'),
  booking_date: z.string().min(1, 'Tanggal booking wajib diisi'),
  notes: z.string().nullable().optional(),
  status: bookingStatusEnum.default('pending'),
  total_price: z.coerce.number().min(0).nullable().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const siteSettingsSchema = z.object({
  // Hero Section
  hero_title: z.string().default('Doamandeh, \n— Rencanakan \nPerjalanan'),
  hero_subtitle: z.string().default('Solusi lengkap kebutuhan aktivitas liburan Anda di Bali: Sewa Motor & Mobil, Tato Artistik, Villa Nyaman, Paket Wisata Tour, hingga Kelas Surfing.'),
  hero_image_url: z.string().optional().default(''),
  hero_bg_image: z.string().optional().default(''),
  hero_slide_travel_img: z.string().optional().default(''),
  hero_slide_villa_img: z.string().optional().default(''),
  hero_slide_surfing_img: z.string().optional().default(''),
  hero_slide_vehicle_img: z.string().optional().default(''),
  hero_slide_tattoo_img: z.string().optional().default(''),
  hero_slide_travel_quote: z.string().default('Biar kami yang merencanakan,\nkamu cukup menikmati\n— momennya.'),
  hero_slide_travel_desc: z.string().default('Temukan Bali yang sebenarnya. Dari pesona pura sakral hingga pantai tersembunyi, paket perjalanan kami dirancang agar kamu bisa bersantai penuh tanpa pusing memikirkan rute atau tiket.'),
  hero_slide_villa_quote: z.string().default('Ruang tenang untuk\nkembali berpulang\n— di tengah surga tropis.'),
  hero_slide_villa_desc: z.string().default('Setelah seharian menjelajah, rebahkan diri di villa eksklusif pilihan Doamandeh. Nikmati privasi penuh, kolam renang pribadi, dan suasana tenang yang membuatmu merasa seperti di rumah sendiri.'),
  hero_slide_surfing_quote: z.string().default('Taklukkan ombak,\nbebaskan jiwa\n— di pantai Bali.'),
  hero_slide_surfing_desc: z.string().default('Belum pernah menyentuh papan selancar? Tidak masalah. Instruktur ramah kami siap membantumu berdiri dan menunggangi ombak pertamamu dengan aman, seru, dan penuh tawa.'),
  hero_slide_vehicle_quote: z.string().default('Jelajahi setiap sudutnya,\ntemukan ceritamu sendiri\n— di Bali.'),
  hero_slide_vehicle_desc: z.string().default('Tinggalkan jadwal yang kaku. Dengan pilihan motor matic dan mobil pribadi kami yang terawat rapi, kamu bebas menentukan sendiri ke mana angin Bali akan membawamu hari ini.'),
  hero_slide_tattoo_quote: z.string().default('Bawa pulang kenangan\nyang tak akan pernah pudar\n— bersama seniman terbaik.'),
  hero_slide_tattoo_desc: z.string().default('Ceritakan perjalananmu lewat seni tubuh custom di studio higienis kami. Dikerjakan oleh seniman lokal Bali dengan standar kebersihan internasional yang ketat.'),

  // About Section
  about_tagline: z.string().default('// TENTANG DOAMANDEH'),
  about_title: z.string().default('Bersama Doamandeh, liburan di Bali tak seharusnya terasa melelahkan. Kami mengurus setiap detail perjalanannya, agar kamu bisa benar-benar rileks, menikmati momen, dan menemukan ketenangan.'),
  about_text: z.string().default('Doamandeh hadir untuk jadi teman perjalananmu selama di pulau dewata. Apa pun gaya liburan yang kamu inginkan—mulai dari sewa kendaraan untuk keliling bebas, bersantai tenang di villa, menantang ombak lewat kelas surfing, ikut paket tour seru, sampai membuat tato sebagai kenang-kenangan—semuanya sudah kami siapkan dengan aman dan nyaman untukmu.'),
  about_stat_1_val: z.string().default('100%'),
  about_stat_1_label: z.string().default('Sepenuh Hati'),
  about_stat_2_val: z.string().default('24/7'),
  about_stat_2_label: z.string().default('Teman Perjalanan'),
  about_image_1: z.string().optional().default(''),
  about_image_2: z.string().optional().default(''),

  // Services Section
  services_title: z.string().default('Pilih \nPetualanganmu'),
  services_subtitle: z.string().default('Mulai dari kamu mendarat sampai waktunya pulang, biarkan Doamandeh yang urus detailnya. Kami siapkan pilihan aktivitas dan fasilitas terbaik supaya liburanmu di Bali terasa santai, seru, dan pastinya bebas ribet.'),

  // Testimonials Section
  testimonials_title: z.string().default('Kisah & pengalaman liburan impian.'),
  testimonials_data: z.string().default(JSON.stringify([
    {
      id: '1',
      name: 'Rizky & Amelia',
      location: 'Jakarta',
      serviceCategory: 'Paket Tour',
      rating: 5,
      comment: 'Awalnya ragu ikut one-day tour ke Nusa Penida karena takut capek. Ternyata seru banget! Driver-nya super sabar, on-time, dan jago banget cari spot foto sepi buat kita.',
      date: 'Agustus 2026',
      image: '/assets/testimonial-tour.svg'
    },
    {
      id: '2',
      name: 'Budi Santoso',
      location: 'Surabaya',
      serviceCategory: 'Villa Stay',
      rating: 5,
      comment: 'Nyari villa buat keluarga tuh lumayan tricky, tapi Doamandeh ngasih rekomendasi yang pas banget. Villanya asri, bersih, dan private pool-nya aman buat anak-anak main seharian.',
      date: 'Agustus 2026',
      image: '/assets/testimonial-villa.svg'
    },
    {
      id: '3',
      name: 'Kevin & Partner',
      location: 'Jakarta',
      serviceCategory: 'Sewa Motor',
      rating: 5,
      comment: 'Sewa NMAX di sini prosesnya gampang banget, nggak ribet. Motornya diantar langsung ke villa kita di Canggu, kondisinya mulus dan bensin udah keisi penuh. Thanks, Doamandeh!',
      date: 'Juli 2026',
      image: '/assets/testimonial-motor.svg'
    },
    {
      id: '4',
      name: 'Keluarga Pratama',
      location: 'Medan',
      serviceCategory: 'Sewa Mobil',
      rating: 5,
      comment: 'Bawa rombongan keluarga besar jadi gampang karena sewa Innova Reborn plus driver. Bapak supirnya ramah banget dan hafal jalan tikus, jadi kita nggak tua di jalan karena macet.',
      date: 'Juli 2026',
      image: '/assets/testimonial-mobil.svg'
    },
    {
      id: '5',
      name: 'Julian M.',
      location: 'Australia',
      serviceCategory: 'Tattoo Studio',
      rating: 5,
      comment: 'Ini pengalaman tato pertama gue di Bali dan studionya bersih banget! Jarumnya baru dan dibuka di depan kita. Senimannya teliti banget ngerjain fineline custom design gue.',
      date: 'Juni 2026',
      image: '/assets/testimonial-tattoo.svg'
    },
    {
      id: '6',
      name: 'Sarah & Friends',
      location: 'Bandung',
      serviceCategory: 'Surfing Lesson',
      rating: 5,
      comment: 'Nekat nyoba surfing walau nggak terlalu jago berenang, haha! Untung instrukturnya sabar banget ngajarin teknik dasar sampai akhirnya aku bisa berdiri di papan pas ombak datang.',
      date: 'Juni 2026',
      image: '/assets/testimonial-surfing.svg'
    }
  ])),

  // FAQ Section
  faq_title: z.string().default('Jawaban untuk \nsetiap pertanyaanmu.'),
  faq_subtitle: z.string().default('Jawaban jelas mengenai proses pemesanan, fasilitas layanan, jadwal, dan semua kebutuhan perjalanan Anda di Bali.'),
  faq_image: z.string().optional().default(''),
  faq_data: z.string().default(JSON.stringify([
    {
      num: '01',
      question: 'Gimana Cara Booking Layanan Doamandeh?',
      answer: 'Gampang banget! Kamu bisa langsung pilih layanan di website ini dan klik tombol pesan, atau langsung chat admin kami via WhatsApp. Nanti tim Doamandeh bakal secepatnya konfirmasi jadwal buat kamu.'
    },
    {
      num: '02',
      question: 'Apa Saja Syarat Sewa Motor Atau Mobil?',
      answer: 'Cukup siapkan identitas asli (KTP atau Paspor) dan SIM yang masih aktif (SIM C buat motor, SIM A buat mobil). Asyiknya lagi, Doamandeh kasih gratis antar-jemput kendaraan langsung ke hotelmu untuk area tertentu lho!'
    },
    {
      num: '03',
      question: 'Studio Tattonya Aman Dan Steril Kan?',
      answer: 'Pasti dong! Keamananmu itu nomor satu buat kami. Doamandeh pakai jarum dan alat sekali pakai (single-use) yang dibuka langsung di depanmu, tinta impor standar medis, plus studionya selalu rutin didisinfeksi.'
    },
    {
      num: '04',
      question: 'Sewa Villa Sudah Termasuk Bersih-Bersih?',
      answer: 'Sudah all-in! Nginep di villa Doamandeh udah pasti dapet private pool, WiFi kenceng, AC, alat mandi, sampai layanan bersih-bersih tiap hari (daily housekeeping). Kamu tinggal santai aja tanpa ada biaya tambahan.'
    },
    {
      num: '05',
      question: 'Belum Pernah Surfing, Bisa Ikut Kelasnya?',
      answer: 'Bisa banget! Instruktur selancar Doamandeh udah terbiasa dan sabar banget ngajarin pemula. Awalnya kita akan latihan santai di air dangkal dulu dengan pengawasan 1-on-1, jadi dijamin aman dan fun.'
    }
  ])),

  // CTA Section
  cta_tagline: z.string().default('// LAYANAN UNGGULAN DOAMANDEH'),
  cta_title: z.string().default('Solusi lengkap \nliburanmu di Bali.'),
  cta_subtitle: z.string().default('Pilih layanan favoritmu dari Doamandeh untuk pengalaman wisata, akomodasi, serta lifestyle terbaik di Pulau Dewata.'),
  cta_button_text: z.string().default('Pesan Layanan Sekarang'),
  cta_card_travel_img: z.string().optional().default(''),
  cta_card_vehicle_img: z.string().optional().default(''),
  cta_card_villa_img: z.string().optional().default(''),
  cta_card_tattoo_img: z.string().optional().default(''),
  cta_card_surfing_img: z.string().optional().default(''),

  // Contact & Operations
  contact_phone: z.string().default('+62 812-3456-7890'),
  contact_whatsapp: z.string().default('+62 812-3456-7890'),
  contact_whatsapp_2: z.string().optional().default(''),
  contact_email: z.string().email('Format email kontak tidak valid').or(z.literal('')).default('info@doamandeh.com'),
  contact_address: z.string().default('Jl. Raya Canggu No. 88, Badung, Bali - Indonesia'),
  operating_hours_title: z.string().default('Buka Setiap Hari'),
  operating_hours_time: z.string().default('08:00 - 22:00 WITA'),
  operating_hours_note: z.string().default('Reservasi Server 24/7'),
  footer_brand_desc: z.string().default('Partner liburan dan lifestyle eksklusif di Bali. Menyediakan sewa motor, mobil, studio tato higienis, villa estetik, paket tour seru, dan kelas selancar.'),

  // Social Media
  sosmed_instagram: z.string().default('https://instagram.com/doamandeh'),
  sosmed_facebook: z.string().default('https://facebook.com/doamandeh'),
  sosmed_tiktok: z.string().default('https://tiktok.com/@doamandeh'),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const DEFAULT_SITE_SETTINGS: SiteSettingsInput = siteSettingsSchema.parse({});


