// scripts.ts
import { backendAddress } from './constantes.js';

onload = function () {
    (document.getElementById('insere') as HTMLButtonElement).addEventListener('click', evento => { location.href = 'insereMusica.html' });

    (document.getElementById('remove') as HTMLButtonElement).addEventListener('click', apagaMusicas);

    exibeListaDeMusicas(); // exibe lista de músicas ao carregar a página
}


async function exibeListaDeMusicas() {
    try {
        const response = await fetch(backendAddress + 'SongList/variasmusicas/');

        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }

        const musicas = await response.json();
        let campos = ['titulo', 'artista', 'album', 'ano'];
        let tbody = document.getElementById('idtbody') as HTMLTableSectionElement;

        tbody.innerHTML = ''; // Limpa o conteúdo do tbody antes de adicionar novos dados

        musicas.forEach((musica: any) => {
            let tr = document.createElement('tr');
            campos.forEach(campo => {
                let td = document.createElement('td') as HTMLTableCellElement;

                let href = document.createElement('a') as HTMLAnchorElement;
                href.href = 'update.html?id=' + musica['id'];
                href.textContent = musica[campo];
                td.appendChild(href);
                tr.appendChild(td);
            });

            let checkbox = document.createElement('input') as HTMLInputElement;
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('name', 'id');
            checkbox.setAttribute('id', 'id');
            checkbox.setAttribute('value', musica['id']);
            let td = document.createElement('td') as HTMLTableCellElement;
            td.appendChild(checkbox);
            tr.appendChild(td);

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar a lista de músicas:', error);
        // talvez exibir uma mensagem de erro para o usuário
    }
}

let apagaMusicas = async (evento: Event) => {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="id"]:checked') as NodeListOf<HTMLInputElement>;
    const checkedValues: string[] = [];
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
            console.log('Músicas excluídas com sucesso!');
        } else {
            alert('Erro ao excluir músicas!');
            console.error('Erro ao excluir músicas:', response.status);
        }
    } catch (error) {
        // Talvez mensagem melhor de erro ao usuário
        console.error('Erro ao enviar dados para o backend:', error);
    } finally {
        exibeListaDeMusicas(); // Atualiza a lista de músicas após a exclusão
    }
};
