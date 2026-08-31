'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  detalleRut?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  abierto,
  titulo,
  mensaje,
  detalleRut,
  onConfirmar,
  onCancelar,
}) => {
  useEffect(() => {
    const manejarKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        onCancelar();
      }
    };
    window.addEventListener('keydown', manejarKeyDown);
    return () => window.removeEventListener('keydown', manejarKeyDown);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      data-testid="modal-sobrescribir"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 transform transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 id="modal-titulo" className="text-lg font-bold text-slate-900">
            {titulo}
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {mensaje}
          </p>

          {detalleRut && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800">
              <span className="text-slate-500 font-sans">RUT identificado:</span> <strong>{detalleRut}</strong>
            </div>
          )}

          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 leading-normal">
            Si confirma, los datos personales, de contacto y médicos anteriores de este RUT serán actualizados con la información ingresada.
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            data-testid="btn-cancelar-sobrescritura"
            onClick={onCancelar}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            No, Cancelar
          </button>
          <button
            type="button"
            data-testid="btn-confirmar-sobrescritura"
            onClick={onConfirmar}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 text-white font-medium text-sm hover:bg-amber-700 transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <RefreshCw className="w-4 h-4" />
            Sí, Sobrescribir
          </button>
        </div>
      </div>
    </div>
  );
};
