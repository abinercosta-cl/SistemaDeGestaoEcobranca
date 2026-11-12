import type { Prisma } from "@/lib/generated/prisma/client";

// Gera o número de protocolo de um contrato no fechamento da venda.
// Formato: ZEN-AAAA-NNNNN (sequencial por ano). Ex.: ZEN-2026-00001
//
// Deve ser chamado DENTRO da mesma transação que cria o contrato, para que
// dois fechamentos simultâneos não recebam o mesmo número (o campo é @unique
// no banco, então um eventual conflito gera erro em vez de duplicar).
export async function gerarProtocolo(
  tx: Prisma.TransactionClient,
  data: Date = new Date(),
): Promise<string> {
  const ano = data.getFullYear();
  const prefixo = `ZEN-${ano}-`;

  const ultimo = await tx.contrato.findFirst({
    where: { protocolo: { startsWith: prefixo } },
    orderBy: { protocolo: "desc" },
    select: { protocolo: true },
  });

  const ultimoNumero = ultimo ? Number(ultimo.protocolo.slice(prefixo.length)) : 0;
  const proximo = ultimoNumero + 1;

  return `${prefixo}${String(proximo).padStart(5, "0")}`;
}
