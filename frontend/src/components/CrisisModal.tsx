import { useGameStore } from '../store/gameStore';
import type { CrisisEventId } from '../types/game';

const CRISIS_CONTENT: Record<
  CrisisEventId,
  { title: string; description: string; options: { id: string; label: string }[] }
> = {
  inspeccion_imperial: {
    title: 'Inspección Aduanera Imperial',
    description: 'Un Destructor Estelar sale del hiperespacio y exige detener motores.',
    options: [
      { id: 'entregar', label: 'Entregar la mercancía (pérdida total del cargamento)' },
      { id: 'sobornar', label: 'Sobornar al oficial (cuesta créditos)' },
      { id: 'forzar', label: 'Forzar el hipermotor (daña el casco)' },
    ],
  },
  inestabilidad_gravitatoria: {
    title: 'Inestabilidad Gravitatoria',
    description: 'Una anomalía estelar saca a la nave del hiperespacio abruptamente.',
    options: [{ id: 'estabilizar', label: 'Estabilizar sistemas y continuar' }],
  },
  asalto_alba_escarlata: {
    title: 'Asalto del Sindicato de Alba Escarlata',
    description: 'Piratas rivales intentan abordar tu nave para robar el cargamento.',
    options: [
      { id: 'pagar_peaje', label: 'Pagar peaje en créditos' },
      { id: 'escolta', label: 'Confiar en la escolta contratada' },
      { id: 'defender', label: 'Defenderse con recursos propios (riesgo de tripulación)' },
    ],
  },
};

export function CrisisModal() {
  const { activeCrisis, resolveCrisis } = useGameStore();
  if (!activeCrisis) return null;

  const content = CRISIS_CONTENT[activeCrisis.id];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-void-900 border border-alert-hot shadow-glow-alert rounded-lg max-w-md w-full p-5 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none opacity-10">
          <div className="w-full h-8 bg-alert-hot animate-scan" />
        </div>

        <p className="text-alert-hot font-display font-bold uppercase tracking-widest text-sm mb-1 animate-blink">
          ⚠ Evento de Crisis
        </p>
        <h2 className="text-white font-display text-lg font-bold mb-2">{content.title}</h2>
        <p className="text-void-600 text-sm font-mono mb-4">{content.description}</p>

        <div className="space-y-2">
          {content.options.map((option) => (
            <button
              key={option.id}
              onClick={() => resolveCrisis(option.id)}
              className="w-full text-left rounded-lg border border-void-700 hover:border-alert bg-void-800 hover:bg-void-700 px-3 py-2.5 text-sm text-white font-mono transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
