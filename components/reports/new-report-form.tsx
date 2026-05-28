"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useFormState } from "react-dom";
import type { CreateReportState } from "@/app/dashboard/reports/new/actions";

type FormAction = (state: CreateReportState, formData: FormData) => Promise<CreateReportState>;

type Copy = {
  atLeastOne: string;
  maxPhotos: string;
  invalidType: string;
  maxSize: string;
  selectedPhotos: string;
};

const copyByLocale = {
  es: {
    atLeastOne: "Sube o toma al menos una foto del cliente.",
    maxPhotos: "Puedes subir maximo 3 fotos. Conservamos las fotos anteriores y rechazamos las que exceden el limite.",
    invalidType: "Solo puedes subir imagenes JPG, PNG o WebP.",
    maxSize: "Cada imagen debe pesar {maxUploadMb} MB o menos.",
    selectedPhotos: "Fotos seleccionadas"
  },
  en: {
    atLeastOne: "Upload or take at least one client photo.",
    maxPhotos: "You can upload up to 3 photos. Previous photos were kept and extra photos were rejected.",
    invalidType: "Only JPG, PNG or WebP images are supported.",
    maxSize: "Each image must be {maxUploadMb} MB or smaller.",
    selectedPhotos: "Selected photos"
  },
  pt: {
    atLeastOne: "Envie ou tire pelo menos uma foto do cliente.",
    maxPhotos: "Voce pode enviar no maximo 3 fotos. Mantivemos as fotos anteriores e rejeitamos as excedentes.",
    invalidType: "Envie apenas imagens JPG, PNG ou WebP.",
    maxSize: "Cada imagem deve ter {maxUploadMb} MB ou menos.",
    selectedPhotos: "Fotos selecionadas"
  }
} satisfies Record<string, Copy>;

const maxPhotoCount = 3;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function NewReportForm({
  action,
  children,
  locale = "es",
  maxUploadMb
}: {
  action: FormAction;
  children: ReactNode;
  locale?: keyof typeof copyByLocale;
  maxUploadMb: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [state, formAction] = useFormState(action, { error: null });
  const formRef = useRef<HTMLFormElement>(null);
  const copy = copyByLocale[locale] ?? copyByLocale.es;
  const visibleError = error ?? state.error;

  useEffect(() => {
    if (state.error) {
      vibrate("error");
    }
  }, [state.error]);

  function getSelectedPhotos(form: HTMLFormElement | null | undefined) {
    if (!form) {
      return [];
    }

    return Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"][name="photos"]')).flatMap((input) =>
      Array.from(input.files ?? [])
    );
  }

  function validate(files: File[]) {
    if (!files.length) {
      return copy.atLeastOne;
    }

    if (files.length > maxPhotoCount) {
      return copy.maxPhotos;
    }

    if (files.some((file) => !allowedImageTypes.has(file.type))) {
      return copy.invalidType;
    }

    const maxBytes = maxUploadMb * 1024 * 1024;
    if (files.some((file) => file.size > maxBytes)) {
      return copy.maxSize.replace("{maxUploadMb}", String(maxUploadMb));
    }

    return null;
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    const form = formRef.current;

    if (!(target instanceof HTMLInputElement) || target.type !== "file" || !form) {
      return;
    }

    const selectedFiles = getSelectedPhotos(form);
    const issue = validate(selectedFiles);

    if (!issue) {
      setPhotoCount(selectedFiles.length);
      setError(null);
      return;
    }

    limitSelectedFiles(form, target);
    setPhotoCount(getSelectedPhotos(form).length);
    setError(issue);
    vibrate("error");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const selectedFiles = getSelectedPhotos(form);
    const issue = validate(selectedFiles);

    if (!issue) {
      setPhotoCount(selectedFiles.length);
      setError(null);
      vibrate("start");
      return;
    }

    event.preventDefault();
    setPhotoCount(selectedFiles.length);
    setError(issue);
    vibrate("error");
  }

  return (
    <form ref={formRef} action={formAction} onChange={handleChange} onSubmit={handleSubmit}>
      {children}
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold/80">
        {copy.selectedPhotos}: {Math.min(photoCount, maxPhotoCount)}/{maxPhotoCount}
      </p>
      {visibleError ? (
        <div
          className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{visibleError}</span>
        </div>
      ) : null}
    </form>
  );
}

function limitSelectedFiles(form: HTMLFormElement, target: HTMLInputElement) {
  const otherInputs = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"][name="photos"]')).filter(
    (input) => input !== target
  );
  const alreadySelected = otherInputs.flatMap((input) => Array.from(input.files ?? [])).length;
  const availableSlots = Math.max(0, maxPhotoCount - alreadySelected);

  if (!availableSlots) {
    target.value = "";
    return;
  }

  const selected = Array.from(target.files ?? []);
  const accepted = selected.slice(0, availableSlots);

  if (accepted.length === selected.length) {
    return;
  }

  try {
    const dataTransfer = new DataTransfer();

    for (const file of accepted) {
      dataTransfer.items.add(file);
    }

    target.files = dataTransfer.files;
  } catch {
    target.value = "";
  }
}

function vibrate(type: "start" | "error") {
  if (!("vibrate" in navigator)) {
    return;
  }

  navigator.vibrate(type === "start" ? [40] : [160, 50, 160]);
}
