'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Service, ServiceCategory } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
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
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  X,
  ImageIcon,
  Package,
} from 'lucide-react';

interface ServicesTableProps {
  initialServices: Service[];
}

const CATEGORY_MAP: Record<ServiceCategory, string> = {
  'vehicle-rental': 'Sewa Kendaraan',
  'tattoo': 'Tato Studio',
  'villa': 'Villa & Stay',
  'travel': 'Paket Travel',
  'surfing-lesson': 'Surfing Lesson',
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'price-asc' | 'price-desc'>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Delete Confirmation Modal
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Filter & Sort
  const filteredServices = services
    .filter((s) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query)) ||
        (s.unit && s.unit.toLowerCase().includes(query)) ||
        (s.duration && s.duration.toLowerCase().includes(query));

      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && s.is_active) ||
        (statusFilter === 'inactive' && !s.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  function handleOpenCreate() {
    setEditingService(null);
    setDialogOpen(true);
  }

  function handleOpenEdit(service: Service) {
    setEditingService(service);
    setDialogOpen(true);
  }

  async function handleFormSuccess() {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setServices(data as Service[]);
      }
    } catch {
      // fallback
    }
    router.refresh();
  }

  function handleToggleStatus(id: string, currentStatus: boolean) {
    setTogglingId(id);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
    );

    startTransition(async () => {
      const res = await toggleServiceActiveAction(id, currentStatus);
      if (!res.success) {
        setServices(initialServices);
        toast.error(res.error || 'Gagal mengubah status layanan');
      } else {
        toast.success(`Status layanan diubah menjadi ${!currentStatus ? 'Aktif' : 'Nonaktif'}`);
      }
      setTogglingId(null);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    const targetId = serviceToDelete.id;
    const targetTitle = serviceToDelete.title;

    setServices((prev) => prev.filter((s) => s.id !== targetId));

    startTransition(async () => {
      const res = await deleteServiceAction(targetId);
      if (!res.success) {
        setServices(initialServices);
        toast.error(res.error || 'Gagal menghapus layanan');
      } else {
        toast.success(`Layanan "${targetTitle}" berhasil dihapus`);
      }
      setIsDeleting(false);
      setServiceToDelete(null);
      router.refresh();
    });
  }

  function resetFilters() {
    setSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Editorial Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Live Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/60" />
            <input
              type="text"
              placeholder="Cari nama paket, deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softwhite pl-9 pr-8 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-brown/60 hover:text-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-none border-2 border-brown bg-softwhite px-3 py-2 text-xs font-medium uppercase text-brown focus:border-black focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="vehicle-rental">Sewa Kendaraan</option>
            <option value="tattoo">Tato Studio</option>
            <option value="villa">Villa & Stay</option>
            <option value="travel">Paket Travel</option>
            <option value="surfing-lesson">Surfing Lesson</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-none border-2 border-brown bg-softwhite px-3 py-2 text-xs font-medium uppercase text-brown focus:border-black focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 rounded-none border-2 border-brown bg-softwhite px-2.5 py-1.5 text-xs text-brown">
            <ArrowUpDown className="h-3.5 w-3.5 text-brown/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs font-medium uppercase text-brown focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="title">Nama (A-Z)</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown hover:border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-none"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Editorial Table */}
      <div className="rounded-none border-2 border-brown bg-softwhite overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black">
            <thead className="bg-brown text-softyellow text-[10px] font-bold uppercase tracking-wider border-b-2 border-brown">
              <tr>
                <th className="px-4 py-3">Foto & Layanan</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga / Satuan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/20">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <Package className="h-8 w-8 text-brown/40 mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-brown mb-1">
                      Tidak ada data layanan ditemukan.
                    </p>
                    <p className="text-[11px] text-brown/70 mb-4 font-light">
                      {search || categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'Coba ubah kata kunci pencarian atau reset filter aktif.'
                        : 'Belum ada katalog layanan yang terdaftar di sistem.'}
                    </p>
                    {search || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                      <button
                        onClick={resetFilters}
                        className="rounded-none border-2 border-brown bg-softwhite px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Layanan Sekarang</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const isTogglingThis = togglingId === service.id;
                  const catLabel = CATEGORY_MAP[service.category] || service.category;

                  return (
                    <tr
                      key={service.id}
                      className="h-14 hover:bg-brown/5 transition-colors"
                    >
                      {/* Photo + Title */}
                      <td className="px-4 py-2.5 max-w-sm">
                        <div className="flex items-center gap-3">
                          {service.image_url ? (
                            <img
                              src={service.image_url}
                              alt={service.title}
                              className="h-10 w-14 rounded-none border-2 border-brown object-cover bg-softwhite shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(service)}
                              title="Tambah foto layanan"
                              className="flex h-10 w-14 flex-col items-center justify-center rounded-none border-2 border-dashed border-brown bg-softyellow/50 text-brown hover:bg-softyellow transition-colors shrink-0 cursor-pointer"
                            >
                              <ImageIcon className="h-4 w-4 text-brown" />
                            </button>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-black uppercase tracking-tight truncate">
                              {service.title}
                            </p>
                            <p className="text-[11px] text-brown/80 line-clamp-1 font-light">
                              {service.description || 'Tanpa deskripsi'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider bg-softyellow border border-brown text-brown">
                          {catLabel}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="font-bold text-xs text-black">
                          {formatRupiah(service.price)}
                        </span>
                        <span className="text-[11px] text-brown/70 ml-1">
                          {service.unit ? `/${service.unit.replace(/^per\s+/i, '')}` : ''}
                        </span>
                      </td>

                      {/* Status: Dot + Text */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.is_active)}
                          disabled={isPending || isTogglingThis}
                          title="Klik untuk mengubah status aktif"
                          className="cursor-pointer"
                        >
                          {isTogglingThis ? (
                            <Loader2 className="h-4 w-4 animate-spin text-brown" />
                          ) : service.is_active ? (
                            <span className="inline-block px-2.5 py-1 rounded-none border border-softblue bg-softblue text-[10px] font-bold uppercase tracking-wider text-softyellow">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-none border border-brown bg-softwhite text-[10px] font-bold uppercase tracking-wider text-brown/70">
                              Nonaktif
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="p-1.5 rounded-none border border-brown text-brown hover:bg-brown hover:text-softyellow transition-colors cursor-pointer"
                            title="Edit Layanan"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(service)}
                            className="p-1.5 rounded-none border border-black text-black hover:bg-black hover:text-softyellow transition-colors cursor-pointer"
                            title="Hapus Layanan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* Service Form Modal (Create / Edit) */}
      <ServiceFormDialog
        isOpen={dialogOpen}
        service={editingService}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="w-full max-w-sm rounded-none border-2 border-brown bg-softwhite p-6 text-black shadow-none">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b-2 border-brown/30">
              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-brown text-softyellow border border-brown">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brown">Hapus Layanan</h3>
                <p className="text-[10px] text-brown/70">Tindakan ini permanen.</p>
              </div>
            </div>

            <p className="text-xs text-black mb-5 leading-relaxed">
              Yakin ingin menghapus katalog <strong className="text-brown">{serviceToDelete.title}</strong>? Data akan dihapus permanen dari Supabase.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                disabled={isDeleting}
                className="rounded-none border-2 border-brown bg-softwhite px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-none bg-black text-softyellow border-2 border-black hover:bg-brown hover:border-brown px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isDeleting ? 'Menghapus...' : 'Hapus Layanan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
