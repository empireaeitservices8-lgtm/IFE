
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$connect();

    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();

    return NextResponse.json({
      success: true,
      message: "IFE database connected successfully!",
      database: "ife_events",
      records: {
        users: userCount,
        events: eventCount,
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
