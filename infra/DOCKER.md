# 🐳 Executando o Projeto com Docker

Este guia explica como executar a aplicação React/Vite usando Docker, sem necessidade de instalar Node.js ou NPM localmente.

## Pré-requisitos

- **Docker Desktop** instalado ([Download](https://www.docker.com/products/docker-desktop/))
- Arquivo `.env.local` configurado com sua chave da API Gemini

## Comandos Principais

### 1. Iniciar a Aplicação (Primeira Vez)

```bash
cd infra
docker-compose up --build
```

Este comando irá:

- Construir a imagem Docker com Node.js 20
- Instalar todas as dependências dentro do container
- Iniciar o servidor de desenvolvimento Vite na porta 3000

**Acesse:** http://localhost:3000

### 2. Iniciar a Aplicação (Uso Regular)

Após a primeira execução, use apenas:

```bash
cd infra
docker-compose up
```

### 3. Parar a Aplicação

Pressione `Ctrl + C` no terminal ou execute:

```bash
cd infra
docker-compose down
```

### 4. Reconstruir (Após Mudanças no package.json)

Se você adicionar ou remover dependências:

```bash
cd infra
docker-compose down
docker-compose up --build
```

### 5. Ver Logs

```bash
cd infra
docker-compose logs -f app
```

### 6. Executar Comandos Dentro do Container

Para executar comandos NPM ou scripts:

```bash
cd infra
docker-compose exec app npm run build
docker-compose exec app npm install <pacote>
```

## Estrutura dos Arquivos Docker

Todos os arquivos Docker estão organizados na pasta `infra/`:

- **infra/Dockerfile**: Define como a imagem é construída (Node 20 Alpine)
- **infra/docker-compose.yml**: Orquestra o container com volumes e variáveis de ambiente
- **infra/.dockerignore**: Exclui arquivos desnecessários do build (otimização)

## Hot Reload

O código local está montado como volume no container. Qualquer alteração nos arquivos `.tsx`, `.ts`, `.css` será detectada automaticamente pelo Vite, sem necessidade de reiniciar o container.

## Variáveis de Ambiente

O Docker Compose carrega automaticamente as variáveis do arquivo `.env.local`. Certifique-se de que ele contém:

```
GEMINI_API_KEY=sua_chave_aqui
```

## Solução de Problemas

### Porta 3000 já está em uso

Edite `docker-compose.yml` e altere a porta:

```yaml
ports:
  - "8080:3000" # Acesse via localhost:8080
```

### Mudanças no código não refletem

Execute:

```bash
cd infra
docker-compose restart
```

### Limpar tudo e recomeçar

```bash
cd infra
docker-compose down -v
docker-compose up --build
```

O parâmetro `-v` remove os volumes (incluindo node_modules).

## Produção (Build)

Para gerar a versão otimizada:

```bash
cd infra
docker-compose exec app npm run build
```

Os arquivos otimizados estarão em `./dist`.
