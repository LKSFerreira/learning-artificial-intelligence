# Prompts de VÍDEO do Cão (Text-to-Video / Image-to-Video) — Continuidade e Consistência (10s)

## 📌 Configurações na Interface do Gerador (UI)

* **Proporção:** 16:9
* **Resolução:** 720P (1280x720) ou 1080P
* **Duração:** 10 segundos (24 FPS / 30 FPS)
* **Formato:** MP4
* **Imagem de Entrada (Obrigatório):** Anexar [`dog_idle.png`](public/imagens/treinador/dog_idle.png) como imagem de referência base (First Frame / Subject Reference / Image-to-Video)
* **Dica de Consistência:** Nos geradores com suporte a Seed/Seed Locking ou Subject Reference, mantenha a mesma Seed e o mesmo peso de fidelidade à imagem de referência em todas as gerações.

---

## 🔄 Estrutura de Continuidade em 3 Fases (10s)

Para que a transição entre os vídeos seja imperceptível no aplicativo, todo clipe de ação de 10 segundos segue este cronograma:

```text
[0.0s – 2.0s]               [2.0s – 7.0s]                  [7.0s – 10.0s]
    INÍCIO                       AÇÃO                           FIM
Começa exatamente           Executa a ação              Retorna à pose IDLE
na pose IDLE base    ➔    (Senta, Pula, Deita,    ➔   e completa 1 ciclo de IDLE
 (em pé/respirando)         Petisco ou Triste)        (mesma altura, foco e chão)
```

---

## 🎬 Prompts Prontos (Text-to-Video / Image-to-Video com Consistência de Personagem - 10s)

| # | Arquivo Final | Ação Principal (10s) | Papel do Prompt |
| :-: | :--- | :--- | :--- |
| **1** | `dog_idle.mp4` | Repouso contínuo em pé (loop perfeito de 10s) | **Âncora Principal** (Define o cão base da imagem `dog_idle.png`) |
| **2** | `dog_sentando.mp4` | Idle (2.0s) ➔ Senta e sustenta (5.0s) ➔ Levanta e volta para Idle (3.0s) | Mantém o **mesmo cão** do vídeo/imagem anterior |
| **3** | `dog_pulando.mp4` | Idle (2.0s) ➔ Pulo alegre e aterrissagem suave (5.0s) ➔ Volta para Idle (3.0s) | Mantém o **mesmo cão** do vídeo/imagem anterior |
| **4** | `dog_deitando.mp4` | Idle (2.0s) ➔ Deita no chão relaxado (5.0s) ➔ Levanta e volta para Idle (3.0s) | Mantém o **mesmo cão** do vídeo/imagem anterior |
| **5** | `dog_recebendo_petisco.mp4` | Idle (2.0s) ➔ Pega petisco, mastiga e comemora (5.0s) ➔ Volta para Idle (3.0s) | Mantém o **mesmo cão** do vídeo/imagem anterior |
| **6** | `dog_sem_petisco.mp4` | Idle (2.0s) ➔ Reação triste suave e compreensiva (5.0s) ➔ Volta para Idle (3.0s) | Mantém o **mesmo cão** do vídeo/imagem anterior |

---

### VÍDEO 1 — `dog_idle.mp4` (Repouso Base / Loop Contínuo / Cão Âncora - 10s)

```text
REFERENCE: Master base character reference from attached image dog_idle.png. Establish the definitive visual identity, proportions, and style for all subsequent animations.

CHARACTER: A friendly cartoon caramel dog (Brazilian "vira-lata caramelo" mixed breed), 2D clean vector animation illustration style with clear black contour line art and soft cell shading. Short golden-tan caramel coat, cream-white chest patch running down throat and belly, cream-white muzzle, dark chocolate-brown floppy drop ears, dark brown nose, expressive warm brown eyes. Standing athletic build, medium curved tail, no collar, no accessories. Full body standing in profile facing left at 3/4 angle.

BACKGROUND: Pure solid chroma-key green #00FF00 only, flat and completely shadowless from edge to edge with no ground, no floor gradient, no shadows, no scenery.

ACTION: The dog remains in the exact same standing full-body idle pose for the entire 10-second clip. Gentle subtle breathing and very slight tail tip twitch only. First frame (0.0s) and last frame (10.0s) must match the exact standing pose for a seamless continuous loop.

CAMERA: Fixed static eye-level camera, dog centered in the middle of the frame, full body and all 4 paws always visible. No camera movement, no zoom, no pan, no cut.
```

