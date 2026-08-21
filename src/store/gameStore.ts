import { create } from 'zustand';
import type {
  BountyHunter,
  CargoHold,
  CrisisEventId,
  GoodId,
  LogEntry,
  Planet,
  RouteNode,
  RunStats,
  Starship,
  TravelState,
} from '../types/game';
import { INITIAL_PLANETS } from '../data/planets';
import { CANTINA_ROSTER } from '../data/bountyHunters';
import { calculateRoutes, rollForCrisis } from '../utils/routeEngine';

interface ActiveCrisis {
  id: CrisisEventId;
  route: RouteNode;
}

interface GameState {
  credits: number;
  reputation: number;
  heat: number;
  ship: Starship;
  cargo: CargoHold[];
  planets: Planet[];
  hunters: BountyHunter[];
  currentPlanetId: string;
  selectedDestinationId: string | null;
  availableRoutes: RouteNode[];
  selectedRoute: RouteNode | null;
  travelState: TravelState;
  activeCrisis: ActiveCrisis | null;
  log: LogEntry[];
  stats: RunStats;
  gameOver: { won: boolean; reason: string } | null;
  errorMessage: string | null;

  selectDestination: (planetId: string) => void;
  hireHunter: (hunterId: string) => void;
  fireHunter: (hunterId: string) => void;
  buyGood: (item: GoodId, quantity: number) => void;
  sellGood: (item: GoodId, quantity: number) => void;
  refuelShip: () => void;
  startTravel: (route: RouteNode) => void;
  resolveCrisis: (optionId: string) => void;
  upgradeHyperdrive: () => void;
  upgradeShields: () => void;
  pushLog: (message: string, tone?: LogEntry['tone']) => void;
  checkGameOver: () => void;
  checkVictory: () => void;
  clearError: () => void;
}

