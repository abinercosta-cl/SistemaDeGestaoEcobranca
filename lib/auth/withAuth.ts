import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { obterSessao } from "./sessao";
import type { SessaoVerificada } from "./jwt";

// Guard para Route Handlers (app/api/**/route.ts).
// O proxy.ts já bloqueia requisições sem sessão, mas cada rota protegida
// também valida por conta própria (defesa em profundidade).
//
// Uso:
//   export const GET = withAuth(async (req, { sessao }) => {
//     return NextResponse.json({ ola: sessao.nome });
//   });

type ContextoRota = { params: Promise<Record<string, string | string[]>> };

type HandlerAutenticado = (
  req: NextRequest,
  ctx: ContextoRota & { sessao: SessaoVerificada },
) => Promise<Response> | Response;

export function withAuth(handler: HandlerAutenticado) {
  return async (req: NextRequest, ctx: ContextoRota): Promise<Response> => {
    const sessao = await obterSessao();
    if (!sessao) {
      return NextResponse.json(
        { erro: "Sua sessão terminou. Entre novamente para continuar." },
        { status: 401 },
      );
    }
    return handler(req, { ...ctx, sessao });
  };
}
