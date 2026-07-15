/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base pública dos MP3 (Supabase/R2). Vazio = `public/audios` local. */
  readonly VITE_AUDIO_BASE_URL?: string;
  /** Chave Gemini só no servidor/scripts — não use no front se for segredo. */
  readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
