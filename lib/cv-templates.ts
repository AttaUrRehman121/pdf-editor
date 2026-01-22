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

// Template 1: Teal Sidebar Professional (Like Theo Ramos - Impressive!)
export function makeClassicSingleColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const sidebarWidth = Math.round(width * 0.32);
  const mainX = sidebarWidth + 25;
  const mainWidth = width - mainX - 25;
  const tealColor = "#0D9488"; // Teal color matching screenshot

  // Teal sidebar background
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: sidebarWidth,
    height,
    zIndex: 0,
    fill: tealColor,
    borderRadius: 0,
  });

  // Name in sidebar (white text)
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 50,
    width: sidebarWidth - 40,
    height: 35,
    zIndex: 10,
    text: "THEO RAMOS",
    fontSize: 24,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });

  // Title in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 90,
    width: sidebarWidth - 40,
    height: 20,
    zIndex: 10,
    text: "Accountant",
    fontSize: 13,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });

  // CONTACTS section
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 130,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "CONTACTS",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 152,
    width: sidebarWidth - 40,
    height: 60,
    zIndex: 10,
    text: "📍 Location\nCity, State ZIP\n\n📞 Phone\n+1 (555) 123-4567\n\n✉️ Email\nyour.email@example.com",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#E0F2FE",
  });

  // SUMMARY section
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 230,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "SUMMARY",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 252,
    width: sidebarWidth - 40,
    height: 80,
    zIndex: 10,
    text: "Experienced accountant with expertise in financial reporting, budgeting, and compliance. Proven track record of delivering accurate financial analysis.",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#E0F2FE",
  });

  // SKILLS section
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 350,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 372,
    width: sidebarWidth - 40,
    height: 200,
    zIndex: 10,
    text: "• Financial Reporting\n  Expert\n• Budgeting & Forecasting\n  Expert\n• GAAP Compliance\n  Advanced\n• Tax Planning\n  Advanced\n• ERP Systems\n  Expert\n• Excel & Analytics\n  Expert",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#E0F2FE",
  });

  // Main content - WORK EXPERIENCE
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 50,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "WORK EXPERIENCE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: mainX,
    y: 72,
    width: mainWidth,
    height: 2,
    zIndex: 0,
    fill: "#CBD5E1",
    borderRadius: 0,
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 85,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "Senior Accountant",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 105,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "Company Name | Location | Jan 2020 - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 128,
    width: mainWidth,
    height: 90,
    zIndex: 10,
    text: "• Prepared monthly financial statements and reports\n• Managed budgeting process resulting in 15% cost reduction\n• Ensured GAAP compliance across all accounting processes\n• Collaborated with cross-functional teams on financial analysis",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // EDUCATION
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 240,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: mainX,
    y: 262,
    width: mainWidth,
    height: 2,
    zIndex: 0,
    fill: "#CBD5E1",
    borderRadius: 0,
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 275,
    width: mainWidth,
    height: 40,
    zIndex: 10,
    text: "Bachelor of Science in Accounting\nUniversity Name | Location | 2016-2020",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 2: Gray Sidebar Professional (Like David Miller - Impressive!)
