'use client';

import { useState, useTransition } from 'react';
import { Service, ServiceCategory } from '@/types/database';
import {
  toggleServiceActiveAction,
  deleteServiceAction,
} from '@/lib/actions/admin/services';
import { ServiceFormDialog } from './service-form-dialog';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Car,
  Palette,
  Home,
  Compass,
  Waves,
} from 'lucide-react';

interface ServicesTableProps {
  initialServices: Service[];
}

const CATEGORY_MAP: Record<ServiceCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  'vehicle-rental': { label: 'Sewa Kendaraan', icon: Car },
  'tattoo': { label: 'Tato Studio', icon: Palette },
  'villa': { label: 'Villa & Stay', icon: Home },
  'travel': { label: 'Paket Travel', icon: Compass },
  'surfing-lesson': { label: 'Surfing Lesson', icon: Waves },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredServices = initialServices.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.is_active) ||
      (statusFilter === 'inactive' && !s.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function handleOpenCreate() {
    setEditingService(null);
    setDialogOpen(true);
  }

  function handleOpenEdit(service: Service) {
    setEditingService(service);
    setDialogOpen(true);
  }

  function handleToggleStatus(id: string, currentStatus: boolean) {
    startTransition(async () => {
      await toggleServiceActiveAction(id, currentStatus);
    });
  }

  function handleDelete(id: string, title: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) {
      setDeletingId(id);
      startTransition(async () => {
        await deleteServiceAction(id);
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
              placeholder="Cari nama atau deskripsi layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="vehicle-rental">Sewa Kendaraan</option>
            <option value="tattoo">Tato</option>
            <option value="villa">Villa</option>
            <option value="travel">Travel</option>
            <option value="surfing-lesson">Surfing Lesson</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Hanya Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        {/* Add Service Button */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga / Satuan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    Tidak ada layanan yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const cat = CATEGORY_MAP[service.category] || {
                    label: service.category,
                    icon: Compass,
                  };
                  const CatIcon = cat.icon;
                  const isBeingDeleted = deletingId === service.id;

                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Title & Description */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {service.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          {service.description || '-'}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                          <CatIcon className="h-3 w-3 text-amber-400" />
                          {cat.label}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-white">
                          {formatRupiah(service.price)}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {service.unit ? `/${service.unit.replace(/^per\s+/i, '')}` : '-'}
                          {service.duration ? ` • ${service.duration}` : ''}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.is_active)}
                          disabled={isPending}
                          title="Klik untuk ubah status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            service.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          {service.is_active ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Nonaktif
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                            title="Edit Layanan"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id, service.title)}
                            disabled={isPending || isBeingDeleted}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Hapus Layanan"
                          >
                            {isBeingDeleted ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Modal Dialog */}
      <ServiceFormDialog
        isOpen={dialogOpen}
        service={editingService}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
