import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/generated/prisma/enums";
import { AppError } from "@/lib/utils/api-response";

export const SESSION_COOKIE_NAME = "ife_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const RESET_TOKEN_MAX_AGE = "15m";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

type ResetTokenPayload = {
  sub: string;
  purpose: "password_reset";
  pwdFp: string;
};

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is not configured or is too short.");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({
    role: payload.role,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (!payload.sub || !payload.role || !payload.email) {
      return null;
    }
    return {
      sub: payload.sub,
      role: payload.role as UserRole,
      email: String(payload.email),
    };
  } catch {
    return null;
  }
}

export async function signPasswordResetToken(
  userId: string,
  passwordHash: string
): Promise<string> {
  return new SignJWT({
    purpose: "password_reset",
    pwdFp: passwordHash.slice(-12),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(RESET_TOKEN_MAX_AGE)
    .sign(getAuthSecret());
}

export async function verifyPasswordResetToken(
  token: string
): Promise<ResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (
      !payload.sub ||
      payload.purpose !== "password_reset" ||
      typeof payload.pwdFp !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      purpose: "password_reset",
      pwdFp: payload.pwdFp,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return null;
  }

  return user;
}

export async function requireAuth(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AppError("Authentication required.", 401);
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<SafeUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new AppError("You do not have permission to perform this action.", 403);
  }
  return user;
}

export function requireAdminOrStaff() {
  return requireRole([UserRole.ADMIN, UserRole.STAFF]);
}

export function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}

