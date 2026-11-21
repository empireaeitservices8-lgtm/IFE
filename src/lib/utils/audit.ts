import { prisma } from "@/lib/prisma";

type AuditLogInput = {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description?: string;
  ipAddress?: string | null;
};

export async function recordAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        description: input.description ?? null,
        ipAddress: input.ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to record audit log:", err);
  }
}

