/**
 * Catálogo de itens do simulador "Regras vs Machine Learning".
 *
 * - `cor`: valor lido pela regra demonstrativa `item.color === 'vermelho'`
 * - `ehPocao`: rótulo verdadeiro (gabarito humano) para o contraste com a regra frágil
 * - `descricaoImagem`: prompt de geração (mesma estética em todos)
 * - `arquivo`: nome do PNG em `/imagens/simulador-ml/`
 */

/** Cor em português (valor de `item.color` no snippet didático). */
export type CorItemRegra =
  | "vermelho"
  | "verde"
  | "azul"
  | "roxo"
  | "laranja"
  | "rosa"
  | "dourado"
  | "prata"
  | "marrom"
  | "transparente";

export interface ItemSimuladorML {
  id: string;
  nome: string;
  /** Rótulo humano: é uma poção/elixir do inventário mágico? */
  ehPocao: boolean;
  /** Atributo lido pela regra fixa (só 'vermelho' passa). */
  cor: CorItemRegra;
  /** Categoria livre para UI e futuros filtros. */
  categoria: "pocao" | "comida" | "arma" | "tesouro" | "utilitario";
  /**
   * Descrição para geração de imagem.
   * Sempre prefixar com ESTETICA_ITENS_SIMULADOR_ML na hora de gerar.
   */
  descricaoImagem: string;
  /** Arquivo em public/imagens/simulador-ml/{arquivo} */
  arquivo: string;
}

/**
 * Estética = referência `33.jpg` (frasco 3D em vidro).
 * Fundo liso escuro. SEM sombra no chão. SEM glow/bloom. SEM placa.
 */
export const ESTETICA_ITENS_SIMULADOR_ML =
  "Same 3D glass potion render style as reference, solid flat dark navy background, no cast shadow, no ground shadow, no magical glow, no bloom, no plate, no card, square 1:1, no text.";

/** Pasta pública dos assets. */
export const PASTA_IMAGENS_SIMULADOR_ML = "/imagens/simulador-ml";

export function obterCaminhoImagemItem(item: ItemSimuladorML): string {
  return `${PASTA_IMAGENS_SIMULADOR_ML}/${item.arquivo}`;
}

/**
 * Resultado da regra fixa do snippet didático:
 * só retorna true se cor === 'vermelho' (não olha se é poção de verdade).
 */
export function avaliarRegraVermelha(item: ItemSimuladorML): boolean {
  return item.cor === "vermelho";
}

/**
 * Catálogo amplo: poções de várias cores + não-poções (incluindo falsos positivos vermelhos).
 */
