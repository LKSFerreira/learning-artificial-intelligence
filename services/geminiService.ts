import { GoogleGenAI } from "@google/genai";

// Inicializa o cliente apenas se a chave estiver presente
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Solicita ao Gemini uma explicação alternativa ou analogia para o passo atual.
 * Útil quando o usuário clica em "Me explique melhor".
 */
export const askAiTutor = async (phaseTitle: string, stepTitle: string, stepContent: string): Promise<string> => {
  if (!ai) {
    return "A API Key do Gemini não foi configurada. Por favor, configure a variável de ambiente API_KEY.";
  }

  try {
    const prompt = `
      Você é um tutor de Inteligência Artificial para iniciantes absolutos.
      O aluno está na fase: "${phaseTitle}", tópico: "${stepTitle}".
      A explicação atual é: "${stepContent}".

      O aluno pediu uma explicação mais detalhada ou uma analogia do mundo real (como aprender a andar de bicicleta, cozinhar, video games, etc).
      
      Gere uma explicação curta (máximo 2 parágrafos), didática e encorajadora em Português do Brasil.
      Use emojis para tornar o texto amigável.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Desculpe, não consegui gerar uma explicação agora.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao conectar com o Tutor IA. Tente novamente em instantes.";
  }
};