---

### VÍDEO 2 — `dog_sentando.mp4` (Comando Sentar - 10s)

```text
REFERENCE & CONSISTENCY: Exact same character as the reference image dog_idle.png and the previous base idle prompt. Maintain 100% consistency with the same dog: identical facial features, body proportions, fur coloring, dark floppy drop ears, white chest patch, vector art style, and clean contour line art.

CHARACTER: A friendly cartoon caramel dog (Brazilian "vira-lata caramelo" mixed breed), 2D clean vector animation illustration style with clear black contour line art and soft cell shading. Short golden-tan caramel coat, cream-white chest patch running down throat and belly, cream-white muzzle, dark chocolate-brown floppy drop ears, dark brown nose, expressive warm brown eyes. Standing athletic build, medium curved tail, no collar, no accessories. Full body standing in profile facing left at 3/4 angle.

BACKGROUND: Pure solid chroma-key green #00FF00 only, flat and completely shadowless from edge to edge with no ground, no floor gradient, no shadows, no scenery.

TIMING & CONTINUITY:
1) START (0.0s - 2.0s): Starts in the exact standard standing idle pose facing left, identical to dog_idle.
2) ACTION (2.0s - 7.0s): Dog smoothly sits down on its hind legs (front paws firmly on ground), comfortably holds the sit pose with an attentive look.
3) END (7.0s - 10.0s): Dog smoothly stands back up to the exact standing idle pose, holding the calm breathing idle loop until the final frame (10.0s).

CAMERA: Fixed static eye-level camera, dog centered in the middle of the frame, full body always visible. No zoom, no camera movement, no cut.
```

---

### VÍDEO 3 — `dog_pulando.mp4` (Comando Pular - 10s)

```text
REFERENCE & CONSISTENCY: Exact same character as the reference image dog_idle.png and the previous base idle prompt. Maintain 100% consistency with the same dog: identical facial features, body proportions, fur coloring, dark floppy drop ears, white chest patch, vector art style, and clean contour line art.

CHARACTER: A friendly cartoon caramel dog (Brazilian "vira-lata caramelo" mixed breed), 2D clean vector animation illustration style with clear black contour line art and soft cell shading. Short golden-tan caramel coat, cream-white chest patch running down throat and belly, cream-white muzzle, dark chocolate-brown floppy drop ears, dark brown nose, expressive warm brown eyes. Standing athletic build, medium curved tail, no collar, no accessories. Full body standing in profile facing left at 3/4 angle.

BACKGROUND: Pure solid chroma-key green #00FF00 only, flat and completely shadowless from edge to edge with no ground, no floor gradient, no shadows, no scenery.

TIMING & CONTINUITY:
1) START (0.0s - 2.0s): Starts in the exact standard standing idle pose facing left, identical to dog_idle.
2) ACTION (2.0s - 7.0s): Dog prepares, performs a joyful vertical jump with all paws leaving the ground, reaches jump apex, and lands smoothly back on its four paws, stabilizing comfortably.
3) END (7.0s - 10.0s): Dog returns to the exact standing idle pose, holding the calm breathing idle loop until the final frame (10.0s).

CAMERA: Fixed static eye-level camera, dog centered in the middle of the frame, full body always visible throughout jump. No zoom, no camera movement, no cut.
```

---

### VÍDEO 4 — `dog_deitando.mp4` (Comando Deitar - 10s)

```text
REFERENCE & CONSISTENCY: Exact same character as the reference image dog_idle.png and the previous base idle prompt. Maintain 100% consistency with the same dog: identical facial features, body proportions, fur coloring, dark floppy drop ears, white chest patch, vector art style, and clean contour line art.

CHARACTER: A friendly cartoon caramel dog (Brazilian "vira-lata caramelo" mixed breed), 2D clean vector animation illustration style with clear black contour line art and soft cell shading. Short golden-tan caramel coat, cream-white chest patch running down throat and belly, cream-white muzzle, dark chocolate-brown floppy drop ears, dark brown nose, expressive warm brown eyes. Standing athletic build, medium curved tail, no collar, no accessories. Full body standing in profile facing left at 3/4 angle.

BACKGROUND: Pure solid chroma-key green #00FF00 only, flat and completely shadowless from edge to edge with no ground, no floor gradient, no shadows, no scenery.

TIMING & CONTINUITY:
1) START (0.0s - 2.0s): Starts in the exact standard standing idle pose facing left, identical to dog_idle.
2) ACTION (2.0s - 7.0s): Dog smoothly lies down flat on its belly in a relaxed posture with front paws extended, resting calmly in the lie-down pose.
3) END (7.0s - 10.0s): Dog pushes up and stands back up to the exact standing idle pose, holding the calm breathing idle loop until the final frame (10.0s).

CAMERA: Fixed static eye-level camera, dog centered in the middle of the frame, full body always visible. No zoom, no camera movement, no cut.
```

