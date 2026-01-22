"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import type { TextItem, ImageItem } from "@/lib/pdf-utils";

type SelectedItem = TextItem | ImageItem;

export function PdfRightInspector(props: {
  selectedText: TextItem | null;
  selectedImage: ImageItem | null;
  onUpdateText: (updates: Partial<TextItem>) => void;
  onUpdateImage: (updates: Partial<ImageItem>) => void;
  onDeleteText: () => void;
  onDeleteImage: () => void;
}) {
  const { selectedText, selectedImage, onUpdateText, onUpdateImage, onDeleteText, onDeleteImage } = props;

  const hasSelection = selectedText || selectedImage;

  return (
    <div className="w-72 bg-white border-l border-gray-200 p-4 overflow-auto">
      <div className="text-sm font-semibold text-gray-900 mb-4">Properties</div>

      {!hasSelection && (
        <div className="text-xs text-gray-500">
          Select text or an image on the PDF to edit its properties.
        </div>
      )}

      {selectedText && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Type: <span className="text-gray-900 font-medium">Text</span>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Text Content</label>
            <textarea
              value={selectedText.text}
              onChange={(e) => onUpdateText({ text: e.target.value, hasChanged: true })}
              className="w-full text-sm text-gray-900 border border-gray-200 rounded-md px-2 py-1.5 min-h-[60px] resize-y bg-white"
              rows={3}
              style={{ color: '#111827' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              Font Size
              <input
                type="number"
                min={6}
                max={72}
                value={Math.round(selectedText.fontSize)}
                onChange={(e) =>
                  onUpdateText({ fontSize: parseFloat(e.target.value || "11"), hasChanged: true })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Font Family
              <select
                value={(() => {
                  // Get the base font name (strip Bold, Italic, etc.)
                  const baseFontName = selectedText.fontName 
                    ? selectedText.fontName.replace(/\s*(bold|italic|oblique|black|light|regular|medium|semibold|heavy|thin|extrabold|ultrabold)\s*/gi, "").trim()
                    : selectedText.fontFamily?.split(",")[0]?.trim().replace(/['"]/g, "") || "Helvetica";
                  
                  // Match to standard fonts (case-insensitive)
                  const lowerBase = baseFontName.toLowerCase();
                  if (lowerBase.includes("helvetica") || lowerBase === "helvetica") return "Helvetica";
                  if (lowerBase.includes("arial") || lowerBase === "arial") return "Arial";
                  if (lowerBase.includes("times") || lowerBase.includes("serif")) return "Times New Roman";
                  if (lowerBase.includes("courier") || lowerBase.includes("mono")) return "Courier New";
                  
                  // If no match, return the original fontName or baseFontName
                  return selectedText.fontName || baseFontName || "Helvetica";
                })()}
                onChange={(e) => {
                  const fontName = e.target.value;
                  let fontFamily = "";
                  if (fontName === "Times New Roman") {
                    fontFamily = '"Times New Roman", Times, serif';
                  } else if (fontName === "Courier New") {
                    fontFamily = '"Courier New", Courier, monospace';
                  } else if (fontName === "Helvetica") {
                    fontFamily = "Helvetica, Arial, sans-serif";
                  } else if (fontName === "Arial") {
                    fontFamily = "Arial, Helvetica, sans-serif";
                  } else {
                    // Preserve original fontFamily if available, otherwise create a fallback
                    fontFamily = selectedText.fontFamily || `${fontName}, Arial, Helvetica, sans-serif`;
                  }
                  onUpdateText({ fontName, fontFamily, hasChanged: true });
                }}
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              >
                {/* Show original font if it's not in the standard list */}
                {selectedText.fontName && 
                 (() => {
                   const baseFontName = selectedText.fontName.replace(/\s*(bold|italic|oblique|black|light|regular|medium|semibold|heavy|thin|extrabold|ultrabold)\s*/gi, "").trim();
                   const lowerBase = baseFontName.toLowerCase();
                   const isStandard = lowerBase.includes("helvetica") || lowerBase.includes("arial") || 
                                     lowerBase.includes("times") || lowerBase.includes("courier") ||
                                     lowerBase.includes("serif") || lowerBase.includes("mono");
                   return !isStandard;
                 })() && (
                  <option value={selectedText.fontName} key="original">
                    {selectedText.fontName} (Original)
                  </option>
                )}
                <option value="Helvetica">Helvetica</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedText.isBold}
                onChange={(e) => onUpdateText({ isBold: e.target.checked, hasChanged: true })}
                className="rounded"
              />
              Bold
            </label>
            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedText.isItalic}
                onChange={(e) => onUpdateText({ isItalic: e.target.checked, hasChanged: true })}
                className="rounded"
              />
              Italic
            </label>
          </div>

          <label className="text-xs text-gray-600 block">
            Text Color
            <input
              type="color"
              value={
                selectedText.textColor && selectedText.textColor.startsWith("#")
                  ? selectedText.textColor
                  : selectedText.textColor && selectedText.textColor.startsWith("rgb")
                  ? (() => {
                      const match = selectedText.textColor.match(/\d+/g);
                      if (match && match.length >= 3) {
                        const r = parseInt(match[0]).toString(16).padStart(2, "0");
                        const g = parseInt(match[1]).toString(16).padStart(2, "0");
                        const b = parseInt(match[2]).toString(16).padStart(2, "0");
                        return `#${r}${g}${b}`;
                      }
                      return "#000000";
                    })()
                  : "#000000"
              }
              onChange={(e) => {
                const hex = e.target.value;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                onUpdateText({ textColor: `rgb(${r}, ${g}, ${b})`, hasChanged: true });
              }}
              className="mt-1 w-full h-10 border border-gray-200 rounded cursor-pointer"
            />
          </label>

          <label className="text-xs text-gray-600 block">
            Background Color
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={
                  selectedText.backgroundColor && selectedText.backgroundColor !== "transparent" && selectedText.backgroundColor.startsWith("#")
                    ? selectedText.backgroundColor
                    : selectedText.backgroundColor && selectedText.backgroundColor !== "transparent" && selectedText.backgroundColor.startsWith("rgb")
                    ? (() => {
                        const match = selectedText.backgroundColor.match(/\d+/g);
                        if (match && match.length >= 3) {
                          const r = parseInt(match[0]).toString(16).padStart(2, "0");
                          const g = parseInt(match[1]).toString(16).padStart(2, "0");
                          const b = parseInt(match[2]).toString(16).padStart(2, "0");
                          return `#${r}${g}${b}`;
                        }
                        return "#ffffff";
                      })()
                    : "#ffffff"
                }
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  onUpdateText({ backgroundColor: `rgb(${r}, ${g}, ${b})`, hasChanged: true });
                }}
                className="flex-1 h-10 border border-gray-200 rounded cursor-pointer"
              />
              <button
                onClick={() => onUpdateText({ backgroundColor: "transparent", hasChanged: true })}
                className="px-3 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 whitespace-nowrap"
                title="Remove background"
              >
                Clear
              </button>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              X Position
              <input
                type="number"
                value={Math.round(selectedText.x)}
                onChange={(e) =>
                  onUpdateText({ x: parseFloat(e.target.value || "0"), hasChanged: true })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Y Position
              <input
                type="number"
                value={Math.round(selectedText.y)}
                onChange={(e) =>
                  onUpdateText({ y: parseFloat(e.target.value || "0"), hasChanged: true })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
          </div>

          <button
            onClick={onDeleteText}
            className="w-full px-3 py-2 rounded-lg border border-red-100 text-red-600 text-sm hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Delete Text
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Type: <span className="text-gray-900 font-medium">Image</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              X Position
              <input
                type="number"
                value={Math.round(selectedImage.x)}
                onChange={(e) =>
                  onUpdateImage({ x: parseFloat(e.target.value || "0") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Y Position
              <input
                type="number"
                value={Math.round(selectedImage.y)}
                onChange={(e) =>
                  onUpdateImage({ y: parseFloat(e.target.value || "0") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Width
              <input
                type="number"
                min={10}
                value={Math.round(selectedImage.width)}
                onChange={(e) =>
                  onUpdateImage({ width: parseFloat(e.target.value || "100") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Height
              <input
                type="number"
                min={10}
                value={Math.round(selectedImage.height)}
                onChange={(e) =>
                  onUpdateImage({ height: parseFloat(e.target.value || "100") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
          </div>

          <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 mb-1">Quick Actions</div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onUpdateImage({ width: selectedImage.width * 1.1, height: selectedImage.height * 1.1 })
                }
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
              >
                +10%
              </button>
              <button
                onClick={() =>
                  onUpdateImage({ width: selectedImage.width * 0.9, height: selectedImage.height * 0.9 })
                }
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
              >
                -10%
              </button>
            </div>
          </div>

          <button
            onClick={onDeleteImage}
            className="w-full px-3 py-2 rounded-lg border border-red-100 text-red-600 text-sm hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Delete Image
          </button>
        </div>
      )}
    </div>
  );
}
