import { useGameStore } from '../store/gameStore';

export function GameOverScreen() {
  const { gameOver, stats, credits } = useGameStore();
  if (!gameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div
        className={`border rounded-lg max-w-md w-full p-6 text-center ${
          gameOver.won ? 'border-credit shadow-glow-credit' : 'border-alert-hot shadow-glow-alert'
        } bg-void-900`}
      >
        <h1
          className={`font-display text-2xl font-extrabold uppercase tracking-widest mb-2 ${
            gameOver.won ? 'text-credit' : 'text-alert-hot'
          }`}
        >
          {gameOver.won ? 'Gran Protector del Sindicato' : 'Run finalizada'}
        </h1>
        <p className="text-void-600 font-mono text-sm mb-5">{gameOver.reason}</p>

        <dl className="grid grid-cols-2 gap-2 text-left font-mono text-xs mb-5">
          <div className="bg-void-800 rounded p-2">
            <dt className="text-void-600">Créditos finales</dt>
            <dd className="text-credit font-bold">{credits.toLocaleString()}</dd>
          </div>
          <div className="bg-void-800 rounded p-2">
            <dt className="text-void-600">Viajes completados</dt>
            <dd className="text-white font-bold">{stats.totalTrips}</dd>
          </div>
          <div className="bg-void-800 rounded p-2">
            <dt className="text-void-600">Daño total al casco</dt>
            <dd className="text-alert font-bold">{stats.hullDamageTaken}%</dd>
          </div>
          <div className="bg-void-800 rounded p-2">
            <dt className="text-void-600">Tripulantes perdidos</dt>
            <dd className="text-alert-hot font-bold">{stats.crewLost}</dd>
          </div>
        </dl>

        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-lg border border-nav text-nav font-display font-bold uppercase tracking-widest py-2.5 hover:bg-nav/10 transition-colors"
        >
          Reiniciar simulación
        </button>
      </div>
    </div>
  );
}
