"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Drawer side (default left) */
  side?: "left" | "right";
  /** Optional aria-label for the dialog */
  ariaLabel?: string;
  /** Width classes for the drawer panel */
  panelClassName?: string;
  children: React.ReactNode;
};

export function MobileDrawer({
  open,
  onClose,
  side = "left",
  ariaLabel = "Panel",
  panelClassName = "w-[min(22rem,calc(100vw-2.5rem))]",
  children,
}: MobileDrawerProps) {
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

  const panelSideClass = side === "left" ? "left-0" : "right-0";

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close overlay"
      />
      <div
        className={`absolute top-0 bottom-0 ${panelSideClass} bg-white shadow-2xl ${panelClassName} max-w-full`}
      >
        <div className="h-12 flex items-center justify-end px-2 border-b border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-auto">{children}</div>
      </div>
    </div>
  );
}

