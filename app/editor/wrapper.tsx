"use client";

import { useSearchParams } from "next/navigation";
import PdfEditorClient from "@/components/PdfEditorClient";

export function EditorWithTemplate() {
  const params = useSearchParams();
  const template = params.get("cvTemplate") || undefined;
  const rawMode = params.get("mode");
  const mode = rawMode === "cv" || rawMode === "pdf" ? rawMode : undefined;

  return <PdfEditorClient initialTemplate={template} initialMode={mode} />;
}


