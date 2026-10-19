import React from 'react';
import { AlertTriangle, ShieldCheck, Car, HelpCircle, MapPin, DollarSign, Info } from 'lucide-react';

interface AnalystNotesProps {
  notas?: string[];
  aseguradora: string;
}

export const AnalystNotes: React.FC<AnalystNotesProps> = ({ notas, aseguradora }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
            Criterio Profesional del Asesor
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Dictamen Técnico del Analista (Correduría Costa Rica)
          </h3>
          <p className="text-xs text-slate-300">
            Observaciones críticas de cobertura y riesgos contractuales para el cliente
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Critical Risk 1: Natural Disasters */}
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3">
          <div className="p-2 rounded-full bg-rose-100 text-rose-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <span>Riesgo Crítico: Exclusión de Fenómenos Naturales</span>
              <span className="text-[11px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-semibold">
                No Incluida
              </span>
            </h4>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              En Costa Rica, la temporada de lluvias (mayo a noviembre) genera inundaciones y colapso de alcantarillados recurrentes tanto en el Gran Área Metropolitana (San José, Heredia, Cartago, Alajuela) como en zonas costeras. Que la propuesta de <strong>{aseguradora}</strong> excluya expresamente <em>inundación y deslizamiento</em> deja al asegurado desprotegido ante pérdidas totales por cabezas de agua o desbordamientos.
            </p>
          </div>
        </div>

        {/* Critical Risk 2: Replacement Car */}
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
              <span>Movilidad: Vehículo Sustituto No Incluido</span>
              <span className="text-[11px] bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                No Incluido
              </span>
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Los tiempos de internamiento en talleres de enderezado y pintura en Costa Rica tras colisiones oscilan entre 20 y 45 días por demoras aduanales en repuestos. Sin cobertura de auto sustituto, la asegurada (Laura Solís) deberá asumir gastos imprevistos de transporte personal.
            </p>
          </div>
        </div>

        {/* Tow Truck limitation */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-full bg-slate-200 text-slate-700 shrink-0 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Servicio de Grúa Limitado (Hasta 50 km y 3 eventos/año)
            </h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Un radio de 50 km cubre traslados dentro de la GAM, pero si el vehículo sufre un percance en rutas turísticas (Ruta 27 hacia Puntarenas, Ruta 32 hacia Limón, o Guanacaste), el kilometraje excedente tiene costo por kilómetro adicional a cuenta del cliente.
            </p>
          </div>
        </div>

        {/* Financial notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Prima y Recargo Financiero</span>
              <p className="text-slate-600 mt-0.5">
                La prima anual total es <strong>₡ 395.000 (IVA incluido)</strong>. Si opta por financiamiento mensual, aplica un <strong>4 % de recargo</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Deducible Mínimo de Colisión</span>
              <p className="text-slate-600 mt-0.5">
                <strong>10% del reclamo, mínimo ₡ 150.000</strong>. Para daños menores a ₡150.000, la asegurada debe costear la totalidad del arreglo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
