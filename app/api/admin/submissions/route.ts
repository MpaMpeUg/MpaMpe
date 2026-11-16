import { jsonError } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

export async function GET() {
  const user = await getCurrentSupabaseUser();
  if (!isSupabaseAdmin(user)) {
    return jsonError("Unauthorized.", 401);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("id,submission_type,payload,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return jsonError(error.message, 400);

  return Response.json({ submissions: submissions ?? [], mode: "supabase" });
}
