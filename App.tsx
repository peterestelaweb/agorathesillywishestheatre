
import React, { useState } from 'react';
import { GameMode, Category } from './types';
import { SHOPPING_VOCAB, FOOD_VOCAB, ALL_VOCAB } from './constants';
import VocabularyCard from './components/VocabularyCard';
import GameMatching from './components/GameMatching';
import GameSoundQuiz from './components/GameSoundQuiz';
import SongPractice from './components/SongPractice';
import SceneBuilder from './components/SceneBuilder';
import GameFlashcards from './components/GameFlashcards';
import GameMemory from './components/GameMemory';
import { playTheatricalAudio } from './services/geminiTTS';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('menu');
  const [category, setCategory] = useState<Category | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastScore, setLastScore] = useState<{ time: number } | null>(null);

  const handleStart = (cat: Category | 'The Song', m: GameMode) => {
    setCategory(cat as Category);
    setMode(m);
    setLastScore(null);
  };

  const getVocabList = () => {
    if (category === 'Shopping Centre') return SHOPPING_VOCAB;
    if (category === 'Forest Food') return FOOD_VOCAB;
    if (category === 'All Vocabulary') return ALL_VOCAB;
    return [];
  };

  const vocabList = getVocabList();

  const handleGameComplete = (finalTime: number) => {
    setLastScore({ time: finalTime });
    setShowConfetti(true);
    playTheatricalAudio("Excellent work everyone! Bravo!");
    setTimeout(() => {
      setShowConfetti(false);
      setMode('menu');
    }, 4000);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F0F9FF] text-[#0C4A6E] selection:bg-yellow-200">
      {/* Memphis Background & Floating Elements */}
      <div className="memphis-bg dot-pattern"></div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-8xl animate-float opacity-40">☁️</div>
        <div className="absolute top-[20%] right-[10%] text-9xl animate-float-slow opacity-30">🌈</div>
        <div className="absolute bottom-[20%] left-[8%] text-8xl animate-float-fast opacity-40">⭐</div>
        <div className="absolute bottom-[10%] right-[5%] text-8xl animate-float opacity-30">🎈</div>

        {/* Abstract Geometric Shapes (Memphis) */}
        <div className="absolute top-[40%] right-[20%] w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-[40%] left-[15%] w-32 h-32 bg-yellow-300 rotate-12 opacity-20 blur-xl"></div>
      </div>

      <header className="relative z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-md rounded-[2.5rem] border-4 border-[#0C4A6E] shadow-[0_8px_0_#0C4A6E] p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl border-4 border-[#0C4A6E] flex items-center justify-center text-4xl shadow-[4px_4px_0_#0C4A6E]">
              🎭
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight leading-none">THE SILLY WISHES</h1>
              <p className="text-sm font-bold opacity-70 mt-1 uppercase tracking-widest">Pizarra Interactiva Mágica</p>
            </div>
          </div>

          {mode !== 'menu' && (
            <button
              onClick={() => setMode('menu')}
              className="clay-button clay-pink px-8 py-3 text-xl font-black flex items-center gap-2"
            >
              <span>🏠</span> Tornar
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 relative z-10">
        {mode === 'menu' && (
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-7xl font-black text-gray-800 animate-float">Tria una aventura!</h2>
              <p className="text-3xl font-bold opacity-70">¿Qué vols practicar avui?</p>
            </div>

            {/* GRAND CHALLENGE BUTTON - PREMIUM HUD */}
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => handleStart('All Vocabulary', 'memory')}
                className="w-full clay-button bg-gradient-to-br from-pink-400 to-rose-500 overflow-hidden text-white p-8 group"
                style={{ borderRadius: '40px', borderColor: '#0C4A6E', borderWidth: '6px', boxShadow: '0 12px 0 #0C4A6E' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-between gap-6">
                  <div className="text-left">
                    <h3 className="text-5xl font-black mb-2">🏆 GRAN RECORDA-TOT</h3>
                    <p className="text-xl font-bold opacity-90">¡Juga amb TOTES les 28 cartes alhora!</p>
                  </div>
                  <div className="text-8xl group-hover:rotate-12 transition-transform">🧠</div>
                </div>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Scene Builder Card */}
              <div className="clay-card p-2 flex flex-col group h-full">
                <div className="bg-emerald-100 rounded-[2rem] p-8 flex-1 flex flex-col items-center text-center">
                  <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">🏗️</div>
                  <h3 className="text-3xl font-black text-emerald-800 mb-2">Crea l'Escena</h3>
                  <p className="font-bold text-emerald-600/70 mb-8">Dissenya escenaris màgics amb icones</p>
                  <button onClick={() => setMode('scene-builder')} className="mt-auto w-full clay-button clay-green py-4 text-2xl font-black">
                    Començar! ✨
                  </button>
                </div>
              </div>

              {/* The Song Card */}
              <div className="clay-card p-2 flex flex-col group h-full">
                <div className="bg-yellow-100 rounded-[2rem] p-8 flex-1 flex flex-col items-center text-center border-emerald-800">
                  <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">🎤</div>
                  <h3 className="text-3xl font-black text-yellow-800 mb-2">The Song</h3>
                  <p className="font-bold text-yellow-600/70 mb-8">Canta i practica la lletra</p>
                  <button onClick={() => setMode('song')} className="mt-auto w-full clay-button clay-yellow py-4 text-2xl font-black">
                    Cantar! 🎶
                  </button>
                </div>
              </div>

              {/* Shopping Category */}
              <div className="clay-card p-2 flex flex-col group h-full">
                <div className="bg-blue-100 rounded-[2rem] p-6 flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">🏬</div>
                    <h3 className="text-3xl font-black text-blue-800">Shopping</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={() => handleStart('Shopping Centre', 'memory')} className="clay-button clay-pink p-4 flex flex-col items-center">
                      <span className="text-3xl">🧠</span>
                      <span className="text-[10px] font-black uppercase mt-1">Parelles</span>
                    </button>
                    <button onClick={() => handleStart('Shopping Centre', 'flashcards')} className="clay-button clay-yellow p-4 flex flex-col items-center">
                      <span className="text-3xl">👀</span>
                      <span className="text-[10px] font-black uppercase mt-1">Cartes</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <button onClick={() => handleStart('Shopping Centre', 'presentation')} className="clay-button clay-blue py-2 font-black flex justify-between items-center px-4">
                      <span>Vocabulari</span> 🔊
                    </button>
                    <button onClick={() => handleStart('Shopping Centre', 'matching')} className="clay-button clay-green py-2 font-black flex justify-between items-center px-4">
                      <span>Unir</span> 🧩
                    </button>
                    <button onClick={() => handleStart('Shopping Centre', 'listening')} className="clay-button clay-purple py-2 font-black flex justify-between items-center px-4">
                      <span>Escolta</span> 👂
                    </button>
                  </div>
                </div>
              </div>

              {/* Forest Category */}
              <div className="clay-card p-2 flex flex-col group h-full">
                <div className="bg-rose-100 rounded-[2rem] p-6 flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">🍎</div>
                    <h3 className="text-3xl font-black text-rose-800">Forest Food</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={() => handleStart('Forest Food', 'memory')} className="clay-button clay-pink p-4 flex flex-col items-center">
                      <span className="text-3xl">🧠</span>
                      <span className="text-[10px] font-black uppercase mt-1">Parelles</span>
                    </button>
                    <button onClick={() => handleStart('Forest Food', 'flashcards')} className="clay-button clay-yellow p-4 flex flex-col items-center">
                      <span className="text-3xl">👀</span>
                      <span className="text-[10px] font-black uppercase mt-1">Cartes</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <button onClick={() => handleStart('Forest Food', 'presentation')} className="clay-button clay-blue py-2 font-black flex justify-between items-center px-4">
                      <span>Vocabulari</span> 🔊
                    </button>
                    <button onClick={() => handleStart('Forest Food', 'matching')} className="clay-button clay-green py-2 font-black flex justify-between items-center px-4">
                      <span>Unir</span> 🧩
                    </button>
                    <button onClick={() => handleStart('Forest Food', 'listening')} className="clay-button clay-purple py-2 font-black flex justify-between items-center px-4">
                      <span>Escolta</span> 👂
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Layouts with Claymorphic Treatment */}
        {mode === 'scene-builder' && <div className="clay-card p-8 bg-white/90 backdrop-blur-sm"><SceneBuilder /></div>}
        {mode === 'song' && <div className="clay-card p-8 bg-white/90 backdrop-blur-sm"><SongPractice /></div>}

        {mode === 'presentation' && (
          <div className="space-y-12 animate-fadeIn max-w-7xl mx-auto">
            <div className="text-center bg-white/80 p-8 rounded-[3rem] border-4 border-[#0C4A6E] shadow-[0_8px_0_#0C4A6E] inline-block mx-auto">
              <h2 className="text-6xl font-black text-blue-800">{category}</h2>
              <p className="text-2xl font-bold text-gray-600 mt-2">Escolta i repeteix!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {vocabList.map(item => <VocabularyCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {mode === 'flashcards' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-black text-orange-600">Flashcards</h2>
              <p className="text-2xl font-bold text-gray-600 mt-2">¿Saps què és?</p>
            </div>
            <div className="clay-card p-12 bg-white"><GameFlashcards vocabList={vocabList} /></div>
          </div>
        )}

        {mode === 'memory' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-black text-pink-600">Memory Game</h2>
              <p className="text-2xl font-bold text-gray-600 mt-2">Busca les parelles!</p>
            </div>
            <GameMemory vocabList={vocabList} onComplete={handleGameComplete} />
          </div>
        )}

        {mode === 'matching' && (
          <div className="animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-black text-emerald-800">Unir línies</h2>
              <p className="text-2xl font-bold text-gray-600 mt-2">Uneix el dibuix amb la paraula!</p>
            </div>
            <div className="clay-card p-8 bg-white"><GameMatching vocabList={vocabList} onComplete={handleGameComplete} /></div>
          </div>
        )}

        {mode === 'listening' && (
          <div className="animate-fadeIn max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-black text-purple-800">Listening Quiz</h2>
              <p className="text-2xl font-bold text-gray-600 mt-2">Escolta i tria!</p>
            </div>
            <div className="clay-card p-12 bg-white"><GameSoundQuiz vocabList={vocabList} onComplete={handleGameComplete} /></div>
          </div>
        )}

        {showConfetti && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C4A6E]/80 backdrop-blur-lg">
            <div className="bg-white p-12 rounded-[4rem] text-center shadow-[0_20px_0_#0C4A6E] border-8 border-yellow-400 animate-float max-w-xl">
              <div className="text-[10rem] mb-6 animate-bounce">🏆</div>
              <h2 className="text-7xl font-black text-yellow-500 mb-4">MOLT BÉ!</h2>
              {lastScore && (
                <div className="mt-4 p-8 bg-yellow-100 rounded-[3rem] border-4 border-yellow-400 shadow-[0_8px_0_#FACC15]">
                  <p className="text-4xl font-black text-emerald-700">TEMPS: {formatTime(lastScore.time)}</p>
                </div>
              )}
              <p className="text-2xl font-bold text-gray-600 mt-8 italic">"¡Un aplaudiment gegant per a tu!"</p>
              <button
                onClick={() => setShowConfetti(false)}
                className="mt-8 clay-button clay-blue px-12 py-4 text-2xl font-black"
              >
                Seguir jugant!
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 px-8 py-12 text-center relative z-10">
        <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-sm rounded-[3rem] p-8 border-4 border-emerald-100/50">
          <p className="text-xl font-black text-emerald-800">Escola Àgora, Primary English 2026</p>
          <p className="text-sm font-bold text-emerald-600/60 mt-2 uppercase tracking-widest">Interactive Theatre English Learning System</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
