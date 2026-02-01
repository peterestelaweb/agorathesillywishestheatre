
import React, { useState, useEffect } from 'react';
import { playTheatricalAudio } from '../services/geminiTTS';
import { playFeedbackSound } from '../services/soundEffects';

type DramaGameMode = 'menu' | 'director' | 'riddles';

const EMOTIONS = [
    { text: "HAPPY", emoji: "😄", color: "bg-yellow-400" },
    { text: "SAD", emoji: "😢", color: "bg-blue-400" },
    { text: "ANGRY", emoji: "😠", color: "bg-red-500" },
    { text: "SLEEPY", emoji: "😴", color: "bg-purple-400" },
    { text: "SCARED", emoji: "😱", color: "bg-indigo-400" },
    { text: "STRONG", emoji: "💪", color: "bg-orange-400" }
];

const CHARACTERS = [
    { text: "TREE", emoji: "🌳" },
    { text: "BEAR", emoji: "🐻" },
    { text: "BEE", emoji: "🐝" },
    { text: "BIRD", emoji: "🐦" },
    { text: "GIANT", emoji: "👺" },
    { text: "FLOWER", emoji: "🌸" }
];

const RIDDLES = [
    {
        answer: "A tree",
        image: "/img-trees.png",
        clues: ["I am green and tall.", "I have many leaves.", "Please, don't cut me down!"]
    },
    {
        answer: "A bee",
        image: "/img-animals.png",
        clues: ["I am very small.", "I can fly.", "I say 'Bzzzzzz'!"]
    },
    {
        answer: "The forest",
        image: "/img-forest.png",
        clues: ["I have many trees.", "Animals live here.", "I am beautiful and green."]
    },
    {
        answer: "A town",
        image: "/img-town.png",
        clues: ["People live here.", "There are many houses.", "Sometimes I am smelly!"]
    }
];

