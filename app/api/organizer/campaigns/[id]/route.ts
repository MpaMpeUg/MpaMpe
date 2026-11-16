import { revalidatePath } from "next/cache";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
} from "@/lib/supabase/server";
import { organizerCampaignSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!user) return jsonError("Sign in to manage your campaign.", 401);

  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const payload = organizerCampaignSchema.safeParse(await parseJsonBody(request));
  if (!payload.success) return jsonError(validationMessage(payload.error));

  const { id } = await params;
  const { data: slug, error } = await supabase.rpc(
    "update_organizer_campaign",
    {
      p_campaign_id: id,
      p_title: payload.data.title,
      p_short_title: payload.data.shortTitle,
      p_summary: payload.data.summary,
      p_story: payload.data.story,
      p_location: payload.data.location,
      p_end_date: payload.data.endDate || null,
    },
  );

  if (error) {
    return jsonError(error.message, error.code === "P0002" ? 404 : 400);
  }

  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${slug}`);
  return Response.json({ message: "Campaign details updated.", slug });
}
