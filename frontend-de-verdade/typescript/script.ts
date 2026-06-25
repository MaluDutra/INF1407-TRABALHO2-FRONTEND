// scripts.ts
import { backendAddress } from './constantes.js';

onload = function () {
    exibeListaDeMusicas(); // exibe lista de musicas ao carregar a página
}

async function exibeListaDeMusicas() {
    try {
        const response = await fetch(backendAddress + 'variasmusicas/');

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
                td.textContent = musica[campo];
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar a lista de músicas:', error);
        // talvez exibir uma mensagem de erro para o usuário
    }
}
