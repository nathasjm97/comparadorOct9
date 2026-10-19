import React from 'react';
import { ComparedProposalResult } from '../types/comparator';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, DollarSign, Car, Wrench, ShieldAlert } from 'lucide-react';

interface ComparisonTableProps {
  proposals: ComparedProposalResult[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ proposals }) => {
  // Exact 14 required rows
  const tableRows: {
    id: string;
    label: string;
    getValue: (p: ComparedProposalResult) => React.ReactNode;
    isHighlight?: boolean;
    isSemaforo?: boolean;
  }[] = [
    {
      id: 'prima_anual',
      label: 'Prima anual',
      isHighlight: true,
      getValue: (p) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {p.primaAnual}
        </span>
      ),
    },
    {
      id: 'cabe_presupuesto',
      label: 'Cabe en presupuesto',
      isHighlight: true,
      getValue: (p) => {
        const isYes = p.cabeEnPresupuesto === 'Sí';
        return (
          <div className="flex items-center gap-1.5">
            {isYes ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sí
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <XCircle className="w-3.5 h-3.5" />
                No
              </span>
            )}
            {p.cabeEnPresupuestoDetalle && (
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {p.cabeEnPresupuestoDetalle}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'deducible_colision',
      label: 'Deducible colisión',
      getValue: (p) => <span className="font-mono text-xs">{p.deducibleColision}</span>,
    },
    {
      id: 'deducible_robo',
      label: 'Deducible robo',
      getValue: (p) => <span className="font-mono text-xs">{p.deducibleRobo}</span>,
    },
    {
      id: 'rc_danios',
      label: 'RC daños a terceros',
      getValue: (p) => <span className="font-mono text-xs font-medium">{p.rcDaniosTerceros}</span>,
    },
    {
      id: 'rc_lesiones',
      label: 'RC lesiones',
      getValue: (p) => <span className="font-mono text-xs font-medium">{p.rcLesiones}</span>,
    },
    {
      id: 'asistencia_vial',
      label: 'Asistencia vial 24/7',
      getValue: (p) => <span>{p.asistenciaVial}</span>,
    },
    {
      id: 'grua',
      label: 'Grúa',
      getValue: (p) => <span>{p.grua}</span>,
    },
    {
      id: 'vehiculo_sustituto',
      label: 'Vehículo sustituto',
      getValue: (p) => {
        const lower = p.vehiculoSustituto.toLowerCase();
        const isExcluded = lower.includes('no incluid') || lower.includes('no aplica');
        return (
          <span
            className={
              isExcluded
                ? 'text-rose-700 font-semibold'
                : 'text-slate-800 font-medium'
            }
          >
            {p.vehiculoSustituto}
          </span>
        );
      },
    },
    {
      id: 'fenomenos_naturales',
      label: 'Fenómenos naturales',
      getValue: (p) => {
        const lower = p.fenomenosNaturales.toLowerCase();
        const isExcluded =
          lower.includes('no aplica') ||
          lower.includes('no incluid') ||
          lower.includes('excluid');
        return (
          <span
            className={
              isExcluded
                ? 'text-rose-700 font-semibold flex items-center gap-1'
                : 'text-emerald-700 font-semibold flex items-center gap-1'
            }
          >
            {isExcluded ? (
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
            )}
            {p.fenomenosNaturales}
          </span>
        );
      },
    },
    {
      id: 'rotura_cristales',
      label: 'Rotura de cristales',
      getValue: (p) => <span className="font-mono text-xs">{p.roturaCristales}</span>,
    },
    {
      id: 'exclusiones_destacadas',
      label: 'Exclusiones destacadas',
      getValue: (p) => (
        <span className="text-xs text-slate-700 leading-relaxed block max-w-sm">
          {p.exclusionesDestacadas}
        </span>
      ),
    },
    {
      id: 'cumple_obligatorias',
      label: 'Cumple obligatorias',
      isHighlight: true,
      getValue: (p) => {
        const isYes = p.cumpleObligatorias === 'Sí';
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${
                isYes
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {isYes ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {p.cumpleObligatorias}
            </span>
            {p.cumpleObligatoriasDetalle && !isYes && (
              <span className="text-[11px] text-rose-700 font-medium leading-tight">
                {p.cumpleObligatoriasDetalle}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'semaforo',
      label: 'Semáforo',
      isSemaforo: true,
      getValue: (p) => {
        const color = p.semaforo;
        if (color === 'verde') {
          return (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                Verde
              </span>
              <span className="text-[11px] text-slate-600 hidden sm:inline">
                Cabe y cumple
              </span>
            </div>
          );
        }
        if (color === 'amarillo') {
          return (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
                Amarillo
              </span>
              <span className="text-[11px] text-slate-600 hidden sm:inline">
                Cumple pero no cabe
              </span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              Rojo
            </span>
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              No cumple obligatorias
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Table Section Title */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              3. Resultado: Tabla Comparativa
            </h2>
            <p className="text-xs text-slate-300">
              Una columna por aseguradora · 14 filas normalizadas · Clasificación por semáforo
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Verde (Cabe + Cumple)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Amarillo (Cumple, excede presupuesto)
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Rojo (Faltan obligatorias)
          </span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 uppercase font-bold tracking-wider border-b-2 border-slate-300">
              <th scope="col" className="py-3.5 px-4 w-1/4 min-w-[180px] bg-slate-100 sticky left-0 z-10 border-r border-slate-200 shadow-2xs">
                Campo / Criterio
              </th>
              {proposals.map((prop, idx) => (
                <th
                  key={`${prop.aseguradora}-${idx}`}
                  scope="col"
                  className="py-3.5 px-4 min-w-[250px] border-r border-slate-200 last:border-r-0 bg-slate-50 text-slate-900"
                >
                  <div className="text-xs font-bold uppercase tracking-wide text-indigo-700">
                    Aseguradora {idx + 1}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {prop.aseguradora}
                  </div>
                  {prop.archivoOrigen && (
                    <div className="text-[10px] text-slate-400 font-mono font-normal truncate mt-0.5">
                      {prop.archivoOrigen}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tableRows.map((row, rowIdx) => {
              const isEven = rowIdx % 2 === 0;

              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.isSemaforo
                      ? 'bg-indigo-50/70 hover:bg-indigo-50 font-bold border-t-2 border-indigo-200'
                      : row.isHighlight
                      ? 'bg-amber-50/30 hover:bg-amber-50/60 font-semibold'
                      : isEven
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  {/* Row Label (Sticky Left) */}
                  <th
                    scope="row"
                    className={`py-3 px-4 font-semibold text-slate-900 sticky left-0 z-10 border-r border-slate-200 shadow-2xs ${
                      row.isSemaforo
                        ? 'bg-indigo-100/90 text-indigo-950 font-black'
                        : isEven
                        ? 'bg-white'
                        : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-slate-400 w-4 text-right">
                        {rowIdx + 1}.
                      </span>
                      <span>{row.label}</span>
                    </div>
                  </th>

                  {/* Values for each insurer */}
                  {proposals.map((prop, pIdx) => (
                    <td
                      key={`${prop.aseguradora}-${row.id}-${pIdx}`}
                      className="py-3 px-4 border-r border-slate-200 last:border-r-0 align-middle text-slate-800"
                    >
                      {row.getValue(prop)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
