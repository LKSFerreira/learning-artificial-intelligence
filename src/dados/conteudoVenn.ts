export interface ConteudoVennTipo {
  titulo: string;
  markdown: string;
  urlVideo: string;
}

export const CONTEUDO_VENN: Record<string, ConteudoVennTipo> = {
  ia: {
    titulo: "Inteligência Artificial (IA) 🧬",
    urlVideo: "https://www.youtube.com/watch?v=HNBtdyMjxKU",
    markdown: `
A **Inteligência Artificial (IA)** é o guarda-chuva mais amplo da computação inteligente. Ela engloba qualquer técnica ou sistema capaz de simular o comportamento inteligente humano, seja através de regras rígidas e lógica matemática direta, ou por meio de abordagens modernas orientadas a dados.

---

### ⏳ O Cenário Pré-IA: A Origem dos Conceitos
Antes de o termo "Inteligência Artificial" ser cunhado formalmente em **1956**, a ciência computacional explorava esse campo sob outras perspectivas teóricas:
*   **Cibernética (1948):** Campo proposto por Norbert Wiener focado no estudo do controle e comunicação entre animais e máquinas.
*   **Teoria dos Autômatos:** O estudo matemático de como regras lógicas e sistemas abstratos processam informações.
*   **Machine Intelligence (1950):** O termo original preferido por Alan Turing em seu artigo seminal de 1950, onde ele introduziu o famoso *Teste de Turing* para avaliar a capacidade de uma máquina em simular o comportamento humano sem ser distinguida.

---

### 🏛️ A Evolução Histórica
A IA teve marcos importantes que oscilaram entre ondas de enorme otimismo e cortes de investimentos conhecidos como **Invernos da IA**:
*   **1956:** O nascimento formal do campo no simpósio de Dartmouth.
*   **1958:** Criação do *Perceptron* por Frank Rosenblatt, o primeiro modelo funcional de neurônio artificial.
*   **1997:** O computador *Deep Blue da IBM* derrota o campeão mundial Garry Kasparov, operando por busca veloz de possibilidades e regras predefinidas.
*   **2012 em diante:** O surgimento da revolução moderna com redes profundas eficientes em hardware paralelo (GPUs).

---

### 🎯 Os Três Níveis de Evolução da IA
1.  **IA Estreita (ANI):** Sistemas focados em realizar com maestria apenas uma única tarefa específica (como jogar xadrez ou recomendar vídeos). É a única IA que existe hoje.
2.  **IA Geral (AGI):** Sistemas hipotéticos com capacidade cognitiva e adaptabilidade equivalentes às de um ser humano adulto.
3.  **Superinteligência (ASI):** Uma entidade artificial cuja inteligência superaria a inteligência coletiva combinada de toda a humanidade, abrindo caminho para a **Singularidade**.

---

### 🎥 Vídeo de Consolidação
Assista ao vídeo em Modo Cinema para compreender a história detalhada da Inteligência Artificial e desbloquear a etapa de **Machine Learning**:
`
  },
  ml: {
    titulo: "Machine Learning (ML) 📊",
    urlVideo: "https://www.youtube.com/watch?v=0PrOA2JK6GQ",
    markdown: `
O **Machine Learning (Aprendizado de Máquina)** representa a transição dos sistemas clássicos de IA para sistemas orientados a dados. Em vez de programar regras lógicas estáticas à mão, o algoritmo observa dados empíricos, identifica correlações ocultas e aprende a resolver a tarefa por conta própria.

---

### 👶 Como as Máquinas e os Humanos Aprendem?
Humanos não nascem sabendo equações. Nós aprendemos coletando dados do mundo através de observação empírica dos sentidos (ex: um bebê solta um brinquedo repetidas vezes, observa o padrão e compreende a gravidade antes de saber física). O Machine Learning replica essa metodologia na ciência da computação.

---

### 🛠️ Os Três Pilares do Machine Learning
A aprendizagem de máquina é classificada tradicionalmente em três grandes abordagens metodológicas:

#### 1. Aprendizado Supervisionado
O algoritmo é alimentado com um banco de dados rotulado (perguntas e respostas prontas). Ele calibra seus pesos para associar as entradas aos gabaritos.
*   **Classificação:** Dividir dados em categorias discretas (ex: identificar se uma foto é de um Golden Retriever ou de um Yorkshire).
*   **Regressão:** Prever uma variável numérica contínua (ex: estimar a altura futura de um cão com base no histórico).

#### 2. Aprendizado Não Supervisionado
O algoritmo recebe dados não estruturados e sem rótulos (sem gabarito). Ele deve identificar padrões, semelhanças e agrupamentos (*clusters*) de forma totalmente autônoma.
*   *Exemplo:* Um robô analisando fotos de cães pequenos e cães grandes e agrupando-os por tamanho sem saber os nomes das raças.

#### 3. Aprendizado por Reforço
O agente interage diretamente com um ambiente dinâmico. Por meio de tentativa, erro e uma função de pontuação, ele recebe recompensas por acertos e punições por falhas.
*   *Exemplo:* O adestramento de um cão por meio de petiscos. Na computação, esse pilar levou à vitória histórica do sistema **AlphaGo contra o campeão mundial Lee Sedol (2016)** no jogo de Go.

---

### 🎥 Vídeo de Consolidação
Assista ao vídeo em Modo Cinema para dominar os fundamentos do Machine Learning e desbloquear o círculo central de **Deep Learning**:
`
  },
  dl: {
    titulo: "Deep Learning (DL) 🧠",
    urlVideo: "https://www.youtube.com/watch?v=ggmDI9_fm54",
    markdown: `
O **Deep Learning (Aprendizado Profundo)** é um subconjunto do Machine Learning especializado no uso de redes neurais profundas (redes com múltiplas camadas escondidas de neurônios artificiais) para modelar e resolver tarefas complexas diretamente a partir de dados brutos.

---

### 🛠️ O Fim da Engenharia Manual de Variáveis
No ML clássico, um engenheiro humano precisa extrair e selecionar manualmente quais variáveis o algoritmo deve analisar (como diâmetro ou ângulos de um objeto). O Deep Learning resolve isso de forma automatizada: ao empilhar camadas de neurônios artificiais, as primeiras detectam padrões visuais básicos (linhas e bordas) e as últimas as consolidam em abstrações complexas (rostos ou placas de trânsito).

---

### 🧠 A Estrutura do Perceptron e Redes Neurais
O componente fundamental é o **Perceptron**, criado em 1950 por Frank Rosenblatt como modelo simplificado de um neurônio biológico:
*   **Inputs (Entradas):** Estímulos numéricos recebidos.
*   **Pesos (Weights):** Multiplicadores dinâmicos que regulam a força de cada entrada.
*   **Função de Ativação:** O núcleo não-linear que calcula o disparo do sinal.
*   **Backpropagation (Retropropagação):** Algoritmo que recebe o feedback de erro ao final da rede e ajusta as conexões de trás para frente para otimizar os palpites lógicos.

---

### 📦 A Caixa Preta e os Transformers
*   **O Paradoxo da Caixa Preta:** Com bilhões de cálculos lineares e não-lineares integrados em redes profundas, torna-se muito complexo decifrar matematicamente a trilha lógica exata de cada decisão do modelo.
*   **A Era dos Transformers:** Em 2017, o Google publica o artigo científico *"Attention Is All You Need"*, criando a arquitetura de Transformers. Essa estrutura de deep learning é a base que dá vida à **IA Generativa** moderna (como o ChatGPT e LLMs), gerando textos e imagens de altíssimo nível.

---

### 🎥 Vídeo de Consolidação
Assista ao vídeo em Modo Cinema sobre redes neurais e Deep Learning para concluir o passo interativo e liberar o botão de avançar na lição:
`
  }
};
