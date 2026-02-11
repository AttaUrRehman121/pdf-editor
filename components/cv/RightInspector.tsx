"use client";

import React from "react";
import { RotateCw, RotateCcw } from "lucide-react";
import type { CvElement } from "@/lib/cv-model";

export function RightInspector(props: {
  selected: CvElement | null;
  onChange: (updates: Partial<CvElement>) => void;
  onDelete: () => void;
  variant?: "sidebar" | "sheet";
  containerClassName?: string;
}) {
  const { selected, onChange, onDelete, variant = "sidebar", containerClassName } = props;

  const base =
    variant === "sheet"
      ? "w-full bg-white p-4 overflow-auto"
      : "w-72 bg-white border-l border-gray-200 p-4 overflow-auto";

  return (
    <div className={`${base} ${containerClassName ?? ""}`.trim()}>
      <div className="text-sm font-semibold text-gray-900 mb-2">Properties</div>

      {!selected && (
        <div className="text-xs text-gray-500">
          Select an element on the canvas to edit its properties.
        </div>
      )}

      {selected && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Type: <span className="text-gray-900 font-medium">{selected.type}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              X
              <input
                type="number"
                value={Math.round(selected.x)}
                onChange={(e) => onChange({ x: parseInt(e.target.value || "0", 10) } as Partial<CvElement>)}
                className="mt-1 w-full text-xs border border-gray-200 rounded-md px-2 py-1"
              />
            </label>
            <label className="text-xs text-gray-600">
              Y
              <input
                type="number"
                value={Math.round(selected.y)}
                onChange={(e) => onChange({ y: parseInt(e.target.value || "0", 10) } as Partial<CvElement>)}
                className="mt-1 w-full text-xs border border-gray-200 rounded-md px-2 py-1"
              />
            </label>
            <label className="text-xs text-gray-600">
              W
              <input
                type="number"
                value={Math.round(selected.width)}
                onChange={(e) => onChange({ width: parseInt(e.target.value || "0", 10) } as Partial<CvElement>)}
                className="mt-1 w-full text-xs border border-gray-200 rounded-md px-2 py-1"
              />
            </label>
            <label className="text-xs text-gray-600">
              H
              <input
                type="number"
                value={Math.round(selected.height)}
                onChange={(e) => onChange({ height: parseInt(e.target.value || "0", 10) } as Partial<CvElement>)}
                className="mt-1 w-full text-xs border border-gray-200 rounded-md px-2 py-1"
              />
            </label>
          </div>

          {selected.type === "text" && (
            <>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Text content</label>
                <textarea
                  value={selected.text}
                  onChange={(e) => onChange({ text: e.target.value } as Partial<CvElement>)}
                  className="w-full text-sm text-gray-900 border border-gray-200 rounded-md px-2 py-1.5 min-h-[60px] resize-y bg-white"
                  rows={3}
                  style={{ color: selected.color?.startsWith("#") ? selected.color : "#111827" }}
                />
              </div>
              <label className="text-xs text-gray-600 block">
                Text color
                <input
                  type="color"
                  value={selected.color.startsWith("#") ? selected.color : "#111827"}
                  onChange={(e) => onChange({ color: e.target.value } as Partial<CvElement>)}
                  className="mt-1 w-10 h-9 border border-gray-200 rounded"
                />
              </label>
              <label className="text-xs text-gray-600 block">
                Font size
                <input
                  type="number"
                  min={8}
                  max={72}
                  value={selected.fontSize}
                  onChange={(e) => onChange({ fontSize: parseInt(e.target.value || "12", 10) } as Partial<CvElement>)}
                  className="mt-1 w-full text-xs border border-gray-200 rounded-md px-2 py-1"
                />
              </label>
            </>
          )}

          {selected.type === "shape" && (
            <>
              <label className="text-xs text-gray-600 block">
                Fill
                <input
                  type="color"
                  value={selected.fill.startsWith("#") ? selected.fill : "#ffffff"}
                  onChange={(e) => onChange({ fill: e.target.value } as Partial<CvElement>)}
                  className="mt-1 w-10 h-9 border border-gray-200 rounded"
                />
              </label>
              <label className="text-xs text-gray-600 block">
                Border radius
                <input
                  type="number"
                  min={0}
                  max={500}
                  step={1}
                  value={Math.round(selected.borderRadius ?? 0)}
                  onChange={(e) =>
                    onChange({ borderRadius: parseInt(e.target.value || "0", 10) } as Partial<CvElement>)
                  }
                  className="mt-1 w-full text-xs border border-gray-200 rounded-md px-2 py-1"
                />
                <div className="text-[11px] text-gray-500">Enter px value (0–500)</div>
              </label>
            </>
          )}

          {selected.type === "image" && (
            <>
              <label className="text-xs text-gray-600 block">
                Rotation
                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={() =>
                      onChange({ rotation: ((selected.rotation || 0) - 15) % 360 } as Partial<CvElement>)
                    }
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-100"
                    title="Rotate left 15°"
                  >
                    <RotateCcw size={16} className="text-gray-700" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={Math.round(selected.rotation || 0)}
                    onChange={(e) =>
                      onChange({ rotation: parseFloat(e.target.value || "0") % 360 } as Partial<CvElement>)
                    }
                    className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1"
                  />
                  <span className="text-xs text-gray-500">°</span>
                  <button
                    onClick={() =>
                      onChange({ rotation: ((selected.rotation || 0) + 15) % 360 } as Partial<CvElement>)
                    }
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-100"
                    title="Rotate right 15°"
                  >
                    <RotateCw size={16} className="text-gray-700" />
                  </button>
                </div>
              </label>
              <label className="text-xs text-gray-600 block">
                Opacity
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round((selected.opacity ?? 1) * 100)}
                    onChange={(e) =>
                      onChange({ opacity: parseFloat(e.target.value) / 100 } as Partial<CvElement>)
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {Math.round((selected.opacity ?? 1) * 100)}%
                  </span>
                </div>
              </label>
            </>
          )}

          <button
            onClick={onDelete}
            className="w-full px-3 py-2 rounded-lg border border-red-100 text-red-600 text-sm hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

