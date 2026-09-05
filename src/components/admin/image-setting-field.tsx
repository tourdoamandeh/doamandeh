'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Check, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { uploadServiceImageAction } from '@/lib/actions/admin/storage';
import { SITE_IMAGE_PRESETS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ImageSettingFieldProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  fallbackUrl: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  onChange: (newValue: string) => void;
  presets?: { label: string; url: string }[];
}

export function ImageSettingField({
  id,
  label,
  description,
  value,
  fallbackUrl,
  aspectRatio = 'video',
  onChange,
  presets = SITE_IMAGE_PRESETS,
}: ImageSettingFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDisplayUrl = value && value.trim() !== '' ? value : fallbackUrl;
  const isCustom = Boolean(value && value.trim() !== '');

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-[16/9]';

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal adalah 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await uploadServiceImageAction(formData);
      if (res.success && res.data?.publicUrl) {
        onChange(res.data.publicUrl);
        toast.success('Gambar berhasil diunggah!');
      } else {
        toast.error(res.error || 'Gagal mengunggah gambar.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleResetToDefault() {
    onChange('');
    toast.info('Foto dikembalikan ke aset default bawaan.');
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <Label htmlFor={id} className="text-xs font-semibold text-foreground">
            {label}
          </Label>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {isCustom ? (
            <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <Check className="size-3" /> Custom
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Aset Bawaan
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Thumbnail Preview with Aspect Ratio */}
        <div className="md:col-span-4 relative rounded-md border border-border bg-muted/40 overflow-hidden group">
          <div className={`relative w-full ${aspectClass}`}>
            <img
              src={activeDisplayUrl}
              alt={label}
              className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white truncate font-mono">
            {isCustom ? 'Foto Kustom' : 'Default: ' + fallbackUrl.split('/').pop()}
          </div>
        </div>

        {/* Action Controls & URL Input */}
        <div className="md:col-span-8 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs gap-1.5 border-border bg-background cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UploadCloud className="size-3.5 text-primary" />
              )}
              <span>{isUploading ? 'Mengunggah...' : 'Unggah File'}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
              className="h-8 text-xs gap-1.5 border-border bg-background cursor-pointer"
            >
              <Sparkles className="size-3.5 text-amber-500" />
              <span>{showPresets ? 'Tutup Preset' : 'Pilih Preset'}</span>
            </Button>

            {isCustom && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetToDefault}
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
              >
                <RefreshCw className="size-3" />
                <span>Reset ke Default</span>
              </Button>
            )}
          </div>

          {/* URL Input */}
          <div className="space-y-1">
            <Label htmlFor={`${id}-url`} className="text-[10px] text-muted-foreground uppercase font-mono">
              URL Gambar (Supabase / External / Preset)
            </Label>
            <Input
              id={`${id}-url`}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Bawaan: ${fallbackUrl}`}
              className="h-8 text-xs font-mono bg-background border-border"
            />
          </div>

          {/* Preset Selector Grid */}
          {showPresets && (
            <div className="rounded-md border border-border bg-muted/20 p-2.5 space-y-2 max-h-48 overflow-y-auto">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Koleksi Preset Brand Resmi
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presets.map((preset) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        onChange(preset.url);
                        setShowPresets(false);
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded border text-left text-[11px] transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="size-6 rounded object-cover shrink-0 border border-border"
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
