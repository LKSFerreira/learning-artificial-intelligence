# 🗺️ Roadmap Mestre: Plataforma "Aprendendo IA"

Este documento é o **mapa definitivo** do projeto. Ele combina duas jornadas paralelas:

1. **Trilha da Engenharia:** A construção da plataforma de ensino em si (React, Arquitetura, Infra).
2. **Trilha do Conhecimento:** O currículo de IA que será ensinado dentro da plataforma.

**Objetivo:** Criar a plataforma "TOP dos TOPs"—interativa, gamificada e academicamente rigorosa—enquanto dominamos a engenharia de software necessária para construí-la.

---

## 🏗️ Trilha A: Engenharia da Plataforma

Esta trilha foca na evolução do código-fonte do projeto `learning-artificial-intelligence`. O objetivo é criar uma aplicação robusta, escalável e open-source.

### ✅ Fase A1: Refatoração e Arquitetura Limpa — COMPLETA (2024-12-24)

**Objetivo:** Eliminar débito técnico crítico e estabelecer uma arquitetura profissional.

- [x] **A1.1 Desacoplamento do Core**
  - [x] Extrair lógica do `App.tsx` para Hooks customizados (`useNavegacao`, `useQuiz`, `useTutorIA`).
  - [x] Criar Context API para gerenciamento de estado global (`ContextoProgresso`, `ContextoBadges`, `ContextoQuiz`).
  - [x] Separar dados (conteúdo) da apresentação (componentes).
  - [x] Integrar contextos e hooks no `App.tsx` (648 → ~110 linhas).
- [x] **A1.2 Modularização de Layout**
  - [x] Criar `BarraLateralFases.tsx` (sidebar de navegação).
  - [x] Criar `AreaConteudoPrincipal.tsx` (conteúdo + quiz + tutor).
  - [x] Deletar arquivos legados (`curriculoLegado.ts`, `BadgeSystemLegado.tsx`).
- [x] **A1.3 Modularização de Visuais** _(Completo - 2024-12-24)_
  - [x] Quebrar `Phase1Visual.tsx` em 5 sub-componentes + orquestrador.
  - [x] Quebrar `Phase2Visual.tsx` em 5 sub-componentes + orquestrador.
  - [x] Quebrar `Phase3Visual.tsx` em 2 sub-componentes + orquestrador.

---

### � Fase A2: Gamificação e Engajamento — PRÓXIMA

**Objetivo:** Implementar mecânicas que tornem o aprendizado viciante.

- [ ] **A2.1 Sistema de XP e Níveis**
  - [ ] Implementar cálculo de XP por ações (leitura, quiz, exercícios).
  - [ ] Criar sistema de níveis (Novato → Aprendiz → Mestre).
  - [ ] Adicionar barra de progresso visual persistente.
- [ ] **A2.2 Streaks (Ofensiva)**
  - [ ] Criar tracker de dias consecutivos de estudo.
  - [ ] Implementar lógica de "congelamento" de ofensiva.
- [ ] **A2.3 Leaderboard Local**
  - [ ] Ranking de conquistas e pontuação (armazenamento local inicial).

---

### ☁️ Fase A3: Infraestrutura e Identidade

**Objetivo:** Profissionalizar a persistência de dados e gestão de usuários.

- [ ] **A3.1 Autenticação Híbrida**
  - [ ] **GitHub Login (Ativo):** Integrar OAuth com GitHub para login rápido e seguro.
  - [ ] **Login Proprietário (Desativado):** Implementar sistema Email/Senha via _feature flag_.
- [ ] **A3.2 Migração de Banco de Dados**
  - [ ] Desenhar esquema relacional (Usuários, Progresso, Conquistas).
  - [ ] Migrar de `LocalStorage` para PostgreSQL/SQLite + Prisma/Drizzle.
- [ ] **A3.3 Sistema de Apoio (Doações)**
  - [ ] Integrar gateway de pagamento (Stripe ou Pix).
  - [ ] Criar página "Apoie o Projeto".

---

### ⚡ Fase A4: Recursos Avançados

