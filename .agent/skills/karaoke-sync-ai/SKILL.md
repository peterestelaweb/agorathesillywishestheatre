---
name: karaoke-sync-ai
description: Metodologia per crear reproductors de karaoke amb sincronització automàtica mitjançant Whisper AI i React.
---

# Karaoke AI Sync Methodology

Aquesta skill documenta el procés de creació de reproductors de música interactius amb lletres sincronitzades automàticament.

## 1. Fase d'Anàlisi d'Àudio (Whisper AI)
Utilitzem Whisper per obtenir timestamps de precisió quirúrgica.
```bash
whisper [nom_arxiu].mp3 --model small --language en --output_format json --word_timestamps True
```
Això genera un fitxer `.json` on busquem l'atribut `segments` o `words` per obtenir els segons d'inici de cada frase.

## 2. Implementació en React
El component ha de gestionar tres pilars:

### A. Estat de Temps Real
```tsx
useEffect(() => {
  const updateTime = () => {
    const time = audioRef.current.currentTime;
    // Lògica per trobar l'activeIndex comparant time amb LYRICS_WITH_TIMING
  };
  const interval = setInterval(updateTime, 100);
  return () => clearInterval(interval);
}, []);
```

### B. Feedback Visual Tàctil (Claymorphism)
- **Activa**: Escala 1.05, colors vibrants (verd), animacions de bot (bounce).
- **Passada**: Baixa opacitat (0.4), colors neutres.
- **Futura**: Opacitat normal, fons blanc o neutre.

### C. Navegació Interactiva
Permetre que l'usuari cliqui qualsevol frase per canviar el `currentTime` del reproductor:
```tsx
const handleLineClick = (index) => {
  audioRef.current.currentTime = LYRICS_WITH_TIMING[index].time;
};
```

## 3. UX Tips per a Nens
1. **Auto-Scroll**: La línia activa ha de fer scroll automàtic (`scrollIntoView`) cap al centre de la pantalla.
2. **Visual Cues**: Utilitzar emojis o icones que es moguin per indicar que aquesta és la part que s'ha de cantar.
3. **Navegació Visual**: Una barra de progrés gran i fàcil d'arrossegar.
