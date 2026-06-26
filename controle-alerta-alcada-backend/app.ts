import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import consultaRoutes from './src/routes/consultaRoutes';

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

app.use('/consultas', consultaRoutes);

export default app;