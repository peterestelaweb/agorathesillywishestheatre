
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFeedbackSound } from '../services/soundEffects';

const GRID_DATA = [
    ['J', 'K', 'W', 'Z', 'J', 'P', 'T', 'T', 'Y', 'R', 'I', 'T', 'Y', 'S', 'C'],
    ['A', 'X', 'P', 'N', 'I', 'D', 'W', 'R', 'G', 'S', 'B', 'N', 'A', 'X', 'H'],
    ['K', 'L', 'W', 'L', 'U', 'K', 'X', 'E', 'U', 'P', 'T', 'A', 'S', 'B', 'E'],
    ['T', 'E', 'K', 'R', 'A', 'M', 'R', 'E', 'P', 'U', 'S', 'R', 'X', 'R', 'M'],
    ['V', 'N', 'N', 'S', 'A', 'L', 'U', 'S', 'S', 'P', 'Y', 'U', 'S', 'O', 'I'],
    ['X', 'X', 'E', 'G', 'E', 'N', 'M', 'M', 'N', 'E', 'D', 'A', 'J', 'C', 'S'],
    ['P', 'B', 'I', 'M', 'I', 'H', 'O', 'O', 'N', 'H', 'L', 'T', 'T', 'O', 'T'],
    ['P', 'C', 'T', 'C', 'N', 'O', 'S', 'O', 'N', 'H', 'M', 'S', 'E', 'O', 'X'],
    ['T', 'M', 'O', 'P', 'R', 'O', 'H', 'I', 'V', 'D', 'F', 'E', 'L', 'T', 'H'],
    ['M', 'R', 'H', 'H', 'O', 'W', 'R', 'F', 'W', 'Z', 'S', 'R', 'I', 'F', 'S'],
    ['N', 'A', 'S', 'E', 'C', 'T', 'S', 'I', 'R', 'O', 'L', 'F', 'O', 'D', 'X'],
    ['H', 'U', 'B', 'E', 'A', 'N', 'S', 'R', 'V', 'U', 'W', 'O', 'T', 'B', 'I'],
    ['M', 'S', 'A', 'U', 'S', 'A', 'G', 'E', 'S', 'N', 'I', 'C', 'L', 'Z', 'G'],
    ['P', 'F', 'S', 'W', 'L', 'Z', 'B', 'O', 'S', 'J', 'E', 'T', 'R', 'R', 'U'],
    ['H', 'Q', 'P', 'R', 'U', 'V', 'I', 'S', 'Y', 'Q', 'F', 'K', 'J', 'D', 'R'],
];

const WORDS = [
    "ALMONDS", "BEANS", "CHEMIST", "FLORIST", "HONEY",
    "MAGIC", "MUSHROOMS", "RESTAURANT", "SAUSAGES",
    "SUPERMARKET", "TOILET", "TREES", "UNICORN", "WISHES"
];

