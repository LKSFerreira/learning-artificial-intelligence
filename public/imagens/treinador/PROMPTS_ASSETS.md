# Treinador RL — Prompts prontos (copiar e colar)

## Como usar

1. Abra uma **sessão nova** por arquivo.
2. Anexe a **referência** indicada (quando houver).
3. Copie o bloco inteiro dentro de ` ```text ` … ` ``` ` (só o texto do prompt).
4. Cole no gerador de imagem.
5. Exporte **PNG** (personagens com **fundo transparente**).

| Regra | Valor |
| :--- | :--- |
| 1 arquivo | 1 prompt | 1 sessão |
| Idioma do prompt | Inglês |
| Tutor / cão | Fundo transparente (alpha) |
| Tutor olha | Direita (facing right) |
| Cão olha | Esquerda (facing left) |
| Frame único | Canvas **1024×1024** |
| Spritesheet (4 frames) | Canvas **1024×256** (células 256×256) |

### Status

| Arquivo | Status |
| :--- | :--- |
| `bg_park.png` | Feito (já no app) |
| `tutor_idle.png` | Próximo |
| `tutor_treat.png` | Pendente |
| `tutor_no_treat.png` | Pendente |
| `dog_*.png` | Depois do tutor |
| `*_sheet.png` | Opcional (movimento) |

---

# SESSÃO 1 — Fundo do parque (já feito)

**Arquivo:** `bg_park.png`  
**Referência:** nenhuma  
**Canvas sugerido:** 1920×1080 (16:9)  
**Transparência:** não precisa  

### Prompt (só se for regenerar)

```text
Wide 16:9 educational game background of an empty outdoor dog-training park, soft morning daylight, clear blue sky with soft white clouds, green grass field in the foreground, dirt training path in the center, wooden low fence in the mid distance, friendly trees and bushes, distant gentle hills, optional simple agility props such as a tunnel or wooden A-frame, cozy safe park atmosphere, clean 2D painted game illustration style matching modern learning apps. IMPORTANT: completely empty of people, humans, dogs, animals, hands, food, text, logos, UI, watermarks. Environment and background only. Horizon around mid-frame. Eye-level camera suitable for overlaying characters later. No characters of any kind.
```

---

# SESSÃO 2A — Tutor em repouso (1 pose só)

> **Atenção:** este prompt gera **UM** personagem (1 frame).  
> **Não** gera spritesheet. Para a folha de movimento use a **SESSÃO 2B** (abaixo), em **outra sessão**, com o prompt da 2B.

