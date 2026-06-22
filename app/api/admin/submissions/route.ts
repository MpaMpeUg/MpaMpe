import { getUser } from "@netlify/identity";
import { getSql } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { listDemoSubmissions } from "@/lib/repository";

export async function GET() {
  const user = await getUser();
  const roles = user?.roles ?? [];
  if (!user || !roles.includes("admin")) {
    return jsonError("Unauthorized.", 401);
  }

  const sql = getSql();
  if (!sql) {
    return Response.json({ submissions: await listDemoSubmissions(), mode: "demo" });
  }
  const submissions = await sql`
    select id, submission_type, payload, created_at
    from submissions
    order by created_at desc
    limit 100
  `;
  return Response.json({ submissions, mode: "database" });
}
