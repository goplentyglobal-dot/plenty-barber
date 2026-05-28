import type { Business, EndClient, ReportListItem } from "@/lib/database/types";

export const demoBusiness: Business = {
  id: "demo-business",
  name: "Plenty Demo Studio",
  email: "demo@plentybarber.local",
  phone: "+57 300 000 0000",
  logo_url: null,
  plan_id: null,
  credits_remaining: 24,
  credits_alert_threshold: 10,
  auto_reload: false,
  preferred_ai_provider: "demo",
  preferred_image_provider: "demo",
  stripe_customer_id: null,
  stripe_subscription_id: null,
  active: true,
  created_at: new Date().toISOString()
};

export const demoClients: EndClient[] = [
  {
    id: "demo-client-1",
    business_id: demoBusiness.id,
    full_name: "Mateo Alvarez",
    phone: "+57 300 111 2233",
    email: "mateo@example.com",
    notes: "Prefers low-maintenance styles.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-client-2",
    business_id: demoBusiness.id,
    full_name: "Camila Torres",
    phone: "+57 300 444 5566",
    email: "camila@example.com",
    notes: "Interested in warm color palette.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const demoReportJson = {
  morfologia_facial: {
    forma: "ovalado",
    descripcion:
      "Según lo visible en la imagen, las proporciones sugieren una estructura ovalada equilibrada con transiciones suaves.",
    rasgos_destacados: ["Frente y mandíbula equilibradas", "Línea de pómulos suave", "Simetría natural"],
    lineas_guia: [
      "Mantener volumen controlado en los laterales",
      "Conservar equilibrio vertical limpio",
      "Usar textura para aportar movimiento premium"
    ],
    nivel_confianza: "Medio-alto según iluminación y ángulo visibles"
  },
  colorimetria: {
    tono_piel: "medio",
    subtono: "calido",
    estacion: "otono",
    paleta_colores_ropa: {
      ideales: ["#C9A84C", "#8A6820", "#5B4636", "#F7F3EC"],
      evitar: ["#D7E8FF", "#B7C7D9"],
      descripcion: "Los tonos cálidos y profundos ayudan a construir una presencia natural y premium."
    },
    paleta_cabello: {
      tonos_ideales: ["Castaño cálido", "Espresso cálido", "Iluminaciones caramelo suaves"],
      tonos_evitar: ["Rubio cenizo", "Negro azulado"],
      descripcion: "La profundidad cálida favorece más que los colores fríos de alto contraste."
    }
  },
  recomendaciones_peinado: {
    estilos_ideales: [
      {
        nombre: "Crop texturizado",
        descripcion: "Parte superior con textura controlada y laterales limpios.",
        por_que_funciona: "Mantiene el equilibrio y suma un acabado moderno y pulido.",
        instrucciones_barbero: "Trabajar un taper bajo a medio, texturizar la parte superior y dejar el flequillo ligero.",
        mantenimiento: "Retocar laterales cada 2 a 3 semanas y peinar con pasta mate."
      },
      {
        nombre: "Taper clásico",
        descripcion: "Degradado suave con movimiento natural en la parte superior.",
        por_que_funciona: "Enmarca el rostro sin endurecer demasiado la silueta.",
        instrucciones_barbero: "Fundir suavemente en la zona de las sienes y conservar largo suficiente para dirección natural.",
        mantenimiento: "Usar crema ligera después de la ducha y limpiar contornos entre cortes."
      },
      {
        nombre: "Volumen lateral",
        descripcion: "Volumen ligero dirigido hacia un lado.",
        por_que_funciona: "Aporta elegancia y estructura visual.",
        instrucciones_barbero: "Conservar más largo al frente y conectar suavemente hacia la coronilla.",
        mantenimiento: "Secar con calor medio y finalizar con fijación flexible."
      }
    ],
    estilos_evitar: ["Parte superior demasiado plana", "Flequillo excesivamente pesado"],
    recomendaciones_adicionales:
      "Un profesional puede validar los detalles en persona antes de tomar decisiones finales de corte o color."
  },
  experiencia_cliente: {
    titulo_comercial: "Equilibrio cálido y refinado",
    diagnostico_visual:
      "La dirección recomendada es limpia, equilibrada y fácil de mantener, con suficiente textura para verse actual sin perder elegancia.",
    plan_mantenimiento: [
      "Reservar limpieza de laterales y contornos cada 2 a 3 semanas.",
      "Usar productos de acabado mate o natural para evitar brillo excesivo.",
      "Validar el color bajo luz natural antes de aplicar iluminaciones."
    ],
    productos_sugeridos: ["Pasta mate", "Crema ligera de peinado", "Shampoo hidratante"],
    guion_asesoria:
      "Tu rostro funciona muy bien con textura controlada y tonos cálidos. La idea es mantener laterales limpios, conservar equilibrio en la parte superior y usar color solo para realzar tu presencia natural."
  },
  resumen_ejecutivo:
    "Este análisis estético sugiere una dirección refinada, cálida y equilibrada, con textura natural, laterales controlados y tonos tierra premium."
};

export const demoReports: ReportListItem[] = [
  {
    id: "demo-report",
    business_id: demoBusiness.id,
    end_client_id: demoClients[0].id,
    created_by: "demo-business-user",
    photo_urls: [],
    gender: null,
    ai_provider: "demo",
    ai_model: "development-placeholder",
    image_provider: "demo",
    tokens_used: 0,
    cost_usd: 0,
    report_json: demoReportJson,
    illustration_urls: [],
    pdf_url: null,
    pdf_expires_at: null,
    status: "done",
    error_message: null,
    created_at: new Date().toISOString(),
    end_clients: {
      full_name: demoClients[0].full_name,
      phone: demoClients[0].phone,
      email: demoClients[0].email
    },
    businesses: {
      name: demoBusiness.name,
      phone: demoBusiness.phone
    }
  }
];