export function makeMinimalistCleanTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const sidebarWidth = Math.round(width * 0.30);
  const mainX = sidebarWidth + 30;
  const mainWidth = width - mainX - 30;
  const grayColor = "#F1F5F9";

  // Gray sidebar background
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: sidebarWidth,
    height,
    zIndex: 0,
    fill: grayColor,
    borderRadius: 0,
  });

  // "RECOMMENDED" tag
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: width / 2 - 50,
    y: 15,
    width: 100,
    height: 16,
    zIndex: 20,
    text: "⭐ RECOMMENDED",
    fontSize: 10,
    fontWeight: "bold",
    align: "center",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#F59E0B",
  });

  // Name in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 50,
    width: sidebarWidth - 40,
    height: 30,
    zIndex: 10,
    text: "DAVID MILLER",
    fontSize: 20,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });

  // Title
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 85,
    width: sidebarWidth - 40,
    height: 18,
    zIndex: 10,
    text: "Head Waiter",
    fontSize: 12,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#475569",
  });

  // Contact info
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 115,
    width: sidebarWidth - 40,
    height: 50,
    zIndex: 10,
    text: "City, State\n+1 (555) 123-4567\nyour.email@example.com",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // EDUCATION in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 190,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 212,
    width: sidebarWidth - 40,
    height: 60,
    zIndex: 10,
    text: "2014-2018\nBachelor of Science\nin Marketing\nUniversity of California,\nBerkeley",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // SKILLS in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 290,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 312,
    width: sidebarWidth - 40,
    height: 180,
    zIndex: 10,
    text: "Customer Service    Expert\nFood & Beverage\nPairings            Expert\nWine\nRecommendations     Expert\nKnowledge of Food\nAllergies           Advanced\nTeam Leadership     Expert\nPoint of Sale\nSystems             Advanced",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Main content - SUMMARY
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 50,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "SUMMARY",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: mainX,
    y: 72,
    width: mainWidth,
    height: 1,
    zIndex: 0,
    fill: "#CBD5E1",
    borderRadius: 0,
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 80,
    width: mainWidth,
    height: 50,
    zIndex: 10,
    text: "Experienced head waiter with expertise in fine dining service, team management, and customer relations. Proven track record of delivering exceptional dining experiences.",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // WORK EXPERIENCE
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 150,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "WORK EXPERIENCE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: mainX,
    y: 172,
    width: mainWidth,
    height: 1,
    zIndex: 0,
    fill: "#CBD5E1",
    borderRadius: 0,
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 180,
    width: 120,
    height: 16,
    zIndex: 10,
    text: "Jan 2020 - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX + 130,
    y: 180,
    width: mainWidth - 130,
    height: 18,
    zIndex: 10,
    text: "Head Waiter",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX + 130,
    y: 200,
    width: mainWidth - 130,
    height: 16,
    zIndex: 10,
    text: "Harbor View Grill, San Diego, CA",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX + 130,
    y: 222,
    width: mainWidth - 130,
    height: 80,
    zIndex: 10,
    text: "• Managed team of 8 servers ensuring exceptional service\n• Increased customer satisfaction scores by 25%\n• Trained new staff on fine dining protocols\n• Coordinated with kitchen staff for seamless service",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  return elements;
}

// Template 3: Professional Two-Column (ATS-Friendly)
export function makeProfessionalTwoColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const sidebarWidth = Math.round(width * 0.35);
  const mainX = sidebarWidth + 30;
  const mainWidth = width - mainX - 30;

  // Sidebar background
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: sidebarWidth,
    height,
    zIndex: 0,
    fill: "#1E293B",
    borderRadius: 0,
  });

  // Name in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 50,
    width: sidebarWidth - 40,
    height: 35,
    zIndex: 10,
    text: "YOUR NAME",
    fontSize: 22,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });

  // Contact in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 95,
    width: sidebarWidth - 40,
    height: 60,
    zIndex: 10,
    text: "Email:\nyour.email@example.com\n\nPhone:\n+1 (555) 123-4567\n\nLocation:\nCity, State",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#CBD5E1",
  });

  // Skills in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 180,
    width: sidebarWidth - 40,
    height: 18,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#FFFFFF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 205,
    width: sidebarWidth - 40,
    height: 150,
    zIndex: 10,
    text: "• Technical Skill 1\n• Technical Skill 2\n• Technical Skill 3\n• Software Tool 1\n• Software Tool 2\n• Soft Skill 1\n• Soft Skill 2",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#CBD5E1",
  });

  // Main content - Professional Summary
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 50,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "PROFESSIONAL SUMMARY",
    fontSize: 14,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E293B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 75,
    width: mainWidth,
    height: 60,
    zIndex: 10,
    text: "Experienced professional with a strong background in [field]. Proven track record of delivering results and driving success. Expertise in [key areas].",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 155,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "PROFESSIONAL EXPERIENCE",
    fontSize: 14,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E293B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 180,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "Job Title",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 200,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "Company Name | Location | MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 225,
    width: mainWidth,
    height: 80,
    zIndex: 10,
    text: "• Achieved significant results through strategic planning\n• Led initiatives that improved efficiency by X%\n• Collaborated with cross-functional teams\n• Utilized [tools/technologies] effectively",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 325,
    width: mainWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 14,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E293B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 350,
    width: mainWidth,
    height: 40,
    zIndex: 10,
    text: "Degree Name\nUniversity Name | Location | YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 4: Executive Single Column (ATS-Friendly)
