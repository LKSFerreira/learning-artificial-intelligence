# Prompts Definitivos de VÍDEO do Cão (v3 — 100% Caramelo Sólido, Escala Travada e Áudio Nativo)

## 📌 O Segredo para Transição 100% Imperceptível (Sem Pulo de Tamanho ou Perspectiva)

Geradores de vídeo (Veo, Runway, Kling, Sora, Luma) sofrem de "deriva de personagem" quando geram vídeos apenas por texto ou com descrições cheias de manchas. Para eliminar 100% a diferença de tamanho, cor e perspectiva entre os 6 vídeos, aplicamos **3 travas**:

1. **Pelagem Monocromática 100% Caramelo Sólido:** Removemos todas as manchas brancas de peito, focinho e patas. O cão agora é **inteiramente caramelo dourado uniforme (`#D9822B`)**, com apenas focinho/olhos escuros e contorno preto limpo.
2. **Trava Geométrica de Escala e Perspectiva (2D Orthographic Lock):** Todos os prompts especificam câmera ortográfica plana (zero distorção de lente), patas travadas na linha de base a **15% da borda inferior** e corpo ocupando **exatamente 55% da altura da tela**.
3. **Fluxo de Frame-Âncora (Recomendação Ouro na UI do Gerador):**
   - **Passo 1:** Gere primeiro o **VÍDEO 1 (`dog_idle.mp4`)** (ou gere uma imagem estática com o Prompt 0 abaixo).
   - **Passo 2:** Extraia/salve o **primeiro frame (`frame_0.png`)** do `dog_idle.mp4` aprovado.
   - **Passo 3:** Ao gerar os **Vídeos 2, 3, 4, 5 e 6**, anexe esse `frame_0.png` como **First Frame (Imagem Inicial / Image-to-Video)** (e, se o gerador tiver a opção **End Frame / Last Frame**, coloque o mesmo `frame_0.png` no final!). Isso obriga a IA a começar e terminar no **exato mesmo pixel, tamanho e perspectiva**.

---

## 🖼️ PROMPT 0 (Opcional) — Gerar a Imagem Base Perfeita (`dog_idle_base.png`)

Caso queira gerar primeiro uma nova imagem estática de referência 100% caramelo sem manchas para usar como *First Frame* de todos os vídeos:

```text
CHARACTER DESIGN SHEET (SINGLE POSE): A friendly cartoon Brazilian caramel dog ("vira-lata caramelo"), 2D clean flat vector animation style (Duolingo / modern mobile game mascot aesthetic) with uniform medium-thick black outline (#1A1A1A) and clean two-tone cel shading.
COAT & COLOR LOCK: 100% solid uniform golden-caramel fur (#D9822B) across the ENTIRE body, head, ears, chest, belly, legs, and tail. STRICTLY ZERO white patches, ZERO chest markings, ZERO spots, ZERO color gradients, ZERO collar or accessories. Only the nose tip and expressive eyes are dark espresso brown (#2B1B17).
POSE & PERSPECTIVE LOCK: Full body standing in strict 2D side-profile facing left with head slightly turned 15 degrees toward viewer. All 4 paws planted flat on an invisible horizontal line located 15% above the bottom edge. The dog is centered horizontally and occupies exactly 55% of the vertical frame height.
BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO floor shadow, NO ground line, NO lighting vignette, NO green spill on the character.
```

---

## 🎬 Prompts dos 6 Vídeos (10 segundos · 16:9 · Chroma Key `#00FF00` · Com Áudio)

### VÍDEO 1 — `dog_idle.mp4` (Repouso Base / Loop Contínuo / Âncora - 10s)

```text
REFERENCE & IDENTITY LOCK: Master base animation. Use the attached reference image as the exact first frame. Maintain 100% pixel-accurate character scale, position, orthographic 2D perspective, and solid coloring throughout the entire 10 seconds.

CHARACTER: Friendly cartoon Brazilian caramel dog ("vira-lata caramelo"), 2D clean vector animation style with crisp black contour line art and flat cel shading. 100% SOLID UNIFORM GOLDEN-CARAMEL COAT (#D9822B) over the entire body, chest, belly, ears, paws, and tail. STRICTLY NO white patches, NO spots, NO markings, NO collar. Floppy caramel ears, dark brown nose and warm expressive eyes.

SCALE & CAMERA LOCK: Fixed static orthographic 2D camera, zero lens distortion, zero camera movement, zero zoom, zero pan. Dog is centered horizontally, facing left in a locked side-profile (15-degree front turn). All 4 paws remain planted at the exact same baseline (15% from bottom edge), body occupying exactly 55% of frame height.

BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO ground shadows, NO floor plane, NO gradients.

ACTION & TIMING (10s SEAMLESS LOOP):
- [0.0s - 10.0s]: The dog stands calmly in place in its neutral idle posture. Only subtle, gentle chest breathing, an occasional natural eye blink, and a very slight, slow friendly tail sway. Paws never leave their exact spot. Frame 0.0s and Frame 10.0s must be 100% identical for an imperceptible infinite loop.

AUDIO: Completely silent background or very faint, barely audible calm puppy breathing. STRICTLY NO barks, NO music, NO ambient noise, NO wind.
```

