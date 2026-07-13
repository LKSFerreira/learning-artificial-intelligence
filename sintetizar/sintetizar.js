import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Carrega manualmente o arquivo .env da raiz do projeto para compatibilidade universal
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

// Inicializa a chave do Gemini a partir do .env
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// 2. Carrega o lame.min.js em uma sandbox isolada para evitar o erro de escopo "MPEGMode is not defined" no Node
const lamePath = path.join(__dirname, '../node_modules/lamejs/lame.min.js');
if (!fs.existsSync(lamePath)) {
  console.error('ERRO: O pacote lamejs não está instalado no node_modules. Rode npm install primeiro.');
  process.exit(1);
}
const lameCode = fs.readFileSync(lamePath, 'utf-8');
const sandbox = { window: {}, global: {}, exports: {}, module: { exports: {} } };
vm.createContext(sandbox);
vm.runInContext(lameCode, sandbox);
const { Mp3Encoder } = sandbox.lamejs;

// Função para remover emojis e caracteres especiais do título para leitura por voz
function limparEmojis(texto) {
  if (!texto) return '';
  return texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2192}]/gu, '').trim();
}

// Função para limpar marcações markdown do texto para preparação da leitura
function limparMarkdownParaLeitura(markdown) {
  if (!markdown) return '';
  let texto = markdown;
  texto = texto.replace(/```[\s\S]*?```/g, ' (exemplo de código omitido) ');
  texto = texto.replace(/`([^`]+)`/g, '$1');
  texto = texto.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  texto = texto.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  texto = texto.replace(/^#+\s+(.+)$/gm, '$1');
  texto = texto.replace(/\*\*([^*]+)\*\*/g, '$1');
  texto = texto.replace(/\*([^*]+)\*/g, '$1');
  texto = texto.replace(/__([^_]+)__/g, '$1');
  texto = texto.replace(/_([^_]+)_/g, '$1');
  texto = texto.replace(/^[\s]*[*+-]\s+/gm, '');
  texto = texto.replace(/^[\s]*\d+\.\s+/gm, '');
  texto = texto.replace(/^[\s]*>\s+/gm, '');
  texto = texto.replace(/\n+/g, ' ');
  texto = texto.replace(/\s+/g, ' ');
  return texto.trim();
}

// Converte os bytes PCM crus obtidos do Gemini para um Buffer MP3 a 128kbps Mono
function converterPcmParaMp3Buffer(pcmData, sampleRate) {
  // Converte a representação de 8-bit do buffer para amostras de 16-bit assinadas (Little-Endian)
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

// Extrai metadados do frontmatter markdown de forma nativa e segura
function extrairMetadadosMarkdown(conteudo) {
  const match = conteudo.match(/^---([\s\S]*?)---/);
  if (!match) return null;

  const yamlContent = match[1];
  const metadados = {};
  
  yamlContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const indexDoDoisPontos = trimmed.indexOf(':');
    if (indexDoDoisPontos !== -1) {
      const key = trimmed.substring(0, indexDoDoisPontos).trim();
      const val = trimmed.substring(indexDoDoisPontos + 1).trim().replace(/^["']|["']$/g, '');
      metadados[key] = val;
    }
  });

  return metadados;
}

// Varre a pasta de conteúdos recursivamente procurando arquivos .md qualificados
function buscarArquivosMarkdown(dir, arquivos = []) {
  const itens = fs.readdirSync(dir);
  for (const item of itens) {
    const caminhoCompleto = path.join(dir, item);
    const stat = fs.statSync(caminhoCompleto);
    if (stat.isDirectory()) {
      buscarArquivosMarkdown(caminhoCompleto, arquivos);
    } else if (stat.isFile() && item.endsWith('.md')) {
      arquivos.push(caminhoCompleto);
    }
  }
  return arquivos;
}

async function main() {
  if (!apiKey) {
    console.error('ERRO: A variável de ambiente GEMINI_API_KEY não foi encontrada.');
    console.error('Certifique-se de configurar GEMINI_API_KEY no seu arquivo .env na raiz do projeto.');
    process.exit(1);
  }

  // Argumentos de CLI (ex: node sintetizar/sintetizar.js --limite=3 ou --arquivo=sintetizar/sintetizar.md --voz=Aoede)
  let limite = 4;
  let arquivoEspecifico = null;
  let vozEspecifica = 'Aoede';

  process.argv.forEach(arg => {
    if (arg.startsWith('--limite=')) {
      limite = parseInt(arg.split('=')[1], 10);
    }
    if (arg.startsWith('--arquivo=')) {
      arquivoEspecifico = arg.split('=')[1];
    }
    if (arg.startsWith('--voz=')) {
      vozEspecifica = arg.split('=')[1];
    }
  });

  if (isNaN(limite) || limite <= 0) {
    limite = 4;
  }

  // --- MODO TESTE AVULSO DE ARQUIVO ESPECÍFICO ---
  if (arquivoEspecifico) {
    console.log('[AutomaçãoTTS] Modo Teste Avulso Ativo.');
    console.log(` - Lendo arquivo: ${arquivoEspecifico}`);

    if (!fs.existsSync(arquivoEspecifico)) {
      console.error(`ERRO: Arquivo ${arquivoEspecifico} não encontrado.`);
      process.exit(1);
    }

    const conteudo = fs.readFileSync(arquivoEspecifico, 'utf-8');
    let titulo = '';
    let corpoMarkdown = conteudo;

    const metadados = extrairMetadadosMarkdown(conteudo);
    if (metadados) {
      titulo = metadados.titulo || '';
      corpoMarkdown = conteudo.replace(/^---[\s\S]*?---/, '').trim();
    } else {
      const linhas = conteudo.split('\n');
      if (linhas[0] && linhas[0].trim().startsWith('#')) {
        titulo = linhas[0].trim().replace(/^#+\s+/, '');
        corpoMarkdown = linhas.slice(1).join('\n').trim();
      }
    }

    const tituloLimpo = limparEmojis(titulo);
    const corpoLimpo = limparMarkdownParaLeitura(corpoMarkdown);
    const textoSintese = tituloLimpo ? `${tituloLimpo}. \n\n ${corpoLimpo}` : corpoLimpo;

    console.log(` - Texto limpo para leitura (${textoSintese.length} caracteres).`);
    console.log(` - Sintetizando via Gemini com a voz: ${vozEspecifica}...`);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const resposta = await ai.interactions.create({
        model: 'gemini-3.1-flash-tts-preview',
        input: `Leia em voz alta, com tom calmo, profissional, didático e natural de professor de computação, o seguinte texto em português do Brasil (leia o texto de forma limpa, direta, sem introduções ou comentários de metadados): ${textoSintese}`,
        response_format: { type: 'audio' },
        generation_config: {
          speech_config: [
            { voice: vozEspecifica }
          ]
        }
      });

      const audioBase64 = resposta.output_audio?.data;
      if (!audioBase64) {
        throw new Error('A API do Gemini retornou dados de áudio nulos.');
      }

      const pcmData = Buffer.from(audioBase64, 'base64');
      console.log(` - Comprimindo áudio para MP3 a 128kbps...`);
      const mp3Buffer = converterPcmParaMp3Buffer(pcmData, 24000);

      const dirDoArquivo = path.dirname(arquivoEspecifico);
      const timestamp = Date.now();
      const nomeBase = path.basename(arquivoEspecifico, path.extname(arquivoEspecifico));
      const caminhoSaida = path.join(dirDoArquivo, `${nomeBase}_${timestamp}.mp3`);
      fs.writeFileSync(caminhoSaida, mp3Buffer);

      console.log(`[AutomaçãoTTS] Sucesso! Áudio de teste gerado em: ${caminhoSaida} (${(mp3Buffer.length / 1024).toFixed(1)} KB)`);
      process.exit(0);
    } catch (err) {
      console.error('❌ Erro no teste avulso:', err.message || err);
      process.exit(1);
    }
  }

  // --- MODO VARREDURA DE LOTE (PLATAFORMA) ---
  const dirConteudo = path.join(__dirname, '../src/conteudo');
  const dirPublicAudios = path.join(__dirname, '../public/audios');
  const mapaCaminho = path.join(__dirname, 'mapa_sintese.json');

  fs.mkdirSync(dirPublicAudios, { recursive: true });

  let mapa = {};
  if (fs.existsSync(mapaCaminho)) {
    try {
      mapa = JSON.parse(fs.readFileSync(mapaCaminho, 'utf-8'));
    } catch {
      mapa = {};
    }
  }

  console.log('[AutomaçãoTTS] Buscando arquivos Markdown de conteúdo em:', dirConteudo);
  const todosArquivos = buscarArquivosMarkdown(dirConteudo);
  const filaPendencias = [];

  todosArquivos.forEach(arqPath => {
    const conteudo = fs.readFileSync(arqPath, 'utf-8');
    const metadados = extrairMetadadosMarkdown(conteudo);
    
    if (metadados && metadados.tipo === 'content' && metadados.id) {
      const id = metadados.id;
      const titulo = metadados.titulo || '';
      const corpoMarkdown = conteudo.replace(/^---[\s\S]*?---/, '').trim();

      ['Aoede', 'Kore'].forEach(voz => {
        const nomeArquivoFinal = `${id}_${voz}.mp3`;
        const caminhoArquivoFinal = path.join(dirPublicAudios, nomeArquivoFinal);
        const jaExisteFisico = fs.existsSync(caminhoArquivoFinal);
        const jaSintetizado = mapa[id]?.[voz] && jaExisteFisico;

        if (!jaSintetizado) {
          filaPendencias.push({
            id,
            titulo,
            corpoMarkdown,
            voz,
            nomeArquivoFinal,
            caminhoArquivoFinal
          });
        }
      });
    }
  });

  const totalGeral = todosArquivos.length * 2;
  const jaProntos = totalGeral - filaPendencias.length;

  console.log(`[AutomaçãoTTS] Status da Plataforma:`);
  console.log(` - Áudios necessários (2 vozes/lição): ${totalGeral}`);
  console.log(` - Áudios prontos e mapeados: ${jaProntos}`);
  console.log(` - Áudios pendentes de síntese: ${filaPendencias.length}`);

  if (filaPendencias.length === 0) {
    console.log('[AutomaçãoTTS] Excelente! Todas as lições da plataforma já estão com áudios em MP3 gerados!');
    process.exit(0);
  }

  const quantidadeAGerar = Math.min(limite, filaPendencias.length);
  console.log(`[AutomaçãoTTS] Chave Free Tier ativa. Limite desta execução configurado em: ${quantidadeAGerar} áudio(s).`);

  const ai = new GoogleGenAI({ apiKey });

  for (let i = 0; i < quantidadeAGerar; i++) {
    const item = filaPendencias[i];
    console.log(`\n------------------------------------------------------------`);
    console.log(`[Item ${i + 1}/${quantidadeAGerar}] Processando lição: "${item.id}" com a voz: ${item.voz}...`);

    try {
      const tituloLimpo = limparEmojis(item.titulo);
      const corpoLimpo = limparMarkdownParaLeitura(item.corpoMarkdown);
      const textoSintese = `${tituloLimpo}. \n\n ${corpoLimpo}`;

      console.log(` - Texto total de leitura: ${textoSintese.length} caracteres.`);
      console.log(` - Chamando API do Gemini...`);

      const resposta = await ai.interactions.create({
        model: 'gemini-3.1-flash-tts-preview',
        input: `Leia em voz alta, com tom calmo, profissional, didático e natural de professor de computação, o seguinte texto em português do Brasil (leia o texto de forma limpa, direta, sem introduções ou comentários de metadados): ${textoSintese}`,
        response_format: { type: 'audio' },
        generation_config: {
          speech_config: [
            { voice: item.voz }
          ]
        }
      });

      const audioBase64 = resposta.output_audio?.data;
      if (!audioBase64) {
        throw new Error('A API do Gemini retornou dados de áudio nulos.');
      }

      const pcmData = Buffer.from(audioBase64, 'base64');
      console.log(` - Comprimindo áudio em background para MP3 a 128kbps...`);
      const mp3Buffer = converterPcmParaMp3Buffer(pcmData, 24000);

      fs.writeFileSync(item.caminhoArquivoFinal, mp3Buffer);
      console.log(` - Sucesso! MP3 salvo em: ${item.nomeArquivoFinal} (${(mp3Buffer.length / 1024).toFixed(1)} KB)`);

      if (!mapa[item.id]) mapa[item.id] = {};
      mapa[item.id][item.voz] = true;
      fs.writeFileSync(mapaCaminho, JSON.stringify(mapa, null, 2));

      if (i < quantidadeAGerar - 1) {
        console.log(` - Pausando por 2 segundos antes do próximo item...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (err) {
      console.error(`❌ Erro ao sintetizar item "${item.id}" com voz ${item.voz}:`, err.message || err);
      console.log('Interrompendo lote devido a erro da API (evita estressar conexões bloqueadas).');
      break;
    }
  }

  console.log(`\n------------------------------------------------------------`);
  console.log(`[AutomaçãoTTS] Execução concluída!`);
  console.log(`Rode o script novamente no futuro para gerar os próximos áudios pendentes.`);
}

main();
