# 🧭 Filosofia do Conteúdo: Farol Guia

Este documento define as **regras de negócio** do conteúdo educacional da plataforma "Aprendendo IA". Toda criação, revisão ou reestruturação de material deve respeitar estes princípios.

---

## Princípio Central

> O aprendizado acontece quando o estudante se sente **conectado** ao problema e à solução: não quando recebe informação solta.

Conteúdo raso, genérico ou descontextualizado **não serve**. Cada conceito precisa de alma.

---

## Estrutura Narrativa Obrigatória

Todo conceito ensinado deve seguir esta progressão:

### 1. Contexto Real

- Quem enfrentou esse problema? Quando? Por quê?
- Fatos históricos verificáveis. Sem inventar falas ou emoções de pessoas reais.
- Citar fontes quando possível (artigo, ano, autor).

### 2. O Problema

- O que **não funcionava** antes dessa solução existir?
- Qual era a frustração concreta? O limite técnico?
- O estudante precisa sentir a dor antes de ver a cura.

### 3. Analogia Honesta

- Traduzir a ideia em algo tangível e intuitivo.
- A analogia deve ser **precisa**: não simplificada a ponto de ser errada.
- Usar linguagem acessível sem sacrificar o rigor.

### 4. Interação / Experimentação

- O estudante vê, clica, manipula, experimenta.
- A compreensão vem do **fazer**, não do ler.
- Visualizações interativas são o coração da plataforma.

### 5. Formalização (quando aplicável)

- Agora sim: a fórmula, o pseudocódigo, o diagrama técnico.
- Neste ponto, a matemática faz sentido porque o estudante já entende a intuição.

---

## Exemplo Prático

### ❌ Abordagem proibida (raso e solto)

> "Q-Learning usa uma tabela de estados e ações chamada Q-Table. A fórmula de atualização é: Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') − Q(s,a)]"

### ✅ Abordagem correta (conectado e verificável)

> "Em 1989, o problema era real: como um agente aprende se a recompensa só vem muito depois da ação? Watkins propôs, em sua tese de PhD em Cambridge (*Learning from Delayed Rewards*), que o agente mantivesse um 'caderno' (Q-Table) anotando a qualidade de cada decisão: e atualizasse essas notas a cada experiência."
>
> [Interação: manipule a Q-Table e veja o agente melhorar em tempo real]
>
> "Agora que você viu funcionando, esta é a fórmula que governa aquela atualização: ..."

---

## Regras Editoriais

| Regra | Descrição |
|-------|-----------|
| **Verificabilidade** | Todo fato histórico deve ser rastreável (autor, ano, publicação). |
| **Honestidade narrativa** | Nunca atribuir falas ou emoções inventadas a pessoas reais. |
| **Profundidade acessível** | Conteúdo rigoroso e preciso, mas explicado com clareza. Simples ≠ raso. |
| **Conexão emocional** | O estudante deve sentir o problema antes de ver a solução. |
| **Interatividade obrigatória** | Conceitos centrais devem ter componente visual/interativo. |
| **Sem "lixo genérico"** | Proibido texto de preenchimento, introduções vazias ou analogias forçadas. |
| **Analogias gamer agnósticas** | Usar conceitos genéricos de RPG/MMO (XP, boss, poção, dungeon). Nunca fazer lock-in em um jogo específico (ex: Ragnarok, LoL). Deve funcionar para qualquer jogador. |

---

## O que este projeto NÃO é

- ❌ Um tutorial copiado da internet com linguagem simplória.
- ❌ Um repositório de fórmulas sem contexto.
- ❌ Conteúdo "difícil por ser difícil": complexidade pela complexidade.
- ❌ Fanfic histórica disfarçada de educação.

## O que este projeto É

- ✅ Uma jornada onde cada conceito tem história, problema, intuição e prática.
- ✅ Conteúdo com alma: o estudante se sente parte da descoberta.
- ✅ Rigoroso e acessível ao mesmo tempo.
- ✅ Interativo: aprender fazendo, não lendo.

---

## Referências Fundacionais

1. Watkins, C.J.C.H. (1989). *Learning from Delayed Rewards*. PhD Thesis, King's College, Cambridge.
2. Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction*. MIT Press.
3. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press.
4. Turing, A. M. (1950). *Computing Machinery and Intelligence*. Mind, 59(236), 433-460.
5. Russell, S. J., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson.

---

> *"Conteúdo sem contexto é ruído. Contexto sem interação é passivo. A plataforma une os dois: você entende o porquê, depois experimenta o como."*
