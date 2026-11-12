import { useId, type InputHTMLAttributes } from "react";

type CampoTextoProps = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  erro?: string;
};

// Campo com rótulo sempre visível e mensagem de erro logo abaixo (regra de validação).
export function CampoTexto({ rotulo, erro, id, className = "", ...props }: CampoTextoProps) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={idCampo} className="text-corpo font-semibold text-texto">
        {rotulo}
      </label>
      <input
        id={idCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`min-h-toque rounded-lg border-2 bg-superficie px-4 text-corpo text-texto ${
          erro ? "border-erro" : "border-borda"
        } ${className}`}
        {...props}
      />
      {erro && (
        <p id={idErro} className="font-semibold text-erro">
          ⚠️ {erro}
        </p>
      )}
    </div>
  );
}
