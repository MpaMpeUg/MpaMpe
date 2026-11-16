import { revalidatePath } from "next/cache";
import { jsonError } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
} from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!user) return jsonError("Sign in to remove a campaign update.", 401);

  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const { id } = await params;
  const { data: update, error: updateError } = await supabase
    .from("campaign_updates")
    .select("id,campaign_id")
    .eq("id", id)
    .maybeSingle();
  if (updateError) return jsonError(updateError.message, 400);
  if (!update) return jsonError("Campaign update was not found.", 404);

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id,slug")
    .eq("id", update.campaign_id)
    .eq("organizer_id", user.id)
    .maybeSingle();
  if (campaignError) return jsonError(campaignError.message, 400);
  if (!campaign) return jsonError("Campaign update was not found.", 404);

  const { data: removed, error } = await supabase
    .from("campaign_updates")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) return jsonError(error.message, 400);
  if (!removed) return jsonError("Campaign update was not found.", 404);

  revalidatePath("/dashboard");
  revalidatePath(`/campaigns/${campaign.slug}`);
  return Response.json({ message: "Campaign update removed." });
}
