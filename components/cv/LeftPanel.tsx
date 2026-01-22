"use client";

import React from "react";
import { LayoutTemplate, Shapes, Type, Smile } from "lucide-react";
import type { CvElement } from "@/lib/cv-model";
import { addBodyTextElement, addShapeElement, addTextElement } from "@/lib/cv-model";
import { EmojiIconPicker } from "@/components/EmojiIconPicker";
import {
  makeModernTemplate,
  makeClassicSingleColumnTemplate,
  makeMinimalistCleanTemplate,
  makeProfessionalTwoColumnTemplate,
  makeExecutiveSingleColumnTemplate,
  makeModernSingleColumnTemplate,
  makeTraditionalFormatTemplate,
  makeSimpleTwoColumnTemplate,
  makeCleanMinimalTemplate,
  makeStandardProfessionalTemplate,
  makeContemporarySingleColumnTemplate,
  makeBalancedTwoColumnTemplate,
  makeSimpleCleanFormatTemplate,
} from "@/lib/cv-templates";

import type { LeftTab } from "./CvDesigner";

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
        <button
          onClick={() => onChangeTab("emojis")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "emojis" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Emojis & Icons"
        >
          <Smile size={18} />
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
              <div className="text-xs text-gray-500">ATS-friendly predesigned layouts</div>
            </div>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <button
                onClick={() => onApplyTemplate(makeModernTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Modern Two-Column (A4)</div>
                <div className="text-xs text-gray-500">Premium look, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeModernTemplate("LETTER"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Modern Two-Column (Letter)</div>
                <div className="text-xs text-gray-500">US Letter size, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeClassicSingleColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Classic Single Column</div>
                <div className="text-xs text-gray-500">Traditional format, ATS-optimized</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeMinimalistCleanTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Minimalist Clean</div>
                <div className="text-xs text-gray-500">Ultra clean, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeProfessionalTwoColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Professional Two-Column</div>
                <div className="text-xs text-gray-500">Traditional sidebar, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeExecutiveSingleColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Executive Single Column</div>
                <div className="text-xs text-gray-500">Executive style, ATS-optimized</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeModernSingleColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Modern Single Column</div>
                <div className="text-xs text-gray-500">Contemporary design, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeTraditionalFormatTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Traditional Format</div>
                <div className="text-xs text-gray-500">Classic layout, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeSimpleTwoColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Simple Two-Column</div>
                <div className="text-xs text-gray-500">Clean sidebar, ATS-optimized</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeCleanMinimalTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Clean Minimal</div>
                <div className="text-xs text-gray-500">Minimal design, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeStandardProfessionalTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Standard Professional</div>
                <div className="text-xs text-gray-500">Professional format, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeContemporarySingleColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Contemporary Single Column</div>
                <div className="text-xs text-gray-500">Modern style, ATS-optimized</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeBalancedTwoColumnTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Balanced Two-Column</div>
                <div className="text-xs text-gray-500">Balanced layout, ATS-friendly</div>
              </button>
              <button
                onClick={() => onApplyTemplate(makeSimpleCleanFormatTemplate("A4"))}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-left"
              >
                <div className="text-sm font-semibold text-gray-900">Simple Clean Format</div>
                <div className="text-xs text-gray-500">Simple & clean, ATS-friendly</div>
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

        {tab === "emojis" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Emojis & Icons</div>
              <div className="text-xs text-gray-500">Drag and drop onto canvas</div>
            </div>
            <EmojiIconPicker
              onSelect={(emoji) => {
                const page = { id: crypto.randomUUID(), elements: [] };
                const next = addTextElement(page, {
                  text: emoji,
                  fontSize: 24,
                  height: 32,
                  width: 40,
                  x: 200,
                  y: 200,
                });
                onAddElements(next.elements);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

