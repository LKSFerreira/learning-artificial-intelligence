/**
 * Sintetiza áudio para IDs específicos (uso CLI).
 * Ex.: node tools/sintetizar-ids.js hierarchy ia ml dl
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, "..");

// Carrega .env
const envPath = path.join(raiz, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const indexDoisPontos = trimmed.indexOf("=");
    if (indexDoisPontos === -1) continue;
    const chave = trimmed.slice(0, indexDoisPontos).trim();
    const valor = trimmed
      .slice(indexDoisPontos + 1)
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

// lamejs
const lameCode = fs.readFileSync(
  path.join(raiz, "node_modules/lamejs/lame.min.js"),
  "utf8",
);
const sandbox = {
  window: {},
  global: {},
  exports: {},
  module: { exports: {} },
};
vm.createContext(sandbox);
vm.runInContext(lameCode, sandbox);
const { Mp3Encoder } = sandbox.lamejs;

function limparEmojis(texto) {
  if (!texto) return "";
  return texto
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{2600}-\u{26FF}\u{2300}-\u{23FF}\u{2B50}\uFE00-\uFE0F]/gu,
      "",
    )
    .trim();
}

function limparMarkdownParaLeitura(markdown) {
  if (!markdown) return "";
  let texto = markdown;
  texto = texto.replace(
    /<!-- audio-skip-start -->[\s\S]*?<!-- audio-skip-end -->/g,
    "",
  );
  texto = texto.replace(/```[\s\S]*?```/g, " ");
  texto = texto.replace(/`([^`]+)`/g, "$1");
  texto = texto.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  texto = texto.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  texto = texto.replace(/^#+\s+(.+)$/gm, "$1");
  texto = texto.replace(/\*\*([^*]+)\*\*/g, "$1");
  texto = texto.replace(/\*([^*]+)\*/g, "$1");
  texto = texto.replace(/^[\s]*[*+-]\s+/gm, "");
  texto = texto.replace(/^[\s]*\d+\.\s+/gm, "");
  texto = texto.replace(/^[\s]*>\s+/gm, "");
  texto = texto.replace(/\n+/g, " ");
  texto = texto.replace(/\s+/g, " ");
  return texto.trim();
}

function converterPcmParaMp3Buffer(pcmData, sampleRate) {
  const buffer = pcmData.buffer;
  const offset = pcmData.byteOffset;
  const length = pcmData.byteLength / 2;
  const amostras = new Int16Array(buffer, offset, length);
  const encoder = new Mp3Encoder(1, sampleRate, 128);
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

/** Mapa id -> caminho relativo do markdown */
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

const idsPedidos = process.argv.slice(2);
if (idsPedidos.length === 0) {
  console.error("Uso: node tools/sintetizar-ids.js <id> [id...]");
  console.error("Ex.: node tools/sintetizar-ids.js hierarchy ia ml dl");
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
  const titulo = limparEmojis(meta.titulo || id);
  const corpo = limparMarkdownParaLeitura(
    conteudo.replace(/^---[\s\S]*?---/, "").trim(),
  );
  const textoSintese = `${titulo}. \n\n ${corpo}`;

  console.log(`\n== ${id} (${textoSintese.length} chars) ==`);
  console.log(`   arquivo: ${path.relative(raiz, arquivo)}`);

  for (const voz of vozes) {
    const dirVoz = path.join(dirAudios, voz);
    fs.mkdirSync(dirVoz, { recursive: true });
    const saida = path.join(dirVoz, `${id}.mp3`);

    if (fs.existsSync(saida) && fs.statSync(saida).size > 0) {
      console.log(`  skip ${voz} (já existe)`);
      if (!mapaSintese[id]) mapaSintese[id] = {};
      mapaSintese[id][voz] = true;
      continue;
    }

    process.stdout.write(`  gerando ${voz}... `);
    try {
      const resposta = await ai.interactions.create({
        model: "gemini-3.1-flash-tts-preview",
        input: `Leia em voz alta, com tom calmo, profissional, didático e natural de professor de computação, o seguinte texto em português do Brasil (leia o texto de forma limpa, direta, sem introduções ou comentários de metadados): ${textoSintese}`,
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [{ voice: voz }],
        },
      });

      const audioBase64 = resposta.output_audio?.data;
      if (!audioBase64) {
        throw new Error("API retornou áudio nulo");
      }

      const pcmData = Buffer.from(audioBase64, "base64");
      const mp3Buffer = converterPcmParaMp3Buffer(pcmData, 24000);
      fs.writeFileSync(saida, mp3Buffer);

      if (!mapaSintese[id]) mapaSintese[id] = {};
      mapaSintese[id][voz] = true;

      console.log(`ok (${(mp3Buffer.length / 1024).toFixed(1)} KB)`);
    } catch (erro) {
      console.log(`ERRO: ${erro.message || erro}`);
    }
  }
}

fs.writeFileSync(mapaSintesePath, JSON.stringify(mapaSintese, null, 2));
console.log("\nmapa_sintese.json atualizado");
