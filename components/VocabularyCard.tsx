
import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { playTheatricalAudio } from '../services/geminiTTS';

interface Props {
  item: VocabularyItem;
}

const VocabularyCard: React.FC<Props> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = async () => {
    setIsPlaying(true);
    await playTheatricalAudio(item.word);
    setIsPlaying(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`voc-card clay-card ${item.color.replace('bg-', 'clay-')} p-10 flex flex-col items-center gap-6 text-center transform active:scale-95 transition-transform`}
    >
      <div className="voc-card-inner flex flex-col items-center gap-4">
        <div className="text-8xl mb-2 drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform">{item.icon}</div>
        <h3 className="text-4xl font-black">{item.word}</h3>
        <p className="text-xl font-bold opacity-60 italic">{item.spanish}</p>
        <div className={`mt-4 p-4 rounded-full border-4 border-[#0C4A6E] ${isPlaying ? 'bg-yellow-400 animate-bounce' : 'bg-white'} shadow-[0_4px_0_#0C4A6E]`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default VocabularyCard;
