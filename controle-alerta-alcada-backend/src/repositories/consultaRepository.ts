// src/repositories/consulta.repository.ts
import {prisma} from "../prisma/client"; 

export const findAll = async () => {
  return await prisma.oc_email_log.findMany({where: {controle_oc:'10'}});
}