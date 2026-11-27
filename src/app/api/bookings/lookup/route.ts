import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AppError, handleApiError, ok } from "@/lib/utils/api-response";
import { enforceRateLimit, getClientIp } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

const lookupSchema = z.object({
  bookingCode: z.string().trim().min(4, "Booking code is required.").max(64),
  contact: z
    .string()
    .trim()
    .min(4, "Please enter the email or phone number used during booking.")
    .max(120),
});

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit(`bookings:lookup:${ip}`, 20, 60_000);

    const body = await req.json();
    const { bookingCode, contact } = lookupSchema.parse(body);

    const normalizedCode = bookingCode.toUpperCase();
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: normalizedCode },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            endAt: true,
            venue: { select: { name: true, city: true } },
          },
        },
        items: {
          include: {
            ticketType: { select: { name: true, price: true } },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            gatewayOrderId: true,
            gatewayPaymentId: true,
            status: true,
            paidAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new AppError(
        "No booking found matching that booking code and contact.",
        404
      );
    }

    const emailMatch =
      booking.customerEmail.trim().toLowerCase() === contact.toLowerCase();

    const contactDigits = normalizeDigits(contact);
    const bookingPhoneDigits = normalizeDigits(booking.customerPhone);
    const phoneMatch =
      contactDigits.length >= 7 &&
      bookingPhoneDigits.length >= 7 &&
      (bookingPhoneDigits === contactDigits ||
        bookingPhoneDigits.endsWith(contactDigits) ||
        contactDigits.endsWith(bookingPhoneDigits));

    if (!emailMatch && !phoneMatch) {
      throw new AppError(
        "No booking found matching that booking code and contact.",
        404
      );
    }

    return ok({
      booking: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        customerName: booking.customerName,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: Number(booking.totalAmount),
        currency: booking.currency,
        createdAt: booking.createdAt,
        event: booking.event,
        items: booking.items.map((item) => ({
          id: item.id,
          name: item.ticketType?.name || "Event Pass",
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.lineTotal),
        })),
        payment: booking.payments[0] ?? null,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
