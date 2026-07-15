/**
 * Analisador de travessões no conteúdo escrito.
 *
 * ═══════════════════════════════════════════════════════════════════
 * TRAVESSÃO ≠ HÍFEN  (não confundir)
 * ═══════════════════════════════════════════════════════════════════
 *
 * PROIBIDO (travessão e variantes de traço longo / meio-travessão):
 *   —  U+2014  travessão (em dash)
 *   –  U+2013  meio-travessão (en dash)
 *   ―  U+2015  barra horizontal
 *   ‒  U+2012  figure dash
 *   ⸺ ⸻       travessões multiplos
 *
 * PERMITIDO (hífen e uso normal de pontuação):
 *   -  U+002D  hífen ASCII  → compostos (bem-vindo), listas, frontmatter
 *   ‑  U+2011  hífen inquebrável (se aparecer, NÃO é travessão)
 *   ‐  U+2010  hífen tipográfico curto (NÃO é travessão)
 *
 * Uso:
 *   node tools/analisar-travessoes.js
 *   node tools/analisar-travessoes.js --caminho src/conteudo
 *   node tools/analisar-travessoes.js --caminho docs --caminho src/conteudo
 *   node tools/analisar-travessoes.js --ext md,mdx,txt
 *
 * Código de saída: 0 se limpo; 1 se houver travessões.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raizProjeto = path.resolve(__dirname, "..");

/**
 * Só travessões / traços longos (NÃO inclui hífen).
 * Hífen ASCII (-) e hífens curtos Unicode NÃO entram nesta lista.
 */
const CARACTERES_PROIBIDOS = [
  { char: "\u2014", nome: "travessão (em dash —)", codigo: "U+2014" },
  { char: "\u2013", nome: "meio-travessão (en dash –)", codigo: "U+2013" },
  { char: "\u2015", nome: "barra horizontal (―)", codigo: "U+2015" },
  { char: "\u2012", nome: "figure dash (‒)", codigo: "U+2012" },
  { char: "\u2E3A", nome: "travessão duplo (⸺)", codigo: "U+2E3A" },
  { char: "\u2E3B", nome: "travessão triplo (⸻)", codigo: "U+2E3B" },
  { char: "\uFE58", nome: "travessão pequeno (﹘)", codigo: "U+FE58" },
];

