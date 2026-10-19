import React, { useState, useRef } from 'react';
import {
  User,
  Car,
  DollarSign,
  CheckSquare,
  ListOrdered,
  CreditCard,
  Sparkles,
  Upload,
  FileText,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { ClientProfile, ObligatoryCoverageKey } from '../types/comparator';
import { parseClientProfileFromText } from '../utils/comparatorEngine';

interface ClientProfileFormProps {
  profile: ClientProfile;
  onChange: (updated: ClientProfile) => void;
}

export const ClientProfileForm: React.FC<ClientProfileFormProps> = ({ profile, onChange }) => {
  const [isAutoFillOpen, setIsAutoFillOpen] = useState(true);
  const [autoFillTab, setAutoFillTab] = useState<'text' | 'pdf'>('text');
  const [messageInput, setMessageInput] = useState('');
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);

  const sampleMessages = [
    {
      label: 'Ejemplo: Laura Solís (Toyota Corolla)',
      text: `Hola, buenas tardes. Soy Laura Solís Vargas. Estoy buscando seguro para mi Toyota Corolla 2022 de uso particular. 
Mi presupuesto máximo para el seguro es de 420.000 colones al año.
Necesito de forma obligatoria que incluya colisión, robo, asistencia vial 24/7 con grúa, cobertura de fenómenos naturales (por las inundaciones de la época lluviosa) y vehículo sustituto porque dependo del carro para trabajar.
Prefiero pagar al contado anual si no hay recargos. Muchas gracias.`,
    },
    {
      label: 'Ejemplo: Carlos Mora (Hyundai Tucson)',
      text: `Buenas, soy Carlos Mora Alvarado. Cotizando para un Hyundai Tucson 2023 de uso familiar y laboral.
Presupuesto anual límite: 450.000 colones.
Para mí es indispensable: colisión, robo y asistencia vial 24/7 en todo Costa Rica. El vehículo sustituto no me urge, pero sí que tenga buena grúa.
Prefiero pagarlo en cuotas mensuales si es posible.`,
    },
  ];

  const handleTextChange = (field: keyof ClientProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleCheckboxToggle = (key: ObligatoryCoverageKey) => {
    onChange({
      ...profile,
      coberturasObligatorias: {
        ...profile.coberturasObligatorias,
        [key]: !profile.coberturasObligatorias[key],
      },
    });
  };

  const coverageOptions: { key: ObligatoryCoverageKey; label: string; tooltip: string }[] = [
    { key: 'colision', label: 'Colisión', tooltip: 'Daños al propio vehículo por choque o vuelco' },
    { key: 'robo', label: 'Robo', tooltip: 'Sustracción total o parcial del vehículo' },
    { key: 'asistencia_vial', label: 'Asistencia vial 24/7', tooltip: 'Grúa, auxilio mecánico, cerrajería en carretera' },
    { key: 'fenomenos_naturales', label: 'Fenómenos naturales', tooltip: 'Inundación, deslizamiento, sismos, caída de árboles' },
    { key: 'vehiculo_sustituto', label: 'Vehículo sustituto', tooltip: 'Auto de alquiler durante reparación en taller' },
  ];

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

  const handleProcessInput = async () => {
    setFeedback(null);
    setIsProcessing(true);

    try {
      let payload: { fileBase64?: string; mimeType?: string; textMessage?: string } = {};

      if (autoFillTab === 'pdf') {
        if (!uploadedPdf) {
          setFeedback({
            type: 'error',
            message: 'Por favor seleccione o arrastre un archivo PDF para extraer el perfil.',
          });
          setIsProcessing(false);
          return;
        }
        const b64 = await fileToBase64(uploadedPdf);
        payload = {
          fileBase64: b64,
          mimeType: uploadedPdf.type || 'application/pdf',
        };
      } else {
        if (!messageInput.trim()) {
          setFeedback({
            type: 'error',
            message: 'Por favor escriba o pegue el mensaje de WhatsApp o correo del cliente.',
          });
          setIsProcessing(false);
          return;
        }
        payload = {
          textMessage: messageInput,
        };
      }

      // Call API server endpoint
      const res = await fetch('/api/parse-client-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const parsed = await res.json();
        applyExtractedProfile(parsed);
        setFeedback({
          type: 'success',
          message: '¡Perfil actualizado con éxito mediante IA! Revise y ajuste los datos abajo.',
        });
      } else {
        // Fallback local heuristic
        applyFallback(payload.textMessage || uploadedPdf?.name || '');
      }
    } catch (err: any) {
      console.warn('API error, applying fallback parser:', err);
      applyFallback(messageInput || uploadedPdf?.name || '');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFallback = (rawText: string) => {
    const extracted = parseClientProfileFromText(rawText);
    applyExtractedProfile(extracted);
    setFeedback({
      type: 'success',
      message: 'Perfil completado automáticamente a partir del contenido suministrado.',
    });
  };

  const applyExtractedProfile = (data: Partial<ClientProfile>) => {
    onChange({
      nombre: data.nombre || profile.nombre || 'Laura Solís Vargas',
      vehiculo: data.vehiculo || profile.vehiculo || 'Toyota Corolla 2022 - Particular',
      presupuesto: typeof data.presupuesto === 'number' && data.presupuesto > 0 ? data.presupuesto : profile.presupuesto,
      coberturasObligatorias: {
        colision: data.coberturasObligatorias?.colision ?? profile.coberturasObligatorias.colision,
        robo: data.coberturasObligatorias?.robo ?? profile.coberturasObligatorias.robo,
        asistencia_vial: data.coberturasObligatorias?.asistencia_vial ?? profile.coberturasObligatorias.asistencia_vial,
        fenomenos_naturales: data.coberturasObligatorias?.fenomenos_naturales ?? profile.coberturasObligatorias.fenomenos_naturales,
        vehiculo_sustituto: data.coberturasObligatorias?.vehiculo_sustituto ?? profile.coberturasObligatorias.vehiculo_sustituto,
      },
      prioridades: data.prioridades || profile.prioridades,
      formaPago: data.formaPago || profile.formaPago,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>2. Perfil del cliente</span>
            </h2>
            <p className="text-xs text-slate-300">
              Complete los campos o use el extractor inteligente mediante PDF o mensaje
            </p>
          </div>
        </div>

        {/* Toggle AutoFill Panel Button */}
        <button
          type="button"
          onClick={() => setIsAutoFillOpen(!isAutoFillOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-700/80 hover:bg-indigo-600 text-amber-200 rounded-lg transition-colors border border-indigo-400/30 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isAutoFillOpen ? 'Ocultar extractor IA' : 'Autocompletar con PDF / Mensaje'}</span>
          {isAutoFillOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* AutoFill Box (Subiendo UN PDF o Pegando UN Mensaje) */}
      {isAutoFillOpen && (
        <div className="bg-gradient-to-b from-indigo-50/70 to-slate-50 p-4 sm:p-5 border-b border-indigo-100/80">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Extractor Inteligente del Perfil del Cliente
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Suba un <strong>PDF</strong> (solicitud, ficha o cotización previa) o pegue un <strong>mensaje</strong> (WhatsApp o correo) para rellenar automáticamente todos los campos del cliente.
            </p>

            {/* Sub-tabs: Pegar mensaje vs Subir PDF */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setAutoFillTab('text')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  autoFillTab === 'text'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Pegar un mensaje (WhatsApp / Correo)</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoFillTab('pdf')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  autoFillTab === 'pdf'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir un PDF del cliente</span>
              </button>
            </div>

            {/* Tab 1: Text message */}
            {autoFillTab === 'text' && (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Pegue aquí el texto copiado de WhatsApp o correo electrónico del cliente..."
                  className="w-full text-xs font-sans p-3 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-800 shadow-2xs"
                />

                {/* Quick Sample Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Cargar ejemplo rápido:</span>
                  {sampleMessages.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setMessageInput(sample.text)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Upload PDF */}
            {autoFillTab === 'pdf' && (
              <div className="space-y-2">
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl p-5 text-center bg-white cursor-pointer transition-all hover:bg-indigo-50/20"
                >
                  <input
                    type="file"
                    ref={pdfInputRef}
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedPdf(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-2 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  {uploadedPdf ? (
                    <div>
                      <p className="text-xs font-bold text-slate-800">{uploadedPdf.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {(uploadedPdf.size / 1024).toFixed(0)} KB · PDF seleccionado
                      </p>
                      <span className="inline-block mt-1 text-[11px] text-indigo-600 underline">
                        Cambiar archivo
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Haga clic o arrastre un PDF con los datos del cliente
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Formulario de prospección, boleta de solicitud o documento del asegurado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={handleProcessInput}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Extrayendo con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Aplicar y rellenar perfil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Fields (Editable Manually) */}
      <div className="p-5 space-y-5">
        {/* Row 1: Nombre, Vehículo & Presupuesto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Nombre
            </label>
            <input
              type="text"
              value={profile.nombre}
              onChange={(e) => handleTextChange('nombre', e.target.value)}
              placeholder="Ej: Laura Solís Vargas"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-900 font-medium"
            />
          </div>

          {/* Vehículo y uso */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-indigo-600" />
              Vehículo y uso
            </label>
            <input
              type="text"
              value={profile.vehiculo}
              onChange={(e) => handleTextChange('vehiculo', e.target.value)}
              placeholder="Ej: Toyota Corolla 2022 - Particular"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-900 font-medium"
            />
          </div>

          {/* Presupuesto máximo anual */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Presupuesto máximo anual (colones)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono font-bold">
                ₡
              </span>
              <input
                type="number"
                step="5000"
                min="50000"
                value={profile.presupuesto || ''}
                onChange={(e) => handleTextChange('presupuesto', Number(e.target.value))}
                placeholder="420000"
                className="w-full text-xs sm:text-sm pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-900 font-mono font-semibold"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Equivalente: ₡ {(profile.presupuesto || 0).toLocaleString('es-CR')} IVA inc.
            </p>
          </div>
        </div>

        {/* Coberturas obligatorias (casillas) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            Coberturas obligatorias (No negociables por el cliente)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {coverageOptions.map((opt) => {
              const isChecked = profile.coberturasObligatorias[opt.key];
              return (
                <label
                  key={opt.key}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title={opt.tooltip}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(opt.key)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            * <strong>Regla del comparador:</strong> Una propuesta solo <em>CUMPLE OBLIGATORIAS</em> si incluye todas las casillas marcadas dentro de la prima básica sin costo adicional.
          </p>
        </div>

        {/* Row 3: Prioridades & Forma de pago preferida */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Prioridades */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
              Prioridades del cliente
            </label>
            <textarea
              rows={2}
              value={profile.prioridades}
              onChange={(e) => handleTextChange('prioridades', e.target.value)}
              placeholder="Ej: Dar máxima prioridad a protección ante lluvias/inundaciones y asegurar auto sustituto para no interrumpir actividades laborales."
              className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-900 resize-none font-normal"
            />
          </div>

          {/* Forma de pago preferida */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              Forma de pago preferida
            </label>
            <select
              value={profile.formaPago}
              onChange={(e) => handleTextChange('formaPago', e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-900 font-medium cursor-pointer"
            >
              <option value="Anual al contado">Anual al contado (sin recargo)</option>
              <option value="Semestral">Semestral (2 cuotas)</option>
              <option value="Mensual">Mensual (financiamiento en cuotas)</option>
              <option value="Deducción de planilla / Cargo automático">Deducción / Cargo automático</option>
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              Se validará si la aseguradora aplica recargo por fraccionamiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
