# Os 5 Pilares do RL: Interatividade Didática

> **Status:** Concluído ✅  
> **Data:** 2026-08-17  
> **Componente:** `PilaresRL.tsx` e `src/componentes/visuais/fase1/pilares/`  

---

## Contexto

O painel anterior ilustrava os cinco pilares, mas não fazia o aluno prever, classificar ou comparar consequências. Ele também chamava de aprendizado uma sequência fixa e misturava bateria física com recompensa.

Esta entrega executa o plano [`interatividade_pilares_rl.md`](../feat/interatividade_pilares_rl.md), preservando a lição 06 como a anatomia de um único passo de RL. A atualização de política continua na lição 07.

## Implementação

### Motor e estado

- Extraído `motorAmbiente.ts`, com `aplicarAcao` puro para transição, recompensa, bateria, narrativa e término de episódio.
- Separados bateria física, retorno acumulado e recompensa por ação.
- Introduzido `useReducer` em `usePilaresRL.ts`; o estado coeso substitui os estados independentes do painel anterior.
- Persistidos diário, episódios concluídos, profundidade e progresso do desafio em `localStorage` na chave `aprendendo_ia_pilares_v1`.
- O roteiro automático foi renomeado para **Episódio comentado** e declarado como roteiro fixo, sem alegação de aprendizado.

### Experiência didática

- **Lentes de atribuição:** Agente, Ambiente, Estado, Ação e Recompensa destacam responsabilidades reais no palco.
- **Fronteira Agente/Ambiente:** a lente do Agente delimita somente o visor do Bibi; chassi e bateria são rotulados como Ambiente.
- **Anatomia do passo:** cada ação expõe `Estado → Ação → Ambiente → Recompensa → Novo Estado`.
- **Prévia contrafactual:** foco ou hover em uma ação mostra a consequência antes do clique.
- **Diário navegável:** cada passo é revisável no palco e os dois últimos episódios têm retorno comparável.
- **Verificação ativa:** após concluir um episódio, cinco fichas exigem classificar elementos entre os pilares; um erro ativa a lente correta.
- **Divulgação progressiva:** Narrativa, Números e Notação oferecem rigor crescente sem impor notação formal à primeira leitura.

### Acessibilidade e movimento

- Controles nativos, foco visível, `aria-pressed`, tabs com `role="tab"` e mensagens de estado com `aria-live`.
- Ações, lentes, diário e desafio podem ser operados por teclado.
- `prefers-reduced-motion` remove transições e animações sem ocultar nenhuma informação.
- As únicas animações adicionadas comunicam causalidade: o sinal de recompensa sai do Ambiente e os marcos do passo aparecem em sequência.

### Conteúdo

- Atualizado `06-rl-components.md` para separar bateria de recompensa.
- As instruções agora descrevem lentes, prévia, anatomia, diário, desafio e episódio comentado.
- Removida a promessa incorreta de que o roteiro fixo mostra uma IA aprendendo.

## Validação

```bash
npx tsc --noEmit
# Resultado: sucesso, 0 erros

npm run build
# Resultado: sucesso; aviso preexistente do Vite sobre chunk acima de 500 kB

git --no-pager diff --check
# Resultado: sucesso, sem erros de whitespace
```

Não houve inspeção manual por navegador nesta sessão porque o ambiente recusou a inicialização do servidor local e a execução direta de um script Node. A validação estática e o build de produção foram concluídos; a inspeção visual em desktop e mobile permanece recomendada no ambiente de desenvolvimento normal.
