/**
 * Serviço de integração com a API do Google Gemini.
 * 
 * Fornece funcionalidades de Tutor IA para explicar conceitos
 * de forma alternativa ao usuário.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { solicitarExplicacaoTutorIA } from '@/src/servicos/servicoGemini';
 *     
 *     const explicacao = await solicitarExplicacaoTutorIA(
 *         "Fundamentos de IA",
 *         "O que é IA?",
 *         "Conteúdo do passo..."
 *     );
 * 
 * .. note::
 *    A API Key deve ser configurada via variável de ambiente GEMINI_API_KEY.
 */

import { GoogleGenAI } from "@google/genai";

// Inicializa o cliente apenas se a chave estiver presente
const chaveApi = process.env.API_KEY || '';
const clienteGemini = chaveApi ? new GoogleGenAI({ apiKey: chaveApi }) : null;

/**
 * Solicita ao Gemini uma explicação alternativa ou analogia para o passo atual.
 * 
 * Esta função é chamada quando o usuário clica em "Me explique melhor (Tutor IA)".
 * 
 * :param tituloFase: Título da fase atual (ex: "Fundamentos de IA")
 * :param tituloPasso: Título do passo atual (ex: "O que é IA?")
 * :param conteudoPasso: Conteúdo em Markdown do passo
 * :returns: String com a explicação gerada ou mensagem de erro
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const explicacao = await solicitarExplicacaoTutorIA(
 *         "Q-Learning",
 *         "A Mágica da Q-Table",
 *         "Conteúdo sobre Q-Table..."
 *     );
 *     console.log(explicacao);
 */
export async function solicitarExplicacaoTutorIA(
  tituloFase: string, 
  tituloPasso: string, 
  conteudoPasso: string
): Promise<string> {
  // Verifica se o cliente foi inicializado
  if (!clienteGemini) {
    return "A API Key do Gemini não foi configurada. Por favor, configure a variável de ambiente GEMINI_API_KEY.";
  }

  try {
    const prompt = `
      Você é um tutor de Inteligência Artificial para iniciantes absolutos.
      O aluno está na fase: "${tituloFase}", tópico: "${tituloPasso}".
      A explicação atual é: "${conteudoPasso}".

      O aluno pediu uma explicação mais detalhada ou uma analogia do mundo real (como aprender a andar de bicicleta, cozinhar, video games, etc).
      
      Gere uma explicação curta (máximo 2 parágrafos), didática e encorajadora em Português do Brasil.
      Use emojis para tornar o texto amigável.
    `;

    const resposta = await clienteGemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return resposta.text || "Desculpe, não consegui gerar uma explicação agora.";
  } catch (erro) {
    console.error("Erro ao chamar Gemini:", erro);
    return "Ocorreu um erro ao conectar com o Tutor IA. Tente novamente em instantes.";
  }
}

/**
 * Verifica se a API do Gemini está configurada e disponível.
 * 
 * :returns: true se a API está pronta para uso
 */
export function tutorIADisponivel(): boolean {
  return clienteGemini !== null;
}

// Mantém export legado para compatibilidade durante migração
export const askAiTutor = solicitarExplicacaoTutorIA;
