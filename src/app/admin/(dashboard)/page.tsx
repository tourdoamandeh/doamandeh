import { createClient } from '@/lib/supabase/server';
import { Service, Booking } from '@/types/database';
import Link from 'next/link';
import {
  Package,
  CalendarCheck,
  ArrowRight,
  Plus,
  Search,
  ExternalLink,
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
    <div className="space-y-6">
      {/* Topbar Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Overview</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#115E59] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Layanan</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <span>Semua Booking ({pendingBookings} Pending)</span>
          </Link>
        </div>
      </div>

      {/* Dense KPI Row (No AI slop, large mono numbers, clean 1px borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Booking */}
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
            Total Booking
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
              {totalBookings}
            </span>
            <span className="font-mono text-xs text-stone-500 tabular-nums">
              {confirmedBookings + completedBookings} sukses
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Pemesanan customer terdaftar</p>
        </div>

        {/* Pending Action */}
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
            Perlu Konfirmasi
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 tabular-nums">
              {pendingBookings}
            </span>
            <span className="text-xs font-medium text-amber-700">
              {pendingBookings > 0 ? 'Action required' : 'Clear'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Booking menunggu tindakan admin</p>
        </div>

        {/* Layanan Aktif */}
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
            Layanan Aktif
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#0F766E] tabular-nums">
              {activeServices}
            </span>
            <span className="font-mono text-xs text-stone-500 tabular-nums">
              dari {totalServices} katalog
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Siap dipesan di website</p>
        </div>

        {/* Revenue Estimate */}
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
            Estimasi Transaksi
          </p>
          <div className="mt-2">
            <span className="font-mono text-xl font-bold tracking-tight text-stone-900 tabular-nums truncate block">
              {formatRupiah(estimatedRevenue)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Status confirmed & completed</p>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings (2/3 width) */}
        <div className="lg:col-span-2 rounded-lg border border-stone-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50/50">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Pemesanan Terbaru
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Aktivitas pemesanan paket wisata & layanan terakhir
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-medium text-[#0F766E] hover:text-[#115E59] inline-flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarCheck className="h-6 w-6 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-stone-600">Belum ada data pemesanan yang masuk.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-2.5">Pelanggan</th>
                    <th className="px-4 py-2.5">Layanan</th>
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5">Total Biaya</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="h-11 hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-2 font-medium text-stone-900 truncate max-w-[140px]">
                        {b.customer_name}
                      </td>
                      <td className="px-4 py-2 text-stone-600 truncate max-w-[160px]">
                        {b.service?.title || 'Layanan Umum'}
                      </td>
                      <td className="px-4 py-2 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                        {b.booking_date}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs font-medium text-stone-900 tabular-nums whitespace-nowrap">
                        {b.total_price ? formatRupiah(b.total_price) : '-'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {b.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Pending
                          </span>
                        )}
                        {b.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0F766E]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                            Confirmed
                          </span>
                        )}
                        {b.status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Completed
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
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
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
              Distribusi Katalog
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
                  className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0"
                >
                  <span className="text-stone-600">{item.label}</span>
                  <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                    {item.count} unit
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Quick Links */}
          <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Akses Cepat
            </h2>
            <div className="space-y-1.5 text-xs">
              <Link
                href="/admin/services"
                className="flex items-center justify-between p-2 rounded-md hover:bg-stone-50 border border-transparent hover:border-stone-200 text-stone-700 font-medium transition-colors"
              >
                <span>Kelola Daftar Layanan</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>
              <Link
                href="/admin/bookings"
                className="flex items-center justify-between p-2 rounded-md hover:bg-stone-50 border border-transparent hover:border-stone-200 text-stone-700 font-medium transition-colors"
              >
                <span>Kelola Semua Booking</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-2 rounded-md hover:bg-stone-50 border border-transparent hover:border-stone-200 text-stone-700 font-medium transition-colors"
              >
                <span>Pengaturan Konten Website</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
