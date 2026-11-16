import { revalidatePath } from "next/cache";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
} from "@/lib/supabase/server";
import { campaignVisibilitySchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!user) return jsonError("Sign in to change campaign visibility.", 401);

  const payload = campaignVisibilitySchema.safeParse(await parseJsonBody(request));
  if (!payload.success) return jsonError(validationMessage(payload.error));

  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const { id } = await params;
  const { data, error } = await supabase.rpc(
    "set_organizer_campaign_visibility",
    { p_campaign_id: id, p_visibility: payload.data.visibility },
  );
  if (error) {
    return jsonError(error.message, error.code === "P0002" ? 404 : 400);
  }

  const result = data && typeof data === "object"
    ? data as { slug?: string; visibility?: string; shareToken?: string | null }
    : {};
  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  if (result.slug) revalidatePath(`/campaigns/${result.slug}`);

  return Response.json({
    message: payload.data.visibility === "private"
      ? "Campaign is private. Share its secure link with invited supporters."
      : "Campaign is public and can appear in campaign discovery.",
    ...result,
  });
}
