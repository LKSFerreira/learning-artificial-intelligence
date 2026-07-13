/**
 * Tipos relacionados ao currículo de aprendizado.
 *
 * Define a estrutura hierárquica: Currículo > Fase > Passo
 *
 * **Exemplo:**
 *
 * .. code-block:: typescript
 *
 *     const fase: Fase = {
 *         id: 1,
 *         titulo: "Fundamentos de IA",
 *         descricao: "Do zero aos conceitos básicos",
 *         passos: [...]
 *     };
 */

/**
 * Tipos possíveis de conteúdo em um passo.
 *
 * - ``content``: Texto em Markdown
 * - ``video``: Vídeo do YouTube embutido
 * - ``quiz``: Questionário interativo
 */
export type TipoPasso = "content" | "video" | "quiz";

/**
 * Representa um passo individual dentro de uma fase.
 *
 * Cada passo pode ser um conteúdo textual, vídeo ou quiz.
 * O campo ``estadoVisual`` controla qual visualização interativa
 * é exibida no painel lateral.
 */
export interface Passo {
  /** Identificador único do passo (ex: "intro", "q_table_intro") */
  id: string;

  /** Título exibido no topo do conteúdo */
  titulo: string;

  /** Conteúdo em Markdown */
  conteudo: string;

  /** Estado visual para o componente de visualização */
  estadoVisual: string;

  /** Tipo de conteúdo do passo */
  tipo: TipoPasso;

  /** URL do vídeo do YouTube (apenas para tipo 'video') */
  urlVideo?: string;

  /** ID do quiz associado (apenas para tipo 'quiz') */
  quizId?: string;

  /** Ordem opcional do passo (carregada do frontmatter) */
  ordem?: number;
}

/**
 * Representa uma fase completa do currículo.
 *
 * Uma fase agrupa vários passos relacionados a um tema específico.
 */
export interface Fase {
  /** Identificador numérico único da fase */
  id: number;

  /** Título da fase exibido na navegação */
  titulo: string;

  /** Breve descrição do conteúdo da fase */
  descricao: string;

  /** Lista ordenada de passos da fase */
  passos: Passo[];
}

/**
 * O currículo completo é uma lista ordenada de fases.
 */
export type Curriculo = Fase[];
