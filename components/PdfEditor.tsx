"use client";

import React, { useRef, useState } from "react";
import { Download, Upload, Image as ImageIcon, X, Maximize2 } from "lucide-react";
import { CvDesigner } from "@/components/cv/CvDesigner";
import {
  extractTextFromPDF,
  pdfPointToHtmlPoint,
  saveModifiedPDF,
  TextItem,
  ImageItem,
} from "@/lib/pdf-utils";
import * as pdfjsLib from "pdfjs-dist";

type EditorMode = "pdf" | "cv";

type PdfEditorProps = {
  initialTemplate?: string;
  initialMode?: EditorMode;
};

const colorToHexForInput = (color: string | undefined | null): string => {
  if (!color || color === "transparent") return "#000000";

  // Already hex
  if (color.startsWith("#")) {
    // Normalize shorthand #rgb to #rrggbb
    if (color.length === 4) {
      const r = color[1];
      const g = color[2];
      const b = color[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (color.length === 7) return color.toLowerCase();
    return "#000000";
  }

  // rgb()/rgba()
  const m = color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (!m) return "#000000";
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  const r = toHex(parseInt(m[1], 10));
  const g = toHex(parseInt(m[2], 10));
  const b = toHex(parseInt(m[3], 10));
  return `#${r}${g}${b}`;
};

export default function PdfEditor({ initialTemplate, initialMode }: PdfEditorProps) {
  const [mode, setMode] = useState<EditorMode>(initialMode === "cv" ? "cv" : "pdf");

  const [items, setItems] = useState<TextItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Simple formatting toolbar state
  const [toolbarFontFamily, setToolbarFontFamily] = useState("Helvetica");
  const [toolbarFontSize, setToolbarFontSize] = useState(11);
  const [toolbarTextColor, setToolbarTextColor] = useState("#000000");
  const [toolbarBold, setToolbarBold] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isPdfMode = mode === "pdf";

  // 1. Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Extract Data
    const { items: extractedItems, width, height, originalPdfBytes } = await extractTextFromPDF(url);
    setItems(extractedItems);
    setPdfDimensions({ width, height });
    setOriginalPdfBytes(originalPdfBytes);

    // Render Background Canvas and detect actual background colors
    renderPdfBackground(url, extractedItems);
  };

  // 2. Render PDF to Canvas (Visual Background Only)
  const renderPdfBackground = async (url: string, currentItems?: TextItem[]) => {
    const loadingTask = (pdfjsLib as any).getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context!,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    if (context && currentItems) {
      detectBackgroundColors(context, currentItems, viewport.height);
    }
  };

  const detectBackgroundColors = (
    ctx: CanvasRenderingContext2D,
    itemsToColor: TextItem[],
    pageHeight: number
  ) => {
    const scale = 1.5;
    const updated = itemsToColor.map((item) => {
      const { x: htmlX, y: htmlY } = pdfPointToHtmlPoint(item.x, item.y, {
        scale,
        viewportHeight: pageHeight,
        fontSize: item.fontSize,
      });

      // Sample background color (slightly to the left/top of text)
      const bgSampleX = Math.max(Math.floor(htmlX - 5), 0);
      const bgSampleY = Math.max(Math.floor(htmlY), 0);

      // Sample text color (at the center of the text)
      const textSampleX = Math.max(Math.floor(htmlX + (item.width * scale) / 2), 0);
      const textSampleY = Math.max(Math.floor(htmlY + (item.fontSize * scale) / 2), 0);

      let backgroundColor = "transparent";
      let textColor = "#000000"; // Default to black

      try {
        // Get background color
        const bgPixel = ctx.getImageData(bgSampleX, bgSampleY, 1, 1).data;
        const bgR = bgPixel[0];
        const bgG = bgPixel[1];
        const bgB = bgPixel[2];
        const bgA = bgPixel[3] / 255;
        backgroundColor = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgA})`;

        // Get text color
        const textPixel = ctx.getImageData(textSampleX, textSampleY, 1, 1).data;
        const textR = textPixel[0];
        const textG = textPixel[1];
        const textB = textPixel[2];
        textColor = `rgb(${textR}, ${textG}, ${textB})`;

        // If text color is too close to background (e.g. white on white),
        // force it to black for better readability and editing.
        const diffR = Math.abs(textR - bgR);
        const diffG = Math.abs(textG - bgG);
        const diffB = Math.abs(textB - bgB);
        const isLowContrast = diffR < 40 && diffG < 40 && diffB < 40;
        if (isLowContrast) {
          textColor = "#000000";
        }
      } catch {
        // Fallback if sampling fails
        backgroundColor = "transparent";
        textColor = "#000000";
      }

      return { ...item, backgroundColor, textColor };
    });

    setItems(updated);
  };

  // Helper function to measure text width accurately
  const measureTextWidth = (text: string, fontSize: number, fontFamily: string, isBold: boolean): number => {
    if (!measureCanvasRef.current) {
      const canvas = document.createElement("canvas");
      measureCanvasRef.current = canvas;
    }
    const ctx = measureCanvasRef.current.getContext("2d");
    if (!ctx) return text.length * fontSize * 0.6; // Fallback estimate

    ctx.font = `${isBold ? "bold " : ""}${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  };

  // 3. Handle Text Updates
  const updateText = (id: string, newText: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText, hasChanged: true } : item))
    );
  };

  // Update selected text formatting
  const updateSelectedTextFormat = (updates: Partial<TextItem>) => {
    if (!selectedTextId) return;
    setItems((prev) =>
      prev.map((item) => (item.id === selectedTextId ? { ...item, ...updates, hasChanged: true } : item))
    );
  };

  // 4. Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fileUrl) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const imageBytes = new Uint8Array(arrayBuffer);
      const blobUrl = URL.createObjectURL(file);

      const scale = 1.5;
      const newImage: ImageItem = {
        id: crypto.randomUUID(),
        x: pdfDimensions.width / 2 - 50, // Center initially
        y: pdfDimensions.height / 2 - 50,
        width: 100 * scale,
        height: 100 * scale,
        imageData: blobUrl,
        imageBytes,
      };

      setImages((prev) => [...prev, newImage]);
      setSelectedImageId(newImage.id);
    };
    reader.readAsArrayBuffer(file);
  };

  // 5. Handle Image Resize
  const handleImageResize = (id: string, newWidth: number, newHeight: number) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, width: newWidth, height: newHeight } : img))
    );
  };

  // 6. Handle Image Delete
  const handleImageDelete = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.imageData) URL.revokeObjectURL(img.imageData);
      return prev.filter((i) => i.id !== id);
    });
    if (selectedImageId === id) setSelectedImageId(null);
  };

  // 7. Handle Image Drag
  const handleImageMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setSelectedImageId(id);
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedImageId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragStart.x;
    const newY = e.clientY - canvasRect.top - dragStart.y;

    setImages((prev) =>
      prev.map((img) =>
        img.id === selectedImageId
          ? {
              ...img,
              x: Math.max(0, Math.min(newX, pdfDimensions.width - img.width)),
              y: Math.max(0, Math.min(newY, pdfDimensions.height - img.height)),
            }
          : img
      )
    );
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  // 8. Save & Download
  const handleDownload = async () => {
    if (!originalPdfBytes) return;
    // Convert image positions from screen (scaled, top-left) to PDF coordinates (unscaled, bottom-left)
    const scale = 1.5;
    const imagesForPdf = images.map((img) => {
      const x = img.x / scale;
      const y = (pdfDimensions.height - (img.y + img.height)) / scale; // bottom-left origin
      const width = img.width / scale;
      const height = img.height / scale;
      return { ...img, x, y, width, height };
    });

    const modifiedPdfBytes = await saveModifiedPDF(originalPdfBytes, items, imagesForPdf);
    // Convert Uint8Array to ArrayBuffer to avoid TypeScript type issues with pdf-lib
    const arrayBuffer = modifiedPdfBytes.buffer instanceof ArrayBuffer
      ? modifiedPdfBytes.buffer.slice(modifiedPdfBytes.byteOffset, modifiedPdfBytes.byteOffset + modifiedPdfBytes.byteLength)
      : new Uint8Array(modifiedPdfBytes).buffer;
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited-document.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#020617] flex flex-col">
      {/* Top App Bar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-slate-50">Editor</div>
          <div className="h-6 w-px bg-slate-700/80" />
          <div className="inline-flex rounded-lg bg-white/5 p-1 ring-1 ring-slate-700/70">
            <button
              onClick={() => setMode("pdf")}
              className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-semibold rounded-md ${
                isPdfMode ? "bg-teal-500 text-slate-950 shadow-sm" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              PDF editor
            </button>
            <button
              onClick={() => setMode("cv")}
              className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-semibold rounded-md ${
                !isPdfMode ? "bg-teal-500 text-slate-950 shadow-sm" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              CV designer (Canva style)
            </button>
          </div>
        </div>
        <div className="text-xs text-slate-300/80">Build resumes faster with AI & precise PDF editing.</div>
      </header>

      {/* PDF EDITOR MODE */}
      {isPdfMode && (
        <>
          {/* File Toolbar */}
          <div className="bg-white/90 border border-slate-800/60 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 w-full max-w-5xl items-center px-4 py-3 mx-auto">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-slate-950 rounded-lg cursor-pointer hover:bg-teal-400 shadow-sm text-sm font-semibold">
                <Upload size={16} />
                Upload PDF
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
              </label>
              {fileUrl && (
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-teal-100 rounded-lg cursor-pointer hover:bg-slate-800 shadow-sm text-sm font-semibold">
                  <ImageIcon size={16} />
                  Add Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <div className="flex-1" />
            <button
              onClick={handleDownload}
              disabled={!fileUrl}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 disabled:opacity-50 shadow-sm text-sm font-semibold"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>

          {/* Formatting Toolbar (shown when some text is focused) */}
          {fileUrl && selectedTextId && (
            <div className="bg-white/95 border border-slate-800/60 rounded-xl shadow-sm mb-4 flex items-center gap-3 w-full max-w-5xl px-3 py-2 mx-auto">
              {/* Font family */}
              <select
                value={toolbarFontFamily}
                onChange={(e) => {
                  const value = e.target.value;
                  setToolbarFontFamily(value);
                  // Map to a reasonable CSS stack
                  let family = "";
                  if (value === "Times New Roman") {
                    family = '"Times New Roman", Times, serif';
                  } else if (value === "Courier New") {
                    family = '"Courier New", Courier, monospace';
                  } else {
                    family = `${value}, Arial, Helvetica, sans-serif`;
                  }
                  updateSelectedTextFormat({
                    fontName: value,
                    fontFamily: family,
                  });
                }}
                className="px-2 py-1 border border-slate-300 rounded text-sm bg-white text-slate-900"
              >
                <option value="Helvetica">Helvetica</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>

              {/* Font size */}
              <input
                type="number"
                min={6}
                max={72}
                value={toolbarFontSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value || "0", 10) || 11;
                  setToolbarFontSize(size);
                  updateSelectedTextFormat({ fontSize: size });
                }}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-sm bg-white text-slate-900"
              />

              {/* Bold toggle */}
              <button
                onClick={() => {
                  const nextBold = !toolbarBold;
                  setToolbarBold(nextBold);
                  updateSelectedTextFormat({ isBold: nextBold });
                }}
                className={`px-2 py-1 rounded text-sm font-bold border ${
                  toolbarBold
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                }`}
              >
                B
              </button>

              {/* Text color */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-700">Text color</span>
                <input
                  type="color"
                  value={toolbarTextColor}
                  onChange={(e) => {
                    const hex = e.target.value;
                    setToolbarTextColor(hex);
                    // Convert hex to rgb() string to stay compatible with saver
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    const rgb = `rgb(${r}, ${g}, ${b})`;
                    updateSelectedTextFormat({ textColor: rgb });
                  }}
                  className="w-8 h-8 border border-slate-300 rounded cursor-pointer bg-white"
                />
              </div>
            </div>
          )}

          {/* Editor Area */}
          {fileUrl && (
            <div className="w-full overflow-auto flex justify-center px-2">
              <div className="relative inline-block shadow-xl border border-gray-300 bg-white">
                {/* Layer A: Canvas (Visuals) */}
                <canvas ref={canvasRef} className="block" />

                {/* Layer B: Inputs (Editable) with sampled background + native look */}
                {items.map((item) => {
                  const scale = 1.5;
                  const { x: htmlX, y: htmlY } = pdfPointToHtmlPoint(item.x, item.y, {
                    scale,
                    viewportHeight: pdfDimensions.height,
                    fontSize: item.fontSize,
                  });

                  // Calculate accurate text width using canvas measurement
                  const scaledFontSize = item.fontSize * scale;
                  // Extract first font name from fontFamily string (e.g., "Arial, Helvetica" -> "Arial")
                  let fontFamilyForMeasure = item.fontName || "Arial";
                  if (!item.fontName && item.fontFamily) {
                    const firstFont = item.fontFamily.split(",")[0].trim().replace(/['"]/g, "");
                    fontFamilyForMeasure = firstFont || "Arial";
                  }
                  const measuredWidth = measureTextWidth(item.text, scaledFontSize, fontFamilyForMeasure, item.isBold);

                  // Use the larger of: original width, measured text width, or minimum 10px
                  // Add some padding (20px) for better UX
                  const baseWidth = item.width * scale;
                  const effectiveWidth = Math.max(baseWidth, measuredWidth + 20, 10);

                  const activeBgColor = item.backgroundColor || "transparent";
                  // Use detected text color from PDF, fallback to black
                  const activeTextColor =
                    item.textColor && item.textColor !== "transparent" ? item.textColor : "#000000";

                  // 2. Ghosting fix: keep opaque bg only when text changed
                  const showBackground = item.hasChanged;

                  return (
                    <input
                      key={item.id}
                      value={item.text}
                      onChange={(e) => updateText(item.id, e.target.value)}
                      onFocus={(e) => {
                        // Track selection for toolbar
                        setSelectedTextId(item.id);
                        setToolbarFontFamily(item.fontName || "Helvetica");
                        setToolbarFontSize(Math.round(item.fontSize));
                        setToolbarTextColor(colorToHexForInput(item.textColor));
                        setToolbarBold(!!item.isBold);

                        e.target.style.backgroundColor = activeBgColor;
                        e.target.style.outline = "2px solid #3b82f6";
                        e.target.style.zIndex = "50";
                        e.target.style.color = activeTextColor;
                      }}
                      onBlur={(e) => {
                        e.target.style.outline = "none";
                        e.target.style.zIndex = "20";

                        if (!item.hasChanged) {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "transparent";
                        } else {
                          // Keep the detected text color when changed
                          e.target.style.color = activeTextColor;
                        }
                      }}
                      style={{
                        position: "absolute",
                        left: `${htmlX}px`,
                        top: `${htmlY}px`,
                        width: `${effectiveWidth}px`,
                        height: `${item.fontSize * scale * 1.25}px`,

                        // Font styles from PDF - EXACT MATCHING
                        fontSize: `${item.fontSize * scale}px`, // Exact size from PDF
                        // Try the specific PDF font name first, then fall back to mapped family
                        fontFamily: item.fontName
                          ? `"${item.fontName}", ${item.fontFamily || "Arial, Helvetica, sans-serif"}`
                          : item.fontFamily || "Arial, Helvetica, sans-serif",
                        fontWeight: item.isBold ? "bold" : "normal", // Exact weight from PDF
                        fontStyle: item.isItalic ? "italic" : "normal", // Exact style from PDF

                        // Visual trickery with detected colors
                        backgroundColor: showBackground ? activeBgColor : "transparent",
                        color: showBackground ? activeTextColor : "transparent", // Exact color from PDF

                        // Strip browser defaults
                        border: "none",
                        outline: "none",
                        padding: 0,
                        margin: 0,
                        backgroundClip: "padding-box",
                        cursor: "text",
                        zIndex: 20,
                      }}
                      className="focus:text-black transition-colors"
                    />
                  );
                })}

                {/* Layer C: Images (Editable) */}
                {images.map((image) => {
                  const isSelected = selectedImageId === image.id;
                  return (
                    <div
                      key={image.id}
                      onMouseDown={(e) => handleImageMouseDown(e, image.id)}
                      onMouseMove={handleImageMouseMove}
                      onMouseUp={handleImageMouseUp}
                      onMouseLeave={handleImageMouseUp}
                      style={{
                        position: "absolute",
                        left: `${image.x}px`,
                        top: `${image.y}px`,
                        width: `${image.width}px`,
                        height: `${image.height}px`,
                        cursor: isDragging && isSelected ? "grabbing" : "grab",
                        zIndex: isSelected ? 30 : 15,
                        border: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
                        boxSizing: "border-box",
                      }}
                      className="group"
                    >
                      <img
                        src={image.imageData}
                        alt="PDF Image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          pointerEvents: "none",
                        }}
                      />
                      {isSelected && (
                        <div className="absolute -top-8 left-0 flex gap-1 bg-white rounded shadow-lg p-1">
                          <button
                            onClick={() => handleImageResize(image.id, image.width * 1.1, image.height * 1.1)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Resize Larger"
                          >
                            <Maximize2 size={14} />
                          </button>
                          <button
                            onClick={() => handleImageResize(image.id, image.width * 0.9, image.height * 0.9)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Resize Smaller"
                          >
                            <Maximize2 size={14} className="rotate-180" />
                          </button>
                          <button
                            onClick={() => handleImageDelete(image.id)}
                            className="p-1 hover:bg-red-200 rounded text-red-600"
                            title="Delete Image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* CV DESIGNER MODE */}
      {!isPdfMode && <CvDesigner initialTemplate={initialTemplate} />}
    </div>
  );
}

