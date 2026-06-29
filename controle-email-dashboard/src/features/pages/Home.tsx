import Header from "@/shared/components/layout/Header";
import Hero from "@/shared/components/layout/Hero";
import ModalReenvio from "@/shared/components/layout/ModalReenvio";
import OcTable from "@/shared/components/layout/OcTable";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react"

interface OC {
  CD_ORDEM_COMPRA:  string
  CD_SOLICITACAO:   number
  CONTROLE_OC:      string
  DT_CRIACAO_OC:    string
  DT_ENVIO_EMAIL:   string | null
  TENTATIVAS_ENVIO: number
  STATUS:           string
  ERRO_MSG:         string | null
}

interface Grupo {
  EMAIL:            string
  EMAIL_CC?:        string | null
  NOME_APROVADOR:   string | null
  NOME_SOLICITANTE: string
  OCS:              OC[]
}

// ─── Tipos de notificação ─────────────────────────────────────────────────────

type TipoNotificacao = 'sucesso' | 'erro'

interface Notificacao {
  id:      number
  tipo:    TipoNotificacao
  titulo:  string
  mensagem: string
}

// ─── Componente de notificação ────────────────────────────────────────────────

function ToastNotificacao({
  notificacao,
  onClose,
}: {
  notificacao: Notificacao
  onClose: (id: number) => void
}) {
  const isSucesso = notificacao.tipo === 'sucesso'

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border w-80 animate-fade-in
        ${isSucesso
          ? 'bg-white border-[#C5E1C5]'
          : 'bg-white border-[#FFCDD2]'
        }`}
    >
      {isSucesso
        ? <CheckCircle size={20} className="text-[#3A7A3A] shrink-0 mt-0.5" />
        : <XCircle    size={20} className="text-[#C62828] shrink-0 mt-0.5" />
      }

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isSucesso ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
          {notificacao.titulo}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          {notificacao.mensagem}
        </p>
      </div>

      <button
        onClick={() => onClose(notificacao.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Hook de notificações ─────────────────────────────────────────────────────

function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  function adicionar(tipo: TipoNotificacao, titulo: string, mensagem: string) {
    const id = Date.now()
    setNotificacoes(prev => [...prev, { id, tipo, titulo, mensagem }])

    // Remove automaticamente após 4 segundos
    setTimeout(() => remover(id), 4000)
  }

  function remover(id: number) {
    setNotificacoes(prev => prev.filter(n => n.id !== id))
  }

  return { notificacoes, adicionar, remover }
}

export default function Home() {
  const [emailsOc, setEmailsOc] = useState<Grupo | null>(null);
  const { notificacoes, adicionar, remover } = useNotificacoes()

  const [grupoSelecionado, setGrupoSelecionado] = useState<any>(null)

  useEffect(() => {
    axios
      .get("http://localhost:3000/consultas")
      .then((res) => {
        setEmailsOc(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar emails de OC:", err);
      });
  }, []);

  function handleReenviar(grupo: any) {
    setGrupoSelecionado(grupo)
  }


   async function handleConfirmar(payload: Grupo) {
    setGrupoSelecionado(null)

    try {
      await axios.post(
        'https://n8n.juta.eco.br/webhook-test/75d7a613-29ed-4714-b1b2-21864a6d3f1b',
        payload
      )

      adicionar(
        'sucesso',
        'E-mail reenviado com sucesso',
        `${payload.OCS.length} OC(s) enviada(s) para ${payload.EMAIL}${payload.EMAIL_CC ? ` com cópia para ${payload.EMAIL_CC}` : ''}.`
      )
    } catch (error) {
      adicionar(
        'erro',
        'Erro ao reenviar',
        'Não foi possível reenviar as OCs. Tente novamente.'
      )
      console.error('Erro ao reenviar OCs:', error)
    }
  }
    // ─── Calcula stats a partir dos dados da API ──────────────────────────────
  const stats = useMemo(() => {
    const todasOcs = emailsOc?.flatMap(g => g.OCS ?? [])

    return {
      solicitantes: emailsOc?.length,
      ocsEnviadas:  todasOcs?.filter(oc => oc.STATUS === 'ENVIADO' || oc.STATUS === 'REENVIADO').length,
      comErro:      todasOcs?.filter(oc => oc.STATUS === 'ERRO').length,
    }
  }, [emailsOc])



  return (
    <div className="min-h-screen bg-[#F5F0E8]">
        <Header onAtualizar={() => console.log("Atualizando...")} />
        <Hero solicitantes={stats.solicitantes} ocsEnviadas={stats.ocsEnviadas} comErro={stats.comErro} />
        <OcTable onReenviar={handleReenviar} emailsOc={emailsOc} />
        {grupoSelecionado && (
        <ModalReenvio
          grupo={grupoSelecionado}
          onClose={() => setGrupoSelecionado(null)}
          onConfirmar={handleConfirmar}
        />
      )}
      {/* Stack de notificações — canto inferior direito */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {notificacoes.map(n => (
          <ToastNotificacao
            key={n.id}
            notificacao={n}
            onClose={remover}
          />
        ))}
      </div>
    </div>
  )
}