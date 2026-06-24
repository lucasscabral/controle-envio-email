// src/routes/consulta.routes.js
import express from 'express';
import {getAll} from '../controllers/consultaController.js';

const router = express.Router();

router.get('/', getAll);

export default router;