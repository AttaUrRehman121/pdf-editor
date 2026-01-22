"use client";

import React from "react";
import { Download, Minus, Plus, ChevronLeft, ChevronRight, X, FilePlus } from "lucide-react";
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
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onRemovePage: () => void;
}) {
  const { pageSize, onChangePageSize, zoom, onChangeZoom, selected, onChangeSelected, onExportPdf, currentPageIndex, totalPages, onPageChange, onAddPage, onRemovePage } = props;

  const isText = selected?.type === "text";
  const isShape = selected?.type === "shape";

  const fontOptions = [
    // Sans-Serif - Classic
    { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
    { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    { label: "Arial Black", value: '"Arial Black", Gadget, sans-serif' },
    { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
    { label: "Trebuchet MS", value: '"Trebuchet MS", Helvetica, sans-serif' },
    { label: "Impact", value: "Impact, Charcoal, sans-serif" },
    { label: "Gill Sans", value: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif' },
    { label: "Lucida Sans", value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
    { label: "Lucida Grande", value: '"Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif' },
    // Sans-Serif - Modern
    { label: "Calibri", value: "Calibri, Candara, Segoe, sans-serif" },
    { label: "Candara", value: "Candara, Calibri, sans-serif" },
    { label: "Corbel", value: "Corbel, Calibri, sans-serif" },
    { label: "Century Gothic", value: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' },
    { label: "Franklin Gothic", value: '"Franklin Gothic Medium", Arial, sans-serif' },
    { label: "Futura", value: "Futura, Trebuchet MS, Arial, sans-serif" },
    { label: "Optima", value: "Optima, Segoe, Candara, sans-serif" },
    { label: "Geneva", value: "Geneva, Tahoma, Verdana, sans-serif" },
    { label: "Monaco", value: "Monaco, Consolas, monospace" },
    // Sans-Serif - Professional
    { label: "Myriad", value: "Myriad Pro, Myriad, Helvetica, sans-serif" },
    { label: "Frutiger", value: "Frutiger, Frutiger Linotype, Univers, Calibri, sans-serif" },
    { label: "Univers", value: "Univers, Calibri, sans-serif" },
    { label: "Akzidenz Grotesk", value: '"Akzidenz Grotesk", Helvetica, Arial, sans-serif' },
    { label: "Avenir", value: "Avenir, Avenir Next, Helvetica, sans-serif" },
    { label: "DIN", value: "DIN, DIN Alternate, Arial, sans-serif" },
    // Sans-Serif - Web Fonts
    { label: "Fira Sans", value: '"Fira Sans", Helvetica, Arial, sans-serif' },
    { label: "Lato", value: "Lato, Helvetica, Arial, sans-serif" },
    { label: "Montserrat", value: "var(--font-montserrat), Montserrat, Arial, sans-serif" },
    { label: "Open Sans", value: "var(--font-open-sans), \"Open Sans\", Arial, sans-serif" },
    { label: "Oswald", value: "Oswald, Arial, sans-serif" },
    { label: "Poppins", value: "var(--font-poppins), Poppins, Arial, sans-serif" },
    { label: "Raleway", value: "var(--font-raleway), Raleway, Arial, sans-serif" },
    { label: "Roboto", value: "var(--font-roboto), Roboto, Arial, sans-serif" },
    { label: "Source Sans Pro", value: '"Source Sans Pro", Helvetica, Arial, sans-serif' },
    { label: "Ubuntu", value: "Ubuntu, Helvetica, Arial, sans-serif" },
    { label: "PT Sans", value: '"PT Sans", Helvetica, Arial, sans-serif' },
    { label: "Nunito", value: "var(--font-nunito), Nunito, Arial, sans-serif" },
    { label: "Inter", value: "var(--font-inter), Inter, Arial, sans-serif" },
    { label: "Work Sans", value: '"Work Sans", Helvetica, Arial, sans-serif' },
    { label: "DM Sans", value: '"DM Sans", Helvetica, Arial, sans-serif' },
    { label: "Manrope", value: "Manrope, Helvetica, Arial, sans-serif" },
    { label: "Space Grotesk", value: '"Space Grotesk", Helvetica, Arial, sans-serif' },
    { label: "Plus Jakarta Sans", value: '"Plus Jakarta Sans", Helvetica, Arial, sans-serif' },
    { label: "Sora", value: "Sora, Helvetica, Arial, sans-serif" },
    { label: "Outfit", value: "Outfit, Helvetica, Arial, sans-serif" },
    // Serif - Classic
    { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Palatino", value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
    { label: "Garamond", value: "Garamond, serif" },
    { label: "Bookman", value: '"Bookman Old Style", serif' },
    { label: "Baskerville", value: "Baskerville, Baskerville Old Face, serif" },
    { label: "Bodoni", value: "Bodoni MT, Didot, Didot LT STD, serif" },
    { label: "Didot", value: "Didot, Didot LT STD, serif" },
    { label: "Hoefler Text", value: '"Hoefler Text", Garamond, serif' },
    { label: "Minion", value: "Minion Pro, Garamond, serif" },
    { label: "Adobe Caslon", value: '"Adobe Caslon Pro", Caslon, serif' },
    { label: "Perpetua", value: "Perpetua, Baskerville, serif" },
    { label: "Rockwell", value: "Rockwell, Courier Bold, Courier, Georgia, serif" },
    // Serif - Modern
    { label: "Cambria", value: "Cambria, Georgia, serif" },
    { label: "Constantia", value: "Constantia, Georgia, serif" },
    { label: "Merriweather", value: "var(--font-merriweather), Merriweather, Georgia, serif" },
    { label: "Lora", value: "var(--font-lora), Lora, Georgia, serif" },
    { label: "PT Serif", value: '"PT Serif", Georgia, serif' },
    { label: "Crimson Text", value: '"Crimson Text", Georgia, serif' },
    { label: "Libre Baskerville", value: '"Libre Baskerville", Georgia, serif' },
    { label: "Playfair Display", value: "var(--font-playfair), \"Playfair Display\", Georgia, serif" },
    { label: "Playfair", value: '"Playfair Display", Georgia, serif' },
    { label: "DM Serif Display", value: '"DM Serif Display", Georgia, serif' },
    { label: "Cormorant", value: "Cormorant, Georgia, serif" },
    { label: "Bitter", value: "Bitter, Georgia, serif" },
    { label: "Crimson Pro", value: '"Crimson Pro", Georgia, serif' },
    // Monospace
    { label: "Courier New", value: '"Courier New", Courier, monospace' },
    { label: "Courier", value: "Courier, monospace" },
    { label: "Lucida Console", value: '"Lucida Console", Monaco, monospace' },
    { label: "Consolas", value: "Consolas, monospace" },
    { label: "Source Code Pro", value: '"Source Code Pro", Consolas, monospace' },
    { label: "Fira Code", value: '"Fira Code", Consolas, monospace' },
    { label: "JetBrains Mono", value: '"JetBrains Mono", Consolas, monospace' },
    { label: "Roboto Mono", value: '"Roboto Mono", Consolas, monospace' },
    { label: "Inconsolata", value: "Inconsolata, Consolas, monospace" },
    { label: "Courier Prime", value: '"Courier Prime", Courier, monospace' },
    // Decorative
    { label: "Comic Sans MS", value: '"Comic Sans MS", cursive' },
    { label: "MS Sans Serif", value: '"MS Sans Serif", Geneva, sans-serif' },
    { label: "MS Serif", value: '"MS Serif", New York, serif' },
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

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
          disabled={currentPageIndex === 0}
          className={`${iconButtonBase} ${currentPageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1 px-2 py-1 text-xs text-gray-700 bg-gray-50 rounded border border-gray-200">
          <span>Page</span>
          <span className="font-semibold">{currentPageIndex + 1}</span>
          <span>of</span>
          <span className="font-semibold">{totalPages}</span>
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPageIndex + 1))}
          disabled={currentPageIndex >= totalPages - 1}
          className={`${iconButtonBase} ${currentPageIndex >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={onAddPage}
          className={`${iconButtonBase} text-blue-600 hover:bg-blue-50`}
          title="Add new page"
        >
          <FilePlus size={16} />
        </button>
        {totalPages > 1 && (
          <button
            onClick={onRemovePage}
            className={`${iconButtonBase} text-red-600 hover:bg-red-50`}
            title="Remove current page"
          >
            <X size={16} />
          </button>
        )}
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
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
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