**Arquivo:** `tutor_idle.png`  
**Referência:** anexar `tutor.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  
**Status:** se já gerou o tutor parado, salve como `tutor_idle.png` e vá para a 2B.

### Prompt (copiar tudo)

```text
Same character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Friendly adult dog trainer, full body, standing in a relaxed idle pose, waiting patiently for the user, arms relaxed at sides or lightly clasped, soft neutral smile, calm posture, treat pouch / snack bag clearly tied at the waist and clearly visible, facing right (looking toward the right side of the frame). High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body head-to-toe visible, character height about 80-85% of the frame height, feet near the bottom edge with a small margin, small top margin above the head, centered horizontally, correct adult human proportions (about 7.5 heads tall), not cropped, not close-up, not chibi, not giant head, not stylized super-deformed. No dog, no second character, no food in hands, no speech bubble, no text. SINGLE CHARACTER ONLY. NOT a spritesheet. NOT multiple frames. One pose only.
```

---

# SESSÃO 2B — Tutor em repouso SPRITESHEET (movimento idle)

> **Sessão NOVA e separada.**  
> Anexe o `tutor_idle.png` que você acabou de gerar (character lock).  
> Este prompt pede **folha de animação** (4 frames em fila), não um único desenho.

**Arquivo:** `tutor_idle_sheet.png`  
**Referência:** anexar `tutor_idle.png`  
**Canvas:** 1024×256 (se a ferramenta forçar 1:1, use o prompt alternativo 2B-ALT no final desta sessão)  
**Fundo:** transparente  

### Prompt (copiar tudo) — folha horizontal 4 frames

```text
IMPORTANT: output must be a SPRITESHEET, not a single character portrait. Game animation sprite sheet of the SAME character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Exactly FOUR full-body copies of the character side by side in one horizontal row, showing a subtle idle breathing animation loop: frame1 neutral stance, frame2 slight weight shift, frame3 gentle chest rise, frame4 return toward start, small differences only, seamless loop. Each copy facing right, treat pouch visible on the waist in every frame, calm smile. Pure transparent background, real alpha, no environment, no floor, no scenery. Layout: exactly 4 equal cells in 1 row, each cell 256x256 pixels, total image 1024x256 pixels, characters same size in every cell, feet on the same baseline, no gaps, no overlapping, no numbers, no text, no labels, no borders drawn between cells, no UI. High-quality 2D game illustration, clean educational game art, soft daylight, consistent proportions. NOT a single centered character. NOT one pose. MUST show four sequential animation frames in a strip. No dog, no second different character.
```

### Prompt alternativo 2B-ALT (se a ferramenta só gera 1024×1024)

```text
IMPORTANT: output must be a SPRITESHEET grid, not a single character portrait. Game animation sprite sheet of the SAME character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Exactly FOUR full-body copies of the character in a 2 by 2 grid, reading order left-to-right then top-to-bottom: frame1 neutral idle, frame2 slight weight shift, frame3 gentle chest rise, frame4 return toward start, subtle idle breathing loop, seamless. Each copy facing right, treat pouch visible on the waist in every frame, calm smile. Pure transparent background, real alpha, no environment, no floor, no scenery. Layout: exactly 2 columns and 2 rows, each cell 512x512 pixels, total image 1024x1024 pixels, characters same size in every cell, feet on the same baseline inside each cell, no gaps, no overlapping, no numbers, no text, no labels, no borders drawn between cells, no UI. High-quality 2D game illustration, clean educational game art, soft daylight, consistent proportions. NOT a single centered character. MUST show four sequential animation frames. No dog, no second different character.
```

---

# SESSÃO 3 — Tutor dando petisco

**Arquivo:** `tutor_treat.png`  
**Referência:** anexar `tutor.png` (ou `tutor_idle.png` se já estiver bom)  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Friendly adult dog trainer, full body, warm encouraging smile, right hand extended forward offering a small dog treat or bone biscuit toward the right, clear giving-a-treat gesture, treat pouch still visible on the waist, facing right, positive reinforcement moment, no anger. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body head-to-toe visible, character height about 80-85% of the frame height, feet near the bottom edge with a small margin, small top margin above the head, centered horizontally, correct adult human proportions (about 7.5 heads tall), not cropped, not close-up, not chibi, not giant head, not stylized super-deformed. No dog, no second character, no speech bubble, no text. Keep body proportions identical to the reference; only pose and hand prop change.
```

---

# SESSÃO 4 — Tutor sem petisco (gentil)

**Arquivo:** `tutor_no_treat.png`  
**Referência:** anexar `tutor.png` (ou `tutor_idle.png`)  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Friendly adult dog trainer, full body, gently disappointed but kind expression, NOT angry, NOT yelling, NOT scolding harshly, NO rage, empty hands visible with no treat, soft not-this-time body language with a slight head tilt, calm closed mouth or mild sad smile, shoulders slightly lowered, still caring tutor energy, treat pouch closed on the waist, facing right. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body head-to-toe visible, character height about 80-85% of the frame height, feet near the bottom edge with a small margin, small top margin above the head, centered horizontally, correct adult human proportions (about 7.5 heads tall), not cropped, not close-up, not chibi, not giant head, not stylized super-deformed. No dog, no second character, no red marks, no rage symbols, no text, no punishment props. Keep body proportions identical to the reference; only pose and expression change.
```

---

# SESSÃO 5 — Cão idle

**Arquivo:** `dog_idle.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, standing idle, attentive, tail relaxed, ready for a command. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, feet near the bottom edge with a small margin, centered, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# SESSÃO 6 — Cão sentar

