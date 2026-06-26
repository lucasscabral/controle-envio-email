// src/controllers/consulta.controller.js
// import {Request, Response, NextFunction} from 'express';

import type { Request,Response } from 'express';
import {getAllConsultas} from '../services/consultaService';

export const getAll = async (_: Request, res: Response) => {
  try {
    const data: any = await getAllConsultas();
    
    res.status(200).send(data);
    } catch (err) {
      console.error('Error fetching consultas:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
