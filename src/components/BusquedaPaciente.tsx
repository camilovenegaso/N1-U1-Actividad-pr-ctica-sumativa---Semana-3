'use client';

import React, { useState } from 'react';
import { Paciente } from '@/types/paciente';
import { buscarPacientesPorApellido } from '@/lib/storage';
import {
  Search,
  RotateCcw,
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileCheck2,
  Users
} from 'lucide-react';

interface BusquedaPacienteProps {
  onSeleccionarPaciente: (paciente: Paciente) => void;
  pacienteActualRut?: string;
  actualizadorKey: number; // Para refrescar resultados si cambia el storage
}

export const BusquedaPaciente: React.FC<BusquedaPacienteProps> = ({
  onSeleccionarPaciente,
  pacienteActualRut,
  actualizadorKey,
}) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState<Paciente[] | null>(null);
  const [haBuscado, setHaBuscado] = useState(false);

  const ejecutarBusqueda = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!terminoBusqueda.trim()) {
      setResultados([]);
      setHaBuscado(true);
      return;
    }

    const encontrados = buscarPacientesPorApellido(terminoBusqueda);
    setResultados(encontrados);
    setHaBuscado(true);
  };

  const handleLimpiarBusqueda = () => {
    setTerminoBusqueda('');
    setResultados(null);
    setHaBuscado(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
      {/* Header de la sección de búsqueda */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Módulo de Consulta
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Buscar paciente por apellido
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Formulario / Barra de Búsqueda */}
        <form onSubmit={ejecutarBusqueda} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="input-busqueda-apellido"
              data-testid="input-busqueda-apellido"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Ingrese apellido o coincidencia parcial (ej. González, Pérez, Silva...)"
              className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-2 focus:ring-medical-500/20 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              data-testid="btn-buscar"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700 active:scale-98"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>

            <button
              type="button"
              data-testid="btn-limpiar-busqueda"
              onClick={handleLimpiarBusqueda}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Limpiar
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500">
          * La búsqueda no distingue entre mayúsculas, minúsculas ni tildes, y admite coincidencias parciales.
        </p>

        {/* Resultados de Búsqueda */}
        {haBuscado && resultados !== null && (
          <div className="space-y-4 pt-2">
            {resultados.length === 0 ? (
              <div
                data-testid="msg-sin-resultados"
                className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  No se encontraron pacientes
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No existen registros en el sistema que coincidan con el apellido ingresado (&ldquo;{terminoBusqueda}&rdquo;).
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-medical-600" />
                    Resultados encontrados ({resultados.length})
                  </span>
                  <span className="text-xs text-slate-400">
                    Haga clic en &ldquo;Cargar en formulario&rdquo; para ver y editar la ficha.
                  </span>
                </div>

                <div
                  data-testid="lista-resultados"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {resultados.map((paciente) => {
                    const estaSeleccionado = pacienteActualRut === paciente.rut;

                    return (
                      <div
                        key={paciente.rut}
                        className={`rounded-2xl border p-5 transition-all flex flex-col justify-between gap-4 ${
                          estaSeleccionado
                            ? 'bg-medical-50/50 border-medical-400 ring-2 ring-medical-500/20 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-base text-slate-900 leading-snug">
                                {paciente.nombres} {paciente.apellidos}
                              </h3>
                              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                RUT: {paciente.rut}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              {paciente.estadoCivil}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{paciente.direccion}, {paciente.ciudad}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{paciente.telefono}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{paciente.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Nacimiento: {paciente.fechaNacimiento}</span>
                            </div>
                          </div>

                          {paciente.comentarios && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                              &ldquo;{paciente.comentarios}&rdquo;
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {paciente.actualizadoEn ? 'Actualizado recientemente' : 'Registro original'}
                          </span>

                          <button
                            type="button"
                            data-testid={`btn-seleccionar-${paciente.rut.replace(/[^0-9kK]/g, '')}`}
                            onClick={() => onSeleccionarPaciente(paciente)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              estaSeleccionado
                                ? 'bg-medical-700 text-white shadow-sm'
                                : 'bg-medical-50 text-medical-700 hover:bg-medical-100 border border-medical-200'
                            }`}
                          >
                            {estaSeleccionado ? (
                              <>
                                <FileCheck2 className="w-3.5 h-3.5" />
                                En Formulario
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Cargar en formulario
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