**Arquivo:** `dog_sit.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, sitting neatly on hind legs with front paws on the ground, obedient sit pose. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, feet near the bottom edge with a small margin, centered, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# SESSÃO 7 — Cão pular

**Arquivo:** `dog_jump.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, mid-air jump, joyful, all paws off the ground, readable jump silhouette. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, keep the dog centered with small margins, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# SESSÃO 8 — Cão latir (arquivo dog_bark.png)

**Arquivo:** `dog_bark.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  
**Nota UI do jogo:** comando **Latir** (não “Ladrar”).  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, barking (action: latir), mouth open, alert, energetic but friendly. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, feet near the bottom edge with a small margin, centered, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# SESSÃO 9 — Cão deitar

**Arquivo:** `dog_lay.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, lying down on the ground, relaxed down command pose. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, body near the bottom edge with a small margin, centered, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# ~~SESSÃO 10 — Cão rolar~~ REMOVIDO DO ESCOPO

Não gerar `dog_roll.png`. Comando **Rolar** fora do produto.

---

# SESSÃO 10 — Cão triste (sem petisco)

**Arquivo:** `dog_sad.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, mildly disappointed, head slightly down, soft ears, gentle sad expression, NO fear, NO abuse tone, no pain, still a soft educational character. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, feet near the bottom edge with a small margin, centered, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# SESSÃO 11 — Cão feliz (com petisco)

**Arquivo:** `dog_happy.png`  
**Referência:** anexar `dog.png`  
**Canvas:** 1024×1024  
**Fundo:** transparente  

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog, full body, facing left, happy after receiving a treat, tail up, cheerful joyful expression. High-quality 2D game illustration, clean professional educational game art, consistent line weight, soft daylight, readable silhouette, no text, no watermark, no logo, no UI, no frame, no border, no panel lines, sharp focus, polished shading. Detailed prompt adherence: keep proportions stable across the whole image. Isolated subject only, pure transparent background, real alpha channel, no checkerboard painted in, no ground shadow plate, no backdrop, no environment, no scenery, no floor texture, cutout character asset only. Square 1:1 canvas exactly 1024x1024 pixels, full body dog head-to-tail and paws visible, dog height about 70-75% of the frame height, feet near the bottom edge with a small margin, centered, medium-large friendly dog proportions, not a tiny puppy, not cropped, not face-only close-up. No human, no tutor, no second animal, no text, no background scenery.
```

---

# OPCIONAL — Spritesheets (movimento em loop)

Só depois dos frames únicos estarem bons.  
**1 sheet = 1 animação = 1 sessão.**  
**Canvas:** 1024×256 · 4 células de 256×256 · ordem da esquerda para a direita · loop.

## Tutor idle sheet

**Arquivo:** `tutor_idle_sheet.png`  
**Referência:** anexar `tutor_idle.png` ou `tutor.png`

### Prompt (copiar tudo)

```text
Same character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Friendly adult dog trainer idle breathing loop with subtle weight shift and gentle chest and shoulder movement only, treat pouch visible on the waist in every frame, facing right, calm smile. Character animation spritesheet technique, single animation strip only, pure transparent background with real alpha on the whole sheet, no checkerboard painted in, no environment, no scenery. Grid: exactly 4 columns and 1 row, each cell exactly 256x256 pixels, total image size exactly 1024x256 pixels, same character scale in every cell, feet aligned to the same baseline in every cell, equal spacing, no gaps, no overlapping cells, no labels, no numbers, no borders drawn between cells, frame order left to right is chronological and must loop seamlessly so the last frame connects to the first, no camera zoom change between frames, no character size drift. High-quality 2D game illustration, clean educational game art, soft daylight, no text, no watermark, no logo, no UI. No dog, no second character.
```

## Tutor treat sheet

