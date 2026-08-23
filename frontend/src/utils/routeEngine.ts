import type { Planet, RouteNode, RouteType, Starship } from '../types/game';

/**
 * Distancia vectorial euclidiana entre dos planetas en el plano cartesiano
 * galáctico: d = sqrt((x2-x1)^2 + (y2-y1)^2).
 * Se usa como base para el consumo de combustible y el tiempo de viaje.
 */
export function vectorDistance(a: Planet, b: Planet): number {
  const dx = b.coordinateX - a.coordinateX;
  const dy = b.coordinateY - a.coordinateY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Perfil de cada tipo de ruta: cuánto amplifica el índice de ley (riesgo
 * de interceptación imperial) frente al peligro espacial natural, y qué
 * penalización/bonificación aplica a distancia y combustible.
 *
 *  - Ruta Comercial: atraviesa espacio fiscalizado -> alto riesgo imperial, bajo peligro natural.
 *  - Paso de Contrabando: rutas intermedias -> riesgo equilibrado.
 *  - Atajo del Corredor: evita el Imperio casi por completo -> el riesgo es casi todo peligro natural.
 */
const ROUTE_PROFILES: Record<
  RouteType,
  { lawWeight: number; hazardWeight: number; distanceFactor: number; fuelFactor: number }
> = {
  comercial: { lawWeight: 0.85, hazardWeight: 0.15, distanceFactor: 1.15, fuelFactor: 1.0 },
  contrabando: { lawWeight: 0.45, hazardWeight: 0.45, distanceFactor: 1.0, fuelFactor: 1.05 },
  atajo: { lawWeight: 0.05, hazardWeight: 0.95, distanceFactor: 0.7, fuelFactor: 1.35 },
};

/**
 * Calcula las 3 rutas disponibles entre un origen y un destino.
 * El riesgo de interceptación combina el índice de ley del planeta destino,
 * el peso del perfil de ruta y la Notoriedad/Calor Imperial acumulada
 * del jugador (a mayor calor, más probabilidad de ser detectado en
 * cualquier ruta que toque espacio fiscalizado).
 */
export function calculateRoutes(
  origin: Planet,
  destination: Planet,
  heat: number,
  ship: Starship
): RouteNode[] {
  const baseDistance = vectorDistance(origin, destination);

  return (Object.keys(ROUTE_PROFILES) as RouteType[]).map((type) => {
    const profile = ROUTE_PROFILES[type];
    const distance = baseDistance * profile.distanceFactor;

    // Probabilidad combinada: ley del destino ponderada por el perfil de ruta,
    // más un incremento proporcional al calor imperial acumulado.
    const interceptionRisk = clamp01(
      destination.lawIndex * profile.lawWeight + heat * 0.4 * profile.lawWeight
    );

    // Peligro espacial: hazard natural del destino ponderado por el perfil,
    // atenuado por la clase de hipermotor (motores mejores = maniobras más seguras).
    const hazardRisk = clamp01(
      destination.naturalHazard * profile.hazardWeight * (ship.hyperdriveClass / 1.0)
    );

    const fuelCost = clamp01((distance / 150) * profile.fuelFactor) * 100;
    const etaParsecs = Math.round(distance * ship.hyperdriveClass);

    return {
      id: `${origin.id}-${destination.id}-${type}`,
      type,
      originId: origin.id,
      destinationId: destination.id,
      distance: Math.round(distance * 10) / 10,
      interceptionRisk: Math.round(interceptionRisk * 1000) / 1000,
      hazardRisk: Math.round(hazardRisk * 1000) / 1000,
      fuelCost: Math.round(fuelCost),
      etaParsecs: Math.max(1, etaParsecs),
    };
  });
}

/**
 * Tirada de probabilidad de fallo del viaje: combina ambos riesgos como
 * eventos independientes -> P(fallo) = 1 - (1 - Pa)(1 - Pb).
 * Se usa un único roll para decidir si el viaje se resuelve sin incidentes.
 */
export function rollForCrisis(route: RouteNode): boolean {
  const combinedFailure = 1 - (1 - route.interceptionRisk) * (1 - route.hazardRisk);
  return Math.random() < combinedFailure;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
