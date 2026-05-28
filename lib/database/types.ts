export type Business = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  logo_url: string | null;
  plan_id: string | null;
  credits_remaining: number;
  credits_alert_threshold: number;
  auto_reload: boolean;
  preferred_ai_provider: string;
  preferred_image_provider: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  active: boolean;
  created_at: string;
};

export type EndClient = {
  id: string;
  business_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GenerationStatus = "pending" | "processing" | "done" | "error";

export type Generation = {
  id: string;
  business_id: string;
  end_client_id: string | null;
  created_by: string | null;
  photo_urls: string[] | null;
  gender: string | null;
  ai_provider: string | null;
  ai_model: string | null;
  image_provider: string | null;
  tokens_used: number | null;
  cost_usd: number | null;
  report_json: unknown;
  illustration_urls: string[] | null;
  pdf_url: string | null;
  pdf_expires_at: string | null;
  public_token?: string | null;
  is_public?: boolean;
  published_at?: string | null;
  views_count?: number;
  public_expires_at?: string | null;
  status: GenerationStatus;
  error_message: string | null;
  created_at: string;
};

export type CreditTransaction = {
  id: string;
  business_id: string;
  credits_delta: number;
  price_usd: number | null;
  stripe_payment_intent_id: string | null;
  type: string | null;
  note: string | null;
  created_at: string;
};

export type ReportListItem = Generation & {
  end_clients: Pick<EndClient, "full_name" | "phone" | "email"> | null;
  businesses?: Pick<Business, "name" | "phone"> | null;
};
