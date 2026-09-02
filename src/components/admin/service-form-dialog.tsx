'use client';

import { useState, useTransition, useRef } from 'react';
import { Service, ServiceCategory } from '@/types/database';
import { createServiceAction, updateServiceAction } from '@/lib/actions/admin/services';
import { uploadServiceImageAction } from '@/lib/actions/admin/storage';
import {
  X,
  Loader2,
  Plus,
  Edit2,
  AlertCircle,
  UploadCloud,
  ImageIcon,
  Trash2,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';

interface ServiceFormDialogProps {
  service?: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'vehicle-rental', label: 'Sewa Kendaraan (Motor & Mobil)' },
  { value: 'tattoo', label: 'Tato Studio' },
  { value: 'villa', label: 'Villa & Stay' },
  { value: 'travel', label: 'Paket Travel' },
  { value: 'surfing-lesson', label: 'Surfing Lesson' },
];

const MAX_IMAGE_SIZE_MB = 5;

export function ServiceFormDialog({
  service,
  isOpen,
  onClose,
  onSuccess,
}: ServiceFormDialogProps) {
  const isEditing = !!service;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<ServiceCategory>(
    service?.category || 'vehicle-rental'
  );
  const [title, setTitle] = useState(service?.title || '');
  const [description, setDescription] = useState(service?.description || '');
  const [price, setPrice] = useState(service?.price?.toString() || '0');
  const [unit, setUnit] = useState(service?.unit || 'per hari');
  const [duration, setDuration] = useState(service?.duration || '');
  const [imageUrl, setImageUrl] = useState(service?.image_url || '');
  const [isActive, setIsActive] = useState(service?.is_active ?? true);

  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  async function handleFileUpload(file: File) {
    setErrorMessage(null);

    // 1. Validation: MIME Type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Format gambar tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau GIF.');
      return;
    }

    // 2. Validation: File Size (5MB)
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Ukuran file melebihi batas ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadServiceImageAction(formData);
      if (res.success && res.data?.publicUrl) {
        setImageUrl(res.data.publicUrl);
      } else {
        setErrorMessage(
          res.error || 'Gagal mengunggah gambar. Anda juga dapat memasukkan URL gambar secara langsung.'
        );
      }
    } catch (err) {
      setErrorMessage('Terjadi kendala saat mengunggah file gambar.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMessage('Harga harus berupa angka valid dan tidak negatif');
      return;
    }

    if (!title.trim() || title.length < 3) {
      setErrorMessage('Judul layanan minimal 3 karakter');
      return;
    }

    if (!unit.trim()) {
      setErrorMessage('Satuan harga wajib diisi (contoh: per hari, per sesi)');
      return;
    }

    startTransition(async () => {
      const payload = {
        category,
        title: title.trim(),
        description: description.trim() || null,
        price: priceNum,
        unit: unit.trim(),
        duration: duration.trim() || null,
        image_url: imageUrl.trim() || null,
        is_active: isActive,
      };

      if (isEditing && service) {
        const res = await updateServiceAction(service.id, payload);

        if (!res.success) {
          setErrorMessage(res.error || 'Gagal memperbarui layanan');
        } else {
          onSuccess?.();
          onClose();
        }
      } else {
        const res = await createServiceAction(payload);

        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menambahkan layanan');
        } else {
          onSuccess?.();
          onClose();
        }
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="relative w-full max-w-xl my-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-2xl shadow-black/90 max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="sticky -top-6 -mx-6 -mt-6 bg-zinc-900 px-6 pt-6 pb-4 border-b border-zinc-800 flex items-center justify-between mb-5 z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isEditing ? 'Edit Layanan Wisata' : 'Tambah Layanan Baru'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isEditing
                  ? 'Perbarui detail informasi, foto, dan tarif layanan'
                  : 'Lengkapi data katalog layanan wisata Doamandeh'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-950/40 border border-red-800/80 p-3.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Kategori Layanan *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Nama / Judul Layanan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Sewa Motor Honda PCX 160"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Price & Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Harga (IDR) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                placeholder="150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Satuan Harga *
              </label>
              <input
                type="text"
                required
                placeholder="per hari, per sesi, per malam"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Durasi Operasional (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: 2 jam, 1 hari, 8 jam tour"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Deskripsi Layanan & Fasilitas
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan spesifikasi, fasilitas include, ketentuan pemakaian, atau keunggulan layanan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Image Upload / URL Section */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
                <span>Foto / Gambar Layanan</span>
              </label>

              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    uploadMode === 'upload'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    uploadMode === 'url'
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Input URL
                </button>
              </div>
            </div>

            {/* Upload Area */}
            {uploadMode === 'upload' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden group">
                    <img
                      src={imageUrl}
                      alt="Preview Layanan"
                      className="w-full h-40 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="p-1.5 rounded-lg bg-red-900/80 text-red-200 hover:bg-red-800 transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${
                      isDragOver
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
                        <span className="text-xs text-zinc-300">
                          Mengunggah gambar ke Supabase Storage...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-xl bg-zinc-800 p-2.5 text-zinc-400 mb-2">
                          <UploadCloud className="h-6 w-6 text-amber-400" />
                        </div>
                        <p className="text-xs font-semibold text-white">
                          Klik untuk memilih atau seret gambar ke sini
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Format JPG, PNG, WEBP, GIF (Maks. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Direct URL Input */
              <div className="space-y-3">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... atau URL gambar publik"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {imageUrl && (
                  <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 p-2 flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="URL Preview"
                      className="w-16 h-12 object-cover rounded-lg shrink-0 border border-zinc-700"
                      onError={() => setErrorMessage('URL gambar tidak dapat dimuat')}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> URL Gambar Aktif
                      </span>
                      <p className="text-[10px] text-zinc-400 truncate">{imageUrl}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="p-1 text-zinc-500 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-zinc-300 cursor-pointer">
              Aktifkan layanan (tampilkan di katalog publik)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending || isUploading}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Layanan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
