import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { CURRICULUM } from './constants';
import { AppState, QuizQuestion } from './types';
import Phase1Visual from './components/visuals/Phase1Visual';
import Phase2Visual from './components/visuals/Phase2Visual';
import Phase3Visual from './components/visuals/Phase3Visual';
import { askAiTutor } from './services/geminiService';
import { saveProgress, loadProgress, clearProgress } from './services/storageService';
import { ChevronRight, ChevronLeft, Lightbulb, CheckCircle2, BookOpen, Play, Lock, Award, RefreshCcw, Brain, RotateCcw, AlertTriangle, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const App: React.FC = () => {
  // Inicialização Lazy: Tenta carregar do "arquivo" antes de definir o estado inicial
  const [state, setState] = useState<AppState>(() => {
      const saved = loadProgress();
      if (saved) {
          return saved;
      }
      return {
        currentPhaseIndex: 0,
        currentStepIndex: 0,
        completedPhases: [],
        quizScores: {},
        isQuizMode: false,
        maxStepReached: { 0: 0 }
      };
  });

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Quiz State
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Efeito para salvar o progresso automaticamente sempre que o estado mudar
  useEffect(() => {
      saveProgress(state);
  }, [state]);

  const currentPhase = CURRICULUM[state.currentPhaseIndex];
  const currentStep = currentPhase.steps[state.currentStepIndex];
  const isVideoStep = currentStep.type === 'video';
  const isQuizStep = currentStep.type === 'quiz';

  // Handlers
  const handleNext = () => {
    setAiExplanation(null);
    const isLastStep = state.currentStepIndex === currentPhase.steps.length - 1;

    if (isLastStep) {
       // Se for o último passo, não faz nada aqui, a lógica de passar fase é via Quiz ou botão de conclusão se não tiver quiz
    } else {
      setState(prev => {
        const nextStep = prev.currentStepIndex + 1;
        const currentPhaseMax = prev.maxStepReached[prev.currentPhaseIndex] || 0;
        
        return { 
            ...prev, 
            currentStepIndex: nextStep,
            maxStepReached: {
                ...prev.maxStepReached,
                [prev.currentPhaseIndex]: Math.max(currentPhaseMax, nextStep)
            }
        };
      });
    }
  };

  const handlePrev = () => {
    setAiExplanation(null);
    if (state.isQuizMode) {
        setState(prev => ({ ...prev, isQuizMode: false }));
        return;
    }

    if (state.currentStepIndex > 0) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }));
    } else if (state.currentPhaseIndex > 0) {
      const prevPhaseIndex = state.currentPhaseIndex - 1;
      const prevPhase = CURRICULUM[prevPhaseIndex];
      setState(prev => ({
        ...prev,
        currentPhaseIndex: prevPhaseIndex,
        currentStepIndex: prevPhase.steps.length - 1
      }));
    }
  };

  const handleStartQuiz = () => {
      setState(prev => ({ ...prev, isQuizMode: true }));
      setCurrentQuizQuestionIndex(0);
      setQuizAnswers({});
      setQuizSubmitted(false);
  }

  const handleQuizAnswer = (optionIndex: number) => {
      if (quizSubmitted) return;
      const question = currentStep.quizData![currentQuizQuestionIndex];
      setQuizAnswers(prev => ({...prev, [question.id]: optionIndex}));
  }

  const submitQuiz = () => {
      setQuizSubmitted(true);
      // Calculate Score
      let correct = 0;
      currentStep.quizData!.forEach(q => {
          if (quizAnswers[q.id] === q.correctIndex) correct++;
      });
      const score = (correct / currentStep.quizData!.length) * 100;
      
      setState(prev => ({
          ...prev,
          quizScores: { ...prev.quizScores, [currentPhase.id]: score }
      }));
  }

  const advancePhase = () => {
      const nextPhaseIdx = state.currentPhaseIndex + 1;
      if (nextPhaseIdx < CURRICULUM.length) {
          setState(prev => ({
              ...prev,
              currentPhaseIndex: nextPhaseIdx,
              currentStepIndex: 0,
              completedPhases: [...prev.completedPhases, currentPhase.id],
              isQuizMode: false,
              maxStepReached: {
                  ...prev.maxStepReached,
                  [nextPhaseIdx]: 0
              }
          }));
      }
  }

  const handleAskAi = async () => {
    if (loadingAi) return;
    setLoadingAi(true);
    const result = await askAiTutor(currentPhase.title, currentStep.title, currentStep.content);
    setAiExplanation(result);
    setLoadingAi(false);
  };

  // Easter Egg: Unlock all phases
  const handleDevUnlock = (e: React.MouseEvent) => {
    if (e.shiftKey && e.altKey) {
        const allPhaseIds = CURRICULUM.map(p => p.id);
        
        // Calculate max steps for all phases to unlock everything
        const allMaxSteps: Record<number, number> = {};
        CURRICULUM.forEach((p, idx) => {
            allMaxSteps[idx] = p.steps.length - 1;
        });

        setState(prev => ({
            ...prev,
            completedPhases: allPhaseIds,
            maxStepReached: allMaxSteps
        }));
        alert("🔓 Modo Dev: Todas as fases e passos desbloqueados!");
    }
  };

  // Helper to jump to a specific phase (only if unlocked)
  const jumpToPhase = (index: number) => {
     if (index === 0 || state.completedPhases.includes(CURRICULUM[index-1].id) || state.completedPhases.length === CURRICULUM.length) {
         setState(prev => ({
             ...prev,
             currentPhaseIndex: index,
             currentStepIndex: 0,
             isQuizMode: false
         }));
     }
  }

  // Helper to jump directly to a step
  const jumpToStep = (phaseIndex: number, stepIndex: number) => {
      // Logic for locking individual steps
      const isPhaseCompleted = state.completedPhases.includes(CURRICULUM[phaseIndex].id);
      const maxReached = state.maxStepReached[phaseIndex] || 0;
      const isStepLocked = !isPhaseCompleted && stepIndex > maxReached;

      if (isStepLocked) return;

      setState(prev => ({
          ...prev,
          currentPhaseIndex: phaseIndex,
          currentStepIndex: stepIndex,
          isQuizMode: false
      }));
      setAiExplanation(null);
  }

  // Reset Progress Logic
  const confirmReset = () => {
    clearProgress(); // Limpa o arquivo de save
    setState({
        currentPhaseIndex: 0,
        currentStepIndex: 0,
        completedPhases: [],
        quizScores: {},
        isQuizMode: false,
        maxStepReached: { 0: 0 }
    });
    setAiExplanation(null);
    setQuizSubmitted(false);
    setQuizAnswers({});
    setCurrentQuizQuestionIndex(0);
    setShowResetConfirm(false);
  }

  const renderVisual = () => {
    switch (currentPhase.id) {
      case 1: return <Phase1Visual visualState={currentStep.visualState} />;
      case 2: return <Phase2Visual visualState={currentStep.visualState} />;
      case 3: return <Phase3Visual visualState={currentStep.visualState} />;
      default: return <div>Visual não encontrado</div>;
    }
  };

  // --- RENDERING ---
  const currentQuizScore = state.quizScores[currentPhase.id];
  const passedQuiz = currentQuizScore >= 75;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col md:flex-row font-sans text-slate-800 relative transition-all duration-300 overflow-hidden">
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Reiniciar Progresso?</h3>
                <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
                    Você perderá todas as suas conquistas e voltará para o início da <strong>Fase 1</strong>. As fases futuras serão bloqueadas novamente.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowResetConfirm(false)}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmReset}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold shadow-lg shadow-red-200 transition-colors"
                    >
                        Sim, Reiniciar
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Sidebar - Collapsible */}
      <aside 
        className={`${isSidebarOpen ? 'w-full md:w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none p-0 overflow-hidden'} bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0 transition-all duration-500 ease-in-out h-screen`}
      >
        <div className="p-6 border-b border-slate-100 select-none" onDoubleClick={handleDevUnlock}>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight cursor-default">
            <BookOpen size={24} className="text-indigo-600" />
            <span className="truncate">Aprendendo IA</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium truncate">Jornada Interativa v2.0</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {CURRICULUM.map((phase, idx) => {
             // Unlock logic for Phase
             const isPhaseLocked = idx > 0 && !state.completedPhases.includes(CURRICULUM[idx-1].id) && !state.completedPhases.includes(phase.id);
             
             return (
                <div 
                    key={phase.id} 
                    className={`transition-all duration-300 ${isPhaseLocked ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}
                >
                <div 
                    className={`flex items-center gap-3 mb-3 cursor-pointer ${!isPhaseLocked ? 'hover:bg-slate-50 p-2 rounded-lg -ml-2' : ''}`}
                    onClick={() => jumpToPhase(idx)}
                >
                    {state.completedPhases.includes(phase.id) ? (
                    <div className="bg-emerald-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-emerald-600" /></div>
                    ) : isPhaseLocked ? (
                    <div className="bg-slate-100 p-1 rounded-full"><Lock size={14} className="text-slate-400" /></div>
                    ) : (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${idx === state.currentPhaseIndex ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-300 text-slate-500'}`}>
                        {phase.id}
                    </div>
                    )}
                    <h3 className="font-bold text-sm text-slate-700">{phase.title}</h3>
                </div>
                <ul className="ml-3 pl-3 border-l border-slate-200 space-y-3">
                    {phase.steps.map((step, sIdx) => {
                    const isActive = idx === state.currentPhaseIndex && sIdx === state.currentStepIndex && !state.isQuizMode;
                    const isPhaseCompleted = state.completedPhases.includes(phase.id);
                    const maxReached = state.maxStepReached[idx] || 0;
                    // Step is locked if phase is NOT completed AND step index is beyond max reached
                    const isStepLocked = !isPhaseCompleted && sIdx > maxReached;

                    return (
                        <li 
                            key={step.id} 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isStepLocked) jumpToStep(idx, sIdx);
                            }}
                            className={`text-sm transition-colors flex items-center justify-between group 
                                ${isStepLocked ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer hover:text-indigo-600'} 
                                ${isActive ? 'text-indigo-600 font-semibold' : !isStepLocked ? 'text-slate-500' : ''}`}
                        >
                        <span className="leading-snug">{step.title}</span>
                        {isStepLocked && <Lock size={10} className="text-slate-200 shrink-0" />}
                        </li>
                    );
                    })}
                </ul>
                </div>
             );
          })}
        </nav>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button 
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
            >
                <RotateCcw size={14} />
                <span>Resetar Progresso</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-[#faf9f6] h-screen overflow-hidden">
        
        {/* Quiz Mode Overlay */}
        {state.isQuizMode && isQuizStep ? (
             <div className="absolute inset-0 z-20 bg-[#faf9f6] flex flex-col p-8 overflow-y-auto">
                 <div className="max-w-3xl mx-auto w-full">
                     <button onClick={() => setState(prev => ({...prev, isQuizMode: false}))} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800"><ChevronLeft size={16}/> Voltar ao conteúdo</button>
                     
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                         <div className="flex justify-between items-center mb-8">
                             <h2 className="text-2xl font-bold text-slate-800">Quiz: {currentPhase.title}</h2>
                             {!quizSubmitted && <span className="text-sm font-mono text-slate-400">Questão {currentQuizQuestionIndex + 1} de {currentStep.quizData?.length}</span>}
                         </div>

                         {!quizSubmitted ? (
                             <div className="animate-in fade-in slide-in-from-right-4 duration-300" key={currentQuizQuestionIndex}>
                                 <h3 className="text-lg font-medium text-slate-800 mb-6">{currentStep.quizData![currentQuizQuestionIndex].question}</h3>
                                 <div className="space-y-3">
                                     {currentStep.quizData![currentQuizQuestionIndex].options.map((opt, oIdx) => (
                                         <button 
                                            key={oIdx}
                                            onClick={() => handleQuizAnswer(oIdx)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${quizAnswers[currentStep.quizData![currentQuizQuestionIndex].id] === oIdx ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
                                         >
                                             {opt}
                                         </button>
                                     ))}
                                 </div>
                                 <div className="flex justify-between mt-8">
                                     <button 
                                        disabled={currentQuizQuestionIndex === 0}
                                        onClick={() => setCurrentQuizQuestionIndex(p => p - 1)}
                                        className="text-slate-400 disabled:opacity-30 hover:text-slate-600 px-4 py-2"
                                     >
                                         Anterior
                                     </button>
                                     {currentQuizQuestionIndex < currentStep.quizData!.length - 1 ? (
                                         <button 
                                            onClick={() => setCurrentQuizQuestionIndex(p => p + 1)}
                                            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900"
                                         >
                                             Próxima
                                         </button>
                                     ) : (
                                         <button 
                                            onClick={submitQuiz}
                                            disabled={Object.keys(quizAnswers).length !== currentStep.quizData!.length}
                                            className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                                         >
                                             Finalizar Quiz
                                         </button>
                                     )}
                                 </div>
                             </div>
                         ) : (
                             <div className="text-center py-12 animate-in zoom-in duration-500">
                                 {passedQuiz ? (
                                     <>
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                            <Award size={48} />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-800 mb-2">Parabéns!</h3>
                                        <p className="text-slate-600 mb-8">Você acertou <span className="font-bold text-emerald-600">{currentQuizScore.toFixed(0)}%</span> do teste.</p>
                                        <button onClick={advancePhase} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all">
                                            Avançar para Próxima Fase
                                        </button>
                                     </>
                                 ) : (
                                     <>
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                            <RefreshCcw size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Vamos tentar de novo?</h3>
                                        <p className="text-slate-600 mb-8">Você acertou {currentQuizScore.toFixed(0)}%. É necessário 75% para avançar.</p>
                                        <button onClick={handleStartQuiz} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900">
                                            Refazer Quiz
                                        </button>
                                     </>
                                 )}
                                 
                                 {/* Gabarito Simples */}
                                 <div className="mt-12 text-left border-t pt-8">
                                     <h4 className="font-bold text-slate-700 mb-4">Gabarito e Explicações:</h4>
                                     <div className="space-y-6">
                                         {currentStep.quizData!.map((q, idx) => (
                                             <div key={idx} className={`p-4 rounded-lg ${quizAnswers[q.id] === q.correctIndex ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                                                 <p className="font-medium text-slate-800 text-sm mb-2">{idx+1}. {q.question}</p>
                                                 <p className="text-xs text-slate-500 italic">{q.explanation}</p>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             </div>
        ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative h-full">
            
            {/* Expand/Collapse Button - Floating */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:scale-110 transition-all"
                title={isSidebarOpen ? "Recolher Menu" : "Expandir Menu"}
            >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>


            {/* Left Panel: Content */}
            <div 
                className={`w-full md:w-1/2 h-full overflow-y-auto custom-scrollbar bg-[#faf9f6] px-8 md:px-12 py-8 md:py-12 transition-all duration-300`}
            >
                <div className="max-w-xl mx-auto w-full fade-in pb-20" key={currentStep.id}>
                
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 pl-8">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                        Fase {currentPhase.id}
                    </span>
                    <span className="text-slate-400 text-xs">Passo {state.currentStepIndex + 1} de {currentPhase.steps.length}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">{currentStep.title}</h2>
                
                {/* Body Content */}
                {isVideoStep ? (
                    <div className="mb-8">
                         <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={currentStep.videoUrl} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                         </div>
                         <p className="mt-4 text-slate-600">{currentStep.content}</p>
                    </div>
                ) : isQuizStep ? (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Desafio Final</h3>
                            <p className="text-indigo-100 mb-6">Prove que você dominou os conceitos desta fase para desbloquear a próxima etapa da jornada.</p>
                            <button 
                                onClick={handleStartQuiz}
                                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                Iniciar Quiz <ChevronRight size={18}/>
                            </button>
                        </div>
                        {/* Fix: Brain component is now imported correctly */}
                        <Brain className="absolute -bottom-8 -right-8 text-white opacity-10" size={200} />
                    </div>
                ) : (
                    <div className="markdown-content text-lg text-slate-600 leading-relaxed mb-8">
                        <ReactMarkdown>{currentStep.content}</ReactMarkdown>
                    </div>
                )}

                {/* AI Tutor */}
                {!isQuizStep && (
                    <div className="mb-8 border-t border-slate-100 pt-6">
                        {!aiExplanation ? (
                            <button 
                            onClick={handleAskAi}
                            disabled={loadingAi}
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium disabled:opacity-50"
                            >
                            <Lightbulb size={18} />
                            {loadingAi ? "Tutor IA pensando..." : "Me dê um exemplo diferente (Tutor IA)"}
                            </button>
                        ) : (
                        <div className="bg-white border border-indigo-100 p-5 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-start gap-3">
                                <div className="bg-indigo-100 p-1.5 rounded-lg shrink-0">
                                    <Lightbulb className="text-indigo-600" size={18} />
                                </div>
                                <div>
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{aiExplanation}</p>
                                <button onClick={() => setAiExplanation(null)} className="text-xs text-slate-400 mt-3 hover:text-indigo-600 font-medium">Fechar explicação</button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-12">
                    <button 
                    onClick={handlePrev} 
                    disabled={state.currentPhaseIndex === 0 && state.currentStepIndex === 0}
                    className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-sm font-medium"
                    >
                    <ChevronLeft size={16} />
                    Anterior
                    </button>
                    
                    {!isQuizStep && (
                        <button 
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm font-medium ml-auto"
                        >
                        Próximo
                        <ChevronRight size={16} />
                        </button>
                    )}
                </div>
                </div>
            </div>

            {/* Right Panel: Visualization - Maximized */}
            <div className={`hidden md:flex w-1/2 bg-[#f0f1f4] border-l border-slate-200 p-2 items-center justify-center relative transition-all duration-300`}>
                <div className={`w-full h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden p-4 relative flex items-center justify-center`}>
                    <div className="w-full h-full flex items-center justify-center">
                        {renderVisual()}
                    </div>
                </div>
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;