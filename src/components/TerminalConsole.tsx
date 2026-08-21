import { memo, useEffect, useRef } from 'react';
import type { LogEntry } from '../types/game';

const TONE_CLASSES: Record<LogEntry['tone'], string> = {
  info: 'text-nav',
  success: 'text-credit',
  warning: 'text-alert',
  danger: 'text-alert-hot',
};

/**
 * React.memo + comparación por longitud del log evita re-renderizar
 * decenas de líneas de terminal cada vez que cambia un estado no
 * relacionado (créditos, combustible, etc.) en el store global.
 */
export const TerminalConsole = memo(function TerminalConsole({ log }: { log: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [log.length]);

  return (
    <div className="flex-1 bg-black border border-void-700 rounded-lg overflow-hidden flex flex-col min-h-[240px]">
      <div className="bg-void-800 px-3 py-1.5 border-b border-void-700 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-credit animate-pulse" />
        <p className="text-void-600 text-xs font-mono uppercase tracking-widest">
          Consola de a bordo — registro en vivo
        </p>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1">
        {log.length === 0 && (
          <p className="text-void-600">&gt; Sistemas en espera. Selecciona un destino para iniciar.</p>
        )}
        {log.map((entry) => (
          <p key={entry.id} className={TONE_CLASSES[entry.tone]}>
            <span className="text-void-600">
              [{new Date(entry.timestamp).toLocaleTimeString('es-PE', { hour12: false })}]
            </span>{' '}
            &gt; {entry.message}
          </p>
        ))}
      </div>
    </div>
  );
}, (prev, next) => prev.log.length === next.log.length);
