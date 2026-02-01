
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode, Category } from './types';
import { SHOPPING_VOCAB, FOOD_VOCAB, ALL_VOCAB } from './constants';
import VocabularyCard from './components/VocabularyCard';
import GameMatching from './components/GameMatching';
import GameSoundQuiz from './components/GameSoundQuiz';
import SongPractice from './components/SongPractice';
import SceneBuilder from './components/SceneBuilder';
import GameFlashcards from './components/GameFlashcards';
import GameMemory from './components/GameMemory';
import GameDrama from './components/GameDrama';
import ZoomControls from './components/ZoomControls';
import { playTheatricalAudio } from './services/geminiTTS';
import {
  Palmtree,
  Theater,
  Music,
  Map as MapIcon,
  Trophy,
  Home,
  ChevronRight,
  Sparkles,
  Cloud,
  Bird
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#BAE6FD] relative overflow-x-hidden selection:bg-yellow-200">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] opacity-40 text-8xl"
        >☁️</motion.div>
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] right-[15%] opacity-30 text-9xl"
        >☁️</motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-[10%] right-[10%] opacity-20 text-[15rem]"
        >🏝️</motion.div>
        <div className="absolute inset-0 star-dust pointer-events-none opacity-20"></div>
      </div>

      <header className="relative z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass p-4 rounded-[2.5rem] border-4 border-[#0C4A6E]">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-16 h-16 bg-yellow-400 rounded-2xl border-4 border-[#0C4A6E] flex items-center justify-center text-4xl shadow-[4px_4px_0_#0C4A6E]"
            >
              🎭
            </motion.div>
            <div>
              <h1 className="text-4xl font-black tracking-tight leading-none text-indigo-900">THE SILLY WISHES</h1>
              <p className="text-sm font-bold text-indigo-800 opacity-70 mt-1 uppercase tracking-widest">Interactive Island Adventure</p>
            </div>
          </div>

          <div className="flex gap-4">
            {mode !== 'menu' && (
              <button
                onClick={() => setMode('menu')}
                className="island-button btn-pink px-8 py-3 text-xl"
              >
                <Home size={24} /> <span>MENU</span>
              </button>
            )}
            <div className="hidden lg:flex items-center gap-2 glass-dark px-6 py-2 rounded-full border border-white/30">
              <Sparkles className="text-yellow-500" />
              <span className="font-black text-[#0C4A6E]">LEVEL 8-9</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto space-y-16"
            >
              <div className="text-center space-y-4">
                <motion.h2
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl lg:text-8xl font-black text-indigo-950 leading-tight"
                >
                  Pick your <span className="text-sky-600">Adventure!</span>
                </motion.h2>
                <p className="text-3xl font-bold text-indigo-800/60 max-w-2xl mx-auto">
                  Explore the island, sing songs, and become a master of English!
                </p>
              </div>

              {/* ISOMETRIC ISLAND LAYOUT (Simplified for Web) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Main Attractions */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Scene Builder Section */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="clay-card bg-emerald-50 p-8 flex flex-col relative overflow-hidden group border-emerald-800 border-b-[12px]"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Palmtree size={120} />
                    </div>
                    <div className="text-center md:text-left h-full flex flex-col">
                      <div className="text-7xl mb-6">🏝️</div>
                      <h3 className="text-4xl font-black text-emerald-900 mb-2">SCENE BUILDER</h3>
                      <p className="font-bold text-emerald-800/60 mb-8 flex-1">Build your own magical scenery with icons!</p>
                      <button
                        onClick={() => setMode('scene-builder')}
                        className="island-button btn-green py-5 text-2xl w-full justify-center"
                      >
                        Let's Build <ChevronRight />
                      </button>
                    </div>
                  </motion.div>

                  {/* Drama Theater Section */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="clay-card bg-indigo-50 p-8 flex flex-col relative overflow-hidden group border-indigo-800 border-b-[12px]"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Theater size={120} />
                    </div>
                    <div className="text-center md:text-left h-full flex flex-col">
                      <div className="text-7xl mb-6">🎭</div>
                      <h3 className="text-4xl font-black text-indigo-900 mb-2">DRAMA STUDIO</h3>
                      <p className="font-bold text-indigo-800/60 mb-8 flex-1">Show your acting skills and guess characters!</p>
                      <button
                        onClick={() => setMode('drama')}
                        className="island-button btn-blue py-5 text-2xl w-full justify-center"
                      >
                        Start Acting <ChevronRight />
                      </button>
                    </div>
                  </motion.div>

                  {/* The Song Section - Wide */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="clay-card bg-yellow-50 p-8 col-span-1 md:col-span-2 relative overflow-hidden group border-yellow-800 border-b-[12px]"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Music size={160} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="text-[10rem]">🎤</div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-5xl font-black text-yellow-900 mb-2 uppercase">THE MAGIC SONG</h3>
                        <p className="text-2xl font-bold text-yellow-800/60 mb-8">Follow the rhythm and sing along the Silly Wishes!</p>
                        <button
                          onClick={() => setMode('song')}
                          className="island-button btn-yellow py-6 px-12 text-3xl justify-center inline-flex"
                        >
                          Sing Now 🎶
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side: Vocabulary Hubs */}
                <div className="lg:col-span-4 flex flex-col gap-8">

                  {/* Super Challenge */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStart('All Vocabulary', 'memory')}
                    className="clay-card bg-gradient-to-br from-rose-400 to-rose-600 text-white p-8 border-rose-900 border-b-[12px] group text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Trophy size={48} className="text-yellow-300" />
                      <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-black uppercase">ULTIMATE</span>
                    </div>
                    <h3 className="text-3xl font-black mb-2 leading-none">THE GRAND CHALLENGE</h3>
                    <p className="font-bold opacity-80 mb-6 text-lg">28 Cards. 1 Brain. Can you match them all?</p>
                    <div className="flex items-center gap-2 font-black text-xl">
                      PLAY CHALLENGE <ChevronRight />
                    </div>
                  </motion.button>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-[#0C4A6E] px-4 flex items-center gap-2">
                      <MapIcon size={24} /> PRACTICE ZONES
                    </h4>

                    {/* Shopping Zone */}
                    <div className="clay-card p-6 bg-blue-50 border-blue-800 border-b-[8px]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">🏬</div>
                        <h3 className="text-2xl font-black text-blue-900">SHOPPING</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => handleStart('Shopping Centre', 'memory')} className="island-button btn-pink h-16 justify-center text-sm">MEMORY</button>
                        <button onClick={() => handleStart('Shopping Centre', 'flashcards')} className="island-button btn-yellow h-16 justify-center text-sm">CARDS</button>
                      </div>
                      <div className="space-y-2">
                        <button onClick={() => handleStart('Shopping Centre', 'matching')} className="w-full glass-dark border-[#0C4A6E] h-12 rounded-xl border-2 font-black text-xs uppercase hover:bg-white/50 transition-colors">MATCHING 🧩</button>
                        <button onClick={() => handleStart('Shopping Centre', 'listening')} className="w-full glass-dark border-[#0C4A6E] h-12 rounded-xl border-2 font-black text-xs uppercase hover:bg-white/50 transition-colors">LISTENING 👂</button>
                      </div>
                    </div>

                    {/* Forest Zone */}
                    <div className="clay-card p-6 bg-rose-50 border-rose-800 border-b-[8px]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">🍎</div>
                        <h3 className="text-2xl font-black text-rose-900">FOREST FOOD</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => handleStart('Forest Food', 'memory')} className="island-button btn-pink h-16 justify-center text-sm text-center">MEMORY</button>
                        <button onClick={() => handleStart('Forest Food', 'flashcards')} className="island-button btn-yellow h-16 justify-center text-sm">CARDS</button>
                      </div>
                      <div className="space-y-2">
                        <button onClick={() => handleStart('Forest Food', 'matching')} className="w-full glass-dark border-[#0C4A6E] h-12 rounded-xl border-2 font-black text-xs uppercase hover:bg-white/50 transition-colors">MATCHING 🧩</button>
                        <button onClick={() => handleStart('Forest Food', 'listening')} className="w-full glass-dark border-[#0C4A6E] h-12 rounded-xl border-2 font-black text-xs uppercase hover:bg-white/50 transition-colors">LISTENING 👂</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Layouts Re-Wrapped */}
          {mode !== 'menu' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-7xl mx-auto"
            >
              {mode === 'scene-builder' && <div className="clay-card p-8 bg-white/95 backdrop-blur-sm border-emerald-900 border-b-[12px]"><SceneBuilder /></div>}
              {mode === 'song' && <div className="clay-card p-8 bg-white/95 backdrop-blur-sm border-yellow-900 border-b-[12px]"><SongPractice /></div>}
              {mode === 'drama' && <div className="clay-card p-8 bg-white/95 backdrop-blur-sm border-indigo-900 border-b-[12px]"><GameDrama /></div>}

              {mode === 'presentation' && (
                <div className="space-y-12">
                  <div className="text-center glass p-8 rounded-[3rem] border-4 border-[#0C4A6E] inline-block mx-auto relative left-1/2 -translate-x-1/2">
                    <h2 className="text-6xl font-black text-indigo-900 leading-none">{category}</h2>
                    <p className="text-2xl font-bold text-indigo-800/60 mt-2">Listen & Repeat!</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {vocabList.map(item => <VocabularyCard key={item.id} item={item} />)}
                  </div>
                </div>
              )}

              {mode === 'flashcards' && (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-6xl font-black text-yellow-600 leading-none mb-2">Flashcards</h2>
                    <p className="text-2xl font-bold text-gray-500">Do you know what it is?</p>
                  </div>
                  <div className="clay-card p-12 bg-white border-yellow-800 border-b-[12px]"><GameFlashcards vocabList={vocabList} /></div>
                </div>
              )}

              {mode === 'memory' && (
                <div className="animate-fadeIn">
                  <div className="text-center mb-12">
                    <h2 className="text-6xl font-black text-rose-600 leading-none mb-2">Memory Game</h2>
                    <p className="text-2xl font-bold text-gray-500">Find the pairs!</p>
                  </div>
                  <GameMemory vocabList={vocabList} onComplete={handleGameComplete} />
                </div>
              )}

              {mode === 'matching' && (
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-6xl font-black text-emerald-800 leading-none mb-2">Connect Lines</h2>
                    <p className="text-2xl font-bold text-gray-500">Join the image with the word!</p>
                  </div>
                  <div className="clay-card p-8 bg-white border-emerald-900 border-b-[12px]"><GameMatching vocabList={vocabList} onComplete={handleGameComplete} /></div>
                </div>
              )}

              {mode === 'listening' && (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-6xl font-black text-indigo-800 leading-none mb-2">Listening Quiz</h2>
                    <p className="text-2xl font-bold text-gray-500">Listen and pick!</p>
                  </div>
                  <div className="clay-card p-12 bg-white border-indigo-900 border-b-[12px]"><GameSoundQuiz vocabList={vocabList} onComplete={handleGameComplete} /></div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0C4A6E]/80 backdrop-blur-lg"
          >
            <div className="bg-white p-12 rounded-[4rem] text-center shadow-[0_20px_0_#0C4A6E] border-8 border-yellow-400 max-w-xl">
              <div className="text-[10rem] mb-6 animate-bounce">🏆</div>
              <h2 className="text-8xl font-black text-yellow-500 mb-4 leading-none">AMAZING!</h2>
              {lastScore && (
                <div className="mt-4 p-8 bg-yellow-100 rounded-[3rem] border-4 border-yellow-400">
                  <p className="text-4xl font-black text-emerald-700 uppercase">Time: {formatTime(lastScore.time)}</p>
                </div>
              )}
              <p className="text-2xl font-bold text-gray-600 mt-8 italic px-4">"A giant applause for you, superstar!"</p>
              <button
                onClick={() => setShowConfetti(false)}
                className="mt-8 island-button btn-blue px-16 py-5 text-3xl font-black mx-auto"
              >
                PLAY AGAIN!
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-2 text-center py-12 relative z-10">
        <div className="max-w-4xl mx-auto glass p-8 rounded-[3rem] border-2 border-white/40">
          <div className="flex justify-center gap-8 mb-4 opacity-40">
            <Bird /> <Palmtree /> <Cloud /> <Palmtree /> <Bird />
          </div>
          <p className="text-2xl font-black text-indigo-900 leading-none">ESCOLA ÀGORA</p>
          <p className="text-sm font-bold text-indigo-800 opacity-60 uppercase tracking-widest mt-2">Primary English 2026 • Interactive Theatre Experience</p>
        </div>
      </footer>
      {/* Zoom Controls for Educational Screens */}
      <ZoomControls />
    </div>
  );
};

export default App;
