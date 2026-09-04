import { createClient } from '@/lib/supabase/server';
import { Service, Booking } from '@/types/database';
import Link from 'next/link';
import { Plus, ArrowRight, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { OverviewCharts } from '@/components/admin/overview-charts';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch services
  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  const services: Service[] = (servicesData as Service[]) || [];

  // 2. Fetch bookings
  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('*, service:services(*)')
    .order('created_at', { ascending: false });

  const bookings: (Booking & { service?: Service | null })[] =
    (bookingsData as (Booking & { service?: Service | null })[]) || [];

  // Metrics
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
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan pemesanan paket wisata, status katalog aktif, dan estimasi nilai transaksi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Lihat Booking ({pendingBookings} pending)
          </Link>
          <Link
            href="/admin/services"
            className={buttonVariants({ size: 'sm', className: 'bg-primary hover:bg-primary/90 text-primary-foreground' })}
          >
            <Plus className="size-4 mr-1.5" />
            Tambah Layanan
          </Link>
        </div>
      </div>

      {/* KPI Cards Row (ADMIN_UI.md standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Booking */}
        <Card className="p-6 bg-card border-border shadow-none">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Booking
            </span>
            <span className="text-xs font-medium text-success">
              {confirmedBookings + completedBookings} sukses
            </span>
          </div>
          <div className="text-3xl font-mono tabular-nums text-foreground">
            {totalBookings}
          </div>
        </Card>

        {/* Perlu Konfirmasi */}
        <Card className="p-6 bg-card border-border shadow-none">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Perlu Konfirmasi
            </span>
            {pendingBookings > 0 ? (
              <span className="text-xs font-medium text-warning">Perlu respon</span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">Aman</span>
            )}
          </div>
          <div className="text-3xl font-mono tabular-nums text-foreground">
            {pendingBookings}
          </div>
        </Card>

        {/* Layanan Aktif */}
        <Card className="p-6 bg-card border-border shadow-none">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Katalog Aktif
            </span>
            <span className="text-xs text-muted-foreground">
              dari {totalServices} paket
            </span>
          </div>
          <div className="text-3xl font-mono tabular-nums text-foreground">
            {activeServices}
          </div>
        </Card>

        {/* Estimasi Transaksi */}
        <Card className="p-6 bg-card border-border shadow-none">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Estimasi Transaksi
            </span>
            <span className="text-xs text-muted-foreground">Confirmed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono tabular-nums text-foreground truncate">
            {formatRupiah(estimatedRevenue)}
          </div>
        </Card>
      </div>

      {/* Charts Section (shadcn Chart components) */}
      <OverviewCharts
        bookings={bookings}
        services={services}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2/3) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base font-semibold">Pemesanan Terkini</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aktivitas reservasi paket tour &amp; layanan terakhir
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-xs text-muted-foreground hover:text-foreground flex items-center gap-1' })}
            >
              <span>Semua</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="size-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Package className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Belum ada booking</h3>
                <p className="text-xs text-muted-foreground">
                  Data reservasi dari pelanggan akan muncul di sini.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                      Pelanggan
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                      Layanan
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                      Tanggal
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                      Biaya
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((b) => (
                    <TableRow key={b.id} className="h-11 hover:bg-muted/40 border-b border-border transition-colors">
                      <TableCell className="font-medium text-xs truncate max-w-[140px]">
                        {b.customer_name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {b.service?.title || 'Layanan'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                        {b.booking_date}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium tabular-nums whitespace-nowrap">
                        {b.total_price ? formatRupiah(b.total_price) : '-'}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <span
                            className={`size-2 rounded-full ${
                              b.status === 'confirmed'
                                ? 'bg-success'
                                : b.status === 'completed'
                                ? 'bg-info'
                                : b.status === 'pending'
                                ? 'bg-warning'
                                : 'bg-danger'
                            }`}
                          />
                          <span
                            className={`capitalize ${
                              b.status === 'confirmed'
                                ? 'text-success'
                                : b.status === 'completed'
                                ? 'text-info'
                                : b.status === 'pending'
                                ? 'text-warning'
                                : 'text-danger'
                            }`}
                          >
                            {b.status}
                          </span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Status Breakdown & Quick Access (1/3) */}
        <div className="space-y-6">
          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Status Reservasi</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {[
                {
                  label: 'Terkonfirmasi (Confirmed)',
                  count: confirmedBookings,
                  colorClass: 'text-success bg-success-bg border-success/30',
                },
                {
                  label: 'Selesai (Completed)',
                  count: completedBookings,
                  colorClass: 'text-info bg-info-bg border-info/30',
                },
                {
                  label: 'Menunggu (Pending)',
                  count: pendingBookings,
                  colorClass: 'text-warning bg-warning-bg border-warning/30',
                },
                {
                  label: 'Dibatalkan (Cancelled)',
                  count: bookings.filter((b) => b.status === 'cancelled').length,
                  colorClass: 'text-danger bg-danger-bg border-danger/30',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 text-xs"
                >
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span
                    className={`font-mono tabular-nums font-semibold px-2 py-0.5 rounded border text-[11px] ${item.colorClass}`}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Akses Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <Link
                href="/admin/services"
                className={buttonVariants({ variant: 'outline', className: 'w-full justify-start text-xs h-9' })}
              >
                Kelola Katalog Layanan
              </Link>
              <Link
                href="/admin/bookings"
                className={buttonVariants({ variant: 'outline', className: 'w-full justify-start text-xs h-9' })}
              >
                Kelola Reservasi Booking
              </Link>
              <Link
                href="/admin/settings"
                className={buttonVariants({ variant: 'outline', className: 'w-full justify-start text-xs h-9' })}
              >
                Pengaturan Konten &amp; CMS
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
