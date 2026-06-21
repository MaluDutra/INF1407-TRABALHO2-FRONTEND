// API FALSA — só pra testar o CRUD de músicas sem precisar do backend
// Django pronto. Tudo é guardado no localStorage do navegador.
// Quando o backend de verdade estiver no ar, é só apagar este arquivo
// e desligar o MOCK_MODE em api.ts.
//
// Sem login por enquanto: toda música criada aqui recebe um `usuario`
// fixo (USUARIO_PADRAO). Quando a gerência de usuário for integrada
// pela dupla, esse valor deve vir do usuário realmente logado.

import { ApiError } from "./api.js";
import { Musica } from "./types.js";

const USUARIO_PADRAO = 1;
const CHAVE_MUSICAS = "mock_musicas";
const CHAVE_PROXIMO_ID = "mock_proximo_id_musica";

function lerMusicas(): Musica[] {
  const bruto = localStorage.getItem(CHAVE_MUSICAS);
  return bruto ? (JSON.parse(bruto) as Musica[]) : [];
}

function salvarMusicas(musicas: Musica[]): void {
  localStorage.setItem(CHAVE_MUSICAS, JSON.stringify(musicas));
}

function proximoId(): number {
  const atual = Number(localStorage.getItem(CHAVE_PROXIMO_ID) ?? "1");
  localStorage.setItem(CHAVE_PROXIMO_ID, String(atual + 1));
  return atual;
}

// Simula uma latência de rede bem pequena, pra parecer real.
function atraso(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockRequest<T>(
  caminho: string,
  metodo: string,
  corpo?: unknown
): Promise<T> {
  await atraso();
  const dados = (corpo ?? {}) as Record<string, any>;

  // ---- LISTAR / CRIAR ----
  if (caminho === "/musicas/" && metodo === "GET") {
    return lerMusicas() as T;
  }

  if (caminho === "/musicas/" && metodo === "POST") {
    const musicas = lerMusicas();
    const nova: Musica = {
      id: proximoId(),
      titulo: dados.titulo,
      artista: dados.artista,
      album: dados.album ?? null,
      genero: dados.genero ?? null,
      ano_lancamento: dados.ano_lancamento ?? null,
      imagem_url: dados.imagem_url ?? null,
      link: dados.link ?? null,
      usuario: USUARIO_PADRAO,
    };
    musicas.push(nova);
    salvarMusicas(musicas);
    return nova as T;
  }

  // ---- DETALHE / EDITAR / EXCLUIR ----
  const matchMusica = caminho.match(/^\/musicas\/(\d+)\/$/);
  if (matchMusica) {
    const id = Number(matchMusica[1]);
    const musicas = lerMusicas();
    const indice = musicas.findIndex((m) => m.id === id);

    if (metodo === "GET") {
      if (indice === -1) throw new ApiError(404, "Música não encontrada.");
      return musicas[indice] as T;
    }

    if (metodo === "PUT" || metodo === "PATCH") {
      if (indice === -1) throw new ApiError(404, "Música não encontrada.");
      musicas[indice] = { ...musicas[indice], ...dados, id, usuario: USUARIO_PADRAO };
      salvarMusicas(musicas);
      return musicas[indice] as T;
    }

    if (metodo === "DELETE") {
      if (indice === -1) throw new ApiError(404, "Música não encontrada.");
      musicas.splice(indice, 1);
      salvarMusicas(musicas);
      return undefined as T;
    }
  }

  throw new ApiError(404, `Rota mock não implementada: ${metodo} ${caminho}`);
}