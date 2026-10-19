export interface QuoteField {
  campo: string;
  valor: string;
  seccion?: 'encabezado' | 'vehiculo' | 'prima' | 'deducible' | 'coberturas' | 'asistencias' | 'exclusiones' | 'pago';
  tipo?: 'incluido' | 'no_incluido' | 'monto' | 'texto' | 'no_indicado';
}

export interface InsuranceProposal {
  id: string;
  titulo: string;
  aseguradora: string;
  numeroCotizacion: string;
  cliente: string;
  identificacion: string;
  fechaEmision: string;
  vigencia: string;
  vehiculo: string;
  moneda: 'CRC' | 'USD';
  pdfUrl?: string;
  fields: QuoteField[];
  missingDataLine: string;
  notasAnalista?: string[];
}
