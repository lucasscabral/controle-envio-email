import Header from "@/shared/components/layout/Header";
import Hero from "@/shared/components/layout/Hero";
import ModalReenvio from "@/shared/components/layout/ModalReenvio";
import OcTable from "@/shared/components/layout/OcTable";
// import axios from "axios";
import api from "@/shared/services/api";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useNotificacoes from "@/hooks/useNotificacoes";
import ToastNotificacao from "@/shared/components/utils/ToastNotificacao";

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
  EMAIL_CC?: string | null;
  NOME_APROVADOR: string | null;
  NOME_SOLICITANTE: string;
  OCS: OC[];
}

export default function Home() {
  const [emailsOc, setEmailsOc] = useState<Grupo[] | null>(null);
  const { notificacoes, adicionar, remover } = useNotificacoes();

  const [grupoSelecionado, setGrupoSelecionado] = useState<any>(null);

  const buscarEmails = async () => {
    try {
      const { data } = await api.get("/consultas");
      setEmailsOc(data);
      adicionar(
        "sucesso",
        "Painel atualizado",
        `${data.length} solicitante(s) carregado(s) com sucesso.`,
      );
    } catch (err) {
      adicionar(
        "erro",
        "Erro ao atualizar",
        "Não foi possível carregar os dados. Verifique a conexão.",
      );
      console.error("Erro ao buscar emails de OC:", err);
    }
  };

  useEffect(() => {
    const carregarInicial = async () => {
      try {
        const { data } = await api.get("/consultas");
        setEmailsOc(data);
      } catch (err) {
        console.error("Erro ao buscar emails de OC:", err);
      }
    };
    carregarInicial();
  }, []);

  function handleReenviar(grupo: any) {
    setGrupoSelecionado(grupo);
  }

  async function handleConfirmar(payload: Grupo) {
    setGrupoSelecionado(null);

    try {
      const { data } = await axios.post(
        "https://webhook.juta.eco.br/webhook/75d7a613-29ed-4714-b1b2-21864a6d3f1b",
        payload,
      );

      if (data.success) {
        adicionar(
          "sucesso",
          "E-mail reenviado com sucesso",
          `${payload.OCS.length} OC(s) enviada(s) para ${payload.EMAIL}${payload.EMAIL_CC ? ` com cópia para ${payload.EMAIL_CC}` : ""}.`,
        );
      } else {
        adicionar(
          "erro",
          "Erro ao reenviar",
          "Não foi possível reenviar as OCs. Tente novamente.",
        );
      }
    } catch (error) {
      adicionar(
        "erro",
        "Erro ao reenviar",
        "Não foi possível reenviar as OCs. Tente novamente.",
      );
      console.error("Erro ao reenviar OCs:", error);
    } finally {
      // Atualiza os dados da tela
      await buscarEmails();
    }
  }

  // ─── Calcula stats a partir dos dados da API ──────────────────────────────
  const stats = useMemo(() => {
    const todasOcs = emailsOc?.flatMap((g) => g.OCS ?? []) ?? [];

    return {
      solicitantes: emailsOc?.length,
      ocsEnviadas: todasOcs?.filter(
        (oc) => oc.STATUS === "ENVIADO" || oc.STATUS === "REENVIADO",
      ).length,
      comErro: todasOcs?.filter((oc) => oc.STATUS === "ERRO").length,
    };
  }, [emailsOc]);

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header onAtualizar={buscarEmails} />
      <Hero
        solicitantes={stats.solicitantes}
        ocsEnviadas={stats.ocsEnviadas}
        comErro={stats.comErro}
      />
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
        {notificacoes.map((n) => (
          <ToastNotificacao key={n.id} notificacao={n} onClose={remover} />
        ))}
      </div>
    </div>
  );
}