let logCounter = 0;
let travelInterval: ReturnType<typeof setInterval> | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  credits: 10000,
  reputation: 20,
  heat: 0.05,
  ship: {
    name: 'El Jade de Kessel',
    hull: 100,
    fuel: 100,
    cargoCapacity: 50,
    currentCargo: 0,
    hyperdriveClass: 1.0,
    shieldRating: 10,
  },
  cargo: [],
  planets: INITIAL_PLANETS,
  hunters: CANTINA_ROSTER.map((h) => ({ ...h, hired: false })),
  currentPlanetId: 'kessel',
  selectedDestinationId: null,
  availableRoutes: [],
  selectedRoute: null,
  travelState: 'IDLE',
  activeCrisis: null,
  log: [],
  stats: {
    totalTrips: 0,
    totalCreditsEarned: 0,
    totalCreditsLost: 0,
    timesIntercepted: 0,
    hullDamageTaken: 0,
    crewLost: 0,
  },
  gameOver: null,
  errorMessage: null,

  pushLog: (message, tone = 'info') => {
    logCounter++;
    set((state) => ({
      log: [...state.log.slice(-49), { id: logCounter, timestamp: Date.now(), message, tone }],
    }));
  },

  clearError: () => set({ errorMessage: null }),

  selectDestination: (planetId) => {
    const { planets, currentPlanetId, heat, ship } = get();
    const origin = planets.find((p) => p.id === currentPlanetId)!;
    const destination = planets.find((p) => p.id === planetId);
    if (!destination || destination.id === origin.id) return;

    const routes = calculateRoutes(origin, destination, heat, ship);
    set({ selectedDestinationId: planetId, availableRoutes: routes, selectedRoute: null, errorMessage: null });
  },

  hireHunter: (hunterId) => {
    set((state) => ({
      hunters: state.hunters.map((h) => (h.id === hunterId ? { ...h, hired: true } : h)),
    }));
    get().pushLog('Cazador de recompensas incorporado a la tripulación.', 'success');
  },

  fireHunter: (hunterId) => {
    set((state) => ({
      hunters: state.hunters.map((h) => (h.id === hunterId ? { ...h, hired: false } : h)),
    }));
  },

  buyGood: (item, quantity) => {
    const { planets, currentPlanetId, credits, ship, cargo } = get();
    const planet = planets.find((p) => p.id === currentPlanetId)!;
    const listing = planet.market.find((m) => m.item === item);
    
    if (!listing || listing.stock < quantity) return;
    const cost = listing.price * quantity;
    if (cost > credits || ship.currentCargo + quantity > ship.cargoCapacity) return;

    const existing = cargo.find((c) => c.item === item);
    const nextCargo = existing
      ? cargo.map((c) =>
          c.item === item
            ? {
                ...c,
                quantity: c.quantity + quantity,
                avgBuyPrice: (c.avgBuyPrice * c.quantity + listing.price * quantity) / (c.quantity + quantity),
              }
            : c
        )
      : [...cargo, { item, quantity, avgBuyPrice: listing.price }];

    set({
      credits: credits - cost,
      cargo: nextCargo,
      ship: { ...ship, currentCargo: ship.currentCargo + quantity },
      planets: planets.map((p) =>
        p.id === planet.id
          ? { ...p, market: p.market.map((m) => (m.item === item ? { ...m, stock: m.stock - quantity } : m)) }
          : p
      ),
    });
    get().pushLog(`Adquiridas ${quantity} unidades de ${item} por ${cost.toLocaleString()} créditos.`, 'info');
  },

  sellGood: (item, quantity) => {
    const { planets, currentPlanetId, credits, ship, cargo, stats } = get();
    const planet = planets.find((p) => p.id === currentPlanetId)!;
    const listing = planet.market.find((m) => m.item === item);
    const held = cargo.find((c) => c.item === item);
    
    if (!listing || !held || held.quantity < quantity) return;

    const revenue = listing.price * quantity;
    const remaining = held.quantity - quantity;
    const nextCargo = remaining > 0
      ? cargo.map((c) => (c.item === item ? { ...c, quantity: remaining } : c))
      : cargo.filter((c) => c.item !== item);

    set({
      credits: credits + revenue,
      cargo: nextCargo,
      ship: { ...ship, currentCargo: ship.currentCargo - quantity },
      stats: { ...stats, totalCreditsEarned: stats.totalCreditsEarned + revenue },
      planets: planets.map((p) =>
        p.id === planet.id
          ? { ...p, market: p.market.map((m) => (m.item === item ? { ...m, stock: m.stock + quantity } : m)) }
          : p
      ),
    });
    get().pushLog(`Venta de ${quantity}x ${item} completada por ${revenue.toLocaleString()} ¤.`, 'success');
    get().checkVictory();
  },

  refuelShip: () => {
    const { credits, ship } = get();
    const cost = 300;
    if (ship.fuel >= 100) return;
    
    if (credits < cost) {
      set({ errorMessage: 'Fondos insuficientes para repostar.' });
      get().pushLog('Operación de repostaje denegada: sin créditos.', 'danger');
      return;
    }

    set({
      credits: credits - cost,
      ship: { ...ship, fuel: 100 },
      errorMessage: null,
    });
    get().pushLog('Tanque de combustible al 100%. Listo para zarpar.', 'success');
  },

  upgradeHyperdrive: () => {
    const { credits, ship } = get();
    const cost = 3000;
    if (credits < cost || ship.hyperdriveClass <= 0.5) return;
    
    set({
      credits: credits - cost,
      ship: { ...ship, hyperdriveClass: Math.round((ship.hyperdriveClass - 0.1) * 10) / 10 },
    });
    get().pushLog('Hipermotor mejorado con éxito.', 'success');
  },

  upgradeShields: () => {
    const { credits, ship } = get();
    const cost = 2500;
    if (credits < cost || ship.shieldRating >= 100) return;
    
    set({
      credits: credits - cost,
      ship: { ...ship, shieldRating: Math.min(100, ship.shieldRating + 15) },
    });
    get().pushLog('Matriz de escudos reforzada.', 'success');
  },

  startTravel: (route) => {
    const { ship, planets } = get();
    
    if (ship.fuel < route.fuelCost) {
      set({ errorMessage: 'Combustible insuficiente para este trayecto.' });
      get().pushLog('Salto cancelado: autonomía de combustible excedida.', 'danger');
      return;
    }

    set({ selectedRoute: route, travelState: 'IN_TRANSIT', errorMessage: null });
    get().pushLog(`Iniciando secuencia de salto hiperespacial (${route.type}).`, 'info');

    let elapsed = 0;
    const totalTicks = route.etaParsecs;

    if (travelInterval) clearInterval(travelInterval);
    
    travelInterval = setInterval(() => {
      elapsed++;
      const state = get();
      
      if (state.travelState !== 'IN_TRANSIT') {
        if (travelInterval) clearInterval(travelInterval);
        return;
      }

      if (elapsed < totalTicks && rollForCrisis(route)) {
        if (travelInterval) clearInterval(travelInterval);
        const eventId = resolveCrisisType(route);
        set({ travelState: 'INTERCEPTED', activeCrisis: { id: eventId, route } });
        state.pushLog('¡Intercepción en ruta! Evento crítico detectado.', 'warning');
        return;
      }

      if (elapsed >= totalTicks) {
        if (travelInterval) clearInterval(travelInterval);
        const destination = planets.find((p) => p.id === route.destinationId)!;
        
        set((s) => ({
          travelState: 'ARRIVED',
          currentPlanetId: destination.id,
          selectedDestinationId: null,
          availableRoutes: [],
          selectedRoute: null,
          ship: { ...s.ship, fuel: Math.max(0, s.ship.fuel - route.fuelCost) },
          stats: { ...s.stats, totalTrips: s.stats.totalTrips + 1 },
          heat: Math.max(0, s.heat - 0.02),
        }));
        
        state.pushLog(`Destino alcanzado: ${destination.name}.`, 'success');
        get().checkGameOver();
      }
    }, 600);
  },

  resolveCrisis: (optionId) => {
    const state = get();
    const crisis = state.activeCrisis;
    if (!crisis) return;

    const activeHunter = state.hunters.find((h) => h.hired);
    const mitigation = activeHunter ? activeHunter.combatPower / 100 : 0;

    applyCrisisOutcome(crisis.id, optionId, mitigation, state);

    set({ activeCrisis: null });
    get().checkGameOver();

    if (get().travelState !== 'ARRIVED' && get().gameOver === null) {
      set({ travelState: 'IN_TRANSIT' });
      get().startTravel({ ...crisis.route, etaParsecs: Math.max(1, Math.ceil(crisis.route.etaParsecs / 2)) });
    }
  },

  checkGameOver: () => {
    const { ship, credits, heat } = get();
    if (ship.hull <= 0) {
      set({ gameOver: { won: false, reason: 'La nave sufrió daños catastróficos y fue destruida.' } });
    } else if (credits <= 0) {
      set({ gameOver: { won: false, reason: 'Bancarrota: el sindicato te ha dado la espalda.' } });
    } else if (heat >= 1.0) {
      set({ gameOver: { won: false, reason: 'Capturado por la Oficina de Seguridad Imperial.' } });
    }
  },

  checkVictory: () => {
    const { credits, reputation } = get();
    if (credits >= 500000 && reputation >= 100) {
      set({ gameOver: { won: true, reason: 'Imperio Criminal Establecido: Dominio total del sector.' } });
    }
  },
}));

