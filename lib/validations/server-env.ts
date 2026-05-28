import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  STRIPE_SECRET_KEY: z.string().optional().or(z.literal("")),
  STRIPE_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
  OPENAI_API_KEY: z.string().optional().or(z.literal("")),
  ANTHROPIC_API_KEY: z.string().optional().or(z.literal("")),
  GOOGLE_AI_API_KEY: z.string().optional().or(z.literal("")),
  MISTRAL_API_KEY: z.string().optional().or(z.literal("")),
  REPLICATE_API_TOKEN: z.string().optional().or(z.literal("")),
  SUPER_ADMIN_EMAIL: z.string().email().optional().or(z.literal(""))
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL
});
