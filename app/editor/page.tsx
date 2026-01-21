import PdfEditorClient from "@/components/PdfEditorClient";
import { Suspense } from "react";
import { EditorWithTemplate } from "./wrapper";

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Loading editor…</div>}>
        <EditorWithTemplate />
      </Suspense>
    </main>
  );
}

