import type { RouteNode } from '../types/game';

const ROUTE_LABELS: Record<RouteNode['type'], { label: string; hint: string }> = {
  comercial: { label: 'Ruta Comercial', hint: 'Segura pero fiscalizada' },
  contrabando: { label: 'Paso de Contrabando', hint: 'Riesgo equilibrado' },
  atajo: { label: 'Atajo del Corredor', hint: 'Peligroso, sin Imperio' },
};

function riskColor(value: number) {
  if (value < 0.25) return 'text-credit';
  if (value < 0.55) return 'text-alert';
  return 'text-alert-hot';
}

export function RouteAnalysis({
  routes,
  onSelect,
  selectedRouteId,
}: {
  routes: RouteNode[];
  onSelect: (route: RouteNode) => void;
  selectedRouteId?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {routes.map((route) => {
        const meta = ROUTE_LABELS[route.type];
        const isSelected = route.id === selectedRouteId;
        return (
          <button
            key={route.id}
            onClick={() => onSelect(route)}
            className={`text-left rounded-lg border p-3 font-mono transition-colors ${
              isSelected
                ? 'border-nav bg-void-800 shadow-glow-nav'
                : 'border-void-700 bg-void-900 hover:border-void-600'
            }`}
          >
            <p className="text-nav text-sm font-display font-bold uppercase tracking-wide">{meta.label}</p>
            <p className="text-void-600 text-[11px] mb-3">{meta.hint}</p>

            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-void-600">Distancia</dt>
                <dd className="text-white">{route.distance} pc</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-void-600">ETA</dt>
                <dd className="text-white">{route.etaParsecs} ticks</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-void-600">Combustible</dt>
                <dd className="text-white">{route.fuelCost}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-void-600">P(Interceptación)</dt>
                <dd className={riskColor(route.interceptionRisk)}>
                  {(route.interceptionRisk * 100).toFixed(1)}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-void-600">P(Peligro espacial)</dt>
                <dd className={riskColor(route.hazardRisk)}>{(route.hazardRisk * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex justify-between border-t border-void-700 pt-1.5 mt-1.5">
                <dt className="text-void-600">P(Fallo combinado)</dt>
                <dd className={`font-bold ${riskColor(1 - (1 - route.interceptionRisk) * (1 - route.hazardRisk))}`}>
                  {((1 - (1 - route.interceptionRisk) * (1 - route.hazardRisk)) * 100).toFixed(1)}%
                </dd>
              </div>
            </dl>
          </button>
        );
      })}
    </div>
  );
}
