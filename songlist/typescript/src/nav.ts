// Menu de navegação. Sem login por enquanto.
// Quando a dupla integrar o login, este arquivo pode ser expandido
// para mostrar itens diferentes conforme o estado do usuário.

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
