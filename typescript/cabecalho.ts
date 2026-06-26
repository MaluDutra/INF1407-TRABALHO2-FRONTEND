import { backendAddress } from './constantes.js';
import { authFetch } from './accounts/common.js';

/**
 * Inicializa o cabeçalho da página após o carregamento.
 * Registra o evento de logout e tenta identificar o usuário.
 */
addEventListener('load', async () => {
    document.getElementById('logout')?.addEventListener('click', logout);
    identifica();
});

/**
 * Verifica se o usuário está autenticado e atualiza o cabeçalho.
 * Exibe o bloco de usuário logado ou não logado conforme o resultado.
 */
const identifica = async () => {
    const spanElement = document.getElementById('identificacao') as HTMLSpanElement;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    };

    const response = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: headers
    });

    const objDivlogged = document.getElementById('logged') as HTMLDivElement;
    const objDivunlogged = document.getElementById('unlogged') as HTMLDivElement;

    if (response.ok) {
        // token enviado no cabeçalho foi aceito pelo servidor
        const data = await response.json();
        objDivlogged.classList.remove('invisivel');
        objDivlogged.classList.add('visivel');
        objDivunlogged.classList.remove('visivel');
        objDivunlogged.classList.add('invisivel');
        spanElement.textContent = data.username ?? 'visitante';
    } else {
        // token enviado no cabeçalho foi rejeitado pelo servidor
        objDivlogged.classList.remove('visivel');
        objDivlogged.classList.add('invisivel');
        objDivunlogged.classList.remove('invisivel');
        objDivunlogged.classList.add('visivel');
        spanElement.textContent = 'visitante';
    }
};

/**
 * Realiza logout removendo os tokens locais e redirecionando para a home.
 * Usa window.top para garantir o redirecionamento correto em iframes.
 * @param evento Evento de clique do botão de logout
 */
const logout = (evento: MouseEvent) => {
    evento.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    const homeUrl = '/?logout=' + Date.now();
    if (window.top && window.top !== window) {
        window.top.location.href = homeUrl;
    } else {
        window.location.href = homeUrl;
    }
};
