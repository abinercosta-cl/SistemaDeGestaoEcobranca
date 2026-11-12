import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "primario" | "secundario";

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  icone?: ReactNode; // sempre acompanhado de texto (regra 6)
};

const estilos: Record<Variante, string> = {
  primario:
    "bg-primaria text-white hover:bg-primaria-escura disabled:bg-borda",
  secundario:
    "bg-superficie text-texto border-2 border-borda hover:bg-fundo disabled:text-texto-suave",
};

export function Botao({
  variante = "primario",
  icone,
  className = "",
  children,
  ...props
}: BotaoProps) {
  return (
    <button
      className={`inline-flex min-h-toque min-w-toque items-center justify-center gap-2 rounded-lg px-6 py-2 text-botao font-semibold transition-colors disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
      {...props}
    >
      {icone && <span aria-hidden="true">{icone}</span>}
      <span>{children}</span>
    </button>
  );
}
