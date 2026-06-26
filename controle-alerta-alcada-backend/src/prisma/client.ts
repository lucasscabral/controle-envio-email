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
  console.log('Connected to the database successfully.');
}).catch((err) => {
  console.error('Error connecting to the database:', err);
});