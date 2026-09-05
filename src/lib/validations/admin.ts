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
  // Brand & Header
  brand_name: z.string().default("Do'amandeh"),
  brand_tagline: z.string().default('Tours & Travel Bali'),
  header_cta_text: z.string().default('Konsultasi Cepat'),

  // Hero Section
  hero_tagline: z.string().default("// DO'AMANDEH TOURS & TRAVEL BALI"),
  hero_title: z.string().default("Do'amandeh, \n— Rencanakan \nPerjalanan"),
  hero_subtitle: z.string().default('Solusi lengkap kebutuhan aktivitas liburan Anda di Bali: Sewa Motor & Mobil, Tato Artistik, Villa Nyaman, Paket Wisata Tour, hingga Kelas Surfing.'),
  hero_image_url: z.string().optional().default(''),
  hero_bg_image: z.string().optional().default(''),
  hero_cta_btn_text: z.string().default('Lihat Layanan Kami'),
  hero_slide_travel_img: z.string().optional().default(''),
  hero_slide_villa_img: z.string().optional().default(''),
  hero_slide_surfing_img: z.string().optional().default(''),
  hero_slide_vehicle_img: z.string().optional().default(''),
  hero_slide_tattoo_img: z.string().optional().default(''),
  hero_slide_travel_quote: z.string().default('Biar kami yang merencanakan,\nkamu cukup menikmati\n— momennya.'),
  hero_slide_travel_desc: z.string().default('Temukan Bali yang sebenarnya. Dari pesona pura sakral hingga pantai tersembunyi, paket perjalanan kami dirancang agar kamu bisa bersantai penuh tanpa pusing memikirkan rute atau tiket.'),
  hero_slide_villa_quote: z.string().default('Ruang tenang untuk\nkembali berpulang\n— di tengah surga tropis.'),
  hero_slide_villa_desc: z.string().default("Setelah seharian menjelajah, rebahkan diri di villa eksklusif pilihan Do'amandeh. Nikmati privasi penuh, kolam renang pribadi, dan suasana tenang yang membuatmu merasa seperti di rumah sendiri."),
  hero_slide_surfing_quote: z.string().default('Taklukkan ombak,\nbebaskan jiwa\n— di pantai Bali.'),
  hero_slide_surfing_desc: z.string().default('Belum pernah menyentuh papan selancar? Tidak masalah. Instruktur ramah kami siap membantumu berdiri dan menunggangi ombak pertamamu dengan aman, seru, dan penuh tawa.'),
  hero_slide_vehicle_quote: z.string().default('Jelajahi setiap sudutnya,\ntemukan ceritamu sendiri\n— di Bali.'),
  hero_slide_vehicle_desc: z.string().default('Tinggalkan jadwal yang kaku. Dengan pilihan motor matic dan mobil pribadi kami yang terawat rapi, kamu bebas menentukan sendiri ke mana angin Bali akan membawamu hari ini.'),
  hero_slide_tattoo_quote: z.string().default('Bawa pulang kenangan\nyang tak akan pernah pudar\n— bersama seniman terbaik.'),
  hero_slide_tattoo_desc: z.string().default('Ceritakan perjalananmu lewat seni tubuh custom di studio higienis kami. Dikerjakan oleh seniman lokal Bali dengan standar kebersihan internasional yang ketat.'),

  // About Section
  about_tagline: z.string().default("// TENTANG DO'AMANDEH"),
  about_title: z.string().default("Bersama Do'amandeh, liburan di Bali tak seharusnya terasa melelahkan. Kami mengurus setiap detail perjalanannya, agar kamu bisa benar-benar rileks, menikmati momen, dan menemukan ketenangan."),
  about_subtitle: z.string().default('// BALI TOURS, STAYS & LIFESTYLE CURATION'),
  about_text: z.string().default("Do'amandeh hadir untuk jadi teman perjalananmu selama di pulau dewata. Apa pun gaya liburan yang kamu inginkan—mulai dari sewa kendaraan untuk keliling bebas, bersantai tenang di villa, menantang ombak lewat kelas surfing, ikut paket tour seru, sampai membuat tato sebagai kenang-kenangan—semuanya sudah kami siapkan dengan aman dan nyaman untukmu."),
  about_secondary_text: z.string().default('Dengan berfokus pada transparansi tarif, keramahan komunikasi lokal yang cepat, dan kualitas unit yang terinspeksi setiap saat, kami memastikan liburan santai Anda di Pulau Dewata berlangsung tenang dari awal penjemputan hingga kepulangan.'),
  about_btn_text: z.string().default('Konsultasi Liburan'),
  about_stat_1_val: z.string().default('10.000+'),
  about_stat_1_label: z.string().default('Wisatawan Terlayani'),
  about_stat_2_val: z.string().default('99.4%'),
  about_stat_2_label: z.string().default('Tingkat Kepuasan'),
  about_stat_3_val: z.string().default('50+'),
  about_stat_3_label: z.string().default('Armada & Fasilitas Aktif'),
  about_stat_4_val: z.string().default('24/7'),
  about_stat_4_label: z.string().default('Dukungan Staf Lokal'),
  about_image_1: z.string().optional().default(''),
  about_image_2: z.string().optional().default(''),
  about_principle_1_title: z.string().default('Kurasi Mandiri Tanpa Pihak Ketiga'),
  about_principle_1_desc: z.string().default('Setiap armada kendaraan, villa mitra privat, jarum studio tato steril, dan papan selancar kami inspeksi langsung demi menjamin higienitas, kebersihan, dan standar keamanan tertinggi.'),
  about_principle_2_title: z.string().default('Responsivitas Nyata Tanpa Bot Kaku'),
  about_principle_2_desc: z.string().default('Anda terhubung langsung dengan tim lokal berpengalaman di Canggu dan Denpasar yang memahami rute, cuaca, dan kondisi lapangan secara real-time—bukan balasan bot otomatis.'),
  about_principle_3_title: z.string().default('Transparansi Tarif Tanpa Biaya Tersembunyi'),
  about_principle_3_desc: z.string().default('Tarif yang tercantum di katalog adalah biaya pasti. Tanpa biaya tambahan helm, jas hujan, atau mark-up tersembunyi yang merepotkan liburan Anda.'),
  about_principle_4_title: z.string().default('Fleksibilitas Penjemputan & Jadwal Liburan'),
  about_principle_4_desc: z.string().default('Kami menyesuaikan ritme santaimu. Gratis pengantaran armada ke hotel/villa di area Canggu, Seminyak, Kuta, maupun koordinasi meeting point yang mudah dijangkau.'),

  // Services Section (Homepage)
  services_title: z.string().default('Pilih \nPetualanganmu'),
  services_subtitle: z.string().default("Mulai dari kamu mendarat sampai waktunya pulang, biarkan Do'amandeh yang urus detailnya. Kami siapkan pilihan aktivitas dan fasilitas terbaik supaya liburanmu di Bali terasa santai, seru, dan pastinya bebas ribet."),
  services_btn_text: z.string().default('Lihat keseruan lainnya'),

  // Services Catalog Page (/services)
  services_page_tagline: z.string().default('// LAYANAN'),
  services_page_title: z.string().default('Services'),
  services_page_description: z.string().default('Koleksi pengalaman, mobilitas privat, hunian villa, seni tato higienis, dan kelas selancar yang siap diatur untuk liburanmu di Bali.'),
  services_banner_image: z.string().optional().default(''),
  services_banner_tagline: z.string().default('// BALI EXPERIENCES & STAYS'),
  services_banner_title: z.string().default('Eksplorasi Bali dengan Layanan Terbaik & Terpercaya'),
  services_banner_subtitle: z.string().default('Pilihan lengkap sewa motor & mobil matic, private villa, studio tato higienis, tour Nusa Penida, dan kelas selancar.'),

  // Testimonials Section
  testimonials_title: z.string().default('Kisah & pengalaman liburan impian.'),
  testimonials_cta_text: z.string().default('Bagikan Ceritamu'),
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
      comment: "Nyari villa buat keluarga tuh lumayan tricky, tapi Do'amandeh ngasih rekomendasi yang pas banget. Villanya asri, bersih, dan private pool-nya aman buat anak-anak main seharian.",
      date: 'Agustus 2026',
      image: '/assets/testimonial-villa.svg'
    },
    {
      id: '3',
      name: 'Kevin & Partner',
      location: 'Jakarta',
      serviceCategory: 'Sewa Motor',
      rating: 5,
      comment: "Sewa NMAX di sini prosesnya gampang banget, nggak ribet. Motornya diantar langsung ke villa kita di Canggu, kondisinya mulus dan bensin udah keisi penuh. Thanks, Do'amandeh!",
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
      question: "Gimana Cara Booking Layanan Do'amandeh?",
      answer: "Gampang banget! Kamu bisa langsung pilih layanan di website ini dan klik tombol pesan, atau langsung chat admin kami via WhatsApp. Nanti tim Do'amandeh bakal secepatnya konfirmasi jadwal buat kamu."
    },
    {
      num: '02',
      question: 'Apa Saja Syarat Sewa Motor Atau Mobil?',
      answer: "Cukup siapkan identitas asli (KTP atau Paspor) dan SIM yang masih aktif (SIM C buat motor, SIM A buat mobil). Asyiknya lagi, Do'amandeh kasih gratis antar-jemput kendaraan langsung ke hotelmu untuk area tertentu lho!"
    },
    {
      num: '03',
      question: 'Studio Tattonya Aman Dan Steril Kan?',
      answer: "Pasti dong! Keamananmu itu nomor satu buat kami. Do'amandeh pakai jarum dan alat sekali pakai (single-use) yang dibuka langsung di depanmu, tinta impor standar medis, plus studionya selalu rutin didisinfeksi."
    },
    {
      num: '04',
      question: 'Sewa Villa Sudah Termasuk Bersih-Bersih?',
      answer: "Sudah all-in! Nginep di villa Do'amandeh udah pasti dapet private pool, WiFi kenceng, AC, alat mandi, sampai layanan bersih-bersih tiap hari (daily housekeeping). Kamu tinggal santai aja tanpa ada biaya tambahan."
    },
    {
      num: '05',
      question: 'Belum Pernah Surfing, Bisa Ikut Kelasnya?',
      answer: "Bisa banget! Instruktur selancar Do'amandeh udah terbiasa dan sabar banget ngajarin pemula. Awalnya kita akan latihan santai di air dangkal dulu dengan pengawasan 1-on-1, jadi dijamin aman dan fun."
    }
  ])),

  // CTA Section
  cta_tagline: z.string().default("// LAYANAN UNGGULAN DO'AMANDEH"),
  cta_title: z.string().default('Solusi lengkap \nliburanmu di Bali.'),
  cta_subtitle: z.string().default("Pilih layanan favoritmu dari Do'amandeh untuk pengalaman wisata, akomodasi, serta lifestyle terbaik di Pulau Dewata."),
  cta_button_text: z.string().default('Pesan Layanan Sekarang'),
  cta_card_travel_img: z.string().optional().default(''),
  cta_card_vehicle_img: z.string().optional().default(''),
  cta_card_villa_img: z.string().optional().default(''),
  cta_card_tattoo_img: z.string().optional().default(''),
  cta_card_surfing_img: z.string().optional().default(''),

  // Contact & Operations (/contact)
  contact_title: z.string().default("Let's Talk"),
  contact_subtitle: z.string().default('Punya pertanyaan ketersediaan armada, konsultasi desain tato, ketersediaan villa privat, atau rencana tour kustom di Bali? Hubungi saluran resmi kami kapan saja.'),
  contact_phone: z.string().default('+62 812-3456-7890'),
  contact_whatsapp: z.string().default('+62 812-3456-7890'),
  contact_whatsapp_2: z.string().optional().default(''),
  contact_email: z.string().email('Format email kontak tidak valid').or(z.literal('')).default('info@doamandeh.com'),
  contact_address: z.string().default('Jl. Raya Canggu No. 88, Badung, Bali - Indonesia'),
  contact_map_url: z.string().default('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.4764835697664!2d115.1328!3d-8.6481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23882772e0b51%3A0x6b4f74d08df55222!2sCanggu%2C%20Kuta%20Utara%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid'),
  operating_hours_title: z.string().default('Buka Setiap Hari'),
  operating_hours_time: z.string().default('08:00 - 22:00 WITA'),
  operating_hours_note: z.string().default('Reservasi Server 24/7'),
  footer_brand_desc: z.string().default('Partner liburan dan lifestyle eksklusif di Bali. Menyediakan sewa motor, mobil, studio tato higienis, villa estetik, paket tour seru, dan kelas selancar.'),

  // Social Media
  sosmed_instagram: z.string().default('https://instagram.com/doamandeh'),
  sosmed_facebook: z.string().default('https://facebook.com/doamandeh'),
  sosmed_tiktok: z.string().default('https://tiktok.com/@doamandeh'),
  sosmed_youtube: z.string().optional().default(''),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const DEFAULT_SITE_SETTINGS: SiteSettingsInput = siteSettingsSchema.parse({});


