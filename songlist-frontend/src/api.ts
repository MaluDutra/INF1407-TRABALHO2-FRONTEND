// Camada única de comunicação com o backend Django.
// Quando o backend estiver no ar, só trocar API_BASE_URL.
//
// OBS: por enquanto este arquivo não lida com login/token. Quando a
// gerência de usuário for integrada (pela dupla), basta acrescentar o
// header "Authorization" nas requisições aqui, igual é feito em
// muitos tutoriais de Django REST + TokenAuthentication.

import { mockRequest } from "./mock-api.js";

// MODO MOCK: enquanto o backend Django não está pronto, deixe true.
// Isso faz o site usar uma "API falsa" guardada no localStorage do
// navegador, só pra você testar o CRUD sem precisar do backend.
// Quando o backend estiver no ar, troque para false.
export const MOCK_MODE = true;

export const API_BASE_URL = "http://127.0.0.1:8000/api";

type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  caminho: string,
  metodo: Metodo = "GET",
  corpo?: unknown
): Promise<T> {
  if (MOCK_MODE) {
    return mockRequest<T>(caminho, metodo, corpo);
  }

  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const corpoErro = await resposta.json();
      mensagem = corpoErro.detail ?? JSON.stringify(corpoErro);
    } catch {
      // resposta sem corpo JSON, mantém mensagem padrão
    }
    throw new ApiError(resposta.status, mensagem);
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}