import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminDashboardData = {
  applications: Record<string, unknown>[];
  campaigns: Record<string, unknown>[];
  profiles: Record<string, unknown>[];
  donations: Record<string, unknown>[];
  pledges: Record<string, unknown>[];
  subscriptions: Record<string, unknown>[];
  submissions: Record<string, unknown>[];
  galleryItems: Record<string, unknown>[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const results = await Promise.all([
    supabase
      .from("campaign_applications")
      .select("id,organizer_name,email,phone,campaign_title,category,location,goal_amount,status,reviewer_notes,summary,use_of_funds,image_path,document_paths,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("campaigns")
      .select("id,slug,title,status,raised_amount,goal_amount,supporter_count,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("profiles")
      .select("id,email,full_name,phone,role,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("donations")
      .select("id,campaign_slug,amount,tip_amount,total_amount,currency,status,provider,anonymous,donor_name,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("pledges")
      .select("id,campaign_slug,name,email,phone,amount,message,anonymous,status,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("newsletter_subscriptions")
      .select("id,email,status,source,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("submissions")
      .select("id,submission_type,payload,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("gallery_items")
      .select("id,image_url,storage_path,alt_text,category,status,created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
  return {
    applications: results[0].data ?? [],
    campaigns: results[1].data ?? [],
    profiles: results[2].data ?? [],
    donations: results[3].data ?? [],
    pledges: results[4].data ?? [],
    subscriptions: results[5].data ?? [],
    submissions: results[6].data ?? [],
    galleryItems: results[7].data ?? [],
  };
}
