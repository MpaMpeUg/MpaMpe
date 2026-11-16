import { revalidatePath } from "next/cache";
import { z } from "zod";
import { jsonError, parseJsonBody, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

const roleSchema = z.object({
  role: z.enum(["donor", "organizer", "maverick", "admin"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSupabaseUser();
  if (!isSupabaseAdmin(user)) return jsonError("Unauthorized.", 401);
  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);
  const payload = roleSchema.safeParse(await parseJsonBody(request));
  if (!payload.success) return jsonError(validationMessage(payload.error));
  const { id } = await params;
  const { error } = await supabase.rpc("set_platform_user_role", {
    p_user_id: id,
    p_role: payload.data.role,
  });
  if (error) return jsonError(error.message, error.code === "P0002" ? 404 : 400);
  revalidatePath("/admin");
  return Response.json({ message: "User role updated. Their session must refresh." });
}
