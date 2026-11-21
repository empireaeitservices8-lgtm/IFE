import { z } from "zod";
import { EventCategory, MediaStatus, MediaType } from "@/generated/prisma/enums";

export const createGallerySchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(150),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  type: z.nativeEnum(MediaType).default(MediaType.IMAGE),
  category: z.nativeEnum(EventCategory),
  url: z.string().trim().url("Media URL must be a valid URL."),
  thumbnailUrl: z
    .string()
    .trim()
    .url("Thumbnail URL must be a valid URL.")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  altText: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  isFeatured: z.boolean().optional().default(false),
  status: z.nativeEnum(MediaStatus).optional().default(MediaStatus.PUBLISHED),
  eventId: z
    .string()
    .trim()
    .min(1)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export const updateGallerySchema = createGallerySchema.partial();

