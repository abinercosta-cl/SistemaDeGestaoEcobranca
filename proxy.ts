import { NextResponse, type NextRequest } from "next/server";
import {
  NOME_COOKIE_SESSAO,
  criarToken,
  opcoesCookieSessao,
  precisaRenovar,
  verificarToken,
} from "@/lib/auth/jwt";

// Proteção de rotas (no Next 16 o antigo "middleware" se chama "proxy").
// - Sem sessão: páginas vão para /login; APIs respondem 401.
// - Com sessão: o token é renovado automaticamente após 1 dia de uso, para
//   a usuária não ser deslogada enquanto estiver trabalhando.

const ROTAS_PUBLICAS = ["/login", "/api/auth/login"];

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ehPublica = ROTAS_PUBLICAS.includes(pathname);
  const ehApi = pathname.startsWith("/api/");

  const sessao = await verificarToken(req.cookies.get(NOME_COOKIE_SESSAO)?.value);

  if (!sessao) {
    if (ehPublica) return NextResponse.next();
    if (ehApi) {
      return NextResponse.json(
        { erro: "Sua sessão terminou. Entre novamente para continuar." },
        { status: 401 },
      );
    }
    const urlLogin = new URL("/login", req.url);
    urlLogin.searchParams.set("voltarPara", pathname + search);
    const resposta = NextResponse.redirect(urlLogin);
    // Remove um cookie expirado/inválido, se houver.
    if (req.cookies.has(NOME_COOKIE_SESSAO)) resposta.cookies.delete(NOME_COOKIE_SESSAO);
    return resposta;
  }

  // Já logada tentando abrir a tela de login: manda para o início.
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const resposta = NextResponse.next();
  if (precisaRenovar(sessao)) {
    const novoToken = await criarToken({
      usuarioId: sessao.usuarioId,
      nome: sessao.nome,
      email: sessao.email,
    });
    resposta.cookies.set(NOME_COOKIE_SESSAO, novoToken, opcoesCookieSessao());
  }
  return resposta;
}

export const config = {
  // Ignora arquivos estáticos, imagens otimizadas e arquivos com extensão (favicon, .png etc.)
  matcher: ["/((?!_next/static|_next/image|.*\\.[\\w]+$).*)"],
};
