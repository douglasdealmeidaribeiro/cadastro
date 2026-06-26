# Sistema de Gerenciamento de Funcionários

Aplicação web moderna para cadastrar, listar, buscar, editar e remover funcionários. Ela converte o CRUD original de terminal em Python para uma arquitetura web com front-end estático em React e back-end separado em Node.js, mantendo a string do MongoDB fora do navegador.

## Arquitetura

- `frontend/`: React + Vite, preparado para GitHub Pages.
- `backend/`: Node.js + Express + Mongoose, responsável por falar com o MongoDB Atlas.
- `MongoDB Atlas`: banco persistente dos funcionários.

O GitHub Pages hospeda apenas arquivos estáticos. Por isso, o back-end precisa ficar em um serviço próprio, como Render, Railway ou Vercel.

## Funcionalidades

- Cadastrar funcionário.
- Listar funcionários cadastrados.
- Buscar por ID do MongoDB ou nome.
- Editar funcionário preenchendo o formulário com os dados atuais.
- Remover funcionário.
- Exibir mensagens de sucesso e erro.
- Validar campos obrigatórios.
- Formatar salário em reais.
- Layout responsivo para desktop e celular.

## Modelo de Dados

```js
{
  nome: String,
  cidade: String,
  estado: String,
  idade: Number,
  escolaridade: String,
  cargo: String,
  salario: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Como Rodar Localmente

### 1. Back-end

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Configure o arquivo `backend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/cadastro-funcionarios
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

A API ficará em:

```text
http://localhost:3000
```

### 2. Front-end

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Configure o arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_BASE_PATH=/cadastro/
```

O Vite mostrará a URL local, normalmente:

```text
http://localhost:5173
```

## Build

```bash
cd frontend
npm run build
npm run preview
```

## MongoDB Atlas

1. Acesse o MongoDB Atlas e crie uma conta ou entre na sua conta.
2. Crie um cluster.
3. Em `Database Access`, crie um usuário de banco com senha forte.
4. Em `Network Access`, libere o IP do ambiente de deploy. Para teste, é comum liberar `0.0.0.0/0`, mas em produção prefira restringir.
5. Clique em `Connect` e copie a connection string.
6. Substitua usuário, senha e nome do banco na string.
7. Configure a variável `MONGODB_URI` no arquivo `.env` local e no serviço de deploy.
8. Rode o back-end e acesse `GET /api/health` para confirmar que a API iniciou.

## Endpoints da API

Base local:

```text
http://localhost:3000/api
```

### `GET /api/funcionarios`

Retorna todos os funcionários.

### `GET /api/funcionarios/:id`

Retorna um funcionário pelo ID do MongoDB.

### `POST /api/funcionarios`

Cadastra um funcionário.

```json
{
  "nome": "Ana Silva",
  "cidade": "São Paulo",
  "estado": "SP",
  "idade": 32,
  "escolaridade": "Superior completo",
  "cargo": "Analista",
  "salario": 5800
}
```

### `PUT /api/funcionarios/:id`

Atualiza todos os dados de um funcionário.

### `DELETE /api/funcionarios/:id`

Remove um funcionário.

## Deploy do Back-end

### Render

1. Suba este projeto para o GitHub.
2. No Render, crie um novo `Web Service`.
3. Selecione o repositório.
4. Configure:
   - `Root Directory`: `backend`
   - `Build Command`: `npm install`
   - `Start Command`: `npm start`
5. Adicione as variáveis de ambiente:
   - `MONGODB_URI`: connection string do MongoDB Atlas.
   - `CORS_ORIGIN`: URL do GitHub Pages, por exemplo `https://seu-usuario.github.io/cadastro`.
   - `PORT`: `3000`, se o serviço exigir.
6. Faça o deploy e copie a URL pública da API.

O arquivo `backend/render.yaml` também está incluído como configuração simples para Render.

## Deploy do Front-end no GitHub Pages

1. Em `frontend/.env`, defina:

```env
VITE_API_URL=https://sua-api.onrender.com
VITE_BASE_PATH=/nome-do-repositorio/
```

2. Ajuste `VITE_BASE_PATH` para o nome real do repositório no GitHub Pages.
3. Instale as dependências e publique:

```bash
cd frontend
npm install
npm run deploy
```

4. No GitHub, configure Pages para servir a branch criada pelo `gh-pages`.

## Scripts

### Front-end

```bash
npm run dev
npm run build
npm run preview
npm run deploy
```

### Back-end

```bash
npm run dev
npm start
```

## Segurança

- Nunca coloque `MONGODB_URI` no front-end.
- O front-end usa apenas `VITE_API_URL`.
- O back-end controla o acesso ao Atlas e valida IDs antes de buscar, editar ou remover registros.
- Configure `CORS_ORIGIN` com a URL final do GitHub Pages em produção.
