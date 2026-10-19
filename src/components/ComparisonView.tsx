import React from 'react';
import { InsuranceProposal } from '../types/insurance';
import { Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ComparisonViewProps {
  proposals: InsuranceProposal[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ proposals }) => {
  // Key comparison rows
  const comparisonFields = [
    'Aseguradora',
    'Número de cotización',
    'Vehículo y suma asegurada',
    'Prima anual',
    'Deducible por colisión',
    'Deducible por robo',
    'Responsabilidad civil daños a terceros (límite)',
    'Responsabilidad civil lesiones a terceros (límite)',
    'Colisión y vuelco',
    'Robo (total y parcial)',
    'Incendio',
    'Fenómenos naturales',
    'Rotura de cristales',
    'Asistencia vial 24/7',
    'Grúa (alcance)',
    'Vehículo sustituto',
    'Exclusiones principales',
    'Opciones de pago',
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 rounded border border-indigo-400/30">
            Módulo Comparativo de Correduría
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Comparativa Técnica de Propuestas de Automóvil
          </h3>
          <p className="text-xs text-slate-300">
            Evaluación paralela de condiciones para Laura Solís Vargas (Toyota Corolla 2022)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-300">
              <th className="py-3 px-4 w-1/4 sticky left-0 bg-slate-100 z-10 border-r border-slate-200">
                Concepto / Campo
              </th>
              {proposals.map((p, idx) => (
                <th key={p.id} className="py-3 px-4 min-w-[240px] border-r border-slate-200 last:border-r-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-bold text-sm">
                      {p.aseguradora}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold uppercase">
                        Cotización Adjunta
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 font-normal mt-0.5">
                    {p.numeroCotizacion}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {comparisonFields.map((fieldName, rowIdx) => {
              const isHighlight =
                fieldName === 'Fenómenos naturales' ||
                fieldName === 'Vehículo sustituto' ||
                fieldName === 'Prima anual' ||
                fieldName === 'Deducible por colisión';

              return (
                <tr
                  key={fieldName}
                  className={`transition-colors ${
                    isHighlight
                      ? 'bg-amber-50/40 hover:bg-amber-50/80 font-medium'
                      : rowIdx % 2 === 0
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-slate-50/40 hover:bg-slate-100/50'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 sticky left-0 bg-inherit z-10 border-r border-slate-200">
                    <div className="flex items-center gap-1.5">
                      {fieldName === 'Fenómenos naturales' && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span>{fieldName}</span>
                    </div>
                  </td>

                  {proposals.map((p) => {
                    const field = p.fields.find(
                      (f) => f.campo.toLowerCase().trim() === fieldName.toLowerCase().trim()
                    );
                    const val = field ? field.valor : 'no indicado';
                    const lowerVal = val.toLowerCase();

                    const isExclusion =
                      lowerVal.includes('no incluid') ||
                      lowerVal.includes('no aplica') ||
                      lowerVal.includes('excluid');
                    const isMissing = lowerVal === 'no indicado';

                    return (
                      <td
                        key={p.id}
                        className={`py-3 px-4 border-r border-slate-200 last:border-r-0 align-top ${
                          isExclusion
                            ? 'text-rose-900 bg-rose-50/40'
                            : isMissing
                            ? 'text-amber-800 bg-amber-50/30'
                            : 'text-slate-800'
                        }`}
                      >
                        <div className="font-mono leading-relaxed">{val}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-rose-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Exclusión / No Incluida
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            No Indicado en Cotización
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Cobertura Completa
          </span>
        </div>
      </div>
    </div>
  );
};
