# Procedimento: hospedar áudios no Cloudflare R2

> **Para quem:** você (e o agente), se um dia usar R2.  
> **Preferência atual do projeto:** **Supabase Storage** (sem assinatura/cartão no estilo R2).  
> Ver: [hospedagem_audio_supabase.md](./hospedagem_audio_supabase.md).  
> **Nível:** passo a passo, sem jargão desnecessário.

---

## 1. O que estamos resolvendo (em uma frase)

Os áudios **não ficam no repositório Git**. Ficam num “armário na internet” (R2). O app só precisa saber o **endereço do armário**.

---

## 2. Ideia simples (antes de clicar em nada)

Pense assim:

| Conceito | Analogia |
|----------|----------|
| **Bucket R2** | Um armário na nuvem |
| **Pastas `Aoede/` e `Kore/`** | Duas gavetas (duas vozes) |
| **Arquivos `intro.mp3`, `ia.mp3`…** | Cada lição é um arquivo dentro da gaveta |
| **`VITE_AUDIO_BASE_URL`** | O endereço do prédio do armário (um só) |

A regra de caminho **nunca muda**:

```text
{BASE}/{voz}/{licaoId}.mp3
```

Exemplos com a **mesma** base:

```text
https://pub-XXXX.r2.dev/Aoede/intro.mp3
https://pub-XXXX.r2.dev/Kore/intro.mp3
https://pub-XXXX.r2.dev/Aoede/hierarchy.mp3
https://pub-XXXX.r2.dev/Aoede/ia.mp3
```

Não existe uma variável de ambiente por lição. **Uma base + pastas.**

### Local vs produção

```text
DESENVOLVIMENTO (seu PC)
  VITE_AUDIO_BASE_URL = (vazio)
  App pede:  /audios/Aoede/intro.mp3
  Vite serve: public/audios/Aoede/intro.mp3

PRODUÇÃO (site no ar)
  VITE_AUDIO_BASE_URL = https://pub-XXXX.r2.dev
  App pede:  https://pub-XXXX.r2.dev/Aoede/intro.mp3
  R2 entrega o MP3
```

---

## 3. Conta e acesso ao painel

### Passo 3.1: criar conta Cloudflare

