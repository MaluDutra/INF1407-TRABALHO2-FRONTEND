// scripts.ts
import { backendAddress } from './constantes.js';
import { authFetch } from './accounts/common.js';

onload = async function () {
    await configuraBotoesAutenticacao();
    exibeListaDeMusicas();
}

/**
 * Verifica se o usuário está autenticado e mostra ou esconde
 * os botões de inserir e remover de acordo com o estado de autenticação.
 */
async function configuraBotoesAutenticacao() {
    const divAcoes = document.getElementById('acoesAutenticadas') as HTMLDivElement;
    const response = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        // usuário autenticado: exibe os botões de ação
        divAcoes.classList.remove('invisivel');
        divAcoes.classList.add('visivel');
        (document.getElementById('colunaRemove') as HTMLTableCellElement).classList.remove('invisivel');
        (document.getElementById('colunaRemove') as HTMLTableCellElement).classList.add('visivel');
        (document.getElementById('insere') as HTMLButtonElement).addEventListener('click', () => { location.href = 'insereMusica.html'; });
        (document.getElementById('remove') as HTMLButtonElement).addEventListener('click', apagaMusicas);
    }
}

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
        const tbody = document.getElementById('idtbody') as HTMLTableSectionElement;

        
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        musicas.forEach((musica: any) => {
            const tr = document.createElement('tr');

            campos.forEach(campo => {
                const td = document.createElement('td') as HTMLTableCellElement;

                if (estaAutenticado) {
                    const href = document.createElement('a') as HTMLAnchorElement;
                    href.href = 'update.html?id=' + musica['id'];
                    href.textContent = musica[campo];
                    td.appendChild(href);
                } else {
                    td.textContent = musica[campo];
                }

                tr.appendChild(td);
            });

            const tdCheck = document.createElement('td') as HTMLTableCellElement;
            if (estaAutenticado) {
                const checkbox = document.createElement('input') as HTMLInputElement;
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('name', 'id');
                checkbox.setAttribute('value', musica['id']);
                tdCheck.appendChild(checkbox);
            }
            tr.appendChild(tdCheck);

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar a lista de músicas:', error);
    }
}

let apagaMusicas = async (evento: Event) => {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="id"]:checked');
    const checkedValues: string[] = [];
    checkboxes.forEach(checkbox => {
        checkedValues.push(checkbox.value);
    });

    try {
        const response = await fetch(backendAddress + 'SongList/variasmusicas/', {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify(checkedValues)
        });
        if (response.ok) {
            alert('Músicas excluídas com sucesso!');
        } else {
            alert('Erro ao excluir músicas!');
            console.error('Erro ao excluir músicas:', response.status);
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
    } finally {
        exibeListaDeMusicas();
    }
};