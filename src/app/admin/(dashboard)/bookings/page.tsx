import { createClient } from '@/lib/supabase/server';
import { Booking, Service } from '@/types/database';
import { BookingsTable } from '@/components/admin/bookings-table';
import { CalendarCheck, AlertCircle } from 'lucide-react';

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  let bookings: (Booking & { service?: Service | null })[] = [];
  let services: Service[] = [];
  let errorMessage: string | null = null;

  try {
    const [bookingsRes, servicesRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('*, service:services(*)')
        .order('created_at', { ascending: false }),
      supabase
        .from('services')
        .select('*')
        .order('title', { ascending: true }),
    ]);

    if (bookingsRes.error) {
      errorMessage = bookingsRes.error.message;
    } else {
      bookings = (bookingsRes.data as (Booking & { service?: Service | null })[]) || [];
    }

    if (servicesRes.data) {
      services = (servicesRes.data as Service[]) || [];
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Gagal memuat data booking.';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <CalendarCheck className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Reservasi & Pesanan
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Daftar Pemesanan (Bookings)
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Pantau seluruh pesanan masuk, konfirmasi jadwal layanan, dan perbarui status pengerjaan reservasi.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-red-300">Gagal Mengambil Data Booking</h3>
            <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Bookings Interactive Table */}
      <BookingsTable initialBookings={bookings} services={services} />
    </div>
  );
}
