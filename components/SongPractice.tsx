
import React, { useState, useRef, useEffect } from 'react';

// Mapeig de la lletra amb timestamps i imatges específiques per a cada frase
const LYRICS_WITH_TIMING = [
  { time: 0, text: "Four wishes, three wishes", img: "/img-wishes.png" },
  { time: 10.76, text: "Two wishes, one wish", img: "/img-wishes.png" },
  { time: 12.82, text: "Four wishes, three wishes", img: "/img-wishes.png" },
  { time: 14.76, text: "Two wishes, one wish", img: "/img-wishes.png" },
  { time: 17.12, text: "Save our Forests", img: "/img-forest.png" },
  { time: 18.64, text: "Stop cutting them down", img: "/img-stop.png" },
  { time: 24.60, text: "They clean the air", img: "/img-town.png" },
  { time: 26.58, text: "In our smelly old town", img: "/img-town.png" },
  { time: 32.82, text: "Save our Forests", img: "/img-forest.png" },
  { time: 37.66, text: "We need our trees", img: "/img-hug.png" },
  { time: 40.96, text: "Home to the birds", img: "/img-animals.png" },
  { time: 45.10, text: "The bears and the bees", img: "/img-animals.png" },
  { time: 49.12, text: "Trees, trees, trees", img: "/img-trees.png" },
  { time: 50.92, text: "We need to work together", img: "/img-earth.png" },
  { time: 52.94, text: "Trees, trees, trees", img: "/img-trees.png" },
  { time: 54.96, text: "To make our world better", img: "/img-earth.png" },
  { time: 58.00, text: "🎵 (Instrumental)", img: "/img-forest.png" },
  { time: 65.28, text: "Save our Forests", img: "/img-forest.png" },
  { time: 67.50, text: "Stop cutting them down", img: "/img-stop.png" },
  { time: 73.36, text: "They clean the air", img: "/img-town.png" },
  { time: 75.48, text: "In our smelly old town", img: "/img-town.png" },
  { time: 81.62, text: "Save our Forests", img: "/img-forest.png" },
  { time: 83.76, text: "We need our trees", img: "/img-hug.png" },
  { time: 89.66, text: "Home to the birds", img: "/img-animals.png" },
  { time: 91.80, text: "The bears and the bees", img: "/img-animals.png" },
  { time: 97.92, text: "Trees, trees, trees", img: "/img-trees.png" },
  { time: 99.74, text: "We need to work together", img: "/img-earth.png" },
  { time: 101.82, text: "Trees, trees, trees", img: "/img-trees.png" },
  { time: 103.90, text: "To make our world better", img: "/img-earth.png" },
  { time: 106.24, text: "Four wishes, three wishes", img: "/img-wishes.png" },
  { time: 108.38, text: "Two wishes, one wish", img: "/img-wishes.png" },
  { time: 110.42, text: "Four wishes, three wishes", img: "/img-wishes.png" },
  { time: 112.42, text: "Two wishes, one wish", img: "/img-wishes.png" },
  { time: 113.34, text: "One wish", img: "/img-wishes.png" },
  { time: 119.08, text: "Stop cutting them down!", img: "/img-stop.png" },
];

const SongPractice: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string>("/img-wishes.png");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

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
        if (activeIndex >= 0) {
          setActiveImage(LYRICS_WITH_TIMING[activeIndex].img);
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
    if (isPlaying) { audio.pause(); } else { audio.play(); }
  };

  const handleLineClick = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = LYRICS_WITH_TIMING[index].time;
    if (!isPlaying) { audio.play(); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black text-[#0C4A6E] tracking-tight animate-float font-display">
          THE SILLY WISHES SONG 🌳
        </h2>
        <p className="text-3xl font-bold text-[#0EA5E9]">
          Canta amb nosaltres i salva el bosc!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* COLUMNA ESQUERRA: VISOR VISUAL (L'escena pedagògica) */}
        <div className="space-y-8 sticky top-4">
          <div className="clay-card clay-blue p-6 overflow-hidden shadow-2xl transition-all duration-500">
            <div className="aspect-square relative rounded-[3rem] overflow-hidden border-8 border-white bg-slate-100">
              {/* IMATGE DE FONS */}
              <img
                src={activeImage}
                className="w-full h-full object-cover transition-opacity duration-700"
                alt="Story Illustration"
              />

              {/* CAPTION AREA (La frase prominent) */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="clay-card bg-white/90 backdrop-blur-md p-6 border-4 border-[#0C4A6E] transform -rotate-1">
                  <p className="text-[#0C4A6E] text-4xl font-black text-center uppercase tracking-tight leading-none font-display">
                    {activeLine !== null ? LYRICS_WITH_TIMING[activeLine].text : "Get Ready! 🎶"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="clay-card clay-yellow p-8 text-center space-y-6">
            <div className="flex items-center justify-between gap-6">
              <button
                onClick={togglePlayPause}
                className="clay-button clay-blue px-12 py-6 text-3xl font-black flex items-center justify-center gap-4 flex-1 hover:scale-105 transition-transform"
              >
                <span className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</span>
                <span>{isPlaying ? 'PAUSA' : 'REPRODUIR'}</span>
              </button>
              <div className="text-2xl font-black text-[#0C4A6E] bg-white/50 px-6 py-4 rounded-3xl border-4 border-[#0C4A6E]">
                {formatTime(currentTime)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 100}
              value={currentTime}
              onChange={(e) => {
                if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value);
              }}
              className="w-full h-4 bg-white/50 rounded-full appearance-none cursor-pointer accent-[#0C4A6E] border-4 border-[#0C4A6E]"
            />
          </div>
        </div>

        {/* COLUMNA DRETA: LLETRA SCROLLABLE (KARAOKE) */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-4xl text-[#0C4A6E]">🎤</span>
            <h3 className="text-4xl font-black uppercase text-[#0C4A6E] font-display">Lyrics</h3>
          </div>

          <div className="grid gap-4 max-h-[70vh] overflow-y-auto p-6 rounded-[3rem] bg-white/40 backdrop-blur-sm scrollbar-hide border-4 border-[#0C4A6E]/10 shadow-inner">
            {LYRICS_WITH_TIMING.map((lyric, index) => {
              const isActive = activeLine === index;
              const isPast = activeLine !== null && index < activeLine;

              return (
                <button
                  key={index}
                  id={`lyric-${index}`}
                  onClick={() => handleLineClick(index)}
                  className={`clay-button p-6 px-10 text-3xl font-black transition-all transform duration-300 w-full text-center ${isActive
                      ? 'clay-green scale-105 z-10 shadow-[0_0_30px_rgba(34,197,94,0.3)] border-[#15803D]'
                      : isPast
                        ? 'clay-blue opacity-30 scale-95'
                        : 'bg-white opacity-90'
                    }`}
                >
                  <span className="font-display leading-tight uppercase">
                    {lyric.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="/the-silly-wishes-song.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setActiveLine(null); setCurrentTime(0); }}
      />
    </div>
  );
};

export default SongPractice;
