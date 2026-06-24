import { RefreshCw } from 'lucide-react'
import LogoCTC from '@/assets/img/Logo Castanhal png 4 2 1.png'

interface HeaderProps {
  onAtualizar?: () => void
}

export default function Header({ onAtualizar }: HeaderProps) {
  return (
    <header className="w-full bg-[#FDF8F2] border-b border-gray-300 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">

        {/* Esquerda — logo + separador + título */}
        <div className="flex items-center gap-4">
          {/* Substitua pela sua logo real */}
          <img
            src={LogoCTC}
            alt="Castanhal"
            className="h-8 w-auto"
          />

          <div className="w-px h-6 bg-gray-300" />

          <span className="text-sm text-gray-500 font-normal tracking-wide">
            Controle de Envio
          </span>
        </div>

        {/* Direita — botão atualizar */}
        <button
          onClick={onAtualizar}
          className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} />
          Atualizar
        </button>

      </div>
    </header>
  )
}