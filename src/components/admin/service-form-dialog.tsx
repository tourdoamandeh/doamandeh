'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Service, ServiceCategory } from '@/types/database';
import { createServiceAction, updateServiceAction } from '@/lib/actions/admin/services';
import { uploadServiceImageAction } from '@/lib/actions/admin/storage';
import {
  X,
  Loader2,
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

const PRESET_IMAGES: Record<ServiceCategory, { label: string; url: string }[]> = {
  'vehicle-rental': [
    { label: 'Honda PCX 160', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop' },
    { label: 'Scoopy Matic', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop' },
    { label: 'Mobil SUV / Avanza', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop' },
    { label: 'City Car Matic', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop' },
  ],
  'tattoo': [
    { label: 'Studio Tattoo', url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop' },
    { label: 'Tattoo Artist Session', url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?q=80&w=800&auto=format&fit=crop' },
    { label: 'Minimalist Custom Art', url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop' },
  ],
  'villa': [
    { label: 'Private Pool Villa', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop' },
    { label: 'Tropical Bali Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop' },
    { label: 'Modern Luxury Stay', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop' },
  ],
  'travel': [
    { label: 'Nusa Penida Tour', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop' },
    { label: 'Ubud Rice Terrace', url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800&auto=format&fit=crop' },
    { label: 'Waterfall Adventure', url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=800&auto=format&fit=crop' },
  ],
  'surfing-lesson': [
    { label: 'Surfing Coach & Wave', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop' },
    { label: 'Beginner Surf Session', url: 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?q=80&w=800&auto=format&fit=crop' },
    { label: 'Surfboard Beach', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?q=80&w=800&auto=format&fit=crop' },
  ],
};

const MAX_IMAGE_SIZE_MB = 5;

// Client-side image compression fallback
async function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

  // Form fields
  const [category, setCategory] = useState<ServiceCategory>('vehicle-rental');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [unit, setUnit] = useState('per hari');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Image mode & state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialCat = service?.category || 'vehicle-rental';
      setCategory(initialCat);
      setTitle(service?.title || '');
      setDescription(service?.description || '');
      setPrice(service?.price?.toString() || '0');
      setUnit(service?.unit || 'per hari');
      setDuration(service?.duration || '');
      setImageUrl(service?.image_url || '');
      setPreviewUrl(service?.image_url || null);
      setIsActive(service?.is_active ?? true);
      setErrorMessage(null);
      setIsUploading(false);
      setUploadSuccess(!!service?.image_url);
      setUploadMode('upload');
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

  async function handleFileUpload(file: File) {
    setErrorMessage(null);
    setUploadSuccess(false);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Format gambar tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau GIF.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Ukuran file melebihi batas maksimal ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    const localBlob = URL.createObjectURL(file);
    setPreviewUrl(localBlob);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadServiceImageAction(formData);
      if (res.success && res.data?.publicUrl) {
        setImageUrl(res.data.publicUrl);
        setPreviewUrl(res.data.publicUrl);
        setUploadSuccess(true);
      } else {
        const dataUrl = await compressImageToDataUrl(file);
        setImageUrl(dataUrl);
        setPreviewUrl(dataUrl);
        setUploadSuccess(true);
      }
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(file);
        setImageUrl(dataUrl);
        setPreviewUrl(dataUrl);
        setUploadSuccess(true);
      } catch {
        setErrorMessage('Gagal memproses file gambar. Silakan gunakan opsi URL atau preset gambar.');
      }
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

  function handleRemoveImage() {
    setImageUrl('');
    setPreviewUrl(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleSelectPreset(presetUrl: string) {
    setImageUrl(presetUrl);
    setPreviewUrl(presetUrl);
    setUploadSuccess(true);
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
      const finalImageUrl = imageUrl.trim() || previewUrl || null;
      const payload = {
        category,
        title: title.trim(),
        description: description.trim() || null,
        price: priceNum,
        unit: unit.trim(),
        duration: duration.trim() || null,
        image_url: finalImageUrl,
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

  const activeDisplayImage = previewUrl || imageUrl;
  const currentPresets = PRESET_IMAGES[category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-lg my-6 rounded-lg border border-stone-200 bg-white p-5 sm:p-6 text-stone-900 shadow-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900">
              {isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h2>
            <p className="text-[11px] text-stone-500">
              {isEditing ? 'Perbarui informasi dan harga katalog.' : 'Lengkapi data katalog layanan wisata.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Kategori Layanan *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
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
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nama / Judul Layanan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Sewa Motor Honda PCX 160"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
            />
          </div>

          {/* Price & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
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
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 font-mono focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Satuan Harga *
              </label>
              <input
                type="text"
                required
                placeholder="per hari, per sesi"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Durasi Operasional (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: 2 jam, 1 hari, 8 jam tour"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Deskripsi & Fasilitas
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan spesifikasi, fasilitas include, ketentuan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none resize-none"
            />
          </div>

          {/* Photo Section */}
          <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                Foto Layanan
              </label>

              <div className="flex items-center gap-1 bg-stone-200/70 rounded p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    uploadMode === 'upload' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('preset')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    uploadMode === 'preset' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Galeri Foto
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    uploadMode === 'url' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Input URL
                </button>
              </div>
            </div>

            {/* Active Preview */}
            {activeDisplayImage ? (
              <div className="space-y-2">
                <div className="relative rounded-lg border border-stone-200 bg-white overflow-hidden">
                  <img
                    src={activeDisplayImage}
                    alt="Preview"
                    className="h-32 w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-2 py-1 rounded bg-white/95 border border-stone-200 text-[11px] font-medium text-stone-800 shadow-xs hover:bg-white"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 rounded bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Mode: Upload */}
            {uploadMode === 'upload' && !activeDisplayImage && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`cursor-pointer flex flex-col items-center justify-center p-4 border border-dashed rounded-lg bg-white transition-colors ${
                    isDragOver ? 'border-teal-700 bg-teal-50/20' : 'border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-stone-600">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                      <span>Memproses gambar...</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-5 w-5 text-stone-400 mb-1" />
                      <p className="text-xs font-medium text-stone-800">
                        Klik untuk upload atau seret file ke sini
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, WEBP (Maks. 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mode: Preset */}
            {uploadMode === 'preset' && (
              <div className="grid grid-cols-4 gap-2">
                {currentPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="group rounded border border-stone-200 bg-white overflow-hidden text-left hover:border-teal-700 transition-colors"
                  >
                    <img src={preset.url} alt={preset.label} className="h-14 w-full object-cover" />
                    <p className="p-1 text-[9px] font-medium text-stone-700 truncate">{preset.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Mode: URL */}
            {uploadMode === 'url' && (
              <div className="relative">
                <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full rounded-lg border border-stone-200 bg-white pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-stone-300 text-teal-700 focus:ring-teal-700"
            />
            <label htmlFor="is_active" className="text-xs text-stone-700 cursor-pointer">
              Aktifkan layanan (tampilkan di website public)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending || isUploading}
              className="rounded-lg border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#115E59] transition-colors disabled:opacity-50"
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
