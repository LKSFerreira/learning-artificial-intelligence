# 🧠 Aprendizado de Inteligência Artificial — A Plataforma Definitiva

> **Visão:** Criar a plataforma de ensino de IA mais **interativa, didática e engajante** do mundo. Um projeto "Build to Learn" onde a engenharia da plataforma é tão importante quanto o conteúdo ensinado.

## 🎯 Dupla Missão

Este projeto tem dois objetivos simultâneos e complementares:

1.  **Ensinar IA de Verdade (Trilha do Conhecimento):**

    - Do zero absoluto à criação de agentes autônomos.
    - Foco em **Reinforcement Learning (RL)**.
    - Conteúdo com rigor acadêmico, mas acessível a leigos.
    - 1000% Interativo: Nada de "ler e decorar". Aqui você vê, clica e experimenta.

2.  **Excelência em Engenharia (Trilha da Plataforma):**
    - Construir uma aplicação web moderna (React + TypeScript + Vite).
    - Arquitetura limpa e boas práticas (testes automatizados e lint ainda no roadmap — T0).
    - Evolução planejada: gamificação, auth, sandboxes de código, DB real (ver `ROADMAP.md`).

---

## 🗺️ Roadmap Vivo

O projeto segue um plano de desenvolvimento detalhado. Diferente de tutoriais estáticos, este repositório é uma **plataforma viva** em constante evolução.

👉 **[Consulte o Roadmap Mestre (ROADMAP.md)](ROADMAP.md)** para ver o planejamento detalhado das fases de engenharia e conteúdo.

### Resumo das Trilhas

| 🏗️ Engenharia (A Plataforma) | 🧠 Conhecimento (O Currículo) |
| :--------------------------- | :---------------------------- |
| **A1 + R:** Arquitetura limpa e conteúdo em Markdown ✅ | **B1:** Fundamentos + gênese da IA (embutida) ✅ |
| **A2:** Gamificação (XP, badges na UI) — *após o gate* | **B2:** Q-Learning (Jogo da Velha) ✅ |
| **A3:** Infra (Auth, DB, pagamentos) — futuro | **B3:** Navegação (Labirinto) ✅ |
| **A4:** Sandboxes, tutor avançado, PWA — futuro | **B4+:** Visão, DQN, … (futuro) |

> **Onde estamos:** polir B1–B3 até o gate do autor no `ROADMAP.md`. A2 e B4+ **não** são o próximo passo automático.

---

## ⚠️ Filosofia: "Build to Break"

Para aprender de verdade, você precisa sujar as mãos.

- **Não copie e cole:** Entenda cada linha.
- **Quebre o código:** Mude parâmetros, cause erros, veja o que acontece.
- **Ensine a IA:** Se você não consegue explicar para um leigo (ou para a máquina), você não entendeu.

---

## 🛠️ Tecnologias

### Agora (no repositório)

- **Frontend:** React 19, TypeScript, Vite 6, `react-router-dom`, `react-markdown`, Lucide.
- **Estilos:** Tailwind CSS via CDN (`index.html`) + temas em `src/index.css`.
- **Conteúdo:** Markdown com frontmatter em `src/conteudo/` (fonte de verdade do currículo).
- **Persistência:** `localStorage`.
- **Tutor (opcional):** Google Gemini via `@google/genai` — variável `GEMINI_API_KEY` (ver `.env.example`).

### Planejado (roadmap — ainda não existe no código)

- Python / NumPy / PyTorch e sandboxes no navegador (Pyodide).
- Auth (ex.: GitHub OAuth), PostgreSQL (ou similar), Docker, pagamentos.
- ESLint, Prettier, Husky, Vitest.

---

## 📖 Referências & Inspiração

Nosso conteúdo técnico é embasado nas maiores autoridades da área:

- _Sutton & Barto_ (Reinforcement Learning)
- _Norvig & Russell_ (IA Moderna)
- _Alan Turing_ (Fundamentos da Computação)

---

## 👤 Autor

**Lucas Ferreira (LKS)**
_Engenheiro de Software & Entusiasta de IA_

> "Transformando a complexidade científica em experiência interativa."

---

## 📜 Licença

MIT
