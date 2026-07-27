# PRD — Mini-jogo: Treino por Reforço (Cão)

**Status:** escopo fechado (não inventar features)  
**Idioma do PRD / prompt de build:** English (section “BUILD PROMPT”)  
**Idioma da UI e textos do jogo:** **pt-BR only**  
**Entrega:** pasta auto-contida (`index.html` + assets) para rodar em **iframe** na plataforma

---

## 1. Purpose (didactic)

The student is the **environment / tutor**.  
The dog is the **RL agent**.

Learning goal: show **positive reinforcement** (give treat) vs **withhold treat** (no angry punishment).  
Preferences (policy) update after each feedback.  
Score is a **training metric**, not emotional abuse of the animal.

---

## 2. Hard constraints (MUST / MUST NOT)

### MUST

- UI language: **Brazilian Portuguese (pt-BR)** for every button, label, narration, speech bubble.
- Exactly **4 commands / actions**: **Sentar**, **Pular**, **Latir**, **Deitar**.
- Correct Portuguese verb: **Latir** (never “Ladrar”, never “Latrar”).
- Tutor states only: **idle (repouso)**, **giving treat (dando petisco)**, **no treat (sem petisco, gentil)**.
- Dog has poses/animations for: idle + each of the 4 actions + mild sad (no treat) + happy (treat) if needed.
- Self-contained package runnable via static files in an iframe (`index.html` entry).
- Works offline after load (no required external API keys at runtime).
- Beautiful, simple, intuitive; park/training yard setting.
- Closed loop: choose command → dog acts → give treat OR withhold → update bars → next command.

### MUST NOT

- **No “Rolar”** action/command (removed from scope).
- **No “Punir”** button, no rage, no hitting, no red anger at the dog.
- No extra commands, no inventory, no shop, no multiplayer, no login, no ads.
- No open world, no levels beyond this single training loop, no story campaign.
- No English UI strings in the finished game (except optional debug flag off by default).
- No inventing new mechanics (ε-greedy UI, Q-table editor, etc.) unless listed below (they are NOT listed → forbidden).
- Do not rename “Latir” to anything else.

---

## 3. Actions (closed list)

| id (internal) | UI label (pt-BR) | Speech bubble (pt-BR) |
| :--- | :--- | :--- |
| `sentar` | Sentar | Senta! |
| `pular` | Pular | Pula! |
| `latir` | Latir | Late! |
| `deitar` | Deitar | Deita! |

Initial policy: **uniform** (25% each) = chance only, not “born knowing”.  
Show labels like “1/4” or equal bars until first feedback; then show learned % if desired.

---

## 4. Game loop (closed)

1. **Idle** — tutor wait; dog idle; 4 command buttons visible.
2. Student presses one command (pt-BR label).
3. **Deciding** — short delay; dog samples action from current weights.
4. **Evaluate** — show what the dog did; two buttons only:
   - **Dar petisco**
   - **Sem petisco**
5. **Feedback**
   - Treat: reinforce the action the dog **performed** (raise weight); tutor treat pose; dog happy if match optional.
   - No treat: slightly lower weight of performed action; tutor gentle disappointment; dog mild sad if mismatch.
6. Update preference bars + training points; return to step 1.

### Scoring (training metric only)

| Situation | Points |
| :--- | ---: |
| Treat + dog matched command | +1 |
| Treat + dog mismatched | −1 |
| No treat + mismatch | 0 |
| No treat + match | −1 |

Show: Rodadas, Acertos, Pontos de treino.

---

## 5. Visual scope

- Background: training park (can reuse style of `bg_park.png` concept: grass, dirt, fence, trees; empty of other characters).
- Tutor left, dog right (or clear stage layout).
- Tutor: treat pouch on waist always readable when idle.
- No violence. Gentle no-treat emotion only.

---

## 6. Platform integration

