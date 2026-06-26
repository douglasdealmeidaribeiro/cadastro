export function FuncionarioSearch({
  value,
  onChange,
  onSearch,
  total,
  filteredTotal,
  isLoading,
  consultaRealizada
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section className="toolbar" aria-label="Consulta de funcionários">
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="search">Consultar por ID ou nome</label>
        <div className="search-controls">
          <input
            id="search"
            type="search"
            placeholder="Deixe vazio para consultar todos"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <button type="submit" className="consult-button" disabled={isLoading}>
            {isLoading ? 'Consultando...' : 'Consultar'}
          </button>
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
