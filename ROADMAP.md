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

### 🏗️ Fase R: Reestruturação de Arquitetura e Conteúdo — COMPLETA (2026-07-13)

**Objetivo:** Evoluir a plataforma promovendo modularização de componentes, desacoplamento de conteúdo e reescrita sob narrativa histórica de alta qualidade.

- [x] **R1 Decomposição de Componentes**
  - [x] Quebrar `AreaConteudoPrincipal.tsx` em subcomponentes independentes (`TelaQuiz`, `PainelVisual`, etc.).
  - [x] Separar controles e lógicas secundárias de `BarraLateralFases.tsx` (extraindo `SeletorTema`, `NavegacaoFases`).
- [x] **R2 Separação de Conteúdo**
  - [x] Extrair o conteúdo estático do código TypeScript e movê-lo para arquivos `.md` com frontmatter na pasta `src/conteudo/`.
  - [x] Criar sistema de loading dinâmico para importar os conteúdos em Markdown em tempo de build/execução.
- [x] **R3 Registro Dinâmico de Visuais**
  - [x] Substituir switch/case estático por mapa centralizado `REGISTRO_VISUAIS`.
- [x] **R4 Roteamento de Rotas**
  - [x] Integrar `react-router-dom` para navegação e compatibilidade com botão voltar do navegador.
- [x] **R5 Reescrita de Conteúdo (Filosofia Narrativa)**
  - [x] Reescrever conteúdos das fases 1, 2 e 3 com analogias consistentes, embasamento acadêmico e viés histórico.
- [x] **R6 Polimento e Documentação**
  - [x] Limpar código morto e atualizar artefatos de documentação (`ROADMAP.md`, `HISTORY.md`).
- [x] **R7 Player de Áudio Estático e Scripts CLI de Geração Offline**
  - [x] Simplificar player frontend removendo chaves de API locais e provedores dinâmicos de áudio.
  - [x] Criar script em Node.js (`sintetizar.js`) na pasta `/sintetizar/` que gera o áudio pelo Gemini e compacta em MP3 de 128kbps via CLI (compressão em `converterPcmParaMp3Buffer`).
  - [x] Resolver caminhos de arquivos estáticos no padrão de nomenclatura `/public/audios/`.
  - [x] Redesenhar player com visual premium glassmorphism, velocidade inline (+/-), dropdown de vozes alinhado paralelo e bloqueio físico de downloads fantasmas (HEAD 404).

---

### **Critério de avanço (gate do autor — LKS Ferreira)**

- [ ] Somente após melhorar o conteúdo atual, melhorar a interatividade e revisar os módulos B1–B3 é que seguiremos com conteúdo adicional ou features grandes de engenharia que dependam desse currículo estável.

> **Leitura operacional:** A2 (gamificação) e novas fases de currículo (B4+) **não** são o próximo passo automático. O próximo passo é polir B1–B3 até o gate acima ser marcado.

### 🎮 Fase A2: Gamificação e Engajamento — BLOQUEADA PELO GATE

**Objetivo:** Implementar mecânicas que tornem o aprendizado viciante.

> **Estado parcial:** já existem `ContextoBadges`, definições em `src/dados/badges/` e componentes em `src/componentes/conquistas/` (`SistemaBadges`, `BadgeItem`). A **UI de conquistas foi removida da sidebar** de propósito e deve ser **remontada** nesta fase — não recriar o domínio do zero.

- [ ] **A2.0 Badges na interface**
  - [ ] Reexpor `SistemaBadges` (ou equivalente) na sidebar ou área dedicada.
  - [ ] Garantir desbloqueio visível ao concluir passos/quizzes (ligar eventos de progresso).
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

### ☁️ Fase A3: Infraestrutura e Identidade — FUTURO

**Objetivo:** Profissionalizar a persistência de dados e gestão de usuários.

- [ ] **A3.1 Autenticação Híbrida**
  - [ ] **GitHub Login (Ativo):** Integrar OAuth com GitHub para login rápido e seguro.
  - [ ] **Login Proprietário (Desativado):** Implementar sistema Email/Senha via _feature flag_.
- [ ] **A3.2 Migração de Banco de Dados**
  - [ ] Desenhar esquema relacional (Usuários, Progresso, Conquistas).
  - [ ] Migrar de `localStorage` para PostgreSQL/SQLite + Prisma/Drizzle.
- [ ] **A3.3 Sistema de Apoio (Doações)**
  - [ ] Integrar gateway de pagamento (Stripe ou Pix).
  - [ ] Criar página "Apoie o Projeto".
- [ ] **A3.4 Containerização (opcional):** `Dockerfile` / Compose — só quando fizer sentido para o deploy; **ainda não existe** no repositório.

---

### ⚡ Fase A4: Recursos Avançados — FUTURO

- [ ] **A4.1 Sandboxes de Código:** Executar Python no navegador (Pyodide).
- [x] **A4.2 Tutor IA (base):** integração Gemini (`useTutorIA`, `servicoGemini`, `SecaoTutorIA`) — exige `GEMINI_API_KEY`.
  - [ ] **A4.2b Tutor contextual avançado:** histórico multi-turno, memória do progresso do aluno, prompts por fase mais ricos, UX de chat contínua.
- [ ] **A4.3 Mobile/PWA:** Aplicação 100% instalável e responsiva.

---

## 🧠 Trilha B: Currículo de Inteligência Artificial

Esta trilha define o **conteúdo** ensinado na plataforma. Todo conceito deve ser **1000% interativo**, explicado com analogias simples e embasado academicamente.

### ⏭️ Fase B0: A Gênese (História e Filosofia) — ABSORVIDA PELA B1

