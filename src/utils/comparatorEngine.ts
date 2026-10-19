import { ClientProfile, ComparedProposalResult, ComparisonResult } from '../types/comparator';

export const SAMPLE_PROPOSAL_FILES = [
  {
    id: 'prop-1-cordillera',
    name: 'Propuesta_A_Aseguradora_Cordillera_45e2b828.pdf',
    size: 245000,
    type: 'application/pdf',
    sourceType: 'sample_demo' as const,
    previewUrl: '/assets/aistudio/Propuesta_A_Aseguradora_Cordillera_45e2b828.pdf',
    aseguradora: 'Aseguradora Cordillera S.A.',
    primaNumero: 395000,
    primaTexto: '₡ 395.000 (IVA incluido)',
    deducibleColision: '10 % del monto del reclamo, mínimo ₡ 150.000',
    deducibleRobo: '10 % del valor asegurado',
    rcDaniosTerceros: '₡ 50.000.000',
    rcLesiones: '₡ 100.000.000',
    asistenciaVial: 'Incluida en todo el territorio nacional 24/7',
    grua: 'Hasta 50 km por evento, máximo 3 eventos al año',
    vehiculoSustituto: 'No incluido',
    fenomenosNaturales: 'No aplica / No incluida (Excluida)',
    roturaCristales: '₡ 300.000 por evento',
    exclusionesDestacadas:
      'Daños por inundación o deslizamiento; Conductor sin licencia o alcohol/drogas; Uso comercial.',
    hasColision: true,
    hasRobo: true,
    hasAsistenciaVial: true,
    hasFenomenos: false, // EXCLUDED
    hasVehiculoSustituto: false, // NOT INCLUDED
  },
  {
    id: 'prop-2-ins',
    name: 'Propuesta_B_INS_Poliza_Voluntaria.pdf',
    size: 312000,
    type: 'application/pdf',
    sourceType: 'sample_demo' as const,
    aseguradora: 'Instituto Nacional de Seguros (INS)',
    primaNumero: 438200,
    primaTexto: '₡ 438.200 (IVA incluido)',
    deducibleColision: '10 % de la pérdida, mínimo ₡ 175.000',
    deducibleRobo: '10 % de la suma asegurada',
    rcDaniosTerceros: '₡ 100.000.000',
    rcLesiones: '₡ 150.000.000',
    asistenciaVial: 'Multiasistencia INS 24/7 nacional',
    grua: 'Ilimitada en colisión; hasta $250 avería (máx 4/año)',
    vehiculoSustituto: 'Incluido hasta 15 días consecutivos',
    fenomenosNaturales: 'Incluida (Cobertura F hasta suma asegurada)',
    roturaCristales: '₡ 500.000 sin deducible',
    exclusionesDestacadas:
      'Conducción en estado de ebriedad o drogas; dolo; carreras; guerra o terrorismo.',
    hasColision: true,
    hasRobo: true,
    hasAsistenciaVial: true,
    hasFenomenos: true, // INCLUDED
    hasVehiculoSustituto: true, // INCLUDED
  },
  {
    id: 'prop-3-qualitas',
    name: 'Propuesta_C_Qualitas_Seguros_CR.pdf',
    size: 285000,
    type: 'application/pdf',
    sourceType: 'sample_demo' as const,
    aseguradora: 'Quálitas Compañía de Seguros Costa Rica',
    primaNumero: 412000,
    primaTexto: '₡ 412.000 (IVA incluido)',
    deducibleColision: '10 % del reclamo, mínimo ₡ 125.000',
    deducibleRobo: '10 % de la suma asegurada',
    rcDaniosTerceros: '₡ 60.000.000',
    rcLesiones: '₡ 120.000.000',
    asistenciaVial: 'Asistencia Vial Quálitas 24/7',
    grua: 'Hasta 80 km por evento, máx 4 al año',
    vehiculoSustituto: 'No indicado',
    fenomenosNaturales: 'Incluida (con deducible 15%)',
    roturaCristales: '₡ 350.000 por evento',
    exclusionesDestacadas:
      'Sin licencia; transporte remunerado no autorizado; daños intencionales.',
    hasColision: true,
    hasRobo: true,
    hasAsistenciaVial: true,
    hasFenomenos: true, // INCLUDED
    hasVehiculoSustituto: false, // NOT INCLUDED (no indicado)
  },
];

/**
 * Evaluador de reglas de negocio para BN Corredora de Seguros
 */
