"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constantes_js_1 = require("./constantes.js");
const common_js_1 = require("./accounts/common.js");
/**
 * Inicializa o cabeçalho da página após o carregamento.
 * Registra o evento de logout e tenta identificar o usuário.
 */
addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (_a = document.getElementById('logout')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', logout);
    identifica();
}));
/**
 * Verifica se o usuário está autenticado e atualiza o cabeçalho.
 * Exibe o bloco de usuário logado ou não logado conforme o resultado.
 */
const identifica = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const spanElement = document.getElementById('identificacao');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    };
    const response = yield (0, common_js_1.authFetch)(constantes_js_1.backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: headers
    });
    const objDivlogged = document.getElementById('logged');
    const objDivunlogged = document.getElementById('unlogged');
    if (response.ok) {
        // token enviado no cabeçalho foi aceito pelo servidor
        const data = yield response.json();
        objDivlogged.classList.remove('invisivel');
        objDivlogged.classList.add('visivel');
        objDivunlogged.classList.remove('visivel');
        objDivunlogged.classList.add('invisivel');
        spanElement.textContent = ((_b = data.username) !== null && _b !== void 0 ? _b : 'visitante') + '!';
    }
    else {
        // token enviado no cabeçalho foi rejeitado pelo servidor
        objDivlogged.classList.remove('visivel');
        objDivlogged.classList.add('invisivel');
        objDivunlogged.classList.remove('invisivel');
        objDivunlogged.classList.add('visivel');
        spanElement.textContent = 'visitante!';
    }
});
/**
 * Realiza logout removendo os tokens locais e redirecionando para a home.
 * Usa window.top para garantir o redirecionamento correto em iframes.
 * @param evento Evento de clique do botão de logout
 */
const logout = (evento) => {
    evento.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    const homeUrl = (0, constantes_js_1.getBasePath)() + '?logout=' + Date.now();
    if (window.top && window.top !== window) {
        window.top.location.href = homeUrl;
    }
    else {
        window.location.href = homeUrl;
    }
};
