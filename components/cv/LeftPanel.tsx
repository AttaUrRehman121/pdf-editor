"use client";

import React from "react";
import { LayoutTemplate, Shapes, Type, Smile, Image as ImageIcon, Settings } from "lucide-react";
import type { CvElement } from "@/lib/cv-model";
import { addBodyTextElement, addShapeElement, addTextElement, addImageElement } from "@/lib/cv-model";
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

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";
  color: string;
}

export function LeftPanel(props: {
  tab: LeftTab;
  onChangeTab: (t: LeftTab) => void;
  onClearCanvas: () => void;
  onApplyTemplate: (elements: CvElement[]) => void;
  onAddElements: (elements: CvElement[]) => void;
  watermark: WatermarkSettings;
  onWatermarkChange: (watermark: WatermarkSettings) => void;
}) {
  const { tab, onChangeTab, onClearCanvas, onApplyTemplate, onAddElements, watermark, onWatermarkChange } = props;

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
        <button
          onClick={() => onChangeTab("settings")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "settings" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Settings"
        >
          <Settings size={18} />
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
              
              <div className="pt-2 border-t border-gray-100">
                <label className="w-full cursor-pointer">
                  <div className="w-full px-3 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-center transition-colors">
                    <ImageIcon size={20} className="mx-auto mb-1 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900">Upload Photo</div>
                    <div className="text-xs text-gray-500">Add image to canvas</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const imageData = event.target?.result as string;
                        const img = new Image();
                        img.onload = () => {
                          const page = { id: crypto.randomUUID(), elements: [] };
                          const aspectRatio = img.width / img.height;
                          const maxWidth = 300;
                          const maxHeight = 300;
                          let width = img.width;
                          let height = img.height;
                          
                          if (width > maxWidth) {
                            width = maxWidth;
                            height = width / aspectRatio;
                          }
                          if (height > maxHeight) {
                            height = maxHeight;
                            width = height * aspectRatio;
                          }
                          
                          const next = addImageElement(page, {
                            imageData,
                            width,
                            height,
                            x: 100,
                            y: 100,
                            zIndex: 10,
                          });
                          onAddElements(next.elements);
                        };
                        img.src = imageData;
                      };
                      reader.readAsDataURL(file);
                      e.target.value = ""; // Reset input
                    }}
                  />
                </label>
              </div>
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

        {tab === "settings" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Tools & Settings</div>
              <div className="text-xs text-gray-500">CV designer options</div>
            </div>
            
            {/* Watermark Settings */}
            <div className="px-3 py-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-gray-900">Watermark</div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watermark.enabled}
                    onChange={(e) => onWatermarkChange({ ...watermark, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {watermark.enabled && (
                <div className="space-y-3 mt-3">
                  <label className="text-xs text-gray-600 block">
                    Watermark Text
                    <input
                      type="text"
                      value={watermark.text}
                      onChange={(e) => onWatermarkChange({ ...watermark, text: e.target.value })}
                      placeholder="e.g., CONFIDENTIAL, DRAFT"
                      className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1.5 bg-white"
                    />
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs text-gray-600">
                      Font Size
                      <input
                        type="number"
                        min={12}
                        max={120}
                        value={watermark.fontSize}
                        onChange={(e) => onWatermarkChange({ ...watermark, fontSize: parseInt(e.target.value || "48", 10) })}
                        className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                      />
                    </label>
                    <label className="text-xs text-gray-600">
                      Opacity (%)
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={Math.round(watermark.opacity * 100)}
                        onChange={(e) => onWatermarkChange({ ...watermark, opacity: parseFloat(e.target.value || "30") / 100 })}
                        className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                      />
                    </label>
                  </div>
                  
                  <label className="text-xs text-gray-600 block">
                    Rotation (degrees)
                    <input
                      type="number"
                      min={-180}
                      max={180}
                      value={watermark.rotation}
                      onChange={(e) => onWatermarkChange({ ...watermark, rotation: parseFloat(e.target.value || "0") })}
                      className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                    />
                  </label>
                  
                  <label className="text-xs text-gray-600 block">
                    Position
                    <select
                      value={watermark.position}
                      onChange={(e) => onWatermarkChange({ ...watermark, position: e.target.value as WatermarkSettings["position"] })}
                      className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                    >
                      <option value="center">Center</option>
                      <option value="diagonal">Diagonal</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </label>
                  
                  <label className="text-xs text-gray-600 block">
                    Color
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={watermark.color}
                        onChange={(e) => onWatermarkChange({ ...watermark, color: e.target.value })}
                        className="w-10 h-9 border border-gray-200 rounded"
                      />
                      <input
                        type="text"
                        value={watermark.color}
                        onChange={(e) => onWatermarkChange({ ...watermark, color: e.target.value })}
                        className="flex-1 text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                        placeholder="#000000"
                      />
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

