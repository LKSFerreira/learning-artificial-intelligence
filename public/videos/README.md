# Vídeos estáticos (espelho do bucket)

Mesma ideia dos áudios em `public/audios/`:

| Ambiente | Onde ficam os arquivos |
| :--- | :--- |
| **Dev local** | Esta pasta (`public/videos/...`) |
| **Produção** | Bucket público Supabase com a **mesma árvore** |

## Variável de ambiente

```env
# Raiz do bucket "videos" (SEM barra no final, SEM /treinador no final)
VITE_VIDEO_BASE_URL=https://ilvwvrjixrjqldwaccgj.supabase.co/storage/v1/object/public/videos
```

O código monta:

```text
{VITE_VIDEO_BASE_URL}/treinador/dog_idle.mp4
```

URL completa de exemplo:

```text
https://ilvwvrjixrjqldwaccgj.supabase.co/storage/v1/object/public/videos/treinador/dog_idle.mp4
```

A pasta que você abriu no Storage:

```text
…/object/public/videos/treinador
```

é o diretório onde os 6 MP4 devem ser enviados.

## Árvore no bucket

```text
videos/                          ← bucket público
  treinador/                     ← pasta (já criada)
    dog_idle.mp4
    dog_sentando.mp4
    dog_pulando.mp4
    dog_deitando.mp4
    dog_recebendo_petisco.mp4
    dog_sem_petisco.mp4
```

Local (espelho):

```text
public/videos/treinador/
  dog_idle.mp4
  …
```

## Comparação com áudio

```text
audios/                 VITE_AUDIO_BASE_URL=…/public/audios
  Aoede/intro.mp3

videos/                 VITE_VIDEO_BASE_URL=…/public/videos
  treinador/dog_idle.mp4
```

## Upload

1. Storage → bucket `videos` → pasta `treinador/`
2. Subir os 6 MP4 com os **mesmos nomes** do local
3. Confirmar `.env` com a base `…/public/videos` (não `…/videos/treinador`)
4. Reiniciar o dev server após mudar env

## Fallback

Se o remoto 404, o app tenta `/videos/treinador/...` local (igual ao áudio).
