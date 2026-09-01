import { createClient } from '@/lib/supabase/server';
import { Service, Booking } from '@/types/database';
import Link from 'next/link';
import {
  Package,
  CalendarCheck,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
  TrendingUp,
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

  // Category counts
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

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3 w-3" />
              Doamandeh CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Administrator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Ringkasan data operasional layanan dan pemesanan wisata secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            + Kelola Layanan
          </Link>
          <Link
            href="/admin/bookings"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Lihat Booking ({pendingBookings} Baru)
          </Link>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Layanan */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Layanan</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalServices}</span>
            <span className="text-xs font-medium text-emerald-400">
              {activeServices} Aktif
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Terbagi dalam 5 kategori wisata</p>
        </div>

        {/* Total Bookings */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Booking</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400 border border-blue-500/20">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalBookings}</span>
            <span className="text-xs font-medium text-blue-400">
              {confirmedBookings + completedBookings} Berhasil
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Pemesanan customer masuk</p>
        </div>

        {/* Booking Pending */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Perlu Konfirmasi</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{pendingBookings}</span>
            <span className="text-xs font-medium text-zinc-400">
              Status Pending
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Memerlukan tindak lanjut admin</p>
        </div>

        {/* Est. Revenue */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimasi Omzet</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-emerald-400">
              {formatRupiah(estimatedRevenue)}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Dari booking confirmed & completed</p>
        </div>
      </div>

      {/* Categories Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            Distribusi Layanan per Kategori
          </h2>
          <div className="space-y-3 text-xs">
            {[
              { label: 'Sewa Kendaraan (Motor & Mobil)', count: categoryCounts['vehicle-rental'] },
              { label: 'Tato Studio', count: categoryCounts['tattoo'] },
              { label: 'Villa & Stay', count: categoryCounts['villa'] },
              { label: 'Paket Travel & Tour', count: categoryCounts['travel'] },
              { label: 'Surfing Lesson', count: categoryCounts['surfing-lesson'] },
            ].map((cat) => (
              <div
                key={cat.label}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80"
              >
                <span className="text-zinc-300 font-medium">{cat.label}</span>
                <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Overview */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-blue-400" />
                Booking Terbaru
              </h2>
              <Link
                href="/admin/bookings"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="py-10 text-center text-zinc-500 text-xs">
                Belum ada booking yang masuk.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{b.customer_name}</p>
                      <p className="text-[11px] text-zinc-400">
                        {b.service?.title || 'Layanan Umum'} • {b.booking_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-300">
                        {b.total_price ? formatRupiah(b.total_price) : '-'}
                      </span>
                      <span
                        className={`capitalize px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          b.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : b.status === 'confirmed'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : b.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
