/**
 * Sintetiza áudio para IDs específicos (uso CLI) usando o motor unificado
 * com direção acústica por voz e equalização RMS de estúdio.
 *
 * Ex.:
 *   node tools/sintetizar-ids.js rl_intro rl_components
 *   node tools/sintetizar-ids.js --forcar deep_learning
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import {
  TAXA_AMOSTRAGEM_PCM,
  limparEmojis,
  montarPartesNarracao,
  requisitarPcmDaApi,
  unirPartesPcmNormalizadas,
  converterPcmParaMp3Buffer,
} from "../sintetizar/motorSintese.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, "..");

const INTERVALO_RATE_LIMIT_MS = 30_000;

// Carrega .env
const envPath = path.join(raiz, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const indexIgual = trimmed.indexOf("=");
    if (indexIgual === -1) continue;
    const chave = trimmed.slice(0, indexIgual).trim();
    const valor = trimmed
      .slice(indexIgual + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    process.env[chave] = valor;
  }
}

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY não encontrada no .env");
  process.exit(1);
}

function extrairMetadados(conteudo) {
  const match = conteudo.match(/^---([\s\S]*?)---/);
  if (!match) return null;
  const metadados = {};
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const indexDoisPontos = trimmed.indexOf(":");
    if (indexDoisPontos === -1) continue;
    const chave = trimmed.slice(0, indexDoisPontos).trim();
    const valor = trimmed
      .slice(indexDoisPontos + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    metadados[chave] = valor;
  }
  return metadados;
}

/** Mapa id -> caminho absoluto do markdown */
function mapearLicoesPorId() {
  const dirConteudo = path.join(raiz, "src", "conteudo");
  const mapa = {};

  function varrer(diretorio) {
    for (const nome of fs.readdirSync(diretorio)) {
      const completo = path.join(diretorio, nome);
      const stat = fs.statSync(completo);
      if (stat.isDirectory()) {
        varrer(completo);
        continue;
      }
      if (!nome.endsWith(".md")) continue;
      const bruto = fs.readFileSync(completo, "utf8");
      const meta = extrairMetadados(bruto);
      if (meta?.id && meta?.tipo === "content") {
        mapa[meta.id] = completo;
      }
    }
  }

  varrer(dirConteudo);
  return mapa;
}

const argsBrutos = process.argv.slice(2);
const forcarRegeracao =
  argsBrutos.includes("--forcar") || argsBrutos.includes("--force");
const idsPedidos = argsBrutos.filter(
  (arg) => arg !== "--forcar" && arg !== "--force",
);

if (idsPedidos.length === 0) {
  console.error("Uso: node tools/sintetizar-ids.js [--forcar] <id> [id...]");
  console.error("Ex.: node tools/sintetizar-ids.js rl_intro rl_components");
  process.exit(1);
}

const mapaArquivos = mapearLicoesPorId();
const vozes = ["Aoede", "Kore"];
const dirAudios = path.join(raiz, "public", "audios");
const mapaSintesePath = path.join(raiz, "sintetizar", "mapa_sintese.json");
let mapaSintese = {};
if (fs.existsSync(mapaSintesePath)) {
  mapaSintese = JSON.parse(fs.readFileSync(mapaSintesePath, "utf8"));
}

const ai = new GoogleGenAI({ apiKey });

for (const id of idsPedidos) {
  const arquivo = mapaArquivos[id];
  if (!arquivo) {
    console.error(`✖ ID não encontrado no currículo: ${id}`);
    continue;
  }

  const conteudo = fs.readFileSync(arquivo, "utf8");
  const meta = extrairMetadados(conteudo) || {};
  const tituloLimpo = limparEmojis(meta.titulo || id);
  const corpoMarkdown = conteudo.replace(/^---[\s\S]*?---/, "").trim();

  let partesNarracao;
  let totalChars;
  try {
    const montagem = montarPartesNarracao(tituloLimpo, corpoMarkdown);
    partesNarracao = montagem.partes;
    totalChars = montagem.totalChars;
  } catch (erroMontagem) {
    console.error(`✖ Erro ao preparar ${id}: ${erroMontagem.message}`);
    continue;
  }

  console.log(
    `\n== ${id} (${totalChars} chars limpos · ${partesNarracao.length} parte(s)) ==`,
  );
  console.log(`   arquivo: ${path.relative(raiz, arquivo)}`);

  for (const voz of vozes) {
    const dirVoz = path.join(dirAudios, voz);
    fs.mkdirSync(dirVoz, { recursive: true });
    const saida = path.join(dirVoz, `${id}.mp3`);

    if (!forcarRegeracao && fs.existsSync(saida) && fs.statSync(saida).size > 0) {
      console.log(`  skip ${voz} (já existe; use --forcar para regerar)`);
      if (!mapaSintese[id]) mapaSintese[id] = {};
      mapaSintese[id][voz] = true;
      continue;
    }

    process.stdout.write(`  gerando ${voz}... `);
    try {
      const pcmPartes = [];
      for (let indice = 0; indice < partesNarracao.length; indice += 1) {
        const pcm = await requisitarPcmDaApi(
          ai,
          partesNarracao[indice],
          voz,
          indice,
          partesNarracao.length,
        );
        pcmPartes.push(pcm);

        if (indice < partesNarracao.length - 1) {
          process.stdout.write(
            `(parte ${indice + 1}/${partesNarracao.length} ok, aguardando 30s...) `,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, INTERVALO_RATE_LIMIT_MS),
          );
        }
      }

      const pcmEqualizado = unirPartesPcmNormalizadas(
        pcmPartes,
        TAXA_AMOSTRAGEM_PCM,
      );
      const mp3Buffer = converterPcmParaMp3Buffer(
        pcmEqualizado,
        TAXA_AMOSTRAGEM_PCM,
      );
      fs.writeFileSync(saida, mp3Buffer);

      if (!mapaSintese[id]) mapaSintese[id] = {};
      mapaSintese[id][voz] = true;

      console.log(
        `ok -> public/audios/${voz}/${id}.mp3 (${(mp3Buffer.length / 1024).toFixed(1)} KB)`,
      );
    } catch (erro) {
      console.log(`ERRO: ${erro.message || erro}`);
    }
  }
}

fs.writeFileSync(mapaSintesePath, JSON.stringify(mapaSintese, null, 2));
console.log("\nmapa_sintese.json atualizado");