/** Entidades / escapes que inserem travessão (não hífen). */
const PADROES_TEXTO_PROIBIDOS = [
  { regex: /&mdash;/gi, nome: "entidade HTML &mdash; (travessão)" },
  { regex: /&ndash;/gi, nome: "entidade HTML &ndash; (meio-travessão)" },
  { regex: /&#8212;/g, nome: "entidade numérica &#8212; (travessão)" },
  { regex: /&#x2014;/gi, nome: "entidade hex &#x2014; (travessão)" },
  { regex: /&#8211;/g, nome: "entidade numérica &#8211; (meio-travessão)" },
  { regex: /&#x2013;/gi, nome: "entidade hex &#x2013; (meio-travessão)" },
  { regex: /\\u2014/gi, nome: "escape Unicode \\u2014 (travessão)" },
  { regex: /\\u2013/gi, nome: "escape Unicode \\u2013 (meio-travessão)" },
];

const EXTENSOES_PADRAO = [".md", ".mdx", ".txt", ".tsx", ".ts", ".jsx", ".js"];
const DIRETORIOS_PADRAO = [
  path.join(raizProjeto, "src", "conteudo"),
  path.join(raizProjeto, "docs"),
];

const IGNORAR_NOMES = new Set([
  "node_modules",
  "dist",
  ".git",
  "public",
  "mcps",
]);

function imprimirAjuda() {
  console.log(`
analisar-travessoes: localiza TRAVESSÕES proibidos no conteúdo

  Travessão (proibido):  —  –  ―  …
  Hífen (permitido):     -   bem-vindo, auto-atenção, frontmatter

Uso:
  node tools/analisar-travessoes.js [opções]

Opções:
  --caminho <dir|arquivo>   Diretório ou arquivo a varrer (repetível)
  --ext <lista>             Extensões separadas por vírgula (ex: md,txt)
  --ajuda                   Mostra esta ajuda

Sem --caminho, varre: src/conteudo e docs
`);
}

function analisarArgumentos(argv) {
  const caminhos = [];
  let extensoes = [...EXTENSOES_PADRAO];

  for (let indice = 0; indice < argv.length; indice += 1) {
    const argumento = argv[indice];
    if (argumento === "--ajuda" || argumento === "-h") {
      return { ajuda: true };
    }
    if (argumento === "--caminho") {
      const valor = argv[indice + 1];
      if (!valor) {
        throw new Error("Opção --caminho exige um caminho.");
      }
      caminhos.push(path.resolve(process.cwd(), valor));
      indice += 1;
      continue;
    }
    if (argumento === "--ext") {
      const valor = argv[indice + 1];
      if (!valor) {
        throw new Error("Opção --ext exige uma lista (ex: md,txt).");
      }
      extensoes = valor.split(",").map((extensao) => {
        const limpa = extensao.trim();
        return limpa.startsWith(".") ? limpa : `.${limpa}`;
      });
      indice += 1;
      continue;
    }
    throw new Error(`Argumento desconhecido: ${argumento}`);
  }

  return {
    ajuda: false,
    caminhos: caminhos.length > 0 ? caminhos : DIRETORIOS_PADRAO,
    extensoes,
  };
}

function listarArquivos(origem, extensoes, acumulado = []) {
  if (!fs.existsSync(origem)) {
    console.warn(`⚠ Caminho inexistente (ignorado): ${origem}`);
    return acumulado;
  }

  const estatistica = fs.statSync(origem);
  if (estatistica.isFile()) {
    const extensao = path.extname(origem).toLowerCase();
    if (extensoes.includes(extensao)) {
      acumulado.push(origem);
    }
    return acumulado;
  }

  if (!estatistica.isDirectory()) {
    return acumulado;
  }

  for (const nome of fs.readdirSync(origem)) {
    if (IGNORAR_NOMES.has(nome)) continue;
    listarArquivos(path.join(origem, nome), extensoes, acumulado);
  }

  return acumulado;
}

/**
 * Pedacinho antes e depois do travessão (suficiente para um LLM achar e corrigir).
 */
function montarContexto(linha, indiceColuna, charsAntes = 18, charsDepois = 22) {
  const inicio = Math.max(0, indiceColuna - charsAntes);
  const fim = Math.min(linha.length, indiceColuna + charsDepois + 1);
  let trecho = linha.slice(inicio, fim).replace(/\t/g, " ").replace(/\s+/g, " ");
  if (inicio > 0) trecho = "…" + trecho;
  if (fim < linha.length) trecho = trecho + "…";
  return trecho;
}

function escanearArquivo(caminhoArquivo) {
  const conteudo = fs.readFileSync(caminhoArquivo, "utf8");
  const linhas = conteudo.split(/\r?\n/);
  const ocorrencias = [];

  for (let indiceLinha = 0; indiceLinha < linhas.length; indiceLinha += 1) {
    const linha = linhas[indiceLinha];
    const numeroLinha = indiceLinha + 1;

    for (const proibido of CARACTERES_PROIBIDOS) {
      let posicao = 0;
      while (posicao < linha.length) {
        const encontrado = linha.indexOf(proibido.char, posicao);
        if (encontrado === -1) break;
        ocorrencias.push({
          arquivo: caminhoArquivo,
          linha: numeroLinha,
          trecho: montarContexto(linha, encontrado),
        });
        posicao = encontrado + 1;
      }
    }

    for (const padrao of PADROES_TEXTO_PROIBIDOS) {
      padrao.regex.lastIndex = 0;
      let match;
      while ((match = padrao.regex.exec(linha)) !== null) {
        ocorrencias.push({
          arquivo: caminhoArquivo,
          linha: numeroLinha,
          trecho: montarContexto(linha, match.index),
        });
      }
    }
  }

  return ocorrencias;
}

function caminhoRelativo(absoluto) {
  return path.relative(raizProjeto, absoluto).split(path.sep).join("/");
}

function main() {
  let opcoes;
  try {
    opcoes = analisarArgumentos(process.argv.slice(2));
  } catch (erro) {
    console.error(`✖ ${erro.message}`);
    process.exit(2);
  }

  if (opcoes.ajuda) {
    imprimirAjuda();
    process.exit(0);
  }

  const arquivos = [];
  for (const caminho of opcoes.caminhos) {
    listarArquivos(caminho, opcoes.extensoes, arquivos);
  }

  const unicos = [...new Set(arquivos)].sort();
  const todasOcorrencias = [];

  for (const arquivo of unicos) {
    todasOcorrencias.push(...escanearArquivo(arquivo));
  }

  if (todasOcorrencias.length === 0) {
    console.log(`ok: 0 travessões em ${unicos.length} arquivos (hífen - permitido)`);
    process.exit(0);
  }

  console.log(`travessões: ${todasOcorrencias.length} em ${unicos.length} arquivos`);
  for (const item of todasOcorrencias) {
    // Formato mínimo para agente: arquivo:linha + pedaço de contexto
    console.log(`${caminhoRelativo(item.arquivo)}:${item.linha}  ${item.trecho}`);
  }
  process.exit(1);
}

main();
