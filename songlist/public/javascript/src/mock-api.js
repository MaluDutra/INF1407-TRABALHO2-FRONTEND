// API FALSA — simula o backend Django usando localStorage do navegador.
// Quando o backend estiver pronto, apague este arquivo e defina MOCK_MODE = false em api.ts.
//
// Sem login por enquanto: toda música criada recebe usuario = USUARIO_PADRAO.
// Quando a dupla integrar o login, esse valor deve vir do usuário autenticado.
import { ApiError } from "./api.js";
const USUARIO_PADRAO = 1;
const CHAVE_MUSICAS = "mock_musicas";
const CHAVE_PROXIMO_ID = "mock_proximo_id_musica";
function lerMusicas() {
    const bruto = localStorage.getItem(CHAVE_MUSICAS);
    return bruto ? JSON.parse(bruto) : [];
}
function salvarMusicas(musicas) {
    localStorage.setItem(CHAVE_MUSICAS, JSON.stringify(musicas));
}
function proximoId() {
    var _a;
    const atual = Number((_a = localStorage.getItem(CHAVE_PROXIMO_ID)) !== null && _a !== void 0 ? _a : "1");
    localStorage.setItem(CHAVE_PROXIMO_ID, String(atual + 1));
    return atual;
}
function atraso(ms = 250) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function mockRequest(caminho, metodo, corpo) {
    var _a, _b, _c, _d;
    await atraso();
    const dados = (corpo !== null && corpo !== void 0 ? corpo : {});
    // ---- LISTAR / CRIAR ----
    if (caminho === "/musicas/" && metodo === "GET") {
        return lerMusicas();
    }
    if (caminho === "/musicas/" && metodo === "POST") {
        const musicas = lerMusicas();
        const nova = {
            id: proximoId(),
            titulo: String((_a = dados["titulo"]) !== null && _a !== void 0 ? _a : ""),
            artista: String((_b = dados["artista"]) !== null && _b !== void 0 ? _b : ""),
            album: dados["album"] != null ? String(dados["album"]) : null,
            genero: dados["genero"] != null ? String(dados["genero"]) : null,
            ano_lancamento: dados["ano_lancamento"] != null ? Number(dados["ano_lancamento"]) : null,
            imagem_url: dados["imagem_url"] != null ? String(dados["imagem_url"]) : null,
            link: dados["link"] != null ? String(dados["link"]) : null,
            usuario: USUARIO_PADRAO,
        };
        musicas.push(nova);
        salvarMusicas(musicas);
        return nova;
    }
    // ---- DETALHE / EDITAR / EXCLUIR ----
    const matchMusica = caminho.match(/^\/musicas\/(\d+)\/$/);
    if (matchMusica) {
        const idStr = matchMusica[1];
        const id = Number(idStr);
        const musicas = lerMusicas();
        const indice = musicas.findIndex((m) => m.id === id);
        if (metodo === "GET") {
            if (indice === -1)
                throw new ApiError(404, "Música não encontrada.");
            return musicas[indice];
        }
        if (metodo === "PUT" || metodo === "PATCH") {
            if (indice === -1)
                throw new ApiError(404, "Música não encontrada.");
            const atual = musicas[indice];
            const atualizada = {
                id,
                titulo: String((_c = dados["titulo"]) !== null && _c !== void 0 ? _c : atual.titulo),
                artista: String((_d = dados["artista"]) !== null && _d !== void 0 ? _d : atual.artista),
                album: dados["album"] != null ? String(dados["album"]) : null,
                genero: dados["genero"] != null ? String(dados["genero"]) : null,
                ano_lancamento: dados["ano_lancamento"] != null ? Number(dados["ano_lancamento"]) : null,
                imagem_url: dados["imagem_url"] != null ? String(dados["imagem_url"]) : null,
                link: dados["link"] != null ? String(dados["link"]) : null,
                usuario: USUARIO_PADRAO,
            };
            musicas[indice] = atualizada;
            salvarMusicas(musicas);
            return atualizada;
        }
        if (metodo === "DELETE") {
            if (indice === -1)
                throw new ApiError(404, "Música não encontrada.");
            musicas.splice(indice, 1);
            salvarMusicas(musicas);
            return undefined;
        }
    }
    throw new ApiError(404, `Rota mock não implementada: ${metodo} ${caminho}`);
}
//# sourceMappingURL=mock-api.js.map