
import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';
import Timer from './Timer';
import { playFeedbackSound } from '../services/soundEffects';

interface Props {
  vocabList: VocabularyItem[];
  onComplete: (finalTime: number) => void;
}

const GameMatching: React.FC<Props> = ({ vocabList, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState<VocabularyItem[]>([]);
  const [shuffledIcons, setShuffledIcons] = useState<VocabularyItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ id: string, type: 'success' | 'error' } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setShuffledWords([...vocabList].sort(() => Math.random() - 0.5));
    setShuffledIcons([...vocabList].sort(() => Math.random() - 0.5));
  }, [vocabList]);

  const handleWordSelect = (id: string) => {
    if (matches.has(id)) return;
    setSelectedWord(id);
  };

  const handleIconSelect = (id: string) => {
    if (!selectedWord || matches.has(id)) return;

    if (selectedWord === id) {
      playFeedbackSound('success');
      setMatches(prev => new Set([...prev, id]));
      setFeedback({ id, type: 'success' });
      setSelectedWord(null);
      if (matches.size + 1 === vocabList.length) {
        setTimeout(() => onComplete(currentTime), 1000);
      }
    } else {
      playFeedbackSound('error');
      setFeedback({ id, type: 'error' });
      setTimeout(() => setFeedback(null), 500);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center -mb-4">
        <div className="bg-[#F0F9FF] p-4 rounded-full border-4 border-[#0C4A6E] shadow-[0_4px_0_#0C4A6E]">
          <Timer isActive={matches.size < vocabList.length} onTick={setCurrentTime} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16 max-w-5xl mx-auto w-full px-4">
        <div className="flex flex-col gap-6">
          <h4 className="text-4xl font-black text-[#0C4A6E] text-center mb-2 uppercase tracking-tight">PARAULES</h4>
          {shuffledWords.map(item => (
            <button
              key={item.id}
              onClick={() => handleWordSelect(item.id)}
              disabled={matches.has(item.id)}
              className={`clay-button p-6 px-10 text-3xl font-black transition-all ${matches.has(item.id)
                  ? 'clay-green opacity-40 pointer-events-none'
                  : selectedWord === item.id
                    ? 'clay-blue scale-110 !shadow-[0_12px_0_var(--text-main)] z-10'
                    : 'bg-white'
                }`}
            >
              <span className="font-display">{item.word.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-4xl font-black text-[#0C4A6E] text-center mb-2 uppercase tracking-tight">DIBUIXOS</h4>
          {shuffledIcons.map(item => (
            <button
              key={item.id}
              onClick={() => handleIconSelect(item.id)}
              disabled={matches.has(item.id)}
              className={`clay-button p-4 text-7xl transition-all ${matches.has(item.id)
                  ? 'clay-green opacity-40 pointer-events-none'
                  : feedback?.id === item.id && feedback.type === 'error'
                    ? 'clay-pink animate-shake'
                    : 'bg-white'
                }`}
            >
              <div className="drop-shadow-md">{item.icon}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="inline-block bg-[#0C4A6E] text-white px-8 py-4 rounded-[2rem] shadow-[0_6px_0_#062a3f]">
          <span className="text-2xl font-black">{matches.size} d'un total de {vocabList.length} 🧩</span>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) rotate(-1deg); }
          75% { transform: translateX(8px) rotate(1deg); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default GameMatching;
