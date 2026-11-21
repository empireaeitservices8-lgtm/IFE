import { z } from "zod";
import { VenueStatus } from "@/generated/prisma/enums";

export const createVenueSchema = z.object({
  name: z.string().trim().min(2, "Venue name is required.").max(150),
  address: z.string().trim().min(3, "Address is required.").max(255),
  city: z.string().trim().min(2, "City is required.").max(100),
  state: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  country: z.string().trim().min(2).max(100).optional().default("India"),
  postalCode: z
    .string()
    .trim()
    .max(20)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1."),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  facilities: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  status: z.nativeEnum(VenueStatus).optional().default(VenueStatus.AVAILABLE),
});

export const updateVenueSchema = createVenueSchema.partial();

