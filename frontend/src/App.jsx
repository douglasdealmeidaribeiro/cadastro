import { useMemo, useState } from 'react';
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

function encontrarFuncionario(funcionarios, termo) {
  const busca = termo.trim().toLowerCase();
  const porId = funcionarios.find((funcionario) => funcionario._id?.toLowerCase() === busca);

  if (porId) {
    return porId;
  }

  const nomesExatos = funcionarios.filter(
    (funcionario) => funcionario.nome?.trim().toLowerCase() === busca
  );

  if (nomesExatos.length === 1) {
    return nomesExatos[0];
  }

  const correspondencias = funcionarios.filter((funcionario) => {
    const id = funcionario._id?.toLowerCase() || '';
    const nome = funcionario.nome?.toLowerCase() || '';
    return id.includes(busca) || nome.includes(busca);
  });

  if (correspondencias.length === 1) {
    return correspondencias[0];
  }

  if (correspondencias.length > 1 || nomesExatos.length > 1) {
    throw new Error('Mais de um funcionário foi encontrado. Informe o ID completo.');
  }

  throw new Error('Nenhum funcionário foi encontrado com esse ID ou nome.');
}

export default function App() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funcionarioEmRemocao, setFuncionarioEmRemocao] = useState(null);
  const [acaoDeBusca, setAcaoDeBusca] = useState(null);

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

  const filteredFuncionarios = useMemo(() => {
    const normalizedSearch = appliedSearchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return funcionarios;
    }

    return funcionarios.filter((funcionario) => {
      const id = funcionario._id?.toLowerCase() || '';
      const nome = funcionario.nome?.toLowerCase() || '';

      return id.includes(normalizedSearch) || nome.includes(normalizedSearch);
    });
  }, [funcionarios, appliedSearchTerm]);

  async function handleConsultar() {
    setIsLoading(true);
    setAcaoDeBusca('consultar');
    try {
      const data = await listarFuncionarios();
      setFuncionarios(data);
      setAppliedSearchTerm(searchTerm);
      setConsultaRealizada(true);
      setAlert(null);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
      setAcaoDeBusca(null);
    }
  }

  async function localizarFuncionario(acao) {
    if (!searchTerm.trim()) {
      setAlert({
        type: 'error',
        message: 'Informe o ID ou nome do funcionário para continuar.'
      });
      return;
    }

    setIsLoading(true);
    setAcaoDeBusca(acao);

    try {
      const data = await listarFuncionarios();
      setFuncionarios(data);
      setAppliedSearchTerm(searchTerm);
      setConsultaRealizada(true);

      const funcionario = encontrarFuncionario(data, searchTerm);

      if (acao === 'atualizar') {
        handleEdit(funcionario);
        setAlert({
          type: 'success',
          message: `Dados de ${funcionario.nome} carregados para atualização.`
        });
      } else {
        await handleDelete(funcionario);
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
      setAcaoDeBusca(null);
    }
  }

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
      if (consultaRealizada) {
        await carregarFuncionarios();
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(funcionario) {
    setFuncionarioEmEdicao(funcionario);
    setAlert(null);

    window.requestAnimationFrame(() => {
      document.getElementById('funcionario-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  async function handleDelete(funcionario) {
    const confirmed = window.confirm(
      `Deseja remover ${funcionario.nome}? Esta ação não poderá ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    setFuncionarioEmRemocao(funcionario._id);
    try {
      await removerFuncionario(funcionario._id);
      setAlert({ type: 'success', message: 'Funcionário removido com sucesso.' });
      if (funcionarioEmEdicao?._id === funcionario._id) {
        setFuncionarioEmEdicao(null);
      }
      await carregarFuncionarios();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setFuncionarioEmRemocao(null);
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
            onSearch={handleConsultar}
            onEdit={() => localizarFuncionario('atualizar')}
            onDelete={() => localizarFuncionario('remover')}
            total={funcionarios.length}
            filteredTotal={filteredFuncionarios.length}
            isLoading={isLoading}
            acaoDeBusca={acaoDeBusca}
            consultaRealizada={consultaRealizada}
          />
          {consultaRealizada && (
            <FuncionarioTable
              funcionarios={filteredFuncionarios}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              funcionarioEmRemocao={funcionarioEmRemocao}
            />
          )}
        </div>
      </div>
    </main>
  );
}
