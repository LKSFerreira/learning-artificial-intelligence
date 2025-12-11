# 🧠 AI Game Learning — Do Zero à IA Jogadora

## 🎯 Objetivo Final

Aprender **Inteligência Artificial** do zero absoluto até criar uma IA capaz de **jogar Ragnarok Online Brasil (bRO)**.

---

## ⚠️ Metodologia: Build to Break

| ✅ Fazer                                 | ❌ Evitar                      |
| ---------------------------------------- | ------------------------------ |
| Implementar eu mesmo antes de consultar  | Pedir código completo para LLM |
| Usar LLM para explicar conceitos/erros   | Aceitar código sem entender    |
| Quebrar o código para ver o que acontece | Seguir tutoriais cegamente     |

---

## 🧭 Roadmap Completo

### Fase 0: Setup Profissional ⬜

#### 0.1 Limpeza do Repositório

- [ ] Criar branch `legacy` com código antigo
- [ ] Deletar pastas `ai-game-learning/` e `personal-portfolio/`
- [ ] Fazer commit limpo no `main`

#### 0.2 Estrutura de Pastas

- [ ] Criar `src/ai_game_learning/` (pacote principal)
- [ ] Criar `tests/` (testes unitários)
- [ ] Criar `docs/` (documentação das fases)
- [ ] Criar `notebooks/` (experimentos Jupyter)

#### 0.3 Tooling Python Moderno

- [ ] Criar `pyproject.toml` com metadados do projeto
- [ ] Configurar **Ruff** (linter + formatter)
- [ ] Configurar **MyPy** (type checking)
- [ ] Configurar **Pytest** (testes)
- [ ] Criar `.venv` e instalar dependências

#### 0.4 Verificação

- [ ] Rodar `ruff check .` sem erros
- [ ] Rodar `ruff format .`
- [ ] Rodar `mypy src/` sem erros

---

### Fase 1: Fundamentos Teóricos ⬜

#### 1.1 Conceitos Base

- [ ] Estudar: O que é Inteligência Artificial?
- [ ] Estudar: Diferença entre IA, ML, DL
- [ ] Documentar em `docs/fase_1_fundamentos.md`

#### 1.2 Reinforcement Learning (Teoria)

- [ ] Estudar os 5 componentes: Agente, Ambiente, Estado, Ação, Recompensa
- [ ] Entender o ciclo de interação Agente ↔ Ambiente
- [ ] Estudar: O que é uma Política (Policy)?

#### 1.3 Matemática Essencial

- [ ] Estudar: Equação de Bellman (intuição, não decorar fórmula)
- [ ] Estudar: O que é Valor Q (Quality)?
- [ ] Estudar: Exploração vs Exploração (Epsilon-Greedy)

#### 1.4 Recursos Recomendados

- [ ] Assistir: David Silver RL Lecture 1-2
- [ ] Ler: Sutton & Barto Capítulo 1-3

---

### Fase 2: Q-Learning Básico (Jogo da Velha) ⬜

#### 2.1 Ambiente do Jogo

- [ ] Criar `ambiente.py` do zero
- [ ] Implementar representação do tabuleiro (lista/array)
- [ ] Implementar verificação de vitória
- [ ] Implementar lista de ações válidas
- [ ] Escrever testes para o ambiente

#### 2.2 Agente Q-Learning

- [ ] Criar `agente.py` do zero
- [ ] Implementar Q-Table (dicionário)
- [ ] Implementar `obter_valor_q(estado, acao)`
- [ ] Implementar escolha aleatória (exploração)

#### 2.3 Estratégia Epsilon-Greedy

- [ ] Implementar `escolher_acao(estado, epsilon)`
- [ ] Testar: epsilon=1.0 (100% aleatório)
- [ ] Testar: epsilon=0.0 (100% guloso)

#### 2.4 Equação de Bellman

- [ ] Implementar `atualizar_q(estado, acao, recompensa, proximo_estado)`
- [ ] **Experimento**: `gamma = 0` (míope) - O que acontece?
- [ ] **Experimento**: `gamma = 1` (visionário) - O que muda?
- [ ] **Experimento**: `alpha = 1.0` - Por que é ruim?

#### 2.5 Treinamento

- [ ] Criar `treinador.py`
- [ ] Implementar loop de episódios
- [ ] Implementar self-play (agente vs agente)
- [ ] Implementar decaimento de epsilon

#### 2.6 Visualização e Análise

- [ ] Plotar evolução da taxa de vitória
- [ ] Visualizar Q-Table para estados específicos
- [ ] Documentar resultados em `docs/fase_2_resultados.md`

---

### Fase 3: Generalização (Labirinto) ⬜

#### 3.1 Novo Ambiente

- [ ] Criar ambiente de grade (Grid World)
- [ ] Implementar movimentos: cima, baixo, esquerda, direita
- [ ] Implementar paredes e objetivo
- [ ] Implementar sistema de recompensas (-0.1 por passo, +10 objetivo)

