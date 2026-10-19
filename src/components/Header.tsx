import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-700 to-blue-900 rounded-xl shadow-inner border border-indigo-500/30 text-amber-300">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Comparador de Propuestas <span className="text-amber-400">BN</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 rounded-full border border-slate-700">
                  Costa Rica
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                Compara propuestas de seguro de automóvil en minutos. La IA prepara, el asesor decide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Motor Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </header>
  );
};
