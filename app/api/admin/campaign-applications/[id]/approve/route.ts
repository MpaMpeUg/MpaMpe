import { revalidatePath } from "next/cache";
import { z } from "zod";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import { normalizeCampaignSlug } from "@/lib/admin";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

const approvalSchema = z.object({
  slug: z.string().trim().min(3).max(140),
  shortTitle: z.string().trim().min(3).max(120),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!isSupabaseAdmin(user)) return jsonError("Unauthorized.", 401);
  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const payload = approvalSchema.safeParse(await parseJsonBody(request));
  if (!payload.success) return jsonError(validationMessage(payload.error));
  const slug = normalizeCampaignSlug(payload.data.slug);
  if (!slug) return jsonError("Enter a valid campaign slug.");

  const { id } = await params;
  const { data: application, error: applicationError } = await supabase
    .from("campaign_applications")
    .select("image_path")
    .eq("id", id)
    .single();
  if (applicationError || !application?.image_path) {
    return jsonError("Campaign application image was not found.", 404);
  }

  const encodedPath = String(application.image_path)
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-images/${encodedPath}`;
  const { data: campaignId, error } = await supabase.rpc(
    "approve_campaign_application",
    {
      p_application_id: id,
      p_slug: slug,
      p_short_title: payload.data.shortTitle,
      p_image_url: imageUrl,
    },
  );
  if (error) return jsonError(error.message, error.code === "23505" ? 409 : 400);

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${slug}`);
  revalidatePath("/admin");
  return Response.json({
    message: "Campaign approved and published.",
    campaignId,
    slug,
  });
}
