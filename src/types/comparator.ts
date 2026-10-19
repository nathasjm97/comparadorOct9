export interface UploadedProposalFile {
  id: string;
  name: string;
  size: number;
  type: string;
  fileBase64?: string;
  sourceType: 'user_upload' | 'sample_demo';
  previewUrl?: string;
}

export type ObligatoryCoverageKey =
  | 'colision'
  | 'robo'
  | 'asistencia_vial'
  | 'fenomenos_naturales'
  | 'vehiculo_sustituto';

export interface ClientProfile {
  nombre: string;
  vehiculo: string;
  presupuesto: number;
  coberturasObligatorias: {
    colision: boolean;
    robo: boolean;
    asistencia_vial: boolean;
    fenomenos_naturales: boolean;
    vehiculo_sustituto: boolean;
  };
  prioridades: string;
  formaPago: string;
}

export interface ComparedProposalResult {
  aseguradora: string;
  archivoOrigen?: string;
  primaAnual: string;
  primaAnualNumero?: number;
  cabeEnPresupuesto: 'Sí' | 'No';
  cabeEnPresupuestoDetalle?: string;
  deducibleColision: string;
  deducibleRobo: string;
  rcDaniosTerceros: string;
  rcLesiones: string;
  asistenciaVial: string;
  grua: string;
  vehiculoSustituto: string;
  fenomenosNaturales: string;
  roturaCristales: string;
  exclusionesDestacadas: string;
  cumpleObligatorias: 'Sí' | 'No';
  cumpleObligatoriasDetalle?: string;
  semaforo: 'verde' | 'amarillo' | 'rojo';
  semaforoExplicacion?: string;
}

export interface ComparisonResult {
  proposals: ComparedProposalResult[];
  recomendacionPreliminar: string;
  mensajeWhatsApp: string;
  timestamp?: string;
}
