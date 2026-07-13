import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import vm from "vm";
import readline from "readline/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores ANSI Estendidas (256 Cores) para design ultra-premium
const C_RESET = "\x1b[0m";
const C_BOLD = "\x1b[1m";
const C_DIM = "\x1b[2m";
const C_UNDERLINE = "\x1b[4m";

const FG_INDIGO = "\x1b[38;5;63m";
const FG_VIOLET = "\x1b[38;5;99m";
const FG_CYAN = "\x1b[38;5;45m";
const FG_GREEN = "\x1b[38;5;78m";
const FG_YELLOW = "\x1b[38;5;220m";
const FG_RED = "\x1b[38;5;203m";
const FG_GRAY = "\x1b[38;5;244m";
const FG_DARK_GRAY = "\x1b[38;5;238m";

const BG_VIOLET = "\x1b[48;5;99m\x1b[38;5;255m";
const BG_DARK = "\x1b[48;5;234m";

// 1. Carrega manualmente o arquivo .env da raiz do projeto para compatibilidade universal
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts
        .slice(1)
        .join("=")
        .trim()
        .replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  });
}

// Inicializa a chave do Gemini a partir do .env
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// 2. Carrega o lame.min.js em uma sandbox isolada
const lamePath = path.join(__dirname, "../node_modules/lamejs/lame.min.js");
if (!fs.existsSync(lamePath)) {
  console.error(
    `${FG_RED}${C_BOLD}✖ ERRO: O pacote lamejs não está instalado no node_modules. Rode npm install primeiro.${C_RESET}`,
  );
  process.exit(1);
}
const lameCode = fs.readFileSync(lamePath, "utf-8");
const sandbox = {
  window: {},
  global: {},
  exports: {},
  module: { exports: {} },
};
vm.createContext(sandbox);
vm.runInContext(lameCode, sandbox);
const { Mp3Encoder } = sandbox.lamejs;

// Função para remover emojis e caracteres especiais do título
function limparEmojis(texto) {
  if (!texto) return "";
  return texto
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2192}\uFE00-\uFE0F]/gu,
      "",
    )
    .trim();
}

