"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { CampoTexto } from "@/components/ui/CampoTexto";

type Erros = { email?: string; senha?: string; geral?: string };

export function FormularioLogin({ destino }: { destino: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novosErros: Erros = {};
    if (!email.trim()) novosErros.email = "Digite o seu e-mail.";
    if (!senha) novosErros.senha = "Digite a sua senha.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => null);
        setErros({ geral: dados?.erro ?? "Não foi possível entrar. Tente novamente." });
        return;
      }
      router.replace(destino);
      router.refresh();
    } catch {
      setErros({ geral: "Sem conexão com o sistema. Verifique a internet e tente novamente." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={entrar} noValidate className="flex flex-col gap-6">
      {erros.geral && (
        <div
          role="alert"
          className="rounded-lg border-2 border-erro bg-erro-fundo p-4 font-semibold text-erro"
        >
          ❌ {erros.geral}
        </div>
      )}

      <CampoTexto
        rotulo="E-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        erro={erros.email}
      />
      <CampoTexto
        rotulo="Senha"
        type="password"
        autoComplete="current-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        erro={erros.senha}
      />

      <div className="flex justify-end">
        <Botao type="submit" icone="🔑" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </Botao>
      </div>
    </form>
  );
}
