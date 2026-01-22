"use client";

import React from "react";
import { Upload, Image as ImageIcon, FileText, Settings, Smile, AlignLeft } from "lucide-react";
import { EmojiIconPicker } from "@/components/EmojiIconPicker";

type PdfLeftTab = "upload" | "text" | "images" | "emojis" | "tools";

export function PdfLeftPanel(props: {
  tab: PdfLeftTab;
  onChangeTab: (t: PdfLeftTab) => void;
  onUploadPdf: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddEmoji: (emoji: string, x: number, y: number) => void;
  fileUrl: string | null;
}) {
  const { tab, onChangeTab, onUploadPdf, onAddImage, onAddEmoji, fileUrl } = props;

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
              {fileUrl && (
                <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-xs font-semibold text-green-800">PDF Loaded</div>
                  <div className="text-xs text-green-600">Ready to edit</div>
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
