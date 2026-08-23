import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GOOD_LABELS } from '../data/planets';
import type { GoodId } from '../types/game';

export function TradePanel() {
  const { planets, currentPlanetId, cargo, buyGood, sellGood, credits, ship } = useGameStore();
  const planet = planets.find((p) => p.id === currentPlanetId)!;
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (item: string) => quantities[item] ?? 1;
  const setQty = (item: string, value: number) =>
    setQuantities((q) => ({ ...q, [item]: Math.max(1, value) }));

  return (
    <div className="bg-void-900 border border-void-700 rounded-lg p-4">
      <p className="text-void-600 text-xs uppercase tracking-widest mb-3 font-mono">
        Panel de Control del Sindicato — Mercado de {planet.name}
      </p>
      <div className="space-y-2">
        {planet.market.map((listing) => {
          const held = cargo.find((c) => c.item === listing.item);
          const qty = getQty(listing.item);
          const canBuy = credits >= listing.price * qty && ship.currentCargo + qty <= ship.cargoCapacity;
          const canSell = (held?.quantity ?? 0) >= qty;

          return (
            <div
              key={listing.item}
              className="flex flex-wrap items-center gap-3 bg-void-800 rounded-lg px-3 py-2 font-mono text-sm"
            >
              <div className="flex-1 min-w-[140px]">
                <p className="text-white font-bold">{GOOD_LABELS[listing.item as GoodId]}</p>
                <p className="text-void-600 text-[11px]">
                  {listing.price} ¤/u · stock {listing.stock} · en bodega {held?.quantity ?? 0}
                </p>
              </div>

              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(listing.item, Number(e.target.value))}
                className="w-16 bg-void-700 border border-void-600 rounded px-2 py-1 text-white text-xs"
              />

              <button
                disabled={!canBuy}
                onClick={() => buyGood(listing.item, qty)}
                className="px-3 py-1 rounded border border-credit text-credit text-xs font-bold uppercase disabled:opacity-30 hover:bg-credit/10 transition-colors"
              >
                Comprar
              </button>
              <button
                disabled={!canSell}
                onClick={() => sellGood(listing.item, qty)}
                className="px-3 py-1 rounded border border-nav text-nav text-xs font-bold uppercase disabled:opacity-30 hover:bg-nav/10 transition-colors"
              >
                Vender
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
