const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value));
}

function shortId(id) {
  return id ? `${id.slice(0, 8)}...` : '-';
}

export function FuncionarioTable({
  funcionarios,
  onEdit,
  onDelete,
  isLoading,
  isSubmitting,
  funcionarioEmRemocao
}) {
  return (
    <section className="panel table-panel" aria-labelledby="table-title">
      <div className="section-heading">
        <h2 id="table-title">Funcionários cadastrados</h2>
      </div>

      {isLoading ? (
        <div className="empty-state">Carregando funcionários...</div>
      ) : funcionarios.length === 0 ? (
        <div className="empty-state">Nenhum funcionário encontrado.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Cidade/UF</th>
                <th>Idade</th>
                <th>Escolaridade</th>
                <th>Cargo</th>
                <th>Salário</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario._id}>
                  <td title={funcionario._id} className="id-cell">
                    {shortId(funcionario._id)}
                  </td>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.cidade} / {funcionario.estado}</td>
                  <td>{funcionario.idade}</td>
                  <td>{funcionario.escolaridade}</td>
                  <td>{funcionario.cargo}</td>
                  <td>{currencyFormatter.format(Number(funcionario.salario || 0))}</td>
                  <td>{formatDate(funcionario.createdAt)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="small-button"
                        onClick={() => onEdit(funcionario)}
                        disabled={isSubmitting || Boolean(funcionarioEmRemocao)}
                        aria-label={`Editar dados de ${funcionario.nome}`}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => onDelete(funcionario)}
                        disabled={isSubmitting || Boolean(funcionarioEmRemocao)}
                        aria-label={`Remover ${funcionario.nome}`}
                      >
                        {funcionarioEmRemocao === funcionario._id ? 'Removendo...' : 'Remover'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
