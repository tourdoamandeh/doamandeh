'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Service, ServiceCategory } from '@/types/database';
import { createServiceAction, updateServiceAction } from '@/lib/actions/admin/services';
import { uploadServiceImageAction, deleteServiceImageAction } from '@/lib/actions/admin/storage';
import { toast } from 'sonner';
import {
  X,
  Loader2,
  AlertCircle,
  UploadCloud,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  SERVICE_PRESET_IMAGES,
  getServiceFallbackImage,
} from '@/lib/constants';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

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

async function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
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
    reader.readAsDataURL(file);
  });
}

export function ServiceFormDialog({
  service,
  isOpen,
  onClose,
  onSuccess,
}: ServiceFormDialogProps) {
  const isEditing = Boolean(service);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [category, setCategory] = useState<ServiceCategory>('vehicle-rental');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('per hari');
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Image State
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (service) {
        setCategory(service.category);
        setTitle(service.title);
        setDescription(service.description || '');
        setPrice(service.price.toString());
        setUnit(service.unit || 'per hari');
        setDuration(service.duration || '');
        setIsActive(service.is_active);
        setImageUrl(service.image_url || '');
        setPreviewUrl(service.image_url || '');
        setSelectedFile(null);
      } else {
        setCategory('vehicle-rental');
        setTitle('');
        setDescription('');
        setPrice('');
        setUnit('per hari');
        setDuration('');
        setIsActive(true);
        setImageUrl('');
        setPreviewUrl('');
        setSelectedFile(null);
      }
      setErrorMessage(null);
    }
  }, [service, isOpen]);

  async function processSelectedFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format file tidak didukung. Harap pilih gambar JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Ukuran gambar terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      setPreviewUrl(compressedDataUrl);
    } catch {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  }

  function handleSelectPreset(url: string) {
    setImageUrl(url);
    setPreviewUrl(url);
    setSelectedFile(null);
  }

  async function handleRemoveImage() {
    const currentUrl = imageUrl || previewUrl;
    setSelectedFile(null);
    setPreviewUrl('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (
      currentUrl &&
      (currentUrl.includes('supabase.co/storage') ||
        currentUrl.startsWith('services/') ||
        currentUrl.startsWith('images/'))
    ) {
      setIsDeletingImage(true);
      try {
        const res = await deleteServiceImageAction(currentUrl);
        if (res.success) {
          toast.success('Foto layanan berhasil dihapus dari storage.');
          if (service?.id) {
            await updateServiceAction(service.id, {
              category: service.category,
              title: service.title,
              description: service.description || undefined,
              price: service.price,
              unit: service.unit || 'per hari',
              duration: service.duration || undefined,
              image_url: undefined,
              is_active: service.is_active,
            });
            onSuccess?.();
          }
        } else if (res.error) {
          toast.error(res.error);
        }
      } catch {
        toast.error('Gagal menghapus gambar dari storage.');
      } finally {
        setIsDeletingImage(false);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMessage('Harga layanan tidak valid.');
      return;
    }

    startTransition(async () => {
      let finalImageUrl = imageUrl.trim() || undefined;

      if (selectedFile) {
        setIsUploading(true);
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', selectedFile);
          uploadFormData.append('category', category);

          const uploadRes = await uploadServiceImageAction(uploadFormData);
          if (uploadRes.success && uploadRes.data?.publicUrl) {
            finalImageUrl = uploadRes.data.publicUrl;
          } else {
            const errorMsg = uploadRes.error || 'Gagal mengupload gambar ke Supabase Storage.';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
            setIsUploading(false);
            return;
          }
        } catch (uploadErr) {
          const errorMsg =
            uploadErr instanceof Error
              ? uploadErr.message
              : 'Terjadi kesalahan saat mengunggah gambar ke storage.';
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (isEditing && service) {
        // If image was replaced or deleted, clean up old storage file
        if (service.image_url && service.image_url !== finalImageUrl) {
          if (
            service.image_url.includes('supabase.co/storage') ||
            service.image_url.startsWith('services/') ||
            service.image_url.startsWith('images/')
          ) {
            deleteServiceImageAction(service.image_url).catch(() => {});
          }
        }

        const res = await updateServiceAction(service.id, {
          category,
          title: title.trim(),
          description: description.trim() || undefined,
          price: priceNum,
          unit: unit.trim(),
          duration: duration.trim() || undefined,
          image_url: finalImageUrl,
          is_active: isActive,
        });

        if (!res.success) {
          setErrorMessage(res.error || 'Gagal memperbarui layanan.');
          toast.error(res.error || 'Gagal memperbarui layanan.');
        } else {
          toast.success(`Layanan "${title}" berhasil diperbarui!`);
          onSuccess?.();
          onClose();
        }
      } else {
        const res = await createServiceAction({
          category,
          title: title.trim(),
          description: description.trim() || undefined,
          price: priceNum,
          unit: unit.trim(),
          duration: duration.trim() || undefined,
          image_url: finalImageUrl,
          is_active: isActive,
        });

        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menambahkan layanan baru.');
          toast.error(res.error || 'Gagal menambahkan layanan baru.');
        } else {
          toast.success(`Layanan "${title}" berhasil ditambahkan!`);
          onSuccess?.();
          onClose();
        }
      }
    });
  }

  const activeDisplayImage = previewUrl || imageUrl;
  const currentPresets = SERVICE_PRESET_IMAGES[category] || [];

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      swipeDirection="right"
    >
      <DrawerContent className="sm:max-w-2xl [--drawer-content-width:100%] sm:[--drawer-content-width:38rem] bg-card text-foreground font-sans border-l border-border flex flex-col h-screen max-h-screen">
        {/* Header */}
        <DrawerHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
          <div>
            <DrawerTitle className="text-base font-semibold text-foreground">
              {isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
              Isi informasi katalog layanan operasional Do&apos;amandeh.
            </DrawerDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </DrawerHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5 text-xs">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs font-medium">
              Kategori Layanan <span className="text-destructive">*</span>
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full h-9 rounded border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-medium">
              Nama Layanan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Contoh: Honda PCX 160cc Matic, Private Villa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          {/* Price & Unit Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-medium">
                Harga (IDR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                placeholder="150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="unit" className="text-xs font-medium">
                Satuan Harga <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unit"
                type="text"
                placeholder="per hari, per sesi, per malam"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <Label htmlFor="duration" className="text-xs font-medium">
              Durasi Operasional (Opsional)
            </Label>
            <Input
              id="duration"
              type="text"
              placeholder="Contoh: 2 jam, 1 hari, 8 jam tour"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">
              Deskripsi &amp; Fasilitas
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Jelaskan spesifikasi, fasilitas include, ketentuan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[96px]"
            />
          </div>

          {/* Photo Section */}
          <div className="rounded border border-border bg-muted/20 p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-medium text-foreground">
                Foto Layanan
              </span>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant={uploadMode === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMode('upload')}
                  className="h-7 text-[11px] px-2.5"
                >
                  Upload
                </Button>
                <Button
                  type="button"
                  variant={uploadMode === 'preset' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMode('preset')}
                  className="h-7 text-[11px] px-2.5"
                >
                  Preset Assets
                </Button>
                <Button
                  type="button"
                  variant={uploadMode === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMode('url')}
                  className="h-7 text-[11px] px-2.5"
                >
                  URL
                </Button>
              </div>
            </div>

            {/* Hidden file input ALWAYS present in the DOM so fileInputRef.current is never null */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Fallback Banner if no custom image is selected */}
            {!activeDisplayImage && (
              <div className="flex items-center gap-3 p-2.5 rounded border border-dashed border-border bg-background">
                <img
                  src={getServiceFallbackImage(category)}
                  alt="Aset fallback bawaan"
                  className="size-12 rounded object-cover border border-border shrink-0 bg-muted"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-foreground">
                      Foto Bawaan Aktif (Fallback)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border font-medium">
                      public/assets
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    Jika tidak ada foto khusus yang diunggah, sistem otomatis menampilkan aset{' '}
                    <code className="text-foreground font-semibold">{getServiceFallbackImage(category)}</code> di website klien dan admin.
                  </p>
                </div>
              </div>
            )}

            {/* Active Preview */}
            {activeDisplayImage ? (
              <div className="relative rounded border border-border bg-background overflow-hidden">
                <img
                  src={activeDisplayImage}
                  alt="Preview"
                  className="h-36 w-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setUploadMode('upload');
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploading || isDeletingImage}
                    className="h-7 text-xs bg-white text-stone-900 hover:bg-stone-100 shadow-md border border-stone-200 cursor-pointer"
                  >
                    Ganti
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isDeletingImage || isUploading}
                    className="h-7 w-7 p-0 bg-red-600 hover:bg-red-700 text-white rounded shadow-md border-0 cursor-pointer flex items-center justify-center"
                    title="Hapus Foto"
                  >
                    {isDeletingImage ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Mode: Upload */}
            {uploadMode === 'upload' && !activeDisplayImage && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`cursor-pointer flex flex-col items-center justify-center p-6 border border-dashed rounded transition-colors ${
                    isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2 py-2 text-xs font-medium text-foreground">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span>Memproses Gambar...</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="size-6 text-muted-foreground mb-1.5" />
                      <p className="text-xs font-medium text-foreground">
                        Upload Gambar Khusus Layanan
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG, WEBP (Maksimal 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mode: Preset */}
            {uploadMode === 'preset' && (
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  Pilih dari koleksi aset resmi <code className="text-foreground">public/assets</code> untuk kategori ini:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentPresets.map((preset) => {
                    const isSelected = activeDisplayImage === preset.url;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`group rounded border text-left overflow-hidden transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 bg-muted'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <div className="h-16 w-full bg-muted overflow-hidden flex items-center justify-center">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="p-1.5 text-[10px] font-medium text-foreground truncate">
                          {preset.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode: URL */}
            {uploadMode === 'url' && (
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="/assets/service-vehicle.jpg atau URL eksternal..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Gunakan path lokal (misal: <code className="text-foreground">/assets/service-vehicle.jpg</code>) atau URL HTTPS gambar online.
                </p>
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
              className="size-4 rounded border-border text-primary focus:ring-ring cursor-pointer"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-foreground cursor-pointer">
              Aktifkan layanan ini (tampilkan di website publik)
            </label>
          </div>

          </div>

          {/* Actions */}
          <DrawerFooter className="px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm flex flex-row items-center justify-end gap-2.5 shrink-0 mt-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending || isUploading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || isUploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
              <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Layanan'}</span>
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
