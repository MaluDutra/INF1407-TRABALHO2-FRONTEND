# Contrato de API esperado pelo frontend

Este documento descreve os endpoints que o frontend espera do backend Django.
Sirva-se dele como referência ao construir o backend (e ajuste o frontend se o
backend definir nomes diferentes).

Base URL configurada em `src/api.ts`: `http://127.0.0.1:8000/api`

Autenticação: Token no header `Authorization: Token <token>` (ex: DRF TokenAuthentication).

## Usuário / autenticação

| Método | Rota              | Auth | Descrição                                  |
|--------|-------------------|------|---------------------------------------------|
| POST   | /login/            | não  | `{username, password}` → `{token, user_id, username}` |
| POST   | /usuarios/         | não  | Cadastro: `{username, email, password}`      |
| GET    | /perfil/           | sim  | Retorna dados do usuário logado               |
| PATCH  | /perfil/           | sim  | Atualiza `{username, email, foto_perfil, musica_favorita}` |
| POST   | /trocar-senha/     | sim  | `{senha_atual, senha_nova}`                    |
| POST   | /esqueci-senha/    | não  | `{email}` → dispara e-mail com link/token       |
| POST   | /redefinir-senha/  | não  | `{token, senha_nova}`                            |

## Músicas (CRUD)

| Método | Rota             | Auth | Descrição                                  |
|--------|------------------|------|---------------------------------------------|
| GET    | /musicas/         | sim  | Lista apenas as músicas do usuário logado     |
| POST   | /musicas/         | sim  | Cria música: `{titulo, artista, album, genero, ano_lancamento, imagem_url, link}` |
| GET    | /musicas/{id}/    | sim  | Detalhe de uma música                          |
| PUT    | /musicas/{id}/    | sim  | Atualiza uma música                             |
| DELETE | /musicas/{id}/    | sim  | Remove uma música                                |

Observação: o backend deve garantir que cada usuário só veja/edite/remova as
próprias músicas (visões diferentes por usuário, conforme exigido no enunciado).
