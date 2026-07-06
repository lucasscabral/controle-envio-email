// ─── Tipos de notificação ─────────────────────────────────────────────────────
import { CheckCircle, XCircle, X } from "lucide-react";

type TipoNotificacao = "sucesso" | "erro";

interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
}

// ─── Componente de notificação ────────────────────────────────────────────────

function ToastNotificacao({
  notificacao,
  onClose,
}: {
  notificacao: Notificacao;
  onClose: (id: number) => void;
}) {
  const isSucesso = notificacao.tipo === "sucesso";

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border w-80 animate-fade-in
        ${
          isSucesso ? "bg-white border-[#C5E1C5]" : "bg-white border-[#FFCDD2]"
        }`}
    >
      {isSucesso ? (
        <CheckCircle size={20} className="text-[#3A7A3A] shrink-0 mt-0.5" />
      ) : (
        <XCircle size={20} className="text-[#C62828] shrink-0 mt-0.5" />
      )}

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold ${isSucesso ? "text-[#2E7D32]" : "text-[#C62828]"}`}
        >
          {notificacao.titulo}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          {notificacao.mensagem}
        </p>
      </div>

      <button
        onClick={() => onClose(notificacao.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default ToastNotificacao;