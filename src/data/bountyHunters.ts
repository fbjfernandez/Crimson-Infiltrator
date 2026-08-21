import type { BountyHunter } from '../types/game';

export const CANTINA_ROSTER: Omit<BountyHunter, 'hired'>[] = [
 
  {
    id: 'Jarek-Vance',
    name: 'Infiltrador Twilek ',
    combatPower: 45,
    costPerParsec: 28,
    specialization: 'evasion',
  },
  {
    id: 'ig-11',
    name: 'Unidad IG-11 ',
    combatPower: 60,
    costPerParsec: 40,
    specialization: 'seguridad',
  },
  {
    id :'embo',
    name:'Embo',
    combatPower: 55,
    costPerParsec: 35,
    specialization: 'seguridad',
  },
  {
    id: 'cad-bane',
    name: 'Cad Bane',
    combatPower: 85,
    costPerParsec: 70,
    specialization: 'evasion', 
  }
];
