"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

type PdfEditorClientProps = {
  initialTemplate?: string;
  initialMode?: "pdf" | "cv";
};

// Dynamically import PdfEditor with SSR disabled so pdfjs-dist only loads in the browser
const PdfEditor = dynamic(() => import("./PdfEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="text-gray-600">Loading PDF Editor...</div>
    </div>
  ),
});

export default function PdfEditorClient({ initialTemplate, initialMode }: PdfEditorClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading PDF Editor...</div>
      </div>
    );
  }

  return <PdfEditor initialTemplate={initialTemplate} initialMode={initialMode} />;
}


