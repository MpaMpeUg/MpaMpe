import { clientIp, jsonError, validationMessage } from "@/lib/http";
import { storagePathsBelongToUser } from "@/lib/platform";
import { rateLimit } from "@/lib/rate-limit";
import { saveCampaignApplication } from "@/lib/repository";
import { campaignApplicationSchema } from "@/lib/validation";
import {
  getCurrentSupabaseUser,
  hasServerSupabaseConfig,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  const limit = rateLimit(`campaign:${clientIp(request)}`, 3, 60_000);
  if (!limit.allowed) {
    return jsonError("Please wait before submitting another campaign.", 429);
  }

  try {
    const user = await getCurrentSupabaseUser();
    if (hasServerSupabaseConfig() && !user) {
      return jsonError("Sign in and confirm your email before creating a campaign.", 401);
    }

    const data = campaignApplicationSchema.safeParse(await request.json());
    if (!data.success) return jsonError(validationMessage(data.error));
    if (data.data.website) return Response.json({ message: "Application received." });
    if (
      user &&
      !storagePathsBelongToUser(
        user.id,
        data.data.imagePath,
        data.data.documentPaths,
      )
    ) {
      return jsonError("Campaign files do not belong to this account.", 403);
    }
    const result = await saveCampaignApplication({
      ...data.data,
      organizerId: user?.id,
      email: user?.email ?? data.data.email,
      applicationStatus: "received",
    });
    return Response.json(
      {
        message:
          "Your initial campaign application has been received for review.",
        reference: result.id,
        mode: result.mode,
      },
      { status: 201 },
    );
  } catch {
    return jsonError("Unable to receive the campaign right now.", 500);
  }
}
