import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TAXA_AMOSTRAGEM_PCM = 24000;
export const MODELO_TTS = "gemini-3.8-flash-tts";

/**
 * Limite máximo seguro por requisição no Gemini TTS (2500 caracteres).
 * Acima de 2500 caracteres num único envio, o alinhador de atenção do TTS perde
 * o rastro do texto, pula parágrafos e insere longos blocos de silêncio.
 * Por isso cada fatia (definida por <!-- cut --> ou subdividida automaticamente
 * por seção/frase) tem no máximo 2500 caracteres e depois é unida num único MP3.
 */
export const LIMITE_CARACTERES_POR_PARTE = 15000;

export const PADRAO_TAG_CUT = "<!--\\s*cut\\s*-->";
export const PADRAO_AUDIO_SKIP =
  "<!--\\s*audio-skip-start\\s*-->[\\s\\S]*?<!--\\s*audio-skip-end\\s*-->";

// Inicializa codificador lamejs uma única vez
let cachedMp3Encoder = null;
function obterMp3Encoder() {
  if (cachedMp3Encoder) return cachedMp3Encoder;
  const lamePath = path.join(__dirname, "../node_modules/lamejs/lame.min.js");
  if (!fs.existsSync(lamePath)) {
    throw new Error(
      "O pacote lamejs não está instalado em node_modules. Rode npm install primeiro.",
    );
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
  cachedMp3Encoder = sandbox.lamejs.Mp3Encoder;
  return cachedMp3Encoder;
}

/**
 * Remove emojis e símbolos pictográficos de qualquer string (título ou corpo)
 * para evitar que o modelo generativo mude a entonação ao encontrar ícones.
 */
export function limparEmojis(texto) {
  if (!texto) return "";
  return texto
    .replace(
      /[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2192}\uFE00-\uFE0F]/gu,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function ehLinhaTabelaMarkdown(linha) {
  const texto = linha.trim();
  if (!texto.includes("|")) return false;
  return texto.startsWith("|") || /\|.+\|/.test(texto);
}

function ehSeparadorTabelaMarkdown(linha) {
  const texto = linha.trim();
  if (!texto.includes("|") || !/-{3,}/.test(texto)) return false;
  return /^[\s|:\-]+$/.test(texto);
}

function extrairCelulasTabela(linha) {
  let texto = linha.trim();
  if (texto.startsWith("|")) texto = texto.slice(1);
  if (texto.endsWith("|")) texto = texto.slice(0, -1);
  return texto.split("|").map((celula) => celula.trim());
}

/**
 * Converte blocos de tabela Markdown em frases faláveis e fluidas.
 * Remove pipes, traços de alinhamento e a "forma" da tabela no áudio,
 * mantendo a tabela intacta na renderização web.
 */
export function converterTabelasMarkdownParaLeitura(markdown) {
  const linhas = markdown
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
  const resultado = [];
  let indice = 0;

  while (indice < linhas.length) {
    const linhaAtual = linhas[indice];
    const proxima = linhas[indice + 1];

    const pareceInicioTabela =
      ehLinhaTabelaMarkdown(linhaAtual) &&
      !ehSeparadorTabelaMarkdown(linhaAtual) &&
      proxima !== undefined &&
      ehSeparadorTabelaMarkdown(proxima);

    if (!pareceInicioTabela) {
      resultado.push(linhaAtual);
      indice += 1;
      continue;
    }

    const bloco = [];
    while (indice < linhas.length && ehLinhaTabelaMarkdown(linhas[indice])) {
      bloco.push(linhas[indice]);
      indice += 1;
    }

    const linhasDados = bloco.filter(
      (linha) => !ehSeparadorTabelaMarkdown(linha),
    );
    if (linhasDados.length === 0) continue;

    const cabecalhos = extrairCelulasTabela(linhasDados[0]);
    const linhasCorpo = linhasDados.slice(1).map(extrairCelulasTabela);

    if (linhasCorpo.length === 0) {
      resultado.push(cabecalhos.filter(Boolean).join(". ") + ".");
      continue;
    }

    const frases = [];
    for (const celulas of linhasCorpo) {
      const partes = [];
      for (
        let coluna = 0;
        coluna < Math.max(cabecalhos.length, celulas.length);
        coluna += 1
      ) {
        const titulo = (cabecalhos[coluna] || "").trim();
        const valor = (celulas[coluna] || "").trim();
        if (!valor && !titulo) continue;
        if (titulo && valor) {
          partes.push(`${titulo}: ${valor}`);
        } else if (valor) {
          partes.push(valor);
        }
      }
      if (partes.length > 0) {
        frases.push(partes.join(". ") + ".");
      }
    }

    if (frases.length > 0) {
      resultado.push(frases.join(" "));
    }
  }

  return resultado.join("\n");
}

/**
 * Normaliza símbolos matemáticos, LaTeX, setas e pontuações que causam
 * mudança de voz ou leitura truncada no TTS.
 */
export function normalizarSimbolosParaFala(texto) {
  if (!texto) return "";
  let resultado = texto;

  // Remove cifrões de LaTeX inline: $+10$ -> +10
  resultado = resultado.replace(/\$([^$]+)\$/g, "$1");

  // Converte números com sinal explícito (+10 -> mais 10, -2 -> menos 2)
  resultado = resultado.replace(/(^|[\s(,"'])(\+)(\d+)/g, "$1mais $3");
  resultado = resultado.replace(/(^|[\s(,"'])(-)(\d+)/g, "$1menos $3");

  // Converte setas visuais em conectivos falados
  resultado = resultado.replace(/\s*(?:→|->|⟹)\s*/g, ", levando a ");
  resultado = resultado.replace(/\s*(?:↔|<->)\s*/g, " e ");

  // Converte operador de igualdade isolado (ex: Deep = muitas camadas)
  resultado = resultado.replace(/\s+===\s+/g, " igual a ");
  resultado = resultado.replace(/\s+=\s+/g, " significa ");

  return resultado;
}

/**
 * Limpa marcações Markdown, emojis e símbolos do texto de leitura.
 */
export function limparMarkdownParaLeitura(markdown) {
  if (!markdown) return "";
  let texto = markdown;
  texto = texto.replace(new RegExp(PADRAO_AUDIO_SKIP, "gi"), "");
  texto = texto.replace(new RegExp(PADRAO_TAG_CUT, "gi"), " ");
  texto = converterTabelasMarkdownParaLeitura(texto);
  texto = texto.replace(/```[\s\S]*?```/g, " (exemplo de código omitido) ");
  texto = texto.replace(/`([^`]+)`/g, "$1");
  texto = texto.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  texto = texto.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  texto = texto.replace(/^#+\s+(.+)$/gm, "$1.");
  texto = texto.replace(/\*\*([^*]+)\*\*/g, "$1");
  texto = texto.replace(/\*([^*]+)\*/g, "$1");
  texto = texto.replace(/__([^_]+)__/g, "$1");
  texto = texto.replace(/_([^_]+)_/g, "$1");
  texto = texto.replace(/^[\s]*[*+-]\s+/gm, "");
  texto = texto.replace(/^[\s]*\d+\.\s+/gm, "");
  texto = texto.replace(/^[\s]*>\s+/gm, "");
  texto = normalizarSimbolosParaFala(texto);
  texto = limparEmojis(texto);
  texto = texto.replace(/\.\.+/g, ".");
  texto = texto.replace(/\n+/g, " ");
  texto = texto.replace(/\s+/g, " ");
  return texto.trim();
}

/**
 * Divide automaticamente um segmento que ultrapasse o limite de 2500 caracteres
 * em fronteiras naturais de frase (. ! ?), evitando que qualquer lição falhe ou
 * ultrapasse a janela de atenção do TTS mesmo que não tenha <!-- cut --> manual.
 */
function subdividirSegmentoLongo(
  textoLimpo,
  limite = LIMITE_CARACTERES_POR_PARTE,
) {
  if (textoLimpo.length <= limite) {
    return [textoLimpo];
  }

  const sentencas = textoLimpo.split(/(?<=[.!?])\s+/);
  const subPartes = [];
  let acumulador = "";

  for (const sentenca of sentencas) {
    if (!acumulador) {
      acumulador = sentenca;
    } else if (acumulador.length + 1 + sentenca.length <= limite) {
      acumulador += ` ${sentenca}`;
    } else {
      subPartes.push(acumulador);
      acumulador = sentenca;
    }
  }
  if (acumulador) {
    subPartes.push(acumulador);
  }
  return subPartes;
}

/**
 * Monta as partes da narração a partir do Markdown da lição:
 *
 * 1. Remove blocos `<!-- audio-skip-start --> ... <!-- audio-skip-end -->`.
 * 2. Respeita rigorosamente cada `<!-- cut -->` marcado pelo autor.
 * 3. Se uma lição não tiver `<!-- cut -->` e passar de 2500 caracteres, divide
 *    automaticamente nas seções `###` e fim de frases para nunca estourar os 2500 chars.
 */
export function montarPartesNarracao(tituloBruto, corpoMarkdown) {
  const tituloLimpo = limparEmojis(tituloBruto || "");
  const corpoBruto = corpoMarkdown || "";
  const temTagCut = new RegExp(PADRAO_TAG_CUT, "i").test(corpoBruto);

  const semSkip = corpoBruto.replace(new RegExp(PADRAO_AUDIO_SKIP, "gi"), "\n");

  const textoCompletoLimpo = limparMarkdownParaLeitura(semSkip);
  const textoFinal = tituloLimpo
    ? textoCompletoLimpo
      ? `${tituloLimpo}. ${textoCompletoLimpo}`
      : `${tituloLimpo}.`
    : textoCompletoLimpo;

  if (!textoFinal) {
    throw new Error(
      "Nada para sintetizar após limpar o Markdown (corpo vazio ou só em audio-skip).",
    );
  }

  const partes = subdividirSegmentoLongo(
    textoFinal,
    LIMITE_CARACTERES_POR_PARTE,
  );
  const totalChars = partes.reduce((soma, parte) => soma + parte.length, 0);

  return {
    partes,
    totalChars,
    temTagCut: false,
  };
}

/**
 * Normaliza o volume RMS (Root Mean Square) de um buffer PCM Int16 mono
 * para um nível constante de estúdio (-18 dBFS RMS, teto com soft-clipping em -1 dBFS),
 * garantindo que todas as partes e todas as lições tenham exatamente o mesmo volume percebido.
 * Também aplica micro fade-in/fade-out de 15ms nas pontas para evitar estalos secos ("clicks").
 */
export function normalizarPcmEstudio(
  pcmBuffer,
  sampleRate = TAXA_AMOSTRAGEM_PCM,
) {
  const numAmostras = Math.floor(pcmBuffer.byteLength / 2);
  if (numAmostras === 0) return pcmBuffer;

  const entrada = new Int16Array(
    pcmBuffer.buffer,
    pcmBuffer.byteOffset,
    numAmostras,
  );
  const saida = new Int16Array(numAmostras);

  const pisoSilencio = 58; // ~ -55 dBFS em Int16
  let somaQuadrados = 0;
  let amostrasAtivas = 0;

  for (let indice = 0; indice < numAmostras; indice += 1) {
    const valor = entrada[indice];
    if (Math.abs(valor) > pisoSilencio) {
      somaQuadrados += valor * valor;
      amostrasAtivas += 1;
    }
  }

  const rmsAtual =
    amostrasAtivas > 0 ? Math.sqrt(somaQuadrados / amostrasAtivas) : 1;
  const rmsAlvo = 4125; // -18 dBFS
  const ganho = Math.max(0.4, Math.min(2.6, rmsAlvo / Math.max(rmsAtual, 1)));

  const tetoPico = 29200; // ~ -1 dBFS
  const amostrasFade = Math.min(
    Math.floor(sampleRate * 0.015),
    Math.floor(numAmostras / 4),
  );

  for (let indice = 0; indice < numAmostras; indice += 1) {
    let fatorFade = 1.0;
    if (indice < amostrasFade) {
      fatorFade = indice / amostrasFade;
    } else if (indice > numAmostras - amostrasFade) {
      fatorFade = (numAmostras - indice) / amostrasFade;
    }

    let amplificado = entrada[indice] * ganho * fatorFade;

    if (Math.abs(amplificado) > tetoPico) {
      const sinal = amplificado < 0 ? -1 : 1;
      const excesso = Math.abs(amplificado) - tetoPico;
      const margem = 32767 - tetoPico;
      amplificado = sinal * (tetoPico + margem * Math.tanh(excesso / margem));
    }

    saida[indice] = Math.max(-32768, Math.min(32767, Math.round(amplificado)));
  }

  return Buffer.from(saida.buffer, saida.byteOffset, saida.byteLength);
}

/**
 * Cria um buffer PCM de silêncio (pausa de respiração natural entre partes).
 */
export function criarPausaSilencioPcm(
  duracaoMs = 300,
  sampleRate = TAXA_AMOSTRAGEM_PCM,
) {
  const numAmostras = Math.floor((sampleRate * duracaoMs) / 1000);
  return Buffer.alloc(numAmostras * 2, 0);
}

/**
 * Une múltiplas partes PCM aplicando normalização RMS individual e pausa natural entre cortes.
 */
export function unirPartesPcmNormalizadas(
  pcmPartes,
  sampleRate = TAXA_AMOSTRAGEM_PCM,
) {
  if (!pcmPartes || pcmPartes.length === 0) {
    return Buffer.alloc(0);
  }
  const buffersFinal = [];
  const pausaEntrePartes = criarPausaSilencioPcm(300, sampleRate);

  for (let indice = 0; indice < pcmPartes.length; indice += 1) {
    const parteNormalizada = normalizarPcmEstudio(
      pcmPartes[indice],
      sampleRate,
    );
    buffersFinal.push(parteNormalizada);
    if (indice < pcmPartes.length - 1) {
      buffersFinal.push(pausaEntrePartes);
    }
  }

  return Buffer.concat(buffersFinal);
}

/**
 * Converte bytes PCM (já normalizados) para Buffer MP3 128kbps.
 */
export function converterPcmParaMp3Buffer(
  pcmData,
  sampleRate = TAXA_AMOSTRAGEM_PCM,
) {
  const Mp3Encoder = obterMp3Encoder();
  const length = Math.floor(pcmData.byteLength / 2);
  const amostras = new Int16Array(pcmData.buffer, pcmData.byteOffset, length);

  const encoder = new Mp3Encoder(1, sampleRate, 128);
  const mp3Chunks = [];

  const tamanhoBloco = 1152;
  for (let indice = 0; indice < amostras.length; indice += tamanhoBloco) {
    const bloco = amostras.subarray(indice, indice + tamanhoBloco);
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

/**
 * Extrai os bytes de PCM 16-bit puro caso a API retorne um container WAV (cabeçalho RIFF/WAVE).
 */
export function extrairPcmPuroDeRespostaAudio(bufferAudio) {
  if (!bufferAudio || bufferAudio.byteLength < 44) {
    return bufferAudio;
  }

  const assinaturaRiff = bufferAudio.subarray(0, 4).toString("ascii");
  const assinaturaWave = bufferAudio.subarray(8, 12).toString("ascii");
  if (assinaturaRiff !== "RIFF" || assinaturaWave !== "WAVE") {
    return bufferAudio;
  }

  let offset = 12;
  while (offset + 8 <= bufferAudio.byteLength) {
    const idSubBloco = bufferAudio
      .subarray(offset, offset + 4)
      .toString("ascii");
    const tamanhoSubBloco = bufferAudio.readUInt32LE(offset + 4);
    const inicioDados = offset + 8;

    if (idSubBloco === "data") {
      const fimDados = Math.min(
        inicioDados + tamanhoSubBloco,
        bufferAudio.byteLength,
      );
      return Buffer.from(bufferAudio.subarray(inicioDados, fimDados));
    }

    offset = inicioDados + tamanhoSubBloco + (tamanhoSubBloco % 2);
  }

  return Buffer.from(bufferAudio.subarray(44));
}

/**
 * Faz a requisição ao Gemini 3.8 Flash TTS enviando estritamente o roteiro limpo em `contents`
 * (sem metadados/instruções no corpo para não serem lidos nem quebrarem o alinhador de fala),
 * com retry automático em caso de Rate Limit (429).
 */
export async function requisitarPcmDaApi(ai, texto, voz) {
  const maxTentativas = 3;
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa += 1) {
    try {
      const resposta = await ai.models.generateContent({
        model: MODELO_TTS,
        contents: texto,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voz,
              },
            },
          },
        },
      });

      const parteInline = resposta.candidates?.[0]?.content?.parts?.find(
        (parte) => parte.inlineData,
      )?.inlineData;
      const audioBase64 = parteInline?.data;

      if (!audioBase64) {
        throw new Error(
          `Áudio retornado nulo para a voz ${voz} no modelo ${MODELO_TTS}.`,
        );
      }

      const bufferBruto = Buffer.from(audioBase64, "base64");
      return extrairPcmPuroDeRespostaAudio(bufferBruto);
    } catch (erro) {
      const msg = String(erro?.message || erro);
      const ehRateLimit =
        msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");

      if (ehRateLimit && tentativa < maxTentativas) {
        const esperaSegundos = tentativa * 25;
        await new Promise((resolve) =>
          setTimeout(resolve, esperaSegundos * 1000),
        );
        continue;
      }
      throw erro;
    }
  }
}