---

### VÍDEO 2 — `dog_sentando.mp4` (Comando: Sentar - 10s)

```text
REFERENCE & IDENTITY LOCK: Exact same dog, exact same body size, exact same line thickness, and exact same camera distance as the attached reference image (dog_idle). Do NOT resize, zoom, or shift perspective.

CHARACTER: Friendly cartoon Brazilian caramel dog, 2D clean vector animation style with crisp black outline and flat cel shading. 100% SOLID UNIFORM GOLDEN-CARAMEL COAT (#D9822B) over the entire body, chest, belly, ears, paws, and tail. STRICTLY NO white patches, NO chest markings, NO spots, NO collar.

SCALE & CAMERA LOCK: Fixed static orthographic 2D camera, zero zoom, zero pan, zero perspective shift. Dog stays centered in the exact same spot, facing left at the exact same angle. Front paws stay anchored on the 15% bottom baseline.

BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO shadows on the ground, NO floor line.

TIMING & CONTINUITY (10s):
1) START [0.0s - 1.5s]: Starts in the exact standing idle pose from the reference frame, completely still and calm.
2) ACTION [1.5s - 7.5s]: At 1.5s, the dog smoothly bends its hind legs and sits down in place while keeping its front paws anchored on the same baseline. As it finishes sitting at 2.5s, it opens its mouth briefly for one cute, soft obedient bark, then holds the attentive sitting posture with a gentle happy tail wag.
3) END [7.5s - 10.0s]: The dog smoothly stands back up into the exact original standing idle pose by 8.5s, remaining calm and aligned with the initial frame until 10.0s.

AUDIO: One single soft, friendly, short puppy bark ("woof!") at 2.5s when sitting down. Complete studio silence before and after. STRICTLY NO background music, NO ambient noise, NO human voice.
```

---

### VÍDEO 3 — `dog_pulando.mp4` (Comando: Pular - 10s)

```text
REFERENCE & IDENTITY LOCK: Exact same dog, exact same body size, exact same line thickness, and exact same camera distance as the attached reference image (dog_idle). Do NOT resize, zoom, or shift perspective.

CHARACTER: Friendly cartoon Brazilian caramel dog, 2D clean vector animation style with crisp black outline and flat cel shading. 100% SOLID UNIFORM GOLDEN-CARAMEL COAT (#D9822B) over the entire body, chest, belly, ears, paws, and tail. STRICTLY NO white patches, NO chest markings, NO spots, NO collar.

SCALE & CAMERA LOCK: Fixed static orthographic 2D camera, zero zoom, zero camera tilt, zero pan. The camera does NOT follow the jump; the frame stays locked so the dog jumps vertically inside the safe frame area and lands on the exact same 15% bottom baseline.

BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO shadows, NO floor line.

TIMING & CONTINUITY (10s):
1) START [0.0s - 1.5s]: Starts in the exact standing idle pose from the reference frame.
2) ACTION [1.5s - 7.5s]: The dog crouches slightly, gives a joyful vertical hop straight up (staying well inside the top margin of the frame), lets out a cheerful soft double puppy bark in mid-air, and lands softly on the exact same footprint baseline, wagging its tail happily.
3) END [7.5s - 10.0s]: The dog settles smoothly back into the exact initial standing idle pose by 8.5s and holds it calmly until 10.0s.

AUDIO: Two short, cheerful, soft puppy barks ("yip-woof!") during the jump at 2.5s, followed by a soft paw landing sound. STRICTLY NO background music, NO ambient noise, NO reverb.
```

---

### VÍDEO 4 — `dog_deitando.mp4` (Comando: Deitar - 10s)

