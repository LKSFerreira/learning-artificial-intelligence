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
  Sparkles
} from 'lucide-react';
import { obterVozes, obterCaminhoAudioEstatico } from '../../servicos/audio/gerenciadorAudio';

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

export function PlayerAudioIA({ licaoId, faseId, passoIndice }: PropriedadesPlayerAudio) {
  // Lista de vozes estáticas
  const vozesDisponiveis = obterVozes();

  // Estado da Voz (persiste no localStorage)
  const [voz, setVoz] = useState<string>(() => {
    const salva = localStorage.getItem('aprendendo-ia:audio:voz-estatica');
    return salva && vozesDisponiveis.some(v => v.id === salva) ? salva : 'Aoede';
  });

  // Configurações de Reprodução
  const [velocidade, setVelocidade] = useState<number>(1.0);
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

  // Referência para o elemento de áudio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Atualiza a URL do áudio sempre que o licaoId ou voz muda
  useEffect(() => {
    pararAudio();
    setErro(null);

    const url = obterCaminhoAudioEstatico(licaoId, voz);
    setAudioUrl(url);

    // Destrói o elemento de áudio antigo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
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

  // Formata o tempo em segundos para hh:mm:ss
  const formatarTempo = (segundos: number): string => {
    if (isNaN(segundos) || !isFinite(segundos)) return '00:00:00';
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = Math.floor(segundos % 60);
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
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
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    // Tenta montar um nome amigável caso faseId e passoIndice estejam disponíveis, senão usa o licaoId
    const nomeAmigavel = (faseId !== undefined && passoIndice !== undefined) 
      ? `Fase ${faseId} - Passo ${passoIndice + 1} (${voz}).mp3`
      : `${licaoId}_${voz}.mp3`;
    link.download = nomeAmigavel;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-lg mb-6 transition-all duration-300 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900/50 shadow-inner shrink-0">
            {carregando ? <Loader2 size={18} className="animate-spin" /> : tocando ? <div className="flex items-end gap-[2px] h-3.5 w-4 overflow-hidden"><span className="w-0.5 bg-indigo-400 rounded-full animate-bounce h-3"></span><span className="w-0.5 bg-indigo-400 rounded-full animate-bounce h-4"></span></div> : <Sparkles size={18} />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Ouvir Conteúdo {tocando && <span className="text-[9px] px-1.5 py-0.5 bg-green-950/80 text-green-400 rounded font-medium border border-green-900/50 animate-pulse">Tocando</span>}
            </h4>
            <p className="text-[10px] text-slate-400">
              {carregando ? 'Carregando áudio estático...' : `Voz: ${vozesDisponiveis.find(v => v.id === voz)?.nome || voz}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={alternarReproducao} disabled={carregando} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${tocando ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {carregando ? <Loader2 size={20} className="animate-spin" /> : tocando ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          {(tocando || progresso > 0) && (
            <button onClick={pararAudio} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Square size={16} fill="currentColor" />
            </button>
          )}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-1 shrink-0 gap-1.5 h-8">
            <button onClick={() => setVelocidade(v => Math.max(0.5, v - 0.25))} className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white">-</button>
            <span className="text-[11px] text-slate-100 font-semibold min-w-[38px] text-center">{velocidade.toFixed(2)}x</span>
            <button onClick={() => setVelocidade(v => Math.min(3.0, v + 0.25))} className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white">+</button>
          </div>
          <select value={voz} onChange={(e) => setVoz(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2 text-xs text-white max-w-[120px]">
            {vozesDisponiveis.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
          </select>
          <button onClick={() => setMuted(!muted)} className="p-2 text-slate-400 hover:text-white">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!erro && (
            <button onClick={handleDownload} className="p-2 text-slate-400 hover:text-white border border-slate-800 rounded-lg">
              <Download size={18} />
            </button>
          )}
        </div>
      </div>

      {(tocando || progresso > 0) && (
        <div className="w-full flex items-center gap-3 mt-3 animate-fade-in select-none">
          <div className="flex-1 relative group flex items-center h-4">
            <input type="range" min="0" max={duracao || 100} step="0.1" value={tempoAtual} onChange={(e) => { const t = parseFloat(e.target.value); setTempoAtual(t); if(audioRef.current) audioRef.current.currentTime = t; }} className="w-full h-1 bg-slate-950 rounded-full appearance-none cursor-pointer border border-slate-800" style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(tempoAtual / (duracao || 1)) * 100}%, #020617 ${(tempoAtual / (duracao || 1)) * 100}%, #020617 100%)` }} />
            <style>{`input[type='range']::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:#818cf8;cursor:pointer;}`}</style>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0">
            {formatarTempo(tempoAtual)}/{formatarTempo(duracao)}
          </span>
        </div>
      )}

      {erro && (
        <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div><p className="font-semibold">Áudio Estático</p><p className="mt-0.5">{erro}</p></div>
        </div>
      )}
    </div>
  );
}
