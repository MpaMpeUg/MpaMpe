import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7)
  .max(30)
  .regex(/^[+()\-\s0-9]+$/, "Enter a valid phone number");

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(160),
  phone: phone.optional().or(z.literal("")),
  inquiryType: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});

export const newsletterSchema = z.object({
  email: z.email().max(160),
  website: z.string().max(0).optional(),
});

export const maverickSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(160),
  phone,
  location: z.string().trim().min(2).max(120),
  interests: z.array(z.string().trim().min(2)).min(1).max(6),
  availability: z.string().trim().min(2).max(120),
  motivation: z.string().trim().min(30).max(2000),
  acceptedConduct: z.literal(true),
  website: z.string().max(0).optional(),
});

export const campaignApplicationSchema = z.object({
  organizerName: z.string().trim().min(2).max(120),
  email: z.email().max(160),
  phone,
  campaignTitle: z.string().trim().min(8).max(160),
  category: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  goal: z.coerce.number().int().min(50_000).max(5_000_000_000),
  summary: z.string().trim().min(80).max(3000),
  useOfFunds: z.string().trim().min(40).max(2000),
  acceptedTerms: z.literal(true),
  website: z.string().max(0).optional(),
});

export const donationSchema = z.object({
  campaignSlug: z.string().trim().min(3).max(180),
  amount: z.coerce.number().int().min(1_000).max(100_000_000),
  donorName: z.string().trim().min(2).max(100).optional().or(z.literal("")),
  email: z.email().max(160),
  phone: phone.optional().or(z.literal("")),
  anonymous: z.boolean().default(false),
  paymentMethod: z.enum(["mobile-money", "card", "bank"]),
});
