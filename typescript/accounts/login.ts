import { backendAddress, type JwtResposta } from '../constantes.js';

/**
 * Inicializa o formulário de login quando a página é carregada.
 * Captura as credenciais do usuário e tenta autenticar no backend.
 */
onload = () => {
    const form = document.getElementById("loginForm") as HTMLFormElement;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const msg = document.getElementById("msg") as HTMLDivElement;
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        try {
            const tokens = await login(username, password);
            // Armazena os tokens JWT no localStorage para uso nas próximas requisições
            localStorage.setItem("access_token", tokens.access);
            localStorage.setItem("refresh_token", tokens.refresh);
            window.location.href = "/public/";
        } catch (err) {
            msg.textContent = "Usuário ou senha inválidos";
        }
    });
};

/**
 * Envia as credenciais ao backend para obter um par de tokens JWT.
 *
 * @param username nome de usuário informado no formulário
 * @param password senha informada no formulário
 * @returns Promise que resolve para o objeto de tokens JWT
 */
async function login(username: string, password: string): Promise<JwtResposta> {
    const response = await fetch(backendAddress + "api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Login inválido");
    }

    return await response.json();
}
