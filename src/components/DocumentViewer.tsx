import React, { useState } from 'react';
import { ExternalLink, Eye, FileText, CheckCircle, AlertOctagon, Car, Shield, Wrench, CreditCard } from 'lucide-react';

interface DocumentViewerProps {
  pdfUrl?: string;
  selectedField?: string | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pdfUrl = '/assets/aistudio/Propuesta_A_Aseguradora_Cordillera_45e2b828.pdf',
}) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'pdf'>('interactive');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-100">
              Documento Fuente: Propuesta Aseguradora Cordillera
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              COTIZACIÓN N.º COR-2026-18402 · 13/10/2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-0.5 rounded-lg flex text-xs">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'interactive'
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vista Fiel
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'pdf'
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PDF Nativo
            </button>
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Abrir PDF original en pestaña nueva"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Content Viewer */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
        {viewMode === 'pdf' ? (
          <div className="w-full h-[650px] bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
            <iframe
              src={pdfUrl}
              title="PDF Cotización Aseguradora Cordillera"
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          /* High-Fidelity Interactive Document Replica matching the exact PDF OCR & layout */
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-300 text-slate-800 font-sans text-xs sm:text-sm">
            {/* Academic watermark notice */}
            <div className="text-right text-[10px] text-slate-400 font-semibold tracking-wider uppercase mb-3">
              DOCUMENTO FICTICIO · USO ACADÉMICO
            </div>

            {/* Document Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-4 mb-4 gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Aseguradora <span className="text-amber-600">Cordillera</span> S.A.
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cédula jurídica 3-101-000000 (ficticia) · San José, Costa Rica · Tel. 2000-0000
                </p>
                <div className="mt-2 text-xs text-slate-700">
                  <p><strong>Dirigida a:</strong> BN Corredora de Seguros · Atención: asesor(a) a cargo</p>
                  <p><strong>Asegurada:</strong> Laura Solís Vargas · Identificación: 1-0000-0000 (ficticia)</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-right w-full sm:w-auto shrink-0">
                <div className="font-mono font-bold text-indigo-900 text-xs sm:text-sm">
                  COTIZACIÓN N.º COR-2026-18402
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Fecha de emisión: <strong>13 de octubre de 2026</strong>
                </div>
                <div className="text-[11px] text-slate-600">
                  Vigencia de la oferta: <strong>15 días</strong>
                </div>
              </div>
            </div>

            {/* Title Banner */}
            <div className="mb-5 text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Propuesta de Seguro Voluntario de Automóvil
              </h2>
            </div>

            {/* Section 1: Datos del Vehículo */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                <Car className="w-3.5 h-3.5" />
                1. DATOS DEL VEHÍCULO
              </div>
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-300">MARCA Y MODELO</th>
                    <th className="p-2 border border-slate-300">AÑO</th>
                    <th className="p-2 border border-slate-300">PLACA</th>
                    <th className="p-2 border border-slate-300">USO</th>
                    <th className="p-2 border border-slate-300 text-right">VALOR ASEGURADO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">Toyota Corolla XEi</td>
                    <td className="p-2 border border-slate-300">2022</td>
                    <td className="p-2 border border-slate-300">ABC-000 (ficticia)</td>
                    <td className="p-2 border border-slate-300">Particular</td>
                    <td className="p-2 border border-slate-300 text-right font-bold text-slate-900 font-mono">
                      ₡ 14.500.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: Prima y Deducible */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                <CreditCard className="w-3.5 h-3.5" />
                2. PRIMA Y DEDUCIBLE
              </div>

              {/* Annual Premium Banner */}
              <div className="p-3 bg-slate-900 text-white rounded-md mb-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-300">Prima anual total:</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  ₡ 395.000 <span className="text-xs font-normal text-slate-300">(IVA incluido)</span>
                </span>
              </div>

              <table className="w-full text-left border border-slate-300 text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-300 w-1/2">CONCEPTO</th>
                    <th className="p-2 border border-slate-300 w-1/2">CONDICIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">
                      Deducible por evento (colisión y vuelco)
                    </td>
                    <td className="p-2 border border-slate-300 font-mono">
                      10 % del monto del reclamo, mínimo ₡ 150.000
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">Deducible por robo total</td>
                    <td className="p-2 border border-slate-300 font-mono">10 % del valor asegurado</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">Forma de pago</td>
                    <td className="p-2 border border-slate-300">
                      Anual, semestral o mensual (recargo de 4 % en pago mensual)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Coberturas Incluidas */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5" />
                3. COBERTURAS INCLUIDAS
              </div>
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-300">COBERTURA</th>
                    <th className="p-2 border border-slate-300">LÍMITE</th>
                    <th className="p-2 border border-slate-300 text-center">INCLUIDA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border border-slate-300">Responsabilidad civil por daños a terceros (bienes)</td>
                    <td className="p-2 border border-slate-300 font-mono">₡ 50.000.000</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-600">Sí</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Responsabilidad civil por lesiones o muerte a terceros</td>
                    <td className="p-2 border border-slate-300 font-mono">₡ 100.000.000</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-600">Sí</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Colisión y vuelco</td>
                    <td className="p-2 border border-slate-300">Hasta el valor asegurado</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-600">Sí</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Robo total y parcial</td>
                    <td className="p-2 border border-slate-300">Hasta el valor asegurado</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-600">Sí</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Incendio y rayo</td>
                    <td className="p-2 border border-slate-300">Hasta el valor asegurado</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-600">Sí</td>
                  </tr>
                  <tr className="bg-rose-50/80 font-semibold">
                    <td className="p-2 border border-slate-300 text-rose-900">
                      Fenómenos naturales (inundación, deslizamiento)
                    </td>
                    <td className="p-2 border border-slate-300 text-rose-700">No aplica</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-rose-700">No</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Rotura de cristales</td>
                    <td className="p-2 border border-slate-300 font-mono">₡ 300.000 por evento</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-600">Sí</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 4: Asistencias */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                <Wrench className="w-3.5 h-3.5" />
                4. ASISTENCIAS
              </div>
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-300 w-1/3">ASISTENCIA</th>
                    <th className="p-2 border border-slate-300 w-2/3">DETALLE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">Asistencia vial 24/7</td>
                    <td className="p-2 border border-slate-300">Incluida en todo el territorio nacional</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">Servicio de grúa</td>
                    <td className="p-2 border border-slate-300">Hasta 50 km por evento, máximo 3 eventos al año</td>
                  </tr>
                  <tr className="bg-rose-50/80">
                    <td className="p-2 border border-slate-300 font-medium text-rose-900">Vehículo sustituto</td>
                    <td className="p-2 border border-slate-300 text-rose-700 font-bold">No incluido</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-medium">Asistencia legal en accidente</td>
                    <td className="p-2 border border-slate-300">Incluida (consulta telefónica)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 5: Exclusiones Principales */}
            <div className="mb-5 p-3.5 bg-slate-50 border border-slate-300 rounded-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                5. EXCLUSIONES PRINCIPALES
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                <li>Conductor sin licencia vigente o bajo efectos de alcohol o drogas.</li>
                <li>Uso comercial del vehículo (plataformas de transporte, reparto).</li>
                <li className="font-semibold text-rose-900">
                  Daños por inundación, deslizamiento u otros fenómenos naturales.
                </li>
                <li>Desgaste normal, fallas mecánicas y eléctricas.</li>
              </ul>
            </div>

            {/* Legal Footnote */}
            <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 text-justify leading-relaxed">
              Aseguradora Cordillera S.A. (entidad ficticia creada con fines educativos para el Técnico en IA Empresarial, Universidad Fundepos). Esta propuesta no constituye una póliza; las condiciones definitivas constan en las condiciones generales y particulares del contrato.
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          Fidelidad garantizada con el documento fuente
        </span>
        <span>Asegurada: Laura Solís Vargas</span>
      </div>
    </div>
  );
};
