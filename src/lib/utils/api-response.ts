import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    { success: true, data, ...(message ? { message } : {}) },
    { status }
  );
}

export function created<T>(data: T, message?: string) {
  return ok(data, message, 201);
}

export function fail(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
) {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join(".") || "root";
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return fail("Validation failed.", 400, fieldErrors);
  }

  if (error instanceof AppError) {
    return fail(error.message, error.status, error.errors);
  }

  console.error("Unhandled API error:", error);
  return fail("An unexpected internal error occurred.", 500);
}

export class AppError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status = 400,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.errors = errors;
  }
}

