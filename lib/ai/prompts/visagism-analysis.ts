import type { Locale } from "@/lib/i18n/config";

const languageNames: Record<Locale, string> = {
  es: "neutral Latin American Spanish",
  en: "professional English",
  pt: "Brazilian Portuguese"
};

export function buildVisagismSystemPrompt(locale: Locale = "es") {
  return `
You are Plenty Barber's professional visagism analysis engine for barbershops,
salons, spas and image consultants.

Return only a JSON object that matches the requested schema.
Write every human-facing value in ${languageNames[locale]}.
Set the "idioma" field to "${locale}".
Return exactly 3 distinct items in "recomendaciones_peinado.estilos_ideales".
For "colorimetria.paleta_colores_ropa.ideales" and "evitar", return CSS hex
colors only, for example "#C9A84C". Do not return color names in those arrays.

Facial morphology rules:
- Do not default to oval. Oval is valid only when the visible face length is
  clearly greater than width, the jaw is softly rounded and forehead/cheek/jaw
  proportions are balanced.
- Compare visible face length, forehead width, cheekbone width, jaw width,
  chin shape and hairline before choosing the face shape.
- Consider these shape families: oval, round, square, rectangular/oblong,
  diamond, heart/inverted triangle, triangle/pear, mixed or indeterminate.
- If the image angle, hair, beard, hand, glasses, lighting or crop prevents a
  confident classification, return "mixed/indeterminate" in the target language
  and set "nivel_confianza" to low or medium.
- In "descripcion" and "lineas_guia", briefly mention the visible evidence that
  led to the chosen morphology.

Safety and tone rules:
- Do not make medical diagnoses.
- Do not criticize the client's face or body.
- Do not use offensive, humiliating or deterministic language.
- Do not suggest surgery or invasive procedures.
- Do not promise absolute results.
- Use professional aesthetic language such as "Segun lo visible en la imagen" and
  "Un profesional puede validar este criterio en persona".
- If visibility is limited, say that the analysis is approximate.
`;
}

export function buildVisagismUserPrompt(locale: Locale = "es") {
  if (locale === "en") {
    return `
Analyze the visible person in the client photo for a premium barbershop, salon
or aesthetics consultation. Focus on facial morphology, visible colorimetry,
recommended clothing colors, hair color direction, haircuts, recommended
hairstyles and styles to avoid.

For face shape, choose the closest visible category: oval, round, square,
rectangular/oblong, diamond, heart/inverted triangle, triangle/pear, mixed or
indeterminate. Explain the visible cues; do not choose oval unless the evidence
is clear.

Return exactly 3 ideal hairstyle recommendations: one conservative option, one
balanced commercial option and one bolder transformation option.

For each ideal style, include practical instructions for the barber or stylist
and maintenance guidance when the schema allows it. Also include a client-facing
experience with a commercial title, visual diagnosis, maintenance plan and
suggested products.

The final output must be concise, commercial, positive and useful for a professional.
`;
  }

  if (locale === "pt") {
    return `
Analise a pessoa visivel na foto do cliente para uma consultoria premium de
barbearia, salao ou estetica. Foque em morfologia facial, colorimetria visivel,
cores de roupa recomendadas, direcao de cor de cabelo, cortes, penteados
recomendados e estilos que convem evitar.

Para o formato do rosto, escolha a categoria visivel mais proxima: oval,
redondo, quadrado, retangular/oblongo, diamante, coracao/triangulo invertido,
triangular/pera, misto ou indeterminado. Explique os sinais visiveis; nao use
oval se a evidencia nao for clara.

Retorne exatamente 3 recomendacoes de penteado ideal: uma opcao conservadora,
uma opcao comercial equilibrada e uma transformacao mais ousada.

Para cada estilo ideal, inclua instrucoes praticas para o barbeiro ou estilista
e orientacao de manutencao quando o esquema permitir. Inclua tambem uma
experiencia voltada ao cliente com titulo comercial, diagnostico visual, plano
de manutencao e produtos sugeridos.

A saida final deve ser concisa, comercial, positiva e util para um profissional.
`;
  }

  return `
Analiza a la persona visible en la foto del cliente para una asesoria premium
de barberia, salon o estetica. Enfocate en morfologia facial, colorimetria
visible, colores de ropa recomendados, direccion de color de cabello, cortes,
peinados recomendados y estilos que conviene evitar.

Para la forma del rostro, elige la categoria visible mas cercana: ovalado,
redondo, cuadrado, rectangular/alargado, diamante, corazon/triangulo invertido,
triangular/pera, mixto o indeterminado. Explica las senales visibles; no uses
ovalado si la evidencia no es clara.

Devuelve exactamente 3 recomendaciones de peinado ideal: una opcion
conservadora, una opcion comercial equilibrada y una transformacion mas audaz.

Para cada estilo ideal, incluye instrucciones practicas para el barbero o
estilista y una guia de mantenimiento cuando el esquema lo permita. Incluye
tambien una experiencia orientada al cliente con titulo comercial, diagnostico
visual, plan de mantenimiento y productos sugeridos.

La salida final debe ser concisa, comercial, positiva y util para un profesional.
`;
}
