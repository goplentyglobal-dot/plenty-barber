type CreateWhatsAppShareUrlInput = {
  phone?: string | null;
  clientName: string;
  businessName: string;
  reportUrl: string;
};

export function createWhatsAppShareUrl({
  phone,
  clientName,
  businessName,
  reportUrl
}: CreateWhatsAppShareUrlInput) {
  const normalizedPhone = phone?.replace(/[^\d]/g, "") || "";
  const message = `Hola ${clientName}, aqui tienes tu informe personalizado de visagismo creado por ${businessName}. Puedes verlo aqui: ${reportUrl}`;
  const target = normalizedPhone ? `https://wa.me/${normalizedPhone}` : "https://wa.me/";

  return `${target}?text=${encodeURIComponent(message)}`;
}
