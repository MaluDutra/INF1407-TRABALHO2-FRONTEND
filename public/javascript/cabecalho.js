import { backendAddress } from './constantes.js';
import { authFetch } from './accounts/common.js';
/**
 * Inicializa o cabeçalho da página após o carregamento.
 * Registra o evento de logout e tenta identificar o usuário.
 */
addEventListener('load', async () => {
    var _a;
    (_a = document.getElementById('logout')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', logout);
    identifica();
});
/**
 * Verifica se o usuário está autenticado e atualiza o cabeçalho.
 * Exibe o bloco de usuário logado ou não logado conforme o resultado.
 */
const identifica = async () => {
    var _a;
    const spanElement = document.getElementById('identificacao');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    };
    const response = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: headers
    });
    const objDivlogged = document.getElementById('logged');
    const objDivunlogged = document.getElementById('unlogged');
    if (response.ok) {
        // token enviado no cabeçalho foi aceito pelo servidor
        const data = await response.json();
        objDivlogged.classList.remove('invisivel');
        objDivlogged.classList.add('visivel');
        objDivunlogged.classList.remove('visivel');
        objDivunlogged.classList.add('invisivel');
        spanElement.textContent = (_a = data.username) !== null && _a !== void 0 ? _a : 'visitante';
    }
    else {
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
const logout = (evento) => {
    evento.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    const homeUrl = '/public/?logout=' + Date.now();
    if (window.top && window.top !== window) {
        window.top.location.href = homeUrl;
    }
    else {
        window.location.href = homeUrl;
    }
};
//# sourceMappingURL=cabecalho.js.map