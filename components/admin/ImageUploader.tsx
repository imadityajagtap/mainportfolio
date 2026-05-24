"use client";

import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface ImageUploaderProps {
  label: string;
  multiple?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export default function ImageUploader({
  label,
  multiple = false,
  value,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const images = multiple
    ? Array.isArray(value) ? value : []
    : typeof value === 'string' && value ? [value] : [];

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`${response.status}: ${data.error || data.message || response.statusText}`);
    }

    if (!data.url) {
      throw new Error('Upload succeeded but no image URL was returned');
    }

    return data.url as string;
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const selectedFiles = multiple ? files : files.slice(0, 1);

    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];

      for (let index = 0; index < selectedFiles.length; index++) {
        setStatus(`Uploading ${index + 1} of ${selectedFiles.length}...`);
        uploadedUrls.push(await uploadFile(selectedFiles[index]));
      }

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0] || '');
      }

      setStatus('Upload complete');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
      setStatus('');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      void handleFiles(event.target.files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    if (event.dataTransfer.files) {
      void handleFiles(event.dataTransfer.files);
    }
  };

  const removeImage = (url: string) => {
    if (multiple) {
      onChange(images.filter((image) => image !== url));
      return;
    }

    onChange('');
  };

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-all ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-foreground/20 bg-background hover:border-primary/50 hover:bg-foreground/[0.03]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />

        {uploading ? (
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
        ) : (
          <Upload className="mb-3 h-8 w-8 text-foreground/50" />
        )}

        <p className="text-sm font-medium text-foreground">
          {uploading ? status : 'Drop images here or click to browse'}
        </p>
        <p className="mt-1 text-xs text-foreground/50">JPG, PNG, or WebP up to 5MB</p>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {!error && status && !uploading && <p className="mt-2 text-sm text-green-600">{status}</p>}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image} className="group relative aspect-video overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03]">
              {image ? (
                <SafeImage
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                  fallback={(
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-foreground/40" />
                    </div>
                  )}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-foreground/40" />
                </div>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage(image);
                }}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
