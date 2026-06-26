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
// scripts.ts
const constantes_js_1 = require("./constantes.js");
const common_js_1 = require("./accounts/common.js");
/**
 * Inicializa a página assim que o carregamento do conteúdo é concluído.
 * Configura os botões de autenticação e carrega a lista de músicas.
 */
onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield configuraBotoesAutenticacao();
        exibeListaDeMusicas();
    });
};
/**
 * Verifica se o usuário está autenticado e exibe os controles de
 * inserção e remoção somente para usuários autenticados.
 */
function configuraBotoesAutenticacao() {
    return __awaiter(this, void 0, void 0, function* () {
        const divAcoes = document.getElementById('acoesAutenticadas');
        const response = yield (0, common_js_1.authFetch)(constantes_js_1.backendAddress + 'gerenciamento/whoami/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            // Exibe os controles de ação apenas para usuários autenticados
            divAcoes.classList.remove('invisivel');
            divAcoes.classList.add('visivel');
            document.getElementById('colunaRemove').classList.remove('invisivel');
            document.getElementById('colunaRemove').classList.add('visivel');
            document.getElementById('insere').addEventListener('click', () => {
                location.href = (0, constantes_js_1.getBasePath)() + 'insereMusica.html';
            });
            document.getElementById('remove').addEventListener('click', apagaMusicas);
        }
    });
}
/**
 * Busca todas as músicas do backend e renderiza a tabela de resultados.
 * Quando o usuário está autenticado, o título de cada música vira um link para edição.
 */
function exibeListaDeMusicas() {
    return __awaiter(this, void 0, void 0, function* () {
        const authResponse = yield (0, common_js_1.authFetch)(constantes_js_1.backendAddress + 'gerenciamento/whoami/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const estaAutenticado = authResponse.ok;
        try {
            const response = yield fetch(constantes_js_1.backendAddress + 'SongList/variasmusicas/');
            if (!response.ok) {
                throw new Error('Erro na resposta da API: ' + response.status);
            }
            const musicas = yield response.json();
            const campos = ['titulo', 'artista', 'album', 'ano'];
            const tbody = document.getElementById('idtbody');
            // Remove linhas existentes antes de desenhar a tabela novamente
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            musicas.forEach((musica) => {
                const tr = document.createElement('tr');
                campos.forEach(campo => {
                    const td = document.createElement('td');
                    if (estaAutenticado) {
                        const href = document.createElement('a');
                        href.href = (0, constantes_js_1.getBasePath)() + 'update.html?id=' + musica['id'];
                        href.textContent = musica[campo];
                        td.appendChild(href);
                    }
                    else {
                        td.textContent = musica[campo];
                    }
                    tr.appendChild(td);
                });
                const tdCheck = document.createElement('td');
                if (estaAutenticado) {
                    const checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.setAttribute('name', 'id');
                    checkbox.setAttribute('value', musica['id']);
                    tdCheck.appendChild(checkbox);
                }
                tr.appendChild(tdCheck);
                tbody.appendChild(tr);
            });
        }
        catch (error) {
            console.error('Erro ao buscar a lista de músicas:', error);
        }
    });
}
/**
 * Exclui as músicas selecionadas na tabela e atualiza a lista em seguida.
 * O backend recebe um array de IDs para remoção em massa.
 */
let apagaMusicas = (evento) => __awaiter(void 0, void 0, void 0, function* () {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="id"]:checked');
    const checkedValues = [];
    checkboxes.forEach(checkbox => {
        checkedValues.push(checkbox.value);
    });
    try {
        const response = yield fetch(constantes_js_1.backendAddress + 'SongList/variasmusicas/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify(checkedValues)
        });
        if (response.ok) {
            alert('Músicas excluídas com sucesso!');
        }
        else {
            alert('Erro ao excluir músicas!');
            console.error('Erro ao excluir músicas:', response.status);
        }
    }
    catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
    }
    finally {
        exibeListaDeMusicas();
    }
});
