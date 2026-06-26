import { apiRequest, ApiError } from "./api.js";
import { renderNav } from "./nav.js";
import type { Musica } from "./types.js";

renderNav("nav");

const parametros = new URLSearchParams(window.location.search);
const musicaId = parametros.get("id");

const tituloPagina = document.getElementById("titulo-pagina") as HTMLHeadingElement;
const form = document.getElementById("form-musica") as HTMLFormElement;
const mensagemErro = document.getElementById("mensagem-erro") as HTMLParagraphElement;

const campoTitulo = document.getElementById("titulo") as HTMLInputElement;
const campoArtista = document.getElementById("artista") as HTMLInputElement;
const campoAlbum = document.getElementById("album") as HTMLInputElement;
const campoGenero = document.getElementById("genero") as HTMLInputElement;
const campoAno = document.getElementById("ano") as HTMLInputElement;
const campoImagem = document.getElementById("imagem-url") as HTMLInputElement;
const campoLink = document.getElementById("link") as HTMLInputElement;

if (musicaId) {
  tituloPagina.textContent = "Editar música";
  void carregarMusicaExistente(Number(musicaId));
} else {
  tituloPagina.textContent = "Adicionar música";
}

async function carregarMusicaExistente(id: number): Promise<void> {
  try {
    const musica = await apiRequest<Musica>(`/musicas/${id}/`, "GET");
    campoTitulo.value = musica.titulo;
    campoArtista.value = musica.artista;
    campoAlbum.value = musica.album ?? "";
    campoGenero.value = musica.genero ?? "";
    campoAno.value = musica.ano_lancamento ? String(musica.ano_lancamento) : "";
    campoImagem.value = musica.imagem_url ?? "";
    campoLink.value = musica.link ?? "";
  } catch {
    mensagemErro.textContent = "Não foi possível carregar os dados dessa música.";
  }
}

function limparMensagemErro(): void {
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
      } else {
        await apiRequest("/musicas/", "POST", dados);
      }
      window.location.href = "musicas.html";
    } catch (erro) {
      if (erro instanceof ApiError) {
        mensagemErro.textContent = erro.message;
      } else {
        mensagemErro.textContent = "Erro ao salvar a música. Verifique os dados e tente novamente.";
      }
    }
  })();
});