#### 3.2 Reutilização do Agente

- [ ] Adaptar agente Q-Learning para o labirinto
- [ ] Verificar: O algoritmo funciona sem mudanças?
- [ ] Se não, entender o porquê

#### 3.3 Experimentos

- [ ] Testar com labirinto 5x5
- [ ] Testar com labirinto 10x10
- [ ] **Experimento**: Labirinto sem saída - O que acontece?

---

### Fase 4: Visão Computacional Básica ⬜

#### 4.1 OpenCV Fundamentos

- [ ] Instalar e configurar OpenCV
- [ ] Capturar screenshot da tela
- [ ] Converter para escala de cinza
- [ ] Detectar bordas (Canny)

#### 4.2 Detecção de Objetos Simples

- [ ] Detectar retângulos/formas
- [ ] Template matching (encontrar imagem dentro de imagem)
- [ ] Detectar cores específicas (HSV)

#### 4.3 Projeto: Dino do Chrome

- [ ] Capturar tela do jogo
- [ ] Detectar cactos (obstáculos)
- [ ] Implementar lógica: "Se cacto próximo → pular"
- [ ] Integrar com PyAutoGUI para controle

---

### Fase 5: IA Reativa (Flappy Bird) ⬜

#### 5.1 Ambiente

- [ ] Encontrar/criar clone de Flappy Bird jogável
- [ ] Capturar tela e identificar elementos
- [ ] Detectar: posição do pássaro, posição dos canos

#### 5.2 Agente Reativo

- [ ] Implementar lógica baseada em regras
- [ ] Testar diferentes heurísticas
- [ ] Documentar qual funciona melhor

#### 5.3 Agente Aprendiz (Opcional)

- [ ] Aplicar Q-Learning ao Flappy Bird
- [ ] Comparar com agente reativo

---

### Fase 6: Deep Q-Network (DQN) ⬜

#### 6.1 PyTorch Fundamentos

- [ ] Instalar PyTorch
- [ ] Criar tensores e operações básicas
- [ ] Entender autograd (gradientes automáticos)

#### 6.2 Rede Neural Simples

- [ ] Criar rede com 1 camada oculta
- [ ] Treinar para função XOR (sanity check)
- [ ] Entender forward pass e backpropagation

#### 6.3 DQN Teoria

- [ ] Estudar: Por que substituir Q-Table por rede neural?
- [ ] Estudar: Experience Replay
- [ ] Estudar: Target Network

#### 6.4 Gymnasium

- [ ] Instalar Gymnasium
- [ ] Explorar ambiente CartPole
- [ ] Explorar ambiente LunarLander

#### 6.5 Implementar DQN

- [ ] Criar rede neural para aproximar Q
- [ ] Implementar Experience Replay
- [ ] Treinar em CartPole
- [ ] Treinar em LunarLander

---

### Fase 7: Ragnarok Online (Projeto Final) ⬜

#### 7.1 Análise do Jogo

- [ ] Identificar elementos visuais (HP, SP, monstros, itens)
- [ ] Mapear teclas de ação (F1-F9, cliques)
- [ ] Definir estados possíveis do agente

#### 7.2 Captura e Processamento

- [ ] Capturar tela do jogo em tempo real
- [ ] Detectar barra de HP/SP
- [ ] Detectar monstros na tela
- [ ] Detectar itens dropados

#### 7.3 Máquina de Estados

- [ ] Implementar estados: IDLE, ATACANDO, CURANDO, FUGINDO, COLETANDO
- [ ] Definir transições entre estados
- [ ] Integrar com visão computacional

#### 7.4 Controle

- [ ] Integrar PyAutoGUI ou AutoHotkey
- [ ] Implementar movimentação
- [ ] Implementar uso de skills
- [ ] Implementar coleta de itens

#### 7.5 Agente Inteligente

- [ ] Aplicar RL para otimizar comportamento
- [ ] Treinar em servidor privado/teste
- [ ] Documentar resultados

---

## 🧰 Tecnologias por Fase

| Fase | Tecnologias                                   |
| ---- | --------------------------------------------- |
| 0-3  | Python, NumPy, Matplotlib, Ruff, MyPy, Pytest |
| 4-5  | + OpenCV, PyAutoGUI                           |
| 6    | + PyTorch, Gymnasium                          |
| 7    | + AutoHotkey, Visão em tempo real             |

---

## 📖 Recursos

- [Sutton & Barto - RL: An Introduction](http://incompleteideas.net/book/the-book.html)
- [David Silver - RL Course](https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ)
- [Spinning Up in Deep RL](https://spinningup.openai.com/)
- [PyTorch Tutorials](https://pytorch.org/tutorials/)

---

## 👤 Autor

**Lucas Ferreira (LKS)**

📅 Início: 26/10/2025 | 📅 Recomeço: 12/2025

> "A melhor forma de aprender IA é quebrando a cabeça com ela."

---

## 📜 Licença

MIT
