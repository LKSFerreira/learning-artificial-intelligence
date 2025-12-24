---
description: Gerador de Contexto de Inicialização
---

Atue como um Arquiteto de Software focado em Padronização de Projetos.
Sua tarefa é criar o arquivo `.agent/workflows/nova_demanda.md`.

Este arquivo serve como o "Ponto de Entrada" padrão para quando eu (usuário) iniciar uma nova sessão de chat com a IA para trabalhar neste projeto.

## Estrutura de Diretórios Padrão
Assuma que o projeto segue estritamente esta estrutura:
- `.agent/rules/agents.md` (Regras do Agente)
- `.metadocs/roadmap.md` (Planejamento)
- `.metadocs/escopo.md` (Definição do Produto)
- `README.md` (Visão Geral)

- Caso os diretórios não exista, crie-os.

## Conteúdo a Gerar

Crie um arquivo markdown contendo o seguinte prompt padronizado. Mantenha os placeholders genéricos para que funcionem em qualquer projeto (Python, Node, Rust, etc).

---
**Nome do Arquivo:** `.agent/workflows/nova_demanda.md`
**Conteúdo:**

```md
---
description: Template para carregar o contexto completo do projeto ao iniciar uma task
---

# 🚀 Inicialização de Contexto

Estou retomando o desenvolvimento deste projeto. Para garantir alinhamento total, execute os passos abaixo antes de escrevermos qualquer código.

## 1. Leitura de Documentação Obrigatória
Leia os seguintes arquivos de configuração e metadados para entender as regras e o estado atual:

1.  **Regras & Comportamento:** `.agent/rules/agents.md`
2.  **Planejamento Macro:** `.metadocs/roadmap.md`
3.  **Definição de Escopo:** `.metadocs/escopo.md`
4.  **Visão Geral:** `README.md`

## 2. Análise de Estrutura e Ferramentas
Analise a raiz do diretório para identificar a stack tecnológica (ex: procure por `pyproject.toml`, `package.json`, `go.mod`, `docker-compose.yaml`).

> **Ação:** Liste brevemente a estrutura de pastas principal do projeto e a stack identificada.

## 3. Verificação de Status
Com base na leitura do `.metadocs/roadmap.md` e do estado atual dos arquivos:

- **Qual é a próxima etapa pendente no roadmap?**
- **O que essa etapa envolve tecnicamente?**
- **Existe algum gap técnico ou dependência bloqueante?**

---

**🛑 AGUARDE:** Não gere código ainda. Apenas apresente o resumo do contexto e aguarde minha confirmação ou instruções específicas para a tarefa de hoje.