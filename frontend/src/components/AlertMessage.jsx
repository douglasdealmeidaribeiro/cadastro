export function AlertMessage({ alert, onClose }) {
  if (!alert?.message) {
    return null;
  }

  return (
    <div className={`alert alert-${alert.type}`} role="status">
      <span>{alert.message}</span>
      <button type="button" onClick={onClose} aria-label="Fechar mensagem">
        x
      </button>
    </div>
  );
}
