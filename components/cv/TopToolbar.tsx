"use client";

import React from "react";
import { Download, Minus, Plus } from "lucide-react";
import type { CvElement, CvPageSize } from "@/lib/cv-model";

const zoomOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

const controlBase =
  "text-xs text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";
const iconButtonBase =
  "w-9 h-9 rounded-lg border border-gray-300 text-gray-800 bg-white flex items-center justify-center hover:bg-gray-50";

export function TopToolbar(props: {
  pageSize: CvPageSize;
  onChangePageSize: (s: CvPageSize) => void;
  zoom: number;
  onChangeZoom: (z: number) => void;
  selected: CvElement | null;
  onChangeSelected: (updates: Partial<CvElement>) => void;
  onExportPdf: () => void;
}) {
  const { pageSize, onChangePageSize, zoom, onChangeZoom, selected, onChangeSelected, onExportPdf } = props;

  const isText = selected?.type === "text";
  const isShape = selected?.type === "shape";

  const fontOptions = [
    { label: "Inter", value: "var(--font-inter), Inter, Arial, sans-serif" },
    { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
    { label: "Roboto", value: "var(--font-roboto), Roboto, Arial, sans-serif" },
    { label: "Poppins", value: "var(--font-poppins), Poppins, Arial, sans-serif" },
    { label: "Nunito", value: "var(--font-nunito), Nunito, Arial, sans-serif" },
    { label: "Raleway", value: "var(--font-raleway), Raleway, Arial, sans-serif" },
    { label: "Montserrat", value: "var(--font-montserrat), Montserrat, Arial, sans-serif" },
    { label: "Open Sans", value: "var(--font-open-sans), \"Open Sans\", Arial, sans-serif" },
    { label: "Lora", value: "var(--font-lora), Lora, Georgia, serif" },
    { label: "Merriweather", value: "var(--font-merriweather), Merriweather, Georgia, serif" },
    { label: "Playfair Display", value: "var(--font-playfair), \"Playfair Display\", Georgia, serif" },
  ];

  const listOptions = [
    { label: "No list", value: "none" },
    { label: "• Bullets", value: "bullet" },
    { label: "1. Numbered", value: "number" },
    { label: "I. Roman (upper)", value: "upper_roman" },
    { label: "i. Roman (lower)", value: "lower_roman" },
    { label: "A. Alpha (upper)", value: "upper_alpha" },
    { label: "a. Alpha (lower)", value: "lower_alpha" },
  ] as const;

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-3 gap-3">
      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold text-gray-900">CV Builder</div>
        <span className="text-xs text-gray-400">•</span>
        <select
          value={pageSize}
          onChange={(e) => onChangePageSize(e.target.value as CvPageSize)}
          className={controlBase}
        >
          <option value="A4">A4</option>
          <option value="LETTER">Letter</option>
        </select>
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      {/* Selected element controls (minimal, Canva-like location) */}
      <div className="flex items-center gap-2 flex-1">
        {isText && (
          <>
            <select
              value={selected.fontFamily}
              onChange={(e) =>
                onChangeSelected({
                  fontFamily: e.target.value,
                } as Partial<CvElement>)
              }
              className={controlBase}
              title="Font family"
            >
              {fontOptions.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                onChangeSelected({
                  fontWeight: selected.fontWeight === "bold" ? "normal" : "bold",
                } as Partial<CvElement>)
              }
              className={`px-2 py-1 text-xs font-bold rounded border ${
                selected.fontWeight === "bold"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-300 text-gray-900 bg-white hover:bg-gray-50"
              }`}
              title="Bold"
            >
              B
            </button>
            <input
              type="number"
              min={8}
              max={72}
              value={selected.fontSize}
              onChange={(e) =>
                onChangeSelected({ fontSize: parseInt(e.target.value || "12", 10) } as Partial<CvElement>)
              }
              className={`${controlBase} w-16`}
              title="Font size"
            />
            <select
              value={selected.align}
              onChange={(e) => onChangeSelected({ align: e.target.value } as Partial<CvElement>)}
              className={controlBase}
              title="Align"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-700">Text</span>
              <input
                type="color"
                value={selected.color.startsWith("#") ? selected.color : "#111827"}
                onChange={(e) => onChangeSelected({ color: e.target.value } as Partial<CvElement>)}
                className="w-7 h-7 border border-gray-300 rounded"
                title="Text color"
              />
            </div>

            <select
              value={selected.listStyle ?? "none"}
              onChange={(e) =>
                onChangeSelected({
                  listStyle: e.target.value,
                } as Partial<CvElement>)
              }
              className={controlBase}
              title="List style"
            >
              {listOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </>
        )}
        {isShape && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-700">Fill</span>
            <input
              type="color"
              value={selected.fill.startsWith("#") ? selected.fill : "#ffffff"}
              onChange={(e) => onChangeSelected({ fill: e.target.value } as Partial<CvElement>)}
              className="w-7 h-7 border border-gray-300 rounded"
              title="Fill color"
            />
          </div>
        )}
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangeZoom(Math.max(0.25, Math.round((zoom - 0.1) * 100) / 100))}
          className={iconButtonBase}
          title="Zoom out"
        >
          <Minus size={16} />
        </button>
        <select
          value={zoom}
          onChange={(e) => onChangeZoom(parseFloat(e.target.value))}
          className={controlBase}
          title="Zoom"
        >
          {zoomOptions.map((z) => (
            <option key={z} value={z}>
              {Math.round(z * 100)}%
            </option>
          ))}
        </select>
        <button
          onClick={() => onChangeZoom(Math.min(3, Math.round((zoom + 0.1) * 100) / 100))}
          className={iconButtonBase}
          title="Zoom in"
        >
          <Plus size={16} />
        </button>

        <button
          onClick={onExportPdf}
          className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          title="Export PDF"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}

