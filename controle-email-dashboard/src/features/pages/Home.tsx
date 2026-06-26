import Header from "@/shared/components/layout/Header";
import Hero from "@/shared/components/layout/Hero";
import ModalReenvio from "@/shared/components/layout/ModalReenvio";
import OcTable from "@/shared/components/layout/OcTable";
import axios from "axios";
import { useState } from "react";


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

export default function Home() {
  const [grupoSelecionado, setGrupoSelecionado] = useState<any>(null)

  function handleReenviar(grupo: any) {
    setGrupoSelecionado(grupo)
  }


  function handleConfirmar(payload: Grupo) {
    console.log('Reenviar OCs:',payload)
    // aqui você chama a API / webhook n8n

    console.log(payload)

    axios.post('https://n8n.juta.eco.br/webhook-test/75d7a613-29ed-4714-b1b2-21864a6d3f1b', payload)
      .then(response => {
        console.log('Reenvio bem-sucedido:', response.data)
      })
      .catch(error => {
        console.error('Erro ao reenviar OCs:', error)
      })

    setGrupoSelecionado(null)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
        <Header onAtualizar={() => console.log("Atualizando...")} />
        <Hero solicitantes={10} ocsEnviadas={5} comErro={2} />
        <OcTable onReenviar={handleReenviar} />
        {grupoSelecionado && (
        <ModalReenvio
          grupo={grupoSelecionado}
          onClose={() => setGrupoSelecionado(null)}
          onConfirmar={handleConfirmar}
        />
      )}
    </div>
  )
}