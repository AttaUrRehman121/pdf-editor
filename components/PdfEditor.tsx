"use client";

import React, { useRef, useState, useEffect } from "react";
import { Download, Upload, Image as ImageIcon, X, Maximize2, RotateCw, RotateCcw, PanelLeft, SlidersHorizontal } from "lucide-react";
import { CvDesigner } from "@/components/cv/CvDesigner";
import { PdfLeftPanel } from "@/components/PdfLeftPanel";
import { PdfRightInspector } from "@/components/PdfRightInspector";
import { MobileDrawer } from "@/components/ui/MobileDrawer";
import { MobileSheet } from "@/components/ui/MobileSheet";
import { useMediaQuery } from "@/lib/useMediaQuery";
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
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);
  const autoOpenedMobileLeftOnceRef = useRef(false);

  const [items, setItems] = useState<TextItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  // Raw PDF page size (PDF points)
  const [pdfPageSize, setPdfPageSize] = useState({ width: 0, height: 0 });
  // Rendering scale for canvas + overlays
  const [pdfScale, setPdfScale] = useState(1.5);
  // Scaled (CSS pixel) dimensions for rendering
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [pageThumbnails, setPageThumbnails] = useState<Map<number, string>>(new Map());
  const [frontPageThumbnail, setFrontPageThumbnail] = useState<string | null>(null);
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

  // File input refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isPdfMode = mode === "pdf";

  // 2. Render PDF to Canvas (Visual Background Only)
  const renderPdfBackground = async (
    url: string,
    currentItems?: TextItem[],
    pageNum: number = currentPage,
    scaleOverride?: number
  ) => {
    const loadingTask = (pdfjsLib as any).getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNum);
    const scale = scaleOverride ?? pdfScale;
    const viewport = page.getViewport({ scale });

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
          renderPdfBackground(fileUrl, items, currentPage);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkAndRender, 50);
        }
      };
      const timer = setTimeout(checkAndRender, 50);
      return () => clearTimeout(timer);
    }
  }, [isPdfMode, fileUrl, pdfScale, currentPage]); // Re-run when mode, fileUrl, scale, or page changes

  // Mobile overlays: reset when leaving mobile, and auto-open tools once when no file yet.
  useEffect(() => {
    if (!isMobile) {
      setMobileLeftOpen(false);
      setMobilePropsOpen(false);
      autoOpenedMobileLeftOnceRef.current = false;
      // Avoid changing scale when a file is already loaded (would desync image coordinates).
      if (!fileUrl) setPdfScale(1.5);
      return;
    }

    if (!fileUrl && !autoOpenedMobileLeftOnceRef.current) {
      autoOpenedMobileLeftOnceRef.current = true;
      setMobileLeftOpen(true);
      setMobilePropsOpen(false);
    }

    if (fileUrl) {
      autoOpenedMobileLeftOnceRef.current = false;
    }
  }, [isMobile, fileUrl]);

  // Generate thumbnail for a specific page
  const generatePageThumbnail = async (url: string, pageNum: number): Promise<string> => {
    const loadingTask = (pdfjsLib as any).getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 0.8 }); // Larger scale for better visibility

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return "";

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    return canvas.toDataURL("image/png");
  };

  // Generate thumbnails for all pages
  const generateAllThumbnails = async (url: string, totalPages: number) => {
    const thumbnails = new Map<number, string>();
    for (let i = 1; i <= totalPages; i++) {
      const thumbnail = await generatePageThumbnail(url, i);
      thumbnails.set(i, thumbnail);
    }
    setPageThumbnails(thumbnails);
  };

  // 1. Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setPdfFileName(file.name);
    setCurrentPage(1);
    setPageThumbnails(new Map());

    // Extract Data from first page to get total pages
    const { items: extractedItems, width, height, originalPdfBytes, totalPages: pages } = await extractTextFromPDF(url, 1);
    setTotalPages(pages);
    setItems(extractedItems);
    // width/height returned are raw page size (scale=1)
    setPdfPageSize({ width, height });
    const availableWidth = Math.max(320, (typeof window !== "undefined" ? window.innerWidth : 900) - 24);
    const nextScale = isMobile ? Math.max(0.6, Math.min(1.5, availableWidth / width)) : 1.5;
    setPdfScale(nextScale);
    setPdfDimensions({ width: width * nextScale, height: height * nextScale });
    setOriginalPdfBytes(originalPdfBytes);

    // Generate front page thumbnail immediately for display
    const frontThumb = await generatePageThumbnail(url, 1);
    setFrontPageThumbnail(frontThumb);

    // Generate thumbnails for all pages
    if (pages > 1) {
      generateAllThumbnails(url, pages);
      setShowPageSelector(true);
    } else {
      // Render Background Canvas and detect actual background colors
      renderPdfBackground(url, extractedItems, 1, nextScale);
    }
  };

  // Handle page selection
  const handlePageSelect = async (pageNum: number) => {
    if (!fileUrl) return;
    
    setCurrentPage(pageNum);
    setShowPageSelector(false);
    setItems([]);
    setImages([]);
    setSelectedTextId(null);
    setSelectedImageId(null);

    // Extract Data from selected page
    const { items: extractedItems, width, height } = await extractTextFromPDF(fileUrl, pageNum);
    setItems(extractedItems);
    setPdfPageSize({ width, height });
    const availableWidth = Math.max(320, (typeof window !== "undefined" ? window.innerWidth : 900) - 24);
    const nextScale = isMobile ? Math.max(0.6, Math.min(1.5, availableWidth / width)) : 1.5;
    setPdfScale(nextScale);
    setPdfDimensions({ width: width * nextScale, height: height * nextScale });

    // Render Background Canvas and detect actual background colors
    renderPdfBackground(fileUrl, extractedItems, pageNum, nextScale);
  };

  const detectBackgroundColors = (
    ctx: CanvasRenderingContext2D,
    itemsToColor: TextItem[],
    pageHeight: number
  ) => {
    const scale = pdfScale;
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
    
    const scale = pdfScale;
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
    const viewportHeight = pdfDimensions.height;
    // Reverse the pdfPointToHtmlPoint formula: htmlY = viewportHeight - pdfY * scale - fontSize * scale
    // So: pdfY = (viewportHeight - htmlY - fontSize * scale) / scale
    const pdfY = (viewportHeight - htmlY - fontSize * scale) / scale;
    
    const newTextItem: TextItem = {
      id: crypto.randomUUID(),
      text: emoji,
      x: Math.max(0, Math.min(pdfX, (pdfPageSize.width || pdfX + 1) - 50)), // Ensure within bounds
      y: Math.max(0, Math.min(pdfY, (pdfPageSize.height || pdfY + 1) - 50)), // Ensure within bounds
      width: 50, // Wider for better visibility
      height: fontSize * 1.2, // Height based on font size
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

      const scale = pdfScale;
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

  // Handle corner resize (pointer events for mobile touch support)
  const handleCornerResize = (e: React.PointerEvent, id: string, direction: "nw" | "ne" | "sw" | "se") => {
    e.preventDefault();
    e.stopPropagation();
    const image = images.find((img) => img.id === id);
    if (!image || !canvasRef.current) return;

    setSelectedImageId(id);
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: image.width,
      height: image.height,
      imageX: image.x,
      imageY: image.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!canvasRef.current) return;
      const start = resizeStartRef.current;
      const deltaX = (moveEvent.clientX - start.x) / pdfScale; // Account for scale
      const deltaY = (moveEvent.clientY - start.y) / pdfScale;

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

    const handlePointerUp = () => {
      setIsResizing(false);
      setResizeDirection("");
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handleSideResize = (e: React.PointerEvent, id: string, direction: "n" | "s" | "e" | "w") => {
    e.preventDefault();
    e.stopPropagation();
    const image = images.find((img) => img.id === id);
    if (!image || !canvasRef.current) return;

    setSelectedImageId(id);
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: image.width,
      height: image.height,
      imageX: image.x,
      imageY: image.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!canvasRef.current) return;
      const start = resizeStartRef.current;
      const deltaX = (moveEvent.clientX - start.x) / pdfScale;
      const deltaY = (moveEvent.clientY - start.y) / pdfScale;

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

    const handlePointerUp = () => {
      setIsResizing(false);
      setResizeDirection("");
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
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

  // 7. Handle Image Drag (pointer events for mobile touch support)
  const handleImagePointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    setSelectedImageId(id);
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleImagePointerMove = (e: React.PointerEvent) => {
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

  const handleImagePointerUp = () => {
    setIsDragging(false);
  };

  // 8. Save & Download
  const handleDownload = async () => {
    if (!originalPdfBytes) return;
    // Convert image positions from screen (scaled, top-left) to PDF coordinates (unscaled, bottom-left)
    const scale = pdfScale;
    const imagesForPdf = images.map((img) => {
      const x = img.x / scale;
      const y = (pdfDimensions.height - (img.y + img.height)) / scale; // bottom-left origin
      const width = img.width / scale;
      const height = img.height / scale;
      return { ...img, x, y, width, height };
    });

    const modifiedPdfBytes = await saveModifiedPDF(originalPdfBytes, items, imagesForPdf, currentPage, watermark);
    // Convert Uint8Array to ArrayBuffer to avoid TypeScript type issues with pdf-lib
    const arrayBuffer = modifiedPdfBytes.buffer instanceof ArrayBuffer
      ? modifiedPdfBytes.buffer.slice(modifiedPdfBytes.byteOffset, modifiedPdfBytes.byteOffset + modifiedPdfBytes.byteLength)
      : new Uint8Array(modifiedPdfBytes).buffer;
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = pdfFileName || "edited-document.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#020617] flex flex-col">
      {/* Top App Bar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-50 shrink-0">Editor</div>
          <div className="h-6 w-px bg-slate-700/80 shrink-0" />
          <div className="inline-flex rounded-lg bg-white/5 p-1 ring-1 ring-slate-700/70 shrink-0">
            <button
              onClick={() => setMode("pdf")}
              className={`px-2 md:px-4 py-1.5 text-xs md:text-sm font-semibold rounded-md whitespace-nowrap ${
                isPdfMode ? "bg-teal-500 text-slate-950 shadow-sm" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <span className="hidden sm:inline">PDF editor</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => setMode("cv")}
              className={`px-2 md:px-4 py-1.5 text-xs md:text-sm font-semibold rounded-md whitespace-nowrap ${
                !isPdfMode ? "bg-teal-500 text-slate-950 shadow-sm" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <span className="hidden sm:inline">CV designer (Canva style)</span>
              <span className="sm:hidden">CV</span>
            </button>
          </div>
        </div>
        <div className="text-xs text-slate-300/80 hidden md:block shrink-0">
          Build resumes faster with AI & precise PDF editing.
        </div>
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
          <div className="h-14 bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 overflow-hidden">
            <div className="text-sm font-semibold text-gray-900 shrink-0 hidden min-[400px]:block">PDF Editor</div>
            <div className="h-6 w-px bg-gray-200 shrink-0 hidden min-[400px]:block" />
            {isMobile && (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileLeftOpen(true);
                    setMobilePropsOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-sm font-semibold"
                  title="Open tools"
                >
                  <PanelLeft size={16} className="shrink-0" />
                  <span className="hidden sm:inline">Tools</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobilePropsOpen(true);
                    setMobileLeftOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-sm font-semibold"
                  title="Open properties"
                >
                  <SlidersHorizontal size={16} className="shrink-0" />
                  <span className="hidden sm:inline">Properties</span>
                </button>
              </div>
            )}
            <div className="flex-1 min-w-0" />
            <button
              onClick={handleDownload}
              disabled={!fileUrl}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shrink-0"
            >
              <Download size={16} className="shrink-0" />
              <span className="hidden min-[360px]:inline">Download PDF</span>
              <span className="min-[360px]:hidden">Download</span>
            </button>
          </div>

          {/* Main Editor Layout */}
          <div className="flex h-[calc(100vh-6rem)]">
            {/* Left Panel */}
            {!isMobile && (
              <PdfLeftPanel
                tab={leftTab}
                onChangeTab={setLeftTab}
                onUploadPdf={handleFileUpload}
                onAddImage={handleImageUpload}
                onAddEmoji={handleAddEmoji}
                fileUrl={fileUrl}
                pdfFileName={pdfFileName}
                totalPages={totalPages}
                currentPage={currentPage}
                onFileClick={() => {
                  if (totalPages > 1) {
                    setShowPageSelector(true);
                  }
                }}
                frontPageThumbnail={frontPageThumbnail}
                watermark={watermark}
                onWatermarkChange={setWatermark}
              />
            )}

            {/* Canvas Area */}
            {fileUrl ? (
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
                onClick={(e) => {
                  // Deselect when clicking outside the canvas container
                  if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "CANVAS") {
                    setSelectedTextId(null);
                    setSelectedImageId(null);
                  }
                }}
              >
                <div 
                  className="relative inline-block shadow-xl border border-gray-300 bg-white"
                  style={{ touchAction: "none" }}
                  onClick={(e) => {
                    // Deselect when clicking on the canvas container itself (but not on elements)
                    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "CANVAS") {
                      setSelectedTextId(null);
                      setSelectedImageId(null);
                    }
                  }}
                >
                  {/* Layer A: Canvas (Visuals) */}
                  <canvas ref={canvasRef} className="block" />

                  {/* Layer B: Inputs (Editable) with sampled background + native look */}
                  {items.map((item) => {
                  const scale = pdfScale;
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
                      onClick={(e) => {
                        // Select text when clicking on it
                        e.stopPropagation();
                        setSelectedTextId(item.id);
                        setSelectedImageId(null);
                        setToolbarFontFamily(item.fontName || "Helvetica");
                        setToolbarFontSize(Math.round(item.fontSize));
                        setToolbarTextColor(colorToHexForInput(item.textColor));
                        setToolbarBold(!!item.isBold);
                      }}
                      onFocus={(e) => {
                        // Track selection for toolbar
                        setSelectedTextId(item.id);
                        setSelectedImageId(null);
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
                      onPointerDown={(e) => {
                        // Don't start drag if clicking on resize handle
                        if ((e.target as HTMLElement).classList.contains("resize-handle")) {
                          return;
                        }
                        handleImagePointerDown(e, image.id);
                      }}
                      onPointerMove={handleImagePointerMove}
                      onPointerUp={handleImagePointerUp}
                      onPointerLeave={handleImagePointerUp}
                      onPointerCancel={handleImagePointerUp}
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
                          transform: image.rotation ? `rotate(${image.rotation}deg)` : undefined,
                          opacity: image.opacity ?? 1,
                          borderRadius: image.borderRadius ? `${image.borderRadius}px` : undefined,
                        }}
                        draggable={false}
                      />
                      {isSelected && (
                        <>
                          {/* Corner Resize Handles */}
                          <div
                            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nwse-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "nw");
                            }}
                            title="Resize (top-left)"
                          />
                          <div
                            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nesw-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "ne");
                            }}
                            title="Resize (top-right)"
                          />
                          <div
                            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nesw-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "sw");
                            }}
                            title="Resize (bottom-left)"
                          />
                          <div
                            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nwse-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleCornerResize(e, image.id, "se");
                            }}
                            title="Resize (bottom-right)"
                          />
                          
                          {/* Side Resize Handles */}
                          <div
                            className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ns-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "n");
                            }}
                            title="Resize (top)"
                          />
                          <div
                            className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ns-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "s");
                            }}
                            title="Resize (bottom)"
                          />
                          <div
                            className="resize-handle absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ew-resize z-50"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              handleSideResize(e, image.id, "w");
                            }}
                            title="Resize (left)"
                          />
                          <div
                            className="resize-handle absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ew-resize z-50"
                            onPointerDown={(e) => {
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
                                setImages((prev) =>
                                  prev.map((img) =>
                                    img.id === image.id
                                      ? { ...img, rotation: ((img.rotation || 0) - 15) % 360 }
                                      : img
                                  )
                                );
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Rotate left 15°"
                            >
                              <RotateCcw size={16} className="text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setImages((prev) =>
                                  prev.map((img) =>
                                    img.id === image.id
                                      ? { ...img, rotation: ((img.rotation || 0) + 15) % 360 }
                                      : img
                                  )
                                );
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="Rotate right 15°"
                            >
                              <RotateCw size={16} className="text-gray-700" />
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
            ) : (
              <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                  <div className="text-lg font-semibold text-gray-900">Upload a PDF to start editing</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {isMobile ? "Tap Tools to upload a PDF, then edit on the canvas." : "Use the left panel to upload a PDF."}
                  </div>
                  {isMobile && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileLeftOpen(true);
                        setMobilePropsOpen(false);
                      }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    >
                      <PanelLeft size={16} />
                      Open Tools
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Right Panel – only show when an element is selected */}
            {!isMobile && (selectedTextId || selectedImageId) && (
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
            )}
          </div>

          {isMobile && (
            <>
              <MobileDrawer
                open={mobileLeftOpen}
                onClose={() => setMobileLeftOpen(false)}
                ariaLabel="Tools"
              >
                <PdfLeftPanel
                  tab={leftTab}
                  onChangeTab={setLeftTab}
                  onUploadPdf={handleFileUpload}
                  onAddImage={handleImageUpload}
                  onAddEmoji={handleAddEmoji}
                  fileUrl={fileUrl}
                  pdfFileName={pdfFileName}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onFileClick={() => {
                    if (totalPages > 1) {
                      setShowPageSelector(true);
                    }
                  }}
                  frontPageThumbnail={frontPageThumbnail}
                  watermark={watermark}
                  onWatermarkChange={setWatermark}
                />
              </MobileDrawer>

              <MobileSheet
                open={mobilePropsOpen}
                onClose={() => setMobilePropsOpen(false)}
                ariaLabel="Properties"
              >
                <PdfRightInspector
                  variant="sheet"
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
              </MobileSheet>
            </>
          )}
        </>
      )}

      {/* CV DESIGNER MODE */}
      {!isPdfMode && <CvDesigner initialTemplate={initialTemplate} />}

      {/* Page Selector Modal */}
      {showPageSelector && fileUrl && totalPages > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPageSelector(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Select Page to Edit</h2>
                <p className="text-sm text-gray-500 mt-1">{pdfFileName}</p>
              </div>
              <button
                onClick={() => setShowPageSelector(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const thumbnail = pageThumbnails.get(pageNum);
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageSelect(pageNum)}
                    className={`relative rounded-xl border-2 transition-all overflow-hidden group shadow-sm hover:shadow-md ${
                      currentPage === pageNum
                        ? "border-blue-500 bg-blue-50 ring-4 ring-blue-200 scale-105"
                        : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    {thumbnail ? (
                      <>
                        <img
                          src={thumbnail}
                          alt={`Page ${pageNum}`}
                          className="w-full h-64 md:h-80 object-contain bg-gray-50"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </>
                    ) : (
                      <div className="w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center">
                        <div className="text-sm text-gray-400">Loading thumbnail...</div>
                      </div>
                    )}
                    <div className="p-3 bg-white border-t border-gray-200">
                      <div className={`text-sm font-semibold ${currentPage === pageNum ? "text-blue-600" : "text-gray-900"}`}>
                        Page {pageNum}
                      </div>
                      {currentPage === pageNum && (
                        <div className="text-xs text-blue-600 mt-1 font-medium">Currently editing</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

