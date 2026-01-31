
import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { playTheatricalAudio } from '../services/geminiTTS';

interface Props {
  vocabList: VocabularyItem[];
}

const GameFlashcards: React.FC<Props> = ({ vocabList }) => {
  // Track which cards are flipped (Set of IDs)
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

  const handleCardClick = async (item: VocabularyItem) => {
    const isFlipped = flippedIds.has(item.id);
    
    const newFlipped = new Set(flippedIds);
    if (isFlipped) {
      newFlipped.delete(item.id);
    } else {
      newFlipped.add(item.id);
      // Play audio when revealing the word
      await playTheatricalAudio(item.word);
    }
    setFlippedIds(newFlipped);
  };

  const flipAll = (reveal: boolean) => {
    if (reveal) {
      const allIds = new Set(vocabList.map(v => v.id));
      setFlippedIds(allIds);
    } else {
      setFlippedIds(new Set());
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4">
        <button 
          onClick={() => flipAll(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all"
        >
          👀 Girar Todas
        </button>
        <button 
          onClick={() => flipAll(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all"
        >
          🔄 Esconder Todas
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {vocabList.map((item) => {
          const isFlipped = flippedIds.has(item.id);
          return (
            <div 
              key={item.id} 
              className="group perspective-1000 w-full aspect-[3/4] cursor-pointer"
              onClick={() => handleCardClick(item)}
            >
              <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* FRONT SIDE (Image Only) */}
                <div className={`absolute inset-0 w-full h-full backface-hidden ${item.color} rounded-3xl shadow-xl flex flex-col items-center justify-center border-4 border-white`}>
                  <div className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <p className="mt-4 text-emerald-800/50 font-bold uppercase tracking-widest text-sm">Tap to Reveal</p>
                </div>

                {/* BACK SIDE (Image + Text) */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-3xl shadow-xl border-8 border-yellow-300 flex flex-col items-center justify-center p-4 text-center`}>
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-black text-emerald-800 break-words w-full">{item.word}</h3>
                  <p className="text-lg text-gray-500 font-bold italic mt-2">{item.spanish}</p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default GameFlashcards;
