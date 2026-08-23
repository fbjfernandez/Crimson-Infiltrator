import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { SidebarStatus } from './components/SidebarStatus';
import { GalaxyMap } from './components/GalaxyMap';
import { TerminalConsole } from './components/TerminalConsole';
import { TradePanel } from './components/TradePanel';
import { ShipUpgrades } from './components/ShipUpgrades';
import { Cantina } from './components/Cantina';
import { CrisisModal } from './components/CrisisModal';
import { GameOverScreen } from './components/GameOverScreen';

export default function App() {
  const log = useGameStore((s) => s.log);
  const travelState = useGameStore((s) => s.travelState);
  const [cantinaOpen, setCantinaOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void-950 text-white p-4">
      <header className="max-w-[1400px] mx-auto flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="font-display text-xl font-extrabold uppercase tracking-widest text-nav">
            Kessel Run
          </h1>
          <p className="text-void-600 text-xs font-mono">Pyke Syndicate Route Administrator</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-mono px-2 py-1 rounded border ${
              travelState === 'IDLE'
                ? 'border-void-700 text-void-600'
                : travelState === 'IN_TRANSIT'
                ? 'border-nav text-nav'
                : travelState === 'INTERCEPTED'
                ? 'border-alert-hot text-alert-hot animate-blink'
                : 'border-credit text-credit'
            }`}
          >
            ESTADO: {travelState}
          </span>
          <button
            onClick={() => setCantinaOpen(true)}
            className="text-[11px] font-mono px-3 py-1 rounded border border-alert text-alert hover:bg-alert/10 transition-colors uppercase"
          >
            Cantina
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4">
        <SidebarStatus />

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <GalaxyMap />
          <TradePanel />
          <ShipUpgrades />
        </div>

        <div className="w-full lg:w-96 shrink-0 flex flex-col">
          <TerminalConsole log={log} />
        </div>
      </main>

      {cantinaOpen && <Cantina onClose={() => setCantinaOpen(false)} />}
      <CrisisModal />
      <GameOverScreen />
    </div>
  );
}
