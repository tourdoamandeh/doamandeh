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
import { getServiceImageUrl, getServiceFallbackImage } from '@/lib/constants';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface ServicesTableProps {
  initialServices: Service[];
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Live Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 h-9 rounded border border-border bg-card px-2.5 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="title">Nama (A-Z)</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={handleOpenCreate}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-9"
        >
          <Plus className="size-4 mr-1.5" />
          <span>Tambah Layanan</span>
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-card border-border shadow-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                  Foto &amp; Layanan
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                  Kategori
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground h-11">
                  Harga / Satuan
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
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                      <Package className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">Tidak ada data layanan</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {search || categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'Coba sesuaikan kata kunci pencarian atau reset filter aktif.'
                        : 'Mulai dengan menambahkan layanan baru ke dalam sistem.'}
                    </p>
                    {search || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset Filter
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleOpenCreate}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Plus className="size-4 mr-1.5" />
                        Tambah Layanan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => {
                  const isTogglingThis = togglingId === service.id;
                  const catLabel = CATEGORY_MAP[service.category] || service.category;

                  return (
                    <TableRow
                      key={service.id}
                      className="h-11 hover:bg-muted/40 border-b border-border transition-colors"
                    >
                      {/* Photo + Title */}
                      <TableCell className="max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative size-8 shrink-0">
                            <img
                              src={getServiceImageUrl(service)}
                              alt={service.title}
                              className="size-8 rounded object-cover border border-border shrink-0 bg-muted"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getServiceFallbackImage(service.category);
                              }}
                            />
                            {!service.image_url && (
                              <span
                                title="Menggunakan foto bawaan (fallback assets)"
                                className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-secondary border border-border text-[8px] font-bold text-muted-foreground shadow-xs"
                              >
                                A
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs text-foreground truncate">
                              {service.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {service.description || 'Tanpa deskripsi'}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="whitespace-nowrap">
                        <span className="text-xs text-muted-foreground">
                          {catLabel}
                        </span>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="whitespace-nowrap">
                        <span className="font-mono tabular-nums text-xs font-medium text-foreground">
                          {formatRupiah(service.price)}
                        </span>
                        <span className="text-[11px] text-muted-foreground ml-1">
                          /{service.unit}
                        </span>
                      </TableCell>

                      {/* Status Dot */}
                      <TableCell className="whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isTogglingThis}
                          onClick={() => handleToggleStatus(service.id, service.is_active)}
                          title="Klik untuk toggle status aktif"
                          className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                          <span
                            className={`size-2 rounded-full ${
                              service.is_active ? 'bg-success' : 'bg-muted-foreground'
                            }`}
                          />
                          <span
                            className={
                              service.is_active ? 'text-success' : 'text-muted-foreground'
                            }
                          >
                            {isTogglingThis ? 'Memproses...' : service.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(service)}
                            title="Edit Layanan"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setServiceToDelete(service)}
                            title="Hapus Layanan"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
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

      {/* Service Form Dialog */}
      <ServiceFormDialog
        service={editingService}
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingService(null);
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-sans">
          <div
            className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-foreground shadow-2xl"
            role="dialog"
          >
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">
                  Hapus Layanan
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Apakah Anda yakin ingin menghapus layanan{' '}
                  <span className="font-semibold text-foreground">
                    &ldquo;{serviceToDelete.title}&rdquo;
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setServiceToDelete(null)}
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
                <span>{isDeleting ? 'Menghapus...' : 'Hapus Layanan'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
