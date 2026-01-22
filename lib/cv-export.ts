import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import type { CvDocument, CvElement, CvPageSize, CvTextElement } from "./cv-model";

const PDF_PAGE_POINTS: Record<CvPageSize, { width: number; height: number }> = {
  // PDF points
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612, height: 792 },
};

function parseColorToRgb01(input: string | undefined, fallback: { r: number; g: number; b: number }) {
  if (!input) return fallback;

  // rgb() / rgba()
  const m = input.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (m) {
    const r = Math.max(0, Math.min(255, parseInt(m[1], 10))) / 255;
    const g = Math.max(0, Math.min(255, parseInt(m[2], 10))) / 255;
    const b = Math.max(0, Math.min(255, parseInt(m[3], 10))) / 255;
    return { r, g, b };
  }

  // hex #rgb / #rrggbb
  if (input.startsWith("#")) {
    const hex = input.slice(1);
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
}

function wrapTextLines(
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  text: string,
  size: number,
  maxWidth: number
) {
  const hardLines = text.split("\n");
  const out: string[] = [];

  for (const hard of hardLines) {
    const words = hard.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      out.push("");
      continue;
    }

    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const next = `${line} ${words[i]}`;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        line = next;
      } else {
        out.push(line);
        line = words[i];
      }
    }
    out.push(line);
  }

  return out;
}

function drawTextElement(opts: {
  page: any;
  el: CvTextElement;
  scaleX: number;
  scaleY: number;
  pdfHeight: number;
  fontRegular: any;
  fontBold: any;
}) {
  const { page, el, scaleX, scaleY, pdfHeight, fontRegular, fontBold } = opts;
  const font = el.fontWeight === "bold" ? fontBold : fontRegular;
  const size = el.fontSize * scaleY;
  const x = el.x * scaleX;
  const maxWidth = el.width * scaleX;
  const topY = el.y * scaleY;

  const color01 = parseColorToRgb01(el.color, { r: 0.06, g: 0.09, b: 0.13 });
  const lines = wrapTextLines(font, el.text, size, maxWidth);
  const lineHeight = size * 1.35;

  // Convert from top-left to PDF bottom-left. We treat el.y as top of box.
  let cursorY = pdfHeight - topY - size;

  for (const line of lines) {
    const lineWidth = font.widthOfTextAtSize(line, size);
    let drawX = x;
    if (el.align === "center") drawX = x + (maxWidth - lineWidth) / 2;
    if (el.align === "right") drawX = x + (maxWidth - lineWidth);

    page.drawText(line, {
      x: drawX,
      y: cursorY,
      size,
      font,
      color: rgb(color01.r, color01.g, color01.b),
    });
    cursorY -= lineHeight;
  }
}

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";
  color: string;
}

export async function exportCvToPdf(
  doc: CvDocument,
  canvasWidth: number,
  canvasHeight: number,
  watermark?: WatermarkSettings
) {
  const pdfDoc = await PDFDocument.create();
  const { width: pdfWidth, height: pdfHeight } = PDF_PAGE_POINTS[doc.pageSize];

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const scaleX = pdfWidth / canvasWidth;
  const scaleY = pdfHeight / canvasHeight;

  // Process all pages
  for (const cvPage of doc.pages) {
    const page = pdfDoc.addPage([pdfWidth, pdfHeight]);
    const elements = cvPage?.elements ?? [];
    const sorted = elements.slice().sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sorted) {
      if (el.type === "shape") {
        const fill01 = parseColorToRgb01(el.fill, { r: 1, g: 1, b: 1 });
        const x = el.x * scaleX;
        const y = pdfHeight - (el.y + el.height) * scaleY;
        const w = el.width * scaleX;
        const h = el.height * scaleY;

        page.drawRectangle({
          x,
          y,
          width: w,
          height: h,
          color: rgb(fill01.r, fill01.g, fill01.b),
        });
      } else if (el.type === "image") {
        // Handle image elements
        let imageBytes = el.imageBytes;
        
        // Convert base64 imageData to bytes if needed
        if (!imageBytes && el.imageData) {
          try {
            const response = await fetch(el.imageData);
            const blob = await response.blob();
            imageBytes = new Uint8Array(await blob.arrayBuffer());
          } catch (error) {
            console.error("Error converting image data:", error);
          }
        }
        
        if (imageBytes) {
          try {
            const image = await pdfDoc.embedPng(imageBytes);
            const x = el.x * scaleX;
            const y = pdfHeight - (el.y + el.height) * scaleY;
            const w = el.width * scaleX;
            const h = el.height * scaleY;
            
            page.drawImage(image, {
              x,
              y,
              width: w,
              height: h,
              opacity: el.opacity ?? 1,
              rotate: degrees(el.rotation || 0),
            });
          } catch (error) {
            console.error("Error embedding image:", error);
            // Try JPEG if PNG fails
            try {
              const image = await pdfDoc.embedJpg(imageBytes);
              const x = el.x * scaleX;
              const y = pdfHeight - (el.y + el.height) * scaleY;
              const w = el.width * scaleX;
              const h = el.height * scaleY;
              
              page.drawImage(image, {
                x,
                y,
                width: w,
                height: h,
                opacity: el.opacity ?? 1,
                rotate: degrees(el.rotation || 0),
              });
            } catch (jpegError) {
              console.error("Error embedding JPEG:", jpegError);
            }
          }
        }
      } else {
        drawTextElement({
          page,
          el,
          scaleX,
          scaleY,
          pdfHeight,
          fontRegular,
          fontBold,
        });
      }
    }
  }

  // Apply watermark to all pages if enabled
  if (watermark?.enabled && watermark.text) {
    const watermarkFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const color = parseColorToRgb01(watermark.color, { r: 0.5, g: 0.5, b: 0.5 });
    
    // Apply watermark to all pages
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
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

  const bytes = await pdfDoc.save();
  return bytes;
}

export function downloadPdfBytes(bytes: Uint8Array, filename: string) {
  // Convert to ArrayBuffer to satisfy strict BlobPart typing (ArrayBufferLike may include SharedArrayBuffer)
  const arrayBuffer =
    bytes.buffer instanceof ArrayBuffer
      ? bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
      : new Uint8Array(bytes).buffer;

  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

