import { z } from "zod";

const hexColorSchema = z.string().regex(/^#(?:[0-9A-Fa-f]{6})$/);

const hairstyleRecommendationSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  por_que_funciona: z.string(),
  instrucciones_barbero: z.string().optional(),
  mantenimiento: z.string().optional()
});

export const reportSchema = z.object({
  idioma: z.enum(["es", "en", "pt"]).optional(),
  morfologia_facial: z.object({
    forma: z.string(),
    descripcion: z.string(),
    rasgos_destacados: z.array(z.string()),
    lineas_guia: z.array(z.string()).optional(),
    nivel_confianza: z.string().optional()
  }),
        colorimetria: z.object({
    tono_piel: z.string(),
    subtono: z.string(),
    estacion: z.string(),
    paleta_colores_ropa: z.object({
      ideales: z.array(z.string()),
      evitar: z.array(z.string()),
      descripcion: z.string()
    }),
    paleta_cabello: z.object({
      tonos_ideales: z.array(z.string()),
      tonos_evitar: z.array(z.string()),
      descripcion: z.string()
    })
  }),
  recomendaciones_peinado: z.object({
    estilos_ideales: z.array(hairstyleRecommendationSchema).min(1),
    estilos_evitar: z.array(z.string()),
    recomendaciones_adicionales: z.string()
  }),
  experiencia_cliente: z
    .object({
      titulo_comercial: z.string(),
      diagnostico_visual: z.string(),
      plan_mantenimiento: z.array(z.string()),
      productos_sugeridos: z.array(z.string()),
      guion_asesoria: z.string()
    })
    .optional(),
  resumen_ejecutivo: z.string()
});

export const generatedReportSchema = reportSchema.extend({
  colorimetria: reportSchema.shape.colorimetria.extend({
    paleta_colores_ropa: reportSchema.shape.colorimetria.shape.paleta_colores_ropa.extend({
      ideales: z.array(hexColorSchema),
      evitar: z.array(hexColorSchema)
    })
  }),
  recomendaciones_peinado: reportSchema.shape.recomendaciones_peinado.extend({
    estilos_ideales: z.array(hairstyleRecommendationSchema).length(3)
  })
});

export type VisagismReport = z.infer<typeof reportSchema>;