> **Não criar fase separada.** Com a reescrita narrativa (R5) e a `docs/filosofia_conteudo.md`, a gênese da IA **já vive dentro da B1** (e se repete como contexto em cada conceito), em vez de um módulo isolado “só de história”.

| Tema antigo da B0 | Onde está hoje |
|---|---|
| Sonho do autômato, Ada Lovelace, Turing, Dartmouth | `fase-1-fundamentos/01-intro.md` — *O Sonho de Criar Mentes* |
| Hierarquia e eras (regras → ML → DL) | `02-hierarchy.md` e demais lições da B1 |
| Revolução do Deep Learning / ImageNet | `04-deep-learning.md` |
| Consolidação histórica em vídeo | `09-video-lesson.md` |

A filosofia do projeto exige **história + problema + analogia + interação em cada conceito** — não um “capítulo zero” solto.

---

### ✅ Fase B1: Fundamentos (com Gênese embutida) — CONTEÚDO BASE CRIADO

**Objetivo:** Abrir a jornada com a origem do sonho da IA e explicar a hierarquia IA > ML > DL > RL de forma visual e histórica.

- [x] Gênese / história introdutória (Talos → Lovelace → Turing → Dartmouth) na abertura da fase.
- [x] Conteúdo textual de introdução à IA, ML, DL, RL com contexto histórico.
- [x] Visualização interativa básica (Venn, Ciclo RL, timelines).
- [x] Vídeo de consolidação da linha do tempo.
- [ ] Melhorias futuras: animações mais ricas, matemática intuitiva, eventual aprofundamento de “invernos da IA” se faltar no fluxo.

---

### ✅ Fase B2: Q-Learning (Jogo da Velha) — CONTEÚDO BASE CRIADO

**Objetivo:** Ensinar o algoritmo Q-Learning tabular.

- [x] Conteúdo textual sobre Estados, Ações, Q-Table.
- [x] Visualização interativa do tabuleiro e Q-Table.
- [x] Slider de Epsilon (`SliderEpsilon.tsx`).
- [ ] Melhorias futuras: animação de treinamento mais rica.

---

### ✅ Fase B3: Generalização (Labirinto) — CONTEÚDO BASE CRIADO

**Objetivo:** Expandir para navegação espacial.

- [x] Conteúdo textual sobre Grid World.
- [x] Visualização interativa do labirinto.
- [ ] Melhorias futuras: editor de labirintos customizados.

---

### 👁️ Fase B4: Visão Computacional (OpenCV) — FUTURO

- [ ] Processamento de imagem, detecção de bordas.
- [ ] Projeto: Agente que joga Dino Run lendo a tela.

---

### 📌 Fase B5: Deep Q-Networks (DQN) — FUTURO

- [ ] Estados infinitos, Experience Replay, Target Networks.
- [ ] Projeto: Landing Lunar ou CartPole.

---

## 🛠️ Fase Técnica 0: Setup do Desenvolvedor

> **T0.1 Docker:** removido do roadmap enquanto **não** houver `Dockerfile` no repositório (ver A3.4 se voltar a ser prioridade).

- [ ] **T0.2 Qualidade:** ESLint, Prettier, Husky (pre-commit) — **ainda não configurados**.
- [ ] **T0.3 Testes de frontend:** Vitest (+ Testing Library, se necessário) — **ainda não configurados**.
- [ ] **T0.4 Testes de backend de IA:** Pytest — **só quando** existir backend Python no repo (hoje não há).

---

## 📊 Status Geral do Projeto

| Trilha         | Fase Atual                         | Status                                                |
| :------------- | :--------------------------------- | :---------------------------------------------------- |
| **Engenharia** | A1 ✅ + R1–R6 ✅                   | 🟡 Gate: polir B1–B3 antes de A2                      |
| **Currículo**  | B1–B3 ✅ (gênese embutida na B1)   | 🟡 Gate: melhorar conteúdo/interatividade; depois B4+ |
| **Tutor IA**   | Base Gemini ✅                     | 🟡 A4.2b = evolução contextual (não recriar do zero) |
| **Badges**     | Domínio/código ✅; UI sidebar ❌   | 🟡 Remontar na A2.0                                   |
| **T0**         | Lint/testes pendentes              | ⚪ Opcional em paralelo ao polimento de B1–B3         |

> **Onde retomar:** A reestruturação (R1–R6) está consolidada. A **história/gênese da IA já está na B1** (não falta um módulo B0). **Próximo passo real:** revisar e melhorar conteúdo + interatividade de B1–B3 até o critério de avanço ser marcado. **Depois do gate:** A2 (inclui badges na UI) e/ou novas fases de currículo (B4+).

> **Fonte de verdade do currículo:** arquivos `.md` em `src/conteudo/`. Os `.ts` em `src/dados/curriculo/fase*.ts` são **fallback legado** (não editar conteúdo pedagógico neles).

---

## 📝 Referências Bibliográficas Base

1. **Sutton, R. S., & Barto, A. G. (2018).** _Reinforcement Learning: An Introduction_. MIT Press.
2. **Goodfellow, I., Bengio, Y., & Courville, A. (2016).** _Deep Learning_. MIT Press.
3. **Turing, A. M. (1950).** _Computing Machinery and Intelligence_. Mind, 59(236), 433-460.
4. **Russell, S. J., & Norvig, P. (2020).** _Artificial Intelligence: A Modern Approach_ (4th ed.). Pearson.

> _"A melhor forma de aprender é ensinar. A melhor forma de ensinar é construir mundos onde o aluno possa descobrir a verdade por si mesmo."_
