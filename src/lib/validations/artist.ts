import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().trim().min(2, "Artist name is required.").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  phone: z
    .string()
    .trim()
    .max(25)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  role: z.string().trim().min(2, "Artist role is required.").max(100),
  location: z
    .string()
    .trim()
    .max(120)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be valid.")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  bio: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  isActive: z.boolean().optional().default(true),
});

export const updateArtistSchema = createArtistSchema.partial();

