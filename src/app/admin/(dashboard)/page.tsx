import { createClient } from '@/lib/supabase/server';
import { Service, Booking } from '@/types/database';
import Link from 'next/link';
import {
  CalendarCheck,
  ArrowRight,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch all services
  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  const services: Service[] = (servicesData as Service[]) || [];

  // 2. Fetch all bookings with service relation
  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('*, service:services(*)')
    .order('created_at', { ascending: false });

  const bookings: (Booking & { service?: Service | null })[] =
    (bookingsData as (Booking & { service?: Service | null })[]) || [];

  // Metrics calculation
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.is_active).length;

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;

  const estimatedRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  // Category distribution
  const categoryCounts: Record<string, number> = {
    'vehicle-rental': 0,
    tattoo: 0,
    villa: 0,
    travel: 0,
    'surfing-lesson': 0,
  };

  services.forEach((s) => {
    if (categoryCounts[s.category] !== undefined) {
      categoryCounts[s.category]++;
    }
  });

  const recentBookings = bookings.slice(0, 6);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Operations */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-brown/20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
            // DOAMANDEH TOURS &amp; TRAVEL
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-brown mt-0.5">
            Overview Operasional
          </h1>
          <p className="text-xs text-brown/80 mt-1 font-light">
            Ringkasan pemesanan paket wisata, status katalog aktif, dan estimasi nilai reservasi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown hover:border-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-none"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Tambah Layanan</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 rounded-none bg-softwhite text-brown hover:bg-softyellow border-2 border-brown px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-none"
          >
            <span>Semua Booking ({pendingBookings})</span>
          </Link>
        </div>
      </div>

      {/* KPI Bento Row (DESIGN.md Flat Geometric with 2px borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Booking */}
        <div className="rounded-none border-2 border-brown bg-softwhite p-5 shadow-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brown/70">
            Total Booking
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-brown">
              {totalBookings}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-softblue">
              {confirmedBookings + completedBookings} sukses
            </span>
          </div>
          <p className="text-[11px] text-brown/75 font-light mt-1">Pemesanan customer tercatat</p>
        </div>

        {/* Pending Action */}
        <div className="rounded-none border-2 border-brown bg-softyellow p-5 shadow-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brown/70">
            Perlu Konfirmasi
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-black">
              {pendingBookings}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brown">
              {pendingBookings > 0 ? 'Tindakan diperlukan' : 'Aman'}
            </span>
          </div>
          <p className="text-[11px] text-brown/75 font-light mt-1">Menunggu respon admin</p>
        </div>

        {/* Layanan Aktif */}
        <div className="rounded-none border-2 border-brown bg-softwhite p-5 shadow-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brown/70">
            Katalog Aktif
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-brown">
              {activeServices}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brown/60">
              dari {totalServices} paket
            </span>
          </div>
          <p className="text-[11px] text-brown/75 font-light mt-1">Ditampilkan di publik</p>
        </div>

        {/* Revenue Estimate */}
        <div className="rounded-none border-2 border-brown bg-softwhite p-5 shadow-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brown/70">
            Estimasi Transaksi
          </p>
          <div className="mt-2">
            <span className="text-2xl font-bold tracking-tight text-brown truncate block">
              {formatRupiah(estimatedRevenue)}
            </span>
          </div>
          <p className="text-[11px] text-brown/75 font-light mt-1">Status confirmed &amp; completed</p>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings (2/3 width) */}
        <div className="lg:col-span-2 rounded-none border-2 border-brown bg-softwhite overflow-hidden shadow-none">
          <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-brown bg-softyellow/60">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
                Pemesanan Terkini
              </h2>
              <p className="text-[11px] text-brown/70 mt-0.5">
                Aktivitas reservasi paket tour &amp; layanan terakhir
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs uppercase tracking-wider font-bold text-brown hover:text-black inline-flex items-center gap-1.5 border-b border-brown"
            >
              <span>Semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarCheck className="h-8 w-8 text-brown/40 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-brown">
                Belum ada data reservasi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-black">
                <thead className="bg-brown text-softyellow text-[10px] font-bold uppercase tracking-wider border-b-2 border-brown">
                  <tr>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Layanan</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Biaya</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brown/20">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="h-12 hover:bg-brown/5 transition-colors">
                      <td className="px-4 py-2 font-semibold text-black truncate max-w-[140px]">
                        {b.customer_name}
                      </td>
                      <td className="px-4 py-2 text-brown/90 truncate max-w-[160px]">
                        {b.service?.title || 'Layanan Umum'}
                      </td>
                      <td className="px-4 py-2 font-mono text-[11px] text-black whitespace-nowrap">
                        {b.booking_date}
                      </td>
                      <td className="px-4 py-2 font-bold text-xs text-black whitespace-nowrap">
                        {b.total_price ? formatRupiah(b.total_price) : '-'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {b.status === 'pending' && (
                          <span className="inline-block px-2 py-0.5 rounded-none border border-brown bg-softyellow text-[10px] font-bold uppercase tracking-wider text-brown">
                            Pending
                          </span>
                        )}
                        {b.status === 'confirmed' && (
                          <span className="inline-block px-2 py-0.5 rounded-none border border-softblue bg-softblue text-[10px] font-bold uppercase tracking-wider text-softyellow">
                            Confirmed
                          </span>
                        )}
                        {b.status === 'completed' && (
                          <span className="inline-block px-2 py-0.5 rounded-none border border-black bg-black text-[10px] font-bold uppercase tracking-wider text-softyellow">
                            Completed
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="inline-block px-2 py-0.5 rounded-none border border-brown bg-white text-[10px] font-bold uppercase tracking-wider text-black">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown & Operations (1/3 width) */}
        <div className="space-y-6">
          {/* Distribution Card */}
          <div className="rounded-none border-2 border-brown bg-softwhite p-5 shadow-none">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brown mb-3 pb-2 border-b-2 border-brown/20">
              Distribusi Katalog Layanan
            </h2>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Sewa Kendaraan', count: categoryCounts['vehicle-rental'] },
                { label: 'Tato Studio', count: categoryCounts['tattoo'] },
                { label: 'Villa & Stay', count: categoryCounts['villa'] },
                { label: 'Paket Travel', count: categoryCounts['travel'] },
                { label: 'Surfing Lesson', count: categoryCounts['surfing-lesson'] },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-brown/15 last:border-0"
                >
                  <span className="text-brown font-medium">{item.label}</span>
                  <span className="font-bold text-xs text-black">
                    {item.count} unit
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Quick Links */}
          <div className="rounded-none border-2 border-brown bg-softwhite p-5 space-y-3 shadow-none">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brown pb-2 border-b-2 border-brown/20">
              Menu Cepat
            </h2>
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3 rounded-none bg-softyellow/50 border border-brown text-brown font-bold uppercase tracking-wider hover:bg-brown hover:text-softyellow transition-colors"
              >
                <span>Kelola Layanan Wisata</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/bookings"
                className="flex items-center justify-between p-3 rounded-none bg-softyellow/50 border border-brown text-brown font-bold uppercase tracking-wider hover:bg-brown hover:text-softyellow transition-colors"
              >
                <span>Kelola Reservasi Booking</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-none bg-softyellow/50 border border-brown text-brown font-bold uppercase tracking-wider hover:bg-brown hover:text-softyellow transition-colors"
              >
                <span>Pengaturan Konten Website</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
