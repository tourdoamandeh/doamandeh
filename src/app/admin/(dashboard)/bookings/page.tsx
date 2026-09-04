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
    <div className="space-y-6 font-sans">
      {/* Editorial Header */}
      <div className="pb-2 border-b-2 border-brown/20">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
          // DAFTAR RESERVASI &amp; JADWAL
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-brown mt-0.5">
          Manajemen Reservasi Booking
        </h1>
        <p className="text-xs text-brown/80 mt-1 font-light">
          Pantau status pesanan pelanggan, jadwal pemakaian layanan, dan kirim pesan konfirmasi via WhatsApp.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-none bg-softyellow border-2 border-brown text-brown flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-brown shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wider">Gagal Mengambil Data Booking</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Bookings Interactive Table */}
      <BookingsTable initialBookings={bookings} services={services} />
    </div>
  );
}
