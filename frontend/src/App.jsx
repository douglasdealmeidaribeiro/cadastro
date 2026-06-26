import { useEffect, useMemo, useState } from 'react';
import { AlertMessage } from './components/AlertMessage.jsx';
import { FuncionarioForm } from './components/FuncionarioForm.jsx';
import { FuncionarioSearch } from './components/FuncionarioSearch.jsx';
import { FuncionarioTable } from './components/FuncionarioTable.jsx';
import {
  atualizarFuncionario,
  criarFuncionario,
  listarFuncionarios,
  removerFuncionario
} from './services/api.js';

function validateFuncionario(funcionario) {
  const requiredFields = [
    'nome',
    'cidade',
    'estado',
    'idade',
    'escolaridade',
    'cargo',
    'salario'
  ];

  const missingField = requiredFields.find((field) => {
    const value = funcionario[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missingField) {
    return 'Preencha todos os campos obrigatórios.';
  }

  if (!Number.isFinite(funcionario.idade) || funcionario.idade < 0) {
    return 'Informe uma idade válida.';
  }

  if (!Number.isFinite(funcionario.salario) || funcionario.salario < 0) {
    return 'Informe um salário válido.';
  }

  return null;
}

export default function App() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function carregarFuncionarios() {
    setIsLoading(true);
    try {
      const data = await listarFuncionarios();
      setFuncionarios(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const filteredFuncionarios = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return funcionarios;
    }

    return funcionarios.filter((funcionario) => {
      const id = funcionario._id?.toLowerCase() || '';
      const nome = funcionario.nome?.toLowerCase() || '';

      return id.includes(normalizedSearch) || nome.includes(normalizedSearch);
    });
  }, [funcionarios, searchTerm]);

  async function handleSubmit(funcionario, resetForm) {
    const validationError = validateFuncionario(funcionario);
    if (validationError) {
      setAlert({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);
    try {
      if (funcionarioEmEdicao) {
        await atualizarFuncionario(funcionarioEmEdicao._id, funcionario);
        setAlert({ type: 'success', message: 'Funcionário atualizado com sucesso.' });
      } else {
        await criarFuncionario(funcionario);
        setAlert({ type: 'success', message: 'Funcionário cadastrado com sucesso.' });
        resetForm();
      }

      setFuncionarioEmEdicao(null);
      await carregarFuncionarios();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(funcionario) {
    const confirmed = window.confirm(`Remover ${funcionario.nome}?`);

    if (!confirmed) {
      return;
    }

    try {
      await removerFuncionario(funcionario._id);
      setAlert({ type: 'success', message: 'Funcionário removido com sucesso.' });
      if (funcionarioEmEdicao?._id === funcionario._id) {
        setFuncionarioEmEdicao(null);
      }
      await carregarFuncionarios();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-copy">
          <p className="eyebrow">Cadastro web persistente</p>
          <h1>Sistema de Gerenciamento de Funcionários</h1>
        </div>
        <div className="status-card">API + Atlas</div>
      </header>

      <AlertMessage alert={alert} onClose={() => setAlert(null)} />

      <div className="layout-grid">
        <FuncionarioForm
          funcionarioEmEdicao={funcionarioEmEdicao}
          onCancelEdit={() => setFuncionarioEmEdicao(null)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <div className="list-column">
          <FuncionarioSearch
            value={searchTerm}
            onChange={setSearchTerm}
            total={funcionarios.length}
            filteredTotal={filteredFuncionarios.length}
          />
          <FuncionarioTable
            funcionarios={filteredFuncionarios}
            onEdit={setFuncionarioEmEdicao}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
