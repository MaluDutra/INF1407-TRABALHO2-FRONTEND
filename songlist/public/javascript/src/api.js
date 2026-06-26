// Camada única de comunicação com o backend Django.
// Quando o backend estiver no ar, troque API_BASE_URL e defina MOCK_MODE = false.
import { mockRequest } from "./mock-api.js";
// MODO MOCK: true = usa API falsa no localStorage (sem precisar do backend).
// false = chama o Django de verdade.
export const MOCK_MODE = true;
export const API_BASE_URL = "http://127.0.0.1:8000/api";
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export async function apiRequest(caminho, metodo = "GET", corpo) {
    var _a;
    if (MOCK_MODE) {
        return mockRequest(caminho, metodo, corpo);
    }
    const init = {
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
            const corpoErro = (await resposta.json());
            mensagem = (_a = corpoErro.detail) !== null && _a !== void 0 ? _a : JSON.stringify(corpoErro);
        }
        catch (_b) {
            // resposta sem corpo JSON
        }
        throw new ApiError(resposta.status, mensagem);
    }
    if (resposta.status === 204) {
        return undefined;
    }
    return (await resposta.json());
}
//# sourceMappingURL=api.js.map