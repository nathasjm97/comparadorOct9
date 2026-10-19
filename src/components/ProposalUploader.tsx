import React, { useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle2, AlertCircle, Sparkles, Plus } from 'lucide-react';
import { UploadedProposalFile } from '../types/comparator';
import { SAMPLE_PROPOSAL_FILES } from '../utils/comparatorEngine';

interface ProposalUploaderProps {
  files: UploadedProposalFile[];
  onAddFiles: (newFiles: UploadedProposalFile[]) => void;
  onRemoveFile: (id: string) => void;
  onLoadSamples: () => void;
}

export const ProposalUploader: React.FC<ProposalUploaderProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onLoadSamples,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    await processFileList(selected);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const dropped = Array.from(e.dataTransfer.files);
    await processFileList(dropped);
  };

  const processFileList = async (fileList: File[]) => {
    const validPdfs = fileList.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (validPdfs.length === 0) {
      alert('Por favor seleccione archivos en formato PDF.');
      return;
    }

    const availableSlots = 3 - files.length;
    if (availableSlots <= 0) {
      alert('Solo se permite comparar un máximo de 3 propuestas de aseguradoras simultáneamente.');
      return;
    }

    const toProcess = validPdfs.slice(0, availableSlots);

    const newFiles: UploadedProposalFile[] = [];
    for (const f of toProcess) {
      const b64 = await fileToBase64(f);
      newFiles.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        size: f.size,
        type: f.type || 'application/pdf',
        fileBase64: b64,
        sourceType: 'user_upload',
      });
    }

    onAddFiles(newFiles);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const b64 = result.split(',')[1];
        resolve(b64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              1. Propuestas
            </h2>
            <p className="text-xs text-slate-300">
              Suba de 1 a 3 archivos PDF (una propuesta por aseguradora)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSamples}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-700/80 hover:bg-indigo-600 text-amber-200 rounded-lg transition-colors border border-indigo-400/30 cursor-pointer"
            title="Cargar cotizaciones de ejemplo de Costa Rica"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cargar 3 propuestas de prueba</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Upload dropzone */}
        {files.length < 3 && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-600 rounded-xl p-5 text-center bg-slate-50/60 hover:bg-indigo-50/30 transition-all cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 mx-auto mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Haga clic aquí o arrastre de 1 a 3 propuestas en PDF
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {files.length === 0
                ? 'Puede subir hasta 3 cotizaciones para comparación simultánea'
                : `Tiene ${files.length} cargada(s). Puede agregar ${3 - files.length} más.`}
            </p>
          </div>
        )}

        {/* Loaded Files List */}
        {files.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Archivos cargados ({files.length} de 3):</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Listo para análisis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 transition-all flex items-start justify-between gap-2 shadow-xs group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 rounded-md bg-rose-50 text-rose-600 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">
                        Propuesta {idx + 1}
                      </span>
                      <p
                        className="text-xs font-semibold text-slate-900 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {(file.size / 1024).toFixed(0)} KB · PDF
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(file.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Eliminar propuesta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            No hay archivos cargados aún. Suba sus PDF o pulse "Cargar 3 propuestas de prueba".
          </div>
        )}
      </div>
    </div>
  );
};
