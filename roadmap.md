# 🗺️ Roadmap Completo de Aprendizado de IA

Este roadmap detalha **passo a passo** todas as etapas necessárias para dominar Inteligência Artificial, desde o setup até projetos avançados. Cada fase contém explicações didáticas do **porquê** de cada tarefa.

---

## 📋 Fase 0: Setup Profissional

**Objetivo:** Configurar um ambiente de desenvolvimento Python profissional com tooling moderno, seguindo boas práticas da indústria.

**Por que esta fase importa:** Um projeto bem estruturado facilita manutenção, debug e escalabilidade. Aprender isso desde o início cria hábitos profissionais.

### 0.1 Limpeza do Repositório

**Explicação:** Estamos iniciando uma jornada nova. Código antigo pode confundir e criar conflitos. Vamos arquivá-lo corretamente.

- [ ] Criar branch `legacy` para preservar código antigo
  - Por quê: Git permite salvar histórico sem poluir branch principal
- [ ] Deletar pastas `ai-game-learning/` e `personal-portfolio/`
  - Por quê: Manter projeto focado e organizado
- [ ] Fazer commit limpo no `main`
  - Por quê: Marco zero do projeto reestruturado

### 0.2 Estrutura de Pastas

**Explicação:** Python moderno usa estrutura específica para facilitar imports, testes e distribuição.

- [ ] Criar `src/ai_game_learning/` (pacote principal)
  - Por quê: Separar código-fonte de testes e docs
  - Como: `mkdir -p src/ai_game_learning && touch src/ai_game_learning/__init__.py`
- [ ] Criar `tests/` (testes unitários)
  - Por quê: Testar código garante que funciona conforme esperado
  - Como: `mkdir tests && touch tests/__init__.py`
- [ ] Criar `docs/` (documentação das fases)
  - Por quê: Documentar aprendizado e decisões técnicas
  - Como: `mkdir -p docs`
- [ ] Criar `notebooks/` (experimentos Jupyter)
  - Por quê: Jupyter é ideal para visualizações e experimentos interativos
  - Como: `mkdir notebooks`

### 0.3 Tooling Python Moderno

**Explicação:** Ferramentas profissionais automatizam qualidade de código: formatação consistente, detecção de erros de tipo, e testes automatizados.

- [ ] Criar `pyproject.toml` com metadados do projeto
  - Por quê: Padrão moderno Python para configuração centralizada
  - Como: Criar arquivo com nome, versão, dependências
- [ ] Configurar **Ruff** (linter + formatter ultra rápido)
  - Por quê: Detecta erros de estilo e boas práticas automaticamente
  - Como: `pip install ruff` e configurar em `pyproject.toml`
- [ ] Configurar **MyPy** (type checking)
  - Por quê: Detecta erros de tipo antes de executar código
  - Como: `pip install mypy` e configurar em `pyproject.toml`
- [ ] Configurar **Pytest** (framework de testes)
  - Por quê: Automatiza testes e garante código funcional
  - Como: `pip install pytest` e adicionar a `requirements-dev.txt`
- [ ] Criar `.venv` e instalar dependências
  - Por quê: Ambiente virtual isola projeto de instalações globais
  - Como: `.venv/Scripts/python.exe -m venv .venv`

### 0.4 Verificação

**Explicação:** Testar que tooling está funcionando antes de começar.

- [ ] Rodar `ruff check .` sem erros
- [ ] Rodar `ruff format .` para formatar código
- [ ] Rodar `mypy src/` sem erros de tipo

---

## 🎓 Fase 1: Fundamentos Teóricos

**Objetivo:** Construir base sólida de conhecimento em IA, entendendo conceitos antes de codificar.

**Por que esta fase importa:** Código sem entendimento é decoreba. Entender a teoria permite adaptar soluções a qualquer problema.

### 1.1 Conceitos Base

**Explicação:** IA é um campo amplo. Precisamos entender a hierarquia de conceitos.

- [ ] Estudar: O que é Inteligência Artificial?
  - Por quê: Definir escopo do que vamos aprender
  - Recursos: ler `docs/fase-1.md` completo
