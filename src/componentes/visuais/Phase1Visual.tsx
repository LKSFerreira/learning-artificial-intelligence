import React, { useState, useEffect } from 'react';
import { Bot, Globe, Zap, Box, Cpu, Brain, Database, Dog, Bone, Search, Map, CheckCircle, XCircle, ChevronRight, Terminal, BarChart3, ScanFace, RotateCcw } from 'lucide-react';

interface Props {
  visualState: string;
}

const Phase1Visual: React.FC<Props> = ({ visualState }) => {
  
  // --- STATE FOR ML EXAMPLE (Classificação) ---
  const [mlStage, setMlStage] = useState<'coding' | 'training' | 'testing'>('coding');
  const [mlProgress, setMlProgress] = useState(0);
  const [testResult, setTestResult] = useState<{label: string, conf: number} | null>(null);

  const trainModel = () => {
      setMlStage('training');
      setMlProgress(0);
      const interval = setInterval(() => {
          setMlProgress(p => {
              if (p >= 100) {
                  clearInterval(interval);
                  setMlStage('testing');
                  return 100;
              }
              return p + 2;
          });
      }, 50);
  };

  const testImage = (type: 'potion' | 'apple') => {
      if (type === 'potion') setTestResult({ label: 'Poção', conf: 99 });
      else setTestResult({ label: 'Não é Poção', conf: 5 });
  };

  // --- STATE FOR HIERARCHY TOOLBOX (Interactive Circles) ---
  const [circuloSelecionado, setCirculoSelecionado] = useState<'ia' | 'ml' | 'dl' | null>(null);

  const selecionarCirculo = (tipo: 'ia' | 'ml' | 'dl') => {
      // Alterna seleção: se já estiver selecionado, deseleciona
      setCirculoSelecionado(prev => prev === tipo ? null : tipo);
  };

  // --- STATE FOR DEEP LEARNING (Neural Net) ---
  const [activeInputs, setActiveInputs] = useState<string[]>([]);
  
  const toggleInput = (id: string) => {
      setActiveInputs(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
  };

  // Simple logic to light up layers
  const isLayer1Active = activeInputs.length > 0;
  const isOutputActive = activeInputs.length >= 2; // Needs at least 2 features


  // --- STATE FOR RL DOG (Trainer) ---
  const [dogState, setDogState] = useState({ q_sit: 0.1, q_jump: 0.1, q_sleep: 0.1 }); // Initial naive values
  const [currentAction, setCurrentAction] = useState<'sit' | 'jump' | 'sleep' | null>(null);
  const [feedbackEffect, setFeedbackEffect] = useState<'good' | 'bad' | null>(null);
  const [cmdStep, setCmdStep] = useState(1); // 1 = Command, 2 = Action, 3 = Feedback

  const issueCommand = () => {
      setFeedbackEffect(null);
      setCmdStep(2);
      
      // Epsilon-greedy simulation
      const rand = Math.random();
      // If trained, high chance to sit. If naive, random.
      const bestAction = Object.entries(dogState).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      // Simulation logic
      setTimeout(() => {
        if (dogState.q_sit > 0.5 && rand > 0.2) {
             setCurrentAction('sit');
        } else {
             const actions = ['sit', 'jump', 'sleep'];
             setCurrentAction(actions[Math.floor(Math.random() * actions.length)] as any);
        }
        setCmdStep(3);
      }, 800);
  };

  const giveFeedback = (type: 'reward' | 'punish') => {
      if (!currentAction) return;
      
      setFeedbackEffect(type === 'reward' ? 'good' : 'bad');
      
      setDogState(prev => {
          const key = `q_${currentAction}` as keyof typeof prev;
          let val = prev[key];
          
          if (type === 'reward') {
              // Big boost if sit, small confusion otherwise
              val = currentAction === 'sit' ? Math.min(val + 0.3, 1.0) : Math.min(val + 0.1, 0.5); 
          } else {
              val = Math.max(val - 0.2, 0.05);
          }
          
          // Normalize visually
          return { ...prev, [key]: val };
      });

      setTimeout(() => {
          setCmdStep(1);
          setCurrentAction(null);
          setFeedbackEffect(null);
      }, 1500);
  };


  // --- RENDERERS ---
  
  // 1. INTRO (ROADMAP - RICH TIMELINE STYLE)
  if (visualState === 'intro_concept') {
    return (
      <div className="flex flex-col h-full w-full max-w-2xl px-6 py-8 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-100 rounded-2xl">
                <Brain size={32} className="text-indigo-600" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-800">Nesta Fase</h3>
                <p className="text-slate-500 text-sm">Roteiro de aprendizado</p>
            </div>
        </div>

        <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {/* Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Box size={14} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700">A Caixa de Ferramentas</div>
                    </div>
                    <div className="text-slate-500 text-xs">Entenda a hierarquia: IA vs Machine Learning vs Deep Learning.</div>
                </div>
            </div>

            {/* Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Database size={14} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700">ML vs Tradicional</div>
                    </div>
                    <div className="text-slate-500 text-xs">Por que ensinar com exemplos é melhor que programar regras.</div>
                </div>
            </div>

             {/* Item 3 */}
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-pink-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Brain size={14} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-pink-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700">Deep Learning</div>
                    </div>
                    <div className="text-slate-500 text-xs">Redes Neurais e como camadas criam conhecimento complexo.</div>
                </div>
            </div>

            {/* Item 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Dog size={14} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-700">Aprendizado por Reforço</div>
                    </div>
                    <div className="text-slate-500 text-xs">Agentes, Ambientes e o sistema de Recompensas e Punições.</div>
                </div>
            </div>

        </div>
      </div>
    );
  }

  // 2. HIERARCHY TOOLBOX (Interactive - Com Modal Centralizada)
  if (visualState === 'hierarchy_toolbox') {
    // Dados informativos de cada conceito
    const informacoesCirculos = {
      ia: {
        titulo: 'Inteligência Artificial',
        definicao: 'Sistemas computacionais capazes de realizar tarefas que normalmente requerem inteligência humana.',
        exemplos: ['Assistentes virtuais (Alexa, Siri)', 'Carros autônomos', 'Sistemas de recomendação (Netflix, YouTube)', 'Jogos de xadrez'],
        cor: 'slate',
        corGradiente: 'from-slate-500 to-slate-700',
        icone: Box
      },
      ml: {
        titulo: 'Machine Learning',
        definicao: 'Algoritmos que aprendem padrões a partir de dados, sem serem explicitamente programados para cada situação.',
        exemplos: ['Filtro de spam de e-mail', 'Detecção de fraude bancária', 'Reconhecimento de voz', 'Previsão de vendas'],
        cor: 'blue',
        corGradiente: 'from-blue-500 to-blue-700',
        icone: Database
      },
      dl: {
        titulo: 'Deep Learning',
        definicao: 'Redes neurais profundas inspiradas no cérebro humano, capazes de extrair características complexas dos dados.',
        exemplos: ['Reconhecimento facial', 'Tradução automática (Google Translate)', 'Geração de texto (ChatGPT)', 'Diagnóstico médico por imagem'],
        cor: 'indigo',
        corGradiente: 'from-indigo-500 to-purple-700',
        icone: Brain
      }
    };

    const infoAtual = circuloSelecionado ? informacoesCirculos[circuloSelecionado] : null;

    return (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8 scale-90 md:scale-100 transition-transform">
            <h3 className="text-xl font-bold text-slate-700">Explore a Oficina</h3>
            
            {/* Container dos Círculos */}
            <div className="relative w-[28rem] h-[28rem] flex items-center justify-center">
                {/* AI Outer Circle - Com dica visual de clique */}
                <div 
                    onClick={() => selecionarCirculo('ia')}
                    className={`absolute inset-0 rounded-full border-4 flex flex-col items-center pt-8 transition-all cursor-pointer group
                        ${circuloSelecionado === 'ia' 
                            ? 'border-slate-500 bg-slate-100 scale-105 shadow-[0_0_40px_rgba(100,116,139,0.3)]' 
                            : 'border-slate-300 bg-slate-50 hover:scale-105 hover:border-slate-400 shadow-sm animate-[pulse_3s_ease-in-out_infinite]'
                        }
                    `}
                >
                    <span className={`font-bold uppercase tracking-widest text-xs md:text-sm transition-colors ${circuloSelecionado === 'ia' ? 'text-slate-700' : 'text-slate-500'}`}>
                        Inteligência Artificial
                    </span>
                    <Box size={16} className={`mt-2 transition-colors ${circuloSelecionado === 'ia' ? 'text-slate-600' : 'text-slate-400 group-hover:scale-110'}`} />
                </div>
                
                {/* ML Middle Circle - Com dica visual */}
                <div 
                    onClick={(e) => { e.stopPropagation(); selecionarCirculo('ml'); }}
                    className={`absolute w-[18rem] h-[18rem] rounded-full border-4 flex flex-col items-center pt-8 transition-all cursor-pointer z-10 group
                        ${circuloSelecionado === 'ml'
                            ? 'border-blue-500 bg-blue-100 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.4)]'
                            : 'border-blue-300 bg-blue-50 hover:scale-105 hover:bg-blue-100 shadow-md animate-[pulse_3s_ease-in-out_infinite_200ms]'
                        }
                    `}
                >
                    <span className={`font-bold uppercase tracking-widest text-xs transition-colors ${circuloSelecionado === 'ml' ? 'text-blue-700' : 'text-blue-600'}`}>
                        Machine Learning
                    </span>
                    <Database size={16} className={`mt-2 transition-colors ${circuloSelecionado === 'ml' ? 'text-blue-600' : 'text-blue-400 group-hover:scale-110'}`} />
                </div>

                {/* DL Inner Circle - Com dica visual */}
                <div 
                    onClick={(e) => { e.stopPropagation(); selecionarCirculo('dl'); }}
                    className={`absolute w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all cursor-pointer z-20 text-white group
                        ${circuloSelecionado === 'dl'
                            ? 'border-indigo-400 bg-indigo-500 scale-125 shadow-[0_0_50px_rgba(99,102,241,0.5)]'
                            : 'border-indigo-500 bg-indigo-600 hover:scale-110 hover:shadow-xl hover:shadow-indigo-300 shadow-lg animate-[pulse_3s_ease-in-out_infinite_400ms]'
                        }
                    `}
                >
                    <Brain size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs mt-2 text-center leading-tight">Deep<br/>Learning</span>
                </div>
            </div>
            
            {/* Texto com dica visual pulsante */}
            <p className={`text-sm bg-white/80 backdrop-blur px-4 py-2 rounded-full border shadow-sm mt-4 transition-all ${!circuloSelecionado ? 'border-indigo-300 text-indigo-700 animate-pulse' : 'border-slate-200 text-slate-500'}`}>
                👆 {circuloSelecionado ? 'Clique novamente ou fora para fechar' : 'Clique nos círculos para explorar!'}
            </p>
        </div>

        {/* Modal Centralizada (Backdrop + Card) */}
        {circuloSelecionado && infoAtual && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
                onClick={() => setCirculoSelecionado(null)}
            >
                {/* Backdrop com blur */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                
                {/* Modal Card */}
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                >
                    {/* Header com Gradiente */}
                    <div className={`bg-gradient-to-r ${infoAtual.corGradiente} text-white p-6 rounded-t-2xl relative overflow-hidden`}>
                        {/* Pattern decorativo */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] [background-size:24px_24px]"></div>
                        
                        <div className="relative flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                {React.createElement(infoAtual.icone, { 
                                    size: 40, 
                                    className: 'text-white drop-shadow-lg'
                                })}
                                <h2 className="text-2xl font-bold drop-shadow-md">
                                    {infoAtual.titulo}
                                </h2>
                            </div>
                            <button 
                                onClick={() => setCirculoSelecionado(null)}
                                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                        {/* Definição */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-slate-400 rounded"></span>
                                Definição
                            </h3>
                            <p className="text-slate-700 leading-relaxed">
                                {infoAtual.definicao}
                            </p>
                        </div>

                        {/* Exemplos Práticos */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-1 h-4 bg-slate-400 rounded"></span>
                                Exemplos Práticos
                            </h3>
                            <div className="space-y-2">
                                {infoAtual.exemplos.map((exemplo, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex items-start gap-3 p-3 bg-${infoAtual.cor}-50 border border-${infoAtual.cor}-100 rounded-lg hover:shadow-md transition-shadow`}
                                    >
                                        <CheckCircle size={16} className={`text-${infoAtual.cor}-600 mt-0.5 shrink-0`} />
                                        <span className="text-sm text-slate-700">{exemplo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Relação Hierárquica */}
                        <div className={`p-4 bg-gradient-to-r from-${infoAtual.cor}-50 to-${infoAtual.cor}-100 border-l-4 border-${infoAtual.cor}-500 rounded-lg`}>
                            <p className="text-sm text-slate-700 italic leading-relaxed flex items-start gap-2">
                                <span className="text-lg">💡</span>
                                <span>
                                    {circuloSelecionado === 'ia' && 'IA é o conceito mais amplo, que engloba Machine Learning e Deep Learning.'}
                                    {circuloSelecionado === 'ml' && 'Machine Learning está dentro de IA e inclui Deep Learning.'}
                                    {circuloSelecionado === 'dl' && 'Deep Learning é um tipo específico de Machine Learning, usando redes neurais profundas.'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // 3. ML EXAMPLES (Interactive Simulator - EXPANDIDO COM MAIS EXEMPLOS)
  if (visualState === 'ml_examples') {
    // Dataset expandido com 12 tipos de itens variados
    const datasetItens = [
      { emoji: '🧪', nome: 'Poção Verde', tipo: 'potion', correto: true },
      { emoji: '🍎', nome: 'Maçã', tipo: 'food', correto: false },
      { emoji: '⚗️', nome: 'Elixir Azul', tipo: 'potion', correto: true },
      { emoji: '🍊', nome: 'Laranja', tipo: 'food', correto: false },
      { emoji: '🧴', nome: 'Frasco Roxo', tipo: 'potion', correto: true },
      { emoji: '🍇', nome: 'Uvas', tipo: 'food', correto: false },
      { emoji: '⚔️', nome: 'Espada', tipo: 'weapon', correto: false },
      { emoji: '💎', nome: 'Gema', tipo: 'treasure', correto: false },
      { emoji: '🍵', nome: 'Chá Verde', tipo: 'potion', correto: true },
      { emoji: '🍓', nome: 'Morango', tipo: 'food', correto: false },
      { emoji: '🛡️', nome: 'Escudo', tipo: 'weapon', correto: false },
      { emoji: '🔮', nome: 'Orbe Mágico', tipo: 'potion', correto: true },
    ];

    // Função que testa um item ESPECÍFICO pelo índice
    const testItem = (itemIndex: number) => {
      const item = datasetItens[itemIndex];
      if (!item) return;
      
      // Valores de confiança aleatórios mais realistas
      let confianca: number;
      if (item.correto) {
        // Poções: 95-99% de confiança
        confianca = Math.floor(Math.random() * 5) + 95; // 95, 96, 97, 98 ou 99
      } else {
        // Não-poções: 5-10% de confiança
        confianca = Math.floor(Math.random() * 6) + 5; // 5, 6, 7, 8, 9 ou 10
      }
      
      if (item.correto) {
        setTestResult({ label: `✅ ${item.nome} - É Poção!`, conf: confianca });
      } else {
        setTestResult({ label: `❌ ${item.nome} - Não é Poção`, conf: confianca });
      }
    };

    // Função para reiniciar a simulação
    const reiniciarSimulacao = () => {
      setMlStage('coding');
      setMlProgress(0);
      setTestResult(null);
    };

    return (
      <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-6 overflow-hidden">
        {/* Header com botão de reiniciar */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2">
                <Bot className="text-cyan-400" />
                <h3 className="font-bold text-lg text-white">Machine Learning: Aprendendo com Exemplos</h3>
            </div>
            
            {/* Botão Reiniciar - só aparece após iniciar */}
            {mlStage !== 'coding' && (
                <button
                    onClick={reiniciarSimulacao}
                    className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        Reiniciar
                    </span>
                    {/* Brilho sutil ao passar o mouse */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
            )}
        </div>

        <div className="flex-1 flex gap-6">
            
            {/* Left: Traditional Programming */}
            <div className={`flex-1 rounded-xl border border-slate-700 p-4 flex flex-col transition-opacity duration-500 ${mlStage === 'coding' ? 'opacity-100' : 'opacity-40'}`}>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-pink-400 font-bold">PROGRAMADOR (VOCÊ)</span>
                    <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-1 rounded">JEITO ANTIGO</span>
                </div>
                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 shadow-inner flex-1 overflow-auto">
                    <span className="text-purple-400">function</span> <span className="text-yellow-300">isPotion</span>(item) {'{'}<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">if</span> (item.color === <span className="text-green-400">'red'</span>) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-blue-400">true</span>;<br/>
                    &nbsp;&nbsp;{'}'}<br/>
                    &nbsp;&nbsp;<span className="text-slate-500">// E azul? Roxo? Verde?</span><br/>
                    &nbsp;&nbsp;<span className="text-slate-500">// Impossível prever tudo!</span><br/>
                    &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-blue-400">false</span>;<br/>
                    {'}'}
                </div>
                {mlStage === 'coding' && (
                    <div className="mt-4">
                        <p className="text-xs text-center text-slate-500 mb-2">Exemplos que falham:</p>
                        <div className="grid grid-cols-4 gap-2">
                             <div className="bg-slate-800 p-2 rounded text-center opacity-50"><span className="text-xl">🧪</span><br/><span className="text-[9px]">Ok</span></div>
                             <div className="bg-slate-800 p-2 rounded text-center border border-red-500"><span className="text-xl">🍎</span><br/><span className="text-[9px] text-red-400">Erro!</span></div>
                             <div className="bg-slate-800 p-2 rounded text-center border border-red-500"><span className="text-xl">⚗️</span><br/><span className="text-[9px] text-red-400">Erro!</span></div>
                             <div className="bg-slate-800 p-2 rounded text-center border border-red-500"><span className="text-xl">🧴</span><br/><span className="text-[9px] text-red-400">Erro!</span></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Machine Learning */}
            <div className={`flex-1 rounded-xl border-2 border-cyan-500/30 bg-slate-800/50 p-4 flex flex-col relative ${mlStage !== 'coding' ? 'shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]' : ''}`}>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-cyan-400 font-bold">MODELO TREINADO</span>
                    <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">MACHINE LEARNING</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {mlStage === 'coding' && (
                        <div className="text-center">
                            <Database size={48} className="text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">Aguardando dados...</p>
                        </div>
                    )}

                    {mlStage === 'training' && (
                         <div className="w-full px-4">
                             <div className="flex justify-between text-xs text-cyan-300 mb-1">
                                 <span>Treinando com {datasetItens.length} exemplos...</span>
                                 <span>{mlProgress}%</span>
                             </div>
                             <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                 <div className="h-full bg-cyan-500 transition-all duration-75" style={{ width: `${mlProgress}%`}}></div>
                             </div>
                             <div className="grid grid-cols-4 gap-2 mt-4 opacity-50">
                                 {datasetItens.map((item, i) => <div key={i} className="text-2xl animate-pulse">{item.emoji}</div>)}
                             </div>
                             <p className="text-center text-xs text-cyan-400 mt-3">🧠 Aprendendo padrões...</p>
                         </div>
                    )}

                    {mlStage === 'testing' && (
                        <div className="flex flex-col items-center w-full animate-in fade-in zoom-in">
                            <div className="h-24 w-full flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 mb-4">
                                {testResult ? (
                                    <div className="text-center px-2">
                                        <div className={`text-sm font-bold ${testResult.label.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                                            {testResult.label} 
                                        </div>
                                        <div className="text-xs opacity-70 mt-1">Confiança: {testResult.conf}%</div>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-500 italic">Selecione um item abaixo</span>
                                )}
                            </div>
                            
                            {/* Grid de testes com TODOS os itens */}
                            <div className="w-full">
                                <p className="text-xs text-slate-400 mb-2 text-center">Teste o modelo:</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {datasetItens.map((item, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => testItem(idx)} 
                                            className="px-2 py-3 bg-slate-700 rounded hover:bg-slate-600 hover:scale-105 transition-all text-2xl flex flex-col items-center gap-1 group" 
                                            title={item.nome}
                                        >
                                            <span>{item.emoji}</span>
                                            <span className="text-[8px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.nome.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {mlStage === 'coding' && (
                    <div className="relative mt-4 group/btn">
                        {/* Borda animada CIRCULANDO ao redor do botão */}
                        <div 
                            className="absolute -inset-0.5 rounded-lg opacity-75 blur-sm"
                            style={{
                                background: 'conic-gradient(from var(--angle), #06b6d4 0deg, #a855f7 120deg, #ec4899 240deg, #06b6d4 360deg)',
                                animation: 'borderRotate 3s linear infinite'
                            }}
                        ></div>
                        
                        {/* Adicionando animação CSS inline via style tag */}
                        <style>{`
                            @property --angle {
                                syntax: '<angle>';
                                initial-value: 0deg;
                                inherits: false;
                            }
                            @keyframes borderRotate {
                                to {
                                    --angle: 360deg;
                                }
                            }
                        `}</style>
                        
                        {/* Botão principal */}
                        <button 
                            onClick={trainModel}
                            className="relative w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 group"
                        >
                            <Zap size={18} className="group-hover:scale-110 transition-transform" /> 
                            <span>Rodar Classificação ML</span>
                            {/* Brilho interno ao hover */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // 4. DEEP LEARNING (Interactive Neural Net)
  if (visualState === 'dl_neural_net') {
    return (
      <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Brain size={120} /></div>
          
          <h3 className="font-bold text-xl text-pink-500 mb-2">Deep Learning: A "Visão" da IA</h3>
          <p className="text-xs text-slate-400 mb-8 max-w-md">Ative as características (inputs) para ver como a rede processa a informação e identifica o objeto.</p>

          <div className="flex-1 flex items-center justify-between px-8 relative z-10">
              
              {/* INPUT LAYER */}
              <div className="flex flex-col gap-6">
                  <span className="text-xs font-mono text-slate-500 text-center mb-2">INPUTS</span>
                  {[
                      {id: 'color', label: 'Cor Rosa', icon: '🎨'}, 
                      {id: 'shape', label: 'Redondo', icon: '⭕'}, 
                      {id: 'face', label: 'Tem Rosto', icon: '🙂'}
                  ].map(inp => (
                      <button 
                        key={inp.id}
                        onClick={() => toggleInput(inp.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all w-40
                            ${activeInputs.includes(inp.id) 
                                ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'}
                        `}
                      >
                          <span className="text-xl">{inp.icon}</span>
                          <span className="text-xs font-bold">{inp.label}</span>
                      </button>
                  ))}
              </div>

              {/* CONNECTIONS 1 */}
              <div className="w-24 h-48 relative opacity-30">
                  <svg className="w-full h-full absolute inset-0 overflow-visible">
                      <line x1="0" y1="20%" x2="100%" y2="50%" stroke={isLayer1Active ? "#ec4899" : "#475569"} strokeWidth="2" className="transition-colors duration-500" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke={isLayer1Active ? "#ec4899" : "#475569"} strokeWidth="2" className="transition-colors duration-500" />
                      <line x1="0" y1="80%" x2="100%" y2="50%" stroke={isLayer1Active ? "#ec4899" : "#475569"} strokeWidth="2" className="transition-colors duration-500" />
                  </svg>
              </div>

              {/* HIDDEN LAYER */}
              <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 mb-2">HIDDEN LAYER</span>
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-xl
                        ${isLayer1Active ? 'bg-purple-600 border-purple-400 shadow-purple-900/50 scale-110' : 'bg-slate-800 border-slate-700'}
                  `}>
                      <Cpu size={24} className={isLayer1Active ? 'text-white animate-pulse' : 'text-slate-600'} />
                  </div>
                  <span className="text-[10px] text-slate-500">Extração de Features</span>
              </div>

              {/* CONNECTIONS 2 */}
              <div className="w-24 h-48 relative opacity-30">
                   <svg className="w-full h-full absolute inset-0 overflow-visible">
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke={isOutputActive ? "#22c55e" : "#475569"} strokeWidth="2" strokeDasharray="4" className={isOutputActive ? 'animate-dash' : ''} />
                   </svg>
              </div>

              {/* OUTPUT LAYER */}
              <div className="flex flex-col items-center gap-2">
                   <span className="text-xs font-mono text-slate-500 mb-2">OUTPUT</span>
                   <div className={`w-32 h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-700
                        ${isOutputActive 
                            ? 'bg-green-900/30 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                            : 'bg-slate-900 border-slate-800 opacity-50'}
                   `}>
                       {isOutputActive ? (
                           <>
                             <span className="text-4xl mb-2 animate-bounce">💧</span>
                             <span className="text-green-400 font-bold tracking-widest">PORING</span>
                             <span className="text-xs text-green-600 font-mono">98% CONFIDENCE</span>
                           </>
                       ) : (
                           <span className="text-slate-600 text-xs">...</span>
                       )}
                   </div>
              </div>

          </div>
      </div>
    );
  }

  // 5. RL DOG (Interactive Trainer)
  if (visualState === 'rl_dog_training') {
    return (
      <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-200 p-6 font-mono relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
         
         <div className="flex justify-between items-start mb-6">
             <div>
                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Dog className="text-amber-500"/> Reinforcement Learning</h3>
                 <p className="text-xs text-slate-500 mt-1">Treine o agente para SENTAR ao comando.</p>
             </div>
             <div className="text-right">
                 <span className="text-xs text-slate-500">STATUS</span>
                 <div className={`text-sm font-bold ${cmdStep === 1 ? 'text-blue-400' : cmdStep === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                     {cmdStep === 1 ? 'ESPERANDO COMANDO' : cmdStep === 2 ? 'AGENTE PENSANDO...' : 'AVALIAR AÇÃO'}
                 </div>
             </div>
         </div>

         <div className="flex-1 flex gap-4">
             {/* Left: Environment */}
             <div className="flex-1 bg-slate-900 rounded-xl border-2 border-slate-800 relative flex items-center justify-center overflow-hidden">
                 {/* Background Art */}
                 <div className="absolute bottom-0 w-full h-1/3 bg-slate-800"></div>
                 
                 {/* Dog Sprite */}
                 <div className={`relative z-10 transition-transform duration-300 ${currentAction === 'jump' ? '-translate-y-12' : currentAction === 'sit' ? 'translate-y-4' : ''}`}>
                      <div className="text-8xl filter drop-shadow-2xl">
                          {currentAction === 'sit' ? '🐶' : currentAction === 'jump' ? '🐩' : currentAction === 'sleep' ? '💤' : '🐕'}
                      </div>
                      {/* Thought Bubble */}
                      {cmdStep === 2 && (
                          <div className="absolute -top-12 -right-12 bg-white text-slate-900 px-3 py-1 rounded-xl text-xs font-bold animate-bounce">
                              ?
                          </div>
                      )}
                      {/* Feedback Effect */}
                      {feedbackEffect && (
                          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 text-4xl animate-out fade-out slide-out-to-top-10 duration-1000`}>
                              {feedbackEffect === 'good' ? '🦴' : '🗞️'}
                          </div>
                      )}
                 </div>
             </div>

             {/* Right: Agent Brain */}
             <div className="w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col gap-4">
                 <span className="text-xs font-bold text-slate-400 uppercase border-b border-slate-700 pb-2">Cérebro (Q-Values)</span>
                 
                 {['sit', 'jump', 'sleep'].map(action => (
                     <div key={action} className="flex flex-col gap-1">
                         <div className="flex justify-between text-xs">
                             <span className="capitalize text-slate-300">{action} {action === 'sit' ? '(Correto)' : ''}</span>
                             <span className="text-slate-500">{(dogState[`q_${action}` as keyof typeof dogState] * 100).toFixed(0)}%</span>
                         </div>
                         <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                             <div 
                                className={`h-full transition-all duration-500 ${action === 'sit' ? 'bg-green-500' : 'bg-indigo-500'}`} 
                                style={{ width: `${dogState[`q_${action}` as keyof typeof dogState] * 100}%` }}
                             ></div>
                         </div>
                     </div>
                 ))}

                 <div className="mt-auto p-3 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400 italic">
                     Conceito: No início, a IA chuta (Exploração). Se você der biscoito, ela aumenta a barra verde e diminui as outras (Exploitation).
                 </div>
             </div>
         </div>

         {/* Controls */}
         <div className="mt-6 flex gap-4 h-16">
             {cmdStep === 1 ? (
                 <button onClick={issueCommand} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_4px_0_rgb(55,48,163)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg">
                     <Terminal size={20} /> COMANDO: "SENTA!"
                 </button>
             ) : cmdStep === 3 ? (
                 <div className="flex-1 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                     <button onClick={() => giveFeedback('reward')} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
                         <Bone size={20} /> BOM GAROTO! (+10)
                     </button>
                     <button onClick={() => giveFeedback('punish')} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
                         <XCircle size={20} /> ERROU! (-1)
                     </button>
                 </div>
             ) : (
                 <div className="flex-1 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 animate-pulse cursor-wait">
                     Processando...
                 </div>
             )}
         </div>
      </div>
    );
  }

  // FALLBACK for others
  return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
          Visual: {visualState} (Em construção)
      </div>
  );
};

export default Phase1Visual;