import React, { useState, useEffect } from 'react';
import { Bot, Globe, Zap, Box, Cpu, Brain, Database, Dog, Bone, Search, Map, CheckCircle, XCircle, ChevronRight, Terminal, BarChart3, ScanFace } from 'lucide-react';

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

  // 2. HIERARCHY TOOLBOX (Interactive - RESIZED)
  if (visualState === 'hierarchy_toolbox') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 w-full relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8 scale-90 md:scale-100 transition-transform">
            <h3 className="text-xl font-bold text-slate-700">Explore a Oficina</h3>
            
            {/* Increased Size: w-[28rem] h-[28rem] */}
            <div className="group relative w-[28rem] h-[28rem] flex items-center justify-center">
                {/* AI Outer Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-300 bg-slate-50 flex flex-col items-center pt-8 transition-all hover:scale-105 hover:border-slate-400 cursor-pointer shadow-sm">
                    <span className="font-bold text-slate-500 uppercase tracking-widest text-xs md:text-sm">Inteligência Artificial</span>
                    <Box size={16} className="text-slate-400 mt-2" />
                </div>
                
                {/* ML Middle Circle - Increased to w-[18rem] */}
                <div className="absolute w-[18rem] h-[18rem] rounded-full border-4 border-blue-300 bg-blue-50 flex flex-col items-center pt-8 transition-all hover:scale-105 hover:bg-blue-100 cursor-pointer shadow-md z-10">
                    <span className="font-bold text-blue-600 uppercase tracking-widest text-xs">Machine Learning</span>
                    <Database size={16} className="text-blue-400 mt-2" />
                </div>

                 {/* DL Inner Circle - Kept at w-32 */}
                 <div className="absolute w-32 h-32 rounded-full border-4 border-indigo-500 bg-indigo-600 flex flex-col items-center justify-center transition-all hover:scale-110 hover:shadow-xl hover:shadow-indigo-300 cursor-pointer z-20 text-white shadow-lg">
                    <Brain size={32} className="animate-pulse" />
                    <span className="font-bold text-xs mt-2 text-center leading-tight">Deep<br/>Learning</span>
                </div>
            </div>
            <p className="text-sm text-slate-500 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm mt-4">
                Clique nos círculos para entender a relação (Matrioska)
            </p>
        </div>
      </div>
    );
  }

  // 3. ML EXAMPLES (Interactive Simulator)
  if (visualState === 'ml_examples') {
    return (
      <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
             <Bot className="text-cyan-400" />
             <h3 className="font-bold text-lg text-white">Machine Learning: Aprendendo com Exemplos</h3>
        </div>

        <div className="flex-1 flex gap-6">
            
            {/* Left: Traditional Programming */}
            <div className={`flex-1 rounded-xl border border-slate-700 p-4 flex flex-col transition-opacity duration-500 ${mlStage === 'coding' ? 'opacity-100' : 'opacity-40'}`}>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-pink-400 font-bold">PROGRAMADOR (VOCÊ)</span>
                    <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-1 rounded">JEITO ANTIGO</span>
                </div>
                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 shadow-inner flex-1 overflow-hidden">
                    <span className="text-purple-400">function</span> <span className="text-yellow-300">isPotion</span>(item) {'{'}<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">if</span> (item.color === <span className="text-green-400">'red'</span>) {'{'}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-blue-400">true</span>;<br/>
                    &nbsp;&nbsp;{'}'}<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-blue-400">false</span>;<br/>
                    {'}'}
                </div>
                {mlStage === 'coding' && (
                    <div className="mt-4 flex gap-2 justify-center">
                         <div className="bg-slate-800 p-2 rounded text-center w-20 opacity-50"><span className="text-2xl">🧪</span><br/><span className="text-[10px]">Ok</span></div>
                         <div className="bg-slate-800 p-2 rounded text-center w-20 border border-red-500"><span className="text-2xl">🍎</span><br/><span className="text-[10px] text-red-400">Erro!</span></div>
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
                                 <span>Treinando...</span>
                                 <span>{mlProgress}%</span>
                             </div>
                             <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                 <div className="h-full bg-cyan-500 transition-all duration-75" style={{ width: `${mlProgress}%`}}></div>
                             </div>
                             <div className="grid grid-cols-5 gap-1 mt-4 opacity-50">
                                 {Array(10).fill(0).map((_,i) => <div key={i} className="text-lg animate-pulse">{i%2===0 ? '🧪' : '🍎'}</div>)}
                             </div>
                         </div>
                    )}

                    {mlStage === 'testing' && (
                        <div className="flex flex-col items-center w-full animate-in fade-in zoom-in">
                            <div className="h-24 w-full flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 mb-4">
                                {testResult ? (
                                    <div className="text-center">
                                        <div className="text-4xl mb-1">{testResult.label === 'Poção' ? '🧪' : '🍎'}</div>
                                        <div className={`text-sm font-bold ${testResult.label === 'Poção' ? 'text-green-400' : 'text-red-400'}`}>
                                            {testResult.label} <span className="text-xs opacity-70">({testResult.conf}%)</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-500 italic">Selecione um item abaixo</span>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => testImage('potion')} className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 hover:scale-105 transition-all text-2xl" title="Testar Poção">🧪</button>
                                <button onClick={() => testImage('apple')} className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 hover:scale-105 transition-all text-2xl" title="Testar Maçã">🍎</button>
                            </div>
                        </div>
                    )}
                </div>

                {mlStage === 'coding' && (
                    <button 
                        onClick={trainModel}
                        className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/50 transition-all flex items-center justify-center gap-2"
                    >
                        <Zap size={18} /> Rodar Classificação ML
                    </button>
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