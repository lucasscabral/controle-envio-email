import { useState } from "react";

// ─── Tipos de notificação ─────────────────────────────────────────────────────

type TipoNotificacao = "sucesso" | "erro";

interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
}


// ─── Hook de notificações ─────────────────────────────────────────────────────

function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  function adicionar(tipo: TipoNotificacao, titulo: string, mensagem: string) {
    const id = Date.now();
    setNotificacoes((prev) => [...prev, { id, tipo, titulo, mensagem }]);

    // Remove automaticamente após 4 segundos
    setTimeout(() => remover(id), 4000);
  }

  function remover(id: number) {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  }

  return { notificacoes, adicionar, remover };
}


export default useNotificacoes;