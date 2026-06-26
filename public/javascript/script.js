// scripts.ts
import { backendAddress, getBasePath } from './constantes.js';
import { authFetch } from './accounts/common.js';
/**
 * Inicializa a página assim que o carregamento do conteúdo é concluído.
 * Configura os botões de autenticação e carrega a lista de músicas.
 */
onload = async function () {
    await configuraBotoesAutenticacao();
    exibeListaDeMusicas();
};
/**
 * Verifica se o usuário está autenticado e exibe os controles de
 * inserção e remoção somente para usuários autenticados.
 */
async function configuraBotoesAutenticacao() {
    const divAcoes = document.getElementById('acoesAutenticadas');
    const colunaRemove = document.getElementById('colunaRemove');
    const mensagemAcesso = document.getElementById('mensagemAcesso');
    const response = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        // Exibe os controles de ação apenas para usuários autenticados
        divAcoes.classList.remove('invisivel');
        divAcoes.classList.add('visivel');
        colunaRemove.classList.remove('invisivel');
        colunaRemove.classList.add('visivel');
        mensagemAcesso.classList.remove('visivel');
        mensagemAcesso.classList.add('invisivel');
        document.getElementById('insere').addEventListener('click', () => {
            location.href = getBasePath() + 'insereMusica.html';
        });
        document.getElementById('remove').addEventListener('click', apagaMusicas);
    }
    else {
        divAcoes.classList.remove('visivel');
        divAcoes.classList.add('invisivel');
        colunaRemove.classList.remove('visivel');
        colunaRemove.classList.add('invisivel');
        mensagemAcesso.classList.remove('invisivel');
        mensagemAcesso.classList.add('visivel');
    }
}
/**
 * Busca todas as músicas do backend e renderiza a tabela de resultados.
 * Quando o usuário está autenticado, o título de cada música vira um link para edição.
 */
async function exibeListaDeMusicas() {
    const authResponse = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const estaAutenticado = authResponse.ok;
    try {
        const response = await fetch(backendAddress + 'SongList/variasmusicas/');
        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }
        const musicas = await response.json();
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
                    href.href = getBasePath() + 'update.html?id=' + musica['id'];
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
}
/**
 * Exclui as músicas selecionadas na tabela e atualiza a lista em seguida.
 * O backend recebe um array de IDs para remoção em massa.
 */
let apagaMusicas = async (evento) => {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="id"]:checked');
    const checkedValues = [];
    checkboxes.forEach(checkbox => {
        checkedValues.push(checkbox.value);
    });
    try {
        const response = await authFetch(backendAddress + 'SongList/variasmusicas/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
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
};
//# sourceMappingURL=script.js.map