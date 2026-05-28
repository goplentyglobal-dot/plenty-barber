export const reportJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "idioma",
    "morfologia_facial",
    "colorimetria",
    "recomendaciones_peinado",
    "experiencia_cliente",
    "resumen_ejecutivo"
  ],
  properties: {
    idioma: { type: "string", enum: ["es", "en", "pt"] },
    morfologia_facial: {
      type: "object",
      additionalProperties: false,
      required: ["forma", "descripcion", "rasgos_destacados", "lineas_guia", "nivel_confianza"],
      properties: {
        forma: { type: "string" },
        descripcion: { type: "string" },
        rasgos_destacados: { type: "array", items: { type: "string" } },
        lineas_guia: { type: "array", items: { type: "string" } },
        nivel_confianza: { type: "string" }
      }
    },
    colorimetria: {
      type: "object",
      additionalProperties: false,
      required: ["tono_piel", "subtono", "estacion", "paleta_colores_ropa", "paleta_cabello"],
      properties: {
        tono_piel: { type: "string" },
        subtono: { type: "string" },
        estacion: { type: "string" },
        paleta_colores_ropa: {
          type: "object",
          additionalProperties: false,
          required: ["ideales", "evitar", "descripcion"],
          properties: {
            ideales: { type: "array", items: { type: "string", pattern: "^#(?:[0-9A-Fa-f]{6})$" } },
            evitar: { type: "array", items: { type: "string", pattern: "^#(?:[0-9A-Fa-f]{6})$" } },
            descripcion: { type: "string" }
          }
        },
        paleta_cabello: {
          type: "object",
          additionalProperties: false,
          required: ["tonos_ideales", "tonos_evitar", "descripcion"],
          properties: {
            tonos_ideales: { type: "array", items: { type: "string" } },
            tonos_evitar: { type: "array", items: { type: "string" } },
            descripcion: { type: "string" }
          }
        }
      }
    },
    recomendaciones_peinado: {
      type: "object",
      additionalProperties: false,
      required: ["estilos_ideales", "estilos_evitar", "recomendaciones_adicionales"],
      properties: {
        estilos_ideales: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["nombre", "descripcion", "por_que_funciona", "instrucciones_barbero", "mantenimiento"],
            properties: {
              nombre: { type: "string" },
              descripcion: { type: "string" },
              por_que_funciona: { type: "string" },
              instrucciones_barbero: { type: "string" },
              mantenimiento: { type: "string" }
            }
          }
        },
        estilos_evitar: { type: "array", items: { type: "string" } },
        recomendaciones_adicionales: { type: "string" }
      }
    },
    experiencia_cliente: {
      type: "object",
      additionalProperties: false,
      required: [
        "titulo_comercial",
        "diagnostico_visual",
        "plan_mantenimiento",
        "productos_sugeridos",
        "guion_asesoria"
      ],
      properties: {
        titulo_comercial: { type: "string" },
        diagnostico_visual: { type: "string" },
        plan_mantenimiento: { type: "array", items: { type: "string" } },
        productos_sugeridos: { type: "array", items: { type: "string" } },
        guion_asesoria: { type: "string" }
      }
    },
    resumen_ejecutivo: { type: "string" }
  }
} as const;
