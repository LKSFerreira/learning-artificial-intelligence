# Histórico

Registre aqui entregas concluídas, decisões importantes e links para `.metadocs/implemented/`.

## Entradas

### 2026-07-13 — Correção de Sobreposição no Dropdown de Vozes do Player ✅

- Correção do Stacking Context no player de áudio (`PlayerAudioIA.tsx`): ajustado o `z-index` do contêiner superior do player de `z-10` para `z-20`. Isso impede que elementos irmãos renderizados depois no DOM (como a linha do tempo e a caixa de alertas de erro de áudio indisponível, que usam `z-10`) sobreponham o menu dropdown de seleção de vozes.
- **Aprimoramento Pedagógico**: Refatoração profunda e enriquecimento conceitual do passo 2 da Fase 1 (`02-hierarchy.md`), adicionando rigor acadêmico aos acrônimos de IA, ML, DL e RL na primeira ocorrência e contextualizando o cenário pré-1956. Também foram estruturadas explicações didáticas detalhando os três pilares do Aprendizado de Máquina (Supervisionado, por Reforço e Não Supervisionado) e o posicionamento da Inteligência Artificial Generativa como subconjunto evoluído do Deep Learning (DL) para modelos de síntese.
- **Melhoria Estética e Escaneabilidade**: Reestruturado o arquivo `02-hierarchy.md` para torná-lo visualmente mais leve e estruturado, reduzindo parágrafos longos por blocos no estilo de cards informativos (Conceito, Exemplo, Conexão), utilizando blocos de citação (`>`) e adicionando um diagrama Mermaid visual para representar o roadmap prático de aprendizado do curso. O pilar de Aprendizado por Reforço (RL) foi movido para o meio das definições de ML, conforme especificação.
- **Estruturação de Mídia**: Adicionada a propriedade de controle `urlVideo` no frontmatter de `02-hierarchy.md` para integrar um vídeo complementar do YouTube no componente de layout.

### 2026-07-13 — Sintetizador CLI Interativo, Organização por Vozes e Refinamentos de UI/UX ✅

- Refatoração do script `sintetizar.js` com menu CLI interativo em cores ANSI 256, suporte a geração por lote, seleção de lições específicas, teste avulso e Spinner animado de requisição com tempo decorrido.
- Reestruturação do diretório de áudios em subpastas por voz (`public/audios/Aoede/` e `public/audios/Kore/`), com rotina de migração automática dos arquivos antigos desorganizados e atualização do gerenciador de caminhos estáticos (`gerenciadorAudio.ts`).
- Correção de bugs de comunicação do payload do Gemini TTS (remoção do `voiceConfig` e da modalidade `AUDIO` incompatíveis com o SDK `@google/genai` no endpoint de interações).
- Aprimoramento da detecção de arquivos concluídos baseando-se no disco (tamanho do arquivo físico > 0) e sincronização automática em background com o cache `mapa_sintese.json`.
- Refinamento do controle de velocidade do player de áudio React (`PlayerAudioIA.tsx`) para passos de `0.20` e eliminação de números mágicos por constantes estruturadas.
- Otimização do leitor de Markdown (`ConteudoMarkdown.tsx` e `index.css`) com suporte a links que abrem em outra aba (`target="_blank"`) e restauração do contraste de cores em cabeçalhos, negritos, blockquotes e códigos para compatibilidade com o Tema Escuro.
- Enriquecimento histórico e didático da lição inicial (`01-intro.md`) com a inclusão de tags HTML especiais `<!-- audio-skip-start/end -->` para pular a síntese de links bibliográficos complexos e leituras recomendadas.

### 2026-07-13 — Redesenho do Player e Controle de Download Seguro ✅

- Refatoração do design visual do player de áudio IA usando glassmorphism com fundo desfocado (`backdrop-blur-xl bg-slate-950/70`), bordas finas com brilho e efeito de glow superior em gradiente.
- Implementação de título dinâmico da lição (`titulo`) com truncamento em telas menores e equalizador de voz animado pulsante baseado em CSS/SVG ao lado da lição ativa.
- Substituição do controle de velocidade de áudio por seletores inline de incrementos rápidos (+ / - de 0.25).
- Correção de desalinhamento geométrico na barra de progresso (timeline) na base do card definindo larguras simétricas idênticas (`w-10 text-left` e `w-10 text-right`) para as minutagens da esquerda e direita.
- Correção do dropdown de vozes para possuir largura fixa (`w-44`) idêntica ao botão e alinhamento paralelo diretamente abaixo dele (`left-0 w-full`).
- Implementação de bloqueio de download fantasma na função `handleDownload` e no JSX (`onClick`) se o áudio não existir fisicamente no servidor (404), desativando o botão e mostrando o cursor `cursor-not-allowed`.
- Detalhes de implementação e arquitetura em [.metadocs/implemented/redesenho_player_premium.md](.metadocs/implemented/redesenho_player_premium.md).

