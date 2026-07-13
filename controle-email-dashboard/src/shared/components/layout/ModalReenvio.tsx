import { useState } from "react";
import { Send, X, AlertCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OC {
  CD_ORDEM_COMPRA: string;
  CD_SOLICITACAO: number;
  CONTROLE_OC: string;
  DT_CRIACAO_OC: string;
  DT_ENVIO_EMAIL: string | null;
  TENTATIVAS_ENVIO: number;
  STATUS: string;
  ERRO_MSG: string | null;
}

interface Grupo {
  EMAIL: string;
  EMAILCC?: string | null;
  NOME_APROVADOR: string | null;
  NOME_SOLICITANTE: string;
  OCS: OC[];
}

interface ModalReenvioProps {
  grupo: Grupo;
  onClose: () => void;
  onConfirmar: (payload: Grupo) => void;
}

// ─── Badge ───────────────────────────────────────────────────────────────────

const badgeConfig: Record<string, { label: string; className: string }> = {
  ENVIADO: {
    label: "Enviado",
    className: "bg-[#E8F5E8] text-[#2E7D32] border border-[#C5E1C5]",
  },
  REENVIADO: {
    label: "Reenviado",
    className: "bg-[#E8F0F5] text-[#1565C0] border border-[#B3CDE0]",
  },
  PENDENTE: {
    label: "Pendente",
    className: "bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]",
  },
  ERRO: {
    label: "Erro",
    className: "bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]",
  },
};

function Badge({ status }: { status: string }) {
  const cfg = badgeConfig[status] ?? badgeConfig.pendente;
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export default function ModalReenvio({
  grupo,
  onClose,
  onConfirmar,
}: ModalReenvioProps) {
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [emailCC, setEmailCC] = useState("");
  const [tentouConfirmar, setTentouConfirmar] = useState(false);
  const todasSelecionadas = selecionadas.size === grupo.OCS.length;

  function toggleOC(nr: string) {
    setSelecionadas((prev) => {
      const next = new Set(prev);
      next.has(nr) ? next.delete(nr) : next.add(nr);
      return next;
    });
  }

  function toggleTodas() {
    setSelecionadas(
      todasSelecionadas
        ? new Set()
        : new Set(grupo.OCS.map((o) => o.CD_ORDEM_COMPRA)),
    );
  }

  function handleConfirmar() {
    setTentouConfirmar(true);
    if (selecionadas.size === 0) return;

    const payload: Grupo = {
      EMAIL: grupo.EMAIL,
      EMAILCC: emailCC,
      NOME_APROVADOR: grupo.NOME_APROVADOR,
      NOME_SOLICITANTE: grupo.NOME_SOLICITANTE,
      OCS: grupo.OCS.filter((oc) => selecionadas.has(oc.CD_ORDEM_COMPRA)),
    };

    onConfirmar(payload);
  }

  const semSelecao = tentouConfirmar && selecionadas.size === 0;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden h-80vh ">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E8] flex items-center justify-center shrink-0">
              <Send size={18} className="text-[#3A7A3A]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Reenviar OCs
              </h2>
              <p className="text-sm text-gray-400">{grupo.NOME_SOLICITANTE}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* E-mail principal */}
          <div className="bg-[#F5F2EC] rounded-xl px-4 py-3 text-sm text-gray-700">
            <span className="font-medium text-gray-800">
              E-mail principal:{" "}
            </span>
            <span className="text-[#3A7A3A] font-medium">{grupo.EMAIL}</span>
          </div>

          {/* OCs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">
                OCs a reenviar
              </span>
              <button
                onClick={toggleTodas}
                className="text-sm text-[#3A7A3A] font-medium hover:underline"
              >
                {todasSelecionadas ? "Desmarcar todas" : "Selecionar todas"}
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
              {grupo.OCS.map((oc) => {
                const marcada = selecionadas.has(oc.CD_ORDEM_COMPRA);
                return (
                  <label
                    key={oc.CD_ORDEM_COMPRA}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors select-none
                      ${marcada ? "bg-[#F5FAF5]" : "bg-white hover:bg-gray-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={marcada}
                      onChange={() => toggleOC(oc.CD_ORDEM_COMPRA)}
                      className="accent-[#3A7A3A] w-4 h-4 rounded shrink-0"
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-800 shrink-0">
                        OC {oc.CD_ORDEM_COMPRA}
                      </span>
                      <span className="text-sm text-gray-400 truncate">
                        SC {oc.CD_SOLICITACAO} · Controle {oc.CONTROLE_OC}
                      </span>
                    </div>
                    <Badge status={oc.STATUS} />
                  </label>
                );
              })}
            </div>

            {/* Validação */}
            {semSelecao && (
              <div className="flex items-center gap-1.5 mt-2 text-[#C62828] text-xs">
                <AlertCircle size={13} />
                <span>Selecione ao menos uma OC para reenviar</span>
              </div>
            )}
          </div>

          {/* E-mail CC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail em cópia (CC){" "}
              <span className="text-gray-400 font-normal">— opcional</span>
            </label>
            <input
              type="email"
              value={emailCC}
              onChange={(e) => setEmailCC(e.target.value)}
              placeholder="outro@castanhal.com.br"
              className="w-full bg-[#F5F2EC] border-0 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3A7A3A]/30 transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-[#F0EDE8] hover:bg-[#E8E4DC] rounded-full transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#3A7A3A] hover:bg-[#2E6B2E] rounded-full transition-colors cursor-pointer"
          >
            <Send size={14} />
            Confirmar reenvio
          </button>
        </div>
      </div>
    </div>
  );
}
