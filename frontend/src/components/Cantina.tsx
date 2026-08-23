import { useGameStore } from '../store/gameStore';

export function Cantina({ onClose }: { onClose: () => void }) {
  const { hunters, hireHunter, fireHunter, credits } = useGameStore();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-void-900 border border-void-700 rounded-lg max-w-lg w-full p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-alert font-display font-bold uppercase tracking-widest">
            Cantina — Cazadores de Recompensas
          </p>
          <button onClick={onClose} className="text-void-600 hover:text-white text-sm">
            Cerrar ✕
          </button>
        </div>

        <div className="space-y-2">
          {hunters.map((hunter) => (
            <div
              key={hunter.id}
              className="flex items-center justify-between bg-void-800 rounded-lg px-3 py-2 font-mono text-sm"
            >
              <div>
                <p className="text-white font-bold">{hunter.name}</p>
                <p className="text-void-600 text-[11px] uppercase">
                  {hunter.specialization} · Poder {hunter.combatPower} · {hunter.costPerParsec} ¤/pc
                </p>
              </div>
              {hunter.hired ? (
                <button
                  onClick={() => fireHunter(hunter.id)}
                  className="px-3 py-1 rounded border border-alert-hot text-alert-hot text-xs font-bold uppercase hover:bg-alert-hot/10"
                >
                  Despedir
                </button>
              ) : (
                <button
                  disabled={credits < hunter.costPerParsec}
                  onClick={() => hireHunter(hunter.id)}
                  className="px-3 py-1 rounded border border-credit text-credit text-xs font-bold uppercase disabled:opacity-30 hover:bg-credit/10"
                >
                  Contratar
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-void-600 text-[11px] mt-4 font-mono">
          Solo puedes tener un cazador activo a la vez. Su poder de combate reduce el daño y
          mejora tus opciones durante emboscadas y abordajes.
        </p>
      </div>
    </div>
  );
}
