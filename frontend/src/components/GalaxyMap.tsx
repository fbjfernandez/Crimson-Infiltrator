import { useGameStore } from '../store/gameStore';
import { RouteAnalysis } from './RouteAnalysis';
import type { RouteNode } from '../types/game';
import { useState } from 'react';

export function GalaxyMap() {
  const {
    planets,
    currentPlanetId,
    selectedDestinationId,
    availableRoutes,
    selectDestination,
    startTravel,
    travelState,
  } = useGameStore();

  const [pendingRoute, setPendingRoute] = useState<RouteNode | null>(null);

  const currentPlanet = planets.find((p) => p.id === currentPlanetId)!;
  const isTraveling = travelState === 'IN_TRANSIT' || travelState === 'INTERCEPTED';

  return (
    <div className="flex-1 bg-void-900 border border-void-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-void-600 text-xs uppercase tracking-widest">Ubicación actual</p>
          <p className="text-nav font-display text-xl font-bold">{currentPlanet.name}</p>
        </div>
        <div className="text-right">
          <p className="text-void-600 text-xs uppercase tracking-widest">Índice de Ley</p>
          <p className="text-white font-mono">{currentPlanet.lawIndex.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <p className="text-void-600 text-xs uppercase tracking-widest mb-2 font-mono">
          Mapa Galáctico — Destinos disponibles
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {planets
            .filter((p) => p.id !== currentPlanetId)
            .map((planet) => (
              <button
                key={planet.id}
                disabled={isTraveling}
                onClick={() => {
                  selectDestination(planet.id);
                  setPendingRoute(null);
                }}
                className={`rounded-lg border p-3 font-mono text-left transition-colors disabled:opacity-40 ${
                  selectedDestinationId === planet.id
                    ? 'border-nav bg-void-800'
                    : 'border-void-700 hover:border-void-600'
                }`}
              >
                <p className="text-white text-sm font-bold">{planet.name}</p>
                <p className="text-void-600 text-[11px]">Hazard {planet.naturalHazard.toFixed(2)}</p>
              </button>
            ))}
        </div>
      </div>

      {selectedDestinationId && availableRoutes.length > 0 && (
        <div>
          <p className="text-void-600 text-xs uppercase tracking-widest mb-2 font-mono">
            Análisis de rutas — coeficientes de riesgo
          </p>
          <RouteAnalysis
            routes={availableRoutes}
            selectedRouteId={pendingRoute?.id}
            onSelect={setPendingRoute}
          />

          <button
            disabled={!pendingRoute || isTraveling}
            onClick={() => pendingRoute && startTravel(pendingRoute)}
            className="mt-3 w-full rounded-lg border border-nav bg-nav/10 hover:bg-nav/20 disabled:opacity-30 disabled:cursor-not-allowed text-nav font-display font-bold uppercase tracking-widest py-2.5 transition-colors"
          >
            {isTraveling ? 'En tránsito...' : 'Confirmar salto hiperespacial'}
          </button>
        </div>
      )}
    </div>
  );
}
