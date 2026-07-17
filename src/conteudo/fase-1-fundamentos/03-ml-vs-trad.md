---
id: "ml_vs_trad"
titulo: "O Momento em que Paramos de Programar Regras 📸"
estadoVisual: "ml_examples"
tipo: "content"
ordem: 3
urlVideo: ""
---

No tópico **02** o mapa ficou assentado: **IA** é o guarda-chuva; **Machine Learning** é a fatia que **aprende com dados e experiência**; **Deep Learning** é uma fatia dentro do ML. No círculo de ML você também viu os **três pilares**: supervisionado, não supervisionado e por reforço.

A pergunta desta lição é outra, mais prática: **por que** parar de programar regras e treinar um modelo?

### O limite das regras

Imagine reconhecer, numa imagem, se algo é uma **poção** de inventário (frasco, cor, brilho) ou um **item** qualquer (fruta, arma, gema).

Na **programação tradicional**, a tentação é escrever condições:

*   `SE` a cor for vermelha `E` o formato for de frasco `ENTÃO` é poção.

Funciona no primeiro exemplo. Depois a vida real complica:

*   poções verdes, azuis, roxas;
*   frascos em ângulos e iluminações diferentes;
*   itens que *parecem* frasco e não são.

Cada exceção pede **outra regra**. O código vira uma árvore frágil de `if`s. Em visão, fala ou jogos complexos, o número de casos explode. É esse estouro que o aprendizado de máquina ataca.

### Regras versus Machine Learning

| | **Programação por regras** | **Machine Learning** |
| --- | --- | --- |
| Você escreve | Ramos `SE` / `ENTÃO` | Modelo + processo de treino |
| De onde vem o “saber” | Da cabeça de quem programa | Dos **exemplos** (ou da interação com o ambiente) |
| Brilha quando | Poucos casos, lógica clara | Muitas variações, padrões difíceis de listar |
| Sofre quando | Exceções explodem | Faltam dados, validação ou cuidado com vieses |

Regras explícitas **continuam** sendo IA (como no tópico 02: nem toda IA é ML). O ponto aqui é o **gargalo**: quando as variações multiplicam, treinar com experiência costuma ser o caminho certo.

### Oficina interativa (painel ao lado)

O **simulador** compara os dois mundos com o inventário de itens.

**Lado das regras (esquerda):**

1. Clique em um item.
2. Toque em **Executar regra**.
3. Veja o código `isPotion` destacar **linha a linha**.
4. Compare o retorno da regra com a verdade (é poção ou não).

A regra só olha se a cor é `vermelho`. Resultados: **ACERTOU**, **ENGANO**, **ERRADO**.

**Lado do Machine Learning (direita):** treine com exemplos e teste o catálogo. No teste, o painel mostra a **classe** e a **confiança** (em %): quão certo o modelo está **desta** predição. Confiança é **por item**. **Precisão** e **acurácia** medem o **conjunto** (métricas globais).

O objetivo não é virar expert em classificador. É **sentir** a troca: de “eu enumero todas as regras” para “eu mostro exemplos e deixo o padrão emergir”.

### Que tipo de ML é este simulador?

No tópico **02.2** os três pilares do ML foram apresentados em geral. Aqui você **vive** um deles.

**Resposta: aprendizado supervisionado com dados rotulados** (classificação em duas classes: poção / não é poção).

| Tipo (tópico 02) | O que recebe | Neste painel |
| --- | --- | --- |
| **Supervisionado** | Exemplos **com rótulo** | **Sim**: cada item tem gabarito |
| **Não supervisionado** | Dados **sem** rótulo | Não |
| **Por reforço** | Ambiente + **recompensa** | Não (mais adiante no curso) |

**Rótulo** é a resposta já anotada:

*   Poção Vermelha → **poção**
*   Maçã Vermelha → **não é poção**
*   Espada de Ferro → **não é poção**

No treino, o painel mostra algo como *Exemplo 7/18 · Elixir Rosa → poção*: o modelo vê a imagem **junto** com a resposta e ajusta o que aprendeu. Isso é a “supervisão”.

> *Rotulado* = cada exemplo tem a resposta.  
> *Supervisionado* = o treino usa essa resposta para corrigir o modelo.

### O que ainda depende de você

Aprender sem programar *cada* regra **não** elimina o trabalho humano:

*   **Dados:** no supervisionado, alguém **rotula**.
*   **Objetivo:** o que conta como acerto?
*   **Avaliação:** acertar no treino não garante acerto no mundo real (**generalização**).
*   **Responsabilidade:** padrão estatístico não substitui critério ético e de segurança.

Quando a diferença entre **regras** e **exemplos rotulados (supervisionado)** estiver clara no simulador, o próximo passo é por que redes **profundas** mudaram o jogo em imagens e linguagem (e como isso se encaixa no mapa do tópico 02).
<!-- audio-skip-start -->
### 📚 Referências Científicas & Leituras Recomendadas

*   **1959 (Arthur L. Samuel):** [Some Studies in Machine Learning Using the Game of Checkers](https://doi.org/10.1147/rd.33.0210) (*IBM Journal of Research and Development*): marco clássico do termo *machine learning* (já citado no tópico 02).
*   **1997 (Tom M. Mitchell):** [*Machine Learning*](http://www.cs.cmu.edu/~tom/mlbook.html) (McGraw-Hill): definição operacional: desempenho em uma tarefa melhora com a experiência.
*   **2020 (Russell & Norvig):** [*Artificial Intelligence: A Modern Approach*](http://aima.cs.berkeley.edu/) (4ª ed.): IA, aprendizado e o lugar do ML no campo.
*   **2016 (Goodfellow, Bengio & Courville):** [*Deep Learning*](https://www.deeplearningbook.org/) (MIT Press): prepara o salto para redes profundas na próxima lição.
<!-- audio-skip-end -->
