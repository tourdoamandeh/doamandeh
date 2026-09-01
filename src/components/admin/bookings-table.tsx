'use client';

import { useState, useTransition } from 'react';
import { Booking, BookingStatus, Service } from '@/types/database';
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
  Phone,
  Mail,
  User,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  XCircle,
} from 'lucide-react';

interface BookingsTableProps {
  initialBookings: (Booking & { service?: Service | null })[];
  services: Service[];
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    icon: XCircle,
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BookingsTable({ initialBookings, services }: BookingsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredBookings = initialBookings.filter((b) => {
    const matchesSearch =
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_phone.includes(search) ||
      (b.service?.title && b.service.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleStatusChange(id: string, newStatus: BookingStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      await updateBookingStatusAction(id, newStatus);
      setUpdatingId(null);
    });
  }

  function handleDelete(id: string, customerName: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus booking dari "${customerName}"?`)) {
      setDeletingId(id);
      startTransition(async () => {
        await deleteBookingAction(id);
        setDeletingId(null);
      });
    }
  }

  return (
    <div>
      {/* Action Bar / Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari customer, email, telp, atau layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Add Booking Button */}
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Booking Manual</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Tgl Booking</th>
                <th className="px-6 py-4">Total Biaya</th>
                <th className="px-6 py-4">Status & Update</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    Belum ada data booking yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusInfo.icon;
                  const isUpdatingThis = updatingId === booking.id;
                  const isDeletingThis = deletingId === booking.id;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <User className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{booking.customer_name}</span>
                        </div>
                        <div className="mt-1 space-y-0.5 text-[11px] text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-zinc-500" />
                            <a
                              href={`mailto:${booking.customer_email}`}
                              className="hover:underline hover:text-zinc-200"
                            >
                              {booking.customer_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-zinc-500" />
                            <a
                              href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`}
                              target="_blank"
                              className="text-amber-400/80 hover:underline"
                            >
                              {booking.customer_phone}
                            </a>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="mt-2 text-[10px] bg-zinc-800/60 border border-zinc-700/40 rounded-md p-1.5 text-zinc-300 flex items-start gap-1">
                            <FileText className="h-3 w-3 shrink-0 text-zinc-500 mt-0.5" />
                            <span className="line-clamp-2">{booking.notes}</span>
                          </div>
                        )}
                      </td>

                      {/* Service */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-white">
                          {booking.service?.title || 'Layanan Umum'}
                        </p>
                        <p className="text-[11px] text-amber-400/80 capitalize">
                          {booking.service?.category || '-'}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-white">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{booking.booking_date}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Dibuat: {new Date(booking.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </td>

                      {/* Total Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-white">
                          {booking.total_price ? formatRupiah(booking.total_price) : '-'}
                        </span>
                      </td>

                      {/* Status & Update Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>

                          <select
                            value={booking.status}
                            disabled={isPending || isUpdatingThis}
                            onChange={(e) =>
                              handleStatusChange(booking.id, e.target.value as BookingStatus)
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-200 focus:border-amber-500 focus:outline-none disabled:opacity-50"
                          >
                            <option value="pending">Set Pending</option>
                            <option value="confirmed">Set Confirmed</option>
                            <option value="completed">Set Completed</option>
                            <option value="cancelled">Set Cancelled</option>
                          </select>

                          {isUpdatingThis && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(booking.id, booking.customer_name)}
                          disabled={isPending || isDeletingThis}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Hapus Booking"
                        >
                          {isDeletingThis ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Booking Dialog */}
      <BookingFormDialog
        services={services}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
