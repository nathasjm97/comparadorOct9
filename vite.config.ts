import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {GoogleGenAI} from '@google/genai';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-insurance-analyzer',
        configureServer(server) {
          // Endpoint para comparar múltiples propuestas de aseguradoras
          server.middlewares.use('/api/compare-proposals', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            const chunks: Buffer[] = [];
            req.on('data', (chunk) => {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const { files, clientProfile } = JSON.parse(bodyStr || '{}');

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({
                    error: 'GEMINI_API_KEY no encontrada en el entorno del servidor.',
                  }));
                  return;
                }

                const ai = new GoogleGenAI({
                  apiKey,
                  httpOptions: {
                    headers: {
                      'User-Agent': 'aistudio-build',
                    },
                  },
                });

                const systemInstruction = `Actúe como analista de una corredora de seguros en Costa Rica ("Comparador de Propuestas BN").
TAREA: Lea las propuestas de seguro de automóvil adjuntas (de 1 a 3 documentos PDF o imágenes) y el perfil del cliente, y genere la comparación técnica rigurosa.

LÓGICA Y REGLAS ESTRICTAS:
1. Extraer de cada PDF solo lo que dice el documento; si un dato no aparece, escribir "no indicado". No inventar ni suponer nada. Copiar los montos tal como están con su moneda. Si una cobertura aparece como no incluida o excluida, indicarlo así.
2. Validar:
   - CABE EN PRESUPUESTO: "Sí" si la prima anual es menor o igual al presupuesto del cliente (₡ ${clientProfile?.presupuesto || 0}). Si no, "No".
   - CUMPLE OBLIGATORIAS: "Sí" SOLO si todas las coberturas marcadas como obligatorias por el cliente están incluidas en la prima; un paquete opcional con costo adicional no cuenta. Si no, "No".
3. SEMÁFORO:
   - "verde": si cabe en presupuesto Y cumple obligatorias.
   - "amarillo": si cumple obligatorias pero NO cabe en presupuesto.
   - "rojo": si NO cumple obligatorias (independientemente del presupuesto).
4. RECOMENDACIÓN PRELIMINAR (BORRADOR):
   - Una sola propuesta recomendada, justificada en máximo 5 líneas con los montos, según las prioridades del cliente. Si una propuesta amarilla es mejor en las prioridades, decirlo y cuantificar la diferencia de prima.
5. MENSAJE SUGERIDO PARA EL CLIENTE (WHATSAPP):
   - Formato para WhatsApp, máximo 8 líneas, tono cordial, sin tecnicismos, con la recomendación, dos razones, la alternativa y un próximo paso. Sin prometer plazos.

FORMATO DE RESPUESTA JSON ESTRICTO:
{
  "proposals": [
    {
      "aseguradora": "Nombre de la aseguradora (ej: Aseguradora Cordillera S.A.)",
      "primaAnual": "Monto tal cual figura (ej: ₡ 395.000 (IVA incluido))",
      "cabeEnPresupuesto": "Sí" | "No",
      "cabeEnPresupuestoDetalle": "Explicación breve",
      "deducibleColision": "Texto del deducible o no indicado",
      "deducibleRobo": "Texto del deducible o no indicado",
      "rcDaniosTerceros": "Monto o no indicado",
      "rcLesiones": "Monto o no indicado",
      "asistenciaVial": "Detalle de asistencia vial 24/7 o no indicado",
      "grua": "Alcance de grúa o no indicado",
      "vehiculoSustituto": "Condición (ej: No incluido / Incluido 15 días)",
      "fenomenosNaturales": "Condición (ej: No incluida / excluida / Incluida)",
      "roturaCristales": "Monto o no indicado",
      "exclusionesDestacadas": "Principales exclusiones textuales",
      "cumpleObligatorias": "Sí" | "No",
      "cumpleObligatoriasDetalle": "Explicación de qué cobertura falta si no cumple",
      "semaforo": "verde" | "amarillo" | "rojo"
    }
  ],
  "recomendacionPreliminar": "Máximo 5 líneas de recomendación con montos justificada según prioridades.",
  "mensajeWhatsApp": "Máximo 8 líneas, cordial, sin tecnicismos, recomendación, 2 razones, alternativa y próximo paso."
}`;

                const parts: any[] = [];
                if (Array.isArray(files) && files.length > 0) {
                  files.forEach((f: any, idx: number) => {
                    if (f.fileBase64) {
                      parts.push({
                        inlineData: {
                          mimeType: f.mimeType || 'application/pdf',
                          data: f.fileBase64,
                        },
                      });
                      parts.push({
                        text: `[DOCUMENTO PROPUESTA ${idx + 1} - Archivo: ${f.name || `Propuesta ${idx + 1}`}]`,
                      });
                    } else if (f.text) {
                      parts.push({
                        text: `[DOCUMENTO PROPUESTA ${idx + 1} - ${f.name || `Propuesta ${idx + 1}`}]:\n${f.text}`,
                      });
                    }
                  });
                }

                parts.push({
                  text: `DATOS DEL CLIENTE A EVALUAR:
- Nombre del cliente: ${clientProfile?.nombre || 'No indicado'}
- Vehículo y uso: ${clientProfile?.vehiculo || 'No indicado'}
- Presupuesto máximo anual: ₡ ${clientProfile?.presupuesto?.toLocaleString('es-CR') || '0'}
- Coberturas obligatorias marcadas: ${(clientProfile?.coberturasObligatorias || []).join(', ')}
- Prioridades del cliente: ${clientProfile?.prioridades || 'Ninguna especificada'}
- Forma de pago preferida: ${clientProfile?.formaPago || 'Anual'}

Genera la comparación completa en el JSON estructurado solicitado.`,
                });

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: { parts },
                  config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    temperature: 0.1,
                  },
                });

                res.statusCode = 200;
                res.end(response.text || '{}');
              } catch (err: any) {
                console.error('Error in /api/compare-proposals:', err);
                res.statusCode = 500;
                res.end(
                  JSON.stringify({
                    error: err.message || 'Error procesando la comparación con Gemini.',
                  })
                );
              }
            });
          });

          // Endpoint para extraer el perfil del cliente desde PDF o mensaje pegado
          server.middlewares.use('/api/parse-client-profile', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            const chunks: Buffer[] = [];
            req.on('data', (chunk) => {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const { fileBase64, mimeType, textMessage } = JSON.parse(bodyStr || '{}');

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 500;
                  res.end(
                    JSON.stringify({
                      error: 'GEMINI_API_KEY no encontrada en el entorno del servidor.',
                    })
                  );
                  return;
                }

                const ai = new GoogleGenAI({
                  apiKey,
                  httpOptions: {
                    headers: {
                      'User-Agent': 'aistudio-build',
                    },
                  },
                });

                const systemInstruction = `Actúe como asistente experto de una corredora de seguros en Costa Rica.
TAREA: Extraiga del mensaje o documento PDF del cliente los datos necesarios para completar su perfil de aseguramiento para cotizaciones de automóvil.

FORMATO JSON ESTRICTO:
{
  "nombre": "Nombre completo del cliente (o Laura Solís si no indica)",
  "vehiculo": "Marca, modelo, año y uso (ej: Toyota Corolla 2022 - Particular)",
  "presupuesto": 420000, // número entero en colones costarricenses (sin letras, sin símbolos ni comas). Si viene en USD, conviértalo aproximadamente a tipo de cambio 530 colones por dólar o use el valor más razonable.
  "coberturasObligatorias": {
    "colision": true, // true si solicita colisión, choque, vuelco o cobertura completa
    "robo": true, // true si solicita robo
    "asistencia_vial": true, // true si solicita grúa o asistencia vial en carretera
    "fenomenos_naturales": true, // true si menciona inundaciones, lluvias, desastres naturales, sismos, tormentas
    "vehiculo_sustituto": true // true si menciona auto sustituto, auto de alquiler o reemplazo en taller
  },
  "prioridades": "Resumen conciso de las prioridades del cliente en sus propias palabras o interpretadas con precisión",
  "formaPago": "Anual al contado" | "Semestral" | "Mensual" | "Deducción de planilla / Cargo automático"
}`;

                const parts: any[] = [];
                if (fileBase64) {
                  parts.push({
                    inlineData: {
                      mimeType: mimeType || 'application/pdf',
                      data: fileBase64,
                    },
                  });
                  parts.push({
                    text: 'Por favor extraiga el perfil del cliente de este documento PDF.',
                  });
                }
                if (textMessage) {
                  parts.push({
                    text: `Mensaje recibido del cliente:\n"${textMessage}"\n\nExtraiga el perfil del cliente en formato JSON.`,
                  });
                }

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: { parts },
                  config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    temperature: 0.1,
                  },
                });

                res.statusCode = 200;
                res.end(response.text || '{}');
              } catch (err: any) {
                console.error('Error in /api/parse-client-profile:', err);
                res.statusCode = 500;
                res.end(
                  JSON.stringify({
                    error: err.message || 'Error analizando perfil del cliente.',
                  })
                );
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

