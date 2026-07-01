// src/prisma/client.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
// import { PrismaClient } from '../generated/prisma';

const adapter = new PrismaPg(
  {connectionString: process.env.DATABASE_URL},
  { schema: "dw" }
);

export const prisma = new PrismaClient({
  adapter,
});

prisma.$connect().then(() => {
  console.log('Conectado ao banco de dados com sucesso!');
}).catch((err:any) => {
  console.error('Erro ao conectar ao banco de dados:', err);
});