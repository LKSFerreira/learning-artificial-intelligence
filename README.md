# AI & Playground — Monorepo (Aprendizado prático e experiments)

Uma única base que agrupa dois espaços de trabalho distintos: um laboratório prático de IA voltado para agentes jogadores e um playground pessoal com diversos experimentos e pequenos projetos. Este README orienta como navegar, configurar e começar a contribuir.

---

# 1. Visão geral rápida

* **Objetivo principal:** Aprender construindo — do básico de IA até agentes capazes de interagir com jogos (ex.: Ragnarok Online), com ênfase em experimentos práticos e iterações rápidas.
* **Outros conteúdos:** Vários pequenos projetos, protótipos web e exercícios que servem como caderno de laboratório para testar tecnologias (frontend, backend, scripts, etc).
* **Formato do repositório:** Monorepo com duas pastas principais:

  * `ai-game-learning/` — projetos e etapas relacionadas ao aprendizado de agentes (Python, visão computacional, RL).
  * `personal-portfolio/` — coleções de experimentos, apps em React/Next, jogos de navegador e afins.

---

# 2. Estrutura do repositório

```
learning-artificial-intelligence/
├── README.md                      # (este arquivo)
├── ai-game-learning/              # Laboratório de IA (Python, RL, visão)
│   ├── README.md                  # README local com instruções detalhadas
│   └── ...                        # código, notebooks, ambientes de treino
└── personal-portfolio/            # Playground com projetos front/backend
    ├── README.md                  # README por projeto
    └── ...                        # apps, protótipos, assets
```

> Cada subdiretório contém seu próprio `README.md` com instruções específicas (instalação, execução e notas técnicas). Comece por eles ao trabalhar em um projeto específico.

---

# 3. Começando (setup geral)

## Requisitos (mínimos)

* Git
* Python 3.10+ (recomendado para os módulos de IA)
* Node.js 18+ (para projetos frontend/backend que usem JS/TS)
* `pip` / `npm` / `yarn`

## Passos básicos

1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/learning-artificial-intelligence.git
cd learning-artificial-intelligence
```

2. Para trabalhar com os exemplos de IA (Python):

```bash
cd ai-game-learning
# criar e ativar venv (Unix/macOS)
python -m venv .venv
source .venv/bin/activate
# Windows (PowerShell)
# python -m venv .venv
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

3. Para rodar projetos em `personal-portfolio` (quando aplicável):

```bash
cd ../personal-portfolio/<nome-do-projeto>
# exemplo com Node
npm install
npm run dev
```

> Observação: cada subprojeto pode ter dependências e comandos diferentes — consulte o `README.md` local.

---

# 4. Como os projetos estão organizados (resumo funcional)

### `ai-game-learning/`

* Conteúdo incremental: desde experimentos simples (ex.: Q-learning em Jogo da Velha) até projetos com visão computacional e integração com automação (AutoHotkey/PyAutoGUI).
* Ideal para: experimentar algoritmos de RL, treinar agentes em ambientes simplificados, estudar captura/interpretação de tela e automação de entrada.

### `personal-portfolio/`

* Repositório de estudos e protótipos (React, Next.js, pequenos jogos em canvas, utilitários).
* Ideal para: experimentar front-end moderno, publicar demos e manter um catálogo dos aprendizados.

---

# 5. Fluxo de trabalho sugerido

* Trabalhe em branches por feature:

```bash
git checkout -b feat/nome-da-fase
```

* Faça commits pequenos e descritivos.
* Atualize o `README.md` do subprojeto quando alterar instruções ou dependências.
* Abra PRs para revisão antes de mesclar em `main`.

---

# 6. Boas práticas e convenções

* Código Python: use virtualenv e `requirements.txt`. Prefira tipagem e docstrings.
* JavaScript/TypeScript: siga as configurações locais de ESLint/Prettier quando houver.
* Documente experimentos: objetivo, hyperparâmetros, resultados e observações no README local ou notebooks.
* Versionamento e grandes arquivos: evite commitar dados de treino pesados; use storage externo se necessário.

---

# 7. Roadmap & prioridades (curto prazo)

* Consolidar exemplos didáticos na etapa inicial de IA (Q-Learning e ambiente de grade).
* Implementar pipeline mínimo de treino/replay para DQN em ambiente controlado.
* Prototipar pipeline de captura de tela + detecção básica (OpenCV) para jogos simples.
* Reescrever exemplos-chaves em JavaScript como exercício de aprendizagem.

---

# 8. Como contribuir

1. Escolha uma issue ou abra uma descrevendo a proposta.
2. Abra uma branch com nome claro (`fix/`, `feat/`, `doc/`).
3. Inclua testes quando fizer alterações de lógica.
4. Atualize documentação e exemplos.
5. Faça o pull request com descrição das mudanças e como testar localmente.

---

# 9. Notas sobre execução de experimentos com jogos

* Integração com jogos reais (ex.: Ragnarok) envolve automação de entradas e leitura de tela — cuidado com políticas do jogo. Use esses experimentos apenas em ambientes de teste e aprenda sobre ética e regras da plataforma antes de automatizar interações em servidores públicos.
* Para automação local, prefira trabalhar em servidores privados ou instâncias de teste.

---

# 10. Licença & autor

* Licença: MIT — salvo indicação contrária nos READMEs dos subprojetos.
* Autor: Lucas Ferreira (LKS)

---

# 11. Contato e onde seguir

* GitHub: [https://github.com/LKSFerreira](https://github.com/LKSFerreira)