- [ ] Estudar: Diferença entre IA, ML, DL
  - Por quê: Evitar confusão entre termos essenciais
  - Analogia: IA (oficina) > ML (ferramentas elétricas) > DL (impressora 3D)
- [ ] Documentar em `docs/fase_1_fundamentos.md`
  - Por quê: Escrever consolida aprendizado
  - Como: Resumir com próprias palavras

### 1.2 Reinforcement Learning (Teoria)

**Explicação:** RL é a técnica que usaremos do início ao fim. É como treinar um cachorro com recompensas.

- [ ] Estudar os 5 componentes: Agente, Ambiente, Estado, Ação, Recompensa
  - Por quê: Todo sistema RL precisa destes elementos
  - Exemplo: Jogo da Velha - Agente (IA), Ambiente (tabuleiro), Estado (posições X/O), Ação (onde jogar), Recompensa (+1 vitória/-1 derrota)
- [ ] Entender o ciclo de interação Agente ↔ Ambiente
  - Por quê: RL é um loop contínuo de decisão-ação-feedback
  - Fluxo: Observar Estado → Escolher Ação → Receber Recompensa → Atualizar Conhecimento → Repetir
- [ ] Estudar: O que é uma Política (Policy)?
  - Por quê: Política é o "cérebro finalizado" da IA
  - Analogia: Manual de estratégias que diz qual ação tomar em cada situação

### 1.3 Matemática Essencial

**Explicação:** RL usa matemática, mas vamos focar na **intuição** não em decorar fórmulas.

- [ ] Estudar: Equação de Bellman (intuição)
  - Por quê: É a fórmula que ensina a IA a aprender
  - Intuição: "Valor de uma ação = Recompensa agora + Valor esperado do futuro"
- [ ] Estudar: O que é Valor Q (Quality)?
  - Por quê: Q-Table é nosso primeiro algoritmo
  - Intuição: "Quão boa é esta ação nesta situação?"
- [ ] Estudar: Exploração vs Exploitation (Epsilon-Greedy)
  - Por quê: IA precisa equilibrar testar coisas novas vs usar o que já sabe
  - Analogia: Explorar mapa novo vs farmar no spot conhecido

### 1.4 Recursos Recomendados

- [ ] Assistir: David Silver RL Lecture 1-2 (YouTube)
  - Por quê: Melhor curso acadêmico de RL gratuito
- [ ] Ler: Sutton & Barto Capítulo 1-3
  - Por quê: Bíblia do Reinforcement Learning

---

## 🎮 Fase 2: Q-Learning Básico (Jogo da Velha)

**Objetivo:** Implementar nosso primeiro agente de IA que aprende a jogar Jogo da Velha através de Q-Learning.

**Por que esta fase importa:** Jogo da Velha é simples o suficiente para entender cada linha de código, mas complexo o suficiente para aprender RL de verdade.

### 2.1 Ambiente do Jogo

**Explicação:** Antes da IA, criamos o "mundo" onde ela vai viver. O ambiente define as regras do jogo.

**Task 1: Criar estrutura do `ambiente.py`**

Por quê: Precisamos representar o tabuleiro em código

- [ ] Criar arquivo `src/ai_game_learning/jogo_da_velha/ambiente.py`
- [ ] Criar classe `AmbienteJogoDaVelha`
- [ ] Implementar `__init__()` que cria tabuleiro vazio (lista de 9 espaços)
  - Por quê: Lista indexada é mais simples que matriz 3x3
  - Estrutura: `[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']`

**Task 2: Implementar verificação de vitória**

Por quê: Precisamos saber quando o jogo terminou

- [ ] Criar método `verificar_vitoria(simbolo: str) -> bool`
- [ ] Implementar checagem de 3 linhas horizontais
  - Posições: [0,1,2], [3,4,5], [6,7,8]
- [ ] Implementar checagem de 3 colunas verticais
  - Posições: [0,3,6], [1,4,7], [2,5,8]
- [ ] Implementar checagem de 2 diagonais
  - Posições: [0,4,8], [2,4,6]

**Task 3: Implementar lista de ações válidas**

