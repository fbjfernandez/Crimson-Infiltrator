import type { Planet } from '../types/game';

export const INITIAL_PLANETS: Planet[] = [
  {
    id: 'kessel',
    name: 'Kessel',
    coordinateX: 78,
    coordinateY: 35,
    lawIndex: 0.7,
    naturalHazard: 0.3, 
    market: [
      { item: 'especia', price: 150, basePrice: 150, stock: 500 },
      { item: 'coaxium', price: 1000, basePrice: 1000, stock: 90 },
    ],
  },
  {
    id: 'tatooine',
    name: 'Tatooine',
    coordinateX: 68,
    coordinateY: 42,
    lawIndex: 0.2,
    naturalHazard: 0.5, 
    market: [
      { item: 'blasters', price: 350, basePrice: 350, stock: 120 }, 
      { item: 'especia', price: 400, basePrice: 400, stock: 50 },
    ],
  },
  {
    id: 'coruscant',
    name: 'Coruscant',
    coordinateX: 50,
    coordinateY: 50,
    lawIndex: 0.90, 
    naturalHazard: 0.02,
    market: [
      { item: 'coaxium', price: 1800, basePrice: 1800, stock: 90 },
      { item: 'especia', price: 900, basePrice: 900, stock: 60 }, 
      { item: 'blasters', price: 600, basePrice: 600, stock: 40 },
    ],
  },
  {
    id: 'ryloth',
    name: 'Ryloth',
    coordinateX: 82,
    coordinateY: 28,
    lawIndex: 0.6,
    naturalHazard: 0.4, 
    market: [
      { item: 'coaxium', price: 900, basePrice: 900, stock: 800 },
      { item: 'especia', price: 220, basePrice: 200, stock: 200 },
      { item: 'blasters', price: 600, basePrice: 600, stock: 400 },
    ],
  },
];

export const GOOD_LABELS: Record<string, string> = {
  especia: 'Especia',
  coaxium: 'Coaxium',
  blasters: 'Blásters',
};