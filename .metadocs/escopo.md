# Escopo do Projeto

> Definição do produto e seus limites.

## Visão Geral

**Aprendendo Inteligência Artificial (Plataforma)** — Mais do que um repositório, uma plataforma web interativa, gamificada e didática para ensinar IA. O foco mudou de "meu aprendizado pessoal" para "ensinar o mundo através da prática".

## Identidade do Produto

- **Nome:** Learning Artificial Intelligence (Aprendendo IA)
- **Slogan:** "Do zero ao infinito: A IA explicada, jogada e codada."
- **Estilo:** Visualmente rico, interativo, com micro-animações e feedback imediato.
- **Diferencial:** Rigor acadêmico + Experiência de Jogo (Gamefeel).

## Funcionalidades Principais (In-Scope)

### 1. Plataforma de Ensino (Core)

- Sistemas de **Navegação Guiada** por módulos.
- **Gamificação Pesada**: XP, Níveis, Badges, Streaks (Ofensiva).
- **Conteúdo Interativo**: Textos que reagem ao mouse, simuladores em tempo real.
- **Tutor IA**: Chatbot contextual para tirar dúvidas na hora.

### 2. Infraestrutura de Usuário

- **Autenticação Integrada** (GitHub e Email).
- **Persistência de Progresso** em banco de dados (nuvem).
- **Sistema de Doações/Apoio** integrado.

### 3. Ferramentas de Aprendizado (Sandboxes)

- **Editor de Código Web**: Execução de Python no navegador (Pyodide).
- **Visualizadores de Algoritmos**: Ver o "cérebro" da IA pensando (tabelas Q, redes neurais pulsando).

## Tecnologias e Stack

O projeto agora é **Fullstack** e **Cloud-Ready**.

- **Frontend (A Cara):** React, TypeScript, Tailwind CSS, Framer Motion (animações).
- **Engine (O Cérebro):** Python (via Pyodide ou Backend), NumPy, PyTorch.
- **Infra (O Corpo):** Docker, PostgreSQL, Supabase (ou similar para Auth/DB).
- **Qualidade:** Vitest, ESLint, Prettier, Husky.

## Fases do Projeto

Consulte o [roadmap.md](roadmap.md) para a lista detalhada e atualizada. O escopo agora cobre:

- **História da IA:** De Turing ao GPT.
- **Fundamentos Matemáticos:** Sem "magia", apenas lógica.
- **Reinforcement Learning:** O coração do currículo.
- **Deep Learning & Neural Networks:** O futuro.

## Fora do Escopo (Out-Scope)

- **Cursos de IA Generativa Superficial:** Foco em "Prompt Engineering" sem base técnica. (Aqui ensinamos a CRIAR a IA, não apenas usar).
- **Hospedagem de Modelos Gigantes:** O foco é rodar exemplos didáticos, não competir com AWS/HuggingFace.
- **Suporte a Mobile Legacy:** Foco em navegadores modernos e Desktop/Tablet inicialmente (PWA posterior).

---

> **Nota:** Este arquivo reflete a nova ambição do projeto de ser uma plataforma "TOP dos TOPs".
