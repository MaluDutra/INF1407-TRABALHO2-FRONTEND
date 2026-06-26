// Camada única de comunicação com o backend Django.
// Quando o backend estiver no ar, troque API_BASE_URL e defina MOCK_MODE = false.

import { mockRequest } from "./mock-api.js";

// MODO MOCK: true = usa API falsa no localStorage (sem precisar do backend).
// false = chama o Django de verdade.
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

  const init: RequestInit = {
    method: metodo,
    headers: { "Content-Type": "application/json" },
  };
  if (corpo !== undefined) {
    init.body = JSON.stringify(corpo);
  }
  const resposta = await fetch(`${API_BASE_URL}${caminho}`, init);

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const corpoErro = (await resposta.json()) as { detail?: string };
      mensagem = corpoErro.detail ?? JSON.stringify(corpoErro);
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(resposta.status, mensagem);
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}
