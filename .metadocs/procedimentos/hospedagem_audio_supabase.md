# Procedimento: hospedar áudios no Supabase Storage

| Campo | Valor |
|--------|--------|
| **Para quem** | Você e o agente, ao tirar MP3 do Git |
| **Plataforma** | Supabase Storage (free) |
| **Por que não R2 agora** | R2 pede “assinatura”/cartão mesmo com US$ 0 |
| **Alternativa (depois)** | [hospedagem_audio_r2.md](./hospedagem_audio_r2.md) |
| **Estilo** | Passo a passo + tabelas |

---

## 1. O que estamos resolvendo

| Antes (problema) | Depois (solução) |
|------------------|------------------|
| MP3 no repositório Git | MP3 no **bucket** Supabase |
| Clone/push pesados | Git só com código e markdown |
| App sem lugar para o áudio | App com **uma** URL base no `.env` |

**Em uma frase:** o armário dos áudios fica no Supabase; o app só sabe o endereço do armário.

---

## 2. Conceitos (analogia)

| Conceito no Supabase | Analogia | No nosso projeto |
|----------------------|----------|------------------|
| **Projeto** | Casa / conta do app | `learning-artificial-intelligence` |
| **Bucket** | Armário | Nome: `audios` |
| **Pasta `Aoede/`** | Gaveta voz 1 | Narradora Aoede |
| **Pasta `Kore/`** | Gaveta voz 2 | Narradora Kore |
| **Arquivo `intro.mp3`** | Uma lição | `id` do frontmatter da lição |
| **`VITE_AUDIO_BASE_URL`** | Endereço do prédio | **Uma** base para todos os MP3 |

### Regra de caminho (nunca muda)

| Parte | Significado | Exemplos |
|-------|-------------|----------|
| `{BASE}` | URL pública do bucket | ver seção 8 |
| `{voz}` | Pasta da voz | `Aoede`, `Kore` |
| `{licaoId}` | `id` da lição | `intro`, `hierarchy`, `ia`, `ml`, `dl` |

```text
{BASE}/{voz}/{licaoId}.mp3
```

### Exemplos com a **mesma** base

| URL completa (exemplo) | O que é |
|------------------------|---------|
| `…/public/audios/Aoede/intro.mp3` | Intro, voz Aoede |
| `…/public/audios/Kore/intro.mp3` | Intro, voz Kore |
| `…/public/audios/Aoede/hierarchy.mp3` | Hierarchy, Aoede |
| `…/public/audios/Aoede/ia.mp3` | Subconteúdo IA, Aoede |

**Não** existe uma env por lição. Uma base; só o final do caminho muda.

### Local vs produção

| Ambiente | `VITE_AUDIO_BASE_URL` | De onde o app puxa o MP3 |
|----------|----------------------|---------------------------|
| **Dev (PC)** | Vazio | `/audios/...` → pasta `public/audios/` |
| **Produção** | URL do Supabase (seção 8) | CDN/Storage do Supabase |

---

## 3. Conta e criação do projeto

### 3.1 Conta

