// scripts.ts
import { backendAddress } from './constantes.js';
import { authFetch } from './accounts/common.js';
onload = async function () {
    await configuraBotoesAutenticacao();
    exibeListaDeMusicas();
};
/**
 * Verifica se o usuário está autenticado e mostra ou esconde
 * os botões de inserir e remover de acordo com o estado de autenticação.
 */
async function configuraBotoesAutenticacao() {
    const divAcoes = document.getElementById('acoesAutenticadas');
    const response = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        // usuário autenticado: exibe os botões de ação
        divAcoes.classList.remove('invisivel');
        divAcoes.classList.add('visivel');
        document.getElementById('insere').addEventListener('click', () => { location.href = 'insereMusica.html'; });
        document.getElementById('remove').addEventListener('click', apagaMusicas);
    }
    // visitante: div permanece com class="invisivel", nada a fazer
}
async function exibeListaDeMusicas() {
    // verifica autenticação para decidir se exibe links de update e checkboxes
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
        // limpa sem usar innerHTML
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        musicas.forEach((musica) => {
            const tr = document.createElement('tr');
            campos.forEach(campo => {
                const td = document.createElement('td');
                if (estaAutenticado) {
                    // logado: célula vira link para editar
                    const href = document.createElement('a');
                    href.href = 'update.html?id=' + musica['id'];
                    href.textContent = musica[campo];
                    td.appendChild(href);
                }
                else {
                    // visitante: só texto, sem link de edição
                    td.textContent = musica[campo];
                }
                tr.appendChild(td);
            });
            // coluna de checkbox: só aparece para autenticados
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
let apagaMusicas = async (evento) => {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="id"]:checked');
    const checkedValues = [];
    checkboxes.forEach(checkbox => {
        checkedValues.push(checkbox.value);
    });
    try {
        const response = await fetch(backendAddress + 'SongList/variasmusicas/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
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