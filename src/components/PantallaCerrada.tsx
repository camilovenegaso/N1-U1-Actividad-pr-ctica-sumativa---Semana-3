'use client';

import React from 'react';
import { FileText, PlusCircle, CheckCircle } from 'lucide-react';

interface PantallaCerradaProps {
  onAbrirFormulario: () => void;
  totalPacientes: number;
}

export const PantallaCerrada: React.FC<PantallaCerradaProps> = ({
  onAbrirFormulario,
  totalPacientes,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 animate-fadeIn">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-medical-50 border border-medical-100 flex items-center justify-center text-medical-600 mb-6 shadow-inner">
        <FileText className="w-10 h-10" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
        <CheckCircle className="w-3.5 h-3.5" />
        Ficha cerrada de forma segura
      </span>

      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Formulario de Ficha Médica en Reposo
      </h2>

      <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
        La ficha médica activa ha sido cerrada y los datos locales se encuentran protegidos.
        Actualmente hay <strong className="text-slate-800">{totalPacientes}</strong> {totalPacientes === 1 ? 'paciente registrado' : 'pacientes registrados'} en la memoria local del navegador.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          data-testid="btn-abrir-formulario"
          onClick={onAbrirFormulario}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-sm sm:text-base transition-all shadow-md shadow-medical-500/25 hover:shadow-lg hover:shadow-medical-500/35 active:scale-98"
        >
          <PlusCircle className="w-5 h-5" />
          Abrir Formulario de Ficha Médica
        </button>
      </div>
    </div>
  );
};
