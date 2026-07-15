import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Loader2, 
  AlertCircle,
  Download,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { obterVozes, obterCandidatosUrlAudio } from '../../servicos/audio/gerenciadorAudio';

interface PropriedadesPlayerAudio {
  /** ID único da lição (ex: "intro") */
  licaoId: string;
  /** ID da fase atual (opcional, para legado) */
  faseId?: string | number;
  /** Índice do passo atual na fase (opcional, para legado) */
  passoIndice?: number;
  /** Texto (legado para compatibilidade) */
  texto?: string;
  /** Título (legado para compatibilidade) */
  titulo?: string;
}

// Constantes de Configuração de Velocidade (Clean Code - Sem números mágicos)
const VELOCIDADE_MINIMA = 0.80;
const VELOCIDADE_MAXIMA = 3.0;
const PASSO_VELOCIDADE = 0.20;
const VELOCIDADE_PADRAO = 1.0;

export function PlayerAudioIA({ licaoId, faseId, passoIndice, titulo }: PropriedadesPlayerAudio) {
  // Lista de vozes estáticas
  const vozesDisponiveis = obterVozes();

  // Estado da Voz (persiste no localStorage)
  const [voz, setVoz] = useState<string>(() => {
    const salva = localStorage.getItem('aprendendo-ia:audio:voz-estatica');
    return salva && vozesDisponiveis.some(v => v.id === salva) ? salva : 'Aoede';
  });

  // Configurações de Reprodução
  const [velocidade, setVelocidade] = useState<number>(VELOCIDADE_PADRAO);
  const [muted, setMuted] = useState<boolean>(false);
  const [volume] = useState<number>(0.8);
  const [progresso, setProgresso] = useState<number>(0);
  const [tempoAtual, setTempoAtual] = useState<number>(0);
  const [duracao, setDuracao] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string>('');

  // Estados de Interface
  const [tocando, setTocando] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [disponivel, setDisponivel] = useState<boolean | null>(null);

  // Estados de Controle de Menus Popover
  const [vozesAberto, setVozesAberto] = useState<boolean>(false);

  // Referências para o elemento de áudio e menus
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuVozesRef = useRef<HTMLDivElement | null>(null);

  // Efeito para fechar popover se clicar fora dele
  useEffect(() => {
    function tratarCliqueFora(event: MouseEvent) {
      const target = event.target as Node;
      if (menuVozesRef.current && !menuVozesRef.current.contains(target)) {
        setVozesAberto(false);
      }
    }
    document.addEventListener('mousedown', tratarCliqueFora);
    return () => document.removeEventListener('mousedown', tratarCliqueFora);
  }, []);

  // Atualiza a URL do áudio sempre que o licaoId ou voz muda e verifica se o arquivo existe
  // (CDN/Supabase primeiro; se faltar, tenta public/audios local)
  useEffect(() => {
    let cancelado = false;

    pararAudio();
    setErro(null);
    setDisponivel(null);
    setAudioUrl('');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const candidatos = obterCandidatosUrlAudio(licaoId, voz);

    async function resolverUrlDisponivel() {
      for (const url of candidatos) {
        try {
          const resposta = await fetch(url, { method: 'HEAD' });
          if (cancelado) {
            return;
          }
          if (resposta.ok) {
            setAudioUrl(url);
            setDisponivel(true);
            return;
          }
        } catch {
          // tenta o próximo candidato (ex.: remoto falhou, sobra local)
        }
      }

      if (cancelado) {
        return;
      }
      setDisponivel(false);
      setErro('Áudio indisponível para esta lição (não gerado).');
    }

    void resolverUrlDisponivel();

    return () => {
      cancelado = true;
    };
  }, [licaoId, voz]);

  // Persiste a voz selecionada
  useEffect(() => {
    localStorage.setItem('aprendendo-ia:audio:voz-estatica', voz);
  }, [voz]);

  // Sincroniza velocidade com o elemento de áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = velocidade;
    }
  }, [velocidade]);

  // Formata o tempo em segundos para mm:ss
  const formatarTempo = (segundos: number): string => {
    if (isNaN(segundos) || !isFinite(segundos)) return '00:00';
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const pararAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setTocando(false);
    setProgresso(0);
    setTempoAtual(0);
  };

  const alternarReproducao = async () => {
    if (tocando && audioRef.current) {
      audioRef.current.pause();
      setTocando(false);
      return;
    }

    if (audioRef.current && !audioRef.current.ended && progresso > 0) {
      try {
        await audioRef.current.play();
        setTocando(true);
        setErro(null);
      } catch (err) {
        setErro('Erro ao reproduzir o áudio pausado.');
      }
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const novoAudio = new Audio(audioUrl);
      novoAudio.playbackRate = velocidade;
      novoAudio.volume = volume;
      novoAudio.muted = muted;

      novoAudio.addEventListener('loadedmetadata', () => {
        setDuracao(novoAudio.duration || 0);
        setCarregando(false);
        setErro(null);
      });

      novoAudio.addEventListener('timeupdate', () => {
        setTempoAtual(novoAudio.currentTime);
        if (novoAudio.duration) {
          setProgresso((novoAudio.currentTime / novoAudio.duration) * 100);
          setDuracao(novoAudio.duration);
        }
      });

      novoAudio.addEventListener('ended', () => {
        setTocando(false);
        setProgresso(0);
        setTempoAtual(0);
      });

      novoAudio.addEventListener('error', () => {
        setErro('Áudio indisponível para esta lição (não gerado).');
        setTocando(false);
        setCarregando(false);
        audioRef.current = null;
      });

      audioRef.current = novoAudio;
      novoAudio.load();
      await novoAudio.play();
      setTocando(true);
    } catch (err) {
      setErro('Áudio indisponível para esta lição (não gerado).');
      setTocando(false);
      setCarregando(false);
      audioRef.current = null;
    }
  };

  const handleDownload = () => {
    if (!audioUrl || disponivel !== true) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    const nomeAmigavel = (faseId !== undefined && passoIndice !== undefined) 
      ? `Fase ${faseId} - Passo ${passoIndice + 1} (${voz}).mp3`
      : `${licaoId}_${voz}.mp3`;
    link.download = nomeAmigavel;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full backdrop-blur-xl bg-slate-950/70 border border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-3xl p-5 mb-6 relative transition-all duration-300 hover:border-slate-800 text-white flex flex-col gap-4">
      
      {/* Efeito Glow Sutil no Topo */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-20 w-full">
        
        {/* Esquerda: Info & Waveform de Status */}
        <div className="flex items-center gap-3 w-full md:w-[30%] min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-indigo-950/40 flex items-center justify-center border border-indigo-900/50 shadow-inner shrink-0 relative overflow-hidden group">
            {carregando ? (
              <Loader2 size={18} className="animate-spin text-indigo-400" />
            ) : tocando ? (
              <div className="flex items-end gap-[3px] h-3.5 w-4.5 overflow-hidden">
                <span className="w-[2.5px] bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full animate-[bounce_0.8s_infinite] h-2.5"></span>
                <span className="w-[2.5px] bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full animate-[bounce_0.5s_infinite] h-3.5"></span>
                <span className="w-[2.5px] bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full animate-[bounce_0.7s_infinite] h-2"></span>
                <span className="w-[2.5px] bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full animate-[bounce_0.6s_infinite] h-3"></span>
              </div>
            ) : (
              <Sparkles size={18} className="text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs font-bold text-slate-100 leading-tight truncate max-w-full" title={titulo}>
                {titulo || 'Narração'}
              </h4>
              {tocando && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 tracking-wide uppercase animate-pulse">
                  Ao Vivo
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {carregando ? 'Carregando áudio...' : `Narradora: ${vozesDisponiveis.find(v => v.id === voz)?.nome || voz}`}
            </p>
          </div>
        </div>

        {/* Centro: Controles Principais */}
        <div className="flex items-center gap-3">
          {/* Botão Stop */}
          {(tocando || tempoAtual > 0) && (
            <button 
              onClick={pararAudio} 
              className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md animate-[fadeIn_0.15s_ease-out]"
              title="Parar áudio"
            >
              <Square size={12} fill="currentColor" className="text-slate-400" />
            </button>
          )}

          {/* Play/Pause Central */}
          <button 
            onClick={alternarReproducao} 
            disabled={carregando || disponivel !== true} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 text-white ${
              disponivel !== true
                ? 'bg-slate-900/60 border border-slate-800 text-slate-600 cursor-not-allowed shadow-none'
                : tocando 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-orange-500/20' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-indigo-500/25'
            }`}
          >
            {carregando ? (
              <Loader2 size={20} className="animate-spin" />
            ) : tocando ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Mute */}
          <button 
            onClick={() => setMuted(!muted)} 
            className={`w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-center transition-all duration-200 active:scale-95 ${
              muted ? 'text-rose-400 border-rose-950/40 bg-rose-950/10' : 'text-slate-400 hover:text-white'
            }`}
            title={muted ? 'Ativar som' : 'Mutar'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Direita: Configurações de Voz & Download */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-end flex-wrap md:flex-nowrap">
          
          {/* Seletor de Velocidade Inline (+ / -) */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-1.5 h-9 shrink-0 gap-1.5 shadow-inner">
            <button 
              onClick={() => setVelocidade(v => Math.max(VELOCIDADE_MINIMA, Number((v - PASSO_VELOCIDADE).toFixed(2))))} 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all select-none font-bold text-sm"
              title="Diminuir velocidade"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-indigo-400 min-w-[38px] text-center select-none">
              {velocidade.toFixed(2)}x
            </span>
            <button 
              onClick={() => setVelocidade(v => Math.min(VELOCIDADE_MAXIMA, Number((v + PASSO_VELOCIDADE).toFixed(2))))} 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all select-none font-bold text-sm"
              title="Aumentar velocidade"
            >
              +
            </button>
          </div>

          {/* Dropdown de Vozes Gemini Customizado (Abertura para baixo) */}
          <div className="relative" ref={menuVozesRef}>
            <button 
              onClick={() => setVozesAberto(!vozesAberto)}
              className={`h-9 w-44 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-1.5 transition-all duration-200 whitespace-nowrap ${
                vozesAberto 
                  ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider shrink-0">Voz:</span>
                <span className="truncate">
                  {vozesDisponiveis.find(v => v.id === voz)?.nome || voz}
                </span>
              </div>
              <ChevronDown size={14} className={`opacity-60 transition-transform duration-200 shrink-0 ${vozesAberto ? 'rotate-180' : ''}`} />
            </button>

            {vozesAberto && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-2xl bg-slate-900 border border-slate-800/80 p-1.5 shadow-2xl z-50 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-2 py-1 mb-1 border-b border-slate-800/60 select-none">
                  Vozes Gemini
                </p>
                {vozesDisponiveis.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setVoz(v.id); setVozesAberto(false); }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-all flex flex-col gap-0.5 ${
                      voz === v.id 
                        ? 'bg-indigo-600/10 text-indigo-400 font-bold' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{v.nome}</span>
                      {voz === v.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>}
                    </div>
                    {v.descricao && (
                      <span className={`text-[9px] font-normal leading-normal truncate ${
                        voz === v.id ? 'text-indigo-400/65' : 'text-slate-500'
                      }`}>
                        {v.descricao}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download */}
          <button 
            onClick={disponivel === true ? handleDownload : undefined} 
            disabled={disponivel !== true}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 ${
              disponivel !== true
                ? 'bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-not-allowed shadow-none'
                : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white active:scale-95 shadow-md'
            }`}
            title={disponivel !== true ? 'Download indisponível (áudio não gerado)' : 'Baixar MP3'}
          >
            <Download size={16} />
          </button>
        </div>

      </div>

      {/* Linha do Tempo Estilizada e Contínua (Largura Total na Base com Alinhamento Simétrico) */}
      <div className="w-full flex items-center gap-3 mt-1.5 select-none relative z-10">
        <span className="w-10 text-left text-[10px] text-slate-500 font-mono shrink-0 select-none">
          {formatarTempo(tempoAtual)}
        </span>
        
        <div className="flex-1 relative group flex items-center h-4">
          <input 
            type="range" 
            min="0" 
            max={duracao || 100} 
            step="0.1" 
            value={tempoAtual} 
            onChange={(e) => { 
              const t = parseFloat(e.target.value); 
              setTempoAtual(t); 
              if(audioRef.current) audioRef.current.currentTime = t; 
            }} 
            className="w-full h-1 bg-slate-950 rounded-full appearance-none cursor-pointer border border-slate-900 group-hover:h-[6px] transition-all duration-150" 
            style={{ 
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(tempoAtual / (duracao || 1)) * 100}%, #090d16 ${(tempoAtual / (duracao || 1)) * 100}%, #090d16 100%)` 
            }} 
          />
          <style>{`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 0px;
              height: 0px;
              border-radius: 50%;
              background: #818cf8;
              cursor: pointer;
              transition: all 0.15s ease-in-out;
              box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
            }
            .group:hover input[type='range']::-webkit-slider-thumb {
              width: 12px;
              height: 12px;
            }
          `}</style>
        </div>

        <span className="w-10 text-right text-[10px] text-slate-500 font-mono shrink-0 select-none">
          {formatarTempo(duracao)}
        </span>
      </div>

      {/* Box de Erros Elegante */}
      {erro && (
        <div className="mt-1 p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs flex items-start gap-2 animate-[fadeIn_0.2s_ease-out] relative z-10">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold">Áudio Estático</p>
            <p className="mt-0.5 opacity-90">{erro}</p>
          </div>
        </div>
      )}
    </div>
  );
}
