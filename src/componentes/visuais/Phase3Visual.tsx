import React, { useState, useEffect } from 'react';
import { Flag, Skull, Bot, Brain, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MapPin, Zap, RefreshCw, PlayCircle, Navigation, Braces, Ticket } from 'lucide-react';

interface Props {
  visualState: string;
}

const Phase3Visual: React.FC<Props> = ({ visualState }) => {
  // Estado para o mini-game jogável
  const [agentPos, setAgentPos] = useState({ r: 3, c: 1 }); // Start pos
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [steps, setSteps] = useState(0);

  // Reset quando mudar o visualState para um estado que não seja o game
  useEffect(() => {
    if (visualState === 'rewards_cost') {
        resetGame();
    }
  }, [visualState]);

  const resetGame = () => {
      setAgentPos({ r: 3, c: 1 });
      setScore(0);
      setGameStatus('playing');
      setSteps(0);
  };

  const moveAgent = (dr: number, dc: number) => {
      if (gameStatus !== 'playing') return;

      setSteps(prev => prev + 1);
      
      const nextR = agentPos.r + dr;
      const nextC = agentPos.c + dc;

      // Check Bounds
      if (nextR < 0 || nextR >= 5 || nextC < 0 || nextC >= 5) {
          // Hit Wall (Boundaries)
          setScore(prev => Number((prev - 0.5).toFixed(1)));
          return; // Don't move
      }

      const cellType = gridLayout[nextR][nextC];

      if (cellType === 'X') {
          // Hit Wall (Inner)
          setScore(prev => Number((prev - 0.5).toFixed(1)));
          return; // Don't move
      }

      // Valid Move
      setAgentPos({ r: nextR, c: nextC });
      
      // Cost of Step
      let moveReward = -0.1;

      if (cellType === 'G') {
          setScore(prev => Number((prev + 10.0 + moveReward).toFixed(1)));
          setGameStatus('won');
      } else {
          setScore(prev => Number((prev + moveReward).toFixed(1)));
      }
  };


  // Grid 5x5 estático para demonstração
  // S = Start, G = Goal, X = Wall/Trap, . = Empty, A = Agent (Example Position)
  const gridLayout = [
    ['.', '.', '.', 'X', 'G'],
    ['.', 'X', '.', '.', '.'],
    ['.', '.', '.', 'X', '.'],
    ['S', '.', 'X', '.', '.'], // Agent starts at S usually, but fixed at (3,1) for intro
    ['.', '.', '.', '.', '.']
  ];

  // Renderiza o conteúdo de cada célula baseado no estado visual
  const renderCellContent = (row: number, col: number, type: string) => {
    // 4. RECOMPENSAS (PLAYABLE MODE)
    if (visualState === 'rewards_cost') {
        // Render Static Elements
        if (type === 'G') return <div className="flex flex-col items-center justify-center w-full h-full"><Flag className="text-emerald-600 w-1/2 h-1/2" /><span className="text-[10px] md:text-sm font-bold text-emerald-600">+10</span></div>;
        if (type === 'X') return <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center"><Skull className="text-slate-600 w-1/2 h-1/2" /><span className="text-[8px] md:text-xs text-red-400">-0.5</span></div>;
        if (type === 'S') return <div className="text-[10px] md:text-xs text-slate-400 font-bold">Start</div>;

        // Render Agent (Dynamic)
        if (row === agentPos.r && col === agentPos.c) {
            return (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-100/50 rounded-full animate-pulse z-10 p-1">
                     <Bot className="text-blue-600 w-3/4 h-3/4" />
                </div>
            )
        }
        return null;
    }

    // 1. INTRO / DEFAULT
    if (visualState === 'architecture_phase3') {
        if (type === 'S') return <div className="w-4 h-4 bg-blue-300 rounded-full" />;
        // Static Agent for Intro
        if (row === 3 && col === 1) return <Bot className="text-blue-600 animate-bounce w-3/4 h-3/4" />;
        if (type === 'G') return <Flag className="text-emerald-600 w-3/4 h-3/4" />;
        if (type === 'X') return <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Skull className="text-slate-600 w-1/2 h-1/2" /></div>;
        return null;
    }

    // 2. COORDENADAS (Show (1,1) highlight)
    if (visualState === 'state_coords') {
        // Highlight (1,1) specifically as per text example
        if (row === 1 && col === 1) {
            return (
                <div className="flex flex-col items-center justify-center w-full h-full bg-indigo-100 border-2 border-indigo-500 animate-pulse">
                     <Bot className="text-indigo-600 w-1/2 h-1/2" />
                     <span className="text-[10px] md:text-sm font-mono font-bold text-indigo-800 mt-1">(1, 1)</span>
                </div>
            )
        }
        // Show dim coords for others
        return <span className="text-[8px] md:text-xs text-slate-300 font-mono">({row},{col})</span>
    }

    // 3. AÇÕES (Arrows)
    if (visualState === 'actions_arrows') {
         if (row === 1 && col === 1) {
             return (
                 <div className="relative w-full h-full flex items-center justify-center">
                     <Bot className="text-blue-600 w-1/2 h-1/2" />
                     <ArrowUp className="absolute -top-1 md:top-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
                     <ArrowDown className="absolute -bottom-1 md:bottom-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
                     <ArrowLeft className="absolute -left-1 md:left-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
                     <ArrowRight className="absolute -right-1 md:right-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
                 </div>
             )
         }
         if (type === 'X') return <div className="w-full h-full bg-slate-200"></div>;
         return null;
    }
    
    // 5. Q-TABLE NAV (Show arrows with values)
    if (visualState === 'q_table_nav') {
        // Example cell (1,1)
        if (row === 1 && col === 1) {
            return (
                 <div className="relative w-full h-full flex items-center justify-center bg-blue-50 border border-blue-200 p-1">
                     <Bot className="text-blue-600 opacity-20 w-1/2 h-1/2" />
                     {/* Best Action */}
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-1">
                         <ArrowRight className="text-emerald-600 w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
                     </div>
                     <span className="absolute right-1 bottom-0 text-[8px] md:text-xs text-emerald-700 font-bold">0.8</span>
                     
                     {/* Bad Action */}
                     <ArrowUp className="absolute top-1 text-red-300 w-3 h-3" />
                     <ArrowLeft className="absolute left-1 text-red-300 w-3 h-3" />
                     <ArrowDown className="absolute bottom-1 text-slate-300 w-3 h-3" />
                 </div>
            )
        }
        if (type === 'X') return <div className="w-full h-full bg-slate-200"></div>;
        return <span className="text-[10px] md:text-xs text-slate-200 font-bold">?</span>;
    }

    return null;
  };

  // --- QUIZ RENDER ---
  if (visualState === 'quiz_static') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white p-6 text-center animate-in zoom-in duration-500">
              <Brain size={120} className="mb-4 text-indigo-200 opacity-50" />
              <h3 className="text-4xl font-bold mb-4">Quiz: Labirinto</h3>
              <p className="opacity-80 text-lg">Mostre que você não se perde nas coordenadas.</p>
          </div>
      )
  }
  
  // --- 1. INTRO (ROADMAP FASE 3) ---
  if (visualState === 'intro_maze') {
      return (
        <div className="flex flex-col h-full w-full max-w-2xl px-6 py-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                  <MapPin size={32} className="text-emerald-600" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800">Aprendendo a Navegar</h3>
                  <p className="text-slate-500 text-sm">Do tabuleiro estático para o mundo espacial</p>
              </div>
          </div>

          <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              {/* Item 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Navigation size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">Mundo em Grade</div>
                      </div>
                      <div className="text-slate-500 text-xs">Transformando espaço físico em dados matemáticos.</div>
                  </div>
              </div>

              {/* Item 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Braces size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">Tuplas & Coordenadas</div>
                      </div>
                      <div className="text-slate-500 text-xs">A estrutura de dados (x, y) que define "Onde estou?".</div>
                  </div>
              </div>

               {/* Item 3 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Ticket size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">Custo de Vida</div>
                      </div>
                      <div className="text-slate-500 text-xs">Usando recompensas negativas para forçar a eficiência.</div>
                  </div>
              </div>

              {/* Item 4 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Brain size={14} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-700">Generalização</div>
                      </div>
                      <div className="text-slate-500 text-xs">Aplicando o mesmo cérebro em problemas totalmente diferentes.</div>
                  </div>
              </div>

          </div>
        </div>
      );
  }

  // --- ARCHITECTURE RENDER ---
  if (visualState === 'architecture_phase3') {
     return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-8">
            <h3 className="font-bold text-slate-700 text-2xl">A Mesma Estrutura, Novo Problema</h3>
            <div className="flex gap-8 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white border-4 border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                    <span className="text-4xl md:text-6xl">❌⭕</span>
                    <span className="text-sm md:text-lg text-slate-400 mt-4 font-bold">Fase 2</span>
                </div>
                <div className="flex flex-col justify-center">
                   <ArrowRight className="text-indigo-500 w-12 h-12" />
                </div>
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white border-4 border-indigo-500 rounded-2xl flex flex-col items-center justify-center shadow-xl transform scale-105">
                    <span className="text-4xl md:text-6xl">🗺️</span>
                    <span className="text-sm md:text-lg text-indigo-600 font-bold mt-4">Fase 3</span>
                </div>
            </div>
            <p className="text-base text-center text-slate-500 max-w-md">
                O código de Q-Learning (agente.py) permanece 90% igual. Apenas o ambiente (regras e estados) muda radicalmente.
            </p>
        </div>
     );
  }

  // --- GRID RENDER ---
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="flex justify-between items-center w-full max-w-lg mb-6">
        <h3 className="text-lg md:text-xl font-bold text-slate-500 uppercase tracking-widest">
            {visualState === 'rewards_cost' ? 'Modo Interativo' : 
            visualState === 'state_coords' ? 'Sistema de Coordenadas' : 'Grid World'}
        </h3>
        
        {visualState === 'rewards_cost' && (
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <div className="text-sm font-bold text-slate-600">
                    Energia: <span className={score < 0 ? 'text-red-500' : 'text-emerald-600'}>{score.toFixed(1)}</span>
                </div>
                <button onClick={resetGame} className="text-slate-400 hover:text-indigo-600 transition-colors"><RefreshCw size={18} /></button>
            </div>
        )}
      </div>

      {/* Responsive Grid Container */}
      <div className="w-full max-w-lg aspect-square grid grid-cols-5 gap-2 bg-white p-2 border-4 border-slate-200 rounded-xl shadow-2xl relative">
        {gridLayout.map((row, rIdx) => (
            row.map((cell, cIdx) => (
                <div 
                    key={`${rIdx}-${cIdx}`}
                    className={`w-full h-full flex items-center justify-center border-2 border-slate-50 rounded relative overflow-hidden transition-colors
                        ${visualState === 'intro_maze' && cell === 'X' ? 'bg-slate-800' : 'bg-slate-50/50'}
                        ${visualState === 'rewards_cost' && cell === 'X' ? 'bg-red-50' : ''}
                        ${visualState === 'rewards_cost' && cell === 'G' ? 'bg-emerald-50' : ''}
                        ${visualState !== 'intro_maze' && visualState !== 'rewards_cost' ? 'bg-white' : ''}
                    `}
                >
                    {/* Corner Coords for reference */}
                    {visualState === 'intro_maze' && (
                        <span className="absolute top-1 left-1 text-[8px] text-slate-300">{rIdx},{cIdx}</span>
                    )}

                    {renderCellContent(rIdx, cIdx, cell)}
                </div>
            ))
        ))}

        {/* Game Over / Win Overlay */}
        {visualState === 'rewards_cost' && gameStatus !== 'playing' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20 animate-in fade-in zoom-in duration-300">
                {gameStatus === 'won' ? (
                    <div className="text-center">
                        <Flag className="text-emerald-500 w-24 h-24 mx-auto mb-4 animate-bounce" />
                        <h4 className="font-bold text-emerald-600 text-3xl mb-2">Chegou!</h4>
                        <p className="text-lg text-slate-600 font-mono">Score Final: {score}</p>
                    </div>
                ) : null}
                <button 
                    onClick={resetGame} 
                    className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
                >
                    Tentar Novamente
                </button>
            </div>
        )}
      </div>

      {/* Controls for Playable Mode - Enhanced */}
      {visualState === 'rewards_cost' && gameStatus === 'playing' && (
          <div className="mt-8 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Controle o Robô</p>
              <div className="flex flex-col items-center gap-2">
                  <button onClick={() => moveAgent(-1, 0)} className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"><ArrowUp size={24}/></button>
                  <div className="flex gap-2">
                      <button onClick={() => moveAgent(0, -1)} className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"><ArrowLeft size={24}/></button>
                      <button onClick={() => moveAgent(1, 0)} className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"><ArrowDown size={24}/></button>
                      <button onClick={() => moveAgent(0, 1)} className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"><ArrowRight size={24}/></button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Legend */}
      {visualState !== 'rewards_cost' && (
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-600">
            <div className="flex items-center gap-2"><Bot size={20} className="text-blue-600"/> Agente</div>
            <div className="flex items-center gap-2"><Flag size={20} className="text-emerald-600"/> Objetivo</div>
        </div>
      )}
    </div>
  );
};

export default Phase3Visual;