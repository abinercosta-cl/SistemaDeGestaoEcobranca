import { SignJWT, jwtVerify } from "jose";

// Funções de JWT puras (sem acesso a banco ou cookies), para poderem ser
// usadas tanto no proxy.ts quanto em rotas e Server Components.

export const NOME_COOKIE_SESSAO = "zenite_sessao";

// Sessão longa de propósito (regra 10 do CLAUDE.md): a usuária não pode ser
// derrubada no meio de um cadastro. Além disso, a sessão é renovada
// automaticamente (ver RENOVAR_APOS_SEGUNDOS) enquanto ela estiver usando.
export const DURACAO_SESSAO_SEGUNDOS = 60 * 60 * 24 * 7; // 7 dias
export const RENOVAR_APOS_SEGUNDOS = 60 * 60 * 24; // renova se o token tiver mais de 1 dia

export type DadosSessao = {
  usuarioId: number;
  nome: string;
  email: string;
};

export type SessaoVerificada = DadosSessao & {
  emitidoEm: number; // epoch em segundos
  expiraEm: number; // epoch em segundos
};

function chaveSecreta(): Uint8Array {
  const segredo = process.env.JWT_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error("JWT_SECRET ausente ou muito curto (mínimo 32 caracteres).");
  }
  return new TextEncoder().encode(segredo);
}

export async function criarToken(dados: DadosSessao): Promise<string> {
  return new SignJWT({ nome: dados.nome, email: dados.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(dados.usuarioId))
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SESSAO_SEGUNDOS}s`)
    .sign(chaveSecreta());
}

// Retorna os dados da sessão, ou null se o token for inválido/expirado.
export async function verificarToken(
  token: string | undefined | null,
): Promise<SessaoVerificada | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chaveSecreta(), {
      algorithms: ["HS256"],
    });
    const usuarioId = Number(payload.sub);
    if (
      !Number.isInteger(usuarioId) ||
      typeof payload.nome !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    return {
      usuarioId,
      nome: payload.nome,
      email: payload.email,
      emitidoEm: payload.iat,
      expiraEm: payload.exp,
    };
  } catch {
    return null;
  }
}

export function precisaRenovar(sessao: SessaoVerificada): boolean {
  const agora = Math.floor(Date.now() / 1000);
  return agora - sessao.emitidoEm > RENOVAR_APOS_SEGUNDOS;
}

export function opcoesCookieSessao() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: DURACAO_SESSAO_SEGUNDOS,
  };
}
