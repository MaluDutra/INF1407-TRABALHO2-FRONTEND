// scripts.ts
import { backendAddress } from './constantes.js';
onload = function () {
    document.getElementById('insere').addEventListener('click', evento => { location.href = 'insereMusica.html'; });
    document.getElementById('remove').addEventListener('click', apagaMusicas);
    exibeListaDeMusicas(); // exibe lista de músicas ao carregar a página
};
async function exibeListaDeMusicas() {
    try {
        const response = await fetch(backendAddress + 'SongList/variasmusicas/');
        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }
        const musicas = await response.json();
        let campos = ['titulo', 'artista', 'album', 'ano'];
        let tbody = document.getElementById('idtbody');
        tbody.innerHTML = ''; // Limpa o conteúdo do tbody antes de adicionar novos dados
        musicas.forEach((musica) => {
            let tr = document.createElement('tr');
            campos.forEach(campo => {
                let td = document.createElement('td');
                let href = document.createElement('a');
                href.href = 'update.html?id=' + musica['id'];
                href.textContent = musica[campo];
                td.appendChild(href);
                tr.appendChild(td);
            });
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('name', 'id');
            checkbox.setAttribute('id', 'id');
            checkbox.setAttribute('value', musica['id']);
            let td = document.createElement('td');
            td.appendChild(checkbox);
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
    }
    catch (error) {
        console.error('Erro ao buscar a lista de músicas:', error);
        // talvez exibir uma mensagem de erro para o usuário
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
            console.log('Músicas excluídas com sucesso!');
        }
        else {
            alert('Erro ao excluir músicas!');
            console.error('Erro ao excluir músicas:', response.status);
        }
    }
    catch (error) {
        // Talvez mensagem melhor de erro ao usuário
        console.error('Erro ao enviar dados para o backend:', error);
    }
    finally {
        exibeListaDeMusicas(); // Atualiza a lista de músicas após a exclusão
    }
};
//# sourceMappingURL=script.js.map