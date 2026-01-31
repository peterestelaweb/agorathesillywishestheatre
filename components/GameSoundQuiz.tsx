
import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';
import { playTheatricalAudio } from '../services/geminiTTS';
import { playFeedbackSound } from '../services/soundEffects';
import Timer from './Timer';

interface Props {
  vocabList: VocabularyItem[];
  onComplete: (finalTime: number) => void;
}

const GameSoundQuiz: React.FC<Props> = ({ vocabList, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const targetItem = vocabList[currentIdx];

  useEffect(() => {
    if (targetItem && !isFinished) {
      const otherOptions = vocabList
        .filter(i => i.id !== targetItem.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setOptions([...otherOptions, targetItem].sort(() => Math.random() - 0.5));
      playTheatricalAudio(targetItem.word);
    }
  }, [currentIdx, vocabList, isFinished]);

  const handleOptionClick = (item: VocabularyItem) => {
    if (selectedOption || isFinished) return;

    setSelectedOption(item.id);
    const correct = item.id === targetItem.id;

    if (correct) {
      playFeedbackSound('success');
      setTimeout(() => {
        if (currentIdx + 1 < vocabList.length) {
          setCurrentIdx(c => c + 1);
          setSelectedOption(null);
        } else {
          setIsFinished(true);
          onComplete(currentTime);
        }
      }, 1500);
    } else {
      playFeedbackSound('error');
      setTimeout(() => setSelectedOption(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-14">
      <div className="flex justify-center -mb-8">
        <div className="bg-[#F0F9FF] p-4 rounded-full border-4 border-[#0C4A6E] shadow-[0_4px_0_#0C4A6E]">
          <Timer isActive={!isFinished} onTick={setCurrentTime} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <button
          onClick={() => playTheatricalAudio(targetItem.word)}
          className="clay-button clay-yellow p-12 transition-transform hover:scale-110 active:scale-95 group"
          style={{ borderRadius: '50%', padding: '3rem' }}
        >
          <div className="group-hover:animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          </div>
        </button>
        <p className="text-4xl font-black text-[#0C4A6E] animate-bounce uppercase tracking-tighter">Fes clic per escoltar!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {options.map(item => (
          <button
            key={item.id}
            onClick={() => handleOptionClick(item)}
            className={`clay-button p-8 text-8xl flex flex-col items-center justify-center transition-all ${selectedOption === item.id
                ? item.id === targetItem.id
                  ? 'clay-green scale-110'
                  : 'clay-pink animate-shake'
                : 'bg-white'
              }`}
          >
            <span className="drop-shadow-md">{item.icon}</span>
          </button>
        ))}
      </div>

      <div className="text-3xl font-black text-white bg-[#0C4A6E] px-10 py-4 rounded-full shadow-[0_6px_0_#062a3f]">
        PROGRÉS: {currentIdx + 1} / {vocabList.length} 🚀
      </div>
    </div>
  );
};

export default GameSoundQuiz;
