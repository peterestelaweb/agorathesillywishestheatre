
import React, { useState, useRef, useEffect } from 'react';
import { ALL_VOCAB } from '../constants';
import { VocabularyItem } from '../types';
import { playTheatricalAudio } from '../services/geminiTTS';

interface PlacedItem extends VocabularyItem {
  uniqueId: string;
  x: number;
  y: number;
  scale: number;
}

const SceneBuilder: React.FC = () => {
  const [background, setBackground] = useState<'forest' | 'city'>('forest');
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Dragging state
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (item: VocabularyItem) => {
    // Add item to center of screen with random slight offset
    const newItem: PlacedItem = {
      ...item,
      uniqueId: `${item.id}-${Date.now()}`,
      x: 50 + (Math.random() * 10 - 5), // percentage
      y: 50 + (Math.random() * 10 - 5), // percentage
      scale: 1,
    };
    setPlacedItems([...placedItems, newItem]);
    playTheatricalAudio(item.word);
  };

  const handleRemoveItem = () => {
    if (selectedId) {
      setPlacedItems(placedItems.filter(i => i.uniqueId !== selectedId));
      setSelectedId(null);
    }
  };

  const handleClearScene = () => {
    setPlacedItems([]);
    setSelectedId(null);
  };

  // Mouse/Touch Start
  const handleStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.preventDefault(); // Prevent scrolling on touch
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setSelectedId(id);
    isDragging.current = true;

    // Find the item to calculate offset relative to its center
    const item = placedItems.find(i => i.uniqueId === id);
    if (containerRef.current && item) {
      // Just mark starting point, actual movement calc happens in move
      dragOffset.current = { x: clientX, y: clientY };
    }
  };

  // Mouse/Touch Move
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !selectedId || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate movement delta in percentage
    const deltaX = ((clientX - dragOffset.current.x) / containerRect.width) * 100;
    const deltaY = ((clientY - dragOffset.current.y) / containerRect.height) * 100;

    setPlacedItems(prev => prev.map(item => {
      if (item.uniqueId === selectedId) {
        return {
          ...item,
          x: Math.min(Math.max(item.x + deltaX, 0), 100),
          y: Math.min(Math.max(item.y + deltaY, 0), 100),
        };
      }
      return item;
    }));

    // Update reference for next frame
    dragOffset.current = { x: clientX, y: clientY };
  };

  // Mouse/Touch End
  const handleEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-180px)] gap-6 select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div className="flex justify-between items-center bg-[#F0F9FF] p-4 rounded-[2rem] border-4 border-[#0C4A6E]">
        <div className="flex gap-4">
          <button
            onClick={() => setBackground('forest')}
            className={`clay-button px-8 py-3 text-xl font-black transition-all ${background === 'forest' ? 'clay-green scale-105' : 'bg-white'}`}
          >
            🌲 BOSC MÀGIC
          </button>
          <button
            onClick={() => setBackground('city')}
            className={`clay-button px-8 py-3 text-xl font-black transition-all ${background === 'city' ? 'clay-blue scale-105' : 'bg-white'}`}
          >
            🏬 SHOPPING
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRemoveItem}
            disabled={!selectedId}
            className={`clay-button px-6 py-3 text-lg font-black ${selectedId ? 'clay-pink' : 'opacity-30 cursor-not-allowed'}`}
          >
            🗑️ ELIMINAR
          </button>
          <button
            onClick={handleClearScene}
            className="clay-button bg-white px-6 py-3 text-lg font-black border-[#0C4A6E]"
          >
            NETEJAR TOT
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-56 clay-card bg-white overflow-y-auto p-4 flex flex-col gap-4 z-10 custom-scrollbar">
          <h3 className="text-center font-black text-[#0C4A6E] uppercase text-sm tracking-widest border-b-4 border-emerald-100 pb-2">📦 Elements</h3>
          <div className="grid grid-cols-1 gap-4">
            {ALL_VOCAB.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddItem(item)}
                className={`clay-button ${item.color.replace('bg-', 'clay-')} p-4 group`}
              >
                <span className="text-5xl group-hover:scale-125 transition-transform inline-block mb-1 w-12 h-12 flex items-center justify-center">
                  {item.icon.startsWith('/') || item.icon.startsWith('http') ? (
                    <img src={item.icon} alt={item.word} className="w-full h-full object-contain" />
                  ) : (
                    item.icon
                  )}
                </span>
                <span className="block text-[10px] font-black text-[#0C4A6E] uppercase">{item.word}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stage Canvas */}
        <div
          ref={containerRef}
          className={`flex-1 clay-card relative overflow-hidden transition-all duration-700 ${background === 'forest'
            ? 'bg-gradient-to-b from-sky-300 via-emerald-100 to-emerald-400'
            : 'bg-gradient-to-b from-blue-300 via-indigo-100 to-slate-400'
            }`}
        >
          {/* Memphis Decorations & Static Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20 dot-pattern"></div>

          <div className="absolute inset-0 pointer-events-none">
            {background === 'forest' ? (
              <div className="contents">
                <div className="absolute top-10 left-20 text-[12rem] animate-float opacity-40">🌳</div>
                <div className="absolute top-40 right-40 text-[10rem] animate-float-slow opacity-30">🌲</div>
                <div className="absolute bottom-[-2rem] left-0 w-full h-40 bg-emerald-600/20 blur-3xl"></div>
              </div>
            ) : (
              <div className="contents">
                <div className="absolute bottom-10 left-20 text-[14rem] opacity-30">🏢</div>
                <div className="absolute bottom-20 right-10 text-[12rem] opacity-20">🏨</div>
                <div className="absolute top-10 left-1/3 text-[10rem] animate-float opacity-40">☁️</div>
              </div>
            )}
          </div>

          {/* Draggable Items */}
          {placedItems.map((item) => (
            <div
              key={item.uniqueId}
              onMouseDown={(e) => handleStart(e, item.uniqueId)}
              onTouchStart={(e) => handleStart(e, item.uniqueId)}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: selectedId === item.uniqueId ? 50 : 10
              }}
              className={`absolute cursor-grab active:cursor-grabbing flex flex-col items-center select-none group transition-shadow`}
            >
              <div className={`
                text-[10rem] transition-all duration-200
                ${selectedId === item.uniqueId ? 'scale-125 drop-shadow-[0_0_30px_rgba(255,255,0,0.6)]' : 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] hover:scale-110'}
              `}>
                {item.icon.startsWith('/') || item.icon.startsWith('http') ? (
                  <img src={item.icon} alt={item.word} className="w-32 h-32 object-contain" />
                ) : (
                  item.icon
                )}
              </div>
              <div className={`
                clay-card px-6 py-2 text-xl font-black mt-4 whitespace-nowrap
                ${selectedId === item.uniqueId ? 'clay-yellow' : 'bg-white/90'}
              `}>
                {item.word.toUpperCase()}
              </div>
            </div>
          ))}

          {placedItems.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-4 opacity-10">
                <div className="text-[12rem]">🏗️</div>
                <p className="text-5xl font-black uppercase tracking-[1rem]">CREA LA TEVA HISTÒRIA</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneBuilder;
