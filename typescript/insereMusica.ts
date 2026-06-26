import { backendAddress } from './constantes.js';
import { authFetch } from './accounts/common.js';

/**
 * Inicializa a página de inserção de música.
 * Verifica a autenticação e configura o envio do formulário.
 */
onload = async () => {
    // visitante não pode acessar esta página sem login
    const authResponse = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!authResponse.ok) {
        window.location.href = 'accounts/login.html';
        return;
    }

    (document.getElementById('insere') as HTMLButtonElement).addEventListener('click', async e => {
        e.preventDefault();
        const elements = (document.getElementById('meuFormulario') as HTMLFormElement).elements;
        const data: Record<string, string> = {};

        // Coleta os dados do formulário em um objeto para enviar ao backend
        for (let i = 0; i < elements.length; i++) {
            const element = elements.item(i) as HTMLInputElement;
            if (element && element.name) {
                data[element.name] = element.value;
            }
        }
        try {
            const response = await fetch(backendAddress + 'SongList/criar/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                (document.getElementById('mensagem') as HTMLDivElement).textContent = 'Inserido com sucesso!';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else if (response.status === 401) {
                (document.getElementById('mensagem') as HTMLDivElement).textContent = 'Acesso negado. Por favor, realize login antes.';
            } else {
                (document.getElementById('mensagem') as HTMLDivElement).textContent = 'Erro ao inserir música.';
            }
        } catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    });
};