"use client";

import React, { useRef, useState, useEffect } from "react";
import { Download, Upload, Image as ImageIcon, X, Maximize2 } from "lucide-react";
import { CvDesigner } from "@/components/cv/CvDesigner";
import { PdfLeftPanel } from "@/components/PdfLeftPanel";
import { PdfRightInspector } from "@/components/PdfRightInspector";
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
  const [leftTab, setLeftTab] = useState<"upload" | "text" | "images" | "emojis" | "tools">("upload");

  const [items, setItems] = useState<TextItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, imageX: 0, imageY: 0 });
  const [resizeDirection, setResizeDirection] = useState<string>("");

  // Simple formatting toolbar state
  const [toolbarFontFamily, setToolbarFontFamily] = useState("Helvetica");
  const [toolbarFontSize, setToolbarFontSize] = useState(11);
  const [toolbarTextColor, setToolbarTextColor] = useState("#000000");
  const [toolbarBold, setToolbarBold] = useState(false);

  // File input refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isPdfMode = mode === "pdf";

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

  // Re-render PDF when switching back to PDF mode
  useEffect(() => {
    if (isPdfMode && fileUrl && items.length > 0) {
      // Wait for canvas to be available in DOM, then re-render
      let attempts = 0;
      const maxAttempts = 20; // Max 1 second wait
      const checkAndRender = () => {
        if (canvasRef.current) {
          renderPdfBackground(fileUrl, items);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkAndRender, 50);
        }
      };
      const timer = setTimeout(checkAndRender, 50);
      return () => clearTimeout(timer);
    }
  }, [isPdfMode, fileUrl]); // Re-run when mode or fileUrl changes

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

  // 9. Handle Emoji Addition
  const handleAddEmoji = (emoji: string, screenX: number, screenY: number) => {
    if (!fileUrl || !pdfDimensions.width || !canvasRef.current) return;
    
    const scale = 1.5;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Get relative position within canvas
    const relativeX = screenX - canvasRect.left;
    const relativeY = screenY - canvasRect.top;
    
    // Ensure we're within canvas bounds
    if (relativeX < 0 || relativeY < 0 || relativeX > canvasRect.width || relativeY > canvasRect.height) {
      return;
    }
    
    // Convert HTML coordinates (top-left origin) to PDF coordinates (bottom-left origin)
    // PDF uses bottom-left, so we need to invert Y
    const fontSize = 36; // Larger size for better visibility
    const pdfX = relativeX / scale;
    const htmlY = relativeY;
    const viewportHeight = pdfDimensions.height * scale;
    // Reverse the pdfPointToHtmlPoint formula: htmlY = viewportHeight - pdfY * scale - fontSize * scale
    // So: pdfY = (viewportHeight - htmlY - fontSize * scale) / scale
    const pdfY = (viewportHeight - htmlY - fontSize * scale) / scale;
    
    const newTextItem: TextItem = {
      id: crypto.randomUUID(),
      text: emoji,
      x: Math.max(0, Math.min(pdfX, pdfDimensions.width - 50)), // Ensure within bounds
      y: Math.max(0, Math.min(pdfY, pdfDimensions.height - 50)), // Ensure within bounds
      width: 50, // Wider for better visibility
      fontSize: fontSize,
      fontName: "Arial",
      fontFamily: "Arial, Helvetica, sans-serif",
      isBold: false,
      isItalic: false,
      textColor: "rgb(0, 0, 0)",
      backgroundColor: "transparent",
      hasChanged: true,
    };
    
    setItems((prev) => [...prev, newTextItem]);
    setSelectedTextId(newTextItem.id);
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

  // Handle corner resize
  const handleCornerResize = (e: React.MouseEvent, id: string, direction: "nw" | "ne" | "sw" | "se") => {
    e.preventDefault();
    e.stopPropagation();
    const image = images.find((img) => img.id === id);
    if (!image || !canvasRef.current) return;

    setSelectedImageId(id);
    setIsResizing(true);
    setResizeDirection(direction);
    const canvasRect = canvasRef.current.getBoundingClientRect();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: image.width,
      height: image.height,
      imageX: image.x,
      imageY: image.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!canvasRef.current) return;
      const start = resizeStartRef.current;
      const deltaX = (moveEvent.clientX - start.x) / 1.5; // Account for scale
      const deltaY = (moveEvent.clientY - start.y) / 1.5;

      let newWidth = start.width;
      let newHeight = start.height;
      let newX = start.imageX;
      let newY = start.imageY;

      const minSize = 20;
      const maxWidth = pdfDimensions.width - start.imageX;
      const maxHeight = pdfDimensions.height - start.imageY;

      switch (direction) {
        case "nw":
          newWidth = Math.max(minSize, Math.min(maxWidth, start.width - deltaX));
          newHeight = Math.max(minSize, Math.min(maxHeight, start.height - deltaY));
          newX = start.imageX + (start.width - newWidth);
          newY = start.imageY + (start.height - newHeight);
          break;
        case "ne":
          newWidth = Math.max(minSize, Math.min(maxWidth, start.width + deltaX));
          newHeight = Math.max(minSize, Math.min(maxHeight, start.height - deltaY));
          newY = start.imageY + (start.height - newHeight);
          break;
        case "sw":
          newWidth = Math.max(minSize, Math.min(maxWidth, start.width - deltaX));
          newHeight = Math.max(minSize, Math.min(maxHeight, start.height + deltaY));
          newX = start.imageX + (start.width - newWidth);
          break;
        case "se":
          newWidth = Math.max(minSize, Math.min(maxWidth, start.width + deltaX));
          newHeight = Math.max(minSize, Math.min(maxHeight, start.height + deltaY));
          break;
      }

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                width: Math.max(minSize, newWidth),
                height: Math.max(minSize, newHeight),
                x: Math.max(0, newX),
                y: Math.max(0, newY),
              }
            : img
        )
      );
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection("");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSideResize = (e: React.MouseEvent, id: string, direction: "n" | "s" | "e" | "w") => {
    e.preventDefault();
    e.stopPropagation();
    const image = images.find((img) => img.id === id);
    if (!image || !canvasRef.current) return;

    setSelectedImageId(id);
    setIsResizing(true);
    setResizeDirection(direction);
    const canvasRect = canvasRef.current.getBoundingClientRect();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: image.width,
      height: image.height,
      imageX: image.x,
      imageY: image.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!canvasRef.current) return;
      const start = resizeStartRef.current;
      const deltaX = (moveEvent.clientX - start.x) / 1.5;
      const deltaY = (moveEvent.clientY - start.y) / 1.5;

      let newWidth = start.width;
      let newHeight = start.height;
      let newX = start.imageX;
      let newY = start.imageY;

      const minSize = 20;

      switch (direction) {
        case "n":
          newHeight = Math.max(minSize, start.height - deltaY);
          newY = start.imageY + (start.height - newHeight);
          break;
        case "s":
          newHeight = Math.max(minSize, start.height + deltaY);
          break;
        case "w":
          newWidth = Math.max(minSize, start.width - deltaX);
          newX = start.imageX + (start.width - newWidth);
          break;
        case "e":
          newWidth = Math.max(minSize, start.width + deltaX);
          break;
      }

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                width: Math.max(minSize, newWidth),
                height: Math.max(minSize, newHeight),
                x: Math.max(0, newX),
                y: Math.max(0, newY),
              }
            : img
        )
      );
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection("");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
    if ((!isDragging || isResizing) || !selectedImageId || !canvasRef.current) return;

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
          {/* Hidden file inputs */}
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Top Toolbar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
            <div className="text-sm font-semibold text-gray-900">PDF Editor</div>
            <div className="h-6 w-px bg-gray-200" />
            <button
              onClick={handleDownload}
              disabled={!fileUrl}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>

          {/* Main Editor Layout */}
          <div className="flex h-[calc(100vh-6rem)]">
            {/* Left Panel */}
            <PdfLeftPanel
              tab={leftTab}
              onChangeTab={setLeftTab}
              onUploadPdf={handleFileUpload}
              onAddImage={handleImageUpload}
              onAddEmoji={handleAddEmoji}
              fileUrl={fileUrl}
            />

            {/* Canvas Area */}
            {fileUrl && (
              <div 
                className="flex-1 overflow-auto flex justify-center px-2 bg-gray-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const canvasRect = canvasRef.current?.getBoundingClientRect();
                  if (!canvasRect) return;
                  
                  const data = e.dataTransfer.getData("application/json");
                  if (!data) return;
                  
                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === "emoji") {
                      handleAddEmoji(parsed.value || "😀", e.clientX, e.clientY);
                    }
                  } catch (err) {
                    console.error("Failed to parse drop data", err);
                  }
                }}
              >
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
                      onMouseDown={(e) => {
                        // Don't start drag if clicking on resize handle
                        if ((e.target as HTMLElement).classList.contains("resize-handle")) {
                          return;
                        }
                        handleImageMouseDown(e, image.id);
                      }}
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
                          userSelect: "none",
                        }}
                        draggable={false}
                      />
                      {isSelected && (
                        <>
                          {/* Corner Resize Handles */}
                          <div
                            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nwse-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "nw");
                            }}
                            title="Resize (top-left)"
                          />
                          <div
                            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nesw-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "ne");
                            }}
                            title="Resize (top-right)"
                          />
                          <div
                            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nesw-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "sw");
                            }}
                            title="Resize (bottom-left)"
                          />
                          <div
                            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nwse-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "se");
                            }}
                            title="Resize (bottom-right)"
                          />
                          
                          {/* Side Resize Handles */}
                          <div
                            className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ns-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "n");
                            }}
                            title="Resize (top)"
                          />
                          <div
                            className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ns-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "s");
                            }}
                            title="Resize (bottom)"
                          />
                          <div
                            className="resize-handle absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ew-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "w");
                            }}
                            title="Resize (left)"
                          />
                          <div
                            className="resize-handle absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ew-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "e");
                            }}
                            title="Resize (right)"
                          />
                          
                          {/* Control Toolbar - Positioned below image */}
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageResize(image.id, image.width * 1.1, image.height * 1.1);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Enlarge (10%)"
                            >
                              <Maximize2 size={16} className="text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageResize(image.id, image.width * 0.9, image.height * 0.9);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Shrink (10%)"
                            >
                              <Maximize2 size={16} className="rotate-180 text-gray-700" />
                            </button>
                            <div className="w-px bg-gray-300 mx-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageDelete(image.id);
                              }}
                              className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-600"
                              title="Delete Image"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                  })}
                </div>
              </div>
            )}

            {/* Right Panel */}
            <PdfRightInspector
              selectedText={selectedTextId ? items.find((i) => i.id === selectedTextId) || null : null}
              selectedImage={selectedImageId ? images.find((i) => i.id === selectedImageId) || null : null}
              onUpdateText={(updates) => {
                if (selectedTextId) {
                  updateSelectedTextFormat(updates);
                }
              }}
              onUpdateImage={(updates) => {
                if (selectedImageId) {
                  setImages((prev) =>
                    prev.map((img) => (img.id === selectedImageId ? { ...img, ...updates } : img))
                  );
                }
              }}
              onDeleteText={() => {
                if (selectedTextId) {
                  setItems((prev) => prev.filter((item) => item.id !== selectedTextId));
                  setSelectedTextId(null);
                }
              }}
              onDeleteImage={() => {
                if (selectedImageId) {
                  handleImageDelete(selectedImageId);
                }
              }}
            />
          </div>
        </>
      )}

      {/* CV DESIGNER MODE */}
      {!isPdfMode && <CvDesigner initialTemplate={initialTemplate} />}
    </div>
  );
}

