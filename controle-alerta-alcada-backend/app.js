import express from 'express';
import consultaRoutes from './src/routes/consultaRoutes.js';

const app = express();

app.use(express.json());

app.use('/consultas', consultaRoutes);

export default app;