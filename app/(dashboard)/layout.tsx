import { Suspense } from "react";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth/sessao";
import { BotaoSair } from "./BotaoSair";

// Layout das telas internas. O proxy.ts já protege as rotas; a checagem aqui
// é uma segunda barreira e fornece os dados da usuária logada.
export default function LayoutDashboard({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex min-h-20 items-center justify-between gap-4 border-b-2 border-borda bg-superficie px-6 py-4">
        <p className="text-titulo font-bold">Estúdio Zênite</p>
        <Suspense>
          <UsuariaLogada />
        </Suspense>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}

async function UsuariaLogada() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/login");

  return (
    <div className="flex items-center gap-4">
      <p className="text-corpo">
        Olá, <strong>{sessao.nome}</strong>
      </p>
      <BotaoSair />
    </div>
  );
}
