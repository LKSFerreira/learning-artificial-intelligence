# 🏗️ Reestruturação de Arquitetura e Conteúdo — Plataforma "Aprendendo IA"

> **Data de Conclusão:** 2026-07-06
> **Autores:** Lucas Ferreira (LKS) + Antigravity (Mentor Técnico)
> **Objetivo:** Registro detalhado da reestruturação e modularização da plataforma para atingir excelência em conteúdo (narrativa histórica), UI/UX e arquitetura.

---

## 🧭 Filosofia Aplicada

A reestruturação foi guiada pela filosofia educacional: *"Aprendo mais quando me sinto conectado, envolvido com o problema e a solução"*. O currículo original foi enriquecido com alma e contexto histórico, enquanto a infraestrutura técnica e de layout de 3 colunas (sidebar + conteúdo + visual) foi mantida intacta, promovendo a modularização e o desacoplamento de dados e código.

---

## 📸 Resumo do Estado Final

### Nova Arquitetura de Pastas e Componentes

O layout de 3 colunas (sidebar + conteúdo + painel visual) é montado em `App.tsx`, sem pasta `paginas/`. O código do projeto ficou organizado assim:

```
src/
├── App.tsx                           ← Orquestra layout, modal de reset e easter egg
├── index.tsx                         ← Providers globais + BrowserRouter
├── index.css                         ← Estilos globais e temas
│
├── componentes/
│   ├── layout/
│   │   ├── AreaConteudoPrincipal.tsx ← Coluna central (lição, quiz, tutor)
│   │   ├── BarraLateralFases.tsx     ← Sidebar (tema, navegação, reset)
│   │   ├── NavegacaoFases.tsx        ← Módulos e tópicos colapsáveis
│   │   ├── SeletorTema.tsx           ← Temas claro / escuro / dracula
│   │   └── PainelVisual.tsx          ← Coluna direita (visuais interativos)
│   ├── conteudo/                     ← Markdown, vídeo, quiz card, tutor IA
│   ├── quiz/
│   │   └── TelaQuiz.tsx              ← Fluxo de questões, resultado e gabarito
│   ├── conquistas/                   ← SistemaBadges / BadgeItem (código pronto; UI da sidebar removida)
│   ├── navegacao/                    ← Botões anterior / próximo
│   ├── modais/                       ← Modal de reset de progresso
│   └── visuais/
│       ├── registroVisuais.tsx       ← Mapa REGISTRO_VISUAIS (sem switch/case)
│       ├── fase1/ … fase3/           ← Subcomponentes por fase
│
├── conteudo/                         ← Lições em Markdown + frontmatter
│   ├── fase-1-fundamentos/
│   ├── fase-2-q-learning/
│   ├── fase-3-labirinto/
│   └── index.ts                      ← Loader via import.meta.glob
│
├── contextos/                        ← Progresso, Badges, Quiz
├── hooks/                            ← useNavegacao, useQuiz, useTutorIA, useSincronizacaoRota
├── dados/                            ← Fallback de currículo, badges e quizzes
├── servicos/                         ← LocalStorage e Gemini
└── tipos/                            ← Tipos TypeScript do domínio
```

---

## 🛠️ Entregas Realizadas por Fase

### Fase R0: Limpeza e Verdade Documental
*   Corrigida a documentação para refletir o estado real do repositório (excluídas referências obsoletas a setups inexistentes como Docker).
*   Eliminado código morto, classes de migração de dados legados (`migrarEstadoLegado`, `ehEstadoLegado`) e aliases não utilizados em `servicoGemini.ts`.

### Fase R1: Decomposição de Componentes
*   **Decomposição de AreaConteudoPrincipal.tsx:** O monolito antigo de 436 linhas foi desmembrado. O fluxo do Quiz foi isolado no componente `TelaQuiz.tsx`, e o container lateral no `PainelVisual.tsx`.
*   **Decomposição de BarraLateralFases.tsx:** O controle de tema foi isolado em `SeletorTema.tsx` e a navegação em `NavegacaoFases.tsx`, resultando em componentes limpos e de responsabilidade única.

### Fase R2: Separação de Conteúdo e Loader
*   O conteúdo textual foi extraído de constantes TypeScript estáticas e migrado para arquivos `.md` estruturados com frontmatter dentro do diretório `src/conteudo/`.
*   Foi criado um loader dinâmico em `src/conteudo/index.ts` usando `import.meta.glob` do Vite, que parseia o frontmatter e carrega as lições dinamicamente.
*   **Aprimoramento de Robustez:** O loader foi ajustado para ordenar os passos baseando-se estritamente na propriedade `ordem` do frontmatter do Markdown, garantindo imunidade a inconsistências de nomes de arquivos.

### Fase R3: Registro Dinâmico de Visuais
*   O switch/case hardcoded que selecionava os visuais baseado na fase ativa foi totalmente removido.
*   Criado o registro `REGISTRO_VISUAIS` no arquivo `src/componentes/visuais/registroVisuais.tsx`. Agora a aplicação resolve e renderiza as telas do painel da direita mapeando chaves compostas `"faseId:estadoVisual"`.

### Fase R4: Roteamento Nativo
*   Instalado e configurado o `react-router-dom`.
*   Implementada a sincronização de rotas com a navegação e o progresso do usuário via URLs (`/fase/:faseId/passo/:passoIndice`). O botão voltar do navegador passou a funcionar de forma integrada com a aplicação.

### Fase R5: Reescrita de Conteúdo (Filosofia Narrativa)
*   Todo o currículo das Fases 1, 2 e 3 foi reescrito para adotar profundidade histórica, contexto de problemas reais e analogias ricas sobre os conceitos.
*   A lição 8 da Fase 1 foi renomeada para `"Arriscar ou Repetir? O Dilema do Aventureiro 🧭"` para manter coesão de terminologia com os componentes interativos.

### Fase R6: Polimento, Navegação e Proteção Visual
*   **Vídeo Aula Integrada:** Adicionado o item "Vídeo Aula: Linha do Tempo" à timeline do Painel Direito na Fase 1. Agora a timeline cobre todos os passos subsequentes da fase de forma idêntica à barra lateral esquerda.
*   **Suporte a Vídeos Complementares:** A `AreaConteudoPrincipal.tsx` foi adaptada para renderizar vídeos complementares abaixo do texto de qualquer lição de conteúdo comum se a propriedade `urlVideo` estiver preenchida. Suporta renders de embed do YouTube ou thumbnails interativos com plays clicáveis.
*   **Timelines Interativas e Clicáveis:** As timelines de apresentação da Fase 1 (`IntroducaoConceito`), Fase 2 (`IntroducaoFase2`) e Fase 3 (`IntroducaoFase3`) foram tornadas clicáveis, permitindo ao aluno pular diretamente para os passos correspondentes da fase.
*   **Visualização de Passos Bloqueados:** Implementada lógica de progresso nas timelines do painel da direita. Passos não alcançados pelo progresso do usuário mostram um cadeado (`Lock`), ficam opacos (`opacity-60`), alteram o cursor para `cursor-not-allowed` e têm cliques e hovers desativados para assegurar a coesão de progresso da plataforma.

---

## 🔬 Validação e Testes

*   **Build de Produção:** Testado via script `npm run build`. O bundler Vite compilou a aplicação perfeitamente gerando os assets finais em `/dist` sem qualquer warning ou erro de digitação/TypeScript.
*   **Integridade do Estado:** Validada a consistência de navegação das URLs e a integridade de funcionamento dos quizzes ao cruzar fases.
