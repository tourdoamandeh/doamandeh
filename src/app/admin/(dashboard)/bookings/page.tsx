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
      {/* Page Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bookings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pantau status pesanan pelanggan, jadwal pemakaian layanan, dan kirim pesan konfirmasi via WhatsApp.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-xs">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Gagal Mengambil Data Booking</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Bookings Interactive Table */}
      <BookingsTable initialBookings={bookings} services={services} />
    </div>
  );
}
