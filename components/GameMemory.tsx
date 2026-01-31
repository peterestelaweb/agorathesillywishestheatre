
import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';
import { playTheatricalAudio } from '../services/geminiTTS';
import { playFeedbackSound } from '../services/soundEffects';
import Timer from './Timer';

interface Props {
  vocabList: VocabularyItem[];
  onComplete: (finalTime: number) => void;
}

interface Card {
  uniqueId: string;
  vocabId: string;
  type: 'text' | 'image';
  content: string;
  color: string;
}

const GameMemory: React.FC<Props> = ({ vocabList, onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize game
  useEffect(() => {
    const gameCards: Card[] = [];
    vocabList.forEach((item) => {
      // Create Text Card
      gameCards.push({
        uniqueId: `${item.id}-text`,
        vocabId: item.id,
        type: 'text',
        content: item.word,
        color: item.color,
      });
      // Create Image Card
      gameCards.push({
        uniqueId: `${item.id}-image`,
        vocabId: item.id,
        type: 'image',
        content: item.icon,
        color: item.color,
      });
    });

    // Shuffle
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [vocabList]);

  const handleCardClick = async (index: number) => {
    // Prevent clicking if locked, already matched, or already flipped
    if (isLocked || matchedIds.has(cards[index].vocabId) || flippedIndices.includes(index)) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If 2 cards are flipped, check match
    if (newFlipped.length === 2) {
      setIsLocked(true);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.vocabId === card2.vocabId) {
        // Match found
        playFeedbackSound('success');
        const matchedWord = vocabList.find(v => v.id === card1.vocabId)?.word || "";

        // Play audio slightly delayed to not overlap with success sound
        setTimeout(() => playTheatricalAudio(matchedWord), 300);

        const newMatched = new Set(matchedIds);
        newMatched.add(card1.vocabId);
        setMatchedIds(newMatched);
        setFlippedIndices([]);
        setIsLocked(false);

        // Check Win Condition
        if (newMatched.size === vocabList.length) {
          setTimeout(() => onComplete(currentTime), 1000);
        }
      } else {
        // No match
        playFeedbackSound('error');
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1200);
      }
    }
  };

  // Determine grid columns based on number of cards
  const gridClass = cards.length > 20
    ? "grid-cols-4 sm:grid-cols-5 md:grid-cols-7" // Dense grid for All Vocab (28 cards -> 4x7)
    : "grid-cols-4 md:grid-cols-5"; // Standard grid

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="flex justify-center bg-white/50 backdrop-blur-sm p-4 rounded-full border-4 border-[#0C4A6E]">
        <Timer isActive={matchedIds.size < vocabList.length} onTick={setCurrentTime} />
      </div>

      <div className={`grid ${gridClass} gap-6 w-full max-w-7xl`}>
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedIds.has(card.vocabId);
          const isMatched = matchedIds.has(card.vocabId);

          return (
            <div
              key={card.uniqueId}
              className="perspective-1000 w-full aspect-[4/5] cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              <div
                className="relative w-full h-full transform-style-3d"
                style={{
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >

                {/* BACK SIDE (Hidden) */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-white clay-card flex items-center justify-center hover:bg-[#E0F2FE] transition-colors p-2 shadow-[0_8px_0_#0C4A6E] border-4 border-[#0C4A6E] rounded-[28px] overflow-hidden">
                  <div className="absolute inset-0 opacity-10 dot-pattern"></div>
                  <span className="text-5xl">❓</span>
                </div>

                {/* FRONT SIDE (Revealed) */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden clay-card flex flex-col items-center justify-center p-3 text-center transition-colors duration-300 ${isMatched ? 'clay-green' : 'bg-white'} border-4 border-[#0C4A6E] rounded-[28px] shadow-[0_8px_0_#0C4A6E]`}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {card.type === 'image' ? (
                    <div className="text-6xl drop-shadow-lg scale-125 w-full h-full flex items-center justify-center">
                      {card.content.startsWith('/') || card.content.startsWith('http') ? (
                        <img src={card.content} alt="memory card" className="w-full h-full object-contain" />
                      ) : (
                        card.content
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-[#0C4A6E] break-words w-full leading-tight uppercase font-display">{card.content}</div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <div className="text-2xl font-black text-white bg-[#0C4A6E] px-10 py-4 rounded-full shadow-[0_6px_0_#062a3f] transform hover:scale-105 transition-transform">
        PARELLES: {matchedIds.size} / {vocabList.length} 🎈
      </div>
    </div>
  );
};

export default GameMemory;
