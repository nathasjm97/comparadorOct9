import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-5 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Borrador generado con IA. Debe ser validado por un asesor contra las condiciones reales de la póliza. No suba datos reales de clientes.
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono shrink-0">
          BN Corredora de Seguros · Costa Rica
        </div>
      </div>
    </footer>
  );
};
