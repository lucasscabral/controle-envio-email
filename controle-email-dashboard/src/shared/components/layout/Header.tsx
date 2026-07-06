// Header.tsx
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import LogoCTC from "@/assets/img/Logo Castanhal png 4 2 1.png";

interface HeaderProps {
  onAtualizar?: () => Promise<void>;
}

export default function Header({ onAtualizar }: HeaderProps) {
  const [carregando, setCarregando] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  async function handleAtualizar() {
    if (!onAtualizar || carregando) return;
    setCarregando(true);
    try {
      await onAtualizar();
    } finally {
      setCarregando(false);
    }
  }
  return (
    <header className="w-full bg-[#FDF8F2] border-b border-gray-300 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Esquerda — logo + separador + título */}
        <div className="flex items-center gap-4">
          {/* Substitua pela sua logo real */}
          <img src={LogoCTC} alt="Castanhal" className="h-8 w-auto" />

          <div className="w-px h-6 bg-gray-300" />

          <span className="text-sm text-gray-500 font-normal tracking-wide">
            Controle de Envio
          </span>
        </div>

        {/* Direita — botão atualizar */}
        <div className="relative">
          <button
            onClick={handleAtualizar}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            disabled={carregando}
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={carregando ? "animate-spin" : ""} />
            {carregando ? "Atualizando..." : "Atualizar"}
          </button>

          {/* Tooltip */}
          {tooltip && !carregando && (
            <div className="absolute right-0 top-full mt-2 z-50 pointer-events-none">
              <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Atualizar painel de OCs
                {/* Seta */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