export function makeExecutiveSingleColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 55;
  const contentWidth = width - margin * 2;

  // Top border
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: margin,
    y: 40,
    width: contentWidth,
    height: 4,
    zIndex: 0,
    fill: "#0F172A",
    borderRadius: 0,
  });

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 60,
    width: contentWidth,
    height: 38,
    zIndex: 10,
    text: "YOUR NAME",
    fontSize: 26,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });

  // Title and contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 105,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Executive Title",
    fontSize: 13,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#475569",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 130,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "your.email@example.com | +1 (555) 123-4567 | City, State",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });

  // Executive Summary
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 165,
    width: contentWidth,
    height: 20,
    zIndex: 10,
    text: "EXECUTIVE SUMMARY",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 190,
    width: contentWidth,
    height: 70,
    zIndex: 10,
    text: "Strategic leader with [X] years of experience driving organizational growth and transformation. Proven expertise in [key areas]. Track record of delivering [specific achievements].",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Core Competencies
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 280,
    width: contentWidth,
    height: 20,
    zIndex: 10,
    text: "CORE COMPETENCIES",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 305,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "Strategic Planning | Leadership | Financial Management | Operations | Team Development | Change Management",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Professional Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 365,
    width: contentWidth,
    height: 20,
    zIndex: 10,
    text: "PROFESSIONAL EXPERIENCE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 390,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Executive Title",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 410,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Company Name | Location | MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 435,
    width: contentWidth,
    height: 90,
    zIndex: 10,
    text: "• Led strategic initiatives resulting in [measurable outcomes]\n• Managed budget of $X and delivered Y% ROI\n• Built and led high-performing teams of [size]\n• Drove organizational change and transformation\n• Established partnerships and strategic alliances",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 545,
    width: contentWidth,
    height: 20,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 570,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "MBA / Advanced Degree\nUniversity Name | Location | YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 5: Modern Single Column (ATS-Friendly)
export function makeModernSingleColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 50;
  const contentWidth = width - margin * 2;

  // Header accent
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: margin,
    y: 40,
    width: 60,
    height: 4,
    zIndex: 0,
    fill: "#3B82F6",
    borderRadius: 0,
  });

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 55,
    width: contentWidth,
    height: 42,
    zIndex: 10,
    text: "Your Name",
    fontSize: 30,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 105,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "your.email@example.com • +1 (555) 123-4567 • linkedin.com/in/yourprofile • City, State",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });

  // About
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 140,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "ABOUT",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#3B82F6",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 165,
    width: contentWidth,
    height: 55,
    zIndex: 10,
    text: "Passionate professional with expertise in [field]. Focused on delivering innovative solutions and driving measurable results. Strong background in [key areas].",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 240,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EXPERIENCE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#3B82F6",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 265,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Job Title",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 285,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Company Name • Location • MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 310,
    width: contentWidth,
    height: 75,
    zIndex: 10,
    text: "• Delivered impactful results in [area]\n• Improved processes leading to X% efficiency\n• Collaborated with teams to achieve goals\n• Leveraged [technologies] for success",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 405,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#3B82F6",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 430,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "Technical: Skill 1, Skill 2, Skill 3, Skill 4, Skill 5\nTools: Tool 1, Tool 2, Tool 3\nLanguages: Language 1, Language 2",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 490,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#3B82F6",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 515,
    width: contentWidth,
    height: 35,
    zIndex: 10,
    text: "Degree Name\nUniversity Name • Location • YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 6: Traditional Format (ATS-Friendly)
