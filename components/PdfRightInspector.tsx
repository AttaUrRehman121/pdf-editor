"use client";

import React from "react";
import { X, Trash2, RotateCw, RotateCcw } from "lucide-react";
import type { TextItem, ImageItem } from "@/lib/pdf-utils";

type SelectedItem = TextItem | ImageItem;

// Font family mapping for both display and selection
const fontFamilyMap: Record<string, string> = {
  "Helvetica": "Helvetica, Arial, sans-serif",
  "Arial": "Arial, Helvetica, sans-serif",
  "Times New Roman": '"Times New Roman", Times, serif',
  "Courier New": '"Courier New", Courier, monospace',
  "Georgia": "Georgia, serif",
  "Palatino": '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  "Garamond": "Garamond, serif",
  "Bookman": '"Bookman Old Style", serif',
  "Comic Sans MS": '"Comic Sans MS", cursive',
  "Trebuchet MS": '"Trebuchet MS", Helvetica, sans-serif',
  "Arial Black": '"Arial Black", Gadget, sans-serif',
  "Impact": "Impact, Charcoal, sans-serif",
  "Lucida Console": '"Lucida Console", Monaco, monospace',
  "Tahoma": "Tahoma, Geneva, sans-serif",
  "Verdana": "Verdana, Geneva, sans-serif",
  "Courier": "Courier, monospace",
  "Lucida Sans": '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  "MS Sans Serif": '"MS Sans Serif", Geneva, sans-serif',
  "MS Serif": '"MS Serif", New York, serif',
  "Symbol": "Symbol, sans-serif",
  "Wingdings": "Wingdings, sans-serif",
  "Calibri": "Calibri, Candara, Segoe, sans-serif",
  "Cambria": "Cambria, Georgia, serif",
  "Candara": "Candara, Calibri, sans-serif",
  "Consolas": "Consolas, monospace",
  "Constantia": "Constantia, Georgia, serif",
  "Corbel": "Corbel, Calibri, sans-serif",
  "Franklin Gothic": '"Franklin Gothic Medium", Arial, sans-serif',
  "Gill Sans": '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
  "Century Gothic": '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
  "Futura": "Futura, Trebuchet MS, Arial, sans-serif",
  "Geneva": "Geneva, Tahoma, Verdana, sans-serif",
  "Lucida Grande": '"Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif',
  "Monaco": "Monaco, Consolas, monospace",
  "Optima": "Optima, Segoe, Candara, sans-serif",
  "Perpetua": "Perpetua, Baskerville, serif",
  "Rockwell": "Rockwell, Courier Bold, Courier, Georgia, serif",
  "Baskerville": "Baskerville, Baskerville Old Face, serif",
  "Bodoni": "Bodoni MT, Didot, Didot LT STD, serif",
  "Didot": "Didot, Didot LT STD, serif",
  "Hoefler Text": '"Hoefler Text", Garamond, serif',
  "Minion": "Minion Pro, Garamond, serif",
  "Adobe Caslon": '"Adobe Caslon Pro", Caslon, serif',
  "Myriad": "Myriad Pro, Myriad, Helvetica, sans-serif",
  "Frutiger": "Frutiger, Frutiger Linotype, Univers, Calibri, sans-serif",
  "Univers": "Univers, Calibri, sans-serif",
  "Akzidenz Grotesk": '"Akzidenz Grotesk", Helvetica, Arial, sans-serif',
  "Avenir": "Avenir, Avenir Next, Helvetica, sans-serif",
  "DIN": "DIN, DIN Alternate, Arial, sans-serif",
  "Fira Sans": '"Fira Sans", Helvetica, Arial, sans-serif',
  "Lato": "Lato, Helvetica, Arial, sans-serif",
  "Montserrat": "Montserrat, Helvetica, Arial, sans-serif",
  "Open Sans": '"Open Sans", Helvetica, Arial, sans-serif',
  "Oswald": "Oswald, Arial, sans-serif",
  "Playfair Display": '"Playfair Display", Georgia, serif',
  "Poppins": "Poppins, Helvetica, Arial, sans-serif",
  "Raleway": "Raleway, Helvetica, Arial, sans-serif",
  "Roboto": "Roboto, Helvetica, Arial, sans-serif",
  "Source Sans Pro": '"Source Sans Pro", Helvetica, Arial, sans-serif',
  "Ubuntu": "Ubuntu, Helvetica, Arial, sans-serif",
  "Merriweather": "Merriweather, Georgia, serif",
  "Lora": "Lora, Georgia, serif",
  "PT Serif": '"PT Serif", Georgia, serif',
  "Crimson Text": '"Crimson Text", Georgia, serif',
  "Libre Baskerville": '"Libre Baskerville", Georgia, serif',
  "PT Sans": '"PT Sans", Helvetica, Arial, sans-serif',
  "Nunito": "Nunito, Helvetica, Arial, sans-serif",
  "Inter": "Inter, Helvetica, Arial, sans-serif",
  "Work Sans": '"Work Sans", Helvetica, Arial, sans-serif',
  "DM Sans": '"DM Sans", Helvetica, Arial, sans-serif',
  "Manrope": "Manrope, Helvetica, Arial, sans-serif",
  "Space Grotesk": '"Space Grotesk", Helvetica, Arial, sans-serif',
  "Plus Jakarta Sans": '"Plus Jakarta Sans", Helvetica, Arial, sans-serif',
  "Sora": "Sora, Helvetica, Arial, sans-serif",
  "Outfit": "Outfit, Helvetica, Arial, sans-serif",
  "DM Serif Display": '"DM Serif Display", Georgia, serif',
  "Cormorant": "Cormorant, Georgia, serif",
  "Playfair": '"Playfair Display", Georgia, serif',
  "Bitter": "Bitter, Georgia, serif",
  "Crimson Pro": '"Crimson Pro", Georgia, serif',
  "Source Code Pro": '"Source Code Pro", Consolas, monospace',
  "Fira Code": '"Fira Code", Consolas, monospace',
  "JetBrains Mono": '"JetBrains Mono", Consolas, monospace',
  "Roboto Mono": '"Roboto Mono", Consolas, monospace',
  "Inconsolata": "Inconsolata, Consolas, monospace",
  "Courier Prime": '"Courier Prime", Courier, monospace',
};