- Deliver: `index.html` + `css/` + `js/` + `assets/` (or single bundled folder).
- Host path (this repo): `public/jogos/treino-cao/`
- Parent app embeds: `<iframe src="/jogos/treino-cao/index.html" …>`
- Optional later: `postMessage` — **out of scope v1** (do not implement unless asked).

---

## 7. Tech (recommended, closed)

- Static **HTML + CSS + JS** (or minimal canvas library if needed).
- No backend.
- Mobile-friendly touch targets for 4 commands + 2 feedback buttons.
- Prefer 16:9 or flexible stage with letterboxing.

---

# BUILD PROMPT (English — copy/paste to the game builder)

Use the block below alone. Do not add features outside it.

```text
Build a small, self-contained browser mini-game as static files (index.html + CSS + JS + assets folder) that can run inside an iframe with no backend.

PURPOSE
Educational reinforcement-learning metaphor: the player is the tutor/environment; the dog is the agent. Positive reinforcement via treats; withholding a treat is allowed; never angry punishment.

LANGUAGE
- All player-facing UI, buttons, labels, narration, speech bubbles MUST be Brazilian Portuguese (pt-BR).
- Code identifiers may be English.
- Do NOT use English on buttons or HUD.

CLOSED ACTION SET (exactly four — do not add more)
1) Sentar — speech "Senta!"
2) Pular — speech "Pula!"
3) Latir — speech "Late!"   (correct Portuguese: Latir — NEVER "Ladrar" or "Latrar")
4) Deitar — speech "Deita!"
FORBIDDEN: "Rolar" or any fifth action/command.

CORE LOOP (implement exactly)
1. Idle: show 4 command buttons (Sentar, Pular, Latir, Deitar). Tutor idle. Dog idle.
2. On command click: show speech bubble with the pt-BR command shout; short "thinking" delay; dog samples one of the four actions using current weights (initially uniform 25% each = pure chance, not pre-trained preference).
3. Reveal dog action (pt-BR label). Show exactly two buttons: "Dar petisco" and "Sem petisco". No "Punir" button.
4. Dar petisco: increase weight of the action the dog performed; tutor give-treat animation; optional happy dog; if action matched command, +1 training points and success count; if mismatched, -1 training points.
5. Sem petisco: slightly decrease weight of the action performed; tutor gentle disappointment (NOT angry); dog mild sad; if mismatched 0 points; if matched -1 points.
6. Update preference bars and counters (Rodadas, Acertos, Pontos de treino); return to idle.

INITIAL WEIGHTS
Equal weights for all four actions. UI must not imply the dog "was born knowing" preferences; equal bars mean random chance until feedback changes weights.

VISUAL
Cute, simple, polished 2D educational game look. Outdoor dog-training park background. Tutor with treat pouch on belt. Dog readable poses for idle, sit, jump, bark (latir), lay down, mild sad, happy. No violence, no rage icons.

SCOPE LOCK — DO NOT IMPLEMENT
Shop, inventory, multiplayer, login, ads, levels/campaign, extra commands, Q-learning formulas UI, epsilon controls, settings menus beyond mute if needed, English UI, "Punir", "Rolar", story mode, leaderboards.

DELIVERABLES
- index.html entry point
- Local assets only (or embed)
- Runs by opening index.html or serving the folder statically
- Touch-friendly buttons
- Preference panel listing the four actions in pt-BR with bars/percentages after learning starts

Acceptance: only four commands; Latir spelled correctly; no Rolar; UI fully pt-BR; treat / no-treat only; works in iframe as static files.
```

---

## 8. Checklist de aceite

- [ ] UI 100% pt-BR  
- [ ] Só: Sentar, Pular, Latir, Deitar  
- [ ] Sem Rolar  
- [ ] Sem botão Punir  
- [ ] Loop comando → ação → petisco/sem petisco → barras  
- [ ] Roda em pasta estática / iframe  
- [ ] Prompt de build em inglês respeitado sem features extras  
