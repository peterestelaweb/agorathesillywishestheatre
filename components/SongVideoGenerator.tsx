
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { playTheatricalAudio } from '../services/geminiTTS';

const LYRICS = [
  "Four wishes, three wishes",
  "Two wishes, one wish",
  "Four wishes, three wishes",
  "Two wishes, one wish",
  "Save our Forests!",
  "Stop cutting them down!",
  "They clean the air",
  "In our smelly old town",
  "Save our Forests",
  "We need our trees",
  "Home to the birds",
  "The bears and the bees",
  "Trees, trees, trees",
  "We need to work together",
  "Trees, trees, trees",
  "To make our world better",
  "Four wishes, three wishes",
  "Two wishes, one wish",
  "Stop cutting them down!"
];

const SongVideoGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    "Composant la melodia forestal...",
    "Dibuixant els arbres màgics...",
    "Assajant amb els actors de la IA...",
    "Preparant els micròfons al bosc...",
    "Gairebé llest per a l'estrena!"
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      let i = 0;
      interval = setInterval(() => {
        setLoadingMsg(loadingMessages[i % loadingMessages.length]);
        i++;
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerateVideo = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setLoadingMsg(loadingMessages[0]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'Cinematic magical forest with giant ancient trees, floating glowing particles, birds flying through sunbeams, high fantasy style, 4k, vibrant green and gold colors',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
      console.error(error);
      alert("Error al generar el vídeo. Revisa la teva clau de l'API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startSongPerformance = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setProgress(0);

    for (let i = 0; i < LYRICS.length; i++) {
      setCurrentLineIdx(i);
      setProgress(((i + 1) / LYRICS.length) * 100);
      
      // Reproduïm l'àudio i esperem exactament la seva durada per sincronitzar el subtítol
      const duration = await playTheatricalAudio(LYRICS[i], true);
      await new Promise(r => setTimeout(r, duration));
    }

    setIsPlaying(false);
    setCurrentLineIdx(-1);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 max-w-5xl mx-auto">
      {!videoUrl && !isGenerating && (
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center border-b-8 border-emerald-300">
          <div className="text-9xl mb-6">🎬</div>
          <h2 className="text-4xl font-black text-gray-800 mb-4">The Silly Wishes Cinema</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Vols veure el bosc màgic i cantar la cançó amb subtítols sincronitzats?
          </p>
          <button 
            onClick={handleGenerateVideo}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-xl transition-all hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <span>✨</span> Generar Show Musical
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center gap-8 p-12 bg-white rounded-[3rem] shadow-xl w-full border-4 border-emerald-100">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🌲</div>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-emerald-800 animate-pulse">{loadingMsg}</h3>
            <p className="text-gray-500 mt-2">Creant una experiència única per a la classe...</p>
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-black group">
          <video 
            src={videoUrl} 
            className="w-full h-full object-cover opacity-80" 
            autoPlay 
            loop 
            muted 
          />
          
          {/* Subtitles Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end items-center p-16 pointer-events-none">
            {currentLineIdx >= 0 && (
              <div className="bg-black/50 backdrop-blur-lg px-12 py-6 rounded-[2rem] border-4 border-white/30 transform transition-all duration-300 scale-110">
                <p className="text-4xl md:text-7xl font-black text-white text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight uppercase">
                  {LYRICS[currentLineIdx]}
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <div className="absolute top-0 left-0 w-full h-4 bg-white/20">
              <div 
                className="h-full bg-yellow-400 transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
               <button 
                onClick={startSongPerformance}
                className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 text-4xl font-black py-8 px-16 rounded-full shadow-2xl transform hover:scale-110 flex items-center gap-6 active:scale-95 transition-all"
              >
                <span className="text-6xl">🎵</span>
                <div className="text-left">
                  <div className="leading-none">PLAY SONG</div>
                  <div className="text-lg font-bold opacity-70">Amb subtítols</div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
      
      {videoUrl && !isPlaying && (
        <div className="flex flex-col items-center gap-2">
           <button 
            onClick={() => setVideoUrl(null)}
            className="text-emerald-700 font-bold hover:underline flex items-center gap-2"
          >
            <span>🔄</span> Generar un nou decorat pel bosc
          </button>
        </div>
      )}
    </div>
  );
};

export default SongVideoGenerator;
