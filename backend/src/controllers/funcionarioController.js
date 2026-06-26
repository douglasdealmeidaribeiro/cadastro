import mongoose from 'mongoose';
import { Funcionario } from '../models/Funcionario.js';

const requiredFields = [
  'nome',
  'cidade',
  'estado',
  'idade',
  'escolaridade',
  'cargo',
  'salario'
];

function sendSuccess(res, message, data, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data
  });
}

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function notFound(message = 'Funcionario nao encontrado.') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw badRequest('ID invalido.');
  }
}

function sanitizeFuncionarioInput(body) {
  const data = {};

  for (const field of requiredFields) {
    data[field] = body[field];
  }

  const emptyField = requiredFields.find((field) => {
    const value = data[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (emptyField) {
    throw badRequest(`Campo obrigatorio ausente: ${emptyField}.`);
  }

  const idade = Number(data.idade);
  const salario = Number(data.salario);

  if (!Number.isFinite(idade) || idade < 0) {
    throw badRequest('Idade deve ser um numero maior ou igual a zero.');
  }

  if (!Number.isFinite(salario) || salario < 0) {
    throw badRequest('Salario deve ser um numero maior ou igual a zero.');
  }

  return {
    nome: String(data.nome).trim(),
    cidade: String(data.cidade).trim(),
    estado: String(data.estado).trim(),
    idade,
    escolaridade: String(data.escolaridade).trim(),
    cargo: String(data.cargo).trim(),
    salario
  };
}

export async function listarFuncionarios(_req, res, next) {
  try {
    const funcionarios = await Funcionario.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Funcionarios encontrados.', funcionarios);
  } catch (error) {
    return next(error);
  }
}

export async function obterFuncionarioPorId(req, res, next) {
  try {
    validateObjectId(req.params.id);

    const funcionario = await Funcionario.findById(req.params.id);
    if (!funcionario) {
      throw notFound();
    }

    return sendSuccess(res, 'Funcionario encontrado.', funcionario);
  } catch (error) {
    return next(error);
  }
}

export async function criarFuncionario(req, res, next) {
  try {
    const payload = sanitizeFuncionarioInput(req.body);
    const funcionario = await Funcionario.create(payload);

    return sendSuccess(res, 'Funcionario cadastrado com sucesso.', funcionario, 201);
  } catch (error) {
    return next(error);
  }
}

export async function atualizarFuncionario(req, res, next) {
  try {
    validateObjectId(req.params.id);

    const payload = sanitizeFuncionarioInput(req.body);
    const funcionario = await Funcionario.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!funcionario) {
      throw notFound();
    }

    return sendSuccess(res, 'Funcionario atualizado com sucesso.', funcionario);
  } catch (error) {
    return next(error);
  }
}

export async function removerFuncionario(req, res, next) {
  try {
    validateObjectId(req.params.id);

    const funcionario = await Funcionario.findByIdAndDelete(req.params.id);
    if (!funcionario) {
      throw notFound();
    }

    return sendSuccess(res, 'Funcionario removido com sucesso.', funcionario);
  } catch (error) {
    return next(error);
  }
}
