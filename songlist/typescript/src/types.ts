// Tipos compartilhados pelo projeto.
// O campo `usuario` continua aqui de propósito: quando a gerência de
// usuário for integrada pela dupla, cada música vai pertencer a um
// usuário real. Por enquanto o mock usa um valor fixo.

export interface Musica {
  id: number;
  titulo: string;
  artista: string;
  album?: string | null;
  genero?: string | null;
  ano_lancamento?: number | null;
  imagem_url?: string | null;
  link?: string | null;
  usuario: number;
}
