// src/controllers/consulta.controller.js
import {getAllConsultas} from '../services/consultaService.js';

export const getAll = async (req, res) => {
  try {
    const data = await getAllConsultas();
    res.json(data);
    } catch (err) {

    next(err);
  }
};