const GameDrama: React.FC = () => {
    const [subMode, setSubMode] = useState<DramaGameMode>('menu');
    const [directorState, setDirectorState] = useState<{ char: any, emo: any, step: string }>({ char: null, emo: null, step: 'idle' });
    const [riddleIndex, setRiddleIndex] = useState(0);
    const [clueStep, setClueStep] = useState(0); // 0=No clues, 1=Clue1, 2=Clue2...

    // --- MAGIC DIRECTOR LOGIC ---
    const spinDirector = () => {
        setDirectorState({ ...directorState, step: 'spinning' });
        playFeedbackSound('flip');

        // Fake spin animation
        let count = 0;
        const interval = setInterval(() => {
            setDirectorState(prev => ({
                ...prev,
                char: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
                emo: EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]
            }));
            count++;
            if (count > 10) {
                clearInterval(interval);
                setDirectorState(prev => ({ ...prev, step: 'countdown' }));
            }
        }, 100);
    };

    useEffect(() => {
        if (directorState.step === 'countdown') {
            playTheatricalAudio("Three... Two... One... Action!");
            setTimeout(() => {
                setDirectorState(prev => ({ ...prev, step: 'action' }));
                playFeedbackSound('match');
            }, 3500);
        }
    }, [directorState.step]);

    // --- RIDDLE LOGIC ---
    const nextClue = () => {
        if (clueStep < 3) {
            setClueStep(prev => prev + 1);
            playFeedbackSound('flip');
        } else {
            setClueStep(4); // Reveal
            playFeedbackSound('success');
            playTheatricalAudio("It is... " + RIDDLES[riddleIndex].answer);
        }
    };

    const nextRiddle = () => {
        setRiddleIndex((prev) => (prev + 1) % RIDDLES.length);
        setClueStep(0);
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-4">
            {subMode === 'menu' && (
                <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
                    <button
                        onClick={() => setSubMode('director')}
                        className="clay-card p-12 flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform cursor-pointer bg-pink-100"
                    >
                        <div className="text-8xl">🎬</div>
                        <h3 className="text-4xl font-black text-pink-600 uppercase">Magic Director</h3>
                        <p className="text-xl font-bold text-gray-500">Act like a...</p>
                    </button>

                    <button
                        onClick={() => setSubMode('riddles')}
                        className="clay-card p-12 flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform cursor-pointer bg-purple-100"
                    >
                        <div className="text-8xl">🕵️‍♀️</div>
                        <h3 className="text-4xl font-black text-purple-600 uppercase">Who am I?</h3>
                        <p className="text-xl font-bold text-gray-500">Guess the character!</p>
                    </button>
                </div>
            )}

            {subMode === 'director' && (
                <div className="w-full max-w-5xl text-center space-y-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="text-6xl animate-bounce">🎬</span>
                        <h2 className="text-6xl font-black text-[#0C4A6E] font-display">MAGIC DIRECTOR</h2>
                        <span className="text-6xl animate-bounce">🎬</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* LEFT: INSTRUCTIONS PANEL */}
                        <div className="clay-card clay-blue p-6 space-y-4 h-full">
                            <h3 className="text-2xl font-black text-white uppercase mb-4">How to play:</h3>
                            <div className="bg-white/90 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm">
                                <span className="text-5xl">👆</span>
                                <div>
                                    <p className="font-black text-blue-900 text-xl">1. CLICK</p>
                                    <p className="text-sm font-bold text-blue-900/60 leading-tight">Premeu el botó</p>
                                </div>
                            </div>
                            <div className="bg-white/90 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm">
                                <span className="text-5xl">👀</span>
                                <div>
                                    <p className="font-black text-blue-900 text-xl">2. LOOK</p>
                                    <p className="text-sm font-bold text-blue-900/60 leading-tight">Mireu el resultat</p>
                                </div>
                            </div>
                            <div className="bg-white/90 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm transform scale-105 border-4 border-yellow-400">
                                <span className="text-5xl">🎭</span>
                                <div>
                                    <p className="font-black text-blue-900 text-xl">3. ACT!</p>
                                    <p className="text-sm font-bold text-blue-900/60 leading-tight">Feu teatre!</p>
                                </div>
                            </div>
                        </div>

                        {/* CENTER: THE STAGE */}
                        <div className="lg:col-span-2 clay-card p-12 bg-white min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden ring-8 ring-yellow-400 shadow-2xl">
                            {/* CURTAINS DECORATION (CSS-made) */}
                            <div className="absolute top-0 left-0 w-16 h-full bg-red-600 z-0"></div>
                            <div className="absolute top-0 right-0 w-16 h-full bg-red-600 z-0"></div>
                            <div className="absolute top-0 inset-x-0 h-12 bg-red-700 z-10 rounded-b-[2rem] shadow-md flex justify-center items-center">
                                <div className="px-8 py-1 bg-black text-yellow-500 font-mono text-xs tracking-widest uppercase rounded">Scene 1</div>
                            </div>

                            <div className="relative z-20 w-full flex flex-col items-center">
                                {directorState.step === 'idle' && (
                                    <div className="animate-float">
                                        <button onClick={spinDirector} className="clay-button clay-green px-16 py-10 text-5xl font-black group transition-all hover:scale-110 active:scale-95 shadow-[0_10px_0_rgb(21,128,61)]">
                                            <div className="flex flex-col items-center gap-2">
                                                <span>🎡 SPIN!</span>
                                            </div>
                                        </button>
                                        <p className="mt-8 text-2xl font-bold text-gray-400 animate-pulse">Are you ready?</p>
                                    </div>
                                )}

                                {(directorState.step === 'spinning') && (
                                    <div className="text-7xl font-black text-[#0C4A6E] animate-pulse flex flex-col items-center gap-4">
                                        <span className="text-9xl animate-spin">🎲</span>
                                        CHOOSING...
                                    </div>
                                )}

                                {(directorState.step === 'countdown' || directorState.step === 'action') && (
                                    <div className="w-full space-y-8 animate-pop">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                                            <div className={`p-8 rounded-[3rem] border-8 border-white shadow-xl ${directorState.emo.color} transform -rotate-3 transition-transform hover:scale-110 hover:rotate-0`}>
                                                <div className="text-8xl mb-2 filter drop-shadow-lg">{directorState.emo.emoji}</div>
                                                <div className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">{directorState.emo.text}</div>
                                            </div>
                                            <div className="text-6xl font-black text-gray-300 animate-pulse">+</div>
                                            <div className="p-8 rounded-[3rem] border-8 border-white shadow-xl bg-emerald-400 transform rotate-3 transition-transform hover:scale-110 hover:rotate-0">
                                                <div className="text-8xl mb-2 filter drop-shadow-lg">{directorState.char.emoji}</div>
                                                <div className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">{directorState.char.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {directorState.step === 'action' && (
                                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/80 backdrop-blur-sm p-12 transform rotate-[-5deg] border-8 border-white animate-bounce-slow shadow-2xl rounded-xl">
                                            <h2 className="text-[8rem] leading-none font-black text-yellow-400 font-display drop-shadow-[0_10px_0_rgba(0,0,0,1)]">ACTION!</h2>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-8">
                        <button onClick={() => setSubMode('menu')} className="clay-button clay-pink px-10 py-5 text-2xl font-black flex items-center gap-3">
                            <span>⬅️</span> EXIT
                        </button>
                        {directorState.step === 'action' && (
                            <button
                                onClick={() => setDirectorState({ char: null, emo: null, step: 'idle' })}
                                className="clay-button clay-yellow px-12 py-5 text-3xl font-black animate-pulse flex items-center gap-3 shadow-xl"
                            >
                                <span>🔄</span> PLAY AGAIN!
                            </button>
                        )}
                    </div>
                </div>
            )}

            {subMode === 'riddles' && (
                <div className="w-full max-w-4xl text-center space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-5xl font-black text-purple-800 font-display">WHO AM I? 🤔</h2>
                        <div className="inline-flex flex-col bg-white/50 backdrop-blur-sm px-6 py-2 rounded-2xl border-2 border-purple-200 shadow-sm">
                            <p className="text-lg font-black text-purple-900 leading-tight italic">Mystery Character Game!</p>
                            <p className="text-xs font-bold text-purple-800/60 uppercase tracking-widest">Endevina el personatge amb les pistes!</p>
                        </div>
                    </div>

                    <div className="clay-card p-8 bg-white min-h-[300px] flex gap-8 items-center text-left">
                        <div className="flex-1 space-y-4">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`p-6 rounded-2xl border-4 transition-all duration-500 ${i < clueStep ? 'bg-yellow-100 border-yellow-400 scale-100' : 'bg-gray-100 border-gray-200 scale-95 opacity-50'
                                        }`}
                                >
                                    {i < clueStep ? (
                                        <p className="text-3xl font-black text-[#0C4A6E]">💡 {RIDDLES[riddleIndex].clues[i]}</p>
                                    ) : (
                                        <div className="flex items-center gap-4 text-gray-300">
                                            <span className="text-2xl">🔒</span>
                                            <p className="text-2xl font-black uppercase tracking-widest italic font-display">Locked Clue {i + 1}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* REVEAL AREA */}
                        <div className="w-1/3 aspect-[3/4] clay-card clay-blue flex items-center justify-center relative overflow-hidden">
                            {clueStep === 4 ? (
                                <img src={RIDDLES[riddleIndex].image} className="absolute inset-0 w-full h-full object-cover animate-pop" />
                            ) : (
                                <span className="text-8xl">❓</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                        {clueStep < 4 && (
                            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-full px-8 py-2 animate-bounce flex items-center gap-4">
                                <span className="text-2xl animate-bounce">⬇️</span>
                                <div className="text-left">
                                    <p className="text-sm font-black text-yellow-800 leading-none">CLICK THE GREEN BUTTON BELOW!</p>
                                    <p className="text-[10px] font-bold text-yellow-700 opacity-80 uppercase tracking-wider">Clica el botó verd de sota!</p>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-center gap-6 w-full">
                            <button onClick={() => setSubMode('menu')} className="clay-button clay-pink px-8 py-4 text-xl font-black">EXIT</button>

                            {clueStep < 4 ? (
                                <button
                                    onClick={nextClue}
                                    className={`clay-button clay-green px-12 py-6 text-2xl lg:text-3xl font-black flex-1 shadow-2xl transition-all hover:scale-105 active:scale-95 ${clueStep === 0 ? 'animate-pulse-clay ring-4 ring-green-400 ring-offset-4' : ''}`}
                                >
                                    {clueStep === 0 ? 'START GAME & GET CLUE! 🔍' :
                                        clueStep === 3 ? 'REVEAL ANSWER! ✨' :
                                            'NEXT CLUE 🔍'}
                                </button>
                            ) : (
                                <button onClick={nextRiddle} className="clay-button clay-yellow px-12 py-6 text-3xl font-black flex-1 animate-bounce">
                                    NEXT MYSTERY ➡️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameDrama;