**Arquivo:** `tutor_treat_sheet.png`  
**Referência:** anexar `tutor_treat.png` ou `tutor.png`

### Prompt (copiar tudo)

```text
Same character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Animation of raising the hand and offering a small dog treat forward to the right, friendly smile, treat pouch visible on the waist in every frame, facing right, no anger. Character animation spritesheet technique, single animation strip only, pure transparent background with real alpha on the whole sheet, no checkerboard painted in, no environment, no scenery. Grid: exactly 4 columns and 1 row, each cell exactly 256x256 pixels, total image size exactly 1024x256 pixels, same character scale in every cell, feet aligned to the same baseline in every cell, equal spacing, no gaps, no overlapping cells, no labels, no numbers, no borders drawn between cells, frame order left to right is chronological, loop seamless if possible, no camera zoom change between frames, no character size drift. High-quality 2D game illustration, clean educational game art, soft daylight, no text, no watermark, no logo, no UI. No dog, no second character.
```

## Tutor no-treat sheet

**Arquivo:** `tutor_no_treat_sheet.png`  
**Referência:** anexar `tutor_no_treat.png` ou `tutor.png`

### Prompt (copiar tudo)

```text
Same character as the attached reference image: same face, same hairstyle, same clothes, same colors, same treat pouch on the belt. Animation of a gentle disappointed head tilt and slightly lowered shoulders, empty hands, kind face, NOT angry, NOT yelling, treat pouch on the waist in every frame, facing right. Character animation spritesheet technique, single animation strip only, pure transparent background with real alpha on the whole sheet, no checkerboard painted in, no environment, no scenery. Grid: exactly 4 columns and 1 row, each cell exactly 256x256 pixels, total image size exactly 1024x256 pixels, same character scale in every cell, feet aligned to the same baseline in every cell, equal spacing, no gaps, no overlapping cells, no labels, no numbers, no borders drawn between cells, frame order left to right is chronological and loops, no camera zoom change between frames, no character size drift. High-quality 2D game illustration, clean educational game art, soft daylight, no text, no watermark, no logo, no UI, no rage symbols, no punishment props. No dog, no second character.
```

## Cão sit sheet (exemplo; repita o padrão para outras ações)

**Arquivo:** `dog_sit_sheet.png`  
**Referência:** anexar `dog_sit.png` ou `dog.png`

### Prompt (copiar tudo)

```text
Same dog as the attached reference image: same breed look, same colors, same collar if any, same proportions. Cute friendly medium-large dog sitting animation loop, subtle breathing and small tail or head movement while holding a sit pose, facing left. Character animation spritesheet technique, single animation strip only, pure transparent background with real alpha on the whole sheet, no checkerboard painted in, no environment, no scenery. Grid: exactly 4 columns and 1 row, each cell exactly 256x256 pixels, total image size exactly 1024x256 pixels, same character scale in every cell, feet aligned to the same baseline in every cell, equal spacing, no gaps, no overlapping cells, no labels, no numbers, no borders drawn between cells, frame order left to right is chronological and must loop seamlessly, no camera zoom change between frames, no character size drift. High-quality 2D game illustration, clean educational game art, soft daylight, no text, no watermark, no logo, no UI. No human, no tutor, no second animal.
```

---

## Checklist rápido (depois de gerar)

- [ ] Nome do arquivo certo  
- [ ] Personagem: fundo transparente de verdade  
- [ ] Corpo inteiro, proporção estável  
- [ ] Tutor → direita · Cão → esquerda  
- [ ] Tutor: bolsa na cintura  
- [ ] No-treat / sad: sem raiva / sem abuso  
- [ ] Sheet: 4 frames alinhados, mesmo tamanho  

## Pasta no projeto

```text
public/imagens/treinador/
  bg_park.png
  tutor_idle.png
  tutor_treat.png
  tutor_no_treat.png
  dog_idle.png
  dog_sit.png
  dog_jump.png
  dog_bark.png
  dog_lay.png
  dog_sad.png
  dog_happy.png
  (opcional) *_sheet.png
```
