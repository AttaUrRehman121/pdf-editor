import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Configure the worker source (Critical for Next.js)
// We force the worker to load from a CDN because local bundling is flaky in Next.js.
// Using a guard so this doesn't run in Node environments during SSR.
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${(pdfjsLib as any).version}/build/pdf.worker.min.js`;
}

export interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number; // PDF Coordinate (bottom-left origin)
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  hasChanged: boolean;
  isBold: boolean;
  isItalic: boolean;
  fontFamily: string;
  backgroundColor: string;
  textColor: string; // Extracted from PDF canvas
}

export interface ImageItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string; // Base64 or blob URL
  imageBytes?: Uint8Array; // For saving to PDF
  rotation?: number; // Rotation in degrees (0-360)
  opacity?: number; // Opacity 0-1 (default 1)
  borderRadius?: number; // Border radius in pixels (default 0)
}

export interface PdfToHtmlOptions {
  scale: number;
  viewportHeight: number; // HTML/CSS height (top-left origin)
  fontSize: number; // in PDF units, before scale
}

/**
 * Helper to map PDF fonts to Web Fonts
 * Maps PDF font names to web-safe CSS font families
 */
const getWebFontFamily = (fontName: string): string => {
  const lower = fontName.toLowerCase();

  // 1. Check for Monospace (Code)
  if (lower.includes("mono") || lower.includes("courier")) {
    return '"Courier New", Courier, monospace';
  }

  // 2. Check for Serif (Times New Roman)
  if (lower.includes("serif") || lower.includes("times") || lower.includes("minion")) {
    return '"Times New Roman", Times, serif';
  }

  // 3. Default to Sans-Serif (Arial/Helvetica) for everything else
  // Most modern resumes use Sans-Serif, so this is the safest default.
  return "Arial, Helvetica, sans-serif";
};

/**
 * Clean up PDF font names by stripping subset prefixes and noisy characters
 * e.g. "ABCDE+Arial-Bold" -> "Arial Bold"
 */
const getCleanFontName = (fontName: string): string => {
  let cleanName = fontName.split("+").pop() || fontName;
  cleanName = cleanName.replace(/-/g, " ").replace(/_/g, " ");
  return cleanName;
};

const parseColorToRgbUnit = (
  color: string | undefined,
  fallback: { r: number; g: number; b: number }
): { r: number; g: number; b: number } => {
  if (!color || color === "transparent") return fallback;

  // rgb() / rgba()
  const rgbMatch = color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10))) / 255;
    const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10))) / 255;
    const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10))) / 255;
    return { r, g, b };
  }

  // Hex #rgb or #rrggbb
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return { r, g, b };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return { r, g, b };
    }
  }

  return fallback;
};

/**
 * Convert a PDF point (bottom-left origin) into an HTML/CSS point (top-left origin).
 * This is the core "flip Y" math used for positioning overlay inputs.
 */
export const pdfPointToHtmlPoint = (
  pdfX: number,
  pdfY: number,
  opts: PdfToHtmlOptions
) => {
  const htmlX = pdfX * opts.scale;
  const htmlY = opts.viewportHeight - pdfY * opts.scale - opts.fontSize * opts.scale;
  return { x: htmlX, y: htmlY };
};

export const extractTextFromPDF = async (
  fileUrl: string,
  pageNumber: number = 1
): Promise<{
  items: TextItem[];
  width: number;
  height: number;
  originalPdfBytes: ArrayBuffer;
  totalPages: number;
}> => {
  // 1. Use pdfjsLib directly (already imported at top of file)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lib = pdfjsLib as any;
  
  // 2. Load the PDF
  const loadingTask = lib.getDocument(fileUrl);
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.5 }); // Scale 1.5 for better readability

  // 3. Get Text Content
  const textContent = await page.getTextContent();
  const styles = (textContent as any).styles || {}; // <--- This holds the font secrets

  // 4. Map PDF items to our Editor items
  const items: TextItem[] = textContent.items.map((item: any) => {
    // PDF.js transform matrix: [scaleX, skewY, skewX, scaleY, x, y]
    const tx = item.transform;
    const x = tx[4];
    const y = tx[5];

    // Get the REAL font name from the styles table (e.g., "Helvetica-Bold" instead of "g_d0_f1")
    const style = styles[item.fontName];
    const realFontName = style ? style.fontFamily : item.fontName;
    const cleanFontName = getCleanFontName(realFontName || item.fontName);
    const rawFontName = cleanFontName.toLowerCase();

    // Determine Bold/Italic from the real font name
    const isBold =
      rawFontName.includes("bold") ||
      rawFontName.includes("black") ||
      String(item.fontName || "").toLowerCase().includes("bold");
    const isItalic = rawFontName.includes("italic") || rawFontName.includes("oblique");

    // Map to web-safe font family using the helper function
    const webFont = getWebFontFamily(cleanFontName);

    const fontSize = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]);

    return {
      id: crypto.randomUUID(),
      text: item.str,
      x: x, // Keep raw PDF x
      y: y, // Keep raw PDF y
      width: item.width,
      height: item.height,
      fontSize, // More accurate size calculation for scaled transforms
      fontName: cleanFontName, // Cleaned font name for CSS matching
      hasChanged: false,
      isBold,
      isItalic,
      fontFamily: webFont,
      backgroundColor: "transparent",
      textColor: "transparent", // Will be filled by pixel sampling in component
    };
  });

  // Fetch raw bytes for later saving
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();

  return {
    items,
    width: viewport.width,
    height: viewport.height,
    originalPdfBytes: buffer,
    totalPages,
  };
};

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";
  color: string;
}

export const saveModifiedPDF = async (
  originalPdfBytes: ArrayBuffer,
  textItems: TextItem[],
  imageItems: ImageItem[] = [],
  editedPageNumber: number = 1,
  watermark?: WatermarkSettings
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();
  const editedPage = pages[editedPageNumber - 1]; // pages are 0-indexed
  const { height } = editedPage.getSize();

  // Load a standard font (Complex font matching requires custom font loading)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Save text changes to the edited page
  textItems.forEach((item) => {
    if (item.hasChanged) {
      // Derive background fill from sampled background (fallback white)
      const bgColor = parseColorToRgbUnit(item.backgroundColor, { r: 1, g: 1, b: 1 });

      // 1. Whiteout the original text area
      editedPage.drawRectangle({
        x: item.x,
        y: item.y - item.height * 0.2, // Slight adjustment for baseline
        width: item.width * 1.5, // Widen to ensure coverage
        height: item.fontSize * 1.2,
        color: rgb(bgColor.r, bgColor.g, bgColor.b),
      });

      // 2. Parse text color (supports rgb/rgba/hex). Default to black. Clamp away from near-white.
      const parsedText = parseColorToRgbUnit(item.textColor, { r: 0, g: 0, b: 0 });
      const isAlmostWhite = parsedText.r > 0.9 && parsedText.g > 0.9 && parsedText.b > 0.9;
      const textColorRgb = isAlmostWhite ? { r: 0, g: 0, b: 0 } : parsedText;

      // 3. Draw the new text with correct font weight
      editedPage.drawText(item.text, {
        x: item.x,
        // NOTE: pdf-lib uses PDF coordinate space (bottom-left origin). We keep raw PDF coords.
        y: item.y,
        size: item.fontSize,
        font: item.isBold ? helveticaBoldFont : helveticaFont,
        color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
      });
    }
  });

  // Save images to the edited page
  for (const imageItem of imageItems) {
    if (imageItem.imageBytes) {
      try {
        const image = await pdfDoc.embedPng(imageItem.imageBytes);
        editedPage.drawImage(image, {
          x: imageItem.x,
          // NOTE: imageItem.{x,y,width,height} are expected to already be in PDF coordinates
          // with bottom-left origin for y.
          y: imageItem.y,
          width: imageItem.width,
          height: imageItem.height,
        });
      } catch (error) {
        console.error("Error embedding image:", error);
        // Try JPEG if PNG fails
        try {
          const image = await pdfDoc.embedJpg(imageItem.imageBytes);
          editedPage.drawImage(image, {
            x: imageItem.x,
            y: imageItem.y,
            width: imageItem.width,
            height: imageItem.height,
          });
        } catch (jpegError) {
          console.error("Error embedding JPEG:", jpegError);
        }
      }
    }
  }

  // Apply watermark to all pages if enabled
  if (watermark?.enabled && watermark.text) {
    const watermarkFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const color = parseColorToRgbUnit(watermark.color, { r: 0.5, g: 0.5, b: 0.5 });
    
    // Apply watermark to all pages
    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Calculate watermark position
      let x = width / 2;
      let y = height / 2;
      const textWidth = watermarkFont.widthOfTextAtSize(watermark.text, watermark.fontSize);
      
      switch (watermark.position) {
        case "top-left":
          x = 50;
          y = height - 50;
          break;
        case "top-right":
          x = width - textWidth - 50;
          y = height - 50;
          break;
        case "bottom-left":
          x = 50;
          y = 50;
          break;
        case "bottom-right":
          x = width - textWidth - 50;
          y = 50;
          break;
        case "diagonal":
          // Center with rotation
          x = (width - textWidth) / 2;
          y = height / 2;
          break;
        case "center":
        default:
          x = (width - textWidth) / 2;
          y = height / 2;
          break;
      }

      // Convert y to PDF coordinates (bottom-left origin)
      const pdfY = watermark.position === "bottom-left" || watermark.position === "bottom-right" 
        ? y 
        : height - y;

      // pdf-lib's drawText doesn't support rotation directly.
      // Rotation for text requires low-level PDF operators which are not easily accessible
      // through pdf-lib's high-level API. For now, we'll draw without rotation.
      // If rotation is needed, it would require using the content stream directly.
      page.drawText(watermark.text, {
        x,
        y: pdfY,
        size: watermark.fontSize,
        font: watermarkFont,
        color: rgb(color.r, color.g, color.b),
        opacity: watermark.opacity,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes as Uint8Array;
};

