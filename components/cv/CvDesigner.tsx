"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { CvDocument, CvElement, CvPageSize } from "@/lib/cv-model";
import { PAGE_DIMENSIONS, newDocument } from "@/lib/cv-model";
import { downloadPdfBytes, exportCvToPdf } from "@/lib/cv-export";
import { LeftPanel } from "./LeftPanel";
import { TopToolbar } from "./TopToolbar";
import { CanvasStage } from "./CanvasStage";
import { RightInspector } from "./RightInspector";
import { makeModernTemplate } from "@/lib/cv-templates";
import { MobileDrawer } from "@/components/ui/MobileDrawer";
import { MobileSheet } from "@/components/ui/MobileSheet";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { PanelLeft, SlidersHorizontal } from "lucide-react";

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
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);
  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const userZoomedRef = useRef(false);

  const page = doc.pages[currentPageIndex] || doc.pages[0];
  const pageDims = PAGE_DIMENSIONS[doc.pageSize];

  // Auto-fit zoom on mobile so the page stays inside the viewport.
  useEffect(() => {
    if (!isMobile) {
      userZoomedRef.current = false;
      return;
    }

    // Entering mobile: allow auto-fit again.
    userZoomedRef.current = false;
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const computeFit = () => {
      if (userZoomedRef.current) return;
      const host = stageWrapRef.current;
      if (!host) return;

      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;

      // CanvasStage adds padding (mobile ~12px each side with p-3)
      const padX = 24;
      const padY = 24;
      const fitW = (w - padX) / pageDims.width;
      const fitH = (h - padY) / pageDims.height;
      const next = Math.max(0.25, Math.min(1, Math.min(fitW, fitH)));
      const rounded = Math.round(next * 100) / 100;

      setZoom((prev) => (Math.abs(prev - rounded) > 0.01 ? rounded : prev));
    };

    computeFit();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && stageWrapRef.current) {
      ro = new ResizeObserver(() => computeFit());
      ro.observe(stageWrapRef.current);
    } else {
      window.addEventListener("resize", computeFit);
    }

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", computeFit);
    };
  }, [isMobile, pageDims.width, pageDims.height]);

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
        onChangeZoom={(z) => {
          userZoomedRef.current = true;
          setZoom(z);
        }}
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

      <div className="flex h-[calc(100vh-6rem)] min-w-0">
        {!isMobile && (
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
        )}

        <div ref={stageWrapRef} className={`flex-1 min-w-0 relative ${isMobile ? "pb-16" : ""}`}>
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
          {isMobile && page.elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center px-6 py-4 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 pointer-events-auto">
                <p className="text-sm font-medium text-gray-700 mb-1">Start building your CV</p>
                <p className="text-xs text-gray-500 mb-3">Tap <strong>Tools</strong> below to add text, shapes, or choose a template</p>
                <button
                  type="button"
                  onClick={() => { setMobileLeftOpen(true); setMobilePropsOpen(false); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                >
                  <PanelLeft size={16} />
                  Open Tools
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel – only show when an element is selected */}
        {!isMobile && selectedId && (
          <div className="shrink-0">
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
                const page = newPages[currentPageIndex];
                const el = page.elements.find((e) => e.id === selectedId);
                const merged = el ? ({ ...el, ...updates } as CvElement) : null;
                const final =
                  merged?.type === "text" && ("text" in updates || "fontSize" in updates)
                    ? { ...merged, height: computeAutoHeight(merged.text, merged.fontSize) }
                    : merged;
                newPages[currentPageIndex] = {
                  ...page,
                  elements: page.elements.map((e) => (e.id === selectedId && final ? final : e)),
                };
                return { ...prev, pages: newPages };
              });
            }}
            />
          </div>
        )}
      </div>

      {isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2 flex items-center gap-2"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
        >
          <button
            type="button"
            onClick={() => {
              setMobileLeftOpen(true);
              setMobilePropsOpen(false);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-sm font-semibold whitespace-nowrap"
            title="Open tools"
          >
            <PanelLeft size={16} />
            Tools
          </button>
          <button
            type="button"
            onClick={() => {
              setMobilePropsOpen(true);
              setMobileLeftOpen(false);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-sm font-semibold whitespace-nowrap"
            title="Open properties"
          >
            <SlidersHorizontal size={16} />
            Properties
          </button>
          <div className="flex-1" />
          {selectedElement && (
            <div className="text-xs text-gray-600 truncate">
              Selected: <span className="font-semibold text-gray-900">{selectedElement.type}</span>
            </div>
          )}
        </div>
      )}

      {isMobile && (
        <>
          <MobileDrawer open={mobileLeftOpen} onClose={() => setMobileLeftOpen(false)} ariaLabel="Tools">
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
                const last = elements[elements.length - 1];
                if (last) setSelectedId(last.id);
              }}
              watermark={watermark}
              onWatermarkChange={setWatermark}
            />
          </MobileDrawer>

          <MobileSheet open={mobilePropsOpen} onClose={() => setMobilePropsOpen(false)} ariaLabel="Properties">
            <RightInspector
              variant="sheet"
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
                  const page = newPages[currentPageIndex];
                  const el = page.elements.find((e) => e.id === selectedId);
                  const merged = el ? ({ ...el, ...updates } as CvElement) : null;
                  const final =
                    merged?.type === "text" && "text" in updates
                      ? { ...merged, height: computeAutoHeight(merged.text, merged.fontSize) }
                      : merged;
                  newPages[currentPageIndex] = {
                    ...page,
                    elements: page.elements.map((e) => (e.id === selectedId && final ? final : e)),
                  };
                  return { ...prev, pages: newPages };
                });
              }}
            />
          </MobileSheet>
        </>
      )}
    </div>
  );
}

