---
name: karaoke-sync-ai
description: Metodologia per crear reproductors de karaoke amb sincronització automàtica d'àudio, lletra i imatges educatives.
---

# Karaoke Visual Storytelling Methodology

Aquesta skill documenta el procés de creació de reproductors de música interactius on l'àudio, la lletra i el contingut visual (imatges) es sincronitzen per a una experiència educativa immersiva.

## 1. Fase de Preparació Técnica
### A. Timestamps (Whisper AI)
Utilitzem Whisper per obtenir els segons exactes de cada frase.
```bash
whisper canço.mp3 --model small --language en --output_format json --word_timestamps True
```

### B. Mapeig de Contingut (Data Schema)
Estructura l'array per incloure la imatge que correspon a la narrativa de la frase:
```javascript
const LYRICS_WITH_TIMING = [
  { time: 17.12, text: "Save our Forests", img: "/img-forest.png" },
  { time: 24.60, text: "They clean the air", img: "/img-town.png" },
];
```

## 2. Implementació Visual en React
### A. Visor d'Imatges Sincronitzat
Utilitzem un estat `activeImage` que s'actualitza al mateix temps que la línia de la cançó.
- **Transicions**: Aplica `transition-opacity duration-500` per evitar canvis bruscs.
- **Captions Dinàmiques**: Col·loca la frase activa en una caixa destacada sobre la imatge (tipus subtítol premium).

### B. Arquitectura de Dues Columnes (Layout)
Per a una millor usabilitat en tauletes o pissarres interactives:
- **Esquerra (Narrativa)**: Visor d'imatges gran (aspect-square o video) i controls de reproducció fixos.
- **Dreta (Karaoke)**: Llista de lletres scrollable amb `scrollIntoView` automàtic cap al centre.

## 3. Disseny de Contingut (Prompting)
Perquè les imatges tinguin sentit educatiu, utilitzem un estil visual coherent (p.ex. Claymorphism):
- **Estil**: "3D claymation style, playful, vibrant colors, child-friendly".
- **Narrativa**: Adaptar la imatge al significat literal o emocional de la frase per ajudar a la comprensió oral (p.ex. bosc gris vs bosc verd).

## 4. UX i Interactivitat
1. **Jump-to-Scene**: Clicar a una frase de la lletra no només canvia l'àudio, sinó que actualitza instantàniament la imatge del visor.
2. **Clay-UI**: Botons grans i tàctils amb ombres suaus i estats de "premut" molt clars per a nens.
3. **Absència de Text Tècnic**: Elimina qualsevol menció a la tecnologia (IA, segments, etc.) per mantenir la màgia de l'història.
