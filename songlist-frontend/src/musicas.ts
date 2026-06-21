import { apiRequest } from "./api.js";
import { renderNav } from "./nav.js";
import { Musica } from "./types.js";

renderNav("nav");

const lista = document.getElementById("lista-musicas") as HTMLDivElement;

function limparContainer(container: HTMLElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function criarCardMusica(musica: Musica): HTMLElement {
  const card = document.createElement("article");
  card.className = "card-musica";

  if (musica.imagem_url) {
    const imagem = document.createElement("img");
    imagem.src = musica.imagem_url;
    imagem.alt = `Capa de ${musica.titulo}`;
    card.appendChild(imagem);
  }

  const titulo = document.createElement("h3");
  titulo.textContent = musica.titulo;
  card.appendChild(titulo);

  const artista = document.createElement("p");
  artista.textContent = `Artista: ${musica.artista}`;
  card.appendChild(artista);

  if (musica.album) {
    const album = document.createElement("p");
    album.textContent = `Álbum: ${musica.album}`;
    card.appendChild(album);
  }

  if (musica.genero) {
    const genero = document.createElement("p");
    genero.textContent = `Gênero: ${musica.genero}`;
    card.appendChild(genero);
  }

  if (musica.ano_lancamento) {
    const ano = document.createElement("p");
    ano.textContent = `Ano: ${musica.ano_lancamento}`;
    card.appendChild(ano);
  }

  if (musica.link) {
    const link = document.createElement("a");
    link.href = musica.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ouvir";
    card.appendChild(link);
  }

  const acoes = document.createElement("div");
  acoes.className = "acoes-card";

  const botaoEditar = document.createElement("a");
  botaoEditar.href = `musica-form.html?id=${musica.id}`;
  botaoEditar.textContent = "Editar";
  botaoEditar.className = "botao";
  acoes.appendChild(botaoEditar);

  const botaoExcluir = document.createElement("button");
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.className = "botao botao-perigo";
  botaoExcluir.addEventListener("click", () => excluirMusica(musica));
  acoes.appendChild(botaoExcluir);

  card.appendChild(acoes);

  return card;
}

async function excluirMusica(musica: Musica): Promise<void> {
  const confirmar = window.confirm(`Excluir "${musica.titulo}"? Essa ação não pode ser desfeita.`);
  if (!confirmar) return;

  try {
    await apiRequest(`/musicas/${musica.id}/`, "DELETE");
    await carregarMusicas();
  } catch (erro) {
    window.alert("Não foi possível excluir a música. Tente novamente.");
  }
}

async function carregarMusicas(): Promise<void> {
  limparContainer(lista);

  const carregando = document.createElement("p");
  carregando.textContent = "Carregando músicas...";
  lista.appendChild(carregando);

  try {
    const musicas = await apiRequest<Musica[]>("/musicas/", "GET");
    limparContainer(lista);

    if (musicas.length === 0) {
      const vazio = document.createElement("p");
      vazio.textContent = "Você ainda não cadastrou nenhuma música. Que tal adicionar a primeira?";
      lista.appendChild(vazio);
      return;
    }

    musicas.forEach((musica) => {
      lista.appendChild(criarCardMusica(musica));
    });
  } catch (erro) {
    limparContainer(lista);
    const mensagemErro = document.createElement("p");
    mensagemErro.className = "erro";
    mensagemErro.textContent = "Não foi possível carregar suas músicas. Tente recarregar a página.";
    lista.appendChild(mensagemErro);
  }
}

carregarMusicas();
