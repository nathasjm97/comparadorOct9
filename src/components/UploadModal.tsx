import React, { useState, useRef } from 'react';
import { Upload, FileUp, Loader2, AlertCircle, X, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { InsuranceProposal, QuoteField } from '../types/insurance';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (proposal: InsuranceProposal) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // strip data:application/pdf;base64, or data:image/png;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAnalyze = async () => {
    setError(null);
    setIsLoading(true);

    try {
      let payload: { fileBase64?: string; mimeType?: string; textContent?: string } = {};

      if (activeTab === 'file') {
        if (!selectedFile) {
          setError('Por favor seleccione un archivo PDF o imagen de la cotización.');
          setIsLoading(false);
          return;
        }
        const b64 = await fileToBase64(selectedFile);
        payload = {
          fileBase64: b64,
          mimeType: selectedFile.type || 'application/pdf',
        };
      } else {
        if (!textInput.trim()) {
          setError('Por favor pegue el texto de la propuesta de seguro.');
          setIsLoading(false);
          return;
        }
        payload = {
          textContent: textInput,
        };
      }

      const res = await fetch('/api/analyze-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }

      const data = await res.json();

      const newProposal: InsuranceProposal = {
        id: `uploaded-${Date.now()}`,
        titulo: activeTab === 'file' && selectedFile ? selectedFile.name : 'Propuesta Analizada',
        aseguradora: data.fields?.find((f: any) => f.campo.toLowerCase().includes('aseguradora'))?.valor || 'No indicada',
        numeroCotizacion: data.fields?.find((f: any) => f.campo.toLowerCase().includes('cotización'))?.valor || 'No indicado',
        cliente: 'Cliente Cotización',
        identificacion: 'N/A',
        fechaEmision: data.fields?.find((f: any) => f.campo.toLowerCase().includes('fecha'))?.valor || 'No indicada',
        vigencia: '',
        vehiculo: data.fields?.find((f: any) => f.campo.toLowerCase().includes('vehículo'))?.valor || 'No indicado',
        moneda: 'CRC',
        fields: data.fields || [],
        missingDataLine: data.missingData || 'Datos que no encontré en el documento: Ninguno.',
      };

      onAnalysisComplete(newProposal);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error analizando la propuesta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-50">
                Analizar Nueva Cotización de Auto
              </h3>
              <p className="text-xs text-slate-300">
                Extracción con reglas de correduría (Costa Rica)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'file'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Subir PDF / Imagen
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Pegar Texto de Cotización
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {activeTab === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <FileUp className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
              {selectedFile ? (
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                  <p className="text-slate-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {selectedFile.type || 'Documento'}
                  </p>
                  <span className="inline-block mt-2 text-indigo-600 underline">
                    Cambiar archivo
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">
                    Haga clic o arrastre el archivo PDF o imagen
                  </p>
                  <p className="text-slate-500 mt-1">
                    Formatos: PDF, PNG, JPG de cualquier aseguradora (INS, Qualitas, ASSA, MAPFRE, etc.)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Texto de la cotización o póliza:
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Pegue aquí el texto copiado de la cotización..."
                rows={8}
                className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Rules reminder */}
          <div className="mt-4 p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
            <p className="font-semibold">Reglas que ejecutará el analista IA:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-indigo-800">
              <li>Extraer exactamente los 19 campos estipulados.</li>
              <li>Si un dato no aparece, colocará "no indicado" (sin cálculos).</li>
              <li>Montos con moneda original (₡ colones o $ USD).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analizando propuesta...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Extraer y Generar Tabla
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
