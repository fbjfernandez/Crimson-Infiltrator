import { useGameStore } from '../store/gameStore';

function Bar({
  value,
  colorClass,
  glowClass,
}: {
  value: number;
  colorClass: string;
  glowClass?: string;
}) {
  return (
    <div className="h-2 w-full rounded-full bg-void-700 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass} ${glowClass ?? ''}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function SidebarStatus() {
  const { credits, ship, reputation, heat, hunters } = useGameStore();
  const hiredHunter = hunters.find((h) => h.hired);
  const isHot = heat > 0.6;

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-void-900 border border-void-700 rounded-lg p-4 font-mono text-sm space-y-5">
      <div>
        <p className="text-void-600 text-xs uppercase tracking-widest mb-1">Créditos del Sindicato</p>
        <p className="text-credit text-2xl font-display font-bold tabular-nums drop-shadow-glow-credit">
          {credits.toLocaleString()} ¤
        </p>
      </div>

      <div>
        <p className="text-void-600 text-xs uppercase tracking-widest mb-1">{ship.name}</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-void-600 mb-1">
              <span>Casco</span>
              <span>{Math.round(ship.hull)}%</span>
            </div>
            <Bar value={ship.hull} colorClass={ship.hull > 30 ? 'bg-credit' : 'bg-alert-hot'} />
          </div>
          <div>
            <div className="flex justify-between text-xs text-void-600 mb-1">
              <span>Combustible</span>
              <span>{Math.round(ship.fuel)}%</span>
            </div>
            <Bar value={ship.fuel} colorClass="bg-nav" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-void-600 mb-1">
              <span>Carga</span>
              <span>{ship.currentCargo}/{ship.cargoCapacity} ton</span>
            </div>
            <Bar value={(ship.currentCargo / ship.cargoCapacity) * 100} colorClass="bg-void-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-void-800 rounded p-2">
          <p className="text-void-600 uppercase tracking-wide">Hipermotor</p>
          <p className="text-nav font-bold">Clase {ship.hyperdriveClass.toFixed(1)}</p>
        </div>
        <div className="bg-void-800 rounded p-2">
          <p className="text-void-600 uppercase tracking-wide">Escudos</p>
          <p className="text-nav font-bold">{ship.shieldRating}%</p>
        </div>
        <div className="bg-void-800 rounded p-2">
          <p className="text-void-600 uppercase tracking-wide">Reputación</p>
          <p className="text-credit font-bold">{reputation}/100</p>
        </div>
        <div className="bg-void-800 rounded p-2">
          <p className="text-void-600 uppercase tracking-wide">Escolta</p>
          <p className={hiredHunter ? 'text-credit font-bold' : 'text-void-600'}>
            {hiredHunter ? hiredHunter.name.split(' ')[0] : 'Ninguna'}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-void-600 uppercase tracking-widest">Calor Imperial</span>
          <span className={isHot ? 'text-alert-hot animate-blink font-bold' : 'text-alert'}>
            {(heat * 100).toFixed(0)}%
          </span>
        </div>
        <Bar
          value={heat * 100}
          colorClass={isHot ? 'bg-alert-hot' : 'bg-alert'}
          glowClass={isHot ? 'shadow-glow-alert' : undefined}
        />
        {isHot && (
          <p className="text-alert-hot text-[10px] mt-1 animate-blink">
            ⚠ NOTORIEDAD CRÍTICA — RIESGO DE ARRESTO
          </p>
        )}
      </div>
    </aside>
  );
}
