import Header from "@/shared/components/layout/Header";
import Hero from "@/shared/components/layout/Hero";
import ModalReenvio from "@/shared/components/layout/ModalReenvio";
import OcTable from "@/shared/components/layout/OcTable";
import { useState } from "react";

export default function Home() {
  const [grupoSelecionado, setGrupoSelecionado] = useState<any>(null)

  function handleReenviar(grupo: any) {
    setGrupoSelecionado(grupo)
  }


  function handleConfirmar(ocsIds: string[], emailCC: string) {
    console.log('Reenviar OCs:', ocsIds, '| CC:', emailCC)
    // aqui você chama a API / webhook n8n
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