import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  MessageCircle,
  Palette,
  Scissors,
  Sparkles,
  Target,
  UserRound,
  Wrench,
  XCircle
} from "lucide-react";
import { reportSchema, type VisagismReport } from "@/lib/ai/validators/report-schema";
import type { ReportListItem } from "@/lib/database/types";
import type { Locale } from "@/lib/i18n/config";
import { formatShortDate } from "@/lib/utils/date";

export function PremiumReportView({ report, locale = "es" }: { report: ReportListItem; locale?: Locale }) {
  const parsed = reportSchema.safeParse(report.report_json);

  if (!parsed.success) {
    return null;
  }

  const analysis = parsed.data;
  const reportLocale = analysis.idioma || locale;
  const labels = reportLabels[reportLocale];
  const clientName = report.end_clients?.full_name || "Cliente";
  const photoUrls = report.photo_urls?.filter((url) => url.startsWith("data:image") || url.startsWith("http")) ?? [];
  const photoUrl = photoUrls[0];
  const experience = getClientExperience(analysis, reportLocale);
  const businessName = report.businesses?.name || "tu estetica";
  const bookingUrl = buildWhatsAppBookingUrl(report.businesses?.phone, clientName, businessName, reportLocale);
  const illustrationUrls = report.illustration_urls?.filter(Boolean) ?? [];
  const hasPersonalizedPreviews = report.image_provider === "openai_edit";
  const faceGuides = analysis.morfologia_facial.lineas_guia?.length
    ? analysis.morfologia_facial.lineas_guia
    : [
        labels.defaultFaceGuideOne,
        labels.defaultFaceGuideTwo,
        labels.defaultFaceGuideThree
      ];

  return (
    <article className="premium-report overflow-hidden rounded-lg border border-gold/20 bg-noir text-cream shadow-gold print:rounded-none print:border-0">
      <section className="report-section report-hero grid gap-0 bg-[linear-gradient(135deg,#0A0A0A,#1B1A17_52%,#0A0A0A)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[34rem] overflow-hidden bg-noir-soft">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={clientName} className="h-full min-h-[34rem] w-full object-cover" />
          ) : (
            <div className="grid h-full min-h-[34rem] place-items-center text-center">
              <div>
                <UserRound className="mx-auto h-16 w-16 text-gold" />
                <p className="mt-4 text-sm text-cream/58">{labels.photoPending}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir via-noir/70 to-transparent p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-noir/70 px-4 py-2 text-xs font-semibold text-gold-light backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {labels.analysisBadge}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-light">{labels.reportEyebrow}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-cream md:text-6xl">{clientName}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-cream/58">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <CalendarDays className="h-4 w-4 text-gold" />
              {formatShortDate(report.created_at, reportLocale)}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 capitalize">
              {analysis.morfologia_facial.nivel_confianza || labels.approxAnalysis}
            </span>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-cream/76">{analysis.resumen_ejecutivo}</p>
          <div className="mt-8 rounded-lg border border-gold/20 bg-gold/10 p-5">
            <p className="text-sm font-semibold uppercase text-gold-light">{experience.titulo_comercial}</p>
            <p className="mt-3 text-sm leading-7 text-cream/72">{experience.diagnostico_visual}</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <HeroStat label={labels.faceShape} value={analysis.morfologia_facial.forma} />
            <HeroStat label={labels.season} value={analysis.colorimetria.estacion} />
            <HeroStat label={labels.subtone} value={analysis.colorimetria.subtono} />
          </div>
          {photoUrls.length > 1 ? (
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase text-cream/42">{labels.referencePhotos}</p>
              <div className="grid grid-cols-3 gap-3">
                {photoUrls.slice(0, 3).map((url, index) => (
                  <div key={`${url}-${index}`} className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-noir-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${clientName} ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="report-section grid gap-5 p-6 md:p-8 lg:grid-cols-[1fr_1fr]">
        <ReportPanel icon={<UserRound className="h-5 w-5" />} title={labels.facialMorphology}>
          <p className="text-sm leading-7 text-cream/70">{analysis.morfologia_facial.descripcion}</p>
          <TagList items={analysis.morfologia_facial.rasgos_destacados} tone="gold" />
          <Checklist title={labels.designLines} items={faceGuides} />
        </ReportPanel>

        <ReportPanel icon={<Palette className="h-5 w-5" />} title={labels.personalColorimetry}>
          <p className="text-sm leading-7 text-cream/70">{analysis.colorimetria.paleta_colores_ropa.descripcion}</p>
          <ColorSwatches colors={analysis.colorimetria.paleta_colores_ropa.ideales} title={labels.recommendedColors} />
          <TagList items={analysis.colorimetria.paleta_colores_ropa.evitar} tone="red" label={labels.avoid} />
        </ReportPanel>
      </section>

      <section className="report-section border-y border-white/10 bg-noir-soft/70 p-6 md:p-8">
        <SectionTitle icon={<Scissors className="h-6 w-6" />} title={labels.recommendedCuts} />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {analysis.recomendaciones_peinado.estilos_ideales.map((style, index) => (
            <div key={style.nombre} className="report-panel rounded-lg border border-gold/18 bg-noir p-5">
              <span className="text-xs uppercase text-gold-light">{labels.style} 0{index + 1}</span>
              <h3 className="mt-4 font-display text-2xl text-cream">{style.nombre}</h3>
              <p className="mt-3 text-sm leading-6 text-cream/68">{style.descripcion}</p>
              <p className="mt-4 text-sm leading-6 text-gold-light/78">{style.por_que_funciona}</p>
              {style.instrucciones_barbero ? (
                <MiniNote icon={<Wrench className="h-4 w-4" />} label={labels.forProfessional} value={style.instrucciones_barbero} />
              ) : null}
              {style.mantenimiento ? (
                <MiniNote icon={<Droplets className="h-4 w-4" />} label={labels.maintenance} value={style.mantenimiento} />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {illustrationUrls.length ? (
        <section className="report-section border-b border-white/10 p-6 md:p-8">
          <SectionTitle
            icon={<Sparkles className="h-6 w-6" />}
            title={hasPersonalizedPreviews ? labels.personalizedPreviews : labels.visualReferences}
          />
          <p className="mt-4 max-w-3xl text-sm leading-7 text-cream/62">
            {hasPersonalizedPreviews ? labels.personalizedPreviewsDescription : labels.visualReferencesDescription}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {illustrationUrls.slice(0, 3).map((url, index) => {
              const style = analysis.recomendaciones_peinado.estilos_ideales[index];

              return (
                <figure key={`${url}-${index}`} className="report-panel overflow-hidden rounded-lg border border-gold/18 bg-noir">
                  <div className="aspect-square bg-noir-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={style?.nombre || `${labels.visualReference} ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="p-4">
                    <p className="text-xs uppercase text-gold-light">{labels.visualReference} 0{index + 1}</p>
                    <h3 className="mt-2 font-display text-xl text-cream">{style?.nombre || labels.recommendedStyle}</h3>
                    {style?.descripcion ? <p className="mt-2 text-sm leading-6 text-cream/60">{style.descripcion}</p> : null}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="report-section grid gap-5 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        <ReportPanel icon={<Sparkles className="h-5 w-5" />} title={labels.hairColorDirection}>
          <p className="text-sm leading-7 text-cream/70">{analysis.colorimetria.paleta_cabello.descripcion}</p>
          <TagList items={analysis.colorimetria.paleta_cabello.tonos_ideales} tone="gold" label={labels.idealTones} />
          <TagList items={analysis.colorimetria.paleta_cabello.tonos_evitar} tone="red" label={labels.tonesToAvoid} />
        </ReportPanel>

        <ReportPanel icon={<Target className="h-5 w-5" />} title={labels.maintenancePlan}>
          <Checklist items={experience.plan_mantenimiento} />
          <TagList items={experience.productos_sugeridos} tone="neutral" label={labels.suggestedProducts} />
        </ReportPanel>
      </section>

      <section className="report-section grid gap-5 border-t border-white/10 bg-[linear-gradient(135deg,rgba(201,168,76,0.12),rgba(255,255,255,0.025))] p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionTitle icon={<XCircle className="h-6 w-6" />} title={labels.stylesToAvoid} />
          <TagList items={analysis.recomendaciones_peinado.estilos_evitar} tone="red" />
          <p className="mt-5 text-sm leading-7 text-cream/64">
            {analysis.recomendaciones_peinado.recomendaciones_adicionales}
          </p>
        </div>
        <div className="report-panel rounded-lg border border-gold/25 bg-noir/70 p-6">
          <SectionTitle icon={<MessageCircle className="h-6 w-6" />} title={labels.continueAdvisory} />
          <p className="mt-5 text-sm leading-7 text-cream/72">
            {labels.bookingDescription}
          </p>
          {bookingUrl ? (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-bold uppercase text-noir shadow-gold transition hover:bg-gold-light"
            >
              {labels.bookAppointment}
            </a>
          ) : (
            <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-sm text-cream/58">
              {labels.noBusinessPhone}
            </p>
          )}
        </div>
      </section>
    </article>
  );
}

function getClientExperience(analysis: VisagismReport, locale: Locale) {
  if (analysis.experiencia_cliente) {
    return analysis.experiencia_cliente;
  }

  if (locale === "en") {
    return {
      titulo_comercial: "Personal image direction",
      diagnostico_visual:
        "The report proposes a balanced, professional aesthetic direction that can adapt naturally to the client's personal style.",
      plan_mantenimiento: [
        "Schedule side and contour maintenance every 2 to 3 weeks.",
        "Use light products to preserve natural texture.",
        "Review color and finish in natural light before permanent changes."
      ],
      productos_sugeridos: ["Matte paste", "Light styling cream", "Moisturizing shampoo"],
      guion_asesoria:
        "This result is designed to enhance your visible proportions with a balanced cut, controlled texture and a palette that supports your natural presence."
    };
  }

  if (locale === "pt") {
    return {
      titulo_comercial: "Direcao de imagem personalizada",
      diagnostico_visual:
        "O relatorio propoe uma direcao estetica equilibrada, profissional e facil de adaptar ao estilo pessoal do cliente.",
      plan_mantenimiento: [
        "Agendar manutencao de laterais e contornos a cada 2 ou 3 semanas.",
        "Usar produtos leves para preservar a textura natural.",
        "Revisar cor e acabamento sob luz natural antes de mudancas definitivas."
      ],
      productos_sugeridos: ["Pasta matte", "Creme leve de styling", "Shampoo hidratante"],
      guion_asesoria:
        "Este resultado busca valorizar suas proporcoes visiveis com um corte equilibrado, textura controlada e uma paleta que acompanha melhor sua presenca natural."
    };
  }

  return {
      titulo_comercial: "Direccion de imagen personalizada",
      diagnostico_visual:
        "El informe propone una direccion estetica equilibrada, profesional y facil de adaptar al estilo personal del cliente.",
      plan_mantenimiento: [
        "Programar mantenimiento de laterales y contornos cada 2 a 3 semanas.",
        "Usar productos ligeros para conservar textura natural.",
        "Revisar color y acabado bajo luz natural antes de cambios definitivos."
      ],
      productos_sugeridos: ["Pasta mate", "Crema ligera de peinado", "Shampoo hidratante"],
      guion_asesoria:
        "Este resultado busca realzar tus proporciones visibles con un corte equilibrado, textura controlada y una paleta que acompane mejor tu presencia natural."
    };
}

const reportLabels = {
  es: {
    photoPending: "Foto del cliente pendiente",
    referencePhotos: "Fotos de referencia",
    analysisBadge: "Analisis Plenty Barber",
    reportEyebrow: "Informe de visagismo",
    approxAnalysis: "Analisis visual aproximado",
    faceShape: "Rostro",
    season: "Estacion",
    subtone: "Subtono",
    facialMorphology: "Morfologia facial",
    designLines: "Lineas de diseno",
    personalColorimetry: "Colorimetria personal",
    recommendedColors: "Colores recomendados",
    avoid: "Evitar",
    recommendedCuts: "Cortes y peinados recomendados",
    style: "Estilo",
    forProfessional: "Para el profesional",
    maintenance: "Mantenimiento",
    hairColorDirection: "Direccion de color de cabello",
    idealTones: "Tonos ideales",
    tonesToAvoid: "Tonos a evitar",
    maintenancePlan: "Plan de mantenimiento",
    suggestedProducts: "Productos sugeridos",
    stylesToAvoid: "Estilos a evitar",
    visualReferences: "Referencias visuales sugeridas",
    personalizedPreviews: "Simulaciones visuales de peinado",
    personalizedPreviewsDescription:
      "Estas imagenes son previews orientativas generadas sobre la foto del cliente para ayudar a decidir antes del corte. El resultado final depende del cabello real, tecnica y asesoria profesional.",
    visualReferencesDescription:
      "Estas imagenes son referencias de estilo generadas para apoyar la conversacion con el cliente. No representan una edicion exacta de su foto.",
    visualReference: "Referencia",
    recommendedStyle: "Estilo recomendado",
    continueAdvisory: "Continua tu asesoria",
    bookingDescription: "Agenda tu proxima cita para revisar el corte, mantenimiento o color recomendado en este informe.",
    bookAppointment: "Reserva tu cita aqui",
    noBusinessPhone: "La estetica puede activar este boton agregando su numero de WhatsApp en Configuracion.",
    defaultFaceGuideOne: "Mantener equilibrio visual entre laterales y parte superior.",
    defaultFaceGuideTwo: "Usar textura controlada para dar movimiento sin perder elegancia.",
    defaultFaceGuideThree: "Validar el angulo del rostro en persona antes del corte final."
  },
  en: {
    photoPending: "Client photo pending",
    referencePhotos: "Reference photos",
    analysisBadge: "Plenty Barber Analysis",
    reportEyebrow: "Visagism report",
    approxAnalysis: "Approximate visual analysis",
    faceShape: "Face shape",
    season: "Season",
    subtone: "Undertone",
    facialMorphology: "Facial morphology",
    designLines: "Design lines",
    personalColorimetry: "Personal colorimetry",
    recommendedColors: "Recommended colors",
    avoid: "Avoid",
    recommendedCuts: "Recommended cuts and styling",
    style: "Style",
    forProfessional: "For the professional",
    maintenance: "Maintenance",
    hairColorDirection: "Hair color direction",
    idealTones: "Ideal tones",
    tonesToAvoid: "Tones to avoid",
    maintenancePlan: "Maintenance plan",
    suggestedProducts: "Suggested products",
    stylesToAvoid: "Styles to avoid",
    visualReferences: "Suggested visual references",
    personalizedPreviews: "Visual hairstyle simulations",
    personalizedPreviewsDescription:
      "These images are directional previews generated on the client photo to support the decision before the haircut. Final results depend on real hair, technique and professional advice.",
    visualReferencesDescription:
      "These images are generated style references to support the client conversation. They are not an exact edit of the client's photo.",
    visualReference: "Reference",
    recommendedStyle: "Recommended style",
    continueAdvisory: "Continue your advisory",
    bookingDescription: "Book your next appointment to review the cut, maintenance or color recommended in this report.",
    bookAppointment: "Book your appointment here",
    noBusinessPhone: "The business can enable this button by adding its WhatsApp number in Settings.",
    defaultFaceGuideOne: "Keep visual balance between sides and top.",
    defaultFaceGuideTwo: "Use controlled texture to add movement without losing elegance.",
    defaultFaceGuideThree: "Validate the face angle in person before the final cut."
  },
  pt: {
    photoPending: "Foto do cliente pendente",
    referencePhotos: "Fotos de referencia",
    analysisBadge: "Analise Plenty Barber",
    reportEyebrow: "Relatorio de visagismo",
    approxAnalysis: "Analise visual aproximada",
    faceShape: "Rosto",
    season: "Estacao",
    subtone: "Subtom",
    facialMorphology: "Morfologia facial",
    designLines: "Linhas de design",
    personalColorimetry: "Colorimetria pessoal",
    recommendedColors: "Cores recomendadas",
    avoid: "Evitar",
    recommendedCuts: "Cortes e penteados recomendados",
    style: "Estilo",
    forProfessional: "Para o profissional",
    maintenance: "Manutencao",
    hairColorDirection: "Direcao de cor do cabelo",
    idealTones: "Tons ideais",
    tonesToAvoid: "Tons a evitar",
    maintenancePlan: "Plano de manutencao",
    suggestedProducts: "Produtos sugeridos",
    stylesToAvoid: "Estilos a evitar",
    visualReferences: "Referencias visuais sugeridas",
    personalizedPreviews: "Simulacoes visuais de penteado",
    personalizedPreviewsDescription:
      "Estas imagens sao previews orientativos gerados sobre a foto do cliente para ajudar na decisao antes do corte. O resultado final depende do cabelo real, tecnica e consultoria profissional.",
    visualReferencesDescription:
      "Estas imagens sao referencias de estilo geradas para apoiar a conversa com o cliente. Elas nao representam uma edicao exata da foto do cliente.",
    visualReference: "Referencia",
    recommendedStyle: "Estilo recomendado",
    continueAdvisory: "Continue sua consultoria",
    bookingDescription: "Agende sua proxima visita para revisar o corte, a manutencao ou a cor recomendada neste relatorio.",
    bookAppointment: "Reserve sua visita aqui",
    noBusinessPhone: "O negocio pode ativar este botao adicionando seu numero de WhatsApp em Configuracoes.",
    defaultFaceGuideOne: "Manter equilibrio visual entre laterais e parte superior.",
    defaultFaceGuideTwo: "Usar textura controlada para trazer movimento sem perder elegancia.",
    defaultFaceGuideThree: "Validar o angulo do rosto presencialmente antes do corte final."
  }
} satisfies Record<Locale, Record<string, string>>;

function buildWhatsAppBookingUrl(
  phone: string | null | undefined,
  clientName: string,
  businessName: string,
  locale: Locale
) {
  const digits = phone?.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  const message =
    locale === "en"
      ? `Hi, I am ${clientName}. I would like to book an appointment at ${businessName} to review my Plenty Barber visagism report.`
      : locale === "pt"
        ? `Ola, sou ${clientName}. Quero reservar uma visita em ${businessName} para revisar meu relatorio de visagismo Plenty Barber.`
        : `Hola, soy ${clientName}. Quiero reservar una cita en ${businessName} para revisar mi informe de visagismo Plenty Barber.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="report-panel rounded-lg border border-gold/18 bg-noir/55 p-4">
      <p className="text-xs uppercase text-gold-light/70">{label}</p>
      <p className="mt-2 font-display text-2xl capitalize text-cream">{value}</p>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 text-gold-light">
      {icon}
      <h2 className="font-display text-3xl text-cream">{title}</h2>
    </div>
  );
}

function ReportPanel({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="report-panel rounded-lg border border-white/10 bg-noir-soft p-6">
      <div className="mb-5 flex items-center gap-3 text-gold-light">
        {icon}
        <h2 className="font-display text-2xl text-cream">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ColorSwatches({ title, colors }: { title: string; colors: string[] }) {
  const swatches = colors.map((color, index) => ({
    label: color,
    value: resolveDisplayColor(color, index)
  }));

  return (
    <div className="mt-5">
      <p className="mb-3 text-xs uppercase text-cream/42">{title}</p>
      <div className="flex flex-wrap gap-3">
        {swatches.map((color) => (
          <span key={`${color.label}-${color.value}`} className="grid max-w-20 gap-2 text-center text-[10px] text-cream/50">
            <span
              className="h-12 w-12 justify-self-center rounded-full border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
              style={{ backgroundColor: color.value }}
              aria-label={color.label}
            />
            <span className="break-words leading-4">{color.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const fallbackSwatchColors = ["#C9A84C", "#8A6820", "#5B4636", "#F7F3EC", "#2F3A2F", "#6F1D1B"];

const namedSwatchColors: Record<string, string> = {
  amber: "#C9862A",
  ambar: "#C9862A",
  beige: "#D8C3A5",
  black: "#111111",
  blanco: "#F7F3EC",
  blue: "#2F5597",
  borgona: "#6F1D1B",
  brown: "#5B4636",
  burgundy: "#6F1D1B",
  camel: "#C19A6B",
  caramelo: "#B87333",
  charcoal: "#30343B",
  chocolate: "#4E342E",
  cobre: "#B66A3C",
  copper: "#B66A3C",
  cream: "#F7F3EC",
  crema: "#F7F3EC",
  dorado: "#C9A84C",
  emerald: "#2E6F4E",
  espresso: "#2A1B15",
  gold: "#C9A84C",
  graphite: "#3A3A3A",
  gray: "#6B6660",
  green: "#2F5D46",
  gris: "#6B6660",
  ivory: "#F4EBDD",
  marfil: "#F4EBDD",
  marron: "#5B4636",
  mocha: "#6F4E37",
  mostaza: "#B08D2A",
  mustard: "#B08D2A",
  navy: "#1F2A44",
  negro: "#111111",
  oliva: "#556B2F",
  olive: "#556B2F",
  red: "#8E2424",
  rojo: "#8E2424",
  rose: "#B76E79",
  rosado: "#B76E79",
  sand: "#C2B280",
  terracota: "#A0522D",
  terracotta: "#A0522D",
  verde: "#2F5D46",
  vino: "#6F1D1B",
  white: "#F7F3EC"
};

function resolveDisplayColor(color: string, index: number) {
  const clean = color.trim();

  if (isCssHexColor(clean)) {
    return clean;
  }

  const normalized = normalizeColorName(clean);
  const directMatch = namedSwatchColors[normalized];

  if (directMatch) {
    return directMatch;
  }

  const partialMatch = Object.entries(namedSwatchColors).find(([name]) => normalized.includes(name));

  return partialMatch?.[1] ?? fallbackSwatchColors[index % fallbackSwatchColors.length];
}

function isCssHexColor(color: string) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color);
}

function normalizeColorName(color: string) {
  return color
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9# ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function TagList({
  items,
  tone,
  label
}: {
  items: string[];
  tone: "gold" | "red" | "neutral";
  label?: string;
}) {
  const toneClass =
    tone === "gold"
      ? "border-gold/25 text-gold-light"
      : tone === "red"
        ? "border-red-400/25 text-red-100/82"
        : "border-white/10 text-cream/70";

  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-5">
      {label ? <p className="mb-3 text-xs uppercase text-cream/42">{label}</p> : null}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-full border px-3 py-1 text-xs ${toneClass}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Checklist({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className="mt-5">
      {title ? <p className="mb-3 text-xs uppercase text-cream/42">{title}</p> : null}
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-cream/70">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniNote({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="report-panel mt-4 rounded-lg border border-white/10 bg-white/[0.025] p-3">
      <p className="flex items-center gap-2 text-xs uppercase text-gold-light/75">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-cream/66">{value}</p>
    </div>
  );
}
