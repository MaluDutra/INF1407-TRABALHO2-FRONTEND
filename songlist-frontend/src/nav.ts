// Menu de navegação simples — sem login por enquanto.
// A dupla que está cuidando da gerência de usuário pode trocar este
// arquivo depois para mostrar itens diferentes conforme o usuário
// esteja logado ou não.

interface ItemMenu {
  texto: string;
  href: string;
}

function criarLink(item: ItemMenu): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = item.href;
  link.textContent = item.texto;
  return link;
}

export function renderNav(idContainer: string): void {
  const nav = document.getElementById(idContainer);
  if (!nav) return;

  while (nav.firstChild) {
    nav.removeChild(nav.firstChild);
  }

  const itens: ItemMenu[] = [
    { texto: "Início", href: "index.html" },
    { texto: "Músicas", href: "musicas.html" },
    { texto: "Adicionar música", href: "musica-form.html" },
  ];

  itens.forEach((item) => {
    nav.appendChild(criarLink(item));
  });
}