### 2026-07-13 — Player de Áudio Estático e Geração Offline de Voz com Gemini ✅

- Removida a lógica de geração de áudio por IA em tempo real e gerenciamento de chaves de API locais no frontend (Vite/React).
- Player de áudio simplificado para carregar arquivos MP3 estáticos locais seguindo o formato `/public/audios/fase_{faseId}_passo_{passoIndice}_{voz}.mp3`.
- Adicionado controle refinado de velocidade (+/- de 0.25 em 0.25), minutagem unificada (`00:00:32/00:03:35`) e download dinâmico de arquivos estáticos.
- Criada a pasta `sintetizar/` com script em Node.js (`sintetizar.js`) que lê arquivos Markdown, gera o áudio pelo Gemini e compacta em MP3 a 128kbps localmente usando `lamejs` (função `converterPcmParaMp3Buffer`).
- Deletados arquivos de provedores, tipos e conversores sem uso (`provedorGemini.ts`, `provedorOpenRouter.ts`, `provedorGroq.ts`, `conversorMp3.ts`, `lamejs.d.ts`), mantendo o build verde.
- Detalhes de implementação e arquitetura em [.metadocs/implemented/player_estatico.md](.metadocs/implemented/player_estatico.md).

### 2026-07-13 — Correção de Tipagem Vite e Resolução de Erros TypeScript ✅

- Adicionados tipos do cliente Vite (`vite/client`) nas `compilerOptions` do `tsconfig.json`, resolvendo erro de propriedade `glob` inexistente em `import.meta`.
- Limpos imports redundantes de `React` em componentes (BadgeItem, SistemaBadges, ConteudoMarkdown, SecaoTutorIA, ModalResetProgresso, BotoesNavegacao, TelaQuiz, ContextoBadges) de acordo com o JSX transform moderno.
- Removidos imports de ícones e tipos não utilizados (`RotateCcw`, `ChevronRight`, `Badge`), resultando em compilação TypeScript limpa com zero erros no typecheck (`npx tsc --noEmit`).
- Realizada a limpeza sistemática de travessões longos (`—`) em todas as lições markdown da plataforma (Fases 1, 2 e 3) e arquivos técnicos do loader.

### 2026-07-13 — Modo Cinema, Correção de Embed e Otimização de Layout ✅

- Substituídos travessões por vírgulas em `src/conteudo/fase-1-fundamentos/01-intro.md` para fluidez do conteúdo.
- Refatorado componente `ConteudoVideo.tsx` para usar o domínio de privacidade `youtube-nocookie.com/embed/`, resolvendo o erro 152-4 gerado por ad-blockers.
- Criada modal imersiva responsiva com tamanho dinâmico proporcional (`w-[min(95vw,160vh)]`), backdrop com desfoque de vidro, fechamento por clique fora ou tecla `Escape` (Esc) e autoplay ativo.
- Ampliada a área central de leitura do conteúdo em `AreaConteudoPrincipal.tsx` de `max-w-xl` para `max-w-4xl` e reduzidos paddings laterais.
- Adicionado diagnóstico detalhado em `.metadocs/postmortem/152-4-embed-youtube.md`.
- Detalhes de implementação em `.metadocs/implemented/video_cinema_layout.md`.

### 2026-07-13 — Correção Geral de Inconsistências (Auditoria Completa) ✅

- Ajustada a conclusão da Fase 3 e implementado bloqueio de bypass de fase em `ContextoProgresso.tsx`.
- Refatorado hook `useSincronizacaoRota` para suportar histórico e botão voltar/avançar de forma limpa.
- Adicionado reset de tentativas de quiz por fase para destravar o badge "Prodígio".
- Substituída renderização inline por componentes estruturados (`ConteudoMarkdown`, `ConteudoVideo`, `CartaoQuiz`).
- Integrada a seleção da hierarquia de Venn com o desbloqueio do badge "Explorador".
- Deletado código morto órfão (Visualizadores de fase velhos, ContextoQuiz redundante e funções de persistência sem uso).
- Habilitado TypeScript estrito, instalados `@types/react` / `@types/react-dom` e corrigidos warnings e tipagens.
- Detalhes técnicos e validação em [.metadocs/implemented/correcao_inconsistencias.md](.metadocs/implemented/correcao_inconsistencias.md).

