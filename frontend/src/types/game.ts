
export type GoodId = 'especia' | 'coaxium' | 'blasters' | 'chatarra';

export interface MarketListing {
  item: GoodId;
  price: number; 
  stock: number; 
  basePrice: number; 
}

export interface Planet {
  id: string;
  name: string;
  coordinateX: number; 
  coordinateY: number;
  lawIndex: number; 
  naturalHazard: number; 
  market: MarketListing[];
}

export type RouteType = 'comercial' | 'contrabando' | 'atajo';

export interface RouteNode {
  id: string;
  type: RouteType;
  originId: string;
  destinationId: string;
  distance: number; 
  interceptionRisk: number; 
  hazardRisk: number; 
  fuelCost: number; 
  etaParsecs: number; 
}

export interface Starship {
  name: string;
  hull: number; 
  fuel: number; 
  cargoCapacity: number; 
  currentCargo: number; 
  hyperdriveClass: number; 
  shieldRating: number; 
}

export interface CargoHold {
  item: GoodId;
  quantity: number;
  avgBuyPrice: number;
}

export interface BountyHunter {
  id: string;
  name: string;
  combatPower: number;
  costPerParsec: number;
  specialization: 'seguridad' | 'evasion' ;
  hired: boolean;
}

export type TravelState = 'IDLE' | 'IN_TRANSIT' | 'INTERCEPTED' | 'ARRIVED';

export type CrisisEventId =
  | 'inspeccion_imperial'
  | 'inestabilidad_gravitatoria'
  | 'asalto_alba_escarlata';

export interface CrisisOption {
  id: string;
  label: string;
  resolve: () => void;
}

export interface CrisisOption {
  id: string;
  label: string;
  requiredInfiltration?: {
    faction: 'pykes' | 'hutts';
    minLevel: number;
  };
  resourceCost?: {
    credits?: number;
    fuel?: number;
  };
}

export interface CrisisEvent {
  id: CrisisEventId;
  title: string;
  description: string;
}

export interface LogEntry {
  id: number;
  timestamp: number;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
}

export interface RunStats {
  totalTrips: number;
  totalCreditsEarned: number;
  totalCreditsLost: number;
  timesIntercepted: number;
  hullDamageTaken: number;
  crewLost: number;
}
export interface FactionInfiltration {
  pykes: number; 
  hutts: number; 
}