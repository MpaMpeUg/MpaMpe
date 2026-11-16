import { revalidatePath } from "next/cache";
import { z } from "zod";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

const statusSchema = z.object({
  status: z.enum(["active", "funded", "completed", "paused"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!isSupabaseAdmin(user)) return jsonError("Unauthorized.", 401);
  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);
  const payload = statusSchema.safeParse(await parseJsonBody(request));
  if (!payload.success) return jsonError(validationMessage(payload.error));
  const { id } = await params;
  const { data, error } = await supabase
    .from("campaigns")
    .update({ status: payload.data.status })
    .eq("id", id)
    .select("id,slug")
    .maybeSingle();
  if (error) return jsonError(error.message, 400);
  if (!data) return jsonError("Campaign was not found.", 404);
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${data.slug}`);
  revalidatePath("/admin");
  return Response.json({ message: "Campaign status updated." });
}
