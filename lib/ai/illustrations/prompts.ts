import type { Locale } from "@/lib/i18n/config";
import type { VisagismReport } from "@/lib/ai/validators/report-schema";

type StylePromptInput = {
  nombre: string;
  descripcion: string;
  por_que_funciona: string;
  instrucciones_barbero?: string;
};

export function buildIllustrationPrompts(report: VisagismReport, locale: Locale) {
  const languageInstruction =
    locale === "en"
      ? "The image must not contain readable text."
      : locale === "pt"
        ? "A imagem nao deve conter texto legivel."
        : "La imagen no debe contener texto legible.";

  return getThreeStylePromptInputs(report, locale).map((style) => {
    const base =
      locale === "en"
        ? `Premium barbershop reference image for the hairstyle "${style.nombre}". Face shape: ${report.morfologia_facial.forma}. Hair color direction: ${report.colorimetria.paleta_cabello.tonos_ideales.join(", ")}. Show a polished editorial reference, neutral studio background, realistic grooming, elegant lighting, no celebrity likeness, not the actual client.`
        : locale === "pt"
          ? `Imagem de referencia premium de barbearia para o estilo "${style.nombre}". Formato do rosto: ${report.morfologia_facial.forma}. Direcao de cor do cabelo: ${report.colorimetria.paleta_cabello.tonos_ideales.join(", ")}. Mostrar uma referencia editorial elegante, fundo neutro de estudio, acabamento realista, iluminacao sofisticada, sem semelhanca com celebridades, nao e o cliente real.`
          : `Imagen de referencia premium de barberia para el estilo "${style.nombre}". Forma del rostro: ${report.morfologia_facial.forma}. Direccion de color de cabello: ${report.colorimetria.paleta_cabello.tonos_ideales.join(", ")}. Mostrar una referencia editorial elegante, fondo neutro de estudio, acabado realista, iluminacion sofisticada, sin parecido a celebridades, no es el cliente real.`;

    return `${base} ${languageInstruction}`;
  });
}

export function buildPersonalizedHairstylePrompts(report: VisagismReport, locale: Locale) {
  const noText =
    locale === "en"
      ? "Do not add readable text, labels, watermarks, logos or UI."
      : locale === "pt"
        ? "Nao adicione texto legivel, rotulos, marcas d'agua, logos ou interface."
        : "No agregues texto legible, etiquetas, marcas de agua, logos ni interfaz.";

  return getThreeStylePromptInputs(report, locale).map((style) => {
    const shared = [
      `Hairstyle preview: ${style.nombre}.`,
      `Face shape: ${report.morfologia_facial.forma}.`,
      `Recommended hair color direction: ${report.colorimetria.paleta_cabello.tonos_ideales.join(", ")}.`,
      "Use the uploaded client photo as the visual reference.",
      "Preserve the client's identity, face, facial features, skin tone, expression, pose, camera angle, clothing and background as much as possible.",
      "Change only the hairstyle/haircut and grooming finish.",
      "Make the result realistic, premium barbershop quality, natural texture, believable lighting.",
      "Avoid celebrity resemblance, caricature, beauty filters, face reshaping, age changes or skin retouching.",
      noText
    ];

    if (locale === "en") {
      return [
        ...shared,
        `Stylist rationale: ${style.por_que_funciona}`,
        `Barber instruction: ${style.instrucciones_barbero || style.descripcion}`
      ].join(" ");
    }

    if (locale === "pt") {
      return [
        ...shared,
        `Justificativa do estilo: ${style.por_que_funciona}`,
        `Instrucao para barbeiro: ${style.instrucciones_barbero || style.descripcion}`
      ].join(" ");
    }

    return [
      ...shared,
      `Justificacion del estilo: ${style.por_que_funciona}`,
      `Instruccion para barbero: ${style.instrucciones_barbero || style.descripcion}`
    ].join(" ");
  });
}

function getThreeStylePromptInputs(report: VisagismReport, locale: Locale): StylePromptInput[] {
  const styles: StylePromptInput[] = report.recomendaciones_peinado.estilos_ideales.slice(0, 3);
  const fallbackNames =
    locale === "en"
      ? ["Conservative polish", "Balanced signature look", "Bolder transformation"]
      : locale === "pt"
        ? ["Acabamento conservador", "Visual assinatura equilibrado", "Transformacao mais ousada"]
        : ["Pulido conservador", "Look firma equilibrado", "Transformacion mas audaz"];

  while (styles.length < 3) {
    const name = fallbackNames[styles.length] ?? fallbackNames[2];
    const description =
      locale === "en"
        ? `A professional alternative aligned with the visible ${report.morfologia_facial.forma} face shape and the report's overall style direction.`
        : locale === "pt"
          ? `Uma alternativa profissional alinhada ao formato de rosto ${report.morfologia_facial.forma} e a direcao geral do relatorio.`
          : `Una alternativa profesional alineada con el rostro ${report.morfologia_facial.forma} y la direccion general del informe.`;

    styles.push({
      nombre: name,
      descripcion: description,
      por_que_funciona: report.recomendaciones_peinado.recomendaciones_adicionales || description,
      instrucciones_barbero: description
    });
  }

  return styles;
}
