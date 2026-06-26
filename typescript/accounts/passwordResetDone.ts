import { backendAddress, getBasePath } from '../constantes.js';
import './common.js';

/**
 * Inicializa a página de redefinição de senha quando o carregamento é concluído.
 * A troca de visibilidade dos campos de senha é gerenciada automaticamente pelo
 * helper definido em common.js, que reage à classe `.password-container`.
 */
addEventListener("load", function () {
    (document.getElementById("enviaNovaSenha") as HTMLButtonElement).addEventListener("click", async function (evento) {
        evento.preventDefault();

        const token = (document.getElementById("token") as HTMLInputElement).value;
        const senha = (document.getElementById("novaSenha") as HTMLInputElement).value;
        const senha2 = (document.getElementById("confirmarSenha") as HTMLInputElement).value;
        const message = document.getElementById("message") as HTMLDivElement;

        // Valida se as duas senhas digitadas são iguais
        if (senha !== senha2) {
            message.textContent = "As senhas não coincidem.";
            message.style.color = "red";
            return;
        }

        const response = await fetch(backendAddress + 'gerenciamento/password-reset/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: token,
                new_password: senha
            })
        });

        if (response.ok) {
            message.textContent = "Senha alterada com sucesso! Redirecionando para a página de login...";
            message.style.color = "green";
            setTimeout(() => {
                location.href = getBasePath() + "accounts/login.html";
            }, 3000);
        } else {
            const data = await response.json();
            message.textContent = data.detail || "Ocorreu um erro ao alterar a senha.";
            message.style.color = "red";
        }
    });
});
