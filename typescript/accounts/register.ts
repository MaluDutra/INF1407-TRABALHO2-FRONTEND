import { backendAddress } from '../constantes.js';

/**
 * Inicializa o formulário de registro quando a página é carregada.
 */
onload = () => {
    const form = document.getElementById('registerForm') as HTMLFormElement;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const messageDiv = document.getElementById('message') as HTMLDivElement;
        const username = (document.getElementById('username') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const passwordConfirm = (document.getElementById('password_confirm') as HTMLInputElement).value;

        if (password !== passwordConfirm) {
            messageDiv.textContent = 'As senhas não coincidem.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(backendAddress + 'gerenciamento/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    password_confirm: passwordConfirm
                })
            });

            if (response.ok) {
                messageDiv.style.color = 'green';
                messageDiv.textContent = 'Usuário criado com sucesso. Redirecionando para login...';

                setTimeout(() => {
                    window.location.href = './accounts/login.html';
                }, 2500);
                return;
            }

            const responseText = await response.text();
            let errorMessage = responseText;

            try {
                const errorData = JSON.parse(responseText);
                if (typeof errorData === 'object' && errorData !== null) {
                    if ('message' in errorData) {
                        errorMessage = errorData.message;
                    } else {
                        errorMessage = JSON.stringify(errorData);
                    }
                }
            } catch {
                // resposta não é JSON, mantém responseText
            }

            messageDiv.style.color = 'red';
            messageDiv.textContent = errorMessage;
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = `Erro de rede: ${error}`;
        }
    });
};
