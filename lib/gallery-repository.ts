export type ManagedGalleryImage = {
  src: string;
  alt: string;
};

type GalleryRow = {
  image_url: string;
  alt_text: string;
};

export async function getPublishedGalleryImages(): Promise<ManagedGalleryImage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) return [];

  const query = new URL("/rest/v1/gallery_items", supabaseUrl);
  query.searchParams.set("select", "image_url,alt_text");
  query.searchParams.set("status", "eq.active");
  query.searchParams.set("order", "created_at.desc");

  try {
    const response = await fetch(query, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
      next: { revalidate: 3600, tags: ["gallery"] },
    });
    if (!response.ok) return [];

    const rows = (await response.json()) as GalleryRow[];
    return rows.map((row) => ({
      src: row.image_url,
      alt: row.alt_text || "MpaMpe community photo",
    }));
  } catch {
    return [];
  }
}
