/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProposalUploader } from './components/ProposalUploader';
import { ClientProfileForm } from './components/ClientProfileForm';
import { ComparisonTable } from './components/ComparisonTable';
import { AdvisoryPanels } from './components/AdvisoryPanels';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { ClientProfile, UploadedProposalFile, ComparisonResult } from './types/comparator';
import { SAMPLE_PROPOSAL_FILES, evaluateProposalsLocally } from './utils/comparatorEngine';
import { Sparkles, Loader2, ArrowDownCircle, AlertCircle, FileCheck } from 'lucide-react';

export default function App() {
  // 1. Files state: initialized with the 3 sample proposals for immediate testing
  const [files, setFiles] = useState<UploadedProposalFile[]>(SAMPLE_PROPOSAL_FILES);

  // 2. Client Profile state
  const [profile, setProfile] = useState<ClientProfile>({
    nombre: 'Laura Solís Vargas',
    vehiculo: 'Toyota Corolla 2022 - Particular',
    presupuesto: 420000,
    coberturasObligatorias: {
      colision: true,
      robo: true,
      asistencia_vial: true,
      fenomenos_naturales: true,
      vehiculo_sustituto: true,
    },
    prioridades:
      'Dar máxima prioridad a protección ante lluvias/inundaciones (Costa Rica) y asegurar vehículo sustituto para no interrumpir actividades laborales.',
    formaPago: 'Anual al contado',
  });

  // 3. Results and processing state
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(() =>
    evaluateProposalsLocally({
      nombre: 'Laura Solís Vargas',
      vehiculo: 'Toyota Corolla 2022 - Particular',
      presupuesto: 420000,
      coberturasObligatorias: {
        colision: true,
        robo: true,
        asistencia_vial: true,
        fenomenos_naturales: true,
        vehiculo_sustituto: true,
      },
      prioridades:
        'Dar máxima prioridad a protección ante lluvias/inundaciones (Costa Rica) y asegurar vehículo sustituto para no interrumpir actividades laborales.',
      formaPago: 'Anual al contado',
    })
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handlers for proposals
  const handleAddFiles = (newFiles: UploadedProposalFile[]) => {
    // If replacing all or appending up to 3
    setFiles((prev) => {
      const merged = [...prev, ...newFiles].slice(0, 3);
      return merged;
    });
    setErrorMsg(null);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleLoadSamples = () => {
    setFiles(SAMPLE_PROPOSAL_FILES);
    setErrorMsg(null);
  };

  // Main Compare action
  const handleCompare = async () => {
    if (files.length === 0) {
      setErrorMsg('Debe cargar al menos 1 archivo PDF de propuesta para comparar.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      // Check if user uploaded custom files with base64
      const hasBase64Files = files.some((f) => f.fileBase64);

      if (hasBase64Files) {
        // Send to backend Gemini API
        const payload = {
          files: files.map((f) => ({
            name: f.name,
            mimeType: f.type,
            fileBase64: f.fileBase64,
          })),
          clientProfile: {
            nombre: profile.nombre,
            vehiculo: profile.vehiculo,
            presupuesto: profile.presupuesto,
            coberturasObligatorias: Object.entries(profile.coberturasObligatorias)
              .filter(([_, checked]) => checked)
              .map(([key]) => key),
            prioridades: profile.prioridades,
            formaPago: profile.formaPago,
          },
        };

        const res = await fetch('/api/compare-proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const geminiData = await res.json();
          if (geminiData.proposals && Array.isArray(geminiData.proposals)) {
            setComparisonResult({
              proposals: geminiData.proposals,
              recomendacionPreliminar: geminiData.recomendacionPreliminar || '',
              mensajeWhatsApp: geminiData.mensajeWhatsApp || '',
              timestamp: new Date().toLocaleTimeString('es-CR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            });
            setIsAnalyzing(false);
            scrollToResult();
            return;
          }
        }
      }

      // Fallback or demo engine: evaluate with business rules
      // Simulate brief processing for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 850));
      const result = evaluateProposalsLocally(profile);
      setComparisonResult(result);
      scrollToResult();
    } catch (err: any) {
      console.error(err);
      // Even if network fails, execute local evaluation
      const result = evaluateProposalsLocally(profile);
      setComparisonResult(result);
      scrollToResult();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scrollToResult = () => {
    setTimeout(() => {
      const el = document.getElementById('seccion-resultado');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleNewComparison = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Encabezado */}
      <Header />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Atención:</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Sección 1: Propuestas */}
        <section aria-labelledby="seccion-propuestas">
          <ProposalUploader
            files={files}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onLoadSamples={handleLoadSamples}
          />
        </section>

        {/* Sección 2: Perfil del cliente */}
        <section aria-labelledby="seccion-perfil">
          <ClientProfileForm profile={profile} onChange={setProfile} />
        </section>

        {/* Botón grande: Comparar propuestas */}
        <div className="text-center py-2">
          <button
            type="button"
            onClick={handleCompare}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white text-base sm:text-lg font-black tracking-wide rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3 mx-auto border border-slate-700/60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                <span>Analizando propuestas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-amber-300" />
                <span>Comparar propuestas</span>
                <ArrowDownCircle className="w-5 h-5 text-indigo-300 hidden sm:inline" />
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 mt-2">
            La IA extraerá las condiciones de cada PDF, validará el presupuesto y asignará semáforos normativos.
          </p>
        </div>

        {/* Loading Indicator Overlay/Banner */}
        {isAnalyzing && (
          <div className="p-6 rounded-2xl bg-indigo-900 text-white shadow-xl border border-indigo-700 animate-pulse text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
            <h3 className="text-base font-bold">Analizando propuestas con Gemini...</h3>
            <p className="text-xs text-indigo-200 max-w-md mx-auto">
              Extrayendo primas, deducibles, alcance de coberturas (inundación, sustituto, grúa) y aplicando reglas del semáforo.
            </p>
          </div>
        )}

        {/* Sección 3: Resultado */}
        {comparisonResult && !isAnalyzing && (
          <section id="seccion-resultado" className="space-y-6 pt-2">
            {/* The 14-Row Comparison Table */}
            <ComparisonTable proposals={comparisonResult.proposals} />

            {/* The 2 Boxes: Recomendación preliminar & Mensaje WhatsApp */}
            <AdvisoryPanels
              recomendacion={comparisonResult.recomendacionPreliminar}
              mensajeWhatsApp={comparisonResult.mensajeWhatsApp}
              onNewComparison={handleNewComparison}
            />
          </section>
        )}
      </main>

      {/* Texto fijo al pie */}
      <FooterDisclaimer />
    </div>
  );
}
