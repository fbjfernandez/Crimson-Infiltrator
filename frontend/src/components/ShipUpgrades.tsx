import { useGameStore } from '../store/gameStore';

export function ShipUpgrades() {
  const { credits, ship, upgradeHyperdrive, upgradeShields } = useGameStore();

  return (
    <div className="bg-void-900 border border-void-700 rounded-lg p-4 font-mono">
      <p className="text-void-600 text-xs uppercase tracking-widest mb-3">Astillero — Mejoras de nave</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          disabled={credits < 3000 || ship.hyperdriveClass <= 0.5}
          onClick={upgradeHyperdrive}
          className="rounded-lg border border-nav bg-nav/5 hover:bg-nav/15 disabled:opacity-30 text-left p-3 transition-colors"
        >
          <p className="text-nav font-bold text-sm">Mejorar Hipermotor</p>
          <p className="text-void-600 text-[11px]">3,000 ¤ · Clase actual {ship.hyperdriveClass.toFixed(1)}</p>
        </button>
        <button
          disabled={credits < 2500 || ship.shieldRating >= 100}
          onClick={upgradeShields}
          className="rounded-lg border border-credit bg-credit/5 hover:bg-credit/15 disabled:opacity-30 text-left p-3 transition-colors"
        >
          <p className="text-credit font-bold text-sm">Reforzar Escudos</p>
          <p className="text-void-600 text-[11px]">2,500 ¤ · Actual {ship.shieldRating}%</p>
        </button>
      </div>
    </div>
  );
}
