import { z } from "zod";

export const createOrderSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required."),
});

export const verifyPaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required."),
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required."),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required."),
  razorpaySignature: z.string().min(1, "Razorpay signature is required."),
});

export const createRefundSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required."),
  amount: z.coerce
    .number()
    .positive("Refund amount must be greater than 0.")
    .optional(),
  reason: z.string().trim().max(500).optional(),
});

