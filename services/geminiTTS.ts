
import { GoogleGenAI, Modality } from "@google/genai";

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

/**
 * Reprodueix àudio teatral i retorna la durada en mil·lisegons
 */
export const playTheatricalAudio = async (word: string, isSong: boolean = false): Promise<number> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Fallback to local SpeechSynthesis if no API key
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    return playSpeechSynthesisFallback(word);
  }

  const ai = new GoogleGenAI(apiKey);
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

  try {
    const prompt = isSong
      ? `Perform this song lyric with a rhythmic, musical and very theatrical British accent, as if you were in a professional musical play: "${word}"`
      : `Say enthusiastically and theatrically with a clear British accent: "${word}"`;

    const response = await ai.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data");

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1
    );

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

    return (audioBuffer.duration * 1000) + 100;
  } catch (error) {
    console.error("Gemini TTS Error, falling back:", error);
    return await playSpeechSynthesisFallback(word);
  }
};

const playSpeechSynthesisFallback = async (text: string): Promise<number> => {
  if (!window.speechSynthesis) return 2000;

  // Cancel previous speech to avoid overlapping
  window.speechSynthesis.cancel();

  // Wait for voices to be loaded (essential for consistent voice selection)
  const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let voiceList = window.speechSynthesis.getVoices();

    if (voiceList.length > 0) {
      resolve(voiceList);
    } else {
      // Voices not loaded yet, wait for the event
      const handleVoicesChanged = () => {
        voiceList = window.speechSynthesis.getVoices();
        if (voiceList.length > 0) {
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve(voiceList);
        }
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

      // Fallback timeout in case voices never load
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve(window.speechSynthesis.getVoices());
      }, 1000);
    }
  });

  const utterance = new SpeechSynthesisUtterance(text);

  // Priority order: British English > Any English > Default
  const britishVoice = voices.find(v =>
    (v.lang === 'en-GB' || v.lang === 'en_GB') && v.name.toLowerCase().includes('uk')
  ) || voices.find(v =>
    v.lang === 'en-GB' || v.lang === 'en_GB'
  ) || voices.find(v =>
    v.lang.startsWith('en-') || v.lang.startsWith('en_')
  );

  if (britishVoice) {
    utterance.voice = britishVoice;
    console.log('Using voice:', britishVoice.name, britishVoice.lang);
  } else {
    console.warn('No British voice found, using default with lang=en-GB');
  }

  utterance.lang = 'en-GB';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  window.speechSynthesis.speak(utterance);
  return 2000;
};
