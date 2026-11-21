import { z } from "zod";
import { TicketStatus } from "@/generated/prisma/enums";

export const createTicketSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
  name: z.string().trim().min(1, "Ticket name is required.").max(100),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  totalQuantity: z.coerce
    .number()
    .int()
    .min(1, "Total quantity must be at least 1."),
  status: z.nativeEnum(TicketStatus).optional().default(TicketStatus.ACTIVE),
});

export const updateTicketSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  price: z.coerce.number().min(0).optional(),
  totalQuantity: z.coerce.number().int().min(1).optional(),
  status: z.nativeEnum(TicketStatus).optional(),
});

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
});

