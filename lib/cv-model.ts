export type CvPageSize = "A4" | "LETTER";

export type CvElementType = "text" | "shape" | "image";

export type CvFontWeight = "normal" | "bold";

export type CvTextAlign = "left" | "center" | "right";

export type CvListStyle =
  | "none"
  | "bullet"
  | "number"
  | "upper_roman"
  | "lower_roman"
  | "upper_alpha"
  | "lower_alpha";

export interface CvBaseElement {
  id: string;
  type: CvElementType;
  x: number; // canvas units (px) from top-left
  y: number; // canvas units (px) from top-left
  width: number; // canvas units (px)
  height: number; // canvas units (px)
  zIndex: number;
  locked?: boolean;
  comment?: string;
}

export interface CvTextElement extends CvBaseElement {
  type: "text";
  text: string;
  fontSize: number; // px in canvas units
  fontWeight: CvFontWeight;
  align: CvTextAlign;
  fontFamily: string;
  listStyle?: CvListStyle;
  color: string; // hex/rgb
}

export interface CvShapeElement extends CvBaseElement {
  type: "shape";
  fill: string; // hex/rgb
  borderRadius?: number; // px (UI only; export currently ignores)
}

export interface CvImageElement extends CvBaseElement {
  type: "image";
  imageData: string; // Base64 or blob URL
  imageBytes?: Uint8Array; // For saving to PDF
  rotation?: number; // Rotation in degrees (0-360)
  opacity?: number; // Opacity 0-1 (default 1)
}

export type CvElement = CvTextElement | CvShapeElement | CvImageElement;

export interface CvPage {
  id: string;
  elements: CvElement[];
}

export interface CvDocument {
  pageSize: CvPageSize;
  pages: CvPage[];
}

export const PAGE_DIMENSIONS: Record<CvPageSize, { width: number; height: number }> = {
  // Approx CSS px at 96dpi: A4 ≈ 794x1123, Letter ≈ 816x1056
  A4: { width: 794, height: 1123 },
  LETTER: { width: 816, height: 1056 },
};

export function newDocument(pageSize: CvPageSize = "A4"): CvDocument {
  return {
    pageSize,
    pages: [{ id: crypto.randomUUID(), elements: [] }],
  };
}

export function addTextElement(
  page: CvPage,
  partial: Partial<Omit<CvTextElement, "id" | "type">> = {}
): CvPage {
  const el: CvTextElement = {
    id: crypto.randomUUID(),
    type: "text",
    x: 80,
    y: 80,
    width: 420,
    height: 36,
    zIndex: 20,
    text: "Text",
    fontSize: 28,
    fontWeight: "bold",
    align: "left",
    fontFamily: "Inter, Arial, sans-serif",
    listStyle: "none",
    color: "#0F172A",
    ...partial,
  };
  return { ...page, elements: [...page.elements, el] };
}

export function addBodyTextElement(
  page: CvPage,
  partial: Partial<Omit<CvTextElement, "id" | "type">> = {}
): CvPage {
  return addTextElement(page, {
    text: "Write here…",
    fontSize: 12,
    fontWeight: "normal",
    width: 520,
    height: 90,
    fontFamily: "Inter, Arial, sans-serif",
    listStyle: "none",
    color: "#334155",
    ...partial,
  });
}

export function addShapeElement(
  page: CvPage,
  partial: Partial<Omit<CvShapeElement, "id" | "type">> = {}
): CvPage {
  const el: CvShapeElement = {
    id: crypto.randomUUID(),
    type: "shape",
    x: 60,
    y: 60,
    width: 220,
    height: 220,
    zIndex: 0,
    fill: "#0B1220",
    borderRadius: 16,
    ...partial,
  };
  return { ...page, elements: [...page.elements, el] };
}

export function addImageElement(
  page: CvPage,
  partial: Partial<Omit<CvImageElement, "id" | "type">> = {}
): CvPage {
  const el: CvImageElement = {
    id: crypto.randomUUID(),
    type: "image",
    x: 60,
    y: 60,
    width: 200,
    height: 200,
    zIndex: 10,
    imageData: "",
    opacity: 1,
    ...partial,
  };
  return { ...page, elements: [...page.elements, el] };
}

export function updateElement(page: CvPage, id: string, updates: Partial<CvElement>): CvPage {
  return {
    ...page,
    elements: page.elements.map((el) => (el.id === id ? ({ ...el, ...updates } as CvElement) : el)),
  };
}

export function removeElement(page: CvPage, id: string): CvPage {
  return { ...page, elements: page.elements.filter((el) => el.id !== id) };
}

