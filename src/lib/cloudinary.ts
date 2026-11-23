import crypto from "crypto";
import { AppError } from "@/lib/utils/api-response";

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
};

function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError("Cloudinary credentials are not configured.", 500);
  }

  return { cloudName, apiKey, apiSecret };
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    mimeType?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder || "ife-events";

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };
  if (options.publicId) {
    paramsToSign.public_id = options.publicId;
  }

  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(`${signatureBase}${apiSecret}`)
    .digest("hex");

  const formData = new FormData();
  const mime = options.mimeType || "image/png";
  const uint8 = new Uint8Array(fileBuffer);
  formData.append("file", new Blob([uint8], { type: mime }), "upload.png");
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  if (options.publicId) {
    formData.append("public_id", options.publicId);
  }
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const json = (await response.json()) as CloudinaryUploadResult & {
    error?: { message?: string };
  };

  if (!response.ok || !json.secure_url) {
    throw new AppError(
      json.error?.message || "Cloudinary upload failed.",
      502
    );
  }

  return json;
}

