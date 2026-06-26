import { backendAddress } from '../constantes.js';
/**
 * Processa o envio do formulário de recuperação de senha.
 *
 * O formulário envia o e-mail do usuário para o endpoint de
 * password-reset do backend e exibe uma mensagem de status.
 */
addEventListener("DOMContentLoaded", (evento) => {
    const form = document.getElementById("formulario");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const messageDiv = document.getElementById("message");
        const email = document.getElementById("email").value;
        try {
            const response = await fetch(backendAddress + "gerenciamento/password-reset/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                // Solicitação aceita: instruções enviadas por e-mail
                messageDiv.textContent = "Instruções para resetar a senha foram enviadas para o seu e-mail.";
                messageDiv.style.color = "green";
                setTimeout(() => {
                    location.href = 'passwordResetDone.html';
                }, 3000);
            }
            else {
                // Erro retornado pelo servidor
                const errorData = await response.json();
                messageDiv.textContent = `Erro: ${errorData.message}`;
            }
        }
        catch (error) {
            // Erro de rede ou falha na requisição
            messageDiv.textContent = `Erro de rede: ${error}`;
        }
    });
});
//# sourceMappingURL=passwordReset.js.map