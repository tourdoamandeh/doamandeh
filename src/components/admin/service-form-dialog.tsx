'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Service, ServiceCategory } from '@/types/database';
import { createServiceAction, updateServiceAction } from '@/lib/actions/admin/services';
import { uploadServiceImageAction } from '@/lib/actions/admin/storage';
import { toast } from 'sonner';
import {
  X,
  Loader2,
  AlertCircle,
  UploadCloud,
  Trash2,
  Link as LinkIcon,
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
      setUploadMode('upload');
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

  async function handleFileUpload(file: File) {
    setErrorMessage(null);

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
      } else {
        const dataUrl = await compressImageToDataUrl(file);
        setImageUrl(dataUrl);
        setPreviewUrl(dataUrl);
      }
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(file);
        setImageUrl(dataUrl);
        setPreviewUrl(dataUrl);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleSelectPreset(presetUrl: string) {
    setImageUrl(presetUrl);
    setPreviewUrl(presetUrl);
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
          toast.error(res.error || 'Gagal memperbarui layanan');
        } else {
          toast.success(`Layanan "${payload.title}" berhasil diperbarui`);
          onSuccess?.();
          onClose();
        }
      } else {
        const res = await createServiceAction(payload);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menambahkan layanan');
          toast.error(res.error || 'Gagal menambahkan layanan');
        } else {
          toast.success(`Layanan baru "${payload.title}" berhasil ditambahkan`);
          onSuccess?.();
          onClose();
        }
      }
    });
  }

  const activeDisplayImage = previewUrl || imageUrl;
  const currentPresets = PRESET_IMAGES[category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none overflow-y-auto font-sans">
      <div
        className="relative w-full max-w-lg my-6 rounded-none border-2 border-brown bg-softwhite p-6 text-black shadow-none max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-brown mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
              // KATALOG CMS
            </p>
            <h2 className="text-base font-bold uppercase tracking-wider text-brown mt-0.5">
              {isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-none border border-brown text-brown hover:bg-brown hover:text-softyellow transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2.5 rounded-none bg-softyellow border-2 border-brown p-3 text-xs text-brown">
            <AlertCircle className="h-4 w-4 text-brown shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Kategori Layanan *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none cursor-pointer"
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
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Nama / Judul Layanan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Sewa Motor Honda PCX 160"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          {/* Price & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
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
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs font-bold text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Satuan Harga *
              </label>
              <input
                type="text"
                required
                placeholder="per hari, per sesi"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Durasi Operasional (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: 2 jam, 1 hari, 8 jam tour"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Deskripsi &amp; Fasilitas
            </label>
            <textarea
              rows={2}
              placeholder="Jelaskan spesifikasi, fasilitas include, ketentuan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Photo Section */}
          <div className="rounded-none border-2 border-brown bg-softyellow/30 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-brown/20">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brown">
                Bingkai Foto Layanan (Border 2px)
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none border transition-colors cursor-pointer ${
                    uploadMode === 'upload' ? 'bg-brown text-softyellow border-brown' : 'bg-softwhite text-brown border-brown hover:bg-softyellow'
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('preset')}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none border transition-colors cursor-pointer ${
                    uploadMode === 'preset' ? 'bg-brown text-softyellow border-brown' : 'bg-softwhite text-brown border-brown hover:bg-softyellow'
                  }`}
                >
                  Preset
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none border transition-colors cursor-pointer ${
                    uploadMode === 'url' ? 'bg-brown text-softyellow border-brown' : 'bg-softwhite text-brown border-brown hover:bg-softyellow'
                  }`}
                >
                  URL
                </button>
              </div>
            </div>

            {/* Active Preview */}
            {activeDisplayImage ? (
              <div className="relative rounded-none border-2 border-brown bg-softwhite overflow-hidden">
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
                    className="px-2.5 py-1 rounded-none bg-softwhite border border-brown text-[10px] font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-none bg-black text-softyellow hover:bg-brown cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
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
                  className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-none transition-colors ${
                    isDragOver ? 'border-black bg-softyellow' : 'border-brown bg-softwhite hover:bg-softyellow/50'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-brown">
                      <Loader2 className="h-4 w-4 animate-spin text-brown" />
                      <span>Memproses Gambar...</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-6 w-6 text-brown mb-1.5" />
                      <p className="text-xs font-bold uppercase tracking-wider text-brown">
                        Upload Gambar Layanan
                      </p>
                      <p className="text-[10px] text-brown/60 mt-0.5">JPG, PNG, WEBP (Maksimal 5MB)</p>
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
                    className="group rounded-none border-2 border-brown bg-softwhite overflow-hidden text-left hover:border-black transition-colors cursor-pointer"
                  >
                    <img src={preset.url} alt={preset.label} className="h-14 w-full object-cover" />
                    <p className="p-1 text-[9px] font-bold text-brown truncate">{preset.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Mode: URL */}
            {uploadMode === 'url' && (
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brown/60" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full rounded-none border-2 border-brown bg-softwhite pl-9 pr-3 py-2 text-xs text-black focus:border-black focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded-none border-2 border-brown text-brown focus:ring-0 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-black cursor-pointer">
              Aktifkan katalog ini (tampilkan di website publik)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t-2 border-brown mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending || isUploading}
              className="rounded-none border-2 border-brown bg-softwhite px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="inline-flex items-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown hover:border-black px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-none"
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
