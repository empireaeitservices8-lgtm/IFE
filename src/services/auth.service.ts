import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/generated/prisma/enums";
import {
  SafeUser,
  hashPassword,
  signPasswordResetToken,
  signSessionToken,
  verifyPassword,
  verifyPasswordResetToken,
} from "@/lib/auth";
import { AppError } from "@/lib/utils/api-response";
import { recordAuditLog } from "@/lib/utils/audit";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ user: SafeUser; token: string }> {
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingEmail) {
    throw new AppError("An account with this email already exists.", 409);
  }

  if (input.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: input.phone },
      select: { id: true },
    });
    if (existingPhone) {
      throw new AppError(
        "An account with this phone number already exists.",
        409
      );
    }
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone ?? null,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
    select: safeUserSelect,
  });

  const token = await signSessionToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });

  return { user, token };
}

export async function loginUser(
  input: { email: string; password: string },
  ipAddress?: string
): Promise<{ user: SafeUser; token: string }> {
  const userRecord = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!userRecord) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (userRecord.status === UserStatus.BLOCKED) {
    throw new AppError(
      "Your account has been suspended. Please contact support.",
      403
    );
  }

  if (userRecord.status !== UserStatus.ACTIVE) {
    throw new AppError("Your account is inactive.", 403);
  }

  const valid = await verifyPassword(input.password, userRecord.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = await signSessionToken({
    sub: userRecord.id,
    role: userRecord.role,
    email: userRecord.email,
  });

  if (
    userRecord.role === UserRole.ADMIN ||
    userRecord.role === UserRole.STAFF
  ) {
    await recordAuditLog({
      actorId: userRecord.id,
      action: "ADMIN_LOGIN",
      entityType: "User",
      entityId: userRecord.id,
      description: `${userRecord.role} signed in`,
      ipAddress: ipAddress ?? null,
    });
  }

  const safeUser: SafeUser = {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    phone: userRecord.phone,
    role: userRecord.role,
    status: userRecord.status,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt,
  };

  return { user: safeUser, token };
}

export async function requestPasswordReset(email: string): Promise<{
  issued: boolean;
  resetToken?: string;
}> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
      status: true,
    },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return { issued: false };
  }

  const resetToken = await signPasswordResetToken(user.id, user.passwordHash);
  return { issued: true, resetToken };
}

export async function resetUserPassword(input: {
  token: string;
  newPassword: string;
}): Promise<void> {
  const payload = await verifyPasswordResetToken(input.token);
  if (!payload) {
    throw new AppError("Reset token is invalid or has expired.", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, passwordHash: true, status: true },
  });

  if (
    !user ||
    user.status !== UserStatus.ACTIVE ||
    user.passwordHash.slice(-12) !== payload.pwdFp
  ) {
    throw new AppError("Reset token is invalid or has already been used.", 400);
  }

  const newHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });
}

