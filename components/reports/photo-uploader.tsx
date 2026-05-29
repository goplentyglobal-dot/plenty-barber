"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, UploadCloud, X } from "lucide-react";

type Locale = "es" | "en" | "pt";

const copyByLocale = {
  es: {
    uploadPhoto: "Subir foto",
    uploadHelp: "Galería o archivos. JPG, PNG o WebP.",
    takePhoto: "Tomar foto",
    takePhotoHelp: "Cámara del celular o selector en PC.",
    dropHint: "Arrastra hasta 3 fotos claras o usa los botones.",
    remove: "Quitar foto",
    cover: "Principal"
  },
  en: {
    uploadPhoto: "Upload photo",
    uploadHelp: "Gallery or files. JPG, PNG or WebP.",
    takePhoto: "Take photo",
    takePhotoHelp: "Phone camera or desktop picker.",
    dropHint: "Drop up to 3 clear photos or use the buttons.",
    remove: "Remove photo",
    cover: "Cover"
  },
  pt: {
    uploadPhoto: "Enviar foto",
    uploadHelp: "Galeria ou arquivos. JPG, PNG ou WebP.",
    takePhoto: "Tirar foto",
    takePhotoHelp: "Câmera do celular ou seletor no PC.",
    dropHint: "Solte até 3 fotos nítidas ou use os botões.",
    remove: "Remover foto",
    cover: "Principal"
  }
} satisfies Record<Locale, Record<string, string>>;

const maxPhotoCount = 3;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type Preview = { url: string; name: string };

export function PhotoUploader({ locale = "es" }: { locale?: Locale }) {
  const copy = copyByLocale[locale] ?? copyByLocale.es;
  const photosRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const syncCanonical = useCallback((files: File[]) => {
    const input = photosRef.current;
    if (!input) return;

    const transfer = new DataTransfer();
    for (const file of files) {
      transfer.items.add(file);
    }
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    setPreviews((current) => {
      for (const preview of current) {
        URL.revokeObjectURL(preview.url);
      }
      return files.map((file) => ({ url: URL.createObjectURL(file), name: file.name }));
    });
  }, []);

  const currentFiles = useCallback(() => Array.from(photosRef.current?.files ?? []), []);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid = Array.from(incoming).filter(
        (file) => file.size > 0 && allowedImageTypes.has(file.type)
      );
      if (!valid.length) return;

      const existing = currentFiles();
      const merged: File[] = [...existing];
      for (const file of valid) {
        const isDuplicate = merged.some(
          (item) => item.name === file.name && item.size === file.size
        );
        if (!isDuplicate && merged.length < maxPhotoCount) {
          merged.push(file);
        }
      }
      syncCanonical(merged);
    },
    [currentFiles, syncCanonical]
  );

  const removeAt = useCallback(
    (index: number) => {
      const next = currentFiles().filter((_, i) => i !== index);
      syncCanonical(next);
    },
    [currentFiles, syncCanonical]
  );

  useEffect(() => {
    return () => {
      setPreviews((current) => {
        for (const preview of current) {
          URL.revokeObjectURL(preview.url);
        }
        return [];
      });
    };
  }, []);

  const atLimit = previews.length >= maxPhotoCount;

  return (
    <div className="mt-5 grid gap-4">
      <input ref={photosRef} type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" tabIndex={-1} aria-hidden="true" />
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => galleryRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            galleryRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!atLimit) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files) addFiles(event.dataTransfer.files);
        }}
        className={`grid min-h-44 cursor-pointer place-items-center rounded-lg border border-dashed p-6 text-center transition ${
          isDragging
            ? "border-gold bg-gold/20"
            : "border-gold/35 bg-gold/10 hover:border-gold hover:bg-gold/15"
        } ${atLimit ? "pointer-events-none opacity-50" : ""}`}
      >
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-noir/70 text-gold">
            <UploadCloud className="h-9 w-9" />
          </div>
          <p className="mt-4 font-medium text-cream">{copy.uploadPhoto}</p>
          <p className="mt-2 text-sm text-cream/58">{copy.dropHint}</p>
        </div>
      </div>

      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div
              key={preview.url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-noir"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
              {index === 0 ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-noir">
                  {copy.cover}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={copy.remove}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-noir/80 text-cream opacity-0 transition hover:bg-red-500/80 group-hover:opacity-100 focus:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={atLimit}
          className="flex min-h-24 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-gold/35 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
            <Camera className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-medium text-cream">{copy.takePhoto}</span>
            <span className="mt-1 block text-xs leading-5 text-cream/54">{copy.takePhotoHelp}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={atLimit}
          className="flex min-h-24 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-gold/35 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
            <ImagePlus className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-medium text-cream">{copy.uploadPhoto}</span>
            <span className="mt-1 block text-xs leading-5 text-cream/54">{copy.uploadHelp}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
