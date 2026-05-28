import { reportSchema } from "@/lib/ai/validators/report-schema";
import type { ReportListItem } from "@/lib/database/types";
import { formatShortDate } from "@/lib/utils/date";

export function createReportPdf(report: ReportListItem) {
  const parsed = reportSchema.safeParse(report.report_json);
  const analysis = parsed.success ? parsed.data : null;
  const clientName = report.end_clients?.full_name || "Client";

  return buildPdf([
    { type: "brand", text: "PLENTY BARBER" },
    { type: "title", text: "Professional Visagism Report" },
    { type: "meta", text: `Client: ${clientName}` },
    { type: "meta", text: `Date: ${formatShortDate(report.created_at)} | Status: ${report.status}` },
    { type: "rule" },
    { type: "heading", text: "Executive Summary" },
    { type: "body", text: analysis?.resumen_ejecutivo || "Report analysis is not available." },
    { type: "heading", text: "Facial Morphology" },
    {
      type: "body",
      text: analysis ? `${analysis.morfologia_facial.forma}: ${analysis.morfologia_facial.descripcion}` : ""
    },
    {
      type: "body",
      text: analysis ? `Highlighted traits: ${analysis.morfologia_facial.rasgos_destacados.join(", ")}` : ""
    },
    { type: "heading", text: "Colorimetry" },
    {
      type: "body",
      text: analysis
        ? `${analysis.colorimetria.tono_piel} skin tone, ${analysis.colorimetria.subtono} undertone, ${analysis.colorimetria.estacion} palette.`
        : ""
    },
    {
      type: "body",
      text: analysis ? `Ideal clothing colors: ${analysis.colorimetria.paleta_colores_ropa.ideales.join(", ")}` : ""
    },
    {
      type: "body",
      text: analysis ? `Ideal hair tones: ${analysis.colorimetria.paleta_cabello.tonos_ideales.join(", ")}` : ""
    },
    { type: "heading", text: "Recommended Looks" },
    ...(analysis?.recomendaciones_peinado.estilos_ideales.map((style) => ({
      type: "body" as const,
      text: `${style.nombre}: ${style.descripcion} ${style.por_que_funciona}`
    })) ?? []),
    { type: "heading", text: "Styles To Avoid" },
    {
      type: "body",
      text: analysis?.recomendaciones_peinado.estilos_evitar.join(", ") || "No avoid list available."
    },
    { type: "footer", text: "Powered by Plenty Barber" }
  ]);
}

type PdfBlock =
  | { type: "brand" | "title" | "meta" | "heading" | "body" | "footer"; text: string }
  | { type: "rule" };

function buildPdf(blocks: PdfBlock[]) {
  const commands: string[] = [
    "0.04 0.04 0.04 rg 0 0 612 792 re f",
    "0.79 0.66 0.30 rg 42 742 528 1.5 re f"
  ];
  let y = 708;

  blocks.forEach((block) => {
    if (y < 72) {
      return;
    }

    if (block.type === "rule") {
      commands.push(`0.79 0.66 0.30 rg 42 ${y} 528 0.8 re f`);
      y -= 26;
      return;
    }

    if (block.type === "brand") {
      commands.push(textCommand(block.text, 42, y, 18, "0.91 0.84 0.64"));
      y -= 28;
      return;
    }

    if (block.type === "title") {
      commands.push(textCommand(block.text, 42, y, 24, "1 1 1"));
      y -= 34;
      return;
    }

    if (block.type === "meta") {
      commands.push(textCommand(block.text, 42, y, 10, "0.86 0.82 0.76"));
      y -= 16;
      return;
    }

    if (block.type === "heading") {
      y -= 8;
      commands.push(textCommand(block.text.toUpperCase(), 42, y, 13, "0.79 0.66 0.30"));
      y -= 20;
      return;
    }

    if (block.type === "footer") {
      commands.push(`0.79 0.66 0.30 rg 42 48 528 0.8 re f`);
      commands.push(textCommand(block.text, 42, 28, 9, "0.86 0.82 0.76"));
      return;
    }

    wrapLine(block.text, 92).forEach((line) => {
      if (y > 72) {
        commands.push(textCommand(line, 42, y, 10, "0.95 0.93 0.89"));
        y -= 15;
      }
    });
    y -= 5;
  });

  const pageText = commands.join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(pageText)} >>\nstream\n${pageText}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

function wrapLine(line: string, maxLength: number) {
  if (!line) {
    return [""];
  }

  const words = line.split(/\s+/);
  const output: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxLength) {
      output.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    output.push(current);
  }

  return output;
}

function escapePdf(value: string) {
  return value.replace(/[()\\]/g, (match) => `\\${match}`).replace(/[^\x20-\x7E]/g, "");
}

function textCommand(text: string, x: number, y: number, size: number, color: string) {
  return `${color} rg BT /F1 ${size} Tf ${x} ${y} Td (${escapePdf(text)}) Tj ET`;
}
