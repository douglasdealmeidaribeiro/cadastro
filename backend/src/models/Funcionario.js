import mongoose from 'mongoose';

const funcionarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome e obrigatorio.'],
      trim: true
    },
    cidade: {
      type: String,
      required: [true, 'Cidade e obrigatoria.'],
      trim: true
    },
    estado: {
      type: String,
      required: [true, 'Estado e obrigatorio.'],
      trim: true
    },
    idade: {
      type: Number,
      required: [true, 'Idade e obrigatoria.'],
      min: [0, 'Idade nao pode ser negativa.']
    },
    escolaridade: {
      type: String,
      required: [true, 'Escolaridade e obrigatoria.'],
      trim: true
    },
    cargo: {
      type: String,
      required: [true, 'Cargo e obrigatorio.'],
      trim: true
    },
    salario: {
      type: Number,
      required: [true, 'Salario e obrigatorio.'],
      min: [0, 'Salario nao pode ser negativo.']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