Por quê: IA só pode jogar em posições vazias

- [ ] Criar método `obter_acoes_validas() -> list[int]`
- [ ] Retornar lista de índices onde `tabuleiro[i] == ' '`
- [ ] Escrever teste para verificar funcionamento

**Task 4: Testes unitários**

Por quê: Garantir que ambiente funciona antes de criar IA

- [ ] Criar `tests/test_ambiente_jogo_velha.py`
- [ ] Testar: tabuleiro inicia vazio
- [ ] Testar: detecta vitória nas 8 combinações possíveis
- [ ] Testar: retorna ações válidas corretamente

### 2.2 Agente Q-Learning

**Explicação:** Agora criamos o "cérebro" da IA. Ele usa uma tabela (Q-Table) para armazenar o que aprendeu.

**Task 1: Estrutura básica do `agente.py`**

Por quê: Organizar código da IA separadamente do ambiente

- [ ] Criar arquivo `src/ai_game_learning/jogo_da_velha/agente.py`
- [ ] Criar classe `AgenteQLearning`
- [ ] Implementar `__init__(alpha: float, gamma: float, epsilon: float)`
  - `alpha`: taxa de aprendizado (0.1 padrão)
  - `gamma`: fator de desconto (0.9 padrão)
  - `epsilon`: taxa de exploração (1.0 no início)
- [ ] Inicializar `self.q_table: dict = {}` (dicionário vazio)

**Task 2: Implementar Q-Table**

Por quê: Q-Table é a "memória" da IA

- [ ] Criar método `obter_valor_q(estado: str, acao: int) -> float`
- [ ] Se `(estado, acao)` não existe na tabela, retornar `0.0`
- [ ] Caso contrário, retornar valor armazenado
- [ ] Criar método `definir_valor_q(estado: str, acao: int, valor: float)`
  - Armazena/atualiza valor Q na tabela

**Task 3: Implementar escolha aleatória**

Por quê: IA precisa explorar no início do treino

- [ ] Criar método `escolher_acao_aleatoria(acoes_validas: list[int]) -> int`
- [ ] Usar `random.choice(acoes_validas)`
- [ ] Importar `import random` no topo do arquivo

### 2.3 Estratégia Epsilon-Greedy

**Explicação:** Balancear exploração (tentar coisas novas) vs exploitation (usar melhor conhecida).

**Task 1: Implementar escolha gulosa (greedy)**

Por quê: Escolher melhor ação conhecida

- [ ] Criar método `escolher_melhor_acao(estado: str, acoes_validas: list[int]) -> int`
- [ ] Para cada ação válida, obter `obter_valor_q(estado, acao)`
- [ ] Retornar ação com maior valor Q
- [ ] Se empate, escolher aleatoriamente entre empatadas

**Task 2: Implementar epsilon-greedy**

Por quê: Combinar exploração + exploitation

- [ ] Criar método `escolher_acao(estado: str, acoes_validas: list[int]) -> int`
- [ ] Gerar número aleatório `r = random.random()` (entre 0 e 1)
- [ ] Se `r < epsilon`: explorar (escolher aleatória)
- [ ] Senão: exploitar (escolher melhor conhecida)

**Task 3: Testar estratégia**

- [ ] Testar com `epsilon=1.0` - deve escolher sempre aleatório
- [ ] Testar com `epsilon=0.0` - deve escolher sempre melhor
- [ ] Testar com `epsilon=0.5` - deve misturar 50/50

### 2.4 Equação de Bellman

**Explicação:** A fórmula que atualiza a Q-Table após cada jogada. Nova Opinião = Opinião Antiga + α × Surpresa

**Task 1: Implementar atualização Q**

Por quê: É como a IA aprende depois de cada ação

- [ ] Criar método `atualizar_q(estado: str, acao: int, recompensa: float, proximo_estado: str, acoes_proximas: list[int])`
- [ ] Obter Q atual: `q_atual = obter_valor_q(estado, acao)`
- [ ] Calcular melhor Q futuro: `max_q_futuro = max([obter_valor_q(proximo_estado, a) for a in acoes_proximas])`
- [ ] Se jogo terminou: `max_q_futuro = 0` (não há futuro)
- [ ] Calcular novo Q: `novo_q = q_atual + alpha * (recompensa + gamma * max_q_futuro - q_atual)`
- [ ] Armazenar: `definir_valor_q(estado, acao, novo_q)`

