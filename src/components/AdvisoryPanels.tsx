import React, { useState } from 'react';
import { Copy, Check, MessageSquare, ShieldAlert, RotateCcw, Send, FileEdit, Info } from 'lucide-react';

interface AdvisoryPanelsProps {
  recomendacion: string;
  mensajeWhatsApp: string;
  onNewComparison: () => void;
}

export const AdvisoryPanels: React.FC<AdvisoryPanelsProps> = ({
  recomendacion,
  mensajeWhatsApp,
  onNewComparison,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(mensajeWhatsApp).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      {/* The Two Distinct Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Recomendación preliminar (borrador) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Recomendación preliminar (borrador)
              </h3>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
              Para uso del asesor
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                {recomendacion}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Criterio técnico: Se evalúa la concordancia entre prioridades del cliente (riesgo climático, auto sustituto) y la prima con sus deducibles.
              </span>
            </div>
          </div>
        </div>

        {/* Box 2: Mensaje sugerido para el cliente (WhatsApp) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Mensaje sugerido para el cliente (WhatsApp)
              </h3>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">
              Listo para enviar
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* WhatsApp bubble appearance */}
            <div className="bg-[#E7FFDB] border border-emerald-200/80 rounded-2xl rounded-tl-xs p-4 shadow-2xs">
              <div className="text-xs sm:text-sm text-slate-900 font-sans leading-relaxed whitespace-pre-line">
                {mensajeWhatsApp}
              </div>
              <div className="text-[10px] text-emerald-800/70 text-right mt-2 flex items-center justify-end gap-1 font-mono">
                <span>WhatsApp</span>
                <Check className="w-3 h-3 text-emerald-600" />
              </div>
            </div>

            {/* Action inside WhatsApp box */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Tono cordial · Máximo 8 líneas · Sin tecnicismos
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Mensaje Copiado!' : 'Copiar mensaje'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar below boxes */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-100/80 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-600 text-center sm:text-left">
          ¿Desea ajustar presupuestos o evaluar cotizaciones de otros clientes?
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyMessage}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'Copiado al portapapeles' : 'Copiar mensaje'}</span>
          </button>

          <button
            type="button"
            onClick={onNewComparison}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nueva comparación</span>
          </button>
        </div>
      </div>
    </div>
  );
};
