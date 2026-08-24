import type { ElementoCena, Pilar } from "./tipos";

export interface DetalhePilar {
  rotuloCurto: string;
  titulo: string;
  etiqueta: string;
  resumo: string;
  responsabilidade: string;
  naoE: string;
  elementosFoco: readonly ElementoCena[];
}

export interface FichaDesafio {
  id: string;
  enunciado: string;
  pilarCorreto: Exclude<Pilar, "visaoGeral">;
  explicacao: string;
}

const TODOS_ELEMENTOS: readonly ElementoCena[] = [
  "mente",
  "chassi",
  "bateria",
  "sofa",
  "tapete",
  "tomada",
  "estado",
  "acao",
  "recompensa",
];

export const DETALHES_PILARES: Record<Pilar, DetalhePilar> = {
  visaoGeral: {
    rotuloCurto: "Visão geral",
    titulo: "Os cinco papéis em um passo",
    etiqueta: "Mapa do sistema",
    resumo: "O agente escolhe. O ambiente responde com um novo estado e uma recompensa.",
    responsabilidade: "Acompanhe a responsabilidade de cada parte antes de executar uma ação.",
    naoE: "Não é uma sexta peça: é apenas a visão conjunta das cinco.",
    elementosFoco: TODOS_ELEMENTOS,
  },
  agente: {
    rotuloCurto: "1. Agente",
    titulo: "Agente: a mente que decide",
    etiqueta: "Quem escolhe",
    resumo: "A mente do Bibi lê o estado e seleciona uma ação possível.",
    responsabilidade: "Só o visor representa a parte que decide.",
    naoE: "Não é o chassi, as rodas nem a bateria: esses elementos pertencem ao ambiente.",
    elementosFoco: ["mente"],
  },
  ambiente: {
    rotuloCurto: "2. Ambiente",
    titulo: "Ambiente: o mundo e suas regras",
    etiqueta: "Onde acontece",
    resumo: "A sala limita movimentos, contém a tomada e emite a consequência numérica.",
    responsabilidade: "O sofá, o tapete, a tomada, o chassi e a bateria estão no mundo.",
    naoE: "Não é a mente que decide; o ambiente só aplica suas regras.",
    elementosFoco: ["chassi", "bateria", "sofa", "tapete", "tomada"],
  },
  estado: {
    rotuloCurto: "3. Estado",
    titulo: "Estado: a foto do instante",
    etiqueta: "O que existe agora",
    resumo: "É a leitura atual de posição e bateria, não uma memória completa.",
    responsabilidade: "Leia o chip de estado para saber o que Bibi percebe neste instante.",
    naoE: "Não é o histórico inteiro: é somente a fotografia atual.",
    elementosFoco: ["estado"],
  },
  acao: {
    rotuloCurto: "4. Ação",
    titulo: "Ação: a escolha executada",
    etiqueta: "O que fazer",
    resumo: "Recuar, avançar e conectar são escolhas que o agente pode enviar ao mundo.",
    responsabilidade: "Use os controles para escolher uma hipótese e observar a resposta.",
    naoE: "Não é a consequência: o ambiente ainda precisa responder.",
    elementosFoco: ["acao"],
  },
  recompensa: {
    rotuloCurto: "5. Recompensa",
    titulo: "Recompensa: o sinal do ambiente",
    etiqueta: "O resultado numérico",
    resumo: "O ambiente entrega um número que informa se aquela consequência foi boa ou ruim.",
    responsabilidade: "Acompanhe o sinal saindo da sala e chegando ao retorno acumulado.",
    naoE: "Não é a bateria nem uma explicação em texto: é um sinal numérico.",
    elementosFoco: ["recompensa"],
  },
};

export const FICHAS_DESAFIO: readonly FichaDesafio[] = [
  {
    id: "sofa",
    enunciado: "O sofá que bloqueia a passagem",
    pilarCorreto: "ambiente",
    explicacao: "O sofá é uma regra física da sala, portanto pertence ao Ambiente.",
  },
  {
    id: "girar",
    enunciado: "Decidir girar para a esquerda",
    pilarCorreto: "acao",
    explicacao: "Decidir um movimento é uma Ação. O ambiente ainda precisa processá-la.",
  },
  {
    id: "colisao",
    enunciado: "Receber -2 pela colisão",
    pilarCorreto: "recompensa",
    explicacao: "O -2 é o sinal numérico que o Ambiente devolve: uma Recompensa negativa.",
  },
  {
    id: "tapete",
    enunciado: "Estar no meio do tapete",
    pilarCorreto: "estado",
    explicacao: "A posição atual é a fotografia do instante, isto é, o Estado.",
  },
  {
    id: "bateria",
    enunciado: "A bateria física do robô",
    pilarCorreto: "ambiente",
    explicacao: "A bateria é parte do corpo no mundo. A mente que decide é o Agente.",
  },
];

export function pilarFocaElemento(pilar: Pilar, elemento: ElementoCena): boolean {
  return DETALHES_PILARES[pilar].elementosFoco.includes(elemento);
}
