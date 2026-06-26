import { useEffect, useState } from 'react';

const emptyForm = {
  nome: '',
  cidade: '',
  estado: '',
  idade: '',
  escolaridade: '',
  cargo: '',
  salario: ''
};

export function FuncionarioForm({ funcionarioEmEdicao, onCancelEdit, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (funcionarioEmEdicao) {
      setForm({
        nome: funcionarioEmEdicao.nome || '',
        cidade: funcionarioEmEdicao.cidade || '',
        estado: funcionarioEmEdicao.estado || '',
        idade: funcionarioEmEdicao.idade ?? '',
        escolaridade: funcionarioEmEdicao.escolaridade || '',
        cargo: funcionarioEmEdicao.cargo || '',
        salario: funcionarioEmEdicao.salario ?? ''
      });
      return;
    }

    setForm(emptyForm);
  }, [funcionarioEmEdicao]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      idade: Number(form.idade),
      salario: Number(form.salario)
    };

    onSubmit(payload, () => setForm(emptyForm));
  }

  const isEditing = Boolean(funcionarioEmEdicao);

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <div className="section-heading">
        <h2 id="form-title">{isEditing ? 'Editar funcionário' : 'Cadastrar funcionário'}</h2>
        {isEditing && (
          <span className="editing-id" title={funcionarioEmEdicao._id}>
            ID {funcionarioEmEdicao._id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="employee-form">
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </label>

        <label>
          Cidade
          <input name="cidade" value={form.cidade} onChange={handleChange} required />
        </label>

        <label>
          Estado
          <input name="estado" value={form.estado} onChange={handleChange} required maxLength="2" />
        </label>

        <label>
          Idade
          <input
            name="idade"
            type="number"
            min="0"
            value={form.idade}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Escolaridade
          <input name="escolaridade" value={form.escolaridade} onChange={handleChange} required />
        </label>

        <label>
          Cargo
          <input name="cargo" value={form.cargo} onChange={handleChange} required />
        </label>

        <label>
          Salário
          <input
            name="salario"
            type="number"
            min="0"
            step="0.01"
            value={form.salario}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar edição' : 'Cadastrar'}
          </button>
          {isEditing && (
            <button type="button" className="secondary-button" onClick={onCancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
