import React, { useState } from 'react';
import { QuoteField } from '../types/insurance';
import { Check, Copy, AlertTriangle, ShieldAlert, CheckCircle2, FileText, Download, Printer } from 'lucide-react';

interface QuoteTableProps {
  fields: QuoteField[];
  missingDataLine: string;
  proposalTitle: string;
  onSelectField?: (field: QuoteField) => void;
  selectedField?: string | null;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({
  fields,
  missingDataLine,
  proposalTitle,
  onSelectField,
  selectedField,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Generate plain text table strictly as requested
  const generateMarkdownTable = () => {
    let md = `| Campo | Valor |\n|---|---|\n`;
    fields.forEach((f) => {
      md += `| ${f.campo} | ${f.valor} |\n`;
    });
    md += `\n${missingDataLine}`;
    return md;
  };

  const generatePlainText = () => {
    let text = `ANÁLISIS DE PROPUESTA DE SEGURO DE AUTOMÓVIL\n${proposalTitle}\n\n`;
    fields.forEach((f) => {
      text += `${f.campo}: ${f.valor}\n`;
    });
    text += `\n${missingDataLine}\n`;
    return text;
  };

  const generateCSV = () => {
    let csv = `Campo,Valor\n`;
    fields.forEach((f) => {
      const cleanCampo = `"${f.campo.replace(/"/g, '""')}"`;
      const cleanValor = `"${f.valor.replace(/"/g, '""')}"`;
      csv += `${cleanCampo},${cleanValor}\n`;
    });
    csv += `\n"${missingDataLine.replace(/"/g, '""')}",\n`;
    return csv;
  };

  const copyToClipboard = (type: 'markdown' | 'text' | 'csv') => {
    let content = '';
    if (type === 'markdown') content = generateMarkdownTable();
    else if (type === 'text') content = generatePlainText();
    else if (type === 'csv') content = generateCSV();

    navigator.clipboard.writeText(content).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Check if a value indicates exclusion, not included or not specified
  const getValueBadge = (valor: string) => {
    const lower = valor.toLowerCase();
    if (lower.includes('no incluido') || lower.includes('no incluida') || lower.includes('no aplica') || lower.includes('excluid')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <ShieldAlert className="w-3.5 h-3.5" />
          No incluida / Excluida
        </span>
      );
    }
    if (lower === 'no indicado' || lower.includes('no indicado')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          No indicado
        </span>
      );
    }
    if (lower.includes('incluid') || lower.includes('sí') || lower.includes('si')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Incluida
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
              Formato Oficial Requerido
            </span>
            <span className="text-xs text-slate-300">
              2 Columnas (Campo, Valor) · 19 Filas Exactas
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mt-1 text-slate-50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Tabla de Extracción de Datos
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {proposalTitle} — Extracción estricta sin suposiciones ni cálculos
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => copyToClipboard('markdown')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Copiar tabla en formato Markdown"
          >
            {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedType === 'markdown' ? '¡Copiado!' : 'Copiar Markdown'}
          </button>

          <button
            onClick={() => copyToClipboard('text')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Copiar como texto plano"
          >
            {copiedType === 'text' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Texto Plano
          </button>

          <button
            onClick={() => copyToClipboard('csv')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Copiar CSV para Excel / Sheets"
          >
            {copiedType === 'csv' ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Imprimir o exportar a PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Rules Notice Badge */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>
            <strong>Reglas aplicadas:</strong> Montos con moneda original (₡ colones), exclusiones explícitas, valores textuales idénticos al documento.
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Total campos: <strong>{fields.length} / 19</strong>
        </div>
      </div>

      {/* The 2-Column Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 uppercase font-bold text-xs tracking-wider border-b border-slate-200">
              <th scope="col" className="py-3 px-4 sm:px-6 w-5/12 sm:w-1/3">
                Campo
              </th>
              <th scope="col" className="py-3 px-4 sm:px-6 w-7/12 sm:w-2/3">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {fields.map((field, idx) => {
              const isSelected = selectedField === field.campo;
              const isEven = idx % 2 === 0;
              const badge = getValueBadge(field.valor);

              return (
                <tr
                  key={field.campo}
                  onClick={() => onSelectField && onSelectField(field)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 ring-1 ring-inset ring-indigo-300 font-medium'
                      : isEven
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <td className="py-3 px-4 sm:px-6 font-semibold text-slate-900 align-top">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 select-none w-5 text-right">
                        {idx + 1}.
                      </span>
                      <span>{field.campo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-slate-800 align-top">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                      <span className="font-mono text-[13px] sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-900">
                        {field.valor}
                      </span>
                      {badge && <div className="shrink-0">{badge}</div>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mandatory closing line */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50/50 border-t-2 border-amber-300">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 text-amber-800 rounded-md shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-900">
              Verificación de Datos No Encontrados
            </h4>
            <p className="mt-1 font-mono text-sm font-semibold text-amber-950 bg-white/70 px-3 py-1.5 rounded border border-amber-200 inline-block">
              {missingDataLine}
            </p>
            <p className="mt-1.5 text-xs text-amber-800">
              * Conforme a la regla: Si un dato no figura en la cotización, se cataloga estrictamente como "no indicado".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
