import { apiRequest, ApiError } from "./api.js";
import { renderNav } from "./nav.js";
renderNav("nav");
const parametros = new URLSearchParams(window.location.search);
const musicaId = parametros.get("id");
const tituloPagina = document.getElementById("titulo-pagina");
const form = document.getElementById("form-musica");
const mensagemErro = document.getElementById("mensagem-erro");
const campoTitulo = document.getElementById("titulo");
const campoArtista = document.getElementById("artista");
const campoAlbum = document.getElementById("album");
const campoGenero = document.getElementById("genero");
const campoAno = document.getElementById("ano");
const campoImagem = document.getElementById("imagem-url");
const campoLink = document.getElementById("link");
if (musicaId) {
    tituloPagina.textContent = "Editar música";
    void carregarMusicaExistente(Number(musicaId));
}
else {
    tituloPagina.textContent = "Adicionar música";
}
async function carregarMusicaExistente(id) {
    var _a, _b, _c, _d;
    try {
        const musica = await apiRequest(`/musicas/${id}/`, "GET");
        campoTitulo.value = musica.titulo;
        campoArtista.value = musica.artista;
        campoAlbum.value = (_a = musica.album) !== null && _a !== void 0 ? _a : "";
        campoGenero.value = (_b = musica.genero) !== null && _b !== void 0 ? _b : "";
        campoAno.value = musica.ano_lancamento ? String(musica.ano_lancamento) : "";
        campoImagem.value = (_c = musica.imagem_url) !== null && _c !== void 0 ? _c : "";
        campoLink.value = (_d = musica.link) !== null && _d !== void 0 ? _d : "";
    }
    catch (_e) {
        mensagemErro.textContent = "Não foi possível carregar os dados dessa música.";
    }
}
function limparMensagemErro() {
    mensagemErro.textContent = "";
}
form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limparMensagemErro();
    const dados = {
        titulo: campoTitulo.value.trim(),
        artista: campoArtista.value.trim(),
        album: campoAlbum.value.trim() || null,
        genero: campoGenero.value.trim() || null,
        ano_lancamento: campoAno.value ? Number(campoAno.value) : null,
        imagem_url: campoImagem.value.trim() || null,
        link: campoLink.value.trim() || null,
    };
    if (!dados.titulo || !dados.artista) {
        mensagemErro.textContent = "Título e artista são obrigatórios.";
        return;
    }
    void (async () => {
        try {
            if (musicaId) {
                await apiRequest(`/musicas/${musicaId}/`, "PUT", dados);
            }
            else {
                await apiRequest("/musicas/", "POST", dados);
            }
            window.location.href = "musicas.html";
        }
        catch (erro) {
            if (erro instanceof ApiError) {
                mensagemErro.textContent = erro.message;
            }
            else {
                mensagemErro.textContent = "Erro ao salvar a música. Verifique os dados e tente novamente.";
            }
        }
    })();
});
//# sourceMappingURL=musica-form.js.map