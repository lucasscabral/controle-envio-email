// src/services/consulta.service.ts
import { findAll } from "../repositories/consultaRepository";

export async function getAllConsultas() {
  const items = await findAll();
  const grupos: any = {};

  for (const item of items) {
    const email = item.email;

    if (!grupos[email]) {
      grupos[email] = {
        EMAIL: email,
        NOME_APROVADOR: item.nome_aprovador,
        NOME_SOLICITANTE: item.nome_solicitante,
        OCS: [],
      };
    }

    grupos[email].OCS.push({
      CD_ORDEM_COMPRA: item.cd_ordem_compra,
      CD_SOLICITACAO: item.cd_solicitacao,
      CONTROLE_OC: item.controle_oc,
      DT_CRIACAO_OC: item.dt_criacao_oc,
      DT_ENVIO_EMAIL: item.dt_envio,
      TENTATIVAS_ENVIO: item.tentativas,
      STATUS: item.status,
      ERRO_MSG: item.erro_msg,
    });
  }

  return Object.values(grupos).map((g) => g);
}
