import { z } from "zod";
import { EventCategory, EventStatus, TicketStatus } from "@/generated/prisma/enums";

export const eventArtistInputSchema = z.object({
  artistId: z.string().min(1, "Artist ID is required."),
  eventRole: z.string().trim().max(120).optional().nullable(),
});

export const eventTicketInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Ticket name is required.").max(100),
  description: z.string().trim().max(1000).optional().nullable(),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  totalQuantity: z.coerce
    .number()
    .int()
    .min(1, "Total quantity must be at least 1."),
  status: z.nativeEnum(TicketStatus).optional(),
});

export const createEventSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.")
      .optional(),
    category: z.nativeEnum(EventCategory),
    shortDescription: z.string().trim().max(500).optional().nullable(),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    bannerUrl: z.string().trim().url("Banner URL must be a valid URL.").optional().nullable().or(z.literal("").transform(() => null)),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    capacity: z.coerce.number().int().min(1, "Capacity must be at least 1."),
    status: z.nativeEnum(EventStatus).optional(),
    venueId: z.string().trim().min(1).optional().nullable(),
    artists: z.array(eventArtistInputSchema).optional(),
    ticketTypes: z.array(eventTicketInputSchema).optional(),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: "End date/time must be after start date/time.",
    path: ["endAt"],
  });

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    category: z.nativeEnum(EventCategory).optional(),
    shortDescription: z.string().trim().max(500).optional().nullable(),
    description: z.string().trim().min(10).optional(),
    bannerUrl: z.string().trim().url().optional().nullable().or(z.literal("").transform(() => null)),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    capacity: z.coerce.number().int().min(1).optional(),
    status: z.nativeEnum(EventStatus).optional(),
    venueId: z.string().trim().min(1).optional().nullable(),
    artists: z.array(eventArtistInputSchema).optional(),
    ticketTypes: z.array(eventTicketInputSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return data.endAt > data.startAt;
      }
      return true;
    },
    {
      message: "End date/time must be after start date/time.",
      path: ["endAt"],
    }
  );

export const updateEventStatusSchema = z.object({
  status: z.nativeEnum(EventStatus),
});

export const publishEventSchema = z.object({
  publish: z.boolean().optional().default(true),
});

