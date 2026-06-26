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
 * Inicializa a página de inserção de música.
 * Verifica a autenticação e configura o envio do formulário.
 */
onload = () => __awaiter(void 0, void 0, void 0, function* () {
    // visitante não pode acessar esta página sem login
    const authResponse = yield (0, common_js_1.authFetch)(constantes_js_1.backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!authResponse.ok) {
        window.location.href = (0, constantes_js_1.getBasePath)() + 'accounts/login.html';
        return;
    }
    document.getElementById('insere').addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const elements = document.getElementById('meuFormulario').elements;
        const data = {};
        // Coleta os dados do formulário em um objeto para enviar ao backend
        for (let i = 0; i < elements.length; i++) {
            const element = elements.item(i);
            if (element && element.name) {
                data[element.name] = element.value;
            }
        }
        try {
            const response = yield fetch(constantes_js_1.backendAddress + 'SongList/criar/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                document.getElementById('mensagem').textContent = 'Inserido com sucesso!';
                setTimeout(() => {
                    window.location.href = (0, constantes_js_1.getBasePath)() + 'index.html';
                }, 1500);
            }
            else if (response.status === 401) {
                document.getElementById('mensagem').textContent = 'Acesso negado. Por favor, realize login antes.';
            }
            else {
                document.getElementById('mensagem').textContent = 'Erro ao inserir música.';
            }
        }
        catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    }));
});
