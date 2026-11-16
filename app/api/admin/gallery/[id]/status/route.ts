import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

const statusSchema = z.object({
  status: z.enum(["active", "hidden"]),
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
    .from("gallery_items")
    .update({ status: payload.data.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return jsonError(error.message, 400);
  if (!data) return jsonError("Gallery photo was not found.", 404);

  revalidatePath("/gallery");
  revalidatePath("/admin");
  revalidateTag("gallery", "max");
  return Response.json({
    message: payload.data.status === "active" ? "Photo published." : "Photo hidden.",
  });
}
