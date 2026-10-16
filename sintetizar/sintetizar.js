import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import readline from "readline/promises";
import {
  MODELO_TTS,
  TAXA_AMOSTRAGEM_PCM,
  LIMITE_CARACTERES_POR_PARTE,
  limparEmojis,
  montarPartesNarracao,
  requisitarPcmDaApi,
  unirPartesPcmNormalizadas,
  converterPcmParaMp3Buffer,
} from "./motorSintese.js";

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

/** Pausa adaptativa entre requisições Gemini TTS (motor já possui retry automático em 429). */
const INTERVALO_RATE_LIMIT_MS = 12_000;
const INTERVALO_RATE_LIMIT_SEGUNDOS = INTERVALO_RATE_LIMIT_MS / 1000;

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

async function aguardarRateLimit(mensagemOpcional) {
  const msg =
    mensagemOpcional ||
    `Aguardando ${INTERVALO_RATE_LIMIT_SEGUNDOS} segundos para evitar rate limit...`;
  console.log(`  ${FG_GRAY}${msg}${C_RESET}`);
  await new Promise((resolve) => setTimeout(resolve, INTERVALO_RATE_LIMIT_MS));
}

/**
 * Sintetiza uma lista de partes já montadas (via <!-- cut -->).
 * Cada parte passa por normalização RMS (-18 dBFS) e pausa natural antes de virar MP3.
 */
