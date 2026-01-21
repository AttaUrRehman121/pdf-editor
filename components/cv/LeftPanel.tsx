"use client";

import React from "react";
import { LayoutTemplate, Shapes, Type } from "lucide-react";
import type { CvElement } from "@/lib/cv-model";
import { addBodyTextElement, addShapeElement, addTextElement, PAGE_DIMENSIONS } from "@/lib/cv-model";

import type { LeftTab } from "./CvDesigner";

function makeModernTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";

  // Sidebar background
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: Math.round(width * 0.33),
    height,
    zIndex: 0,
    fill: "#0B1220",
  });

  // Header strip
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: Math.round(width * 0.33),
    y: 0,
    width: width - Math.round(width * 0.33),
    height: 150,
    zIndex: 0,
    fill: "#F8FAFC",
  });

  // Accent pill
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: Math.round(width * 0.33) + 24,
    y: 26,
    width: 96,
    height: 10,
    zIndex: 1,
    fill: "#2563EB",
    borderRadius: 999,
  });

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: Math.round(width * 0.33) + 24,
    y: 44,
    width: width - (Math.round(width * 0.33) + 48),
    height: 52,
    zIndex: 30,
    text: "Your Name",
    fontSize: 34,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    color: "#0F172A",
  });

  // Role line
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: Math.round(width * 0.33) + 24,
    y: 96,
    width: width - (Math.round(width * 0.33) + 48),
    height: 22,
    zIndex: 25,
    text: "Job Title • Specialty • Keywords",
    fontSize: 12,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#334155",
  });

  // Contact line
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: Math.round(width * 0.33) + 24,
    y: 118,
    width: width - (Math.round(width * 0.33) + 48),
    height: 24,
    zIndex: 25,
    text: "City • +44 7700 900000 • you@email.com • linkedin.com/in/you",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#475569",
  });

  // Sidebar headings
  const sidebarX = 24;
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: sidebarX,
    y: 40,
    width: Math.round(width * 0.33) - 48,
    height: 18,
    zIndex: 20,
    text: "PROFILE",
    fontSize: 10,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    color: "#93C5FD",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: sidebarX,
    y: 62,
    width: Math.round(width * 0.33) - 48,
    height: 140,
    zIndex: 20,
    text:
      "Short summary that highlights your strengths, impact, and what role you want next. Keep it 3–5 lines.",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#E2E8F0",
  });

  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: sidebarX,
    y: 220,
    width: Math.round(width * 0.33) - 48,
    height: 18,
    zIndex: 20,
    text: "SKILLS",
    fontSize: 10,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    color: "#93C5FD",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: sidebarX,
    y: 242,
    width: Math.round(width * 0.33) - 48,
    height: 160,
    zIndex: 20,
    text: "• Skill one\n• Skill two\n• Skill three\n• Tooling & Methods\n• Soft skills",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#E2E8F0",
  });

  // Main sections (simple)
  const mainX = Math.round(width * 0.33) + 24;
  const mainW = width - (Math.round(width * 0.33) + 48);

  // Section pill as text-only (fill is done with shape)
  const pill = (y: number, label: string) => {
    const pillId = crypto.randomUUID();
    const bgId = crypto.randomUUID();
    elements.push({
      id: bgId,
      type: "shape",
      x: mainX,
      y,
      width: mainW,
      height: 28,
      zIndex: 5,
      fill: "#EEF2FF",
      borderRadius: 999,
    });
    elements.push({
      id: pillId,
      type: "text",
      x: mainX + 14,
      y: y + 7,
      width: mainW - 28,
      height: 18,
      zIndex: 10,
      text: label.toUpperCase(),
      fontSize: 11,
      fontWeight: "bold",
      align: "left",
      fontFamily: baseFont,
      color: "#1E3A8A",
    });
  };

  pill(170, "Summary");
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 206,
    width: mainW,
    height: 90,
    zIndex: 10,
    text:
      "A short professional summary. Mention years of experience, key strengths, and measurable outcomes.",
    fontSize: 12,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#334155",
  });

  pill(310, "Experience");
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 346,
    width: mainW,
    height: 200,
    zIndex: 10,
    text:
      "Company — Role (YYYY–YYYY)\n• Achievement with numbers.\n• What you improved.\n• Tools/skills.\n\nCompany — Role (YYYY–YYYY)\n• Achievement.\n• Achievement.",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#334155",
  });

  pill(570, "Education");
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 606,
    width: mainW,
    height: 70,
    zIndex: 10,
    text: "Degree — University\nYYYY–YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    color: "#334155",
  });

  return elements;
}