export function makeTraditionalFormatTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 60;
  const contentWidth = width - margin * 2;

  // Name centered
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 50,
    width: contentWidth,
    height: 35,
    zIndex: 10,
    text: "YOUR FULL NAME",
    fontSize: 24,
    fontWeight: "bold",
    align: "center",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Contact centered
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 95,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Address • City, State ZIP • Phone • Email",
    fontSize: 10,
    fontWeight: "normal",
    align: "center",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Objective
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 135,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "OBJECTIVE",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 160,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "Seeking a [position] role where I can utilize my skills in [area] to contribute to organizational success.",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 220,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EXPERIENCE",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 245,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Job Title, Company Name",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 265,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "City, State | MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin + 15,
    y: 290,
    width: contentWidth - 15,
    height: 70,
    zIndex: 10,
    text: "• Responsible for [key duties]\n• Achieved [specific accomplishments]\n• Managed [responsibilities]\n• Utilized [skills/tools]",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#000000",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 380,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 405,
    width: contentWidth,
    height: 35,
    zIndex: 10,
    text: "Degree Name, University Name\nCity, State | YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 460,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin + 15,
    y: 485,
    width: contentWidth - 15,
    height: 50,
    zIndex: 10,
    text: "• Skill 1\n• Skill 2\n• Skill 3\n• Skill 4\n• Skill 5",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#000000",
  });

  return elements;
}

// Template 7: Simple Two-Column (ATS-Friendly)
export function makeSimpleTwoColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const sidebarWidth = Math.round(width * 0.32);
  const mainX = sidebarWidth + 25;
  const mainWidth = width - mainX - 25;

  // Sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: sidebarWidth,
    height,
    zIndex: 0,
    fill: "#F1F5F9",
    borderRadius: 0,
  });

  // Name in sidebar
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 50,
    width: sidebarWidth - 40,
    height: 30,
    zIndex: 10,
    text: "Your Name",
    fontSize: 20,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 90,
    width: sidebarWidth - 40,
    height: 50,
    zIndex: 10,
    text: "Email:\nyour.email@example.com\nPhone:\n+1 (555) 123-4567",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#475569",
  });

  // Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 160,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 182,
    width: sidebarWidth - 40,
    height: 120,
    zIndex: 10,
    text: "• Technical Skill 1\n• Technical Skill 2\n• Technical Skill 3\n• Software Tool 1\n• Software Tool 2\n• Soft Skill 1",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#475569",
  });

  // Main content
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 50,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "PROFESSIONAL SUMMARY",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 72,
    width: mainWidth,
    height: 50,
    zIndex: 10,
    text: "Professional with expertise in [field]. Proven ability to deliver results and drive success.",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 140,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "EXPERIENCE",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 162,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "Job Title",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 180,
    width: mainWidth,
    height: 14,
    zIndex: 10,
    text: "Company Name | Location | MM/YYYY - Present",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 200,
    width: mainWidth,
    height: 70,
    zIndex: 10,
    text: "• Delivered measurable results\n• Improved processes\n• Collaborated effectively\n• Used [tools/technologies]",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 290,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 312,
    width: mainWidth,
    height: 35,
    zIndex: 10,
    text: "Degree Name\nUniversity Name | Location | YYYY",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 8: Clean Minimal (ATS-Friendly)
export function makeCleanMinimalTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 45;
  const contentWidth = width - margin * 2;

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 45,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "Your Name",
    fontSize: 28,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 95,
    width: contentWidth,
    height: 16,
    zIndex: 10,
    text: "your.email@example.com  |  +1 (555) 123-4567  |  City, State",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#666666",
  });

  // Divider
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: margin,
    y: 120,
    width: contentWidth,
    height: 1,
    zIndex: 0,
    fill: "#CCCCCC",
    borderRadius: 0,
  });

  // Summary
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 135,
    width: contentWidth,
    height: 50,
    zIndex: 10,
    text: "Professional summary highlighting key strengths, experience, and career objectives. Focus on measurable achievements and relevant skills.",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 205,
    width: contentWidth,
    height: 16,
    zIndex: 10,
    text: "EXPERIENCE",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 230,
    width: contentWidth,
    height: 16,
    zIndex: 10,
    text: "Job Title",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 248,
    width: contentWidth,
    height: 14,
    zIndex: 10,
    text: "Company Name, Location | MM/YYYY - Present",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#666666",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 268,
    width: contentWidth,
    height: 65,
    zIndex: 10,
    text: "• Key achievement with measurable results\n• Responsibility and impact\n• Skills and tools utilized\n• Additional accomplishments",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#000000",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 350,
    width: contentWidth,
    height: 16,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 375,
    width: contentWidth,
    height: 30,
    zIndex: 10,
    text: "Degree Name\nUniversity Name, Location | YYYY",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 425,
    width: contentWidth,
    height: 16,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 450,
    width: contentWidth,
    height: 30,
    zIndex: 10,
    text: "Skill 1, Skill 2, Skill 3, Skill 4, Skill 5, Skill 6",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  return elements;
}

