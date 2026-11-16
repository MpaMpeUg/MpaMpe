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
  imagePath: z.string().trim().min(3).max(500),
  documentPaths: z.array(z.string().trim().min(3).max(500)).max(5).default([]),
  acceptedTerms: z.literal(true),
  website: z.string().max(0).optional(),
});

export const organizerCampaignSchema = z.object({
  title: z.string().trim().min(8).max(160),
  shortTitle: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(80).max(3000),
  story: z.array(z.string().trim().min(10).max(3000)).max(20).default([]),
  location: z.string().trim().min(2).max(120),
  endDate: z.iso.date().nullable().optional(),
});

export const campaignVisibilitySchema = z.object({
  visibility: z.enum(["public", "private"]),
});

export const campaignUpdateSchema = z.object({
  title: z.string().trim().min(5).max(160),
  body: z.string().trim().min(20).max(5000),
});

export const donationSchema = z.object({
  campaignSlug: z.string().trim().min(3).max(180),
  campaignAccessToken: z.uuid().optional(),
  amount: z.coerce.number().int().min(1_000).max(100_000_000),
  tipAmount: z.coerce.number().int().min(0).max(100_000_000).default(0),
  donorName: z.string().trim().min(2).max(100).optional().or(z.literal("")),
  email: z.email().max(160).optional().or(z.literal("")),
  phone: phone.optional().or(z.literal("")),
  anonymous: z.boolean().default(false),
  paymentMethod: z.enum(["mobile-money", "card", "bank"]),
  mobileMoneyNetwork: z.enum(["MTN", "AIRTEL"]).optional(),
  pledge: z.boolean().default(false),
}).superRefine((data, context) => {
  if (data.paymentMethod === "mobile-money" && !data.phone) {
    context.addIssue({
      code: "custom",
      path: ["phone"],
      message: "Phone number is required for Mobile Money giving",
    });
  }

  if (data.paymentMethod === "mobile-money" && !data.mobileMoneyNetwork) {
    context.addIssue({
      code: "custom",
      path: ["mobileMoneyNetwork"],
      message: "Select MTN or Airtel for Uganda Mobile Money",
    });
  }

  if (!data.anonymous && !data.donorName) {
    context.addIssue({
      code: "custom",
      path: ["donorName"],
      message: "Enter a name or choose anonymous giving",
    });
  }
});

export const pledgeSchema = z.object({
  campaignSlug: z.string().trim().min(3).max(180),
  campaignAccessToken: z.uuid().optional(),
  name: z.string().trim().min(2).max(100).optional().or(z.literal("")),
  email: z.email().max(160).optional().or(z.literal("")),
  phone: phone.optional().or(z.literal("")),
  amount: z.coerce.number().int().min(0).max(100_000_000).default(0),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  anonymous: z.boolean().default(false),
  contactConsent: z.literal(true),
  website: z.string().max(0).optional(),
}).superRefine((data, context) => {
  if (!data.email && !data.phone) {
    context.addIssue({
      code: "custom",
      path: ["email"],
      message: "Add an email or phone number so MpaMpe can follow up",
    });
  }

  if (!data.anonymous && !data.name) {
    context.addIssue({
      code: "custom",
      path: ["name"],
      message: "Enter a name or choose anonymous pledge",
    });
  }
});
