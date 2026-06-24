// src/services/consulta.service.js
import {findAll} from '../repositories/consultaRepository.js';

export async function getAllConsultas() {
  return findAll();
}