export function LeftPanel(props: {
  tab: LeftTab;
  onChangeTab: (t: LeftTab) => void;
  onClearCanvas: () => void;
  onApplyTemplate: (elements: CvElement[]) => void;
  onAddElements: (elements: CvElement[]) => void;
}) {
  const { tab, onChangeTab, onClearCanvas, onApplyTemplate, onAddElements } = props;

  return (
    <div className="flex border-r border-gray-200 bg-white">
      {/* Icon rail */}
      <div className="w-14 flex flex-col items-center py-3 gap-2 border-r border-gray-100">
        <button
          onClick={() => onChangeTab("text")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "text" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Text"
        >
          <Type size={18} />
        </button>
        <button
          onClick={() => onChangeTab("elements")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "elements" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Elements"
        >
          <Shapes size={18} />
        </button>
        <button
          onClick={() => onChangeTab("templates")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "templates" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Templates"
        >
          <LayoutTemplate size={18} />
        </button>
      </div>

      {/* Panel */}
      <div className="w-72 p-4 overflow-auto">
        {tab === "text" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Text</div>
              <div className="text-xs text-gray-600">Text styles</div>
            </div>
            <div className="space-y-2">
              <button
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ preset: "text_heading" })
                  )
                }
                onClick={() => {
                  // Create via helpers for consistent defaults
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addTextElement(page, { text: "Heading", fontSize: 32, height: 44 });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold"
              >
                <div className="text-sm font-semibold text-gray-900">Heading</div>
              </button>
              <button
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ preset: "text_subheading" })
                  )
                }
                onClick={() => {
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addTextElement(page, {
                    text: "Subheading",
                    fontSize: 18,
                    fontWeight: "bold",
                    height: 28,
                    color: "#0F172A",
                  });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold"
              >
                <div className="text-sm font-medium text-gray-900">Subheading</div>
              </button>
              <button
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ preset: "text_body" })
                  )
                }
                onClick={() => {
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addBodyTextElement(page, { text: "Body text", fontSize: 12, height: 70 });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900"
              >
                <div className="text-sm text-gray-900">Body text</div>
              </button>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onClearCanvas}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
              >
                Clear canvas
              </button>
            </div>
          </div>
        )}

        {tab === "elements" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Elements</div>
              <div className="text-xs text-gray-600">Add shapes & blocks</div>
            </div>
            <div className="space-y-2">
              <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ preset: "card" }))}
                onClick={() => {
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addShapeElement(page, { width: 240, height: 120, fill: "#EEF2FF", borderRadius: 12, zIndex: 0 });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900"
              >
                <div className="text-sm font-medium text-gray-900">Card</div>
                <div className="text-xs text-gray-700">Background panel</div>
              </button>
              <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ preset: "accent" }))}
                onClick={() => {
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addShapeElement(page, {
                    width: 12,
                    height: 320,
                    fill: "#2563EB",
                    borderRadius: 999,
                    zIndex: 0,
                  });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900"
              >
                <div className="text-sm font-medium text-gray-900">Accent bar</div>
                <div className="text-xs text-gray-700">Vertical highlight</div>
              </button>
              <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ preset: "pill" }))}
                onClick={() => {
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addShapeElement(page, {
                    width: 520,
                    height: 36,
                    fill: "#E4E9FF",
                    borderRadius: 999,
                    zIndex: 0,
                  });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900"
              >
                <div className="text-sm font-medium text-gray-900">Pill bar</div>
                <div className="text-xs text-gray-700">Rounded section bar</div>
              </button>
              <button
                draggable
                onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ preset: "line" }))}
                onClick={() => {
                  const page = { id: crypto.randomUUID(), elements: [] };
                  const next = addShapeElement(page, {
                    width: 400,
                    height: 2,
                    fill: "#D0D5DD",
                    borderRadius: 999,
                    zIndex: 0,
                  });
                  onAddElements(next.elements);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900"
              >
                <div className="text-sm font-medium text-gray-900">Line</div>
                <div className="text-xs text-gray-700">Thin separator line</div>
              </button>
            </div>
          </div>
        )}

        {tab === "templates" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Templates</div>
              <div className="text-xs text-gray-500">Start from a modern layout</div>
            </div>
            <button
              onClick={() => onApplyTemplate(makeModernTemplate("A4"))}
              className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
            >
              <div className="text-sm font-semibold text-gray-900">Modern template (A4)</div>
              <div className="text-xs text-gray-500">Two-column, premium look</div>
            </button>
            <button
              onClick={() => onApplyTemplate(makeModernTemplate("LETTER"))}
              className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
            >
              <div className="text-sm font-semibold text-gray-900">Modern template (Letter)</div>
              <div className="text-xs text-gray-500">Sized for US Letter</div>
            </button>
            <button
              onClick={onClearCanvas}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
            >
              Clear canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

