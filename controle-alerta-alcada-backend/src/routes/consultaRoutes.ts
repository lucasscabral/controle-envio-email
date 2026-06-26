// src/routes/consulta.routes.js
import express from 'express';
import {getAll} from '../controllers/consultaController';

const router = express.Router();

router.get('/', getAll);

export default router;