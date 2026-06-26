export function FuncionarioSearch({ value, onChange, total, filteredTotal }) {
  return (
    <section className="toolbar" aria-label="Busca de funcionários">
      <div>
        <label htmlFor="search">Buscar por ID ou nome</label>
        <input
          id="search"
          type="search"
          placeholder="Digite o ID ou nome do funcionário"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      <p className="counter">
        {filteredTotal} de {total} funcionário{total === 1 ? '' : 's'}
      </p>
    </section>
  );
}
