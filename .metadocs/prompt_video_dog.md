# Prompts de VÍDEO do cão — referência + continuidade

## Ideia

- **Identidade do cão:** só a imagem anexada `dog_idle.png` (não redesenhar).  
- **Duração:** ~**10 segundos** por clipe.  
- **Continuidade:** em todo vídeo de *ação*, o cão  
  1) **começa** na pose idle da referência,  
  2) faz a ação,  
  3) **volta** para a **mesma pose idle original** no final.  

Assim o app só troca de vídeo (`idle` ↔ `sit` ↔ `happy`…) sem “pulo” de pose.

```text
[início] idle = dog_idle.png
   → ação (sentar / pular / deitar / petisco / triste)
   → [fim] de novo idle = mesma pose da referência
```

**Idle** é o único que fica o tempo todo em repouso (respirando), já na pose original.

---

## Como usar

1. Sessão **nova** por vídeo.  
2. Anexar **sempre** `dog_idle.png`.  
3. Colar o prompt **inteiro** da seção.  
4. Gerar ~10s, fundo **verde #00FF00**.  
5. Salvar o `.mp4` com o nome indicado.

---

## 6 vídeos

| # | Arquivo | O que acontece (e volta pro idle) |
| ---: | :--- | :--- |
| 1 | `dog_idle.mp4` | Só espera (já é a pose base) |
| 2 | `dog_sit.mp4` | Idle → senta → **volta idle** |
| 3 | `dog_jump.mp4` | Idle → pula → aterra → **volta idle** |
| 4 | `dog_lay.mp4` | Idle → deita → levanta → **volta idle** |
| 5 | `dog_happy.mp4` | Idle → petisco + festa → **volta idle** |
| 6 | `dog_sad.mp4` | Idle → triste gentil → **volta idle** |

---

# VÍDEO 1 — Idle (pose base, 10s)

**Anexar:** `dog_idle.png`  
**Salvar:** `dog_idle.mp4`

### Prompt (copiar tudo)

```text
Image-to-video. Animate ONLY the EXACT dog from the attached reference image. Do NOT redesign, recolor, or restyle the dog. Same face, body, fur, chest marking, ears, and 2D illustration style as the reference.

GREEN SCREEN IS MANDATORY: entire background is flat pure chroma-key green #00FF00 (RGB 0,255,0), solid even green edge to edge. No black, no gray, no gradient, no shadows on the green, no ground plane, no grass, no park, no scenery, no props.

TIMING: about 10 seconds, 24fps.

ACTION: the dog stays in the SAME standing full-body idle pose as the reference for the whole clip. Subtle breathing, tiny ear twitch, slight tail tip movement only. No walking, no sitting, no jumping, no lying down, no spinning. First frame and last frame must match the reference standing pose (seamless idle loop).

CAMERA: fixed eye-level, full body head-to-tail and all paws visible, dog centered, same facing as the reference. No camera move, no zoom, no cut. No text, watermark, logo, UI, collar, accessories, second animal, or human.

Output: 10-second seamless idle loop of the exact attached dog on pure #00FF00 green.
```

---

# VÍDEO 2 — Sentar (e volta ao idle)

**Anexar:** `dog_idle.png`  
**Salvar:** `dog_sit.mp4`

### Prompt (copiar tudo)

```text
Image-to-video. Animate the EXACT dog from the attached reference image. Do NOT redesign the dog. Same identity, colors, proportions, markings, and 2D art style as the reference.

GREEN SCREEN IS MANDATORY: flat pure chroma-key green #00FF00 background only, even solid green, no black, no park, no grass, no shadows on the green, no props.

TIMING: about 10 seconds total, 24fps. Continuity structure (must follow this order):
1) START (about 0-1.5s): dog standing in the EXACT same idle pose as the attached reference image.
2) MIDDLE: dog clearly sits down (hind legs sit, front paws on ground), holds the sit briefly with gentle breathing.
3) END (last 2-3 seconds): dog stands back up and RETURNS to the EXACT original standing idle pose of the reference image — same stance, same facing, same head height. Final frame must match the reference standing pose so the next video can continue seamlessly.

No jumping, no lying flat, no spinning, no walking off frame. No human, no second animal, no collar, no accessories.

CAMERA: fixed eye-level, full body always in frame, dog centered. No camera move, no zoom, no cut, no text, no watermark, no UI.

Output: 10s clip of the same dog: idle → sit → back to idle on pure #00FF00 green.
```