---

### VÍDEO 5 — `dog_recebendo_petisco.mp4` (Feedback Positivo / Recompensa - 10s)

```text
REFERENCE & CONSISTENCY: Exact same character as the reference image dog_idle.png and the previous base idle prompt. Maintain 100% consistency with the same dog: identical facial features, body proportions, fur coloring, dark floppy drop ears, white chest patch, vector art style, and clean contour line art.

CHARACTER: A friendly cartoon caramel dog (Brazilian "vira-lata caramelo" mixed breed), 2D clean vector animation illustration style with clear black contour line art and soft cell shading. Short golden-tan caramel coat, cream-white chest patch running down throat and belly, cream-white muzzle, dark chocolate-brown floppy drop ears, dark brown nose, expressive warm brown eyes. Standing athletic build, medium curved tail, no collar, no accessories. Full body standing in profile facing left at 3/4 angle.

BACKGROUND: Pure solid chroma-key green #00FF00 only, flat and completely shadowless from edge to edge with no ground, no floor gradient, no shadows, no scenery.

TIMING & CONTINUITY:
1) START (0.0s - 2.0s): Starts in the exact standard standing idle pose facing left, identical to dog_idle.
2) ACTION (2.0s - 7.0s): A small bone-shaped dog biscuit flies in from the front, dog catches it, chews and swallows happily, wagging its tail joyfully.
3) END (7.0s - 10.0s): Excitement calms down and the dog returns to the exact standing idle pose, holding the calm breathing idle loop until the final frame (10.0s).

CAMERA: Fixed static eye-level camera, dog centered in the middle of the frame, full body always visible. No zoom, no camera movement, no cut.
```

---

### VÍDEO 6 — `dog_sem_petisco.mp4` (Feedback Negativo / Petisco Retido - 10s)

```text
REFERENCE & CONSISTENCY: Exact same character as the reference image dog_idle.png and the previous base idle prompt. Maintain 100% consistency with the same dog: identical facial features, body proportions, fur coloring, dark floppy drop ears, white chest patch, vector art style, and clean contour line art.

CHARACTER: A friendly cartoon caramel dog (Brazilian "vira-lata caramelo" mixed breed), 2D clean vector animation illustration style with clear black contour line art and soft cell shading. Short golden-tan caramel coat, cream-white chest patch running down throat and belly, cream-white muzzle, dark chocolate-brown floppy drop ears, dark brown nose, expressive warm brown eyes. Standing athletic build, medium curved tail, no collar, no accessories. Full body standing in profile facing left at 3/4 angle.

BACKGROUND: Pure solid chroma-key green #00FF00 only, flat and completely shadowless from edge to edge with no ground, no floor gradient, no shadows, no scenery.

TIMING & CONTINUITY:
1) START (0.0s - 2.0s): Starts in the exact standard standing idle pose facing left, identical to dog_idle.
2) ACTION (2.0s - 7.0s): Dog displays a gentle disappointment expression (head tilts slightly down, sad puppy eyes, tail lowers, calm not-this-time reaction), holding the calm expression.
3) END (7.0s - 10.0s): Mood softens and dog lifts its head back up to the exact standing idle pose, holding the calm breathing idle loop until the final frame (10.0s).

CAMERA: Fixed static eye-level camera, dog centered in the middle of the frame, full body always visible. No zoom, no camera movement, no cut.
```

---

## 📁 Onde Salvar os Arquivos Gerados

Coloque os arquivos `.mp4` na pasta:
```text
public/videos/treinador/
  ├── dog_idle.mp4
  ├── dog_sentando.mp4
  ├── dog_pulando.mp4
  ├── dog_deitando.mp4
  ├── dog_recebendo_petisco.mp4
  └── dog_sem_petisco.mp4
```
*(E suba os mesmos arquivos para o seu bucket `videos/treinador/` no Supabase Storage se utilizar a URL remota).*
