import { revalidatePath } from "next/cache";
import { z } from "zod";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

const statusSchema = z.object({
  status: z.enum(["under_review", "needs_info", "declined"]),
  notes: z.string().trim().max(1000).optional(),
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
  const { data: application, error: applicationError } = await supabase
    .from("campaign_applications")
    .select("id,status")
    .eq("id", id)
    .maybeSingle();
  if (applicationError) return jsonError(applicationError.message, 400);
  if (!application) return jsonError("Campaign application was not found.", 404);
  if (application.status === "approved") {
    return jsonError("Approved applications cannot be changed.", 409);
  }

  const { data: updated, error } = await supabase
    .from("campaign_applications")
    .update({
      status: payload.data.status,
      reviewer_notes: payload.data.notes || null,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) return jsonError(error.message, 400);
  if (!updated) return jsonError("Campaign application was not found.", 404);
  revalidatePath("/admin");
  return Response.json({ message: "Application status updated." });
}