export const ITENS_SIMULADOR_ML: ItemSimuladorML[] = [
  // --- Poções (rótulo verdadeiro) ---
  {
    id: "pocao-vermelha",
    nome: "Poção Vermelha",
    ehPocao: true,
    cor: "vermelho",
    categoria: "pocao",
    arquivo: "pocao-vermelha.png",
    descricaoImagem:
      "Round glass potion bottle filled with bright red liquid, cork stopper.",
  },
  {
    id: "elixir-vermelho",
    nome: "Elixir Vermelho",
    ehPocao: true,
    cor: "vermelho",
    categoria: "pocao",
    arquivo: "elixir-vermelho.png",
    descricaoImagem:
      "Tall slender cylindrical glass vial filled with bright red liquid, cork stopper.",
  },
  {
    id: "elixir-verde",
    nome: "Elixir Verde",
    ehPocao: true,
    cor: "verde",
    categoria: "pocao",
    arquivo: "elixir-verde.png",
    descricaoImagem:
      "Tall slender glass vial of emerald green potion, cork stopper, soft green inner glow.",
  },
  {
    id: "frasco-azul",
    nome: "Frasco Azul",
    ehPocao: true,
    cor: "azul",
    categoria: "pocao",
    arquivo: "frasco-azul.png",
    descricaoImagem:
      "Classic apothecary flask with sapphire blue liquid, glass neck, cork, subtle blue sparkle.",
  },
  {
    id: "tonico-roxo",
    nome: "Tônico Roxo",
    ehPocao: true,
    cor: "roxo",
    categoria: "pocao",
    arquivo: "tonico-roxo.png",
    descricaoImagem:
      "Bulbous purple potion bottle, amethyst liquid, cork, soft violet glow.",
  },
  {
    id: "elixir-rosa",
    nome: "Elixir Rosa",
    ehPocao: true,
    cor: "rosa",
    categoria: "pocao",
    arquivo: "elixir-rosa.png",
    descricaoImagem:
      "Cute rounded bottle of pink healing potion, glass, cork, gentle rose glow.",
  },
  {
    id: "pocao-laranja",
    nome: "Poção Laranja",
    ehPocao: true,
    cor: "laranja",
    categoria: "pocao",
    arquivo: "pocao-laranja.png",
    descricaoImagem:
      "Faceted glass bottle of orange fire-resistance potion, cork, warm orange glow.",
  },
  {
    id: "elixir-dourado",
    nome: "Elixir Dourado",
    ehPocao: true,
    cor: "dourado",
    categoria: "pocao",
    arquivo: "elixir-dourado.png",
    descricaoImagem:
      "Luxury potion flask filled with shimmering golden liquid, ornate glass, cork, metallic gold highlights.",
  },
  {
    id: "frasco-cristal",
    nome: "Frasco de Cristal",
    ehPocao: true,
    cor: "transparente",
    categoria: "pocao",
    arquivo: "frasco-cristal.png",
    descricaoImagem:
      "Crystal-clear glass potion bottle with transparent faintly blue-tinted liquid, cork, clean reflections.",
  },
  {
    id: "pocao-prata",
    nome: "Poção Prateada",
    ehPocao: true,
    cor: "prata",
    categoria: "pocao",
    arquivo: "pocao-prata.png",
    descricaoImagem:
      "Glass bottle with metallic silver mercury-like potion liquid, cork, cool reflective sheen.",
  },
  {
    id: "elixir-marrom",
    nome: "Elixir Terroso",
    ehPocao: true,
    cor: "marrom",
    categoria: "pocao",
    arquivo: "elixir-marrom.png",
    descricaoImagem:
      "Rustic glass bottle of brown earthy potion, cork, muted amber-brown liquid.",
  },

  // --- Não-poções: falsos positivos da regra vermelha ---
  {
    id: "maca-vermelha",
    nome: "Maçã Vermelha",
    ehPocao: false,
    cor: "vermelho",
    categoria: "comida",
    arquivo: "maca-vermelha.png",
    descricaoImagem:
      "Shiny red apple with small green leaf, realistic fruit, inventory icon, no plate.",
  },
  {
    id: "gema-vermelha",
    nome: "Gema Rubi",
    ehPocao: false,
    cor: "vermelho",
    categoria: "tesouro",
    arquivo: "gema-vermelha.png",
    descricaoImagem:
      "Cut ruby gemstone, faceted red crystal, sparkling highlights, inventory jewel icon.",
  },
  {
    id: "cogumelo-vermelho",
    nome: "Cogumelo Vermelho",
    ehPocao: false,
    cor: "vermelho",
    categoria: "comida",
    arquivo: "cogumelo-vermelho.png",
    descricaoImagem:
      "Fantasy red mushroom with white spots, short stem, inventory forage icon.",
  },
  {
    id: "capa-vermelha",
    nome: "Capa Escarlate",
    ehPocao: false,
    cor: "vermelho",
    categoria: "utilitario",
    arquivo: "capa-vermelha.png",
    descricaoImagem:
      "Folded scarlet red travel cloak with gold clasp, fabric folds, inventory gear icon.",
  },

  // --- Não-poções: outras cores ---
  {
    id: "laranja-fruta",
    nome: "Laranja",
    ehPocao: false,
    cor: "laranja",
    categoria: "comida",
    arquivo: "laranja-fruta.png",
    descricaoImagem:
      "Whole ripe orange citrus fruit with textured peel, inventory food icon.",
  },
  {
    id: "uvas-roxas",
    nome: "Uvas Roxas",
    ehPocao: false,
    cor: "roxo",
    categoria: "comida",
    arquivo: "uvas-roxas.png",
    descricaoImagem:
      "Small cluster of purple grapes with green stem, inventory food icon.",
  },
  {
    id: "espada-ferro",
    nome: "Espada de Ferro",
    ehPocao: false,
    cor: "prata",
    categoria: "arma",
    arquivo: "espada-ferro.png",
    descricaoImagem:
      "Medieval iron longsword with simple crossguard and leather grip, inventory weapon icon.",
  },
  {
    id: "escudo-madeira",
    nome: "Escudo de Madeira",
    ehPocao: false,
    cor: "marrom",
    categoria: "arma",
    arquivo: "escudo-madeira.png",
    descricaoImagem:
      "Round wooden shield with iron rim and simple emblem, inventory gear icon.",
  },
  {
    id: "gema-azul",
    nome: "Gema Safira",
    ehPocao: false,
    cor: "azul",
    categoria: "tesouro",
    arquivo: "gema-azul.png",
    descricaoImagem:
      "Cut blue sapphire gemstone, faceted crystal, inventory jewel icon.",
  },
  {
    id: "chave-dourada",
    nome: "Chave Dourada",
    ehPocao: false,
    cor: "dourado",
    categoria: "utilitario",
    arquivo: "chave-dourada.png",
    descricaoImagem:
      "Ornate golden skeleton key with fantasy filigree, inventory key icon.",
  },
  {
    id: "anel-prata",
    nome: "Anel de Prata",
    ehPocao: false,
    cor: "prata",
    categoria: "tesouro",
    arquivo: "anel-prata.png",
    descricaoImagem:
      "Simple silver band ring with a tiny inset gem, inventory jewelry icon.",
  },
  {
    id: "pergaminho",
    nome: "Pergaminho",
    ehPocao: false,
    cor: "marrom",
    categoria: "utilitario",
    arquivo: "pergaminho.png",
    descricaoImagem:
      "Rolled aged parchment scroll tied with a string, inventory document icon.",
  },
  {
    id: "frasco-ciano",
    nome: "Frasco Ciano",
    ehPocao: true,
    cor: "azul",
    categoria: "pocao",
    arquivo: "frasco-ciano.png",
    descricaoImagem:
      "Wide flat glass apothecary bottle with bright cyan-blue liquid, cork stopper.",
  },
  {
    id: "folha-verde",
    nome: "Folha de Erva",
    ehPocao: false,
    cor: "verde",
    categoria: "comida",
    arquivo: "folha-verde.png",
    descricaoImagem:
      "Fresh green herb leaf sprig, inventory alchemy ingredient icon, not a bottle.",
  },
  {
    id: "elmo-ferro",
    nome: "Elmo de Ferro",
    ehPocao: false,
    cor: "prata",
    categoria: "arma",
    arquivo: "elmo-ferro.png",
    descricaoImagem:
      "Simple iron medieval helmet, metal material, inventory gear icon.",
  },
  {
    id: "livro-magico",
    nome: "Livro Mágico",
    ehPocao: false,
    cor: "marrom",
    categoria: "utilitario",
    arquivo: "livro-magico.png",
    descricaoImagem:
      "Closed leather-bound spell book with metal clasp, inventory item icon.",
  },
];

