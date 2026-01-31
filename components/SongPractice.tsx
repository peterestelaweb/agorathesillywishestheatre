
import React, { useState, useRef, useEffect } from 'react';

// Letra de la canción con TIMESTAMPS REALES extraídos con Whisper AI
const LYRICS_WITH_TIMING = [
  { time: 8.36, text: "Four wishes, three wishes" },
  { time: 10.76, text: "Two wishes, one wish" },
  { time: 12.82, text: "Four wishes, three wishes" },
  { time: 14.76, text: "Two wishes, one wish" },
  { time: 17.12, text: "Save our Forests" },
  { time: 18.64, text: "Stop cutting them down" },
  { time: 24.60, text: "They clean the air" },
  { time: 26.58, text: "In our smelly old town" },
  { time: 32.82, text: "Save our Forests" },
  { time: 37.66, text: "We need our trees" },
  { time: 40.96, text: "Home to the birds" },
  { time: 45.10, text: "The bears and the bees" },
  { time: 49.12, text: "Trees, trees, trees" },
  { time: 50.92, text: "We need to work together" },
  { time: 52.94, text: "Trees, trees, trees" },
  { time: 54.96, text: "To make our world better" },
  { time: 58.00, text: "🎵 (Instrumental Break)" },
  { time: 65.28, text: "Save our Forests" },
  { time: 67.50, text: "Stop cutting them down" },
  { time: 73.36, text: "They clean the air" },
  { time: 75.48, text: "In our smelly old town" },
  { time: 81.62, text: "Save our Forests" },
  { time: 83.76, text: "We need our trees" },
  { time: 89.66, text: "Home to the birds" },
  { time: 91.80, text: "The bears and the bees" },
  { time: 97.92, text: "Trees, trees, trees" },
  { time: 99.74, text: "We need to work together" },
  { time: 101.82, text: "Trees, trees, trees" },
  { time: 103.90, text: "To make our world better" },
  { time: 106.24, text: "Four wishes, three wishes" },
  { time: 108.38, text: "Two wishes, one wish" },
  { time: 110.42, text: "Four wishes, three wishes" },
  { time: 112.42, text: "Two wishes, one wish" },
  { time: 113.34, text: "One wish" },
  { time: 119.08, text: "Stop cutting them down!" },
];

const SongPractice: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      // Encontrar la línea activa
      let activeIndex = -1;
      for (let i = 0; i < LYRICS_WITH_TIMING.length; i++) {
        if (time >= LYRICS_WITH_TIMING[i].time) {
          activeIndex = i;
        } else {
          break;
        }
      }

      if (activeIndex !== activeLine) {
        setActiveLine(activeIndex >= 0 ? activeIndex : null);

        // Auto-scroll a la línea activa
        if (activeIndex >= 0) {
          const element = document.getElementById(`lyric-${activeIndex}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [activeLine]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleLineClick = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = LYRICS_WITH_TIMING[index].time;
    if (!isPlaying) {
      audio.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black text-[#0C4A6E] tracking-tight animate-float">
          THE SILLY WISHES SONG 🌳
        </h2>
        <p className="text-3xl font-bold text-[#0EA5E9]">
          Canta amb nosaltres! Sincronització màgica activada ✨
        </p>
      </div>

      {/* Reproductor Principal */}
      <div className="clay-card clay-yellow p-12 text-center space-y-8 sticky top-4 z-20 shadow-2xl">
        <div className="flex items-center justify-between gap-8">
          <div className="text-6xl animate-pulse">🎵</div>

          <button
            onClick={togglePlayPause}
            className="clay-button clay-blue px-12 py-6 text-3xl font-black flex items-center justify-center gap-4 flex-1 group hover:scale-105 transition-transform"
          >
            <span className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</span>
            <span>{isPlaying ? 'PAUSA' : 'REPRODUIR'}</span>
          </button>

          <div className="text-2xl font-black text-[#0C4A6E] bg-white/50 px-6 py-4 rounded-3xl border-4 border-[#0C4A6E] min-w-[140px]">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Barra de Progreso Interactive */}
        <div className="relative h-10 flex items-center">
          <input
            type="range"
            min="0"
            max={audioRef.current?.duration || 100}
            value={currentTime}
            onChange={(e) => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = parseFloat(e.target.value);
              }
            }}
            className="w-full h-4 bg-white/50 rounded-full appearance-none cursor-pointer accent-[#0C4A6E] border-4 border-[#0C4A6E]"
          />
        </div>
      </div>

      {/* Letra Sincronizada (Karaoke) */}
      <div className="space-y-6">
        <h3 className="text-4xl font-black text-center text-[#0C4A6E] uppercase mb-8">
          🎤 Karaoke Time
        </h3>

        <div
          ref={scrollContainerRef}
          className="grid gap-6 max-w-4xl mx-auto p-4 max-h-[60vh] overflow-y-auto rounded-[3rem] bg-white/20 backdrop-blur-sm scrollbar-hide"
        >
          {LYRICS_WITH_TIMING.map((lyric, index) => {
            const isActive = activeLine === index;
            const isPast = activeLine !== null && index < activeLine;

            return (
              <button
                key={index}
                id={`lyric-${index}`}
                onClick={() => handleLineClick(index)}
                className={`clay-button p-8 px-12 text-4xl font-black transition-all transform duration-300 w-full ${isActive
                    ? 'clay-green scale-105 z-10 shadow-[0_0_40px_rgba(34,197,94,0.4)]'
                    : isPast
                      ? 'clay-blue opacity-40 scale-95'
                      : 'bg-white opacity-90'
                  } ${lyric.text.includes('🎵') ? 'clay-purple text-2xl italic opacity-60' : ''}`}
              >
                <div className="flex items-center justify-center text-center gap-8">
                  {isActive && <span className="animate-bounce">👉</span>}
                  <span className="font-display leading-tight uppercase">
                    {lyric.text}
                  </span>
                  {isActive && <span className="animate-bounce">👈</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="clay-card clay-pink p-8 text-center bg-white/80">
        <p className="text-3xl font-black text-pink-700">FET AMB MÀGIA I INTEL·LIGÈNCIA ARTIFICIAL 🤖✨</p>
        <p className="text-xl font-bold text-pink-600 mt-2">La lletra s'ha sincronitzat automàticament escoltant la cançó.</p>
      </div>

      <audio
        ref={audioRef}
        src="/the-silly-wishes-song.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setActiveLine(null);
          setCurrentTime(0);
        }}
      />
    </div>
  );
};

export default SongPractice;
