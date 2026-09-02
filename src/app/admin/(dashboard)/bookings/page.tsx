import { createClient } from '@/lib/supabase/server';
import { Booking, Service } from '@/types/database';
import { BookingsTable } from '@/components/admin/bookings-table';
import { AlertCircle } from 'lucide-react';

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
      {/* Operations Header with Breadcrumb */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
          <span>Admin</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Booking</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Daftar Pemesanan Layanan
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manajemen status pesanan, konfirmasi jadwal, dan detail kontak pelanggan.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900">Gagal Mengambil Data Booking</p>
            <p className="text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Bookings Interactive Table */}
      <BookingsTable initialBookings={bookings} services={services} />
    </div>
  );
}
