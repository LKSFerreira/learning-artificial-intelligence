import React, { useState, useEffect } from 'react';
import { Brain, FileCode, Server, PlayCircle, Folder, MousePointerClick, AlertTriangle, CheckCircle2, Sigma, GitBranch, LayoutGrid, Calculator, RefreshCw, Table, Shuffle } from 'lucide-react';

interface Props {
  visualState: string;
}

const Phase2Visual: React.FC<Props> = ({ visualState }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [qValues, setQValues] = useState<number[]>(Array(9).fill(0));
  
  // Interaction State for Critical Defense
  const [interactionState, setInteractionState] = useState<'waiting' | 'success' | 'fail'>('waiting');

  // Bellman State
  const [alpha, setAlpha] = useState(0.5);
  const [gamma, setGamma] = useState(0.9);
  const [reward, setReward] = useState(10);
  const [oldQ, setOldQ] = useState(2.0);
  const [maxQNext, setMaxQNext] = useState(5.0);

  // Epsilon State
  const [epsilon, setEpsilon] = useState(50); // %

  // Simula o comportamento visual baseado no passo
  useEffect(() => {
    if (visualState === 'intro_concept' || visualState === 'q_table_zeros') {
        setBoard(Array(9).fill(null));
        setQValues(Array(9).fill(0.0));
    } 
    else if (visualState === 'critical_defense') {
        resetCriticalDefense();
    }
  }, [visualState]);

  const resetCriticalDefense = () => {
        setInteractionState('waiting');
        // Set up the specific defense scenario
        const newBoard = Array(9).fill(null);
        newBoard[2] = 'X'; // Top Right
        newBoard[5] = 'X'; // Middle Right
        newBoard[3] = 'O'; // Middle Left (Distraction)
        newBoard[4] = 'O'; // Center (Distraction)
        setBoard(newBoard);
        setQValues(Array(9).fill(0)); // Hidden at start
  };

  const handleCellClick = (index: number) => {
      if (visualState !== 'critical_defense' || interactionState !== 'waiting') return;

      if (board[index]) return; // Occupied

      if (index === 8) {
          // Success Move
          setInteractionState('success');
          const newQ = Array(9).fill(0);
          newQ[0] = -0.05; newQ[1] = -0.08; newQ[6] = -0.21; newQ[7] = -0.25;
          newQ[8] = 0.80;
          setQValues(newQ);
          
          const newBoard = [...board];
          newBoard[index] = 'O';
          setBoard(newBoard);
      } else {
          // Fail Move
          setInteractionState('fail');
          const newBoard = [...board];
          newBoard[index] = 'O';
          setBoard(newBoard);
      }
  };

  // Helper colors
  const getQColor = (val: number) => {
    if (val === 0) return 'bg-white';
    if (val < 0) return `rgba(239, 68, 68, ${Math.abs(val) * 0.4})`; // Red for bad
    return `rgba(16, 185, 129, ${val})`; // Green for good
  };

  // Calculate Bellman Result dynamically
  const bellmanResult = oldQ + alpha * (reward + (gamma * maxQNext) - oldQ);

  // --- RENDERS ---
  
  // 1. INTRO (ROADMAP FASE 2 - RICH TIMELINE STYLE)
  if (visualState === 'intro_concept') {
      return (
        <div className="flex flex-col h-full w-full max-w-2xl px-6 py-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-purple-100 rounded-2xl">
                  <Brain size={32} className="text-purple-600" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800">Construindo o Cérebro</h3>
                  <p className="text-slate-500 text-sm">O que vamos criar</p>
              </div>
          </div>

          <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              {/* Item 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-purple-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <LayoutGrid size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">O Jogo da Velha</div>
                      </div>
                      <div className="text-slate-500 text-xs">O ambiente de treino, regras e vitória.</div>
                  </div>
              </div>

               {/* Item 2 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Table size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">A Q-Table</div>
                      </div>
                      <div className="text-slate-500 text-xs">A tabela gigante que serve de memória para a IA.</div>
                  </div>
              </div>

               {/* Item 3 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-green-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Calculator size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">Equação de Bellman</div>
                      </div>
                      <div className="text-slate-500 text-xs">A matemática por trás do ganho de experiência.</div>
                  </div>
              </div>

              {/* Item 4 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Shuffle size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">Epsilon-Greedy</div>
                      </div>
                      <div className="text-slate-500 text-xs">O dilema entre arriscar novidades ou jogar seguro.</div>
                  </div>
              </div>

          </div>
        </div>
      );
  }

  // 4. BELLMAN CALCULATOR (Interactive)
  if (visualState === 'bellman_equation') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50">
             <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full">
                 <div className="flex items-center gap-2 mb-6 text-slate-500">
                     <Calculator size={20} />
                     <h3 className="font-bold text-lg">Simulador de Bellman</h3>
                 </div>
                 
                 {/* Visual Equation */}
                 <div className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-mono font-bold text-slate-700 mb-10 bg-slate-100 p-6 rounded-xl overflow-x-auto">
                     <span className="text-slate-400">{oldQ.toFixed(1)}</span>
                     <span>+</span>
                     <span className="text-blue-600">{alpha.toFixed(2)}</span>
                     <span>×</span>
                     <span>(</span>
                     <span className="text-green-600">{reward}</span>
                     <span>+</span>
                     <span>(</span>
                     <span className="text-purple-600">{gamma.toFixed(2)}</span>
                     <span>×</span>
                     <span className="text-slate-500">{maxQNext.toFixed(1)}</span>
                     <span>)</span>
                     <span>-</span>
                     <span className="text-slate-400">{oldQ.toFixed(1)}</span>
                     <span>)</span>
                     <span>=</span>
                     <span className="bg-indigo-600 text-white px-3 py-1 rounded shadow-lg">{bellmanResult.toFixed(2)}</span>
                 </div>

                 {/* Controls */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                         <div className="flex justify-between text-sm font-bold text-blue-600">
                             <label>Taxa de Aprendizado (α)</label>
                             <span>{alpha.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0.1" max="1.0" step="0.1" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-blue-600 cursor-pointer"/>
                         <p className="text-xs text-slate-400">Alto = Aprende rápido (impulsivo). Baixo = Aprende devagar.</p>
                     </div>

                     <div className="space-y-4">
                         <div className="flex justify-between text-sm font-bold text-purple-600">
                             <label>Fator de Desconto (γ)</label>
                             <span>{gamma.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0.1" max="1.0" step="0.1" value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))} className="w-full accent-purple-600 cursor-pointer"/>
                         <p className="text-xs text-slate-400">Alto = Visionário. Baixo = Imediatista.</p>
                     </div>
                 </div>

                 <div className="mt-8 flex justify-center">
                     <button onClick={() => { setOldQ(bellmanResult); }} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all">
                         <RefreshCw size={16} /> Aplicar Resultado como Novo Q
                     </button>
                 </div>
             </div>
          </div>
      )
  }

  // 5. EPSILON SLIDER (Interactive)
  if (visualState === 'epsilon_greedy') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-8 bg-slate-50">
              <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Ajuste o Epsilon (ε)</h3>
                  <p className="text-slate-500 text-sm">Controle a "curiosidade" da IA em tempo real.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-xl">
                  {/* Slider Visual */}
                  <div className="relative h-12 bg-slate-100 rounded-full flex items-center px-2 mb-8 shadow-inner overflow-hidden">
                      <div 
                        className="absolute left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 opacity-20"
                        style={{ width: `${epsilon}%` }}
                      ></div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={epsilon} 
                        onChange={(e) => setEpsilon(parseInt(e.target.value))} 
                        className="w-full relative z-10 accent-indigo-600 cursor-pointer"
                      />
                  </div>

                  <div className="flex justify-between items-start mb-8">
                      <div className={`text-center transition-all ${epsilon < 50 ? 'opacity-30 scale-90' : 'opacity-100 scale-110'}`}>
                          <span className="text-4xl block mb-2">🎲</span>
                          <span className="font-bold text-indigo-600 block">Exploração</span>
                          <span className="text-xs text-slate-400">{epsilon}% Chance</span>
                      </div>
                      
                      <div className="text-center px-4 py-2 bg-slate-100 rounded-lg">
                          <span className="font-mono font-bold text-xl text-slate-700">ε = {epsilon/100}</span>
                      </div>

                      <div className={`text-center transition-all ${epsilon > 50 ? 'opacity-30 scale-90' : 'opacity-100 scale-110'}`}>
                          <span className="text-4xl block mb-2">🚜</span>
                          <span className="font-bold text-emerald-600 block">Exploitation</span>
                          <span className="text-xs text-slate-400">{100 - epsilon}% Chance</span>
                      </div>
                  </div>

                  {/* Simulation Box */}
                  <div className="bg-slate-900 rounded-xl p-4 text-center">
                       <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Próxima Ação da IA</p>
                       <div className="font-mono text-lg text-white">
                           {Math.random() * 100 < epsilon 
                                ? <span className="text-indigo-400 animate-pulse">🎲 Aleatória (Descobrindo...)</span> 
                                : <span className="text-emerald-400">🧠 Melhor Jogada (Q-Table)</span>
                           }
                       </div>
                  </div>
              </div>
          </div>
      )
  }

  if (visualState === 'architecture') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                  <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:border-emerald-300 hover:scale-105 transition-all cursor-default">
                      <Server size={64} className="text-emerald-500 mb-4"/>
                      <span className="font-bold text-slate-700 text-xl">ambiente.py</span>
                      <span className="text-sm text-slate-400 mt-2">Regras do Mundo</span>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:border-indigo-300 hover:scale-105 transition-all cursor-default">
                      <Brain size={64} className="text-indigo-500 mb-4"/>
                      <span className="font-bold text-slate-700 text-xl">agente.py</span>
                      <span className="text-sm text-slate-400 mt-2">Cérebro (Q-Table)</span>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:border-amber-300 hover:scale-105 transition-all cursor-default">
                      <PlayCircle size={64} className="text-amber-500 mb-4"/>
                      <span className="font-bold text-slate-700 text-xl">treinador.py</span>
                      <span className="text-sm text-slate-400 mt-2">Loop de Treino</span>
                  </div>
                   <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:border-slate-300 hover:scale-105 transition-all cursor-default">
                      <Folder size={64} className="text-slate-500 mb-4"/>
                      <span className="font-bold text-slate-700 text-xl">jogar.py</span>
                      <span className="text-sm text-slate-400 mt-2">Teste Final</span>
                  </div>
              </div>
          </div>
      )
  }
  
  if (visualState === 'quiz_static') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white p-6 text-center animate-in zoom-in duration-500">
              <Brain size={120} className="mb-8 text-indigo-200 opacity-50" />
              <h3 className="text-4xl font-bold mb-4">Quiz: Q-Learning</h3>
              <p className="opacity-80 text-xl">Mostre que você domina a arte de criar cérebros de IA.</p>
          </div>
      )
  }

  // --- DEFAULT BOARD RENDER (Zeros, Critical, etc) ---
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4">
      <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-6 flex items-center gap-3">
        {visualState === 'q_table_zeros' ? 'Q-Table Vazia (Início)' : 
         visualState === 'critical_defense' ? 'Sua Vez: Impeça a Vitória!' : 'Jogo da Velha'}
         
         {visualState === 'critical_defense' && <MousePointerClick className="text-indigo-500 animate-bounce" size={24} />}
      </h3>

      {/* Fluid Grid Container */}
      <div className="grid grid-cols-3 gap-3 bg-slate-300 p-3 rounded-2xl relative w-full max-w-lg aspect-square shadow-2xl">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={visualState !== 'critical_defense' || interactionState !== 'waiting' || !!cell}
            className={`w-full h-full flex items-center justify-center text-4xl md:text-6xl font-bold rounded-xl shadow-sm transition-all duration-300 relative
                ${!cell && visualState === 'critical_defense' && interactionState === 'waiting' ? 'hover:bg-indigo-100 cursor-pointer active:scale-95' : 'cursor-default'}
            `}
            style={{ backgroundColor: cell ? '#fff' : (visualState === 'q_table_zeros' || interactionState === 'success') ? getQColor(qValues[idx]) : '#fff' }}
          >
            <span className={cell === 'X' ? 'text-red-500' : 'text-blue-500'}>{cell}</span>
            
            {/* Visualização do Valor Q (número pequeno no canto) */}
            {(visualState === 'q_table_zeros' || (visualState === 'critical_defense' && interactionState === 'success')) && !cell && (
               <span className={`absolute bottom-2 right-2 text-sm font-mono font-bold ${visualState === 'critical_defense' && idx === 8 ? 'text-emerald-600 scale-125' : 'text-slate-400'}`}>
                 {qValues[idx].toFixed(2)}
               </span>
            )}
          </button>
        ))}

        {/* FAIL OVERLAY */}
        {visualState === 'critical_defense' && interactionState === 'fail' && (
            <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-white animate-in zoom-in z-20">
                <AlertTriangle size={64} className="mb-4 text-red-200" />
                <h4 className="font-bold text-3xl mb-2">Você Perdeu!</h4>
                <p className="text-lg text-red-200 mb-8 text-center px-4">O 'X' jogaria na posição 8 e faria uma linha.</p>
                <button onClick={resetCriticalDefense} className="bg-white text-red-900 px-8 py-3 rounded-xl font-bold hover:bg-red-50 text-lg shadow-lg">Tentar de novo</button>
            </div>
        )}

         {/* SUCCESS OVERLAY - Minimal */}
         {visualState === 'critical_defense' && interactionState === 'success' && (
             <div className="absolute -bottom-24 left-0 right-0 text-center animate-in slide-in-from-bottom-4">
                 <div className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-2xl inline-flex items-center gap-3 shadow-xl border-2 border-emerald-200">
                     <CheckCircle2 size={24} />
                     <span className="font-bold text-lg">Boa! Q-Value: 0.80</span>
                 </div>
                 <button onClick={resetCriticalDefense} className="block mx-auto mt-4 text-sm text-slate-400 underline hover:text-indigo-600">Reiniciar</button>
             </div>
         )}
      </div>
      
      <div className="mt-8 text-sm md:text-base text-slate-500 text-center max-w-md h-8">
         {visualState === 'critical_defense' && interactionState === 'waiting' && (
             <span className="text-indigo-600 font-bold animate-pulse">Clique no quadrado certo para bloquear o X!</span>
         )}
         {visualState === 'q_table_zeros' && "Tudo é 0.0. A IA não sabe nada e joga o dado."}
      </div>
    </div>
  );
};

export default Phase2Visual;