import { z } from "zod";

export const bookingItemInputSchema = z.object({
  ticketTypeId: z.string().min(1, "Ticket type ID is required."),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "Quantity must be at least 1.")
    .max(20, "Maximum 20 tickets per type in one booking."),
});

export const createBookingSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name is required.")
    .max(120),
  customerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20),
  items: z
    .array(bookingItemInputSchema)
    .min(1, "Select at least one ticket."),
});

