import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
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

export async function exportCvToPdf(doc: CvDocument, canvasWidth: number, canvasHeight: number) {
  const pdfDoc = await PDFDocument.create();
  const { width: pdfWidth, height: pdfHeight } = PDF_PAGE_POINTS[doc.pageSize];

  const page = pdfDoc.addPage([pdfWidth, pdfHeight]);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const scaleX = pdfWidth / canvasWidth;
  const scaleY = pdfHeight / canvasHeight;

  const elements = doc.pages[0]?.elements ?? [];
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

