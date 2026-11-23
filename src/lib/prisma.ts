
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  let host = process.env.TIDB_HOST;
  let port = Number(process.env.TIDB_PORT || 4000);
  let user = process.env.TIDB_USER;
  let password = process.env.TIDB_PASSWORD;
  let database = process.env.TIDB_DATABASE;

  if ((!host || !user || !password || !database) && process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      host = host || parsed.hostname;
      port = parsed.port ? Number(parsed.port) : port;
      user = user || decodeURIComponent(parsed.username);
      password = password || decodeURIComponent(parsed.password);
      database = database || parsed.pathname.replace(/^\//, "");
    } catch {
      // Fall through to validation error below
    }
  }

  if (!host || !user || !password || !database) {
    throw new Error("Missing TiDB database environment variables.");
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
