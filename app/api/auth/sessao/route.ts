import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/withAuth";

// Rota protegida de teste: devolve os dados da sessão atual.
export const GET = withAuth(async (_req, { sessao }) => {
  return NextResponse.json({
    usuarioId: sessao.usuarioId,
    nome: sessao.nome,
    email: sessao.email,
    expiraEm: new Date(sessao.expiraEm * 1000).toISOString(),
  });
});