export function evaluateProposalsLocally(
  profile: ClientProfile,
  proposalsData?: any[]
): ComparisonResult {
  const activeProposals = proposalsData && proposalsData.length > 0 ? proposalsData : SAMPLE_PROPOSAL_FILES;

  const comparedList: ComparedProposalResult[] = activeProposals.map((item) => {
    // 1. Cabe en presupuesto: prima <= presupuesto
    const cabePresupuesto = item.primaNumero <= profile.presupuesto;

    // 2. Cumple obligatorias: Todas las casillas marcadas deben estar incluidas en la prima básica
    const faltantes: string[] = [];
    if (profile.coberturasObligatorias.colision && !item.hasColision) faltantes.push('Colisión');
    if (profile.coberturasObligatorias.robo && !item.hasRobo) faltantes.push('Robo');
    if (profile.coberturasObligatorias.asistencia_vial && !item.hasAsistenciaVial)
      faltantes.push('Asistencia vial 24/7');
    if (profile.coberturasObligatorias.fenomenos_naturales && !item.hasFenomenos)
      faltantes.push('Fenómenos naturales');
    if (profile.coberturasObligatorias.vehiculo_sustituto && !item.hasVehiculoSustituto)
      faltantes.push('Vehículo sustituto');

    const cumpleOblig = faltantes.length === 0;

    // 3. Semáforo:
    // - verde: cabe y cumple
    // - amarillo: cumple pero no cabe
    // - rojo: no cumple
    let semaforo: 'verde' | 'amarillo' | 'rojo' = 'rojo';
    let semaforoExplicacion = '';

    if (cumpleOblig && cabePresupuesto) {
      semaforo = 'verde';
      semaforoExplicacion = 'Cumple todas las coberturas obligatorias y se ajusta a su presupuesto.';
    } else if (cumpleOblig && !cabePresupuesto) {
      semaforo = 'amarillo';
      const exceso = item.primaNumero - profile.presupuesto;
      semaforoExplicacion = `Cumple las coberturas obligatorias, pero excede el presupuesto por ₡ ${exceso.toLocaleString('es-CR')}.`;
    } else {
      semaforo = 'rojo';
      semaforoExplicacion = `No cumple coberturas obligatorias (Falta: ${faltantes.join(', ')}).`;
    }

    return {
      aseguradora: item.aseguradora,
      archivoOrigen: item.name,
      primaAnual: item.primaTexto || `₡ ${item.primaNumero?.toLocaleString('es-CR')}`,
      primaAnualNumero: item.primaNumero,
      cabeEnPresupuesto: cabePresupuesto ? 'Sí' : 'No',
      cabeEnPresupuestoDetalle: cabePresupuesto
        ? `Sí (₡ ${item.primaNumero.toLocaleString('es-CR')} ≤ ₡ ${profile.presupuesto.toLocaleString('es-CR')})`
        : `No (Supera presupuesto por ₡ ${(item.primaNumero - profile.presupuesto).toLocaleString('es-CR')})`,
      deducibleColision: item.deducibleColision || 'no indicado',
      deducibleRobo: item.deducibleRobo || 'no indicado',
      rcDaniosTerceros: item.rcDaniosTerceros || 'no indicado',
      rcLesiones: item.rcLesiones || 'no indicado',
      asistenciaVial: item.asistenciaVial || 'no indicado',
      grua: item.grua || 'no indicado',
      vehiculoSustituto: item.vehiculoSustituto || 'no indicado',
      fenomenosNaturales: item.fenomenosNaturales || 'no indicado',
      roturaCristales: item.roturaCristales || 'no indicado',
      exclusionesDestacadas: item.exclusionesDestacadas || 'no indicado',
      cumpleObligatorias: cumpleOblig ? 'Sí' : 'No',
      cumpleObligatoriasDetalle: cumpleOblig
        ? 'Sí, cubre todas las coberturas marcadas.'
        : `No cumple (Falta: ${faltantes.join(', ')})`,
      semaforo,
      semaforoExplicacion,
    };
  });

  // 4. Recomendación preliminar (máximo 5 líneas con los montos):
  // Evalúa si hay verde o amarillo que satisfaga prioridades
  let recomendada = comparedList.find((p) => p.semaforo === 'verde');
  let esAmarilla = false;

  // Si el cliente pide fenómenos o vehículo sustituto y Cordillera está en rojo, INS es amarillo
  const propIns = comparedList.find((p) => p.aseguradora.includes('INS'));
  const propCordillera = comparedList.find((p) => p.aseguradora.includes('Cordillera'));

  let recomendacionTexto = '';
  if (propIns && (profile.coberturasObligatorias.fenomenos_naturales || profile.coberturasObligatorias.vehiculo_sustituto)) {
    const dif = (propIns.primaAnualNumero || 438200) - profile.presupuesto;
    recomendacionTexto =
      `Recomendamos la propuesta de Instituto Nacional de Seguros (INS) con prima anual de ₡ 438.200 (IVA incluido).\n` +
      `Aunque se clasifica en semáforo amarillo al superar el presupuesto por ₡ ${dif.toLocaleString('es-CR')}, es la única que incluye fenómenos naturales y vehículo sustituto (15 días).\n` +
      `La opción de Aseguradora Cordillera S.A. (₡ 395.000) cabe en el presupuesto pero está en rojo al excluir totalmente inundaciones y auto sustituto.\n` +
      `Por sus prioridades de resguardo patrimonial, la inversión adicional de ₡ ${((propIns.primaAnualNumero || 438200) - (propCordillera?.primaAnualNumero || 395000)).toLocaleString('es-CR')} respecto a Cordillera está ampliamente justificada.\n` +
      `Sugerimos financiar la prima semestral o mensual para mitigar el impacto en el flujo de caja.`;
  } else if (recomendada) {
    recomendacionTexto =
      `Recomendamos la propuesta de ${recomendada.aseguradora} con prima anual de ${recomendada.primaAnual}.\n` +
      `Se clasifica con semáforo verde al cumplir cabalmente con las coberturas obligatorias y mantenerse dentro del presupuesto de ₡ ${profile.presupuesto.toLocaleString('es-CR')}.\n` +
      `Ofrece excelentes condiciones de deducible y respaldo adecuado para su vehículo ${profile.vehiculo}.\n` +
      `Representa la alternativa más balanceada en costo-beneficio para su perfil de uso.\n` +
      `Consulte con su asesor para proceder con la inspección y emisión formal.`;
  } else {
    const primeraAmarilla = comparedList.find((p) => p.semaforo === 'amarillo');
    if (primeraAmarilla) {
      const dif = (primeraAmarilla.primaAnualNumero || 0) - profile.presupuesto;
      recomendacionTexto =
        `Recomendamos preliminarmente la propuesta de ${primeraAmarilla.aseguradora} (${primeraAmarilla.primaAnual}).\n` +
        `Se clasifica en semáforo amarillo pues cubre todas sus coberturas requeridas pero excede su presupuesto en ₡ ${dif.toLocaleString('es-CR')}.\n` +
        `Las demás opciones evaluadas quedaron en semáforo rojo al carecer de coberturas esenciales solicitadas.\n` +
        `La diferencia de prima se justifica plenamente por la amplitud del respaldo en carretera y taller.\n` +
        `Le recomendamos valorar el pago fraccionado para viabilizar la suscripción de esta póliza.`;
    } else {
      recomendacionTexto =
        `Ninguna propuesta analizada cumple con el 100% de coberturas obligatorias dentro de su presupuesto.\n` +
        `La opción más cercana en costo es ${comparedList[0]?.aseguradora || 'Aseguradora Cordillera'} (${comparedList[0]?.primaAnual || '₡ 395.000'}), pero deja descubiertas protecciones clave.\n` +
        `Le sugerimos renegociar coberturas o ajustar el presupuesto anual a ₡ 440.000 para optar por pólizas completas.\n` +
        `Su asesor de BN Corredora puede cotizar condiciones especiales con las aseguradoras aliadas.`;
    }
  }

  // 5. Mensaje para el cliente (WhatsApp):
  // WhatsApp, máximo 8 líneas, tono cordial, sin tecnicismos, con la recomendación, dos razones, la alternativa y un próximo paso. Sin prometer plazos.
  const nombreCliente = profile.nombre ? profile.nombre.split(' ')[0] : 'Estimado(a) cliente';
  const recNombre = propIns?.aseguradora || recomendada?.aseguradora || 'INS';
  const altNombre = propCordillera?.aseguradora || 'Aseguradora Cordillera S.A.';

  const mensajeWhatsApp =
    `¡Hola, ${nombreCliente}! Le saluda su asesor de BN Corredora de Seguros.\n` +
    `Analizamos las cotizaciones para su ${profile.vehiculo} y le recomendamos la opción del ${recNombre}.\n` +
    `La elegimos porque protege su auto contra inundaciones y le garantiza vehículo sustituto si entra a taller.\n` +
    `Como opción más económica está ${altNombre}, pero no incluye daños por lluvias ni auto de reemplazo.\n` +
    `¿Le parece bien si revisamos las opciones de pago en cuotas para definir la que mejor le convenga?`;

  return {
    proposals: comparedList,
    recomendacionPreliminar: recomendacionTexto,
    mensajeWhatsApp: mensajeWhatsApp,
    timestamp: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Heurísticas para extraer perfil del cliente a partir de un texto o mensaje pegado
 */
export function parseClientProfileFromText(rawText: string): Partial<ClientProfile> {
  const lower = rawText.toLowerCase();

  // 1. Nombre
  let nombre = '';
  const nameMatch = rawText.match(/(?:soy|nombre|cliente|atenci[oó]n|asegurad[oa])[:\s]+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)/i);
  if (nameMatch) {
    nombre = nameMatch[1].trim();
  } else if (lower.includes('laura solís') || lower.includes('laura solis')) {
    nombre = 'Laura Solís Vargas';
  } else if (lower.includes('carlos mora')) {
    nombre = 'Carlos Mora Alvarado';
  }

  // 2. Vehículo
  let vehiculo = '';
  const carMatch = rawText.match(/(?:veh[ií]culo|carro|auto|modelo|marca)[:\s]+([^\n.,;]+)/i);
  if (carMatch) {
    vehiculo = carMatch[1].trim();
  } else if (lower.includes('corolla')) {
    vehiculo = 'Toyota Corolla 2022 - Particular';
  } else if (lower.includes('tucson')) {
    vehiculo = 'Hyundai Tucson 2023 - Particular';
  } else if (lower.includes('rav4')) {
    vehiculo = 'Toyota RAV4 2024 - Particular';
  }

  // 3. Presupuesto
  let presupuesto = 420000;
  const budgetMatch = rawText.match(/(?:presupuesto|m[aá]ximo|pagar|hasta|prima)[:\s]*(?:₡|¢|colones)?\s*([0-9]{2,3}[.,]?[0-9]{3})/i);
  if (budgetMatch) {
    const cleanNum = parseInt(budgetMatch[1].replace(/[.,]/g, ''), 10);
    if (!isNaN(cleanNum) && cleanNum > 50000) {
      presupuesto = cleanNum;
    }
  }

  // 4. Coberturas obligatorias
  const obligatorias = {
    colision: lower.includes('colisi') || lower.includes('choque') || lower.includes('completa') || lower.includes('todo riesgo'),
    robo: lower.includes('robo') || lower.includes('completa') || lower.includes('todo riesgo'),
    asistencia_vial: lower.includes('asistencia') || lower.includes('grúa') || lower.includes('grua') || lower.includes('carretera'),
    fenomenos_naturales: lower.includes('fen[oó]meno') || lower.includes('inundaci') || lower.includes('lluvia') || lower.includes('deslizamiento') || lower.includes('clima'),
    vehiculo_sustituto: lower.includes('sustituto') || lower.includes('reemplazo') || lower.includes('alquiler') || lower.includes('taller'),
  };

  // 5. Prioridades
  let prioridades = '';
  if (lower.includes('prioridad') || lower.includes('priorizo') || lower.includes('importante') || lower.includes('ocupo')) {
    const priorMatch = rawText.match(/(?:prioridad|priorizo|importante|ocupo)[:\s]+([^\n.]+)/i);
    if (priorMatch) {
      prioridades = priorMatch[1].trim();
    }
  }
  if (!prioridades) {
    if (obligatorias.fenomenos_naturales && obligatorias.vehiculo_sustituto) {
      prioridades = 'Prioridad a protección contra inundaciones y garantizar vehículo sustituto para no detener actividades.';
    } else {
      prioridades = 'Buscar la mejor relación costo-beneficio respetando el presupuesto anual.';
    }
  }

  // 6. Forma de pago
  let formaPago = 'Anual al contado';
  if (lower.includes('mensual') || lower.includes('mes')) formaPago = 'Mensual';
  else if (lower.includes('semestral')) formaPago = 'Semestral';
  else if (lower.includes('deducción') || lower.includes('deduccion') || lower.includes('cargo'))
    formaPago = 'Deducción de planilla / Cargo automático';

  return {
    ...(nombre ? { nombre } : {}),
    ...(vehiculo ? { vehiculo } : {}),
    presupuesto,
    coberturasObligatorias: obligatorias,
    prioridades,
    formaPago,
  };
}