const GameWordSearch: React.FC = () => {
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selection, setSelection] = useState<{ r: number, c: number }[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPos, setStartPos] = useState<{ r: number, c: number } | null>(null);
    const [permanentlySelected, setPermanentlySelected] = useState<{ r: number, c: number, word: string }[]>([]);
    const [animatingLetters, setAnimatingLetters] = useState<{
        r: number,
        c: number,
        letter: string,
        word: string,
        letterIndex: number,
        id: string
    }[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const wordListRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const getCellsBetween = (start: { r: number, c: number }, end: { r: number, c: number }) => {
        const dr = end.r - start.r;
        const dc = end.c - start.c;
        const dist = Math.max(Math.abs(dr), Math.abs(dc));

        // check if it's a valid 8-direction line
        const isHorizontal = dr === 0;
        const isVertical = dc === 0;
        const isDiagonal = Math.abs(dr) === Math.abs(dc);

        if (!isHorizontal && !isVertical && !isDiagonal) return [];

        const cells = [];
        const sr = dr === 0 ? 0 : dr / Math.abs(dr);
        const sc = dc === 0 ? 0 : dc / Math.abs(dc);

        for (let i = 0; i <= dist; i++) {
            cells.push({ r: start.r + i * sr, c: start.c + i * sc });
        }
        return cells;
    };

    // Get cell from touch coordinates
    const getCellFromTouch = (touch: Touch): { r: number, c: number } | null => {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!element) return null;

        const cellKey = element.getAttribute('data-cell');
        if (!cellKey) return null;

        const [r, c] = cellKey.split('-').map(Number);
        return { r, c };
    };

    const handleMouseDown = (r: number, c: number) => {
        setIsSelecting(true);
        setStartPos({ r, c });
        setSelection([{ r, c }]);
    };

    const handleMouseEnter = (r: number, c: number) => {
        if (!isSelecting || !startPos) return;
        const newSelection = getCellsBetween(startPos, { r, c });
        if (newSelection.length > 0) {
            setSelection(newSelection);
        }
    };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent, r: number, c: number) => {
        e.preventDefault(); // Prevent scrolling while selecting
        setIsSelecting(true);
        setStartPos({ r, c });
        setSelection([{ r, c }]);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSelecting || !startPos) return;
        e.preventDefault(); // Prevent scrolling

        const touch = e.touches[0];
        const cell = getCellFromTouch(touch);

        if (cell) {
            const newSelection = getCellsBetween(startPos, cell);
            if (newSelection.length > 0) {
                setSelection(newSelection);
            }
        }
    };

    const handleMouseUp = useCallback(() => {
        if (!isSelecting) return;
        setIsSelecting(false);

        const currentWord = selection.map(cell => GRID_DATA[cell.r][cell.c]).join('');
        const reversedWord = [...currentWord].reverse().join('');

        const foundWord = WORDS.find(w => w === currentWord || w === reversedWord);

        if (foundWord && !foundWords.includes(foundWord)) {
            // Play success sound!
            playFeedbackSound('success');

            setFoundWords(prev => [...prev, foundWord]);
            const newPerms = selection.map(cell => ({ ...cell, word: foundWord }));
            setPermanentlySelected(prev => [...prev, ...newPerms]);

            // Create animating letters for 3D effect
            const letters = selection.map((cell, index) => ({
                r: cell.r,
                c: cell.c,
                letter: GRID_DATA[cell.r][cell.c],
                word: foundWord,
                letterIndex: index,
                id: `${foundWord}-${cell.r}-${cell.c}-${Date.now()}`
            }));

            setAnimatingLetters(prev => [...prev, ...letters]);

            // Remove animating letters after animation completes
            setTimeout(() => {
                setAnimatingLetters(prev =>
                    prev.filter(l => !letters.find(nl => nl.id === l.id))
                );
            }, 1500); // Animation duration

            // Success effect
            if (foundWords.length + 1 === WORDS.length) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }

        setSelection([]);
        setStartPos(null);
    }, [isSelecting, selection, foundWords]);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);
        window.addEventListener('touchcancel', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
            window.removeEventListener('touchcancel', handleMouseUp);
        };
    }, [handleMouseUp]);

    const isCellSelected = (r: number, c: number) => {
        return selection.some(cell => cell.r === r && cell.c === c);
    };

    const getCellWord = (r: number, c: number) => {
        return permanentlySelected.filter(cell => cell.r === r && cell.c === c);
    };

    const resetGame = () => {
        setFoundWords([]);
        setPermanentlySelected([]);
        setSelection([]);
        setAnimatingLetters([]);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto p-4 select-none">
            <div className="text-center space-y-2">
                <h2 className="text-5xl font-black text-indigo-900 flex items-center justify-center gap-3">
                    <Search className="text-sky-500" /> SILLY WISHES WORD SEARCH
                </h2>
                <p className="text-xl font-bold text-indigo-800/60 leading-none uppercase tracking-widest">
                    Find all the hidden magic words!
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full">

                {/* Word List */}
                <div className="lg:w-1/4 w-full grid grid-cols-2 lg:grid-cols-1 gap-3">
                    {WORDS.map(word => (
                        <div
                            key={word}
                            ref={(el) => wordListRef.current[word] = el}
                            className={`p-3 rounded-xl border-2 font-black transition-all duration-300 flex items-center gap-2 ${foundWords.includes(word)
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-700 scale-95'
                                : 'bg-white border-indigo-200 text-indigo-900 shadow-sm'
                                }`}
                        >
                            {foundWords.includes(word) ? <CheckCircle2 size={18} /> : <div className="w-[18px]" />}
                            {word}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div
                    ref={containerRef}
                    onTouchMove={handleTouchMove}
                    className="grid grid-cols-15 gap-1 p-4 bg-white/80 backdrop-blur-sm rounded-[2rem] border-4 border-indigo-900 shadow-2xl relative overflow-hidden"
                    style={{
                        gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
                        width: 'min(90vw, 600px)',
                        aspectRatio: '1/1',
                        touchAction: 'none' // Prevent default touch behaviors
                    }}
                >
                    {GRID_DATA.map((row, r) => (
                        row.map((letter, c) => {
                            const isPerm = getCellWord(r, c);
                            const isSel = isCellSelected(r, c);

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    data-cell={`${r}-${c}`}
                                    onMouseDown={() => handleMouseDown(r, c)}
                                    onMouseEnter={() => handleMouseEnter(r, c)}
                                    onTouchStart={(e) => handleTouchStart(e, r, c)}
                                    className={`
                                        flex items-center justify-center text-sm md:text-lg font-black rounded-md cursor-pointer transition-colors duration-150
                                        ${isPerm.length > 0 ? 'bg-pink-100 text-pink-600' : ''}
                                        ${isSel ? 'bg-sky-400 text-white scale-110 z-10' : 'text-indigo-900'}
                                        ${!isSel && isPerm.length === 0 ? 'hover:bg-indigo-50' : ''}
                                    `}
                                    style={{ border: '1px solid rgba(0,0,0,0.05)' }}
                                >
                                    {letter}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            {/* Animating Letters Layer - 3D Flying Effect */}
            <AnimatePresence>
                {animatingLetters.map((animLetter) => {
                    // Get the grid cell position
                    const cellElement = containerRef.current?.querySelector(
                        `[data-cell="${animLetter.r}-${animLetter.c}"]`
                    );

                    // Get the target word element position
                    const wordElement = wordListRef.current[animLetter.word];

                    if (!cellElement || !wordElement) return null;

                    const cellRect = cellElement.getBoundingClientRect();
                    const wordRect = wordElement.getBoundingClientRect();

                    return (
                        <motion.div
                            key={animLetter.id}
                            initial={{
                                position: 'fixed',
                                left: cellRect.left,
                                top: cellRect.top,
                                width: cellRect.width,
                                height: cellRect.height,
                                scale: 1,
                                rotateZ: 0,
                                rotateY: 0,
                                zIndex: 1000
                            }}
                            animate={{
                                left: wordRect.left,
                                top: wordRect.top,
                                scale: [1, 1.8, 0.8],
                                rotateZ: [0, 360, 720],
                                rotateY: [0, 180, 360],
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.5
                            }}
                            transition={{
                                duration: 1.2,
                                delay: animLetter.letterIndex * 0.08, // Stagger effect
                                ease: [0.34, 1.56, 0.64, 1] // Bouncy easing
                            }}
                            className="flex items-center justify-center text-lg md:text-2xl font-black rounded-md bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-2xl"
                            style={{
                                pointerEvents: 'none',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {animLetter.letter}
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {foundWords.length === WORDS.length && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-900/60 backdrop-blur-md p-6"
                >
                    <div className="glass p-12 rounded-[3.5rem] border-8 border-yellow-400 text-center space-y-8 max-w-2xl w-full">
                        <Trophy size={120} className="text-yellow-400 mx-auto animate-bounce" />
                        <h3 className="text-7xl font-black text-white italic drop-shadow-lg">AWESOME!</h3>
                        <p className="text-2xl font-bold text-white/90 uppercase tracking-widest">You found all the words!</p>
                        <button
                            onClick={resetGame}
                            className="clay-button clay-green px-12 py-5 text-3xl font-black flex items-center gap-4 mx-auto"
                        >
                            <RotateCcw size={32} /> PLAY AGAIN
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Clay Style Footer for consistent feel */}
            <div className="glass p-6 rounded-3xl border-2 border-indigo-900/10 flex items-center gap-4 mt-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-2xl border-2 border-sky-300">💡</div>
                <p className="font-bold text-indigo-900/80 italic">Tip: You can select words horizontally, vertically, and even diagonally!</p>
            </div>
        </div>
    );
};

export default GameWordSearch;
