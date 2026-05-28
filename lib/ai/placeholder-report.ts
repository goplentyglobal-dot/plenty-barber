import { reportSchema, type VisagismReport } from "@/lib/ai/validators/report-schema";
import type { Locale } from "@/lib/i18n/config";
import { demoReportJson } from "@/lib/demo/data";

export function createPlaceholderReport(locale: Locale = "es"): VisagismReport {
  const report = { ...demoReportJson, idioma: locale };

  if (locale === "en") {
    return reportSchema.parse({
      ...report,
      morfologia_facial: {
        ...report.morfologia_facial,
        descripcion:
          "Based on the visible image, the proportions suggest a balanced oval structure with soft transitions.",
        rasgos_destacados: ["Balanced forehead and jaw", "Soft cheek line", "Natural symmetry"],
        lineas_guia: [
          "Keep side volume controlled",
          "Preserve clean vertical balance",
          "Use texture to add premium movement"
        ],
        nivel_confianza: "Medium-high based on visible lighting and angle"
      },
      colorimetria: {
        ...report.colorimetria,
        paleta_colores_ropa: {
          ...report.colorimetria.paleta_colores_ropa,
          descripcion: "Warm, grounded tones support a premium and natural visual presence."
        },
        paleta_cabello: {
          ...report.colorimetria.paleta_cabello,
          tonos_ideales: ["Warm chestnut", "Warm espresso", "Soft caramel highlights"],
          tonos_evitar: ["Ash blond", "Blue black"],
          descripcion: "Warm depth works better than cool high-contrast color."
        }
      },
      resumen_ejecutivo:
        "This aesthetic analysis suggests a refined, warm and balanced direction with natural texture, controlled sides and premium earthy tones."
    });
  }

  if (locale === "pt") {
    return reportSchema.parse({
      ...report,
      morfologia_facial: {
        ...report.morfologia_facial,
        descripcion:
          "Pelo que é visível na imagem, as proporções sugerem uma estrutura oval equilibrada com transições suaves.",
        rasgos_destacados: ["Testa e mandíbula equilibradas", "Linha de maçãs do rosto suave", "Simetria natural"],
        lineas_guia: [
          "Manter volume controlado nas laterais",
          "Preservar equilíbrio vertical limpo",
          "Usar textura para trazer movimento premium"
        ],
        nivel_confianza: "Médio-alto conforme iluminação e ângulo visíveis"
      },
      resumen_ejecutivo:
        "Esta análise estética sugere uma direção refinada, quente e equilibrada, com textura natural, laterais controladas e tons terrosos premium."
    });
  }

  return reportSchema.parse(report);
}
