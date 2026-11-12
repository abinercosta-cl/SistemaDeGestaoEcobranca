import { Suspense } from "react";
import { FormularioLogin } from "./FormularioLogin";

// Aceita apenas caminhos internos, para não redirecionar para sites externos.
function destinoSeguro(valor: string | string[] | undefined): string {
  if (typeof valor !== "string") return "/";
  if (!valor.startsWith("/") || valor.startsWith("//") || valor.startsWith("/\\")) return "/";
  return valor;
}

async function FormularioComDestino({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { voltarPara } = await searchParams;
  return <FormularioLogin destino={destinoSeguro(voltarPara)} />;
}

export default function PaginaLogin({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border-2 border-borda bg-superficie p-8 shadow-sm">
        <h1 className="mb-2 text-titulo font-bold">Estúdio Zênite</h1>
        <p className="mb-8 text-texto-suave">Digite seu e-mail e sua senha para entrar.</p>
        <Suspense fallback={<p>Carregando...</p>}>
          <FormularioComDestino searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