```text
REFERENCE & IDENTITY LOCK: Exact same dog, exact same body size, exact same line thickness, and exact same camera distance as the attached reference image (dog_idle). Do NOT resize, zoom, or shift perspective.

CHARACTER: Friendly cartoon Brazilian caramel dog, 2D clean vector animation style with crisp black outline and flat cel shading. 100% SOLID UNIFORM GOLDEN-CARAMEL COAT (#D9822B) over the entire body, chest, belly, ears, paws, and tail. STRICTLY NO white patches, NO chest markings, NO spots, NO collar.

SCALE & CAMERA LOCK: Fixed static orthographic 2D camera, zero zoom, zero pan, zero perspective change. Dog stays centered horizontally on the exact same 15% bottom baseline facing left.

BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO ground shadows, NO floor line.

TIMING & CONTINUITY (10s):
1) START [0.0s - 1.5s]: Starts in the exact standing idle pose from the reference frame.
2) ACTION [1.5s - 7.5s]: The dog smoothly lowers its front and hind legs, sliding its front paws slightly forward along the same baseline to lie flat on its belly in a calm, obedient sphinx posture. As it settles down at 2.8s, it gives one very soft, low puppy "woof" and a relaxed sigh, resting comfortably.
3) END [7.5s - 10.0s]: The dog smoothly pushes itself back up onto all 4 paws into the exact initial standing idle pose by 8.5s, holding still until 10.0s.

AUDIO: One very soft, calm low puppy bark ("woof") followed by a gentle relaxed dog sigh at 2.8s. Complete silence before and after. STRICTLY NO background music, NO ambient noise.
```

---

### VÍDEO 5 — `dog_recebendo_petisco.mp4` (Feedback Positivo: Dar Petisco - 10s)

```text
REFERENCE & IDENTITY LOCK: Exact same dog, exact same body size, exact same line thickness, and exact same camera distance as the attached reference image (dog_idle). Do NOT resize, zoom, or shift perspective.

CHARACTER: Friendly cartoon Brazilian caramel dog, 2D clean vector animation style with crisp black outline and flat cel shading. 100% SOLID UNIFORM GOLDEN-CARAMEL COAT (#D9822B) over the entire body, chest, belly, ears, paws, and tail. STRICTLY NO white patches, NO chest markings, NO spots, NO collar.

SCALE & CAMERA LOCK: Fixed static orthographic 2D camera, zero zoom, zero pan, zero perspective shift. Dog remains standing on the exact same 15% bottom baseline facing left.

BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO shadows, NO floor line.

TIMING & CONTINUITY (10s):
1) START [0.0s - 1.5s]: Starts in the exact standing idle pose from the reference frame.
2) ACTION [1.5s - 7.5s]: A small golden bone-shaped dog biscuit arcs smoothly from the left edge of the frame directly toward the dog's mouth. The dog gives a happy, excited soft bark, catches the biscuit cleanly in its mouth at 2.5s, chews it happily with joyful eyes and an enthusiastic tail wag, and swallows it cleanly.
3) END [7.5s - 10.0s]: The dog finishes chewing, calms its tail, and settles back into the exact initial standing idle pose by 8.5s until 10.0s.

AUDIO: One happy, excited short puppy bark at 2.0s, followed by cute, crisp cartoon biscuit crunching/chewing sounds from 2.5s to 5.5s. STRICTLY NO background music, NO ambient noise, NO human voice.
```

---

### VÍDEO 6 — `dog_sem_petisco.mp4` (Feedback Neutro/Retenção: Sem Petisco - 10s)

```text
REFERENCE & IDENTITY LOCK: Exact same dog, exact same body size, exact same line thickness, and exact same camera distance as the attached reference image (dog_idle). Do NOT resize, zoom, or shift perspective.

CHARACTER: Friendly cartoon Brazilian caramel dog, 2D clean vector animation style with crisp black outline and flat cel shading. 100% SOLID UNIFORM GOLDEN-CARAMEL COAT (#D9822B) over the entire body, chest, belly, ears, paws, and tail. STRICTLY NO white patches, NO chest markings, NO spots, NO collar.

SCALE & CAMERA LOCK: Fixed static orthographic 2D camera, zero zoom, zero pan, zero perspective shift. All 4 paws remain planted in the exact same position on the 15% bottom baseline facing left.

BACKGROUND: Pure flat solid chroma-key green (#00FF00) edge-to-edge. Strictly NO shadows, NO floor line.

TIMING & CONTINUITY (10s):
1) START [0.0s - 1.5s]: Starts in the exact standing idle pose from the reference frame.
2) ACTION [1.5s - 7.5s]: The dog stays standing on all four paws, lowers its head and floppy ears slightly, looks forward with big expressive puppy eyes, lets its tail droop down gently, and emits a single soft, cute questioning puppy whimper/sigh ("hmm?"), holding that mild "not this time" expression.
3) END [7.5s - 10.0s]: The dog lifts its head and ears back up, returning smoothly to the exact initial neutral standing idle pose by 8.5s until 10.0s.

AUDIO: One brief, gentle, cute puppy whimper/sigh at 2.5s (soft and empathetic, not loud or distressed). Complete silence before and after. STRICTLY NO background music, NO ambient noise.
```
