"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { CvDocument, CvElement, CvPageSize } from "@/lib/cv-model";
import { PAGE_DIMENSIONS, newDocument } from "@/lib/cv-model";
import { downloadPdfBytes, exportCvToPdf } from "@/lib/cv-export";
import { LeftPanel } from "./LeftPanel";
import { TopToolbar } from "./TopToolbar";
import { CanvasStage } from "./CanvasStage";
import { RightInspector } from "./RightInspector";
import { makeModernTemplate } from "@/lib/cv-templates";

export type LeftTab = "text" | "elements" | "templates" | "emojis" | "settings";

type CvDesignerProps = {
  initialTemplate?: string;
};

function computeAutoHeight(text: string, fontSize: number) {
  const lineHeight = fontSize * 1.35;
  const lines = Math.max(1, text.split("\n").length);
  const paddingY = 8; // px (matches px-2 py-1-ish)
  return Math.ceil(lines * lineHeight + paddingY);
}

export function CvDesigner({ initialTemplate }: CvDesignerProps) {
  const [doc, setDoc] = useState<CvDocument>(() => newDocument("A4"));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<LeftTab>("text");
  const [zoom, setZoom] = useState(1);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const page = doc.pages[currentPageIndex] || doc.pages[0];
  const pageDims = PAGE_DIMENSIONS[doc.pageSize];

  const selectedElement: CvElement | null = useMemo(() => {
    if (!selectedId) return null;
    return page.elements.find((e) => e.id === selectedId) ?? null;
  }, [page.elements, selectedId]);

  const setPageSize = (pageSize: CvPageSize) => {
    setDoc((prev) => ({ ...prev, pageSize }));
    setSelectedId(null);
  };

  const clearCanvas = () => {
    setDoc((prev) => {
      const newPages = [...prev.pages];
      newPages[currentPageIndex] = { ...newPages[currentPageIndex], elements: [] };
      return { ...prev, pages: newPages };
    });
    setSelectedId(null);
  };

  const addPage = () => {
    setDoc((prev) => ({
      ...prev,
      pages: [...prev.pages, { id: crypto.randomUUID(), elements: [] }],
    }));
    setCurrentPageIndex(doc.pages.length);
    setSelectedId(null);
  };

  const removePage = (index: number) => {
    if (doc.pages.length <= 1) return; // Don't allow removing the last page
    setDoc((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index),
    }));
    // Adjust current page index if needed
    if (currentPageIndex >= doc.pages.length - 1) {
      setCurrentPageIndex(Math.max(0, doc.pages.length - 2));
    } else if (currentPageIndex > index) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
    setSelectedId(null);
  };

  // Watermark state
  const [watermark, setWatermark] = useState<{
    enabled: boolean;
    text: string;
    fontSize: number;
    opacity: number;
    rotation: number;
    position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";
    color: string;
  }>({
    enabled: false,
    text: "CONFIDENTIAL",
    fontSize: 48,
    opacity: 0.3,
    rotation: -45,
    position: "diagonal",
    color: "#808080",
  });

  const handleExportPdf = async () => {
    const bytes = await exportCvToPdf(doc, pageDims.width, pageDims.height, watermark);
    downloadPdfBytes(bytes, "cv.pdf");
  };

  // Prefill with modern template for demo entrypoints
  useEffect(() => {
    if (!initialTemplate || initialTemplate !== "modern") return;
    setDoc((prev) => {
      const current = prev.pages[0];
      if (current.elements.length > 0) return prev;
      const elements = makeModernTemplate(prev.pageSize);
      const newPages = [...prev.pages];
      newPages[0] = { ...current, elements };
      return { ...prev, pages: newPages };
    });
  }, [initialTemplate]);

  const stripKnownListPrefix = (line: string) => {
    // Remove common list prefixes to re-apply cleanly
    return line
      .replace(/^\s*•\s+/, "")
      .replace(/^\s*\d+[\.\)]\s+/, "")
      .replace(/^\s*[IVXLCDM]+[\.\)]\s+/i, "")
      .replace(/^\s*[A-Z][\.\)]\s+/, "")
      .replace(/^\s*[a-z][\.\)]\s+/, "");
  };

  const toRoman = (n: number) => {
    const map: Array<[number, string]> = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];
    let num = Math.max(1, Math.floor(n));
    let out = "";
    for (const [v, s] of map) {
      while (num >= v) {
        out += s;
        num -= v;
      }
    }
    return out;
  };

  const alpha = (n: number, upper: boolean) => {
    // 1 -> A, 2 -> B ... 26 -> Z, 27 -> AA ...
    let num = Math.max(1, Math.floor(n));
    let out = "";
    while (num > 0) {
      num -= 1;
      out = String.fromCharCode(65 + (num % 26)) + out;
      num = Math.floor(num / 26);
    }
    return upper ? out : out.toLowerCase();
  };

  const listPrefix = (style: any, index: number) => {
    switch (style) {
      case "bullet":
        return "• ";
      case "number":
        return `${index}. `;
      case "upper_roman":
        return `${toRoman(index)}. `;
      case "lower_roman":
        return `${toRoman(index).toLowerCase()}. `;
      case "upper_alpha":
        return `${alpha(index, true)}. `;
      case "lower_alpha":
        return `${alpha(index, false)}. `;
      default:
        return "";
    }
  };

  const applyListStyleToText = (text: string, style: any) => {
    if (!style || style === "none") return text;
    const lines = text.split("\n");
    let i = 0;
    return lines
      .map((ln) => {
        const raw = stripKnownListPrefix(ln);
        if (!raw.trim()) return raw;
        i += 1;
        return `${listPrefix(style, i)}${raw}`;
      })
      .join("\n");
  };

  return (
    <div className="w-full min-h-[calc(100vh-2rem)] bg-[#F3F4F6] rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <TopToolbar
        pageSize={doc.pageSize}
        onChangePageSize={setPageSize}
        zoom={zoom}
        onChangeZoom={setZoom}
        selected={selectedElement}
        onChangeSelected={(updates) => {
          if (!selectedId) return;
          setDoc((prev) => {
            const newPages = [...prev.pages];
            newPages[currentPageIndex] = {
              ...newPages[currentPageIndex],
              elements: newPages[currentPageIndex].elements.map((el) => {
                if (el.id !== selectedId) return el;
                if (el.type !== "text") return ({ ...el, ...updates } as CvElement);

                // If list style changes, rewrite the text prefixes so Enter auto-continues nicely.
                const nextEl = { ...el, ...updates } as any;
                if (Object.prototype.hasOwnProperty.call(updates, "listStyle")) {
                  nextEl.text = applyListStyleToText(el.text, (updates as any).listStyle);
                }
                
                // Recalculate height if fontSize or text changes
                if (Object.prototype.hasOwnProperty.call(updates, "fontSize") || Object.prototype.hasOwnProperty.call(updates, "text")) {
                  const newText = nextEl.text !== undefined ? nextEl.text : el.text;
                  const newFontSize = nextEl.fontSize !== undefined ? nextEl.fontSize : el.fontSize;
                  nextEl.height = computeAutoHeight(newText, newFontSize);
                }
                
                return nextEl as CvElement;
              }),
            };
            return { ...prev, pages: newPages };
          });
        }}
        onExportPdf={handleExportPdf}
        currentPageIndex={currentPageIndex}
        totalPages={doc.pages.length}
        onPageChange={setCurrentPageIndex}
        onAddPage={addPage}
        onRemovePage={() => removePage(currentPageIndex)}
      />

      <div className="flex h-[calc(100vh-6rem)]">
        <LeftPanel
          tab={leftTab}
          onChangeTab={setLeftTab}
          onClearCanvas={clearCanvas}
          onApplyTemplate={(elements) => {
            setDoc((prev) => {
              const newPages = [...prev.pages];
              newPages[currentPageIndex] = { ...newPages[currentPageIndex], elements };
              return { ...prev, pages: newPages };
            });
            setSelectedId(null);
          }}
          onAddElements={(elements) => {
            setDoc((prev) => {
              const newPages = [...prev.pages];
              newPages[currentPageIndex] = {
                ...newPages[currentPageIndex],
                elements: [...newPages[currentPageIndex].elements, ...elements],
              };
              return { ...prev, pages: newPages };
            });
            // select last added (topmost)
            const last = elements[elements.length - 1];
            if (last) setSelectedId(last.id);
          }}
          watermark={watermark}
          onWatermarkChange={setWatermark}
        />

        <CanvasStage
          pageSize={doc.pageSize}
          elements={page.elements}
          selectedId={selectedId}
          zoom={zoom}
          onSelect={setSelectedId}
          onChangeElements={(next) => {
            setDoc((prev) => {
              const newPages = [...prev.pages];
              newPages[currentPageIndex] = { ...newPages[currentPageIndex], elements: next };
              return { ...prev, pages: newPages };
            });
          }}
        />

        <RightInspector
          selected={selectedElement}
          onDelete={() => {
            if (!selectedId) return;
            setDoc((prev) => {
              const newPages = [...prev.pages];
              newPages[currentPageIndex] = {
                ...newPages[currentPageIndex],
                elements: newPages[currentPageIndex].elements.filter((e) => e.id !== selectedId),
              };
              return { ...prev, pages: newPages };
            });
            setSelectedId(null);
          }}
          onChange={(updates) => {
            if (!selectedId) return;
            setDoc((prev) => {
              const newPages = [...prev.pages];
              newPages[currentPageIndex] = {
                ...newPages[currentPageIndex],
                elements: newPages[currentPageIndex].elements.map((el) =>
                  el.id === selectedId ? ({ ...el, ...updates } as CvElement) : el
                ),
              };
              return { ...prev, pages: newPages };
            });
          }}
        />
      </div>
    </div>
  );
}

