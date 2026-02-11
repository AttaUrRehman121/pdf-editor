"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

type MobileSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Optional aria-label for the dialog */
  ariaLabel?: string;
  /** Max height (tailwind class), default 75vh */
  maxHeightClassName?: string;
  children: React.ReactNode;
};

export function MobileSheet({
  open,
  onClose,
  ariaLabel = "Properties",
  maxHeightClassName = "max-h-[75vh]",
  children,
}: MobileSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close overlay"
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 ${maxHeightClassName} flex flex-col`}
      >
        <div className="h-12 flex items-center justify-between px-3 border-b border-gray-200">
          <div className="w-10" />
          <div className="w-10 h-1.5 rounded-full bg-gray-200" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

