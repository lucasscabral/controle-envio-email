
// src/prisma/client.js
// const { PrismaClient } = require('@prisma/client');
import pkg from '@prisma/client/index.js';
const {PrismaClient} = pkg;

const prisma = new PrismaClient();

export default prisma;