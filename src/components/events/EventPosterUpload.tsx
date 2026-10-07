'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { soundEffects } from '@/lib/audio/soundEffects';
import { api } from '@/lib/client/api';

export interface EventPosterUploadProps {
  value?: string;
  onChange: (url: string, fileInfo?: { filename: string; size: number }) => void;
  required?: boolean;
  initialFileName?: string;
  initialFileSize?: number;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EventPosterUpload({
  value,
  onChange,
  required = false,
  initialFileName,
  initialFileSize,
}: EventPosterUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fileName, setFileName] = useState<string>(initialFileName || '');
  const [fileSize, setFileSize] = useState<number | undefined>(initialFileSize);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value && value !== previewUrl) {
      setPreviewUrl(value);
      setFileName((prev) => {
        if (prev) return prev;
        const parts = value.split('/');
        return parts[parts.length - 1] || 'event-poster.png';
      });
    } else if (!value) {
      setPreviewUrl('');
    }
  }, [value, previewUrl]);

  const validateFile = (file: File): string | null => {
    const mime = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return 'Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size is ${formatFileSize(file.size)}, which exceeds the 5 MB maximum limit.`;
    }
    return null;
  };

  const processAndUploadFile = async (file: File) => {
    soundEffects.playClick();
    setErrorMessage('');

    // 1. Client-side validation
    const validationError = validateFile(file);
    if (validationError) {
      soundEffects.playError();
      setErrorMessage(validationError);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    // 2. Generate local instant preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const localDataUrl = e.target?.result as string;
      setPreviewUrl(localDataUrl);
    };
    reader.readAsDataURL(file);

    // 3. Upload to server storage API
    setIsUploading(true);
    setUploadProgress(25);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 20 : prev));
      }, 100);

      const result = await api.upload.image(file);
      clearInterval(progressTimer);
      setUploadProgress(100);

      if (result && result.url) {
        soundEffects.playSuccess();
        setPreviewUrl(result.url);
        onChange(result.url, { filename: file.name, size: file.size });
      } else {
        // Fallback to local data URL if server didn't provide a URL
        soundEffects.playSuccess();
        const dataUrl = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(file);
        });
        setPreviewUrl(dataUrl);
        onChange(dataUrl, { filename: file.name, size: file.size });
      }
    } catch (err: any) {
      console.warn('Server upload fallback to data URL:', err);
      // Fallback: use persistent base64 data URL so user is never blocked
      try {
        const dataUrl = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(file);
        });
        setPreviewUrl(dataUrl);
        onChange(dataUrl, { filename: file.name, size: file.size });
        soundEffects.playSuccess();
      } catch (readErr) {
        soundEffects.playError();
        setErrorMessage(err.message || 'Failed to upload event poster.');
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 400);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAndUploadFile(e.target.files[0]);
    }
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundEffects.playClick();
    setPreviewUrl('');
    setFileName('');
    setFileSize(undefined);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange('');
  };

  const handleReplace = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundEffects.playClick();
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-2">
      {/* Label and Header */}
      <div className="flex items-center justify-between">
        <label 
          htmlFor="event-poster-input"
          className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200"
        >
          Event Poster / Banner {required && <span className="text-red-400">*</span>}
        </label>
        <span className="text-[0.7rem] font-mono text-neutral-400">
          1200 × 630 px recommended
        </span>
      </div>

      <p className="text-xs text-neutral-400">
        Upload the official poster or promotional banner for your event.
      </p>

      {/* Hidden File Input */}
      <input
        id="event-poster-input"
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        aria-label="Upload official event poster"
        className="hidden"
      />

      {/* State A: Preview Mode (Image Selected) */}
      {previewUrl ? (
        <div 
          className="relative rounded-2xl border border-white/20 bg-black/60 backdrop-blur-xl overflow-hidden p-4 sm:p-5 transition-all hover:border-white/30"
          style={{
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Image Preview Container */}
            <div className="relative w-full sm:w-56 h-36 rounded-xl overflow-hidden border border-white/15 bg-neutral-900 shrink-0 flex items-center justify-center">
              <img
                src={previewUrl}
                alt={fileName || 'Event poster preview'}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={() => {
                  setErrorMessage('Failed to load image preview.');
                }}
              />
              <span className="absolute bottom-2 left-2 text-[0.62rem] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/80 text-white border border-white/20 backdrop-blur-sm">
                PREVIEW
              </span>
            </div>

            {/* File Details & Actions */}
            <div className="flex-1 min-w-0 w-full flex flex-col justify-between py-1 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Poster Ready
                  </span>
                </div>

                <div 
                  className="font-mono text-sm sm:text-base font-bold text-white truncate mt-1" 
                  title={fileName || 'event-poster.png'}
                >
                  {fileName || 'event-poster.png'}
                </div>

                <div className="text-xs text-neutral-400 font-mono mt-0.5">
                  {formatFileSize(fileSize)} • JPG / PNG / WEBP
                </div>
              </div>

              {/* Action Buttons: Replace & Remove */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReplace}
                  className="btn btn-secondary text-xs py-1.5 px-3.5 rounded-full font-semibold flex items-center gap-1.5 text-inherit transition-all hover:border-white/40"
                  aria-label="Replace event poster"
                >
                  <RefreshCw size={12} />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="btn-ghost text-xs py-1.5 px-3 rounded-full font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
                  aria-label="Remove event poster"
                >
                  <X size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[0.7rem] font-mono text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin text-white" />
                  <span>Uploading to server storage...</span>
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-200" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* State B: Empty Dropzone State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload official event poster by clicking or dragging and dropping"
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-white focus:border-white ${
            isDragging
              ? 'border-white bg-white/10 scale-[1.01]'
              : 'border-white/15 bg-neutral-950/70 hover:border-white/35 hover:bg-neutral-900/60'
          }`}
          style={{
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Upload Icon */}
          <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center mx-auto mb-3 text-white transition-transform group-hover:scale-110">
            {isUploading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <Upload size={20} />
            )}
          </div>

          {/* Drag & Drop Prompt */}
          <div className="font-display font-bold text-sm sm:text-base text-white mb-1">
            {isDragging ? 'Drop your poster here' : 'Drag & drop your poster here'}
          </div>

          <p className="text-xs text-neutral-400 mb-4 max-w-sm mx-auto">
            or click below to browse your computer
          </p>

          {/* Choose File Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="btn btn-outline text-xs py-2 px-5 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:bg-white hover:text-black"
          >
            <ImageIcon size={14} />
            <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
          </button>

          {/* Specifications Footnote */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.7rem] font-mono text-neutral-400">
            <span>Supported: JPG, JPEG, PNG, WEBP</span>
            <span>•</span>
            <span>Max size: 5 MB</span>
            <span>•</span>
            <span>Dimensions: 1200 × 630 px</span>
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-200" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div 
          role="alert"
          className="flex items-center gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-mono animate-fadeIn"
        >
          <AlertCircle size={15} className="shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
