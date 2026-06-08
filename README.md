# DLEBuilder

Sistema para criação de jogos de adivinhação inspirados no Loldle, porém totalmente configurável para qualquer tema.

O administrador define:

* Categorias
* Entidades
* Atributos
* Modos de jogo
* Dicas
* Imagens
* Áudios

permitindo criar jogos para qualquer universo, como:

* League of Legends
* Pokémon
* One Piece
* Filmes
* Séries
* Carros
* Países
* Livros

---

# Estrutura Principal

## Backend

```text
src
├── controllers
├── middlewares
├── models
├── routes
├── services
│   ├── modes
│   ├── comparators.js
│   └── game.service.js
├── utils
├── app.js
└── server.js
```

### Controllers

Responsáveis por receber requisições HTTP e delegar regras para os serviços.

### Services

Responsáveis pela lógica de negócio.

### Models

Estrutura dos dados no MongoDB.

### Routes

Mapeamento dos endpoints da API.

### Middlewares

Autenticação JWT e upload de arquivos.

---

## Frontend

```text
src
├── components
├── pages
├── services
├── routes
├── hooks
├── layouts
└── api.js
```

### Components

Componentes reutilizáveis.

### Pages

Telas do sistema.

### Services

Comunicação com a API.

---

# Exemplo Prático

Categoria:

```json
{
  "name": "lol",
  "displayName": "League of Legends"
}
```

Entidade:

```json
{
  "name": "Ahri",
  "attributes": {
    "gender": "Feminino",
    "releaseYear": 2011,
    "positions": ["Mid"]
  }
}
```

Modo Splash:

```json
{
  "title": "Classic",
  "image": "https://..."
}
```

Modo Áudio:

```json
{
  "title": "Charm",
  "audio": "/uploads/audio/charm.mp3"
}
```

---

# Diagrama da Arquitetura

```text
┌─────────────┐
│ React Front │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│ Express API │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │
└─────────────┘
```

Fluxo de dependência:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

---

# Autenticação

A autenticação administrativa utiliza JWT.

Fluxo:

```text
Admin Login
      ↓
JWT Token
      ↓
Authorization: Bearer TOKEN
      ↓
adminAuth Middleware
      ↓
Rotas Protegidas
```

Endpoints protegidos:

* Criar categoria
* Atualizar categoria
* Excluir categoria
* Criar entidade
* Atualizar entidade
* Excluir entidade
* Upload de áudio

---

# Fluxo do Jogo

```text
Usuário escolhe categoria
          ↓
Usuário escolhe modo
          ↓
Sistema cria sessão
          ↓
Entidade aleatória é sorteada
          ↓
Usuário envia tentativa
          ↓
Sistema compara atributos
          ↓
Dicas são liberadas
          ↓
Jogador acerta
          ↓
Sessão finalizada
```

---

# Funcionalidades Atuais

## Administração

* Login JWT
* CRUD de Categorias
* CRUD de Entidades
* Upload de Áudio

## Sistema de Categorias

* Atributos dinâmicos
* Modos dinâmicos
* Dicas configuráveis

## Modos de Jogo

* Classic
* Splash
* Ability
* Emoji
* Quote
* Audio

## Comparadores

### Exact

```text
Valor igual → Correct
Valor diferente → Wrong
```

### Array

```text
Nenhuma correspondência → Wrong
Parcial → Partial
Completo → Correct
```

### Number

```text
Igual → Correct
Maior → Higher
Menor → Lower
```

---

# Configuração do Projeto

## Backend

Criar arquivo `.env`

```env
PORT=3000
MONGO_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm run dev
```

---

## Frontend

Criar arquivo `.env`

```env
VITE_API_URL=http://localhost:3000
```

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm run dev
```

---

# Regras do Sistema

## Categoria

Uma categoria define:

* atributos
* modos
* dicas

Toda entidade pertence a uma categoria.

---

## Entidade

Uma entidade precisa possuir:

```text
name
attributes
modeData
```

---

## Sessão

Uma sessão possui:

```text
playerId
categoryId
modeId
entityId
attempts
attemptCount
```

---

## Dicas

As dicas são liberadas conforme a quantidade de tentativas.

Exemplo:

```json
[
  {
    "modeId": "emoji",
    "attempts": 2
  },
  {
    "modeId": "quote",
    "attempts": 4
  }
]
```

---

# API

## Game

```http
POST /game/start
POST /game/guess
GET  /game/session/:id
GET  /game/category/:categoryId/modes
GET  /game/category/:categoryId/entities
```

## Categories

```http
GET    /category/:id/config
POST   /admin/category
PUT    /admin/category/:id
DELETE /admin/category/:id
```

## Entities

```http
POST   /admin/entity
GET    /admin/entity
GET    /admin/entity/:id
PATCH  /admin/entity/:id
DELETE /admin/entity/:id
```

## Upload

```http
POST /upload/audio
```

## Authentication

```http
POST /auth/login
```
