'use client';

import React from 'react';
import { TipoNotificacion } from '@/types/paciente';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificacionProps {
  tipo: TipoNotificacion;
  mensaje: string;
  titulo?: string;
  onCerrar?: () => void;
}

export const Notificacion: React.FC<NotificacionProps> = ({
  tipo,
  mensaje,
  titulo,
  onCerrar,
}) => {
  if (!mensaje) return null;

  const estilosPorTipo = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icono: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      tituloDefault: 'Operación Exitosa',
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-900',
      icono: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      tituloDefault: 'Error de Validación',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icono: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      tituloDefault: 'Advertencia',
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-900',
      icono: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
      tituloDefault: 'Información',
    },
  };

  const estilo = estilosPorTipo[tipo] || estilosPorTipo.info;

  return (
    <div
      data-testid="mensaje-notificacion"
      role="alert"
      className={`border rounded-xl p-4 shadow-sm transition-all duration-300 flex items-start justify-between gap-3 ${estilo.bg}`}
    >
      <div className="flex items-start gap-3">
        {estilo.icono}
        <div>
          <h4 className="font-semibold text-sm leading-tight">
            {titulo || estilo.tituloDefault}
          </h4>
          <p className="text-sm mt-0.5 opacity-90">{mensaje}</p>
        </div>
      </div>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar notificación"
          className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-black/5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
