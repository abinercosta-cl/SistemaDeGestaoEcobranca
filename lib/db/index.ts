import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Singleton do Prisma Client.
// Em desenvolvimento o Next recarrega os módulos a cada alteração; guardar a
// instância em globalThis evita abrir uma nova conexão a cada hot reload.

function criarPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida. Copie .env.example para .env.");
  }
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

const globalParaPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof criarPrismaClient>;
};

export const prisma = globalParaPrisma.prisma ?? criarPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}

export * from "@/lib/generated/prisma/client";
