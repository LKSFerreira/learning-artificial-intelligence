# Redesenho do Player e Controle de Download Seguro

Refatoração completa do design do player de áudio para elevar a interface para um padrão premium responsivo (estilo glassmorphism), com suporte a título dinâmico da lição, equalizador animado de status, controle de velocidade inline estável, dropdown de vozes alinhado e segurança física no download de arquivos.

## Contexto e Motivação

O player de áudio anterior possuía um design excessivamente simplista e apresentava desalinhamentos na barra de progresso (timeline). Além disso:
1. **Quebras de Layout no Menu de Vozes:** O dropdown customizado de vozes quebrava os nomes das vozes em duas linhas (ex: "Kore -" e "Feminina" em linhas separadas) e apresentava desalinhamento em relação ao botão de ativação.
2. **Downloads Fantasmas (404):** Se o áudio físico MP3 correspondente à lição/voz selecionada não existisse no servidor, o botão de download tentava baixar o arquivo mesmo assim. Isso resultava na criação de arquivos MP3 inválidos (contendo o HTML da resposta 404 do Single Page Application do React).

## O que foi implementado

### 1. Design Premium Glassmorphism
*   **Aparência Visual:** Fundo translúcido com forte desfoque de fundo (`backdrop-blur-xl bg-slate-950/70`), bordas finas com brilho e efeito de glow superior em gradiente.
*   **Título Dinâmico:** Exibição do título real da lição (`titulo`) em vez de rótulo fixo. O texto é truncado automaticamente se for muito longo e mostra o conteúdo integral em hover.
*   **Equalizador de Voz:** Animação gráfica baseada em ondas CSS/SVG que pulsa sutilmente ao lado do título da lição ativa quando o áudio está sendo executado.

### 2. Controles Inline e Simetria de Timeline
*   **Velocidade Inline (+ / -):** Substituímos o popover flutuante (que causava cortes de layout no rodapé) por seletores inline integrados com passo de `0.25` e exibição de valor em fonte mono refinada.
*   **Ajuste das Extremidades da Timeline:** Definimos larguras fixas idênticas para a minutagem atual (`w-10 text-left`) e total (`w-10 text-right`), garantindo que o canal da timeline (`flex-1`) fique perfeitamente simétrico e centrado sem sobras de espaço no card.

### 3. Combobox de Vozes Alinhada Paralelamente
*   **Largura e Sem Quebra (w-44):** Fixamos a largura do botão em `w-44` (176px) e adicionamos `whitespace-nowrap`, mantendo nomes longos como "Kore - Feminina" dispostos perfeitamente em linha única.
*   **Alinhamento do Dropdown:** Ajustamos a classe do dropdown absoluto para `left-0 w-full` (relativo ao wrapper `.relative` do botão). Com isso, as opções de vozes ficam dispostas paralelamente logo abaixo do botão e com a mesma largura do botão.
*   **Truncamento Seguro:** Adicionamos `truncate` aos textos internos do dropdown para blindar o design.

### 4. Bloqueio Físico de Downloads Vazios
*   **Validação via HEAD:** O player faz um request assíncrono leve do tipo `HEAD` assim que a lição ou voz muda para testar a existência do arquivo no servidor.
*   **Download Bloqueado:** Se o arquivo não existir (404), o botão de download é desabilitado (`disabled={disponivel !== true}`), recebe estilo opaco (`cursor-not-allowed`) e a função `handleDownload` é fisicamente desativada do clique (`onClick={disponivel === true ? handleDownload : undefined}`) e aborta a execução (`if (!audioUrl || disponivel !== true) return;`), impedindo a gravação de arquivos inválidos.

---

## Validação e Qualidade de Código

*   **TypeScript:** Compilação estrita e limpa de ponta a ponta sem nenhum warning ou erro.
*   **Interface:** Layout 100% responsivo validado em desktop e mobile, livre de cortes, transbordamentos ou quebras de texto.