---

# VÍDEO 3 — Pular (e volta ao idle)

**Anexar:** `dog_idle.png`  
**Salvar:** `dog_jump.mp4`

### Prompt (copiar tudo)

```text
Image-to-video. Animate the EXACT dog from the attached reference image. Do NOT redesign the dog. Same identity, colors, proportions, markings, and 2D art style as the reference.

GREEN SCREEN IS MANDATORY: flat pure chroma-key green #00FF00 background only, even solid green, no black, no park, no grass, no shadows on the green, no props.

TIMING: about 10 seconds total, 24fps. Continuity structure (must follow this order):
1) START (about 0-1.5s): dog standing in the EXACT same idle pose as the attached reference image.
2) MIDDLE: dog performs a clear joyful jump (paws leave the ground), then lands.
3) END (last 2-3 seconds): dog RETURNS to the EXACT original standing idle pose of the reference image — same stance, same facing, same head height. Final frame must match the reference standing pose for seamless continuity.

No sitting, no lying down, no spinning as main action, no walking off frame. No human, no second animal, no collar, no accessories.

CAMERA: fixed eye-level, full body always in frame, dog centered. No camera move, no zoom, no cut, no text, no watermark, no UI.

Output: 10s clip of the same dog: idle → jump → back to idle on pure #00FF00 green.
```

---

# VÍDEO 4 — Deitar (e volta ao idle)

**Anexar:** `dog_idle.png`  
**Salvar:** `dog_lay.mp4`

### Prompt (copiar tudo)

```text
Image-to-video. Animate the EXACT dog from the attached reference image. Do NOT redesign the dog. Same identity, colors, proportions, markings, and 2D art style as the reference.

GREEN SCREEN IS MANDATORY: flat pure chroma-key green #00FF00 background only, even solid green, no black, no park, no grass, no shadows on the green, no props.

TIMING: about 10 seconds total, 24fps. Continuity structure (must follow this order):
1) START (about 0-1.5s): dog standing in the EXACT same idle pose as the attached reference image.
2) MIDDLE: dog lies down (down command: belly/chest low, relaxed), holds briefly.
3) END (last 2-3 seconds): dog stands back up and RETURNS to the EXACT original standing idle pose of the reference image — same stance, same facing, same head height. Final frame must match the reference standing pose for seamless continuity.

No jumping, no spinning, no walking off frame. No human, no second animal, no collar, no accessories.

CAMERA: fixed eye-level, full body always in frame, dog centered. No camera move, no zoom, no cut, no text, no watermark, no UI.

Output: 10s clip of the same dog: idle → lie down → back to idle on pure #00FF00 green.
```

---

# VÍDEO 5 — Petisco + feliz (e volta ao idle)

**Anexar:** `dog_idle.png`  
**Salvar:** `dog_happy.mp4`  

**App:** só dá play (petisco já está no vídeo).

### Prompt (copiar tudo)

```text
Image-to-video. Animate the EXACT dog from the attached reference image. Do NOT redesign the dog. Same identity, colors, proportions, markings, and 2D art style as the reference.

GREEN SCREEN IS MANDATORY: flat pure chroma-key green #00FF00 background only, even solid green, no black, no park, no grass, no shadows on the green, no props.

TIMING: about 10 seconds total, 24fps. Continuity structure (must follow this order):
1) START (about 0-1.5s): dog standing in the EXACT same idle pose as the attached reference image, attentive.
2) MIDDLE reward sequence:
   - A small brown/tan dog biscuit flies in from the FRONT as if thrown through the screen by an off-camera tutor (no hand, no human body visible).
   - The dog catches it, chews once or twice, swallows.
   - The dog becomes super happy: cheerful face, strong continuous tail wag, slight happy bounce.
3) END (last 2-3 seconds): happiness calms down and the dog RETURNS to the EXACT original standing idle pose of the reference image — same stance, same facing, same head height, calm again. Final frame must match the reference standing pose for seamless continuity.

No sitting, no lying down, no spinning, no walking off frame. No bowl. No second animal. No human visible. No collar.

CAMERA: fixed eye-level, full body always in frame, dog centered. No camera move, no zoom, no cut, no text, no watermark, no UI.

Output: 10s clip of the same dog: idle → catch treat → celebrate → back to idle on pure #00FF00 green.
```

