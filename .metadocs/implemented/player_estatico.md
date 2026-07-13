# Player de Áudio Estático e Geração Offline de Voz com Gemini

Migração da síntese de voz em tempo real executada no cliente para um sistema híbrido com reprodução estática de MP3 no player frontend e geração offline controlada por scripts CLI em Node.js no backend/máquina de desenvolvimento.

## Contexto e Motivação

Anteriormente, o sistema utilizava o padrão Strategy para gerenciar múltiplos provedores de TTS (Gemini, OpenRouter, Groq) em tempo de execução no navegador. Isso trazia diversas complicações de UX e engenharia de software:
1. **CORS e Erros de Rede:** As APIs de provedores exigiam proxies ou causavam falhas de CORS ao serem chamadas diretamente do navegador do usuário.
2. **Segurança de Chaves:** Exigia que o usuário inserisse e salvasse chaves de API confidenciais (`GEMINI_API_KEY`, etc.) no localStorage local, o que é inseguro para deploys em produção.
3. **Bloqueio de CPU e Timeouts:** O processo de conversão em tempo real de WAV PCM bruto (retornado pelo Gemini) para MP3 a 128kbps usando a biblioteca `lamejs` síncrona bloqueava a thread principal do JavaScript. Isso causava timeout do WebSocket HMR do Vite e forçava recarregamentos abruptos na tela do desenvolvedor.
4. **Qualidade de Voz e Custos do OpenRouter:** Vozes de português para o modelo Kokoro 82M do OpenRouter eram robóticas ou incompatíveis, e o provedor exigia saldo em créditos pré-pagos mesmo para testes leves de voz.

A mudança para áudio estático simplifica a interface do aluno e torna a geração dos recursos didáticos escalável e segura.

## O que foi implementado

### 1. Novo Diretório e Ferramentas CLI
Criamos a pasta `/sintetizar/` na raiz do projeto com ferramentas autônomas de desenvolvimento:
* **`sintetizar.md`:** Arquivo onde o desenvolvedor cola o conteúdo em Markdown do passo a ser narrado.
* **`sintetizar.js`:** Script em Node.js (ES Modules) que limpa o Markdown (removendo códigos, imagens, negritos), faz o request oficial usando o SDK `@google/genai` (v2.11.0) para o modelo `gemini-3.1-flash-tts-preview` e recebe o áudio PCM cru retornado pela API. A compressão para MP3 a 128kbps Mono é feita no próprio script pela função `converterPcmParaMp3Buffer` (codificador `lamejs`), sem etapa intermediária de arquivo WAV.

### 2. Player de Áudio Simplificado (`PlayerAudioIA.tsx`)
* Removidos modais, botões de engrenagem de configurações, fluxos de persistência e validação de chaves locais do navegador.
* O componente agora aceita as propriedades `faseId` e `passoIndice`. Ele resolve a rota do áudio estaticamente no padrão de nomenclatura: `/audios/fase_{faseId}_passo_{passoIndice}_{voz}.mp3`.
* Suporta a seleção de duas vozes oficiais em português do Gemini: **Aoede** e **Kore**.
* Se o arquivo de áudio estático correspondente na pasta `/public/audios/` não existir, o player dispara um tratamento elegante com o aviso de `Áudio indisponível para esta lição (não gerado).`
* Minutagem consolidada no formato solicitado: `00:00:32/00:03:35` ao lado do controle deslizável.
* Download direto do arquivo MP3 estático usando um nome padronizado (ex: `Fase 1 - Passo 1 (Aoede).mp3`).

### 3. Remoção de Código Morto
* Deletados provedores dinâmicos obsoletos: `provedorGemini.ts`, `provedorOpenRouter.ts`, `provedorGroq.ts`.
* Removidos tipos e utilitários sem uso: `conversorMp3.ts` e `lamejs.d.ts`.
* Refatorado `gerenciadorAudio.ts` para atuar apenas como resolvedor de caminhos estáticos e fornecedor de vozes válidas.

---

## Validação e Qualidade de Código

* Executada verificação estrita de compilação com `npx tsc --noEmit` retornando **zero erros e zero warnings** em todo o workspace.
* Teste local do script CLI `node sintetizar/sintetizar.js` validando corretamente os erros de ambiente e orientando o desenvolvedor a configurar a variável `GEMINI_API_KEY` caso vazia.
