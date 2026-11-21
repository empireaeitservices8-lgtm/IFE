import { NextRequest } from "next/server";
import { AppError } from "@/lib/utils/api-response";

type Bucket = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  rateLimitStore?: Map<string, Bucket>;
};

const store =
  globalForRateLimit.rateLimitStore ?? new Map<string, Bucket>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitStore = store;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function enforceRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): void {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    throw new AppError(
      "Too many requests. Please wait a moment and try again.",
      429
    );
  }

  existing.count += 1;
}

