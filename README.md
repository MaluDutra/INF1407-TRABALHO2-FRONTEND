# SongList — Frontend

Trabalho 2 de **INF1407 – Programação para Web** (PUC-Rio, 2026/1).
Interface web em HTML + CSS + TypeScript que consome a API REST do backend [INF1407-TRABALHO2-BACKEND](https://github.com/MaluDutra/INF1407-TRABALHO2-BACKEND).

## Autoria

- Érica Régnier
- Maria Luiza Dutra

## Descrição do projeto

O **SongList** é um catálogo colaborativo de músicas. Este repositório contém o frontend da aplicação: um site estático em HTML/CSS/TypeScript que consome os endpoints REST do backend.

A página inicial exibe a lista pública de músicas para qualquer visitante. Usuários autenticados ganham acesso ao botão de inserção de novas músicas, e — esta é a diferença importante por usuário — os botões de **atualizar** e **remover** aparecem apenas nas linhas das músicas que o próprio usuário criou. Assim, cada usuário vê a mesma lista, mas tem ações disponíveis somente sobre o próprio acervo.

O fluxo completo de autenticação (cadastro, login, logout, troca de senha e recuperação de senha por código) está implementado em páginas dedicadas dentro de `accounts/`. O cabeçalho dinâmico também exibe o nome do usuário logado.

Todo o código JavaScript é gerado a partir de TypeScript, conforme exigido pelo enunciado.

## Links

- **Site em produção:** <https://maludutra.github.io/INF1407-TRABALHO2-FRONTEND/>
- **Repositório do backend:** <https://github.com/MaluDutra/INF1407-TRABALHO2-BACKEND>
- **API consumida:** <https://inf1407-backend.onrender.com/>

## Tecnologias

- HTML5
- CSS3
- TypeScript (compilado para JavaScript ES2018 módulos ESM)
- Fetch API para comunicação com o backend
- JWT armazenado no `localStorage` para autenticação
- Hospedagem via GitHub Pages

## Instalação local

### Pré-requisitos

- Node.js + npm (para o compilador TypeScript)
- Python 3 (para servir os arquivos estáticos)

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/MaluDutra/INF1407-TRABALHO2-FRONTEND.git
cd INF1407-TRABALHO2-FRONTEND

# 2. Instalar o TypeScript globalmente (se ainda não tiver)
npm install -g typescript

# 3. Compilar os arquivos TypeScript
cd typescript
tsc                  # compila uma vez
# ou
tsc -w               # compila e fica observando mudanças
cd ..

# 4. Subir um servidor HTTP estático servindo a pasta public
cd public
python3 -m http.server 8080
```

O site fica disponível em <http://localhost:8080/>.

### Configurar o endereço do backend

O endereço da API é definido em `typescript/constantes.ts`:

```typescript
export const backendAddress = 'https://inf1407-backend.onrender.com/';
```

Para apontar para um backend local, troque para `'http://localhost:8000/'` (ou para a URL pública do Codespace) e recompile o TypeScript.

## Estrutura do projeto

```
INF1407-TRABALHO2-FRONTEND/
├── public/                       # Arquivos servidos pelo GitHub Pages
│   ├── index.html                # Página principal (lista de músicas)
│   ├── cabecalho.html            # Cabeçalho compartilhado (iframe)
│   ├── insereMusica.html         # Formulário de inserção
│   ├── update.html               # Formulário de edição
│   ├── accounts/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── passwordChange.html
│   │   ├── passwordReset.html
│   │   └── passwordResetDone.html
│   ├── css/                      # Folhas de estilo
│   ├── img/                      # Ícones (olho, atualizar)
│   └── javascript/               # JS gerado pelo tsc (não editar)
├── typescript/                   # Código-fonte TypeScript
│   ├── constantes.ts             # URL do backend e helpers
│   ├── cabecalho.ts              # Lógica do cabeçalho dinâmico
│   ├── script.ts                 # Listagem, autorização por linha e remoção
│   ├── insereMusica.ts
│   ├── update.ts
│   ├── accounts/
│   │   ├── common.ts             # authFetch, refresh de token e olhinho de senha
│   │   ├── login.ts
│   │   ├── register.ts
│   │   ├── passwordChange.ts
│   │   ├── passwordReset.ts
│   │   └── passwordResetDone.ts
│   └── tsconfig.json
└── tsconfig.json
```

A pasta `typescript/` é o código-fonte. O compilador gera os `.js` correspondentes em `public/javascript/`, que é o que efetivamente roda no navegador.

## Manual do usuário

### Visitante (sem login)

Ao abrir o site, qualquer visitante vê a lista de músicas cadastradas, com os campos **Título**, **Artista**, **Álbum** e **Ano**. Os botões de ação (Insere / Remove) ficam ocultos e nenhuma coluna de ações é exibida.

### Cadastro de usuário

Pelo link **Entrar** no cabeçalho, escolha **Cadastre-se aqui**. Preencha username, email e senha (mínimo de 8 caracteres, não pode ser somente numérica nem muito comum). Após o cadastro, você é redirecionado para a tela de login.

### Login

Informe username e senha. Em caso de sucesso, os tokens JWT (acesso e refresh) são armazenados no `localStorage` e você é redirecionado para a página principal, agora com permissões de usuário autenticado. O cabeçalho passa a mostrar seu nome de usuário.

### Usuário autenticado

Com o login feito, a lista de músicas passa a exibir duas colunas adicionais — **Atualiza** e **Remove** — mas as ações dentro delas aparecem **somente nas linhas das músicas que você mesmo criou**:

- Para músicas suas, aparece o botão de atualizar e a checkbox de remoção.
- Para músicas de outros usuários (ou do acervo público inicial), as células correspondentes ficam vazias.

Os botões globais **Insere** (vai para o formulário de criação) e **Remove** (apaga as músicas selecionadas via checkbox) aparecem sempre que o usuário está logado.

O cabeçalho passa a mostrar o username, um botão **Troca senha** e um botão **Sair**.

### Troca de senha

Acessível pelo cabeçalho quando logado. Pede a senha atual, a nova senha e a confirmação. Após a troca, os tokens são invalidados e o usuário é redirecionado para a tela de login.

### Recuperação de senha

Na tela de login, clique em **Esqueci minha senha**. Informe seu email e um código de recuperação é gerado pelo backend. Na tela seguinte (`passwordResetDone.html`), informe esse código e a nova senha para concluir o processo.

> Como o backend em produção não tem SMTP configurado, o código é visível apenas no console do Render. Veja a seção "O que não funcionou" abaixo.

## Capturas de tela

### Página inicial — visitante

![Lista pública de músicas](docs/visitante.png)

### Página inicial — usuário autenticado

![Lista com ações disponíveis nas músicas do usuário](docs/logado.png)

### Tela de login

![Tela de login](docs/login.png)

## O que funcionou

- Listagem pública das músicas em `index.html`
- Cadastro de novo usuário
- Login com JWT, armazenando access e refresh tokens no `localStorage`
- Renovação automática do token de acesso quando expirado (via `authFetch`)
- Logout limpando os tokens e redirecionando para a página inicial
- Cabeçalho dinâmico, mostrando o nome do usuário logado ou "visitante!"
- **Visões diferentes por usuário:** as ações de atualizar e remover aparecem apenas nas linhas das músicas criadas pelo usuário autenticado
- Inserção de novas músicas (página `insereMusica.html`)
- Edição de músicas existentes (página `update.html`) com tratamento de erro 403 caso a música não pertença ao usuário
- Remoção em lote de músicas selecionadas via checkbox
- Troca de senha do usuário autenticado
- Solicitação de recuperação de senha (geração do código)
- Confirmação de recuperação com código + nova senha
- Mostrar/ocultar senha nos formulários com o ícone de olho
- Deploy no GitHub Pages com `basePath` ajustando automaticamente entre desenvolvimento local e produção

## O que não funcionou

- **Envio real de email de recuperação de senha em produção.** O backend hospedado no Render não tem SMTP configurado, então o email não chega. Como contorno, o código de recuperação aparece no console do Render — o usuário precisa pegar o código por lá para concluir o fluxo de recuperação.