export function PdfRightInspector(props: {
  selectedText: TextItem | null;
  selectedImage: ImageItem | null;
  onUpdateText: (updates: Partial<TextItem>) => void;
  onUpdateImage: (updates: Partial<ImageItem>) => void;
  onDeleteText: () => void;
  onDeleteImage: () => void;
  variant?: "sidebar" | "sheet";
  containerClassName?: string;
}) {
  const {
    selectedText,
    selectedImage,
    onUpdateText,
    onUpdateImage,
    onDeleteText,
    onDeleteImage,
    variant = "sidebar",
    containerClassName,
  } = props;

  const hasSelection = selectedText || selectedImage;

  const base =
    variant === "sheet"
      ? "w-full bg-white p-4 overflow-auto"
      : "w-72 shrink-0 bg-white border-l border-gray-200 p-4 overflow-auto";

  return (
    <div className={`${base} ${containerClassName ?? ""}`.trim()}>
      <div className="text-sm font-semibold text-gray-900 mb-4">Properties</div>

      {!hasSelection && (
        <div className="text-xs text-gray-500">
          Select text or an image on the PDF to edit its properties.
        </div>
      )}

      {selectedText && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Type: <span className="text-gray-900 font-medium">Text</span>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Text Content</label>
            <textarea
              value={selectedText.text}
              onChange={(e) => onUpdateText({ text: e.target.value, hasChanged: true })}
              className="w-full text-sm text-gray-900 border border-gray-200 rounded-md px-2 py-1.5 min-h-[60px] resize-y bg-white"
              rows={3}
              style={{ color: '#111827' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              Font Size
              <input
                type="number"
                min={6}
                max={72}
                value={Math.round(selectedText.fontSize)}
                onChange={(e) =>
                  onUpdateText({ fontSize: parseFloat(e.target.value || "11"), hasChanged: true })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Font Family
              <select
                value={(() => {
                  // Get the base font name (strip Bold, Italic, etc.)
                  const baseFontName = selectedText.fontName 
                    ? selectedText.fontName.replace(/\s*(bold|italic|oblique|black|light|regular|medium|semibold|heavy|thin|extrabold|ultrabold)\s*/gi, "").trim()
                    : selectedText.fontFamily?.split(",")[0]?.trim().replace(/['"]/g, "") || "Helvetica";
                  
                  // Match to available fonts (case-insensitive)
                  const lowerBase = baseFontName.toLowerCase();
                  
                  // Comprehensive font matching
                  const fontMatches: Array<[string[], string]> = [
                    [["helvetica"], "Helvetica"],
                    [["arial"], "Arial"],
                    [["times", "new roman"], "Times New Roman"],
                    [["courier", "new"], "Courier New"],
                    [["georgia"], "Georgia"],
                    [["palatino"], "Palatino"],
                    [["garamond"], "Garamond"],
                    [["verdana"], "Verdana"],
                    [["tahoma"], "Tahoma"],
                    [["trebuchet"], "Trebuchet MS"],
                    [["calibri"], "Calibri"],
                    [["cambria"], "Cambria"],
                    [["roboto"], "Roboto"],
                    [["montserrat"], "Montserrat"],
                    [["open sans"], "Open Sans"],
                    [["lato"], "Lato"],
                    [["poppins"], "Poppins"],
                    [["raleway"], "Raleway"],
                    [["nunito"], "Nunito"],
                    [["inter"], "Inter"],
                    [["merriweather"], "Merriweather"],
                    [["lora"], "Lora"],
                    [["playfair"], "Playfair Display"],
                    [["courier"], "Courier New"],
                    [["mono", "consolas"], "Consolas"],
                    [["fira code"], "Fira Code"],
                    [["source code"], "Source Code Pro"],
                  ];
                  
                  for (const [keywords, fontName] of fontMatches) {
                    if (keywords.some(keyword => lowerBase.includes(keyword))) {
                      return fontName;
                    }
                  }
                  
                  // If no match, return the original fontName or baseFontName
                  return selectedText.fontName || baseFontName || "Helvetica";
                })()}
                onChange={(e) => {
                  const fontName = e.target.value;
                  const fontFamily = fontFamilyMap[fontName] || `${fontName}, Arial, Helvetica, sans-serif`;
                  onUpdateText({ fontName, fontFamily, hasChanged: true });
                }}
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              >
                {/* Show original font if it's not in the standard list */}
                {selectedText.fontName && 
                 (() => {
                   const baseFontName = selectedText.fontName.replace(/\s*(bold|italic|oblique|black|light|regular|medium|semibold|heavy|thin|extrabold|ultrabold)\s*/gi, "").trim();
                   const lowerBase = baseFontName.toLowerCase();
                   const allFonts = [
                     "helvetica", "arial", "times", "courier", "serif", "mono", "georgia", "palatino",
                     "garamond", "bookman", "comic", "trebuchet", "impact", "lucida", "tahoma", "verdana",
                     "calibri", "cambria", "candara", "consolas", "constantia", "corbel", "franklin", "gill",
                     "century", "futura", "geneva", "monaco", "optima", "perpetua", "rockwell", "baskerville",
                     "bodoni", "didot", "hoefler", "minion", "adobe", "myriad", "frutiger", "univers",
                     "akzidenz", "avenir", "din", "fira", "lato", "montserrat", "open", "oswald", "playfair",
                     "poppins", "raleway", "roboto", "source", "ubuntu", "merriweather", "lora", "pt",
                     "crimson", "libre", "nunito", "inter", "work", "dm", "manrope", "space", "plus", "sora",
                     "outfit", "cormorant", "bitter", "jetbrains", "inconsolata", "courier prime"
                   ];
                   const isStandard = allFonts.some(font => lowerBase.includes(font));
                   return !isStandard;
                 })() && (
                  <option value={selectedText.fontName} key="original">
                    {selectedText.fontName} (Original)
                  </option>
                )}
                <optgroup label="Sans-Serif">
                  <option value="Helvetica" style={{ fontFamily: fontFamilyMap["Helvetica"] }}>Helvetica</option>
                  <option value="Arial" style={{ fontFamily: fontFamilyMap["Arial"] }}>Arial</option>
                  <option value="Arial Black" style={{ fontFamily: fontFamilyMap["Arial Black"] }}>Arial Black</option>
                  <option value="Verdana" style={{ fontFamily: fontFamilyMap["Verdana"] }}>Verdana</option>
                  <option value="Tahoma" style={{ fontFamily: fontFamilyMap["Tahoma"] }}>Tahoma</option>
                  <option value="Trebuchet MS" style={{ fontFamily: fontFamilyMap["Trebuchet MS"] }}>Trebuchet MS</option>
                  <option value="Impact" style={{ fontFamily: fontFamilyMap["Impact"] }}>Impact</option>
                  <option value="Gill Sans" style={{ fontFamily: fontFamilyMap["Gill Sans"] }}>Gill Sans</option>
                  <option value="Lucida Sans" style={{ fontFamily: fontFamilyMap["Lucida Sans"] }}>Lucida Sans</option>
                  <option value="Lucida Grande" style={{ fontFamily: fontFamilyMap["Lucida Grande"] }}>Lucida Grande</option>
                  <option value="Calibri" style={{ fontFamily: fontFamilyMap["Calibri"] }}>Calibri</option>
                  <option value="Candara" style={{ fontFamily: fontFamilyMap["Candara"] }}>Candara</option>
                  <option value="Corbel" style={{ fontFamily: fontFamilyMap["Corbel"] }}>Corbel</option>
                  <option value="Century Gothic" style={{ fontFamily: fontFamilyMap["Century Gothic"] }}>Century Gothic</option>
                  <option value="Franklin Gothic" style={{ fontFamily: fontFamilyMap["Franklin Gothic"] }}>Franklin Gothic</option>
                  <option value="Futura" style={{ fontFamily: fontFamilyMap["Futura"] }}>Futura</option>
                  <option value="Optima" style={{ fontFamily: fontFamilyMap["Optima"] }}>Optima</option>
                  <option value="Myriad" style={{ fontFamily: fontFamilyMap["Myriad"] }}>Myriad</option>
                  <option value="Frutiger" style={{ fontFamily: fontFamilyMap["Frutiger"] }}>Frutiger</option>
                  <option value="Univers" style={{ fontFamily: fontFamilyMap["Univers"] }}>Univers</option>
                  <option value="Akzidenz Grotesk" style={{ fontFamily: fontFamilyMap["Akzidenz Grotesk"] }}>Akzidenz Grotesk</option>
                  <option value="Avenir" style={{ fontFamily: fontFamilyMap["Avenir"] }}>Avenir</option>
                  <option value="DIN" style={{ fontFamily: fontFamilyMap["DIN"] }}>DIN</option>
                  <option value="Fira Sans" style={{ fontFamily: fontFamilyMap["Fira Sans"] }}>Fira Sans</option>
                  <option value="Lato" style={{ fontFamily: fontFamilyMap["Lato"] }}>Lato</option>
                  <option value="Montserrat" style={{ fontFamily: fontFamilyMap["Montserrat"] }}>Montserrat</option>
                  <option value="Open Sans" style={{ fontFamily: fontFamilyMap["Open Sans"] }}>Open Sans</option>
                  <option value="Oswald" style={{ fontFamily: fontFamilyMap["Oswald"] }}>Oswald</option>
                  <option value="Poppins" style={{ fontFamily: fontFamilyMap["Poppins"] }}>Poppins</option>
                  <option value="Raleway" style={{ fontFamily: fontFamilyMap["Raleway"] }}>Raleway</option>
                  <option value="Roboto" style={{ fontFamily: fontFamilyMap["Roboto"] }}>Roboto</option>
                  <option value="Source Sans Pro" style={{ fontFamily: fontFamilyMap["Source Sans Pro"] }}>Source Sans Pro</option>
                  <option value="Ubuntu" style={{ fontFamily: fontFamilyMap["Ubuntu"] }}>Ubuntu</option>
                  <option value="PT Sans" style={{ fontFamily: fontFamilyMap["PT Sans"] }}>PT Sans</option>
                  <option value="Nunito" style={{ fontFamily: fontFamilyMap["Nunito"] }}>Nunito</option>
                  <option value="Inter" style={{ fontFamily: fontFamilyMap["Inter"] }}>Inter</option>
                  <option value="Work Sans" style={{ fontFamily: fontFamilyMap["Work Sans"] }}>Work Sans</option>
                  <option value="DM Sans" style={{ fontFamily: fontFamilyMap["DM Sans"] }}>DM Sans</option>
                  <option value="Manrope" style={{ fontFamily: fontFamilyMap["Manrope"] }}>Manrope</option>
                  <option value="Space Grotesk" style={{ fontFamily: fontFamilyMap["Space Grotesk"] }}>Space Grotesk</option>
                  <option value="Plus Jakarta Sans" style={{ fontFamily: fontFamilyMap["Plus Jakarta Sans"] }}>Plus Jakarta Sans</option>
                  <option value="Sora" style={{ fontFamily: fontFamilyMap["Sora"] }}>Sora</option>
                  <option value="Outfit" style={{ fontFamily: fontFamilyMap["Outfit"] }}>Outfit</option>
                </optgroup>
                <optgroup label="Serif">
                  <option value="Times New Roman" style={{ fontFamily: fontFamilyMap["Times New Roman"] }}>Times New Roman</option>
                  <option value="Georgia" style={{ fontFamily: fontFamilyMap["Georgia"] }}>Georgia</option>
                  <option value="Palatino" style={{ fontFamily: fontFamilyMap["Palatino"] }}>Palatino</option>
                  <option value="Garamond" style={{ fontFamily: fontFamilyMap["Garamond"] }}>Garamond</option>
                  <option value="Bookman" style={{ fontFamily: fontFamilyMap["Bookman"] }}>Bookman</option>
                  <option value="Baskerville" style={{ fontFamily: fontFamilyMap["Baskerville"] }}>Baskerville</option>
                  <option value="Bodoni" style={{ fontFamily: fontFamilyMap["Bodoni"] }}>Bodoni</option>
                  <option value="Didot" style={{ fontFamily: fontFamilyMap["Didot"] }}>Didot</option>
                  <option value="Hoefler Text" style={{ fontFamily: fontFamilyMap["Hoefler Text"] }}>Hoefler Text</option>
                  <option value="Minion" style={{ fontFamily: fontFamilyMap["Minion"] }}>Minion</option>
                  <option value="Adobe Caslon" style={{ fontFamily: fontFamilyMap["Adobe Caslon"] }}>Adobe Caslon</option>
                  <option value="Perpetua" style={{ fontFamily: fontFamilyMap["Perpetua"] }}>Perpetua</option>
                  <option value="Rockwell" style={{ fontFamily: fontFamilyMap["Rockwell"] }}>Rockwell</option>
                  <option value="Cambria" style={{ fontFamily: fontFamilyMap["Cambria"] }}>Cambria</option>
                  <option value="Constantia" style={{ fontFamily: fontFamilyMap["Constantia"] }}>Constantia</option>
                  <option value="Merriweather" style={{ fontFamily: fontFamilyMap["Merriweather"] }}>Merriweather</option>
                  <option value="Lora" style={{ fontFamily: fontFamilyMap["Lora"] }}>Lora</option>
                  <option value="PT Serif" style={{ fontFamily: fontFamilyMap["PT Serif"] }}>PT Serif</option>
                  <option value="Crimson Text" style={{ fontFamily: fontFamilyMap["Crimson Text"] }}>Crimson Text</option>
                  <option value="Libre Baskerville" style={{ fontFamily: fontFamilyMap["Libre Baskerville"] }}>Libre Baskerville</option>
                  <option value="Playfair Display" style={{ fontFamily: fontFamilyMap["Playfair Display"] }}>Playfair Display</option>
                  <option value="Playfair" style={{ fontFamily: fontFamilyMap["Playfair"] }}>Playfair</option>
                  <option value="DM Serif Display" style={{ fontFamily: fontFamilyMap["DM Serif Display"] }}>DM Serif Display</option>
                  <option value="Cormorant" style={{ fontFamily: fontFamilyMap["Cormorant"] }}>Cormorant</option>
                  <option value="Bitter" style={{ fontFamily: fontFamilyMap["Bitter"] }}>Bitter</option>
                  <option value="Crimson Pro" style={{ fontFamily: fontFamilyMap["Crimson Pro"] }}>Crimson Pro</option>
                </optgroup>
                <optgroup label="Monospace">
                  <option value="Courier New" style={{ fontFamily: fontFamilyMap["Courier New"] }}>Courier New</option>
                  <option value="Courier" style={{ fontFamily: fontFamilyMap["Courier"] }}>Courier</option>
                  <option value="Lucida Console" style={{ fontFamily: fontFamilyMap["Lucida Console"] }}>Lucida Console</option>
                  <option value="Monaco" style={{ fontFamily: fontFamilyMap["Monaco"] }}>Monaco</option>
                  <option value="Consolas" style={{ fontFamily: fontFamilyMap["Consolas"] }}>Consolas</option>
                  <option value="Source Code Pro" style={{ fontFamily: fontFamilyMap["Source Code Pro"] }}>Source Code Pro</option>
                  <option value="Fira Code" style={{ fontFamily: fontFamilyMap["Fira Code"] }}>Fira Code</option>
                  <option value="JetBrains Mono" style={{ fontFamily: fontFamilyMap["JetBrains Mono"] }}>JetBrains Mono</option>
                  <option value="Roboto Mono" style={{ fontFamily: fontFamilyMap["Roboto Mono"] }}>Roboto Mono</option>
                  <option value="Inconsolata" style={{ fontFamily: fontFamilyMap["Inconsolata"] }}>Inconsolata</option>
                  <option value="Courier Prime" style={{ fontFamily: fontFamilyMap["Courier Prime"] }}>Courier Prime</option>
                </optgroup>
                <optgroup label="Decorative">
                  <option value="Comic Sans MS" style={{ fontFamily: fontFamilyMap["Comic Sans MS"] }}>Comic Sans MS</option>
                  <option value="MS Sans Serif" style={{ fontFamily: fontFamilyMap["MS Sans Serif"] }}>MS Sans Serif</option>
                  <option value="MS Serif" style={{ fontFamily: fontFamilyMap["MS Serif"] }}>MS Serif</option>
                </optgroup>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedText.isBold}
                onChange={(e) => onUpdateText({ isBold: e.target.checked, hasChanged: true })}
                className="rounded"
              />
              Bold
            </label>
            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedText.isItalic}
                onChange={(e) => onUpdateText({ isItalic: e.target.checked, hasChanged: true })}
                className="rounded"
              />
              Italic
            </label>
          </div>

          <label className="text-xs text-gray-600 block">
            Text Color
            <input
              type="color"
              value={
                selectedText.textColor && selectedText.textColor.startsWith("#")
                  ? selectedText.textColor
                  : selectedText.textColor && selectedText.textColor.startsWith("rgb")
                  ? (() => {
                      const match = selectedText.textColor.match(/\d+/g);
                      if (match && match.length >= 3) {
                        const r = parseInt(match[0]).toString(16).padStart(2, "0");
                        const g = parseInt(match[1]).toString(16).padStart(2, "0");
                        const b = parseInt(match[2]).toString(16).padStart(2, "0");
                        return `#${r}${g}${b}`;
                      }
                      return "#000000";
                    })()
                  : "#000000"
              }
              onChange={(e) => {
                const hex = e.target.value;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                onUpdateText({ textColor: `rgb(${r}, ${g}, ${b})`, hasChanged: true });
              }}
              className="mt-1 w-full h-10 border border-gray-200 rounded cursor-pointer"
            />
          </label>

          <label className="text-xs text-gray-600 block">
            Background Color
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={
                  selectedText.backgroundColor && selectedText.backgroundColor !== "transparent" && selectedText.backgroundColor.startsWith("#")
                    ? selectedText.backgroundColor
                    : selectedText.backgroundColor && selectedText.backgroundColor !== "transparent" && selectedText.backgroundColor.startsWith("rgb")
                    ? (() => {
                        const match = selectedText.backgroundColor.match(/\d+/g);
                        if (match && match.length >= 3) {
                          const r = parseInt(match[0]).toString(16).padStart(2, "0");
                          const g = parseInt(match[1]).toString(16).padStart(2, "0");
                          const b = parseInt(match[2]).toString(16).padStart(2, "0");
                          return `#${r}${g}${b}`;
                        }
                        return "#ffffff";
                      })()
                    : "#ffffff"
                }
                onChange={(e) => {
                  const hex = e.target.value;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  onUpdateText({ backgroundColor: `rgb(${r}, ${g}, ${b})`, hasChanged: true });
                }}
                className="flex-1 h-10 border border-gray-200 rounded cursor-pointer"
              />
              <button
                onClick={() => onUpdateText({ backgroundColor: "transparent", hasChanged: true })}
                className="px-3 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 whitespace-nowrap"
                title="Remove background"
              >
                Clear
              </button>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              X Position
              <input
                type="number"
                value={Math.round(selectedText.x)}
                onChange={(e) =>
                  onUpdateText({ x: parseFloat(e.target.value || "0"), hasChanged: true })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Y Position
              <input
                type="number"
                value={Math.round(selectedText.y)}
                onChange={(e) =>
                  onUpdateText({ y: parseFloat(e.target.value || "0"), hasChanged: true })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
          </div>

          <button
            onClick={onDeleteText}
            className="w-full px-3 py-2 rounded-lg border border-red-100 text-red-600 text-sm hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Delete Text
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Type: <span className="text-gray-900 font-medium">Image</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-gray-600">
              X Position
              <input
                type="number"
                value={Math.round(selectedImage.x)}
                onChange={(e) =>
                  onUpdateImage({ x: parseFloat(e.target.value || "0") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Y Position
              <input
                type="number"
                value={Math.round(selectedImage.y)}
                onChange={(e) =>
                  onUpdateImage({ y: parseFloat(e.target.value || "0") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Width
              <input
                type="number"
                min={10}
                value={Math.round(selectedImage.width)}
                onChange={(e) =>
                  onUpdateImage({ width: parseFloat(e.target.value || "100") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
            <label className="text-xs text-gray-600">
              Height
              <input
                type="number"
                min={10}
                value={Math.round(selectedImage.height)}
                onChange={(e) =>
                  onUpdateImage({ height: parseFloat(e.target.value || "100") })
                }
                className="mt-1 w-full text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
              />
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-gray-600 block">
              Rotation
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateImage({ rotation: ((selectedImage.rotation || 0) - 15) % 360 })
                  }
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-100"
                  title="Rotate left 15°"
                >
                  <RotateCcw size={16} className="text-gray-700" />
                </button>
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={Math.round(selectedImage.rotation || 0)}
                  onChange={(e) =>
                    onUpdateImage({ rotation: parseFloat(e.target.value || "0") % 360 })
                  }
                  className="flex-1 text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                />
                <span className="text-xs text-gray-500">°</span>
                <button
                  onClick={() =>
                    onUpdateImage({ rotation: ((selectedImage.rotation || 0) + 15) % 360 })
                  }
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-100"
                  title="Rotate right 15°"
                >
                  <RotateCw size={16} className="text-gray-700" />
                </button>
              </div>
            </label>

            <label className="text-xs text-gray-600 block">
              Opacity
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round((selectedImage.opacity ?? 1) * 100)}
                  onChange={(e) =>
                    onUpdateImage({ opacity: parseFloat(e.target.value) / 100 })
                  }
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-12 text-right">
                  {Math.round((selectedImage.opacity ?? 1) * 100)}%
                </span>
              </div>
            </label>

            <label className="text-xs text-gray-600 block">
              Border Radius (Roundness)
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(selectedImage.borderRadius || 0)}
                  onChange={(e) =>
                    onUpdateImage({ borderRadius: parseFloat(e.target.value || "0") })
                  }
                  className="flex-1 text-xs text-gray-900 border border-gray-200 rounded-md px-2 py-1 bg-white"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </label>
          </div>

          <div className="px-3 py-2 rounded-lg border border-gray-200 bg-white">
            <div className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onUpdateImage({ width: selectedImage.width * 1.1, height: selectedImage.height * 1.1 })
                }
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                +10%
              </button>
              <button
                onClick={() =>
                  onUpdateImage({ width: selectedImage.width * 0.9, height: selectedImage.height * 0.9 })
                }
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                -10%
              </button>
            </div>
          </div>

          <button
            onClick={onDeleteImage}
            className="w-full px-3 py-2 rounded-lg border border-red-100 text-red-600 text-sm hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Delete Image
          </button>
        </div>
      )}
    </div>
  );
}
