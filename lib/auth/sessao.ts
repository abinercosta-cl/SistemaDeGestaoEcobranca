import "server-only";
import { cookies } from "next/headers";
import {
  NOME_COOKIE_SESSAO,
  criarToken,
  opcoesCookieSessao,
  verificarToken,
  type DadosSessao,
  type SessaoVerificada,
} from "./jwt";

// Helpers de sessão para Server Components, Server Actions e Route Handlers.

export async function obterSessao(): Promise<SessaoVerificada | null> {
  const token = (await cookies()).get(NOME_COOKIE_SESSAO)?.value;
  return verificarToken(token);
}

export async function iniciarSessao(dados: DadosSessao): Promise<void> {
  const token = await criarToken(dados);
  (await cookies()).set(NOME_COOKIE_SESSAO, token, opcoesCookieSessao());
}

export async function encerrarSessao(): Promise<void> {
  (await cookies()).delete(NOME_COOKIE_SESSAO);
}
