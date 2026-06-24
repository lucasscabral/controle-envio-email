// src/repositories/consulta.repository.js
import prisma from "../prisma/client.js"; 


export const findAll = () => {
  return prisma.oc_email_log.findMany({});
};