**Task 2: Experimento gamma = 0 (míope)**

Por quê: Entender impacto do fator de desconto

- [ ] Criar agente com `gamma=0`
- [ ] Treinar 1000 episódios
- [ ] Observar: IA é "míope", só pensa no ganho imediato
- [ ] Documentar resultado

**Task 3: Experimento gamma = 1 (visionário)**

- [ ] Criar agente com `gamma=1`
- [ ] Treinar 1000 episódios
- [ ] Observar: IA é "visionária", valoriza futuro igualmente ao presente
- [ ] Documentar resultado

**Task 4: Experimento alpha = 1.0**

Por quê: Entender taxa de aprendizado

- [ ] Criar agente com `alpha=1.0`
- [ ] Treinar 1000 episódios
- [ ] Observar: IA "esquece" tudo que sabia a cada nova experiência (muito instável)
- [ ] Documentar por que `alpha` moderado (0.1-0.3) é melhor

### 2.5 Treinamento

**Explicação:** Criar o "ginásio" onde a IA joga milhares de vezes para aprender.

**Task 1: Criar estrutura do treinador**

- [ ] Criar arquivo `src/ai_game_learning/jogo_da_velha/treinador.py`
- [ ] Criar função `treinar(num_episodios: int, agente_x: AgenteQLearning, agente_o: AgenteQLearning)`

**Task 2: Implementar loop de episódios**

Por quê: Cada episódio é uma partida completa

- [ ] Loop `for episodio in range(num_episodios):`
- [ ] Criar ambiente novo
- [ ] Alternar turnos entre X e O até jogo terminar
- [ ] Coletar recompensas no final

**Task 3: Implementar self-play**

Por quê: IA aprende jogando contra si mesma

- [ ] Ambos agentes usam a mesma Q-Table
- [ ] Cada jogada atualiza a tabela compartilhada
- [ ] Ao final: vencedor recebe `+1`, perdedor `-1`, empate `0`

**Task 4: Implementar decaimento de epsilon**

Por quê: Começar explorando, terminar exploitando

- [ ] Iniciar com `epsilon = 1.0`
- [ ] A cada 100 episódios: `epsilon = epsilon * 0.99`
- [ ] Mínimo: `epsilon_min = 0.01`

### 2.6 Visualização e Análise

**Explicação:** Medir progresso visualmente.

- [ ] Criar `visualizador.py`
- [ ] Plotar taxa de vitória a cada 1000 episódios
- [ ] Usar `matplotlib` para gráficos
- [ ] Salvar gráfico em `docs/fase_2_resultados.png`
- [ ] Documentar aprendizado em `docs/fase_2_resultados.md`

---

## 🗺️ Fase 3: Generalização (Labirinto)

**Objetivo:** Provar que RL funciona para qualquer problema. Criar agente que navega labirintos.

**Por que esta fase importa:** Se RL funciona tanto para jogo de tabuleiro quanto navegação espacial, funciona para qualquer coisa.

### 3.1 Novo Ambiente

**Explicação:** Criar mundo em grade (Grid World) onde agente se move fisicamente.

**Task 1: Criar estrutura do ambiente**

- [ ] Criar `src/ai_game_learning/labirinto/ambiente_labirinto.py`
- [ ] Classe `AmbienteLabirinto`
- [ ] `__init__(tamanho: int, paredes: list[tuple], saida: tuple)`
- [ ] Representar como matriz `numpy.array(tamanho, tamanho)`
  - `0` = caminho livre, `1` = parede, `2` = saída

**Task 2: Implementar movimentos**

Por quê: Agente precisa se mover em 4 direções

- [ ] Criar método `mover(acao: str) -> tuple[float, bool]`
- [ ] Ações: `'cima', 'baixo', 'esquerda', 'direita'`
- [ ] Retornar: `(recompensa, terminou)`
- [ ] Validar: não sair dos limites do grid

