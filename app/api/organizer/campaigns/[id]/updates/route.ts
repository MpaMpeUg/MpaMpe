import { revalidatePath } from "next/cache";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
} from "@/lib/supabase/server";
import { campaignUpdateSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!user) return jsonError("Sign in to publish a campaign update.", 401);

  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const payload = campaignUpdateSchema.safeParse(await parseJsonBody(request));
  if (!payload.success) return jsonError(validationMessage(payload.error));

  const { id } = await params;
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id,slug")
    .eq("id", id)
    .eq("organizer_id", user.id)
    .maybeSingle();
  if (campaignError) return jsonError(campaignError.message, 400);
  if (!campaign) return jsonError("Campaign was not found.", 404);

  const { data: update, error } = await supabase
    .from("campaign_updates")
    .insert({
      campaign_id: campaign.id,
      title: payload.data.title,
      body: payload.data.body,
    })
    .select("id")
    .single();
  if (error) return jsonError(error.message, 400);

  revalidatePath("/dashboard");
  revalidatePath(`/campaigns/${campaign.slug}`);
  return Response.json({ message: "Campaign update published.", id: update.id });
}