/**
 * Subconjunto do treino ML: cabe na grade sem scroll (3×6 = 18).
 * Mistura poções de várias cores + não-poções (incluindo vermelhos “enganosos”).
 */
const IDS_ITENS_TREINO_ML = [
  // Poções (9)
  "pocao-vermelha",
  "elixir-vermelho",
  "elixir-verde",
  "frasco-azul",
  "tonico-roxo",
  "elixir-rosa",
  "pocao-laranja",
  "elixir-dourado",
  "frasco-cristal",
  // Não-poções (9) — inclui vermelhos enganosos
  "maca-vermelha",
  "cogumelo-vermelho",
  "capa-vermelha",
  "gema-vermelha",
  "espada-ferro",
  "gema-azul",
  "livro-magico",
  "chave-dourada",
  "elmo-ferro",
] as const;

export const ITENS_TREINO_ML: ItemSimuladorML[] = IDS_ITENS_TREINO_ML.map(
  (idItem) => {
    const item = ITENS_SIMULADOR_ML.find((candidato) => candidato.id === idItem);
    if (!item) {
      throw new Error(`Item do treino ML não encontrado: ${idItem}`);
    }
    return item;
  }
);

/**
 * Grade 3×3 da demo da regra (sempre 9 itens).
 * Mistura: acerto (OK), falso positivo (FP), falso negativo (FN), rejeição correta.
 */
const IDS_ITENS_DEMO_REGRA = [
  "pocao-vermelha", // ACERTOU — poção vermelha (frasco redondo)
  "tonico-roxo", // ERRADO — poção, cor ≠ vermelho
  "elixir-verde", // ERRADO — poção, cor ≠ vermelho
  "frasco-azul", // ERRADO
  "elixir-vermelho", // ACERTOU — poção vermelha (frasco alto; 2º verdadeiro)
  "maca-vermelha", // ENGANO — vermelho, não é poção
  "cogumelo-vermelho", // ENGANO
  "capa-vermelha", // ENGANO
  "espada-ferro", // ACERTOU — não vermelha, não poção
] as const;

export const ITENS_DEMO_REGRA: ItemSimuladorML[] = IDS_ITENS_DEMO_REGRA.map(
  (idItem) => {
    const item = ITENS_SIMULADOR_ML.find((candidato) => candidato.id === idItem);
    if (!item) {
      throw new Error(`Item da demo da regra não encontrado: ${idItem}`);
    }
    return item;
  }
);

export function obterItemPorId(id: string): ItemSimuladorML | undefined {
  return ITENS_SIMULADOR_ML.find((item) => item.id === id);
}
