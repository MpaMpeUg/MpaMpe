import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { jsonError, validationMessage } from "@/lib/http";
import {
  createServerSupabaseClient,
  getCurrentSupabaseUser,
  isSupabaseAdmin,
} from "@/lib/supabase/server";

const metadataSchema = z.object({
  altText: z.string().trim().min(3).max(180),
  category: z.string().trim().min(2).max(60),
});

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  const user = await getCurrentSupabaseUser();
  if (!isSupabaseAdmin(user)) return jsonError("Unauthorized.", 401);

  const supabase = await createServerSupabaseClient();
  if (!supabase) return jsonError("Supabase is not configured.", 503);

  const form = await request.formData();
  const file = form.get("image");
  const metadata = metadataSchema.safeParse({
    altText: form.get("altText"),
    category: form.get("category"),
  });

  if (!metadata.success) return jsonError(validationMessage(metadata.error));
  if (!(file instanceof File)) return jsonError("Choose an image to upload.");
  if (!allowedTypes.has(file.type)) {
    return jsonError("Upload a JPEG, PNG or WebP image.");
  }
  if (file.size > 20 * 1024 * 1024) {
    return jsonError("Gallery images must be 20 MB or smaller.");
  }

  const extension = allowedTypes.get(file.type)!;
  const storagePath = `${user!.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("gallery-images")
    .upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) return jsonError(uploadError.message, 400);

  const { data: publicImage } = supabase.storage
    .from("gallery-images")
    .getPublicUrl(storagePath);

  const { error: insertError } = await supabase.from("gallery_items").insert({
    image_url: publicImage.publicUrl,
    storage_path: storagePath,
    alt_text: metadata.data.altText,
    category: metadata.data.category,
    status: "active",
    created_by: user!.id,
  });

  if (insertError) {
    await supabase.storage.from("gallery-images").remove([storagePath]);
    return jsonError(insertError.message, 400);
  }

  revalidatePath("/gallery");
  revalidatePath("/admin");
  revalidateTag("gallery", "max");
  return Response.json({ message: "Gallery photo uploaded and published." });
}
