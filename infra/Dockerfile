# Imagem base oficial do Node.js LTS
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (otimização de cache)
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia todo o código do projeto
COPY . .

# Expõe a porta configurada no Vite (3000)
EXPOSE 3000

# Comando padrão: executar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
