// scripts.ts
import { backendAddress, getBasePath } from './constantes.js';
import { authFetch } from './accounts/common.js';

/**
 * Inicializa a página assim que o carregamento do conteúdo é concluído.
 * Descobre o usuário logado (se houver), configura os botões de
 * autenticação e desenha a lista de músicas com base nessa identidade.
 */
onload = async function () {
    const userId = await obtemIdDoUsuarioLogado();
    configuraBotoesAutenticacao(userId !== null);
    exibeListaDeMusicas(userId);
};

/**
 * Tenta obter o ID do usuário autenticado a partir do endpoint /whoami/.
 *
 * @returns o ID do usuário se autenticado, ou null se for visitante.
 */
async function obtemIdDoUsuarioLogado(): Promise<number | null> {
    const response = await authFetch(backendAddress + 'gerenciamento/whoami/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.id ?? null;
}

/**
 * Exibe os controles de inserção e remoção apenas para usuários autenticados.
 *
 * @param estaAutenticado verdadeiro se o usuário está logado.
 */
function configuraBotoesAutenticacao(estaAutenticado: boolean) {
    const divAcoes = document.getElementById('acoesAutenticadas') as HTMLDivElement;
    const colunaRemove = document.getElementById('colunaRemove') as HTMLTableCellElement;
    const colunaAtualiza = document.getElementById('colunaAtualiza') as HTMLTableCellElement;
    const mensagemAcesso = document.getElementById('mensagemAcesso') as HTMLParagraphElement;

    if (estaAutenticado) {
        // Exibe os controles de ação apenas para usuários autenticados
        divAcoes.classList.remove('invisivel');
        divAcoes.classList.add('visivel');
        colunaRemove.classList.remove('invisivel');
        colunaRemove.classList.add('visivel');
        colunaAtualiza.classList.remove('invisivel');
        colunaAtualiza.classList.add('visivel');
        mensagemAcesso.classList.remove('visivel');
        mensagemAcesso.classList.add('invisivel');
        (document.getElementById('insere') as HTMLButtonElement).addEventListener('click', () => {
            location.href = getBasePath() + 'insereMusica.html';
        });
        (document.getElementById('remove') as HTMLButtonElement).addEventListener('click', apagaMusicas);
    } else {
        divAcoes.classList.remove('visivel');
        divAcoes.classList.add('invisivel');
        colunaRemove.classList.remove('visivel');
        colunaRemove.classList.add('invisivel');
        colunaAtualiza.classList.remove('visivel');
        colunaAtualiza.classList.add('invisivel');
        mensagemAcesso.classList.remove('invisivel');
        mensagemAcesso.classList.add('visivel');
    }
}

/**
 * Busca todas as músicas do backend e renderiza a tabela de resultados.
 *
 * O botão de atualizar e a checkbox de remover só são renderizados para
 * cada música cujo `criador` coincide com o `userId` informado. Visitantes
 * ou músicas sem criador (acervo público) ficam apenas com texto.
 *
 * @param userId ID do usuário autenticado, ou null se for visitante.
 */
async function exibeListaDeMusicas(userId: number | null) {
    try {
        const response = await fetch(backendAddress + 'SongList/variasmusicas/');

        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }

        const musicas = await response.json();
        const campos = ['titulo', 'artista', 'album', 'ano'];
        const tbody = document.getElementById('idtbody') as HTMLTableSectionElement;

        // Remove linhas existentes antes de desenhar a tabela novamente
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        musicas.forEach((musica: any) => {
            const tr = document.createElement('tr');

            campos.forEach(campo => {
                const td = document.createElement('td') as HTMLTableCellElement;
                td.textContent = musica[campo];
                tr.appendChild(td);
            });

            // Só renderiza ações na música se o usuário logado for o criador dela
            const ehDono = userId !== null && musica.criador === userId;

            if (ehDono) {
                const tdUpdate = document.createElement('td') as HTMLTableCellElement;
                const botao = document.createElement('button') as HTMLButtonElement;
                botao.type = 'button';
                const img = document.createElement('img') as HTMLImageElement;
                img.src = 'img/atualiza.png';
                img.alt = 'Atualizar';
                botao.appendChild(img);
                botao.classList.add('btnAtualizar');
                botao.addEventListener('click', () => {
                    location.href = getBasePath() + 'update.html?id=' + musica['id'];
                });
                tdUpdate.appendChild(botao);
                tr.appendChild(tdUpdate);

                const tdCheck = document.createElement('td') as HTMLTableCellElement;
                const checkbox = document.createElement('input') as HTMLInputElement;
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('name', 'id');
                checkbox.setAttribute('value', musica['id']);
                tdCheck.appendChild(checkbox);
                tr.appendChild(tdCheck);
            } else if (userId !== null) {
                // Usuário logado, mas não é dono da música:
                // mantém as células vazias para preservar o alinhamento das colunas.
                tr.appendChild(document.createElement('td'));
                tr.appendChild(document.createElement('td'));
            }

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar a lista de músicas:', error);
    }
}

/**
 * Exclui as músicas selecionadas na tabela e atualiza a lista em seguida.
 * O backend recebe um array de IDs e remove apenas as que pertencem ao
 * próprio usuário.
 */
let apagaMusicas = async (evento: Event) => {
    evento.preventDefault();
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="id"]:checked');
    const checkedValues: string[] = [];
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
        } else {
            alert('Erro ao excluir músicas!');
            console.error('Erro ao excluir músicas:', response.status);
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
    } finally {
        // Recarrega a lista após a operação. Como precisamos da identidade
        // do usuário para decidir o que renderizar, buscamos o ID novamente.
        const userId = await obtemIdDoUsuarioLogado();
        exibeListaDeMusicas(userId);
    }
};
