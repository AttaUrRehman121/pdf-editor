import type { CvElement } from "./cv-model";
import { PAGE_DIMENSIONS } from "./cv-model";

// Modern two-column blue template (used for demo/preload)
export function makeModernTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
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
    borderRadius: 0,
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
    borderRadius: 0,
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
    listStyle: "none",
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
    listStyle: "none",
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
    listStyle: "none",
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
    listStyle: "none",
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
    listStyle: "none",
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
    listStyle: "none",
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
    listStyle: "bullet",
    color: "#E2E8F0",
  });

  // Main sections
  const mainX = Math.round(width * 0.33) + 24;
  const mainW = width - (Math.round(width * 0.33) + 48);

  const pill = (y: number, label: string) => {
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
    const pillId = crypto.randomUUID();
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
      listStyle: "none",
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
    text: "A short professional summary. Mention years of experience, key strengths, and measurable outcomes.",
    fontSize: 12,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
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
    listStyle: "bullet",
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
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

