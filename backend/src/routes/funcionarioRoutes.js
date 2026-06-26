import { Router } from 'express';
import {
  atualizarFuncionario,
  criarFuncionario,
  listarFuncionarios,
  obterFuncionarioPorId,
  removerFuncionario
} from '../controllers/funcionarioController.js';

export const funcionarioRoutes = Router();

funcionarioRoutes.get('/', listarFuncionarios);
funcionarioRoutes.get('/:id', obterFuncionarioPorId);
funcionarioRoutes.post('/', criarFuncionario);
funcionarioRoutes.put('/:id', atualizarFuncionario);
funcionarioRoutes.delete('/:id', removerFuncionario);
