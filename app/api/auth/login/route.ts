import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { conferirSenha } from "@/lib/auth/senha";
import { iniciarSessao } from "@/lib/auth/sessao";

// Hash fixo usado quando o e-mail não existe, para que a resposta demore o
// mesmo tempo nos dois casos (não revela quais e-mails estão cadastrados).
const HASH_FALSO = "$2b$12$0QnYTf4QMc7NztD0fC.q4ugy203Ux7bDb5MAlI3UT5mK7gZvvTbza";

const MSG_DADOS_INVALIDOS = "E-mail ou senha incorretos. Confira e tente novamente.";

export async function POST(req: NextRequest) {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Preencha o e-mail e a senha." }, { status: 400 });
  }

  const { email, senha } = (corpo ?? {}) as { email?: unknown; senha?: unknown };
  if (typeof email !== "string" || typeof senha !== "string" || !email.trim() || !senha) {
    return NextResponse.json({ erro: "Preencha o e-mail e a senha." }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    const senhaConfere = await conferirSenha(senha, usuario?.senhaHash ?? HASH_FALSO);
    if (!usuario || !senhaConfere) {
      return NextResponse.json({ erro: MSG_DADOS_INVALIDOS }, { status: 401 });
    }

    await iniciarSessao({ usuarioId: usuario.id, nome: usuario.nome, email: usuario.email });
    return NextResponse.json({ ok: true, nome: usuario.nome });
  } catch (erro) {
    console.error("Falha no login:", erro);
    return NextResponse.json(
      { erro: "Não foi possível entrar agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }
}
