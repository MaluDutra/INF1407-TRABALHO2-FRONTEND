import { backendAddress } from '../constantes.js';
import { authFetch } from './common.js';

/**
 * Inicializa o formulario de alteração de senha após o carregamento do DOM.
 * Verifica se a nova senha e a confirmação coincidem antes de enviar a requisição.
 */
addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario") as HTMLFormElement;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const messageDiv = document.getElementById("message") as HTMLDivElement;

        const currentPassword = (document.getElementById("old_password") as HTMLInputElement).value;
        const newPassword = (document.getElementById("new_password") as HTMLInputElement).value;
        const confirmPassword = (document.getElementById("confirm_password") as HTMLInputElement).value;

        // Validação local: garante que a senha nova e a confirmação sejam iguais
        if (newPassword !== confirmPassword) {
            messageDiv.textContent = "A nova senha e a confirmação não coincidem.";
            return;
        }

        try {
            const response = await authFetch(backendAddress + "gerenciamento/change-password/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    old_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (response.ok) {
                messageDiv.textContent = "Senha alterada com sucesso! Você será redirecionado para a página de login em breve.";
                // Remove os tokens locais para efetivar o logout após mudança de senha
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                setTimeout(() => {
                    location.href = "login.html";
                }, 3000);
            } else {
                const errorData = await response.json();
                messageDiv.textContent = `Erro: ${errorData.message}`;
            }
        } catch (error) {
            // Captura falhas de rede ou exceções geradas pela requisição
            messageDiv.textContent = `Erro de rede: ${error}`;
        }
    });
});
