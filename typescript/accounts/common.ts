import { backendAddress } from '../constantes.js';

/**
 * Adiciona ícones de olho a campos de senha para alternar visibilidade.
 *
 * Para cada elemento com a classe `.password-container`, o script procura
 * um campo de senha e um ícone de alternância. Se ambos existirem, o ícone
 * passa a alternar entre `password` e `text` ao ser clicado.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Para cada campo password, adiciona um ícone de olho para mostrar/ocultar a senha
    // cria um vetor de containers, cada um contendo um campo de senha e seu respectivo ícone de olho
    const containers = document.querySelectorAll<HTMLDivElement>(".password-container");
    // para cada container, adiciona um event listener ao ícone de olho para alternar entre mostrar e ocultar a senha
    containers.forEach(container => {
        const objInput = container.querySelector<HTMLInputElement>('input[type="password"]');
        const objImgEye = container.querySelector<HTMLImageElement>(".toggle-password");
        // verifica se o container está bem formado, ou seja, se contém um campo de senha e um ícone de olho
        if (!objInput || !objImgEye) return; // container mal formado
        // adiciona o event listener ao ícone de olho para alternar entre mostrar e ocultar a senha
        objImgEye.addEventListener("click", () => {
            if (objInput.type === "password") {
                objInput.type = "text";
                objImgEye.src = "img/eye.svg";
            } else {
                objInput.type = "password";
                objImgEye.src = "img/eye-off.svg";
            }
        });
    });
});

/**
 * Decodifica o payload de um token JWT sem verificar a assinatura.
 *
 * @param token token JWT completo no formato header.payload.signature
 * @returns objeto JSON contendo os dados do payload
 */
const decodeJWT = (token: string): any => {
    const payload = token.split('.')[1];
    
    // Se não existir payload (ex: passaram uma string sem pontos), aborta
    if (!payload) {
        throw new Error("Token JWT malformado ou inválido.");
    }

    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
}

/**
 * Verifica se um token JWT expirou com base no campo "exp" do payload.
 *
 * @param token token JWT a ser verificado
 * @returns true se expirado, false caso ainda seja válido
 */
const isAccessTokenExpired = (token: string): boolean => {
    const decoded = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
}

/**
 * Atualiza o token de acesso usando o refresh token armazenado no localStorage.
 * Se a atualização falhar, remove ambos os tokens do armazenamento.
 */
const refreshAccessToken = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error('No refresh token available');
        return;
    }

    try {
        const response = await fetch(backendAddress + 'api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
            const token = await response.json();
            localStorage.setItem('access_token', token.access);
        } else {
            console.error('Failed to refresh access token');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}

/**
 * Executa requisições HTTP autenticadas, injetando o token de acesso no cabeçalho.
 * Se o token estiver expirado, tenta atualizá-lo antes de enviar a requisição.
 *
 * @param url endpoint da requisição
 * @param options opções de fetch, como método e headers
 * @returns objeto Response da requisição fetch
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = localStorage.getItem('access_token');

    if (accessToken && isAccessTokenExpired(accessToken)) {
        await refreshAccessToken();
        accessToken = localStorage.getItem('access_token');
    }

    if (accessToken) {
        options.headers = {
            ...(<any>options.headers || {}),
            'Authorization': 'Bearer ' + accessToken
        };
    }

    return fetch(url, options);
}
