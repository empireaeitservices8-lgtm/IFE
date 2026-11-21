import { z } from "zod";
import { UserStatus } from "@/generated/prisma/enums";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export const updateCustomerStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

