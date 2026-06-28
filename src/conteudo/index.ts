/**
 * Loader de Conteúdo — carrega arquivos .md com frontmatter e monta o currículo.
 *
 * Usa import.meta.glob do Vite para importar todos os .md como strings.
 * Parseia o frontmatter YAML simples e constrói o array Fase[].
 */

import type { Fase, Passo, TipoPasso } from '../tipos';

// Importa todos os .md como string crua
const arquivosMarkdown = import.meta.glob('./*/[0-9]*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

// Importa os metadados de cada fase
const arquivosMeta = import.meta.glob('./*/_meta.json', { eager: true, import: 'default' }) as Record<string, { id: number; titulo: string; descricao: string }>;

interface FrontmatterParsed {
  id: string;
  titulo: string;
  estadoVisual: string;
  tipo: TipoPasso;
  ordem: number;
  urlVideo?: string;
  quizId?: string;
}

/**
 * Parseia frontmatter YAML simples (chave: "valor" ou chave: valor).
 */
function parsearFrontmatter(conteudoBruto: string): { dados: FrontmatterParsed; conteudo: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/;
  const match = conteudoBruto.match(frontmatterRegex);

  if (!match) {
    throw new Error('Frontmatter não encontrado no arquivo .md');
  }

  const [, yamlBruto, conteudo] = match;
  const dados: Record<string, string | number> = {};

  for (const linha of yamlBruto.split('\n')) {
    const parMatch = linha.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (parMatch) {
      const [, chave, valor] = parMatch;
      // Converte números
      dados[chave] = /^\d+$/.test(valor) ? parseInt(valor, 10) : valor;
    }
  }

  return { dados: dados as unknown as FrontmatterParsed, conteudo: conteudo.trim() };
}

/**
 * Carrega todas as fases a partir dos arquivos .md e _meta.json.
 */
function carregarCurriculo(): Fase[] {
  // Agrupa arquivos por fase
  const fasesPorDiretorio: Record<string, { meta: { id: number; titulo: string; descricao: string }; passos: Passo[] }> = {};

  // Carrega metadados
  for (const [caminho, meta] of Object.entries(arquivosMeta)) {
    const diretorio = caminho.split('/').slice(0, -1).join('/');
    fasesPorDiretorio[diretorio] = { meta, passos: [] };
  }

  // Carrega e parseia cada arquivo .md
  for (const [caminho, conteudoBruto] of Object.entries(arquivosMarkdown)) {
    const diretorio = caminho.split('/').slice(0, -1).join('/');

    if (!fasesPorDiretorio[diretorio]) continue;

    const { dados, conteudo } = parsearFrontmatter(conteudoBruto);

    const passo: Passo = {
      id: dados.id,
      titulo: dados.titulo,
      conteudo,
      estadoVisual: dados.estadoVisual,
      tipo: dados.tipo,
      ...(dados.urlVideo && { urlVideo: dados.urlVideo }),
      ...(dados.quizId && { quizId: dados.quizId }),
    };

    fasesPorDiretorio[diretorio].passos.push(passo);
  }

  // Monta o array final ordenado
  return Object.values(fasesPorDiretorio)
    .sort((a, b) => a.meta.id - b.meta.id)
    .map(({ meta, passos }) => ({
      id: meta.id,
      titulo: meta.titulo,
      descricao: meta.descricao,
      passos: passos.sort((a, b) => {
        // Ordena pelo nome do arquivo (que tem prefixo numérico)
        const ordemA = obterOrdemDoPasso(a.id);
        const ordemB = obterOrdemDoPasso(b.id);
        return ordemA - ordemB;
      }),
    }));
}

/**
 * Obtém a ordem de um passo pelo seu caminho no glob.
 */
function obterOrdemDoPasso(passoId: string): number {
  // Busca nos arquivos importados o path que contém esse id
  for (const caminho of Object.keys(arquivosMarkdown)) {
    if (caminho.includes(passoId.replace('_', '-')) || caminho.includes(passoId)) {
      const nomeArquivo = caminho.split('/').pop() || '';
      const numero = parseInt(nomeArquivo.split('-')[0], 10);
      if (!isNaN(numero)) return numero;
    }
  }
  return 999;
}

/**
 * Currículo carregado dos arquivos .md (substitui dados hardcoded em .ts).
 */
export const CURRICULO_MD: Fase[] = carregarCurriculo();