function resolveCrisisType(route: RouteNode): CrisisEventId {
  if (route.type === 'comercial') return 'inspeccion_imperial';
  if (route.type === 'atajo') return 'inestabilidad_gravitatoria';
  return Math.random() < 0.5 ? 'inspeccion_imperial' : 'asalto_alba_escarlata';
}

function applyCrisisOutcome(
  eventId: CrisisEventId,
  optionId: string,
  mitigation: number,
  state: GameState
) {
  const { pushLog } = state;
  const updateShip = (data: Partial<Starship>) =>
    useGameStore.setState((s) => ({ ship: { ...s.ship, ...data } }));
  const updateCredits = (amount: number) =>
    useGameStore.setState((s) => ({ credits: Math.max(0, s.credits + amount) }));
  const updateHeat = (amount: number) =>
    useGameStore.setState((s) => ({ heat: Math.max(0, Math.min(1, s.heat + amount)) }));
  const updateStats = (data: Partial<RunStats>) =>
    useGameStore.setState((s) => ({ stats: { ...s.stats, ...data } }));

  if (eventId === 'inspeccion_imperial') {
    if (optionId === 'entregar') {
      useGameStore.setState({ cargo: [] });
      pushLog('Contrabando confiscado en control imperial.', 'danger');
    } else if (optionId === 'sobornar') {
      const cost = Math.round(1500 * (1 - mitigation * 0.3));
      updateCredits(-cost);
      updateStats({ totalCreditsLost: state.stats.totalCreditsLost + cost });
      pushLog(`Oficiales sobornados con éxito (-${cost.toLocaleString()} ¤).`, 'warning');
    } else if (optionId === 'forzar') {
      const damage = Math.max(2, Math.round(12 * (1 - mitigation)));
      updateShip({ hull: Math.max(0, state.ship.hull - damage) });
      updateHeat(0.05);
      updateStats({ hullDamageTaken: state.stats.hullDamageTaken + damage });
      pushLog(`Bloqueo evitado a la fuerza. Casco afectado en ${damage}%.`, 'danger');
    }
  }

  if (eventId === 'inestabilidad_gravitatoria') {
    if (state.ship.hyperdriveClass <= 0.8) {
      pushLog('Anomalía superada limpiamente gracias a la eficiencia del hipermotor.', 'success');
    } else {
      const damage = Math.max(2, Math.round(10 * (1 - mitigation)));
      updateShip({ hull: Math.max(0, state.ship.hull - damage) });
      updateStats({ hullDamageTaken: state.stats.hullDamageTaken + damage });
      pushLog(`Fricción espacial superada. Daño estructural: ${damage}%.`, 'warning');
    }
  }

  if (eventId === 'asalto_alba_escarlata') {
    if (optionId === 'pagar_peaje') {
      updateCredits(-1000);
      updateStats({ totalCreditsLost: state.stats.totalCreditsLost + 1000 });
      pushLog('Peaje pagado a la facción rival.', 'warning');
    } else if (optionId === 'escolta') {
      const hunter = state.hunters.find((h) => h.hired);
      if (hunter) {
        pushLog(`${hunter.name} neutraliza la emboscada sin bajas.`, 'success');
      } else {
        const damage = 12;
        updateShip({ hull: Math.max(0, state.ship.hull - damage) });
        updateStats({ hullDamageTaken: state.stats.hullDamageTaken + damage });
        pushLog(`Sin escolta, la emboscada inflige ${damage}% de daño.`, 'danger');
      }
    } else if (optionId === 'defender') {
      const damage = Math.max(4, Math.round(15 * (1 - mitigation)));
      updateShip({ hull: Math.max(0, state.ship.hull - damage) });
      updateStats({ hullDamageTaken: state.stats.hullDamageTaken + damage });
      pushLog(`Intercambio de fuego finalizado. Daño recibido: ${damage}%.`, 'warning');
    }
  }
}