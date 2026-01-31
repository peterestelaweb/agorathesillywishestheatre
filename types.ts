
export type Category = 'Shopping Centre' | 'Forest Food' | 'The Song' | 'All Vocabulary';

export interface VocabularyItem {
  id: string;
  word: string;
  spanish: string;
  category: Category;
  icon: string;
  color: string;
}

export type GameMode = 'presentation' | 'flashcards' | 'matching' | 'memory' | 'listening' | 'song' | 'scene-builder' | 'menu' | 'drama';
