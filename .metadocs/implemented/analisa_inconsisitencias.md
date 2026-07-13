Auditoria completa do repositório

Varri o projeto (exceto node_modules, dist, .git, etc.): ~150 arquivos de app/docs/agentes. Cruzei currículo Markdown × registro de visuais × quizzes × progresso × badges × docs.

Boa notícia: as chaves estadoVisual dos .md batem com REGISTRO_VISUAIS; quizzes carregam por faseId; stack do README/escopo está alinhada no papel.

Má notícia: há bugs reais de progressão e várias inconsistências código↔docs que o /sync documental não capturou.

───

Crítico / alto (quebram jornada ou mentem sobre o app)

1. Fase 3 nunca é marcada como completa

avancarFase só adiciona a fase atual a fasesCompletas ao ir para a próxima. Na última fase retorna sem alterar nada:

  const avancarFase = useCallback(() => {
    setEstado(prev => {
      const faseAtual = CURRICULO[prev.indiceFaseAtual];
      const proximaFaseIndice = prev.indiceFaseAtual + 1;

      if (proximaFaseIndice >= CURRICULO.length) return prev;

Efeitos:
• check verde da B3 não aparece
• badges terceira_fase e mestre não desbloqueiam no fluxo normal
• botão “Avançar para Próxima Fase” na B3 é mentiroso (não há próxima)

───

2. Bypass de fase via URL / irParaPasso

A sidebar bloqueia fases futuras. Já irParaPasso só checa o máximo de passo dentro da fase. Com maximoPassoAlcancado[1] ausente (?? 0), o passo 0 da Fase 2 é liberado.

useSincronizacaoRota aceita /fase/2/passo/0 sem exigir Fase 1 completa → pula o gate de progressão.

───

3. “Voltar do navegador” documentado, mas não funciona

R4 / HISTORY / registro R dizem que o botão voltar do browser está integrado. No código:

1. URL só é lida uma vez no mount
2. toda mudança de passo usa navigate(..., { replace: true }) → histórico não cresce

Resultado: URL cosmético, não navegação real. Docs de R4 estão incorretas.

───

Médio (features pela metade / gamificação frágil)

┌────┬─────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ #  │ Problema                        │ Evidência                                                                                                              │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4  │ estaNoModoQuiz morto            │ Nunca vira true; quiz usa useState local em AreaConteudoPrincipal                                                      │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5  │ Badge Prodígio quase impossível │ jaTentou no useQuiz sobrevive entre fases e resetar() não o zera; após quiz da F1, F2/F3 já contam como “re-tentativa” │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 6  │ Badge Explorador morto          │ registrarCliqueCirculo existe, mas HierarquiaVenn não chama — só estado local                                          │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 7  │ Duplo sistema de quiz           │ ProvedorQuiz montado em index.tsx, mas zero useContextoQuiz; fluxo real = useQuiz                                      │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 8  │ quizId do frontmatter ignorado  │ Parseado, nunca lido; quiz sempre por faseId                                                                           │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 9  │ Destaque de passo ativo errado  │ NavegacaoFases compara só indicePasso, sem indiceFaseLoop === indiceFase                                               │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 10 │ Chave Gemini no bundle cliente  │ vite.config define embute a key no JS; risco de vazamento se key tiver cota real                                       │
├────┼─────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 11 │ Tailwind CDN em produção        │ HTML comenta “desenvolvimento”, mas o build serve o mesmo CDN                                                          │
└────┴─────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

───

Baixo (código morto, drift, docs otimistas)

┌────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ #  │ Problema                                                                                                                              │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 12 │ VisualizadorFase1/2/3 órfãos — R3 usa registroVisuais; orquestradores antigos ainda no repo                                           │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 13 │ ConteudoMarkdown, ConteudoVideo, CartaoQuiz, ModalResetProgresso exportados e não montados (UI inline em App / AreaConteudoPrincipal) │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 14 │ ROADMAP: “domínio de badges ✅” é otimista — UI off (ok A2.0), mas vários badges logicamente quebrados                                │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 15 │ Fallback fase1.ts–fase3.ts desatualizado (já documentado); se loader MD falhar, volta conteúdo velho sem aviso                        │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 16 │ Corpo Markdown dos passos quiz ignorado (copy genérica “Desafio Final”)                                                               │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 17 │ App.tsx importa CURRICULO sem usar; tsconfig sem strict / unused checks                                                               │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 18 │ JSDoc em tipos/curriculo.ts cita visualState; campo real é estadoVisual                                                               │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 19 │ limparProgresso / existeProgressoSalvo sem uso                                                                                        │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 20 │ R0 afirma “código morto eliminado” — ainda há vários módulos órfãos                                                                   │
├────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 21 │ .agents/rules/javascript.md assume Dev Container Docker, ESLint/Prettier e strict: true — genérico da regra, não do repo              │
└────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

───

O que está coerente (não é problema)

┌──────────────────────────────────────────────┬───────────────────────────────────────────┐
│ Verificação                                  │ Status                                    │
├──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ estadoVisual nos .md × REGISTRO_VISUAIS      │ OK — todas as chaves das 3 fases mapeadas │
├──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ Quizzes F1–F3 × faseId                       │ OK                                        │
├──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ B0 absorvida / stack real no README e escopo │ OK (pós-correção anterior)                │
├──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ Serialização Set de circulosClicados         │ OK (só nunca é preenchido)                │
├──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ Tutor base Gemini + .env.example             │ OK (chave opcional)                       │
├──────────────────────────────────────────────┼───────────────────────────────────────────┤
│ package.json só dev/build/preview            │ OK e alinhado ao T0 pendente              │
└──────────────────────────────────────────────┴───────────────────────────────────────────┘

───

Mapa docs × código (resumo)

┌───────────────────────────────┬─────────────────────────────────────┐
│ Docs dizem                    │ Código faz                          │
├───────────────────────────────┼─────────────────────────────────────┤
│ R4: back do browser integrado │ Só URL + replace                    │
├───────────────────────────────┼─────────────────────────────────────┤
│ A1: ContextoQuiz integrado    │ Provider morto; hook paralelo       │
├───────────────────────────────┼─────────────────────────────────────┤
│ Badges domínio “pronto”       │ UI off + 3+ badges quebrados        │
├───────────────────────────────┼─────────────────────────────────────┤
│ R0/R6: limpeza de mortos      │ Orquestradores e componentes órfãos │
├───────────────────────────────┼─────────────────────────────────────┤
│ B1–B3 jogáveis até o fim      │ B3 não completa no progresso        │
└───────────────────────────────┴─────────────────────────────────────┘

───

Prioridade se for corrigir (sugestão)

1. Conclusão da última fase + UX sem “próxima fase” inexistente
2. Gate de fase em irParaPasso + deep link
3. Rota real (histórico) ou corrigir a documentação do R4
4. Unificar modo quiz; jaTentou por fase; ligar HierarquiaVenn aos badges
5. Remover ou reativar dead code (ContextoQuiz, VisualizadorFase*, etc.)

───

Em uma frase: o currículo e os visuais estão bem amarrados; o motor de progressão e de badges tem buracos sérios, e parte da documentação de engenharia (R4, limpeza, badges “prontos”) ainda está mais otimista que o código.