const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  } catch {
    throw new Error(
      `Não foi possível conectar à API em ${API_URL}. Verifique se o back-end está online e se VITE_API_URL aponta para a URL pública da API.`
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || 'Não foi possível concluir a operação.');
  }

  return payload;
}

export async function listarFuncionarios() {
  const response = await request('/api/funcionarios');
  return response.data;
}

export async function criarFuncionario(funcionario) {
  const response = await request('/api/funcionarios', {
    method: 'POST',
    body: JSON.stringify(funcionario)
  });

  return response.data;
}

export async function atualizarFuncionario(id, funcionario) {
  const response = await request(`/api/funcionarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(funcionario)
  });

  return response.data;
}

export async function removerFuncionario(id) {
  const response = await request(`/api/funcionarios/${id}`, {
    method: 'DELETE'
  });

  return response.data;
}
