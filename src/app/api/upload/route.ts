import { NextRequest } from "next/server";
import { requireAdminOrStaff } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { AppError, created, handleApiError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    await requireAdminOrStaff();

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "ife-events");

    if (!(file instanceof File)) {
      throw new AppError("Image file is required.", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new AppError(
        "Unsupported image format. Use JPG, PNG, WebP, or AVIF.",
        400
      );
    }

    if (file.size > MAX_BYTES) {
      throw new AppError("Image size must be 5MB or less.", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await uploadToCloudinary(Buffer.from(arrayBuffer), {
      folder,
      mimeType: file.type,
    });

    return created(
      {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
      "Image uploaded to Cloudinary."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