- [ ] **A4.1 Sandboxes de Código:** Executar Python no navegador (Pyodide).
- [ ] **A4.2 Tutor IA Contextual:** Chatbot integrado contextualizado.
- [ ] **A4.3 Mobile/PWA:** Aplicação 100% instalável e responsiva.

---

## 🧠 Trilha B: Currículo de Inteligência Artificial

Esta trilha define o **conteúdo** ensinado na plataforma. Todo conceito deve ser **1000% interativo**, explicado com analogias simples e embasado academicamente.

### 🕰️ Fase B0: A Gênese (História e Filosofia) — A CRIAR

**Objetivo:** Contextualizar a IA como uma busca humana milenar.

- [ ] **B0.1 O Sonho do Autômato:** De Talos aos autômatos de relojoaria.
- [ ] **B0.2 O Nascimento Lógico:** Ada Lovelace, Alan Turing e o Teste de Turing.
- [ ] **B0.3 A Era de Ouro e os Invernos:** Expectativas exageradas e quedas.
- [ ] **B0.4 A Revolução do Deep Learning:** ImageNet e a explosão de dados.
- [ ] **Interatividade:** Linha do tempo navegável.

---

### ✅ Fase B1: Fundamentos Teóricos — CONTEÚDO BASE CRIADO

**Objetivo:** Explicar a hierarquia IA > ML > DL > RL de forma visual.

- [x] Conteúdo textual de introdução à IA, ML, DL, RL.
- [x] Visualização interativa básica (Venn, Ciclo RL).
- [ ] Melhorias futuras: animações mais ricas, matemática intuitiva.

---

### ✅ Fase B2: Q-Learning (Jogo da Velha) — CONTEÚDO BASE CRIADO

**Objetivo:** Ensinar o algoritmo Q-Learning tabular.

- [x] Conteúdo textual sobre Estados, Ações, Q-Table.
- [x] Visualização interativa do tabuleiro e Q-Table.
- [ ] Melhorias futuras: slider de Epsilon, animação de treinamento.

---

### ✅ Fase B3: Generalização (Labirinto) — CONTEÚDO BASE CRIADO

**Objetivo:** Expandir para navegação espacial.

- [x] Conteúdo textual sobre Grid World.
- [x] Visualização interativa do labirinto.
- [ ] Melhorias futuras: editor de labirintos customizados.

---

### � Fase B4: Visão Computacional (OpenCV) — FUTURO

- [ ] Processamento de imagem, detecção de bordas.
- [ ] Projeto: Agente que joga Dino Run lendo a tela.

---

### 📌 Fase B5: Deep Q-Networks (DQN) — FUTURO

- [ ] Estados infinitos, Experience Replay, Target Networks.
- [ ] Projeto: Landing Lunar ou CartPole.

---

## 🛠️ Fase Técnica 0: Setup do Desenvolvedor

- [x] **T0.1 Ambiente:** Docker configurado para desenvolvimento.
- [ ] **T0.2 Qualidade:** ESLint, Prettier, Husky (pre-commit).
- [ ] **T0.3 Testes:** Vitest (Frontend) e Pytest (Backend de IA).

---

## 📊 Status Geral do Projeto

| Trilha         | Fase Atual             | Status            |
| :------------- | :--------------------- | :---------------- |
| **Engenharia** | A1 ✅ → **A2 Próxima** | � Pronto p/ A2    |
| **Currículo**  | B1-B3 ✅ → **B0 Nova** | � Conteúdo Básico |

> **Onde retomar:** Escolha entre **A2 (Gamificação)** para engajamento ou **B0 (História)** para conteúdo novo.

---

## 📝 Referências Bibliográficas Base

1. **Sutton, R. S., & Barto, A. G. (2018).** _Reinforcement Learning: An Introduction_. MIT Press.
2. **Goodfellow, I., Bengio, Y., & Courville, A. (2016).** _Deep Learning_. MIT Press.
3. **Turing, A. M. (1950).** _Computing Machinery and Intelligence_. Mind, 59(236), 433-460.
4. **Russell, S. J., & Norvig, P. (2020).** _Artificial Intelligence: A Modern Approach_ (4th ed.). Pearson.

> _"A melhor forma de aprender é ensinar. A melhor forma de ensinar é construir mundos onde o aluno possa descobrir a verdade por si mesmo."_
