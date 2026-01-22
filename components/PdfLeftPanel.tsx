"use client";

import React from "react";
import { Upload, Image as ImageIcon, FileText, Settings, Smile, AlignLeft } from "lucide-react";
import { EmojiIconPicker } from "@/components/EmojiIconPicker";

type PdfLeftTab = "upload" | "text" | "images" | "emojis" | "tools";

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";
  color: string;
}

export function PdfLeftPanel(props: {
  tab: PdfLeftTab;
  onChangeTab: (t: PdfLeftTab) => void;
  onUploadPdf: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddEmoji: (emoji: string, x: number, y: number) => void;
  fileUrl: string | null;
  pdfFileName: string | null;
  totalPages: number;
  currentPage: number;
  onFileClick: () => void;
  frontPageThumbnail: string | null;
  watermark: WatermarkSettings;
  onWatermarkChange: (watermark: WatermarkSettings) => void;
}) {
  const { tab, onChangeTab, onUploadPdf, onAddImage, onAddEmoji, fileUrl, pdfFileName, totalPages, currentPage, onFileClick, frontPageThumbnail, watermark, onWatermarkChange } = props;

  return (
    <div className="flex border-r border-gray-200 bg-white">
      {/* Icon rail */}
      <div className="w-14 flex flex-col items-center py-3 gap-2 border-r border-gray-100">
        <button
          onClick={() => onChangeTab("upload")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "upload" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Upload"
        >
          <Upload size={18} />
        </button>
        <button
          onClick={() => onChangeTab("text")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "text" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Text Tools"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => onChangeTab("images")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "images" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Images"
        >
          <ImageIcon size={18} />
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
          onClick={() => onChangeTab("tools")}
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            tab === "tools" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
          }`}
          title="Tools"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Panel */}
      <div className="w-72 p-4 overflow-auto">
        {tab === "upload" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Upload & Actions</div>
              <div className="text-xs text-gray-500">Manage your PDF document</div>
            </div>
            <div className="space-y-2">
              <label className="w-full cursor-pointer">
                <div className="w-full px-3 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/40 text-center transition-colors">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <div className="text-sm font-semibold text-gray-900">Upload PDF</div>
                  <div className="text-xs text-gray-500">Click to select file</div>
                </div>
                <input type="file" accept=".pdf" className="hidden" onChange={onUploadPdf} />
              </label>
              {fileUrl && pdfFileName && (
                <div 
                  onClick={onFileClick}
                  className="rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors overflow-hidden"
                >
                  {frontPageThumbnail && (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={frontPageThumbnail}
                        alt="PDF Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="px-3 py-2">
                    <div className="text-xs font-semibold text-green-800 truncate" title={pdfFileName}>
                      {pdfFileName}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : "Ready to edit"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "text" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Text Tools</div>
              <div className="text-xs text-gray-500">Edit text on your PDF</div>
            </div>
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-600 mb-1">How to edit text:</div>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Click on any text in the PDF</li>
                  <li>Edit directly in place</li>
                  <li>Use formatting toolbar when selected</li>
                </ul>
              </div>
              <div className="px-3 py-2 rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-900 mb-1">Text Formatting</div>
                <div className="text-xs text-gray-500">
                  Select text to access font, size, color, and bold controls
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "images" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Images</div>
              <div className="text-xs text-gray-500">Add and manage images</div>
            </div>
            <div className="space-y-2">
              {fileUrl ? (
                <label className="w-full cursor-pointer">
                  <div className="w-full px-3 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-center transition-colors">
                    <ImageIcon size={24} className="mx-auto mb-2 text-gray-400" />
                    <div className="text-sm font-semibold text-gray-900">Add Image</div>
                    <div className="text-xs text-gray-500">Upload image to PDF</div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={onAddImage} />
                </label>
              ) : (
                <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="text-xs text-gray-500">Upload a PDF first to add images</div>
                </div>
              )}
              <div className="px-3 py-2 rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-900 mb-1">Image Controls</div>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Click to select image</li>
                  <li>Drag to reposition</li>
                  <li>Use resize buttons when selected</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "emojis" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Emojis & Icons</div>
              <div className="text-xs text-gray-500">Drag and drop onto PDF</div>
            </div>
            {fileUrl ? (
              <EmojiIconPicker
                onSelect={(emoji) => {
                  // Add emoji at center of PDF (will be positioned by drag)
                  // This is just for click-to-add, drag handles positioning
                  onAddEmoji(emoji, window.innerWidth / 2, window.innerHeight / 2);
                }}
              />
            ) : (
              <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Upload a PDF first to add emojis</div>
              </div>
            )}
          </div>
        )}

        {tab === "tools" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Tools & Settings</div>
              <div className="text-xs text-gray-500">PDF editor options</div>
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
            
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-900 mb-1">Keyboard Shortcuts</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Click text to edit</div>
                  <div>Drag images to move</div>
                  <div>Select to format</div>
                </div>
              </div>
              <div className="px-3 py-2 rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-900 mb-1">Tips</div>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Text edits are saved automatically</li>
                  <li>Download to save changes</li>
                  <li>Images can be resized and moved</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