---

# VÍDEO 6 — Sem petisco / triste gentil (e volta ao idle)

**Anexar:** `dog_idle.png`  
**Salvar:** `dog_sad.mp4`

### Prompt (copiar tudo)

```text
Image-to-video. Animate the EXACT dog from the attached reference image. Do NOT redesign the dog. Same identity, colors, proportions, markings, and 2D art style as the reference.

GREEN SCREEN IS MANDATORY: flat pure chroma-key green #00FF00 background only, even solid green, no black, no park, no grass, no shadows on the green, no props.

TIMING: about 10 seconds total, 24fps. Continuity structure (must follow this order):
1) START (about 0-1.5s): dog standing in the EXACT same idle pose as the attached reference image.
2) MIDDLE: gentle disappointment (no treat) — head slightly down, soft sad expression, tail low, calm not-this-time body language. NO fear, NO pain, NO tears, NO abuse tone. Hold this mood briefly.
3) END (last 2-3 seconds): mood softens and the dog RETURNS to the EXACT original standing idle pose of the reference image — same stance, same facing, same head height, neutral again. Final frame must match the reference standing pose for seamless continuity.

No sitting, no lying down, no jumping, no spinning. No human, no second animal, no collar, no accessories.

CAMERA: fixed eye-level, full body always in frame, dog centered. No camera move, no zoom, no cut, no text, no watermark, no UI.

Output: 10s clip of the same dog: idle → gently sad → back to idle on pure #00FF00 green.
```

---

## Continuidade no app (depois)

```text
Estado idle      → dog_idle.mp4 (loop)
Comando Sentar   → dog_sit.mp4 (play uma vez; fim = idle)
Comando Pular    → dog_jump.mp4
Comando Deitar   → dog_lay.mp4
Dar petisco      → dog_happy.mp4
Sem petisco      → dog_sad.mp4
Quando o vídeo de ação termina → volta para dog_idle.mp4
```

Como cada ação **termina em idle**, a troca para `dog_idle.mp4` fica natural.

## Checklist por vídeo

- [ ] Mesmo dog da referência  
- [ ] Fundo verde `#00FF00` (não preto)  
- [ ] ~10 segundos  
- [ ] Começa em idle da referência  
- [ ] Faz a ação  
- [ ] **Termina de novo no idle da referência**  
- [ ] Corpo inteiro, câmera fixa  

## Pasta (igual estratégia do áudio)

MP4 ficam em **`public/videos/`** (e no bucket `videos` com a mesma árvore).  
PNG de referência e cenário ficam em `public/imagens/treinador/`.

```text
public/videos/treinador/         ← local (= espelho do bucket)
  dog_idle.mp4
  dog_sentando.mp4
  dog_pulando.mp4
  dog_deitando.mp4
  dog_recebendo_petisco.mp4
  dog_sem_petisco.mp4

public/imagens/treinador/
  dog_idle.png                   ← referência de geração
  bg_park.png
  prompt_video_dog.md
```

Bucket Supabase (pasta que você criou):

```text
https://…/object/public/videos/treinador
  dog_idle.mp4
  dog_sentando.mp4
  …
```

Env (raiz do bucket `videos`, **sem** `/treinador` no final):

```env
VITE_VIDEO_BASE_URL=https://ilvwvrjixrjqldwaccgj.supabase.co/storage/v1/object/public/videos
```

Ver `public/videos/README.md` e `src/servicos/midia/gerenciadorVideoTreinador.ts`.
