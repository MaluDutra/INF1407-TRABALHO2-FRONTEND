// API FALSA — simula o backend Django usando localStorage do navegador.
// Quando o backend estiver pronto, apague este arquivo e defina MOCK_MODE = false em api.ts.
//
// Sem login por enquanto: toda música criada recebe usuario = USUARIO_PADRAO.
// Quando a dupla integrar o login, esse valor deve vir do usuário autenticado.

import { ApiError } from "./api.js";
import type { Musica } from "./types.js";

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

function atraso(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockRequest<T>(
  caminho: string,
  metodo: string,
  corpo?: unknown
): Promise<T> {
  await atraso();
  const dados = (corpo ?? {}) as Record<string, unknown>;

  // ---- LISTAR / CRIAR ----
  if (caminho === "/musicas/" && metodo === "GET") {
    return lerMusicas() as T;
  }

  if (caminho === "/musicas/" && metodo === "POST") {
    const musicas = lerMusicas();
    const nova: Musica = {
      id: proximoId(),
      titulo: String(dados["titulo"] ?? ""),
      artista: String(dados["artista"] ?? ""),
      album: dados["album"] != null ? String(dados["album"]) : null,
      genero: dados["genero"] != null ? String(dados["genero"]) : null,
      ano_lancamento: dados["ano_lancamento"] != null ? Number(dados["ano_lancamento"]) : null,
      imagem_url: dados["imagem_url"] != null ? String(dados["imagem_url"]) : null,
      link: dados["link"] != null ? String(dados["link"]) : null,
      usuario: USUARIO_PADRAO,
    };
    musicas.push(nova);
    salvarMusicas(musicas);
    return nova as T;
  }

  // ---- DETALHE / EDITAR / EXCLUIR ----
  const matchMusica = caminho.match(/^\/musicas\/(\d+)\/$/);
  if (matchMusica) {
    const idStr = matchMusica[1];
    const id = Number(idStr);
    const musicas = lerMusicas();
    const indice = musicas.findIndex((m) => m.id === id);

    if (metodo === "GET") {
      if (indice === -1) throw new ApiError(404, "Música não encontrada.");
      return musicas[indice] as T;
    }

    if (metodo === "PUT" || metodo === "PATCH") {
      if (indice === -1) throw new ApiError(404, "Música não encontrada.");
      const atual = musicas[indice] as Musica;
      const atualizada: Musica = {
        id,
        titulo: String(dados["titulo"] ?? atual.titulo),
        artista: String(dados["artista"] ?? atual.artista),
        album: dados["album"] != null ? String(dados["album"]) : null,
        genero: dados["genero"] != null ? String(dados["genero"]) : null,
        ano_lancamento: dados["ano_lancamento"] != null ? Number(dados["ano_lancamento"]) : null,
        imagem_url: dados["imagem_url"] != null ? String(dados["imagem_url"]) : null,
        link: dados["link"] != null ? String(dados["link"]) : null,
        usuario: USUARIO_PADRAO,
      };
      musicas[indice] = atualizada;
      salvarMusicas(musicas);
      return atualizada as T;
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