### 2024-12-24 — Fase A1: Refatoração e Arquitetura Limpa ✅

- Extraída lógica do `App.tsx` para Hooks customizados (`useNavegacao`, `useQuiz`, `useTutorIA`).
- Criados Contextos (`ContextoProgresso`, `ContextoBadges`, `ContextoQuiz`).
- Separados dados (conteúdo) da apresentação (componentes).
- `App.tsx` reduzido de ~648 para ~110 linhas.
- Modularizados `BarraLateralFases.tsx` e `AreaConteudoPrincipal.tsx`.
- Quebrados `Phase1Visual`, `Phase2Visual`, `Phase3Visual` em sub-componentes.
- Deletados arquivos legados (`curriculoLegado.ts`, `BadgeSystemLegado.tsx`).

### 2026-06-28 — Fase R0: Limpeza e Verdade Documental

- Definido `LINGUAGEM_PROJETO: JavaScript/TypeScript` em todos os agentes.
- Corrigido link do roadmap no `README.md`.
- Criado `docs/filosofia_conteudo.md` (farol guia do conteúdo).
- Criado plano de reestruturação R0–R6 em `.metadocs/` (depois promovido para `implemented/reestruturacao_plataforma.md`).
- Removido código de migração legado e aliases em inglês.
- Desmarcado T0.1 Docker no roadmap (não existe no repositório).

### 2026-07-12 — Verdade documental: B0 absorvida pela B1 + escopo real

- Confirmado no conteúdo real: a gênese/história da IA já está em `fase-1-fundamentos` (`01-intro.md`, hierarquia, DL/ImageNet, vídeo), alinhada a `docs/filosofia_conteudo.md`.
- Removida a ideia de **B0 “A CRIAR”** como fase separada no `ROADMAP.md` e no `README.md` (evita inconsistência com o currículo já publicado).
- Reescrito `.metadocs/escopo.md` para separar o que **existe hoje** do que é **futuro** (sem stack/fullstack inventados).
- Promovido o plano R para `.metadocs/implemented/reestruturacao_plataforma.md` com árvore de pastas real.

### 2026-07-06 — Reestruturação de Arquitetura e Conteúdo (R1–R6) ✅

- **R1: Decomposição de Componentes**: Desmembrados `AreaConteudoPrincipal.tsx` e `BarraLateralFases.tsx` em subcomponentes focados e com responsabilidade única (`TelaQuiz`, `PainelVisual`, `SeletorTema`, `NavegacaoFases`).
- **R2: Separação de Conteúdo**: Todo o conteúdo das lições foi extraído de arquivos `.ts` para arquivos `.md` estruturados com frontmatter dentro de `src/conteudo/`.
- **R3: Registro Dinâmico de Visuais**: Substituído o fluxo baseado em `switch(faseId)` por um mapa centralizado em `src/componentes/visuais/registroVisuais.tsx`.
- **R4: Roteamento Integrado**: Implementado `react-router-dom` para navegação nativa via URL.
- **R5: Reescrita de Conteúdo**: Toda a trilha de aprendizado foi enriquecida com profundidade histórica, contexto narrativo e analogias precisas seguindo a filosofia educativa.
- **R6: Documentação e Polimento**: Roadmap, histórico e metadocs alinhados ao estado real; timelines clicáveis, loader por `ordem` no frontmatter e vídeos complementares. Detalhes em [.metadocs/implemented/reestruturacao_plataforma.md](.metadocs/implemented/reestruturacao_plataforma.md).

### 2026-07-12 — Sincronização: inconsistências documentais e de referência

- Removidas referências a `.agents/rules/docker.md` e skill `/docker` em `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` e `.github/copilot-instructions.md` (arquivos inexistentes; Docker não está no repo).
- `README.md`: stack **agora** vs **planejada**; resumo de trilhas alinhado ao gate B1–B3.
- `ROADMAP.md`: A2.0 (remontar badges na UI); A4.2 base Gemini marcada como entregue + A4.2b futuro; T0 sem Pytest inventado; A3.4 Docker opcional explícito.
- `.env.example` com `GEMINI_API_KEY`; comentários de fallback legado em `src/dados/curriculo/`; `vite.config.ts` sem implicar Docker no projeto.
- `docs/fase_*.md` marcados como apoio (fonte de verdade = `src/conteudo/`).
- `.metadocs/escopo.md` e registro R atualizados para a mesma verdade.
- `servicoGemini.ts`: leitura prioritária de `GEMINI_API_KEY` (alinhada ao `vite.config.ts`).


