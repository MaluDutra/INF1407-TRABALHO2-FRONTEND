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
 * Inicializa a página de edição de música.
 *
 * A função é executada quando a página carrega, garante que o usuário esteja
 * autenticado, busca os dados da música, preenche o formulário e configura o
 * envio da atualização.
 */
onload = () => __awaiter(void 0, void 0, void 0, function* () {
    // Verifica se o usuário está autenticado antes de permitir o acesso
    const authResponse = yield (0, common_js_1.authFetch)(constantes_js_1.backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!authResponse.ok) {
        // Se não estiver autenticado, redireciona para a página de login
        window.location.href = (0, constantes_js_1.getBasePath)() + 'accounts/login.html';
        return;
    }
    // Busca o parâmetro "id" na URL para saber qual música deve ser editada
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const idPlace = document.getElementById('id');
    const idSpan = document.getElementById('id-span');
    if (id) {
        // Exibe o ID nos elementos correspondentes na página
        idPlace.value = id;
        if (idSpan) {
            idSpan.textContent = id;
        }
        try {
            // Solicita os dados da música específica do backend
            const response = yield fetch(constantes_js_1.backendAddress + 'SongList/umamusica/' + id + '/');
            if (response.ok) {
                const musica = yield response.json();
                // Define os campos do formulário que serão preenchidos automaticamente
                const campos = ['id', 'titulo', 'artista', 'album', 'ano'];
                campos.forEach(campo => {
                    const elemento = document.getElementById(campo);
                    if (elemento) {
                        elemento.value = musica[campo];
                    }
                });
            }
            else {
                console.error('Erro ao buscar dados da música:', response.status);
            }
        }
        catch (error) {
            console.error('Erro ao buscar dados da música:', error);
        }
    }
    else {
        // Caso o ID não seja fornecido na URL, exibe uma mensagem de erro no campo
        idPlace.value = 'URL mal formada: ' + window.location;
    }
    // Configura o botão de atualizar para enviar o formulário ao backend
    document.getElementById('atualiza').addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const elements = document.getElementById('meuFormulario').elements;
        let data = {};
        // Coleta os dados do formulário
        for (let i = 0; i < elements.length; i++) {
            const element = elements.item(i);
            if (element && element.name) {
                data[element.name] = element.value;
            }
        }
        try {
            const response = yield fetch(constantes_js_1.backendAddress + 'SongList/umamusica/' + id + '/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                document.getElementById('mensagem').textContent = 'Música atualizada com sucesso!';
                setTimeout(() => {
                    window.location.href = (0, constantes_js_1.getBasePath)() + 'index.html';
                }, 1500);
            }
            else if (response.status === 401) {
                document.getElementById('mensagem').textContent = 'Acesso negado. Por favor, realize login antes.';
            }
            else {
                document.getElementById('mensagem').textContent = 'Erro ao atualizar música.';
            }
        }
        catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    }));
});