**Task 3: Implementar paredes e colisão**

- [ ] Se mover para parede: retornar `(-0.5, False)` e não mover
- [ ] Se mover para espaço livre: atualizar posição, retornar `(-0.1, False)`

**Task 4: Implementar sistema de recompensas**

Por quê: Ensinar IA a buscar caminho mais curto

- [ ] Chegar na saída: `(+10.0, True)`
- [ ] Bater na parede: `(-0.5, False)`
- [ ] Passo normal: `(-0.1, False)` (custo de energia)

### 3.2 Reutilização do Agente

**Explicação:** Ver se código de Q-Learning funciona sem mudanças.

**Task 1: Adaptar estados**

Por quê: Estado agora é posição (x, y) não configuração de tabuleiro

- [ ] Criar método `estado_para_string(x: int, y: int) -> str`
- [ ] Retornar: `f"{x},{y}"`

**Task 2: Testar reutilização**

- [ ] Usar mesma classe `AgenteQLearning` da Fase 2
- [ ] Verificar se funciona sem modificações
- [ ] Documentar: "Q-Learning é genérico!"

### 3.3 Experimentos

**Task 1: Labirinto 5x5 simples**

- [ ] Criar labirinto sem paredes
- [ ] Treinar 5000 episódios
- [ ] Verificar: IA aprende caminho reto para saída

**Task 2: Labirinto 10x10 com paredes**

- [ ] Criar labirinto com corredores
- [ ] Treinar 20000 episódios
- [ ] Visualizar: plotar Q-Table como setas no grid

**Task 3: Experimento: labirinto sem saída**

Por quê: Ver como IA lida com problema impossível

- [ ] Criar labirinto onde saída é cercada por paredes
- [ ] Treinar 10000 episódios
- [ ] Observar: todos Q-values convergem para negativos
- [ ] Documentar aprendizado

---

## 👁️ Fase 4-7: Continua no Arquivo...

**Nota:** Fases 4-7 seguem mesma estrutura detalhada. Cada task tem:

- **Explicação** do porquê
- **Passos granulares** acionáveis
- **Checkpoints** de verificação

### Estrutura Resumida:

**Fase 4:** Visão Computacional (OpenCV, captura de tela, detecção de objetos, Dino do Chrome)

**Fase 5:** IA Reativa (Flappy Bird, lógica baseada em regras vs RL)

**Fase 6:** Deep Q-Network (PyTorch, redes neurais, Experience Replay, CartPole/LunarLander)

**Fase 7+:** Projetos Avançados Generalizados:

- Opção A: MMORPGs (Ragnarok, WoW, etc.)
- Opção B: Jogos de Estratégia (StarCraft, Dota)
- Opção C: Jogos de Plataforma (Super Mario, Celeste)
- Opção D: Simuladores (Self-Driving Car, Drone Control)

---

## 📊 Acompanhamento de Progresso

Marque `[x]` conforme completa tasks. Estrutura permite sentir progresso incremental.

**Checkpoint Fase 0:** ✅ Ambiente configurado profissionalmente
**Checkpoint Fase 1:** ✅ Fundamentos teóricos consolidados
**Checkpoint Fase 2:** ✅ Primeiro agente RL funcionando
**Checkpoint Fase 3:** ✅ Conceitos generalizados comprovados
**Checkpoint Fase 4:** ✅ IA enxergando o mundo
**Checkpoint Fase 5:** ✅ IA jogando em tempo real
**Checkpoint Fase 6:** ✅ Deep Learning dominado
**Checkpoint Fase 7+:** ✅ Projetos complexos do mundo real

---

## 🎯 Filosofia do Roadmap

**Granularidade:** Tasks pequenas e acionáveis (15-30 min cada)
**Didática:** Cada task explica o "porquê", não só o "como"
**Progressão:** Cada fase prepara para próxima naturalmente
**Generalização:** Exemplos diversos, não focados em um único jogo
**Build to Break:** Incentiva experimentos e quebrar código para aprender
