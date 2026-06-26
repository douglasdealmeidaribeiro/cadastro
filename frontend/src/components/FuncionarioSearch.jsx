export function FuncionarioSearch({
  value,
  onChange,
  onSearch,
  onEdit,
  onDelete,
  total,
  filteredTotal,
  isLoading,
  acaoDeBusca,
  consultaRealizada
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section className="toolbar" aria-label="Consulta de funcionários">
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="search">Funcionário por ID ou nome</label>
        <div className="search-controls">
          <input
            id="search"
            type="search"
            placeholder="Deixe vazio para consultar todos"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="search-actions">
            <button type="submit" className="consult-button" disabled={isLoading}>
              {acaoDeBusca === 'consultar' ? 'Aguarde' : 'Consultar'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onEdit}
              disabled={isLoading || !value.trim()}
            >
              {acaoDeBusca === 'atualizar' ? 'Aguarde' : 'Atualizar'}
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={onDelete}
              disabled={isLoading || !value.trim()}
            >
              {acaoDeBusca === 'remover' ? 'Aguarde' : 'Remover'}
            </button>
          </div>
        </div>
      </form>

      {consultaRealizada && (
        <p className="counter">
          {filteredTotal} de {total} funcionário{total === 1 ? '' : 's'}
        </p>
      )}
    </section>
  );
}
