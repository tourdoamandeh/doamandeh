'use client';

import { useState, useTransition } from 'react';
import { Booking, BookingStatus, Service, ServiceCategory } from '@/types/database';
import { toast } from 'sonner';
import {
  updateBookingStatusAction,
  deleteBookingAction,
} from '@/lib/actions/admin/bookings';
import { BookingFormDialog } from './booking-form-dialog';
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  Eye,
  X,
  ArrowUpDown,
  MessageCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

interface BookingsTableProps {
  initialBookings: (Booking & { service?: Service | null })[];
  services: Service[];
}

const CATEGORY_MAP: Record<ServiceCategory, string> = {
  'vehicle-rental': 'Sewa Kendaraan',
  tattoo: 'Tato Studio',
  villa: 'Villa & Stay',
  travel: 'Paket Travel',
  'surfing-lesson': 'Surfing Lesson',
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function BookingsTable({ initialBookings, services }: BookingsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'date-asc' | 'price-desc'>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { service?: Service | null }) | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<(Booking & { service?: Service | null }) | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filter & Sort
  const filteredBookings = initialBookings
    .filter((b) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.customer_name.toLowerCase().includes(query) ||
        b.customer_email.toLowerCase().includes(query) ||
        b.customer_phone.includes(query) ||
        (b.service?.title && b.service.title.toLowerCase().includes(query)) ||
        (b.notes && b.notes.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || (b.service && b.service.category === categoryFilter);

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime();
      }
      if (sortBy === 'price-desc') {
        return (Number(b.total_price) || 0) - (Number(a.total_price) || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Count by Status
  const statusCounts = {
    all: initialBookings.length,
    pending: initialBookings.filter((b) => b.status === 'pending').length,
    confirmed: initialBookings.filter((b) => b.status === 'confirmed').length,
    completed: initialBookings.filter((b) => b.status === 'completed').length,
    cancelled: initialBookings.filter((b) => b.status === 'cancelled').length,
  };

  function handleStatusChange(id: string, newStatus: BookingStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      const res = await updateBookingStatusAction(id, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Gagal mengupdate status');
      } else {
        toast.success(`Status booking diubah ke "${newStatus}"`);
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
      setUpdatingId(null);
    });
  }

  function confirmDelete() {
    if (!bookingToDelete) return;
    setIsDeleting(true);
    startTransition(async () => {
      const res = await deleteBookingAction(bookingToDelete.id);
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus booking');
      } else {
        toast.success('Data booking berhasil dihapus');
      }
      setIsDeleting(false);
      setBookingToDelete(null);
      if (selectedBooking?.id === bookingToDelete.id) {
        setSelectedBooking(null);
      }
    });
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  }

  function generateWhatsAppLink(booking: Booking & { service?: Service | null }): string {
    const rawPhone = booking.customer_phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;
    const serviceName = booking.service?.title || 'Layanan Wisata';
    const text = encodeURIComponent(
      `Halo ${booking.customer_name}, kami dari Doamandeh Tours & Travel ingin mengonfirmasi pesanan Anda untuk ${serviceName} pada tanggal ${booking.booking_date}. Mohon konfirmasi ketersediaan Anda. Terima kasih!`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Semua', count: statusCounts.all },
          { key: 'pending', label: 'Pending', count: statusCounts.pending },
          { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
          { key: 'completed', label: 'Completed', count: statusCounts.completed },
          { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[11px] font-mono tabular-nums ${
                statusFilter === tab.key ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="vehicle-rental">Sewa Kendaraan</option>
            <option value="tattoo">Tato Studio</option>
            <option value="villa">Villa &amp; Stay</option>
            <option value="travel">Paket Travel</option>
            <option value="surfing-lesson">Surfing Lesson</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 h-9 rounded border border-border bg-card px-2.5 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="newest">Booking Terbaru</option>
              <option value="oldest">Booking Terlama</option>
              <option value="date-asc">Tgl Terdekat</option>
              <option value="price-desc">Biaya Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-9"
        >
          <Plus className="size-4 mr-1.5" />
          <span>Tambah Booking</span>
        </Button>
      </div>

      {/* Bookings Table Card */}
      <Card className="bg-card border-border shadow-none overflow-hidden">
        <CardContent className="p-0">
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
                  Total Biaya
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                  Status
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                      <Calendar className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">Tidak ada data reservasi</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {search || statusFilter !== 'all' || categoryFilter !== 'all'
                        ? 'Coba sesuaikan kata kunci atau reset filter status.'
                        : 'Belum ada data pemesanan yang tercatat di sistem.'}
                    </p>
                    {search || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset Filter
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Plus className="size-4 mr-1.5" />
                        Tambah Booking Baru
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => {
                  const isUpdatingThis = updatingId === booking.id;
                  const catLabel = booking.service?.category
                    ? CATEGORY_MAP[booking.service.category]
                    : null;

                  return (
                    <TableRow
                      key={booking.id}
                      className="h-11 hover:bg-muted/40 border-b border-border transition-colors"
                    >
                      {/* Customer */}
                      <TableCell>
                        <p className="font-medium text-xs text-foreground truncate max-w-[150px]">
                          {booking.customer_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {booking.customer_phone}
                        </p>
                      </TableCell>

                      {/* Service */}
                      <TableCell>
                        <p className="text-xs text-foreground truncate max-w-[160px]">
                          {booking.service?.title || 'Layanan'}
                        </p>
                        {catLabel && (
                          <span className="text-[11px] text-muted-foreground">
                            {catLabel}
                          </span>
                        )}
                      </TableCell>

                      {/* Booking Date */}
                      <TableCell className="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                        {formatDateIndo(booking.booking_date)}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-mono text-xs font-medium tabular-nums whitespace-nowrap">
                        {booking.total_price ? formatRupiah(booking.total_price) : '-'}
                      </TableCell>

                      {/* Status: Dot + Quick Confirm */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                            <span
                              className={`size-2 rounded-full ${
                                booking.status === 'confirmed'
                                  ? 'bg-success'
                                  : booking.status === 'completed'
                                  ? 'bg-info'
                                  : booking.status === 'pending'
                                  ? 'bg-warning'
                                  : 'bg-danger'
                              }`}
                            />
                            <span
                              className={`capitalize ${
                                booking.status === 'confirmed'
                                  ? 'text-success'
                                  : booking.status === 'completed'
                                  ? 'text-info'
                                  : booking.status === 'pending'
                                  ? 'text-warning'
                                  : 'text-danger'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </span>

                          {/* Quick Confirm Button for Pending */}
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              disabled={isPending || isUpdatingThis}
                              className="h-6 text-[11px] px-2"
                              title="Konfirmasi Booking"
                            >
                              {isUpdatingThis ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                'Confirm'
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <a
                            href={generateWhatsAppLink(booking)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({
                              variant: 'ghost',
                              size: 'sm',
                              className: 'size-7 p-0 text-muted-foreground hover:text-foreground',
                            })}
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="size-3.5" />
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                            className="size-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Lihat Detail"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookingToDelete(booking)}
                            className="size-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Hapus Booking"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manual Booking Dialog */}
      <BookingFormDialog
        services={services}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      {/* Booking Detail Drawer */}
      <Drawer
        open={!!selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
        swipeDirection="right"
      >
        <DrawerContent className="sm:max-w-md [--drawer-content-width:100%] sm:[--drawer-content-width:28rem] bg-card text-foreground font-sans border-l border-border flex flex-col h-screen max-h-screen">
          {selectedBooking && (
            <>
              {/* Header */}
              <DrawerHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
                <div>
                  <DrawerTitle className="text-base font-semibold text-foreground">
                    Detail Pemesanan
                  </DrawerTitle>
                  <DrawerDescription className="text-xs text-muted-foreground font-mono mt-0.5">
                    ID: #{selectedBooking.id.slice(0, 8)}
                  </DrawerDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="size-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </DrawerHeader>

              {/* Content Details */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                {/* Customer Info Card */}
                <div className="p-3 rounded-md border border-border bg-muted/20 space-y-2">
                  <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
                    Informasi Pelanggan
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Nama</span>
                      <span className="font-medium text-foreground">{selectedBooking.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Telepon / WA</span>
                      <span className="font-mono text-foreground">{selectedBooking.customer_phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[11px] text-muted-foreground block">Email</span>
                      <span className="font-mono text-foreground">{selectedBooking.customer_email}</span>
                    </div>
                  </div>
                </div>

                {/* Service & Price */}
                <div className="p-3 rounded-md border border-border bg-muted/20 space-y-2">
                  <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
                    Layanan &amp; Jadwal
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Paket Layanan:</span>
                      <span className="font-medium text-foreground">
                        {selectedBooking.service?.title || 'Layanan Umum'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tanggal Reservasi:</span>
                      <span className="font-mono text-foreground">
                        {formatDateIndo(selectedBooking.booking_date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border">
                      <span className="font-medium text-foreground">Total Tagihan:</span>
                      <span className="font-mono tabular-nums font-semibold text-foreground">
                        {selectedBooking.total_price ? formatRupiah(selectedBooking.total_price) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="p-3 rounded-md border border-border bg-muted/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="size-3.5" />
                      <span className="text-[11px] font-medium uppercase tracking-wide">Catatan Pelanggan</span>
                    </div>
                    <p className="text-foreground pt-1 italic">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Status Selector */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-medium text-foreground block">
                    Ubah Status Pemesanan
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                      <Button
                        key={st}
                        type="button"
                        variant={selectedBooking.status === st ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(selectedBooking.id, st)}
                        disabled={isPending}
                        className="h-8 text-xs capitalize"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <DrawerFooter className="px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm flex flex-row items-center justify-between gap-2.5 shrink-0 mt-0">
                <a
                  href={generateWhatsAppLink(selectedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    size: 'sm',
                    className: 'bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1.5 font-medium',
                  })}
                >
                  <MessageCircle className="size-4" />
                  <span>Hubungi via WA</span>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  Tutup
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-sans">
          <div className="w-full max-w-md rounded-lg border border-border bg-white dark:bg-zinc-950 bg-card p-6 text-foreground shadow-2xl" role="dialog">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">
                  Hapus Reservasi
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Apakah Anda yakin ingin menghapus data booking customer{' '}
                  <span className="font-semibold text-foreground">
                    &ldquo;{bookingToDelete.customer_name}&rdquo;
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setBookingToDelete(null)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={confirmDelete}
              >
                {isDeleting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                <span>{isDeleting ? 'Menghapus...' : 'Hapus Booking'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
