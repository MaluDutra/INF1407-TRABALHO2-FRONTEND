// Tipos compartilhados pelo projeto.
// Ajuste os campos aqui assim que o backend (Django) estiver definido,
// pra manter o front e o back em sincronia.
//
// O campo `usuario` continua existindo aqui de propósito: quando a
// gerência de usuário (login) for integrada, cada música vai pertencer
// a um usuário. Por enquanto, sem login, esse campo só fica com um
// valor fixo (veja mock-api.ts).

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