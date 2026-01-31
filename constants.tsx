
import { VocabularyItem } from './types';

export const SHOPPING_VOCAB: VocabularyItem[] = [
  { id: '1', word: 'Chemist', spanish: 'Farmacia', category: 'Shopping Centre', icon: '💊', color: 'bg-blue-100' },
  { id: '2', word: 'Florist', spanish: 'Floristería', category: 'Shopping Centre', icon: '🌻', color: 'bg-pink-100' },
  { id: '3', word: 'Hairdresser', spanish: 'Peluquería', category: 'Shopping Centre', icon: '✂️', color: 'bg-purple-100' },
  { id: '4', word: 'Clothes Shop', spanish: 'Tienda de Ropa', category: 'Shopping Centre', icon: '👕', color: 'bg-yellow-100' },
  { id: '5', word: 'Public Toilet', spanish: 'Aseo Público', category: 'Shopping Centre', icon: '🚻', color: 'bg-gray-100' },
  { id: '6', word: 'Supermarket', spanish: 'Supermercado', category: 'Shopping Centre', icon: '🛒', color: 'bg-orange-100' },
  { id: '7', word: 'Restaurant', spanish: 'Restaurante', category: 'Shopping Centre', icon: '🍴', color: 'bg-red-100' },
];

export const FOOD_VOCAB: VocabularyItem[] = [
  { id: 'f1', word: 'Honey', spanish: 'Miel', category: 'Forest Food', icon: '🍯', color: 'bg-amber-100' },
  { id: 'f2', word: 'Can of Beans', spanish: 'Lata de Judías', category: 'Forest Food', icon: '🥫', color: 'bg-emerald-100' },
  { id: 'f3', word: 'Mushrooms', spanish: 'Setas', category: 'Forest Food', icon: '🍄', color: 'bg-orange-100' },
  { id: 'f4', word: 'Fruit', spanish: 'Fruta', category: 'Forest Food', icon: '🍎', color: 'bg-red-100' },
  { id: 'f5', word: 'Sausages', spanish: 'Salchichas', category: 'Forest Food', icon: '🌭', color: 'bg-rose-100' },
  { id: 'f6', word: 'Almonds', spanish: 'Almendras', category: 'Forest Food', icon: '/img-almond.png', color: 'bg-yellow-100' },
  { id: 'f7', word: 'Cookies', spanish: 'Galletas', category: 'Forest Food', icon: '🍪', color: 'bg-amber-200' },
];

export const ALL_VOCAB = [...SHOPPING_VOCAB, ...FOOD_VOCAB];
