"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import type { CvElement, CvPageSize } from "@/lib/cv-model";
import { PAGE_DIMENSIONS } from "@/lib/cv-model";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toRoman(n: number) {
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
}

function alpha(n: number, upper: boolean) {
  let num = Math.max(1, Math.floor(n));
  let out = "";
  while (num > 0) {
    num -= 1;
    out = String.fromCharCode(65 + (num % 26)) + out;
    num = Math.floor(num / 26);
  }
  return upper ? out : out.toLowerCase();
}

function listPrefix(style: string | undefined, index: number) {
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
}

function getCaretOffsetIn(el: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;
  const range = sel.getRangeAt(0);
  const pre = range.cloneRange();
  pre.selectNodeContents(el);
  pre.setEnd(range.endContainer, range.endOffset);
  return pre.toString().length;
}

function setCaretOffsetIn(el: HTMLElement, offset: number) {
  const selection = window.getSelection();
  if (!selection) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  let remaining = Math.max(0, offset);

  while (node) {
    const len = node.textContent?.length ?? 0;
    if (remaining <= len) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= len;
    node = walker.nextNode();
  }

  // Fallback: place at end
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertTextAtCaret(host: HTMLElement, text: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();

  // Insert as a single text node; browser will handle \\n as line breaks in contentEditable.
  const node = document.createTextNode(text);
  range.insertNode(node);

  // Move caret to end of inserted text node
  range.setStart(node, node.textContent?.length ?? text.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  // Merge adjacent text nodes
  host.normalize();
}

function computeAutoHeight(text: string, fontSize: number) {
  const lineHeight = fontSize * 1.35;
  const lines = Math.max(1, text.split("\n").length);
  const paddingY = 8; // px (matches px-2 py-1-ish)
  return Math.ceil(lines * lineHeight + paddingY);
}

export function CanvasStage(props: {
  pageSize: CvPageSize;
  elements: CvElement[];
  selectedId: string | null;
  zoom: number;
  onSelect: (id: string | null) => void;
  onChangeElements: (next: CvElement[]) => void;
}) {
  const { pageSize, elements, selectedId, zoom, onSelect, onChangeElements } = props;
  const pageDims = PAGE_DIMENSIONS[pageSize];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const textNodeById = useRef<Record<string, HTMLDivElement | null>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
  const [resizeState, setResizeState] = useState<{
    id: string;
    handle: ResizeHandle;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const sorted = useMemo(() => elements.slice().sort((a, b) => a.zIndex - b.zIndex), [elements]);

  // Keep DOM text in sync when not actively editing that element.
  useEffect(() => {
    for (const el of elements) {
      if (el.type !== "text") continue;
      if (editingId === el.id) continue;
      const node = textNodeById.current[el.id];
      if (!node) continue;
      const domText = node.innerText ?? "";
      if (domText !== el.text) {
        node.innerText = el.text;
      }
    }
  }, [elements, editingId]);

  const getPointerInPage = (e: React.MouseEvent) => {
    const pageRect = pageRef.current?.getBoundingClientRect();
    if (!pageRect) return null;
    const x = (e.clientX - pageRect.left) / zoom;
    const y = (e.clientY - pageRect.top) / zoom;
    return { x, y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const p = getPointerInPage(e);
    if (!p) return;

    // Resize (all elements)
    if (resizeState) {
      const { id, handle, startX, startY, startWidth, startHeight, startLeft, startTop } = resizeState;
      const dx = p.x - startX;
      const dy = p.y - startY;

      const minWidth = 40;
      const minHeight = 24;

      onChangeElements(
        elements.map((el) => {
          if (el.id !== id) return el;
          const next = { ...el } as CvElement;

          // Horizontal adjustments
          if (handle.includes("e")) {
            next.width = clamp(startWidth + dx, minWidth, pageDims.width - startLeft);
          }
          if (handle.includes("w")) {
            const newWidth = clamp(startWidth - dx, minWidth, startLeft + startWidth);
            const newX = clamp(startLeft + dx, 0, startLeft + startWidth - minWidth);
            next.width = newWidth;
            next.x = newX;
          }

          // Vertical adjustments
          if (handle.includes("s")) {
            next.height = clamp(startHeight + dy, minHeight, pageDims.height - startTop);
          }
          if (handle.includes("n")) {
            const newHeight = clamp(startHeight - dy, minHeight, startTop + startHeight);
            const newY = clamp(startTop + dy, 0, startTop + startHeight - minHeight);
            next.height = newHeight;
            next.y = newY;
          }

          return next;
        })
      );
      return;
    }

    // Drag
    if (!draggingId) return;
    onChangeElements(
      elements.map((el) => {
        if (el.id !== draggingId) return el;
        return {
          ...el,
          x: clamp(p.x - dragOffset.x, 0, pageDims.width - el.width),
          y: clamp(p.y - dragOffset.y, 0, pageDims.height - el.height),
        } as CvElement;
      })
    );
  };

  const onMouseUp = () => {
    setDraggingId(null);
    setResizeState(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#F3F4F6] overflow-auto"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const p = getPointerInPage(e as unknown as React.MouseEvent);
        if (!p) return;
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        try {
          const parsed = JSON.parse(data);
          if (!parsed.preset) return;
          const page = { id: crypto.randomUUID(), elements: [] as CvElement[] };
          let next: CvElement | null = null;
          if (parsed.preset === "card") {
            next = {
              id: crypto.randomUUID(),
              type: "shape",
              x: p.x - 120,
              y: p.y - 60,
              width: 240,
              height: 120,
              zIndex: 0,
              fill: "#EEF2FF",
              borderRadius: 12,
            };
          } else if (parsed.preset === "accent") {
            next = {
              id: crypto.randomUUID(),
              type: "shape",
              x: p.x - 6,
              y: p.y - 160,
              width: 12,
              height: 320,
              zIndex: 0,
              fill: "#2563EB",
              borderRadius: 999,
            };
          } else if (parsed.preset === "pill") {
            next = {
              id: crypto.randomUUID(),
              type: "shape",
              x: p.x - 260,
              y: p.y - 18,
              width: 520,
              height: 36,
              zIndex: 0,
              fill: "#E4E9FF",
              borderRadius: 999,
            };
          } else if (parsed.preset === "line") {
            next = {
              id: crypto.randomUUID(),
              type: "shape",
              x: p.x - 200,
              y: p.y - 1,
              width: 400,
              height: 2,
              zIndex: 0,
              fill: "#D0D5DD",
              borderRadius: 999,
            };
          } else if (parsed.preset === "text_heading") {
            next = {
              id: crypto.randomUUID(),
              type: "text",
              x: p.x - 160,
              y: p.y - 22,
              width: 420,
              height: 44,
              zIndex: 20,
              text: "Heading",
              fontSize: 32,
              fontWeight: "bold",
              align: "left",
              fontFamily: "Inter, Arial, sans-serif",
              listStyle: "none",
              color: "#0F172A",
            };
          } else if (parsed.preset === "text_subheading") {
            next = {
              id: crypto.randomUUID(),
              type: "text",
              x: p.x - 140,
              y: p.y - 14,
              width: 420,
              height: 28,
              zIndex: 20,
              text: "Subheading",
              fontSize: 18,
              fontWeight: "bold",
              align: "left",
              fontFamily: "Inter, Arial, sans-serif",
              listStyle: "none",
              color: "#0F172A",
            };
          } else if (parsed.preset === "text_body") {
            next = {
              id: crypto.randomUUID(),
              type: "text",
              x: p.x - 160,
              y: p.y - 35,
              width: 520,
              height: 70,
              zIndex: 20,
              text: "Body text",
              fontSize: 12,
              fontWeight: "normal",
              align: "left",
              fontFamily: "Inter, Arial, sans-serif",
              listStyle: "none",
              color: "#334155",
            };
          }
          if (next) {
            onChangeElements([...elements, next]);
            onSelect(next.id);
          }
        } catch {
          // ignore
        }
      }}
    >
      <div className="min-h-full min-w-full flex items-start justify-center p-10">
        <div
          ref={pageRef}
          className="relative bg-white shadow-2xl border border-gray-200"
          style={{
            width: pageDims.width * zoom,
            height: pageDims.height * zoom,
            transformOrigin: "top left",
          }}
          onMouseDown={(e) => {
            // click empty -> deselect
            if (e.target === e.currentTarget) onSelect(null);
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Elements layer (scaled) */}
          <div
            className="absolute inset-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          >
            {sorted.map((el) => {
              const isSelected = el.id === selectedId;
              const locked = !!el.locked;
              return (
                <div
                  key={el.id}
                  className={clsx("absolute", isSelected && "ring-2 ring-blue-500 ring-offset-1")}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    cursor: locked ? "not-allowed" : draggingId === el.id ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    if (locked) return;
                    onSelect(el.id);
                    const p = getPointerInPage(e);
                    if (!p) return;
                    if (resizeState) return;
                    setDraggingId(el.id);
                    setDragOffset({ x: p.x - el.x, y: p.y - el.y });
                  }}
                >
                  {el.type === "shape" ? (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: el.fill,
                        borderRadius: el.borderRadius ?? 0,
                      }}
                    />
                  ) : (
                    <div
                      ref={(node) => {
                        textNodeById.current[el.id] = node;
                      }}
                      className="w-full h-full px-2 py-1 outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onFocus={() => setEditingId(el.id)}
                      onBlur={(e) => {
                        setEditingId((prev) => (prev === el.id ? null : prev));
                        const nextText = (e.currentTarget as HTMLDivElement).innerText;
                        onChangeElements(
                          elements.map((it) =>
                            it.id === el.id && it.type === "text"
                              ? ({
                                  ...it,
                                  text: nextText,
                                  height: Math.max(it.height, computeAutoHeight(nextText, it.fontSize)),
                                } as CvElement)
                              : it
                          )
                        );
                      }}
                      onInput={(e) => {
                        const nextText = (e.currentTarget as HTMLDivElement).innerText;
                        onChangeElements(
                          elements.map((it) =>
                            it.id === el.id && it.type === "text"
                              ? ({
                                  ...it,
                                  text: nextText,
                                  height: Math.max(it.height, computeAutoHeight(nextText, it.fontSize)),
                                } as CvElement)
                              : it
                          )
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        if (el.type !== "text") return;
                        const style = el.listStyle ?? "none";
                        if (style === "none") return;

                        e.preventDefault();
                        const host = e.currentTarget as HTMLDivElement;
                        const caret = getCaretOffsetIn(host);
                        const text = host.innerText;
                        const before = text.slice(0, caret);
                        const lineIndex = before.split("\n").length; // 1-based
                        const prefix = listPrefix(style, lineIndex + 1);
                        const inserted = `\n${prefix}`;

                        // Update DOM at caret first (prevents jumping to start)
                        insertTextAtCaret(host, inserted);

                        // Sync state from DOM after insertion
                        setTimeout(() => {
                          const nextText = host.innerText;
                          onChangeElements(
                            elements.map((it) =>
                              it.id === el.id && it.type === "text"
                                ? ({
                                    ...it,
                                    text: nextText,
                                    height: Math.max(it.height, computeAutoHeight(nextText, it.fontSize)),
                                  } as CvElement)
                                : it
                            )
                          );
                        }, 0);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(el.id);
                      }}
                      style={{
                        fontSize: el.fontSize,
                        fontWeight: el.fontWeight,
                        color: el.color,
                        fontFamily: el.type === "text" ? el.fontFamily : undefined,
                        textAlign: el.align,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.35,
                        userSelect: "text",
                      }}
                    >
                    </div>
                  )}

                  {isSelected && (
                    <>
                      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-blue-600 shadow" />
                      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-blue-600 shadow" />
                      <div className="absolute -left-1 -bottom-1 w-2 h-2 rounded-full bg-blue-600 shadow" />
                      <div className="absolute -right-1 -bottom-1 w-2 h-2 rounded-full bg-blue-600 shadow" />

                      {/* Resize handles for all elements */}
                      {!locked &&
                        ["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((handle) => {
                        const common = {
                          className: "absolute bg-blue-600 shadow cursor-pointer",
                        };
                        const base = {
                          onMouseDown: (e: React.MouseEvent) => {
                            e.stopPropagation();
                            const p2 = getPointerInPage(e);
                            if (!p2) return;
                            setResizeState({
                              id: el.id,
                              handle: handle as ResizeHandle,
                              startX: p2.x,
                              startY: p2.y,
                              startWidth: el.width,
                              startHeight: el.height,
                              startLeft: el.x,
                              startTop: el.y,
                            });
                          },
                        };

                        const size = handle.length === 1 ? { width: 4, height: 8 } : { width: 6, height: 6 };
                        const pos: Record<string, React.CSSProperties> = {
                          n: { left: "50%", top: "-4px", transform: "translateX(-50%)", cursor: "ns-resize" },
                          s: { left: "50%", bottom: "-4px", transform: "translateX(-50%)", cursor: "ns-resize" },
                          e: { right: "-4px", top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
                          w: { left: "-4px", top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" },
                          ne: { right: "-4px", top: "-4px", cursor: "nesw-resize" },
                          nw: { left: "-4px", top: "-4px", cursor: "nwse-resize" },
                          se: { right: "-4px", bottom: "-4px", cursor: "nwse-resize" },
                          sw: { left: "-4px", bottom: "-4px", cursor: "nesw-resize" },
                        };

                        return (
                          <div
                            key={handle}
                            {...base}
                            style={{
                              ...pos[handle],
                              width: size.width,
                              height: size.height,
                              borderRadius: 999,
                            }}
                            className={`${common.className}`}
                          />
                        );
                      })}

                      {/* Floating action bar */}
                      <div
                        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-gray-200 rounded-full px-2 py-1 flex items-center gap-2"
                      >
                        <button
                          className="text-xs text-gray-700 hover:text-blue-600"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            const clone = { ...el, id: crypto.randomUUID(), x: el.x + 20, y: el.y + 20 };
                            onChangeElements([...elements, clone]);
                            onSelect(clone.id);
                          }}
                        >
                          Copy
                        </button>
                        <button
                          className="text-xs text-gray-700 hover:text-blue-600"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            onChangeElements(elements.filter((it) => it.id !== el.id));
                            onSelect(null);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="text-xs text-gray-700 hover:text-blue-600"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            onChangeElements(
                              elements.map((it) => (it.id === el.id ? { ...it, locked: !it.locked } : it))
                            );
                          }}
                        >
                          {locked ? "Unlock" : "Lock"}
                        </button>
                        <button
                          className="text-xs text-gray-700 hover:text-blue-600"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            const c = window.prompt("Add comment", el.comment || "");
                            if (c !== null) {
                              onChangeElements(
                                elements.map((it) => (it.id === el.id ? { ...it, comment: c } : it))
                              );
                            }
                          }}
                        >
                          Comment
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