| Passo | Ação |
|-------|------|
| 1 | Abra [https://supabase.com](https://supabase.com) |
| 2 | **Start your project** / **Sign up** |
| 3 | GitHub ou e-mail |
| 4 | Confirme o e-mail se pedir |

### 3.2 Tela **Create a new project** (preencher assim)

Use esta tabela como “gabarito” da tela de criação:

| Campo na tela | O que colocar / marcar | Por quê |
|---------------|------------------------|---------|
| **Organization** | Sua org Free (ex.: LKSFerreira) | Plano free |
| **GitHub (optional)** | Opcional; pode pular | Não é obrigatório para áudio |
| **Project name** | `learning-artificial-intelligence` | Nome do app |
| **Database password** | Senha forte + **anotar em lugar seguro** | Quase não usa só para Storage; ainda assim é a senha do Postgres |
| **Region** | **Americas** (ou a mais perto dos alunos) | Menor latência |
| **Postgres Type** | **Postgres** (Default) | Recomendado; não use OrioleDB em produção |
| **Enable Data API** | **Ligado (ON)** | API REST padrão; útil se um dia usar `supabase-js` |
| **Automatically expose new tables** | **Desligado (OFF)** | Controle manual de acesso; recomendado pelo próprio Supabase |
| **Enable automatic RLS** | **Ligado (ON)** | Cinto de segurança: novas tabelas no `public` já nascem com RLS |
| **Advanced** | Não mudar (fixos fixos após criar) | — |

#### O que é cada opção de Security (resumo)

| Opção | O que faz | Para o nosso áudio agora |
|-------|-----------|---------------------------|
| **Data API** | Gera API REST do schema | Pode ficar ON; não atrapalha |
| **Auto-expose new tables** | Expõe tabelas novas automaticamente | **OFF** — evita abrir tabela sem querer |
| **Automatic RLS** | Liga Row Level Security em tabelas novas | **ON** — protege o **banco** no futuro |

| Atenção | Detalhe |
|---------|---------|
| RLS **não é** a config do Storage de MP3 | RLS = regras de **tabelas** Postgres |
| Leitura pública dos MP3 | Se configura **depois**, no **Storage** (bucket público + policy de leitura) |
| Senha do banco | Não vai no front nem no `VITE_*` |

### 3.3 Depois de clicar em Create

| Passo | Ação |
|-------|------|
| 1 | Aguarde o projeto provisionar (pode levar alguns minutos) |
| 2 | Entre no projeto quando o status estiver pronto |
| 3 | Siga a seção 4 (Storage) |

---

## 4. Abrir o Storage

| Passo | Ação |
|-------|------|
| 1 | Menu esquerdo → **Storage** |
| 2 | Ver a lista de **Buckets** (pode estar vazia) |

---

## 5. Criar o bucket `audios`

### 5.1 Tela **Create file bucket** (gabarito)

| Campo na tela | Valor recomendado | Por quê |
|---------------|-------------------|---------|
| **Bucket name** | `audios` (exato; **não muda** depois) | Bate com a URL `.../public/audios/...` e com o resto deste guia |
| **Public bucket** | **ON** (Allow anyone to read objects without authorization) | O player precisa **ler** o MP3 **sem login** do aluno |
| **Restrict file size** | **ON** → limite **15 MB** ou **20 MB** por arquivo | Narração costuma ~6 MB; evita upload acidental de arquivo gigante |
| **Restrict MIME types** | **ON** → listar **os dois**: `audio/mpeg` **e** `audio/mp3` | Só entra áudio/MP3; o Windows/navegador às vezes manda um, às vezes o outro |
| Botão final | **Create** | — |

> Se o painel só deixar ligar size/MIME **depois** de criar: crie com **nome `audios` + Public ON**, abra o bucket → **Configuration / Settings** e ative as restrições. O essencial para o player é nome + público.

### 5.2 O que cada opção significa

| Opção | O que faz | No nosso caso |
|-------|-----------|----------------|
| **Public bucket** | Qualquer um com o **link** pode baixar/ouvir | Correto para lição pública (como vídeo no YouTube) |
| Aviso *“Public buckets are not protected”* | Leitura sem autorização | Esperado; não é bug |
| **RLS ainda vale para upload/delete** | Escrever/apagar **não** fica aberto só por ser public | Upload só com você logado no dashboard (ou service role depois) |
| **Restrict file size** | Bloqueia arquivo acima do limite | **15–20 MB** por MP3 é folga segura |
| **Restrict MIME types** | Só tipos listados no upload | **`audio/mpeg` e `audio/mp3`** (ambos = MP3 na prática) |

| Permitir ao público | Não permitir ao público |
|---------------------|-------------------------|
| **Ler** objetos (GET do MP3) | **Upload / delete** abertos na internet |

### 5.3 De onde pego a URL? (só o que você cola no `.env`)

**Ideia simples:** o app precisa de **uma** linha — o “endereço do armário”, não de cada MP3.

Você **não** precisa saber o que é `PROJECT_REF`, nem montar a URL de cabeça.  
Siga **um** dos jeitos abaixo (recomendo o **Jeito A** se já subiu um MP3; se ainda não subiu, use o **Jeito B**).

---

#### Jeito A — copiar do arquivo no Storage (mais fácil)

**Quando usar:** depois das seções 6 e 7 (pastas + pelo menos `Aoede/intro.mp3` no bucket).

| # | Onde | O que fazer |
|---|------|-------------|
| 1 | Menu esquerdo do projeto | Clique em **Storage** |
| 2 | Lista de buckets | Clique no bucket **`audios`** |
| 3 | Dentro do bucket | Abra a pasta **`Aoede`** |
| 4 | Lista de arquivos | Clique no arquivo **`intro.mp3`** (ou use o menu **⋯** ao lado dele) |
| 5 | Painel / menu do arquivo | Clique em **Get URL**, **Copy URL**, **Public URL** ou **Copy public URL** (o nome muda um pouco no painel) |
| 6 | Bloco de notas | Cole o que copiou |

O que o Supabase cola parece com isto (o trecho do meio é **do seu** projeto, não copie o exemplo literal):

```text
https://abcdefghijklmnop.supabase.co/storage/v1/object/public/audios/Aoede/intro.mp3
```

**Agora corte o final** — o `.env` não quer o arquivo, só o armário:

| | Texto |
|--|--------|
| Você copiou | `https://….supabase.co/storage/v1/object/public/audios/Aoede/intro.mp3` |
| **Apague do final** | `/Aoede/intro.mp3` |
| **O que sobra** (vai no `.env`) | `https://….supabase.co/storage/v1/object/public/audios` |

| Certo no `.env` | Errado |
|-----------------|--------|
| Termina em `.../public/audios` | Termina em `.../Aoede/intro.mp3` |
| Sem `/` no final | `.../audios/` |

No `.env`:

```env
VITE_AUDIO_BASE_URL=https://abcdefghijklmnop.supabase.co/storage/v1/object/public/audios
```

(use o host **que o painel te deu**, não o de exemplo)

**Teste:** no navegador, abra a base + `/Aoede/intro.mp3`. Se o áudio tocar ou baixar, a base está certa.

---

#### Jeito B — copiar o Project URL (ainda sem arquivo no bucket)

**Quando usar:** bucket `audios` já existe, mas você ainda não subiu MP3 (ou não achou “Copy URL”).

| # | Onde | O que fazer |
|---|------|-------------|
| 1 | Dashboard do **seu** projeto (já aberto) | Confirme que o nome do projeto aparece no topo |
| 2 | Menu esquerdo | Clique no ícone de **engrenagem** (em baixo, em geral) → **Project Settings** |
| 3 | Menu interno de Settings | Clique em **API** (em algumas contas: **Data API**) |
| 4 | Na página API | Ache o campo **Project URL** (às vezes só **URL**) |
| 5 | Ao lado do campo | Clique em **Copy** / ícone de copiar |
| 6 | Bloco de notas | Cole. Deve ficar **só** algo assim: |

```text
https://abcdefghijklmnop.supabase.co
```

| O que é isso? | |
|---------------|--|
| É o endereço do **seu** projeto Supabase | Gerado quando você criou o projeto |
| Você **não** digita o código do meio à mão | Só copia o Project URL |
| Não é a senha do banco | Pode colar no front; é público |

**Próximo passo:** no **mesmo** bloco de notas, **sem apagar** o que colou e **sem espaço**, acrescente **exatamente** isto no final:

```text
/storage/v1/object/public/audios
```

| Etapa | Resultado |
|-------|-----------|
| Só o painel | `https://abcdefghijklmnop.supabase.co` |
| + texto fixo | `https://abcdefghijklmnop.supabase.co/storage/v1/object/public/audios` |
| Isso é | o valor de `VITE_AUDIO_BASE_URL` |

| De onde veio cada pedaço | |
|--------------------------|--|
| `https://….supabase.co` | **Você copiou** em Project Settings → API → Project URL |
| `/storage/v1/object/public/` | **Texto fixo** do Supabase (cole de cima; não invente) |
| `audios` | Nome do **bucket** que você criou na seção 5.1 |

No `.env`:

```env
VITE_AUDIO_BASE_URL=https://abcdefghijklmnop.supabase.co/storage/v1/object/public/audios
```

---

#### O que **não** precisa achar em lugar nenhum

| Coisa confusa | Realidade |
|---------------|-----------|
| “Código do projeto / `SEU_PROJECT_REF`” | É só o trecho no meio da URL (`….supabase.co`). **Não busque** esse nome sozinho: copie o **Project URL** inteiro (Jeito B) ou a **Public URL** do arquivo (Jeito A). |
| Pasta `public` dentro do bucket | **Não existe.** A palavra `public` é da URL da API; no Storage você só cria `Aoede` e `Kore`. |
| Uma URL no `.env` por lição | **Não.** Uma base; o app monta `/Aoede/ia.mp3`, etc. |
| Host de exemplo desta página | Troque pelo **seu** `https://….supabase.co` copiado do painel |

#### Ordem sugerida no procedimento

| Você está em… | O que fazer com a 5.3 |
|---------------|------------------------|
| Acabou de criar o bucket | **Pule** a 5.3 → seções 6 e 7 (pastas + upload) → volte e use **Jeito A** |
| Já tem `intro.mp3` no Storage | **Jeito A** agora |
| Quer configurar o `.env` antes do upload | **Jeito B** agora; teste a URL completa depois do upload |

---

## 6. Pastas das vozes

| Passo | Ação |
|-------|------|
| 1 | Abrir bucket **audios** |
| 2 | Criar pasta `Aoede` |
| 3 | Criar pasta `Kore` |

| Estrutura no bucket | Conteúdo |
|---------------------|----------|
| `audios/Aoede/` | Todos os MP3 da voz Aoede |
| `audios/Kore/` | Todos os MP3 da voz Kore |

| Cuidado | Motivo |
|--------|--------|
| `Aoede` ≠ `aoede` | Maiúsculas importam na URL |
| Não inventar pasta `public` no meio do bucket | A palavra `public` já está na **URL da API**, não como pasta sua |

---

## 7. Upload dos MP3

### No PC (antes de subir)

| Local no disco | Papel |
|----------------|--------|
| `public/audios/Aoede/*.mp3` | Gerados localmente (dev) |
| `public/audios/Kore/*.mp3` | Idem |

| Comando (exemplo) | Efeito |
|--------------------|--------|
| `node tools/sintetizar-ids.js intro hierarchy ia ml dl` | Gera MP3 por `id` de lição |
| Menu em `sintetizar/` | Mesma ideia, interativo |

### No Supabase

| Passo | Ação |
|-------|------|
| 1 | Storage → bucket **audios** → pasta **Aoede** |
| 2 | **Upload** dos MP3 da Aoede |
| 3 | Pasta **Kore** → upload dos MP3 da Kore |

### Teste mínimo (primeiro dia)

| Arquivo | Por quê |
|---------|---------|
| `Aoede/intro.mp3` | Valida caminho + público |
| `Kore/intro.mp3` | Valida segunda voz |

Se esses dois tocarem na URL do navegador, a base está certa. Depois sobe o restante.

---

## 8. Colocar a base no `.env` e testar

A base é a da **seção 5.3** (Jeito A: copiar URL do arquivo e cortar; ou Jeito B: Project Settings → API).

| Passo | Ação |
|-------|------|
| 1 | Obtenha a base (5.3): deve terminar em `.../public/audios` **sem** `/` no fim |
| 2 | No `.env`: `VITE_AUDIO_BASE_URL=` + cole a base |
| 3 | No navegador abra: base + `/Aoede/intro.mp3` (arquivo que você já subiu) |

| Exemplo de linha no `.env` | |
|----------------------------|--|
| `VITE_AUDIO_BASE_URL=https://xyzempresa1234.supabase.co/storage/v1/object/public/audios` | Uma linha só |

| Regra | Certo | Errado |
|-------|-------|--------|
| Barra no final da base | Sem `/` no fim | `.../audios/` |
| Uma base para todos os MP3 | Sim | Uma env por lição |
| URL do arquivo no `.env` | Não | Não cole `.../Aoede/intro.mp3` na env |

| Resultado no navegador | Significado |
|------------------------|-------------|
| Áudio toca ou baixa | Público OK + caminho OK |
| **404** | Pasta, nome do arquivo ou base errada |
| **403** | Bucket não público ou policy de leitura faltando |

---

## 9. Policies de Storage (se der 403)

| Passo | Ação |
|-------|------|
| 1 | Storage → **Policies** (ou config do bucket) |
| 2 | Garantir **leitura (SELECT)** pública no bucket `audios` |
| 3 | Se existir template **Allow public read access**, usar |

| Permitir para o público | Não permitir para o público |
|-------------------------|-----------------------------|
| **SELECT** / leitura dos objetos | **INSERT** / **UPDATE** / **DELETE** (upload aberto) |

| RLS automático (na criação do projeto) | Policy do Storage |
|----------------------------------------|-------------------|
| Protege **tabelas** Postgres novas | Protege **arquivos** do bucket |
| Já configuramos **ON** na seção 3.2 | Ajustar se o MP3 não abrir |

---

## 10. CORS (site não toca, URL direta toca)

| Situação | O que fazer |
|----------|-------------|
| MP3 abre na aba do browser, player do app falha | Conferir CORS e `VITE_AUDIO_BASE_URL` |

| Origem a liberar (dev) | Origem a liberar (prod) |
|------------------------|-------------------------|
| `http://localhost:3000` | Domínio real do site (ex.: Pages/Vercel) |
| `http://127.0.0.1:3000` | — |

| Método | Usado pelo player |
|--------|-------------------|
| `GET` | Baixar / tocar o MP3 |
| `HEAD` | Verificar se o arquivo existe |

---

## 11. Arquivo `.env` do repositório

| Passo | Comando / ação |
|-------|----------------|
| 1 | `copy .env.example .env` (Windows) |
| 2 | Editar `.env` |
| 3 | Reiniciar `npm run dev` |

### Conteúdo relevante

| Variável | Exemplo / valor | Segredo? | No front (`VITE_`)? |
|----------|-----------------|----------|---------------------|
| `GEMINI_API_KEY` | chave da API Google | **Sim** | Não |
| `VITE_AUDIO_BASE_URL` | `https://REF.supabase.co/storage/v1/object/public/audios` | **Não** (URL pública) | **Sim** (normal) |

| Dev | Produção (painel do host do site) |
|-----|-----------------------------------|
| Pode deixar `VITE_AUDIO_BASE_URL` vazio para usar `public/audios` | Cadastrar a **mesma** `VITE_AUDIO_BASE_URL` no deploy |

---

## 12. Rotina do dia a dia

| # | Ação | Detalhe |
|---|------|---------|
| 1 | Fechar texto da lição | `id` estável no frontmatter |
| 2 | Gerar MP3 no PC | `sintetizar` ou `tools/sintetizar-ids.js` |
| 3 | Testar local (opcional) | `public/audios/{voz}/{id}.mp3` |
| 4 | Upload no Supabase | Storage → `audios` → `Aoede` / `Kore` |
| 5 | Não commitar MP3 | Git fica leve |
| 6 | Testar no app | Player da lição |

### O que vai no Git

| Vai | Não vai |
|-----|---------|
| Código, markdown, docs | `.env` com chaves |
| `.env.example` | Pasta cheia de `.mp3` |
| Este procedimento | Senha do Postgres Supabase |

---

## 13. Checklist final

| # | Item | Feito? |
|---|------|--------|
| 1 | Projeto free criado (tabela 3.2) | [ ] |
| 2 | Auto-expose tables **OFF**, automatic RLS **ON** | [ ] |
| 3 | Bucket `audios` criado (nome fixo) | [ ] |
| 4 | Public bucket **ON** | [ ] |
| 5 | Restrict file size **ON** (~15–20 MB) | [ ] |
| 6 | Restrict MIME types **ON** (`audio/mpeg` **e** `audio/mp3`) | [ ] |
| 7 | Pastas `Aoede` e `Kore` | [ ] |
| 8 | Pelo menos `intro.mp3` em cada pasta | [ ] |
| 9 | URL `{BASE}/Aoede/intro.mp3` toca no navegador | [ ] |
| 10 | `.env` com `VITE_AUDIO_BASE_URL` (ou vazio no dev local) | [ ] |
| 11 | `npm run dev` reiniciado | [ ] |
| 12 | Player da lição encontra o áudio | [ ] |

---

## 14. Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---------|----------------|-------------|
| **“formato não permitido” / MIME not allowed** no upload | Só `audio/mp3` (ou só um tipo) na lista | Bucket → **Configuration** → Allowed MIME types: incluir **`audio/mpeg` e `audio/mp3`**. Se continuar bloqueando, **desligue** Restrict MIME por um momento, suba, e reative com os dois |
| **404** | Caminho/nome errado | Conferir bucket `audios`, `Aoede`/`Kore`, `{id}.mp3` |
| **403** | Não público / sem policy de leitura | Public bucket + policy SELECT para anon |
| Toca na aba, não no app | CORS ou env | CORS + reiniciar Vite + checar `VITE_AUDIO_BASE_URL` |
| Player “indisponível” | Arquivo não existe na base em uso | Upload faltando ou base vazia (modo local) |
| Medo de “expor URL” | `VITE_` no front | Esperado; é URL pública de arquivo, não senha |
| Projeto free pausado | Inatividade | Reativar no dashboard |

---

## 15. Espaço estimado

| Cenário | Arquivos (2 vozes) | ≈ Tamanho (6 MB cada) |
|---------|-------------------|------------------------|
| Currículo atual (~23 contents) | ~46 | **~276 MB** |
| Só bloco 02 (hierarchy+ia+ml+dl) | 8 | **~48 MB** |
| + B4/B5 (estimativa) | ~70–80 | **&lt; 0,5 GB** |

Cabe no free típico de storage do Supabase com folga no curto/médio prazo.

---

## 16. Mapa do fluxo (tabela)

| Ordem | Etapa |
|-------|--------|
| 1 | Conta + projeto free (gabarito 3.2) |
| 2 | Storage → Create bucket `audios` (gabarito 5.1: public + size + MIME) |
| 3 | Pastas `Aoede` e `Kore` |
| 4 | Upload dos MP3 |
| 5 | Testar URL no navegador |
| 6 | `.env` → `VITE_AUDIO_BASE_URL` |
| 7 | Reiniciar app / env no deploy |
| 8 | Player da lição toca o Storage |

---

## 17. Referências no repositório

| Arquivo | Papel |
|---------|--------|
| `.env.example` | Nomes das variáveis; **uma** base de áudio |
| `docs/padrao_layout_licao.md` | Onde o áudio entra na UI |
| `src/servicos/audio/gerenciadorAudio.ts` | Montagem do caminho do MP3 |
| `sintetizar/` e `tools/sintetizar-ids.js` | Gerar MP3 no PC |
| [hospedagem_audio_r2.md](./hospedagem_audio_r2.md) | Alternativa Cloudflare (assinatura R2) |
| **Este arquivo** | Procedimento oficial preferido: Supabase |

---

| Resumo | |
|--------|--|
| **Onde** | Supabase Storage, bucket `audios` |
| **Como** | Pastas `Aoede` / `Kore` + `{id}.mp3` |
| **Env** | Uma `VITE_AUDIO_BASE_URL` (sem sobrescrever lição a lição) |
| **RLS na criação** | **ON** (tabelas futuras); Storage público só para **ler** MP3 |
| **Git** | Sem MP3; sem `.env` real |