async function sintetizarPartesParaMp3(ai, partes, voz, opcoes = {}) {
  const { rotuloBase = voz } = opcoes;

  if (!partes || partes.length === 0) {
    throw new Error("Texto vazio para síntese.");
  }

  if (partes.length > 1) {
    console.log(
      `  • Narração em ${FG_CYAN}${partes.length} partes${C_RESET} (cortes <!-- cut -->; limite ${LIMITE_CARACTERES_POR_PARTE} chars/parte):`,
    );
    partes.forEach((parte, indice) => {
      console.log(
        `    ${FG_GRAY}parte ${indice + 1}/${partes.length}: ${parte.length} chars${C_RESET}`,
      );
    });
  }

  const pcmPartes = [];

  for (let indice = 0; indice < partes.length; indice += 1) {
    const parte = partes[indice];
    const rotulo =
      partes.length > 1
        ? `${rotuloBase} · parte ${indice + 1}/${partes.length}`
        : rotuloBase;

    const spinner = iniciarSpinner(
      `Requisitando Gemini API (${FG_VIOLET}${rotulo}${C_RESET})...`,
    );

    try {
      const pcm = await requisitarPcmDaApi(
        ai,
        parte,
        voz,
        indice,
        partes.length,
      );
      spinner.parar(true);
      pcmPartes.push(pcm);
      console.log(
        `  ${FG_GREEN}✔ PCM recebido e equalizado${partes.length > 1 ? ` (parte ${indice + 1}/${partes.length})` : ""}: ${(pcm.length / 1024).toFixed(1)} KB${C_RESET}`,
      );
    } catch (erro) {
      spinner.parar(false);
      throw erro;
    }

    if (indice < partes.length - 1) {
      await aguardarRateLimit(
        `Aguardando ${INTERVALO_RATE_LIMIT_SEGUNDOS}s entre partes do áudio...`,
      );
    }
  }

  const pcmTotal = unirPartesPcmNormalizadas(pcmPartes, TAXA_AMOSTRAGEM_PCM);
  const mp3Buffer = converterPcmParaMp3Buffer(pcmTotal, TAXA_AMOSTRAGEM_PCM);
  return {
    mp3Buffer,
    quantidadePartes: partes.length,
    caracteresPorParte: partes.map((parte) => parte.length),
  };
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

/** Ordem canônica das vozes da plataforma. */
const VOZES_PLATAFORMA = ["Aoede", "Kore"];

/**
 * Vozes que ainda faltam no conjunto de lições selecionadas
 * (união do que cada lição tem pendente).
 */
function coletarVozesPendentesNasLicoes(licoes) {
  const encontradas = new Set();
  for (const licao of licoes) {
    for (const item of licao.vozes || []) {
      encontradas.add(item.voz);
    }
  }
  return VOZES_PLATAFORMA.filter((voz) => encontradas.has(voz));
}

/**
 * Menu de vozes só com o que ainda falta gerar.
 * - Se só falta uma (ex.: Kore), escolhe ela automaticamente.
 * - Se faltam as duas, oferece ambas / só Aoede / só Kore.
 * @returns {Promise<string[]>} nomes das vozes a gerar
 */
async function perguntarVozesPendentesParaGerar(rl, licoesParaProcessar) {
  const pendentes = coletarVozesPendentesNasLicoes(licoesParaProcessar);

  if (pendentes.length === 0) {
    return [];
  }

  if (pendentes.length === 1) {
    const unica = pendentes[0];
    console.log(
      `\n  ${FG_CYAN}ℹ Nas lições selecionadas só falta a voz ${C_BOLD}${unica}${C_RESET}${FG_CYAN}. Seguindo apenas com ela.${C_RESET}`,
    );
    return [unica];
  }

  // Duas (ou mais) vozes pendentes no conjunto
  console.log(`\n  ${C_BOLD}Escolha as vozes a serem geradas:${C_RESET}`);
  console.log(
    `  ${FG_GRAY}(somente opções com áudio ainda pendente nas lições escolhidas)${C_RESET}`,
  );
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
  const modoVozes = await perguntarOpcaoNumerica(
    rl,
    `\n  Opção selecionada [Padrão: 1]: `,
    3,
    1,
  );

  if (modoVozes === 2) return ["Aoede"];
  if (modoVozes === 3) return ["Kore"];
  return ["Aoede", "Kore"];
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
    const todasLicoesMapeadas = [];
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
        const todasVozesLicao = [];
        const statusPorVoz = {};

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

          statusPorVoz[voz] = jaExisteFisico;
          todasVozesLicao.push({
            voz,
            nomeArquivoFinal: nomeArquivoNovo,
            caminhoArquivoFinal: caminhoArquivoNovo,
          });

          if (!jaExisteFisico) {
            vozesFaltantes.push({
              voz,
              nomeArquivoFinal: nomeArquivoNovo,
              caminhoArquivoFinal: caminhoArquivoNovo,
            });
          }
        });

        todasLicoesMapeadas.push({
          id,
          titulo,
          corpoMarkdown,
          vozes: todasVozesLicao,
          statusPorVoz,
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
      `  │  • Motor Ativo:      ${FG_VIOLET}${MODELO_TTS.padEnd(36)}${C_RESET}│`,
    );
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
      `  [${FG_CYAN}2${C_RESET}] 🎯 ${C_BOLD}Selecionar Lições Pendentes${C_RESET}`,
    );
    console.log(
      `      ${FG_GRAY}Escolha manualmente quais lições pendentes deseja gerar.${C_RESET}\n`,
    );
    console.log(
      `  [${FG_CYAN}3${C_RESET}] 🧪 ${C_BOLD}Modo Teste Avulso${C_RESET}`,
    );
    console.log(
      `      ${FG_GRAY}Sintetiza um arquivo markdown customizado para teste.${C_RESET}\n`,
    );
    console.log(
      `  [${FG_CYAN}4${C_RESET}] 🔄 ${C_BOLD}Catálogo Completo / Regerar Áudios Prontos${C_RESET}`,
    );
    console.log(
      `      ${FG_GRAY}Exibe todas as ${totalLicoesMapeadas} lições (prontas e pendentes) para regerar.${C_RESET}\n`,
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
      4,
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
    /** Vozes que o usuário quer gerar nesta execução (já filtradas pelo que falta). */
    let vozesEscolhidas = ["Aoede", "Kore"];

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
      vozesEscolhidas = await perguntarVozesPendentesParaGerar(
        rl,
        licoesParaProcessar,
      );
    } else if (opcaoMenu === 2) {
      // SELECIONAR LIÇÕES PENDENTES
      if (licoesComVozesFaltantes.length === 0) {
        console.log(
          `\n  ${FG_GREEN}✔ Excelente! Todas as lições já possuem áudios completos.${C_RESET}`,
        );
        await rl.question(`\n  Pressione Enter para continuar...`);
        continue;
      }

      console.log(`\n  ${C_BOLD}📝 LIÇÕES PENDENTES DE ÁUDIO (${licoesCompletasCount} lições já estão 100% prontas — veja na Opção 4):${C_RESET}`);
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
      vozesEscolhidas = await perguntarVozesPendentesParaGerar(
        rl,
        licoesParaProcessar,
      );
    } else if (opcaoMenu === 4) {
      // CATÁLOGO COMPLETO / REGERAR LIÇÕES PRONTAS OU PENDENTES
      console.log(`\n  ${C_BOLD}📚 CATÁLOGO COMPLETO DE LIÇÕES (${totalLicoesMapeadas} aulas):${C_RESET}`);
      console.log(
        `  ${FG_DARK_GRAY}──────────────────────────────────────────────────────────────────────────────${C_RESET}`,
      );
      console.log(
        `    ${C_BOLD}Nº  | ID                 | TÍTULO                       | STATUS DAS VOZES${C_RESET}`,
      );
      console.log(
        `  ${FG_DARK_GRAY}──────────────────────────────────────────────────────────────────────────────${C_RESET}`,
      );
      todasLicoesMapeadas.forEach((lic, index) => {
        const numStr = (index + 1).toString().padStart(2, " ");
        const idStr = lic.id.padEnd(18);
        const titStr = limparEmojis(lic.titulo).substring(0, 28).padEnd(28);
        const stAoede = lic.statusPorVoz.Aoede
          ? `${FG_GREEN}✔ Aoede${C_RESET}`
          : `${FG_YELLOW}⏳ Aoede${C_RESET}`;
        const stKore = lic.statusPorVoz.Kore
          ? `${FG_GREEN}✔ Kore${C_RESET}`
          : `${FG_YELLOW}⏳ Kore${C_RESET}`;
        console.log(
          `   [${FG_CYAN}${numStr}${C_RESET}] | ${FG_CYAN}${idStr}${C_RESET} | ${titStr} | ${stAoede}  ${stKore}`,
        );
      });
      console.log(
        `  ${FG_DARK_GRAY}──────────────────────────────────────────────────────────────────────────────${C_RESET}`,
      );

      const licoesSelecionadas = await perguntarEscolhaLicoes(
        rl,
        todasLicoesMapeadas.length,
        todasLicoesMapeadas,
      );
      licoesParaProcessar = licoesSelecionadas;
      vozesEscolhidas = await perguntarVozesPendentesParaGerar(
        rl,
        licoesParaProcessar,
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

      try {
        const { partes, totalChars } = montarPartesNarracao(
          tituloLimpo,
          corpoMarkdown,
        );
        console.log(
          `  • Caracteres na narração: ${FG_CYAN}${totalChars}${C_RESET} · partes: ${FG_CYAN}${partes.length}${C_RESET}`,
        );

        const ai = new GoogleGenAI({ apiKey });
        console.log(
          `  • Convertendo PCM para MP3 (partes unidas se necessário)...`,
        );
        const { mp3Buffer, quantidadePartes } = await sintetizarPartesParaMp3(
          ai,
          partes,
          vozTeste,
          { rotuloBase: vozTeste },
        );

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

        const caminhoTesteClicavel = path
          .relative(path.join(__dirname, ".."), caminhoSaida)
          .replace(/\\/g, "/");
        console.log(
          `\n  ${FG_GREEN}✔ Sucesso! MP3 de teste gerado em:${C_RESET} ${FG_CYAN}${C_UNDERLINE}${caminhoTesteClicavel}${C_RESET} ${FG_GREEN}(${(mp3Buffer.length / 1024).toFixed(1)} KB)${quantidadePartes > 1 ? ` · ${quantidadePartes} partes unidas` : ""}${C_RESET}`,
        );
      } catch (err) {
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

      // Só vozes pendentes nesta lição E escolhidas no menu (nunca gera o que já existe)
      const vozesDeFato = licao.vozes.filter((item) =>
        vozesEscolhidas.includes(item.voz),
      );

      if (vozesDeFato.length === 0) {
        console.log(
          `  ${FG_YELLOW}⚠ Nenhuma voz pendente/selecionada para esta lição conforme filtro.${C_RESET}`,
        );
        continue;
      }

      let partesNarracao;
      try {
        const montagem = montarPartesNarracao(tituloLimpo, licao.corpoMarkdown);
        partesNarracao = montagem.partes;
        console.log(
          `  • Caracteres a sintetizar: ${FG_CYAN}${montagem.totalChars}${C_RESET} · partes: ${FG_CYAN}${partesNarracao.length}${C_RESET}${montagem.temTagCut ? " (via <!-- cut -->)" : ""}`,
        );
      } catch (erroMontagem) {
        console.error(
          `  ${FG_RED}❌ ${erroMontagem.message || erroMontagem}${C_RESET}`,
        );
        continue;
      }

      let erroNaLicao = false;
      for (let j = 0; j < vozesDeFato.length; j++) {
        const itemVoz = vozesDeFato[j];

        try {
          const { mp3Buffer, quantidadePartes } = await sintetizarPartesParaMp3(
            ai,
            partesNarracao,
            itemVoz.voz,
            { rotuloBase: itemVoz.voz },
          );

          fs.mkdirSync(path.dirname(itemVoz.caminhoArquivoFinal), {
            recursive: true,
          });
          fs.writeFileSync(itemVoz.caminhoArquivoFinal, mp3Buffer);
          const caminhoClicavel = `public/audios/${itemVoz.voz}/${itemVoz.nomeArquivoFinal}`;
          console.log(
            `  ${FG_GREEN}✔ Áudio MP3 gravado:${C_RESET} ${FG_CYAN}${C_UNDERLINE}${caminhoClicavel}${C_RESET} ${FG_GREEN}(${(mp3Buffer.length / 1024).toFixed(1)} KB)${quantidadePartes > 1 ? ` · ${quantidadePartes} partes unidas` : ""}${C_RESET}`,
          );

          if (!mapa[licao.id]) mapa[licao.id] = {};
          mapa[licao.id][itemVoz.voz] = true;
          fs.writeFileSync(mapaCaminho, JSON.stringify(mapa, null, 2));

          // Delay entre vozes / lições (entre partes já espera dentro de sintetizarPartesParaMp3)
          if (
            j < vozesDeFato.length - 1 ||
            i < licoesParaProcessar.length - 1
          ) {
            await aguardarRateLimit();
          }
        } catch (err) {
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