// Função para limpar marcações markdown do texto
function limparMarkdownParaLeitura(markdown) {
  if (!markdown) return "";
  let texto = markdown;
  // Remove blocos marcados para serem ignorados no áudio (ex: referências, tabelas visuais)
  texto = texto.replace(/<!-- audio-skip-start -->[\s\S]*?<!-- audio-skip-end -->/g, "");
  texto = texto.replace(/```[\s\S]*?```/g, " (exemplo de código omitido) ");
  texto = texto.replace(/`([^`]+)`/g, "$1");
  texto = texto.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  texto = texto.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  texto = texto.replace(/^#+\s+(.+)$/gm, "$1");
  texto = texto.replace(/\*\*([^*]+)\*\*/g, "$1");
  texto = texto.replace(/\*([^*]+)\*/g, "$1");
  texto = texto.replace(/__([^_]+)__/g, "$1");
  texto = texto.replace(/_([^_]+)_/g, "$1");
  texto = texto.replace(/^[\s]*[*+-]\s+/gm, "");
  texto = texto.replace(/^[\s]*\d+\.\s+/gm, "");
  texto = texto.replace(/^[\s]*>\s+/gm, "");
  texto = texto.replace(/\n+/g, " ");
  texto = texto.replace(/\s+/g, " ");
  return texto.trim();
}

// Converte bytes PCM para Buffer MP3
function converterPcmParaMp3Buffer(pcmData, sampleRate) {
  const buffer = pcmData.buffer;
  const offset = pcmData.byteOffset;
  const length = pcmData.byteLength / 2;
  const amostras = new Int16Array(buffer, offset, length);

  const encoder = new Mp3Encoder(1, sampleRate, 128); // 1 canal, 24000Hz, 128kbps
  const mp3Chunks = [];

  const tamanhoBloco = 1152;
  for (let i = 0; i < amostras.length; i += tamanhoBloco) {
    const bloco = amostras.subarray(i, i + tamanhoBloco);
    const mp3Buffer = encoder.encodeBuffer(bloco);
    if (mp3Buffer.length > 0) {
      mp3Chunks.push(Buffer.from(mp3Buffer));
    }
  }

  const finalBuffer = encoder.flush();
  if (finalBuffer.length > 0) {
    mp3Chunks.push(Buffer.from(finalBuffer));
  }

  return Buffer.concat(mp3Chunks);
}

// Extrai metadados do frontmatter markdown
function extrairMetadadosMarkdown(conteudo) {
  const match = conteudo.match(/^---([\s\S]*?)---/);
  if (!match) return null;

  const yamlContent = match[1];
  const metadados = {};

  yamlContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const indexDoDoisPontos = trimmed.indexOf(":");
    if (indexDoDoisPontos !== -1) {
      const key = trimmed.substring(0, indexDoDoisPontos).trim();
      const val = trimmed
        .substring(indexDoDoisPontos + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      metadados[key] = val;
    }
  });

  return metadados;
}

// Varre a pasta de conteúdos recursivamente
function buscarArquivosMarkdown(dir, arquivos = []) {
  const itens = fs.readdirSync(dir);
  for (const item of itens) {
    const caminhoCompleto = path.join(dir, item);
    const stat = fs.statSync(caminhoCompleto);
    if (stat.isDirectory()) {
      buscarArquivosMarkdown(caminhoCompleto, arquivos);
    } else if (stat.isFile() && item.endsWith(".md")) {
      arquivos.push(caminhoCompleto);
    }
  }
  return arquivos;
}

// Helpers de validação de input de menu para evitar travamentos ou dados errados
async function perguntarOpcaoNumerica(rl, promptText, maxOpcao, padrao = 1) {
  while (true) {
    const input = await rl.question(promptText);
    const trimmed = input.trim();
    if (trimmed === "") return padrao;
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num >= 0 && num <= maxOpcao) {
      return num;
    }
    console.log(
      `  ${FG_RED}⚠ Opção inválida! Digite um número válido entre 0 e ${maxOpcao}.${C_RESET}`,
    );
  }
}

async function perguntarLimiteLicoes(rl, promptText, padrao = 2) {
  while (true) {
    const input = await rl.question(promptText);
    const trimmed = input.trim();
    if (trimmed === "") return padrao;
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num > 0) {
      return num;
    }
    console.log(
      `  ${FG_RED}⚠ Entrada inválida! Digite um número de lições maior que 0.${C_RESET}`,
    );
  }
}

async function perguntarEscolhaLicoes(rl, maxIndex, licoes) {
  while (true) {
    const input = await rl.question(
      `\n  ${C_BOLD}Selecione os números das lições (ex: 1,3) ou digite "todas": ${C_RESET}`,
    );
    const trimmed = input.trim().toLowerCase();

    if (trimmed === "todas") {
      return licoes;
    }

    if (trimmed === "") {
      console.log(
        `  ${FG_YELLOW}⚠ Nenhuma lição selecionada. Tente novamente.${C_RESET}`,
      );
      continue;
    }

    const partes = trimmed.split(",");
    const selecionadas = [];
    let erroDetectado = false;

    for (const parte of partes) {
      const idx = parseInt(parte.trim(), 10);
      if (isNaN(idx) || idx < 1 || idx > maxIndex) {
        console.log(
          `  ${FG_RED}⚠ Número inválido: "${parte.trim()}". Digite apenas números de 1 a ${maxIndex}.${C_RESET}`,
        );
        erroDetectado = true;
        break;
      }
      selecionadas.push(licoes[idx - 1]);
    }

    if (!erroDetectado && selecionadas.length > 0) {
      // Remove duplicatas se houver
      return [...new Set(selecionadas)];
    }
  }
}

async function perguntarArquivoTeste(rl) {
  while (true) {
    const input = await rl.question(
      `\n  ${C_BOLD}Caminho do arquivo Markdown (ou digite "voltar" para retornar): ${C_RESET}`,
    );
    const trimmed = input.trim();
    if (trimmed.toLowerCase() === "voltar") return null;

    if (fs.existsSync(trimmed)) {
      const stat = fs.statSync(trimmed);
      if (stat.isFile()) {
        return trimmed;
      }
    }
    console.log(
      `  ${FG_RED}⚠ Arquivo não encontrado no caminho: "${trimmed}". Certifique-se de digitar o caminho correto (ex: sintetizar/sintetizar.md).${C_RESET}`,
    );
  }
}

// Helper de spinner de terminal animado para UX em requisições demoradas da API do Gemini
function iniciarSpinner(mensagem) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let frameIndex = 0;
  const tempoInicio = Date.now();

  process.stdout.write(`  • ${mensagem} ${frames[frameIndex]} (0.0s)`);

  const timer = setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.length;
    const decorrido = ((Date.now() - tempoInicio) / 1000).toFixed(1);
    process.stdout.write(`\r\x1b[K  • ${mensagem} \x1b[38;5;99m${frames[frameIndex]}\x1b[0m (${decorrido}s)`);
  }, 100);

  return {
    parar: (sucesso = true) => {
      clearInterval(timer);
      const decorridoFinal = ((Date.now() - tempoInicio) / 1000).toFixed(1);
      if (sucesso) {
        process.stdout.write(`\r\x1b[K  • ${mensagem} \x1b[38;5;78m✔ Concluído!\x1b[0m (${decorridoFinal}s)\n`);
      } else {
        process.stdout.write(`\r\x1b[K  • ${mensagem} \x1b[38;5;203m✖ Falhou!\x1b[0m (${decorridoFinal}s)\n`);
      }
    },
  };
}

// Lógica principal
async function main() {
  if (!apiKey) {
    console.error(
      `\n  ${FG_RED}✖ ERRO: A variável de ambiente GEMINI_API_KEY não foi encontrada.${C_RESET}`,
    );
    console.error(
      "  Certifique-se de configurar GEMINI_API_KEY no seu arquivo .env na raiz do projeto.\n",
    );
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const dirConteudo = path.join(__dirname, "../src/conteudo");
  const dirPublicAudios = path.join(__dirname, "../public/audios");
  const mapaCaminho = path.join(__dirname, "mapa_sintese.json");

  fs.mkdirSync(dirPublicAudios, { recursive: true });

  let mapa = {};
  if (fs.existsSync(mapaCaminho)) {
    try {
      mapa = JSON.parse(fs.readFileSync(mapaCaminho, "utf-8"));
    } catch {
      mapa = {};
    }
  }

  // Loop de navegação do menu interativo
  while (true) {
    console.clear();
    console.log(
      `\n  ${FG_VIOLET}╔══════════════════════════════════════════════════════════╗${C_RESET}`,
    );
    console.log(
      `  ${FG_VIOLET}║${C_RESET}   ${C_BOLD}🔊  APRENDENDO IA — SINTETIZADOR DE VOZ INTERATIVO${C_RESET}     ${FG_VIOLET}║${C_RESET}`,
    );
    console.log(
      `  ${FG_VIOLET}╚══════════════════════════════════════════════════════════╝${C_RESET}`,
    );

    // Varre e mapeia os arquivos de conteúdo
    const todosArquivos = buscarArquivosMarkdown(dirConteudo);
    const licoesComVozesFaltantes = [];
    let totalLicoesMapeadas = 0;

    todosArquivos.forEach((arqPath) => {
      const conteudo = fs.readFileSync(arqPath, "utf-8");
      const metadados = extrairMetadadosMarkdown(conteudo);

      if (metadados && metadados.tipo === "content" && metadados.id) {
        totalLicoesMapeadas++;
        const id = metadados.id;
        const titulo = metadados.titulo || "";
        const corpoMarkdown = conteudo.replace(/^---[\s\S]*?---/, "").trim();

        const vozesFaltantes = [];
        ["Aoede", "Kore"].forEach((voz) => {
          const dirVoz = path.join(dirPublicAudios, voz);
          const nomeArquivoNovo = `${id}.mp3`;
          const caminhoArquivoNovo = path.join(dirVoz, nomeArquivoNovo);

          // Migração automática de arquivos antigos desorganizados
          const nomeArquivoAntigo = `${id}_${voz}.mp3`;
          const caminhoArquivoAntigo = path.join(dirPublicAudios, nomeArquivoAntigo);

          if (fs.existsSync(caminhoArquivoAntigo) && !fs.existsSync(caminhoArquivoNovo)) {
            fs.mkdirSync(dirVoz, { recursive: true });
            fs.renameSync(caminhoArquivoAntigo, caminhoArquivoNovo);
          }

          const jaExisteFisico = fs.existsSync(caminhoArquivoNovo) && fs.statSync(caminhoArquivoNovo).size > 0;

          if (jaExisteFisico) {
            if (!mapa[id]) mapa[id] = {};
            if (!mapa[id][voz]) {
              mapa[id][voz] = true;
              fs.writeFileSync(mapaCaminho, JSON.stringify(mapa, null, 2));
            }
          }

          const jaSintetizado = jaExisteFisico;

          if (!jaSintetizado) {
            vozesFaltantes.push({
              voz,
              nomeArquivoFinal: nomeArquivoNovo,
              caminhoArquivoFinal: caminhoArquivoNovo,
            });
          }
        });

        if (vozesFaltantes.length > 0) {
          licoesComVozesFaltantes.push({
            id,
            titulo,
            corpoMarkdown,
            vozes: vozesFaltantes,
          });
        }
      }
    });

    const licoesCompletasCount =
      totalLicoesMapeadas - licoesComVozesFaltantes.length;

    // Barra de Progresso Visual de Áudio da Plataforma (Matematicamente Simétrica)
    const porcentagem =
      totalLicoesMapeadas > 0
        ? Math.round((licoesCompletasCount / totalLicoesMapeadas) * 100)
        : 0;
    const tamanhoBarra = 25;
    const preenchido = Math.round((porcentagem / 100) * tamanhoBarra);
    const vazio = tamanhoBarra - preenchido;
    const barraStr = `${FG_GREEN}${"█".repeat(preenchido)}${FG_DARK_GRAY}${"░".repeat(vazio)}${C_RESET}`;

    console.log(`\n  ${C_BOLD}📊 STATUS DA PLATAFORMA:${C_RESET}`);
    console.log(`  ┌${"─".repeat(58)}┐`);
    console.log(
      `  │  • Lições Mapeadas:  ${FG_CYAN}${totalLicoesMapeadas.toString().padEnd(36)}${C_RESET}│`,
    );
    console.log(
      `  │  • Lições Completas: ${FG_GREEN}${licoesCompletasCount.toString().padEnd(3)}${C_RESET}[${barraStr}] ${porcentagem.toString().padStart(3)}% │`,
    );
    console.log(
      `  │  • Lições Pendentes: ${licoesComVozesFaltantes.length > 0 ? FG_YELLOW : FG_GREEN}${licoesComVozesFaltantes.length.toString().padEnd(36)}${C_RESET}│`,
    );
    console.log(`  └${"─".repeat(58)}┘`);

    console.log(`\n  ${C_BOLD}✨ SELECIONE UMA AÇÃO:${C_RESET}`);
    console.log(
      `  ${FG_DARK_GRAY}────────────────────────────────────────────────────────────${C_RESET}`,
    );
    console.log(
      `  [${FG_CYAN}1${C_RESET}] 🚀 ${C_BOLD}Geração Automática em Lote${C_RESET}`,
    );
    console.log(
      `      ${FG_GRAY}Sintetiza as vozes para as primeiras lições pendentes.${C_RESET}\n`,
    );
    console.log(
      `  [${FG_CYAN}2${C_RESET}] 🎯 ${C_BOLD}Selecionar Lições Específicas${C_RESET}`,
    );
    console.log(
      `      ${FG_GRAY}Escolha manualmente quais lições e vozes deseja gerar.${C_RESET}\n`,
    );
    console.log(
      `  [${FG_CYAN}3${C_RESET}] 🧪 ${C_BOLD}Modo Teste Avulso${C_RESET}`,
    );
    console.log(
      `      ${FG_GRAY}Sintetiza um arquivo markdown customizado para teste.${C_RESET}\n`,
    );
    console.log(
      `  [${FG_CYAN}0${C_RESET}] 🚪 ${C_BOLD}Sair do Programa${C_RESET}`,
    );
    console.log(
      `  ${FG_DARK_GRAY}────────────────────────────────────────────────────────────${C_RESET}`,
    );

    const opcaoMenu = await perguntarOpcaoNumerica(
      rl,
      `\n  ${C_BOLD}Digite a opção desejada [Padrão: 1]: ${C_RESET}`,
      3,
      1,
    );

    if (opcaoMenu === 0) {
      console.log(
        `\n  ${FG_GREEN}✔ Obrigado por usar o sintetizador! Até mais.${C_RESET}\n`,
      );
      rl.close();
      process.exit(0);
    }

    let licoesParaProcessar = [];
    let modoVozes = 1; // 1 = Ambas, 2 = Apenas Aoede, 3 = Apenas Kore

    if (opcaoMenu === 1) {
      // MODO AUTOMÁTICO EM LOTE
      if (licoesComVozesFaltantes.length === 0) {
        console.log(
          `\n  ${FG_GREEN}✔ Excelente! Todas as lições já possuem áudios completos.${C_RESET}`,
        );
        await rl.question(`\n  Pressione Enter para continuar...`);
        continue;
      }

      const limiteInput = await perguntarLimiteLicoes(
        rl,
        `\n  Quantas lições completas deseja gerar nesta execução? [Padrão: 2]: `,
        2,
      );
      const quantidadeLicoes = Math.min(
        limiteInput,
        licoesComVozesFaltantes.length,
      );

      licoesParaProcessar = licoesComVozesFaltantes.slice(0, quantidadeLicoes);

      console.log(`\n  ${C_BOLD}Escolha as vozes a serem geradas:${C_RESET}`);
      console.log(
        `  ┌──────────────────────────────────────────────────────────┐`,
      );
      console.log(
        `  │ [1] Ambas as vozes (Aoede & Kore) - Recomendado          │`,
      );
      console.log(
        `  │ [2] Apenas voz Aoede (Feminina Expressiva)               │`,
      );
      console.log(
        `  │ [3] Apenas voz Kore (Feminina Suave)                     │`,
      );
      console.log(
        `  └──────────────────────────────────────────────────────────┘`,
      );
      modoVozes = await perguntarOpcaoNumerica(
        rl,
        `\n  Opção selecionada [Padrão: 1]: `,
        3,
        1,
      );
    } else if (opcaoMenu === 2) {
      // SELECIONAR LIÇÕES ESPECÍFICAS
      if (licoesComVozesFaltantes.length === 0) {
        console.log(
          `\n  ${FG_GREEN}✔ Excelente! Todas as lições já possuem áudios completos.${C_RESET}`,
        );
        await rl.question(`\n  Pressione Enter para continuar...`);
        continue;
      }

      console.log(`\n  ${C_BOLD}📝 LIÇÕES PENDENTES DE ÁUDIO:${C_RESET}`);
      console.log(
        `  ${FG_DARK_GRAY}──────────────────────────────────────────────────────────────────────────────${C_RESET}`,
      );
      console.log(
        `    ${C_BOLD}Nº  | ID                 | TÍTULO                       | PENDÊNCIAS${C_RESET}`,
      );
      console.log(
        `  ${FG_DARK_GRAY}──────────────────────────────────────────────────────────────────────────────${C_RESET}`,
      );
      licoesComVozesFaltantes.forEach((lic, index) => {
        const vozesStr = lic.vozes.map((v) => v.voz).join(", ");
        const numStr = (index + 1).toString().padStart(2, " ");
        const idStr = lic.id.padEnd(18);
        const titStr = limparEmojis(lic.titulo).substring(0, 28).padEnd(28);
        console.log(
          `   [${FG_CYAN}${numStr}${C_RESET}] | ${FG_CYAN}${idStr}${C_RESET} | ${titStr} | ${FG_YELLOW}${vozesStr}${C_RESET}`,
        );
      });
      console.log(
        `  ${FG_DARK_GRAY}──────────────────────────────────────────────────────────────────────────────${C_RESET}`,
      );

      const licoesSelecionadas = await perguntarEscolhaLicoes(
        rl,
        licoesComVozesFaltantes.length,
        licoesComVozesFaltantes,
      );
      licoesParaProcessar = licoesSelecionadas;

      console.log(`\n  ${C_BOLD}Escolha as vozes a serem geradas:${C_RESET}`);
      console.log(
        `  ┌──────────────────────────────────────────────────────────┐`,
      );
      console.log(
        `  │ [1] Ambas as vozes (Aoede & Kore) - Recomendado          │`,
      );
      console.log(
        `  │ [2] Apenas voz Aoede (Feminina Expressiva)               │`,
      );
      console.log(
        `  │ [3] Apenas voz Kore (Feminina Suave)                     │`,
      );
      console.log(
        `  └──────────────────────────────────────────────────────────┘`,
      );
      modoVozes = await perguntarOpcaoNumerica(
        rl,
        `\n  Opção selecionada [Padrão: 1]: `,
        3,
        1,
      );
    } else if (opcaoMenu === 3) {
      // MODO TESTE AVULSO
      const arquivoTeste = await perguntarArquivoTeste(rl);
      if (!arquivoTeste) continue; // Voltou ao menu

      console.log(
        `\n  ${C_BOLD}Selecione a voz para o teste avulso:${C_RESET}`,
      );
      console.log(
        `  ┌──────────────────────────────────────────────────────────┐`,
      );
      console.log(
        `  │ [1] Aoede (Feminina Expressiva - Gemini)                 │`,
      );
      console.log(
        `  │ [2] Kore (Feminina Suave - Gemini)                       │`,
      );
      console.log(
        `  │ [3] Puck (Masculina - Gemini)                            │`,
      );
      console.log(
        `  │ [4] Charon (Masculina - Gemini)                          │`,
      );
      console.log(
        `  │ [5] Fenrir (Masculina - Gemini)                          │`,
      );
      console.log(
        `  └──────────────────────────────────────────────────────────┘`,
      );
      const opcaoVozTeste = await perguntarOpcaoNumerica(
        rl,
        `\n  Opção selecionada [Padrão: 1]: `,
        5,
        1,
      );

      const vozesMapa = {
        1: "Aoede",
        2: "Kore",
        3: "Puck",
        4: "Charon",
        5: "Fenrir",
      };
      const vozTeste = vozesMapa[opcaoVozTeste];

      console.log(
        `\n  ${FG_VIOLET}⚡ Iniciando síntese de teste avulso...${C_RESET}`,
      );

      const conteudo = fs.readFileSync(arquivoTeste, "utf-8");
      let titulo = "";
      let corpoMarkdown = conteudo;

      const metadados = extrairMetadadosMarkdown(conteudo);
      if (metadados) {
        titulo = metadados.titulo || "";
        corpoMarkdown = conteudo.replace(/^---[\s\S]*?---/, "").trim();
      } else {
        const linhas = conteudo.split("\n");
        if (linhas[0] && linhas[0].trim().startsWith("#")) {
          titulo = linhas[0].trim().replace(/^#+\s+/, "");
          corpoMarkdown = linhas.slice(1).join("\n").trim();
        }
      }

      const tituloLimpo = limparEmojis(titulo);
      const corpoLimpo = limparMarkdownParaLeitura(corpoMarkdown);
      const textoSintese = tituloLimpo
        ? `${tituloLimpo}. \n\n ${corpoLimpo}`
        : corpoLimpo;

      console.log(
        `  • Caracteres detectados: ${FG_CYAN}${textoSintese.length}${C_RESET}`,
      );
      const spinner = iniciarSpinner(`Chamando Gemini com a voz: ${FG_VIOLET}${vozTeste}${C_RESET}...`);

      try {
        const ai = new GoogleGenAI({ apiKey });
        const resposta = await ai.interactions.create({
          model: "gemini-3.1-flash-tts-preview",
          input: `Leia em voz alta, com tom calmo, profissional, didático e natural de professor de computação, o seguinte texto em português do Brasil (leia o texto de forma limpa, direta, sem introduções ou comentários de metadados): ${textoSintese}`,
          response_format: { type: "audio" },
          generation_config: {
            speech_config: [
              { voice: vozTeste }
            ],
          },
        });

        spinner.parar(true);
        const audioBase64 = resposta.output_audio?.data;
        if (!audioBase64) {
          throw new Error("A API do Gemini retornou dados de áudio nulos.");
        }

        const pcmData = Buffer.from(audioBase64, "base64");
        console.log(`  • Convertendo áudio bruto PCM para MP3...`);
        const mp3Buffer = converterPcmParaMp3Buffer(pcmData, 24000);

        const dirDoArquivo = path.dirname(arquivoTeste);
        const timestamp = Date.now();
        const nomeBase = path.basename(
          arquivoTeste,
          path.extname(arquivoTeste),
        );
        const caminhoSaida = path.join(
          dirDoArquivo,
          `${nomeBase}_${timestamp}.mp3`,
        );
        fs.writeFileSync(caminhoSaida, mp3Buffer);

        console.log(
          `\n  ${FG_GREEN}✔ Sucesso! MP3 de teste gerado em: ${caminhoSaida} (${(mp3Buffer.length / 1024).toFixed(1)} KB)${C_RESET}`,
        );
      } catch (err) {
        spinner.parar(false);
        console.error(
          `\n  ${FG_RED}❌ Erro na síntese do teste: ${err.message || err}${C_RESET}`,
        );
      }

      await rl.question(`\nPressione Enter para retornar ao menu principal...`);
      continue;
    }

    // --- PROCESSO DE SÍNTESE DE LOTE ---
    console.log(
      `\n  ${FG_VIOLET}⚡ Iniciando processamento de lote para ${licoesParaProcessar.length} ${licoesParaProcessar.length === 1 ? "lição" : "lições"}...${C_RESET}`,
    );
    const ai = new GoogleGenAI({ apiKey });

    for (let i = 0; i < licoesParaProcessar.length; i++) {
      const licao = licoesParaProcessar[i];
      console.log(
        `\n  ${FG_DARK_GRAY}────────────────────────────────────────────────────────────${C_RESET}`,
      );
      console.log(
        `  [Lição ${i + 1}/${licoesParaProcessar.length}] Lição: "${FG_CYAN}${licao.id}${C_RESET}" (${licao.titulo})`,
      );

      const tituloLimpo = limparEmojis(licao.titulo);
      const corpoLimpo = limparMarkdownParaLeitura(licao.corpoMarkdown);
      const textoSintese = `${tituloLimpo}. \n\n ${corpoLimpo}`;

      console.log(
        `  • Caracteres a sintetizar: ${FG_CYAN}${textoSintese.length}${C_RESET}`,
      );

      // Filtra as vozes de acordo com a escolha do usuário
      let vozesDeFato = licao.vozes;
      if (modoVozes === 2) {
        vozesDeFato = licao.vozes.filter((v) => v.voz === "Aoede");
      } else if (modoVozes === 3) {
        vozesDeFato = licao.vozes.filter((v) => v.voz === "Kore");
      }

      if (vozesDeFato.length === 0) {
        console.log(
          `  ${FG_YELLOW}⚠ Nenhuma voz pendente/selecionada para esta lição conforme filtro.${C_RESET}`,
        );
        continue;
      }

      let erroNaLicao = false;
      for (let j = 0; j < vozesDeFato.length; j++) {
        const itemVoz = vozesDeFato[j];
        const spinner = iniciarSpinner(`Requisitando Gemini API (Voz: ${FG_VIOLET}${itemVoz.voz}${C_RESET})...`);

        try {
          const resposta = await ai.interactions.create({
            model: "gemini-3.1-flash-tts-preview",
            input: `Leia em voz alta, com tom calmo, profissional, didático e natural de professor de computação, o seguinte texto em português do Brasil (leia o texto de forma limpa, direta, sem introduções ou comentários de metadados): ${textoSintese}`,
            response_format: { type: "audio" },
            generation_config: {
              speech_config: [
                { voice: itemVoz.voz }
              ],
            },
          });

          spinner.parar(true);
          const audioBase64 = resposta.output_audio?.data;
          if (!audioBase64) {
            throw new Error(`Áudio retornado nulo para a voz ${itemVoz.voz}.`);
          }

          const pcmData = Buffer.from(audioBase64, "base64");
          const mp3Buffer = converterPcmParaMp3Buffer(pcmData, 24000);

          fs.mkdirSync(path.dirname(itemVoz.caminhoArquivoFinal), { recursive: true });
          fs.writeFileSync(itemVoz.caminhoArquivoFinal, mp3Buffer);
          console.log(
            `  ${FG_GREEN}✔ Áudio MP3 gravado: ${itemVoz.voz}/${itemVoz.nomeArquivoFinal} (${(mp3Buffer.length / 1024).toFixed(1)} KB)${C_RESET}`,
          );

          if (!mapa[licao.id]) mapa[licao.id] = {};
          mapa[licao.id][itemVoz.voz] = true;
          fs.writeFileSync(mapaCaminho, JSON.stringify(mapa, null, 2));

          // Delay de cortesia para a API do Gemini
          if (
            j < vozesDeFato.length - 1 ||
            i < licoesParaProcessar.length - 1
          ) {
            console.log(
              `  ${FG_GRAY}Aguardando 2 segundos para evitar rate limit...${C_RESET}`,
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (err) {
          spinner.parar(false);
          console.error(
            `  ${FG_RED}❌ Erro na síntese da voz ${itemVoz.voz}: ${err.message || err}${C_RESET}`,
          );
          erroNaLicao = true;
          break;
        }
      }

      if (erroNaLicao) {
        console.log(
          `\n  ${FG_RED}Operação em lote suspensa devido a erro de conexão ou cota da API.${C_RESET}`,
        );
        break;
      }
    }

    console.log(
      `\n  ${FG_VIOLET}╔══════════════════════════════════════════════════════════╗${C_RESET}`,
    );
    console.log(
      `  ${FG_VIOLET}║${C_RESET}          ${FG_GREEN}${C_BOLD}✔ PROCESSAMENTO DE LOTE CONCLUÍDO!${C_RESET}              ${FG_VIOLET}║${C_RESET}`,
    );
    console.log(
      `  ${FG_VIOLET}╚══════════════════════════════════════════════════════════╝${C_RESET}`,
    );
    await rl.question(`\n  Pressione Enter para continuar...`);
  }
}

main();