1. Abra [https://dash.cloudflare.com](https://dash.cloudflare.com).
2. Crie conta ou entre (e-mail + senha).
3. Confirme o e-mail se pedir.

Não precisa ter domínio próprio para começar (dá para usar a URL pública `*.r2.dev`).

### Passo 3.2: achar o R2 no menu

1. No painel esquerdo, procure **R2** (às vezes em “R2 Object Storage”).
2. Na primeira vez, a Cloudflare pode pedir para **habilitar o R2** (aceite o free tier).
3. Você deve ver uma tela de **Buckets** (lista de “armários”).

> Se não achar R2: use a busca do dashboard e digite `R2`.

---

## 4. Criar o bucket (o armário)

### Passo 4.1: criar

1. Clique em **Create bucket**.
2. **Bucket name:** escolha um nome simples e único, por exemplo:

```text
aprendendo-ia-audios
```

3. **Location:** deixe o padrão (ou o mais perto de você, se oferecer opção).
4. Confirme a criação.

### Passo 4.2: o que você acaba de criar

Um espaço vazio. Ainda **ninguém** da internet consegue baixar arquivo até liberarmos o acesso público (próximos passos).

---

## 5. Organizar as pastas (igual ao projeto)

No PC, os áudios locais devem seguir isto:

```text
public/
  audios/
    Aoede/
      intro.mp3
      hierarchy.mp3
      ia.mp3
      ...
    Kore/
      intro.mp3
      hierarchy.mp3
      ia.mp3
      ...
```

No R2, a estrutura deve ser **a mesma árvore**, a partir da raiz do bucket:

```text
aprendendo-ia-audios/          ← nome do bucket
  Aoede/
    intro.mp3
    hierarchy.mp3
  Kore/
    intro.mp3
    hierarchy.mp3
```

**Não** coloque uma pasta extra `audios/` no R2 se a base da URL já for o bucket público.  
Se a base for `https://pub-XXXX.r2.dev`, o caminho fica:

```text
https://pub-XXXX.r2.dev/Aoede/intro.mp3
```

(e não `.../audios/Aoede/intro.mp3`, a menos que você tenha criado a pasta `audios` de propósito).

---

## 6. Enviar os MP3 (upload)

### Opção A: pelo site (mais fácil no começo)

1. Abra o bucket `aprendendo-ia-audios`.
2. Clique em **Upload**.
3. Crie/entre na pasta `Aoede` (se o painel permitir “Create folder”, use; senão, o caminho do arquivo pode incluir o prefixo).
4. Envie todos os MP3 da voz Aoede.
5. Repita para a pasta `Kore`.

Dica: envie **poucos arquivos primeiro** (ex.: só `intro.mp3` nas duas vozes) para testar antes de subir tudo.

### Opção B: com linha de comando (depois, em lote)

Quando já estiver confortável, a Cloudflare tem **Wrangler** (CLI) para upload em massa. Não é obrigatório no primeiro dia. Guarde a ideia:

```text
Instalar Wrangler → autenticar → wrangler r2 object put ...
```

Para o primeiro teste, o upload pelo dashboard basta.

---

## 7. Tornar os arquivos públicos (leitura)

O player no navegador precisa **abrir o MP3 sem login**.

### Passo 7.1: acesso público no bucket

1. No bucket, abra **Settings**.
2. Procure algo como **Public access** / **R2.dev subdomain** / **Allow Access**.
3. Ative o acesso público de leitura (só leitura de objetos; ninguém “escreve” no seu bucket por isso).
4. A Cloudflare mostra uma URL do tipo:

```text
https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
```

5. **Copie essa URL** e guarde. Ela é o valor de `VITE_AUDIO_BASE_URL`.

> **Importante:** cole **sem** barra no final.  
> Certo: `https://pub-xxxx.r2.dev`  
> Errado: `https://pub-xxxx.r2.dev/`

### Passo 7.2: testar no navegador

Abra numa aba (troque pelos seus nomes reais):

```text
https://pub-XXXX.r2.dev/Aoede/intro.mp3
```

- Se o áudio **baixar ou tocar**, o público está ok.  
- Se der **404**, o caminho da pasta/arquivo está diferente.  
- Se der **Access Denied**, o público ainda não está liberado.

---

## 8. CORS (para o app não bloquear o áudio)

O site roda num domínio (ex.: `localhost:3000` ou o host do front). O áudio em outro domínio (`r2.dev`). O navegador exige **CORS**.

### Passo 8.1: onde configurar

No bucket R2 → **Settings** → procure **CORS Policy**.

### Passo 8.2: política simples para começar

Você pode colar uma política parecida com esta (ajuste os domínios quando tiver o site no ar):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

Quando o site estiver em produção, **adicione** a origem real, por exemplo:

```text
https://seu-app.pages.dev
https://seudominio.com
```

**GET** e **HEAD** bastam: o player usa `HEAD` para ver se o arquivo existe e `GET` para tocar.

---

## 9. Configurar o projeto (arquivo `.env`)

### Passo 9.1: criar o `.env` local

Na raiz do repositório:

```powershell
copy .env.example .env
```

### Passo 9.2: preencher só o que importa para áudio

No `.env`:

```env
# Deixe vazio no dia a dia se for testar só com public/audios/
# VITE_AUDIO_BASE_URL=

# Ou, para forçar o app a puxar do R2 mesmo em dev:
VITE_AUDIO_BASE_URL=https://pub-XXXX.r2.dev
```

Troque `XXXX` pela URL real que o painel mostrou.

### Passo 9.3: reiniciar o dev server

O Vite só lê `.env` na subida:

```powershell
# pare o servidor (Ctrl+C) e suba de novo
npm run dev
```

### Passo 9.4: produção

No serviço que faz o build/deploy do front (Cloudflare Pages, Vercel, etc.), cadastre a **mesma** variável:

```text
Nome:  VITE_AUDIO_BASE_URL
Valor: https://pub-XXXX.r2.dev
```

(Sem isso, o build de produção continua apontando para `/audios/...` no próprio host do site, onde os MP3 **não** estarão.)

---

## 10. Ligação com o código (quando estiver implementado)

Hoje a convenção no código é:

```text
/audios/{voz}/{licaoId}.mp3
```

Com a base configurada, a ideia é:

```text
{VITE_AUDIO_BASE_URL}/{voz}/{licaoId}.mp3
```

Se a env estiver **vazia** → usa o caminho local `/audios/...` (dev).

> Se o `gerenciadorAudio.ts` ainda não ler a env, este procedimento ainda vale: você já sobe os arquivos e a URL. O app “enxerga” a base depois do pequeno ajuste no código.

---

## 11. Fluxo do dia a dia (depois que estiver tudo no ar)

```text
1. Escreve / revisa a lição .md (id estável: intro, hierarchy, ia...)
2. Gera o MP3 no PC:
     node tools/sintetizar-ids.js hierarchy ia ml dl
     (ou o menu em sintetizar/)
3. Confere local:
     public/audios/Aoede/hierarchy.mp3
     public/audios/Kore/hierarchy.mp3
4. Sobe esses arquivos no R2 (mesmas pastas Aoede/ e Kore/)
5. NÃO commita os MP3 no Git
6. Testa no site:
     player da lição deve tocar a partir do CDN
```

### O que vai no Git

| Vai | Não vai |
|-----|---------|
| Código, markdown, `.env.example` | Arquivo `.env` |
| Este procedimento | Pasta cheia de `.mp3` |
| Scripts de síntese | Chaves de API |

---

## 12. Checklist “funcionou?”

Marque na ordem:

- [ ] Bucket R2 criado  
- [ ] Pastas `Aoede/` e `Kore/` com pelo menos um MP3 de teste  
- [ ] Acesso público ligado; URL `https://pub-....r2.dev` copiada  
- [ ] Abrir `.../Aoede/intro.mp3` no navegador funciona  
- [ ] CORS com `localhost:3000` e métodos GET + HEAD  
- [ ] `.env` com `VITE_AUDIO_BASE_URL` (ou vazio para testar só local)  
- [ ] `npm run dev` reiniciado  
- [ ] Player da lição toca (ou mostra “indisponível” só se o arquivo realmente não existir no bucket)

---

## 13. Problemas comuns (e o que fazer)

### “404 Not Found” no MP3

- Nome da pasta errado (`aoede` ≠ `Aoede` — **maiúsculas importam**).  
- Nome do arquivo errado (`intro.mp3` vs `Intro.mp3`).  
- Você colocou `audios/Aoede/...` no bucket mas a URL não tem `/audios`.

### “Access Denied” / bloqueio

- Público do bucket ainda desligado.  
- CORS não inclui a origem do app.

### Player diz que o áudio não existe

- O app está em **local** com base vazia, mas o arquivo não está em `public/audios/`.  
- Ou a base aponta para o R2, mas você ainda não fez upload daquele `licaoId`.

### O áudio toca na URL direta, mas não no site

- Quase sempre **CORS** (falta GET/HEAD ou origem).

### Medo de expor a URL

- A base com prefixo `VITE_` **aparece no front** de propósito.  
- Isso é o endereço público dos MP3, **não** a senha da Cloudflare.  
- A chave da API Gemini (`GEMINI_API_KEY`) é que é segredo (sem `VITE_`).

---

## 14. Ordem de magnitude de espaço (para ficar calmo)

Com o currículo atual (~23 lições de conteúdo × 2 vozes × ~6 MB):

```text
≈ 46 arquivos × 6 MB ≈ 276 MB
```

No free do R2 (ordem de ~10 GB), isso cabe com folga mesmo com B4/B5 no futuro.

---

## 15. Mapa mental do procedimento

```text
[1] Conta Cloudflare
        ↓
[2] Criar bucket R2
        ↓
[3] Upload Aoede/ e Kore/ (mesma árvore do public/audios)
        ↓
[4] Liberar leitura pública → copiar URL pub-XXXX.r2.dev
        ↓
[5] Configurar CORS (localhost + domínio do site)
        ↓
[6] .env → VITE_AUDIO_BASE_URL=https://pub-XXXX.r2.dev
        ↓
[7] Reiniciar app / configurar env no deploy
        ↓
[8] Testar player na lição
```

---

## 16. Referências no repositório

| Arquivo | Papel |
|---------|--------|
| `.env.example` | Nomes e significado das variáveis |
| `docs/padrao_layout_licao.md` | Onde o áudio entra na lição (ordem da UI) |
| `src/servicos/audio/gerenciadorAudio.ts` | Montagem do caminho do MP3 |
| `sintetizar/` e `tools/sintetizar-ids.js` | Gerar MP3 no PC |
| Este arquivo | Como colocar o MP3 no R2 |

---

> **Lembrete final:** gere áudio **depois** de fechar o texto da lição. Upload no R2. Git fica leve. O site só aponta para o armário certo.