// Template 9: Standard Professional (ATS-Friendly)
export function makeStandardProfessionalTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 55;
  const contentWidth = width - margin * 2;

  // Header line
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: margin,
    y: 45,
    width: contentWidth,
    height: 2,
    zIndex: 0,
    fill: "#2563EB",
    borderRadius: 0,
  });

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 60,
    width: contentWidth,
    height: 36,
    zIndex: 10,
    text: "YOUR NAME",
    fontSize: 25,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E40AF",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 105,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Email: your.email@example.com | Phone: +1 (555) 123-4567 | Location: City, State",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#475569",
  });

  // Professional Summary
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 140,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "PROFESSIONAL SUMMARY",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E40AF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 165,
    width: contentWidth,
    height: 55,
    zIndex: 10,
    text: "Results-driven professional with [X] years of experience in [field]. Proven track record of [achievements]. Expertise in [key areas].",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Core Qualifications
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 240,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "CORE QUALIFICATIONS",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E40AF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 265,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "• Qualification 1 | • Qualification 2 | • Qualification 3\n• Qualification 4 | • Qualification 5 | • Qualification 6",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Professional Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 325,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "PROFESSIONAL EXPERIENCE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E40AF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 350,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Job Title",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 370,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Company Name | Location | MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 395,
    width: contentWidth,
    height: 85,
    zIndex: 10,
    text: "• Achieved [specific results] resulting in [measurable impact]\n• Led [initiatives/projects] that improved [outcomes]\n• Managed [responsibilities] with focus on [goals]\n• Utilized [tools/technologies] to drive [results]",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 500,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#1E40AF",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 525,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "Degree Name\nUniversity Name | Location | YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 10: Contemporary Single Column (ATS-Friendly)
export function makeContemporarySingleColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 50;
  const contentWidth = width - margin * 2;

  // Top accent bar
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: margin,
    y: 40,
    width: contentWidth,
    height: 8,
    zIndex: 0,
    fill: "#10B981",
    borderRadius: 0,
  });

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 60,
    width: contentWidth,
    height: 40,
    zIndex: 10,
    text: "Your Name",
    fontSize: 29,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 110,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "your.email@example.com • +1 (555) 123-4567 • linkedin.com/in/yourprofile",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });

  // Profile
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 145,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "PROFILE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#10B981",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 170,
    width: contentWidth,
    height: 60,
    zIndex: 10,
    text: "Dynamic professional with a passion for [field]. Proven expertise in [key areas] with a track record of delivering exceptional results.",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Work Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 250,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "WORK EXPERIENCE",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#10B981",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 275,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Job Title",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 295,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Company Name • Location • MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 320,
    width: contentWidth,
    height: 80,
    zIndex: 10,
    text: "• Delivered outstanding results in [specific area]\n• Enhanced productivity by implementing [solutions]\n• Worked collaboratively with diverse teams\n• Applied [technologies/methods] effectively",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Technical Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 420,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "TECHNICAL SKILLS",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#10B981",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 445,
    width: contentWidth,
    height: 45,
    zIndex: 10,
    text: "Programming: Skill 1, Skill 2, Skill 3\nTools & Software: Tool 1, Tool 2, Tool 3\nMethodologies: Method 1, Method 2",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 510,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 13,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#10B981",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 535,
    width: contentWidth,
    height: 35,
    zIndex: 10,
    text: "Degree Name\nUniversity Name • Location • YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 11: Balanced Two-Column (ATS-Friendly)
export function makeBalancedTwoColumnTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const sidebarWidth = Math.round(width * 0.38);
  const mainX = sidebarWidth + 20;
  const mainWidth = width - mainX - 20;

  // Sidebar with accent
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: sidebarWidth,
    height,
    zIndex: 0,
    fill: "#F8FAFC",
    borderRadius: 0,
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "shape",
    x: 0,
    y: 0,
    width: 6,
    height,
    zIndex: 1,
    fill: "#6366F1",
    borderRadius: 0,
  });

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 50,
    width: sidebarWidth - 40,
    height: 32,
    zIndex: 10,
    text: "Your Name",
    fontSize: 22,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 92,
    width: sidebarWidth - 40,
    height: 55,
    zIndex: 10,
    text: "Email:\nyour.email@example.com\n\nPhone:\n+1 (555) 123-4567",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#475569",
  });

  // Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 170,
    width: sidebarWidth - 40,
    height: 16,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#6366F1",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: 20,
    y: 192,
    width: sidebarWidth - 40,
    height: 130,
    zIndex: 10,
    text: "• Technical Skill 1\n• Technical Skill 2\n• Technical Skill 3\n• Software Tool 1\n• Software Tool 2\n• Soft Skill 1\n• Soft Skill 2",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#475569",
  });

  // Main content
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 50,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "PROFESSIONAL SUMMARY",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 72,
    width: mainWidth,
    height: 55,
    zIndex: 10,
    text: "Experienced professional with expertise in [field]. Proven ability to deliver results and drive innovation.",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 145,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "EXPERIENCE",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 167,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "Job Title",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 185,
    width: mainWidth,
    height: 14,
    zIndex: 10,
    text: "Company Name | Location | MM/YYYY - Present",
    fontSize: 9,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#64748B",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 205,
    width: mainWidth,
    height: 75,
    zIndex: 10,
    text: "• Achieved measurable results\n• Improved processes and efficiency\n• Collaborated with teams\n• Utilized [tools/technologies]",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#334155",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 300,
    width: mainWidth,
    height: 16,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#0F172A",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: mainX,
    y: 322,
    width: mainWidth,
    height: 35,
    zIndex: 10,
    text: "Degree Name\nUniversity Name | Location | YYYY",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#334155",
  });

  return elements;
}

// Template 12: Simple Clean Format (ATS-Friendly)
export function makeSimpleCleanFormatTemplate(pageSize: "A4" | "LETTER"): CvElement[] {
  const { width, height } = PAGE_DIMENSIONS[pageSize];
  const elements: CvElement[] = [];
  const baseFont = "var(--font-inter), Inter, Arial, sans-serif";
  const margin = 50;
  const contentWidth = width - margin * 2;

  // Name
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 50,
    width: contentWidth,
    height: 38,
    zIndex: 10,
    text: "YOUR NAME",
    fontSize: 27,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Contact
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 98,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Email: your.email@example.com | Phone: +1 (555) 123-4567 | Location: City, State",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#333333",
  });

  // Summary
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 135,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "SUMMARY",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 160,
    width: contentWidth,
    height: 50,
    zIndex: 10,
    text: "Professional with [X] years of experience in [field]. Proven track record of [achievements]. Strong skills in [key areas].",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Experience
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 230,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EXPERIENCE",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 255,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Job Title",
    fontSize: 11,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 275,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "Company Name | Location | MM/YYYY - Present",
    fontSize: 10,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#666666",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 300,
    width: contentWidth,
    height: 75,
    zIndex: 10,
    text: "• Accomplished [specific results]\n• Improved [metrics/processes]\n• Managed [responsibilities]\n• Used [tools/technologies]",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "bullet",
    color: "#000000",
  });

  // Education
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 395,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "EDUCATION",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 420,
    width: contentWidth,
    height: 35,
    zIndex: 10,
    text: "Degree Name\nUniversity Name | Location | YYYY",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  // Skills
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 475,
    width: contentWidth,
    height: 18,
    zIndex: 10,
    text: "SKILLS",
    fontSize: 12,
    fontWeight: "bold",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });
  elements.push({
    id: crypto.randomUUID(),
    type: "text",
    x: margin,
    y: 500,
    width: contentWidth,
    height: 35,
    zIndex: 10,
    text: "Technical Skills: Skill 1, Skill 2, Skill 3, Skill 4\nSoft Skills: Skill A, Skill B, Skill C",
    fontSize: 11,
    fontWeight: "normal",
    align: "left",
    fontFamily: baseFont,
    listStyle: "none",
    color: "#000000",
  });

  return elements;
}

