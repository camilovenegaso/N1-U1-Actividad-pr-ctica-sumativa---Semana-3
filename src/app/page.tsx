'use client';

import React, { useState, useEffect } from 'react';
import { Paciente, PacienteFormData, NotificacionInfo } from '@/types/paciente';
import { obtenerPacientes, guardarPaciente } from '@/lib/storage';
import { FormularioPaciente } from '@/components/FormularioPaciente';
import { BusquedaPaciente } from '@/components/BusquedaPaciente';
import { ModalConfirmacion } from '@/components/ModalConfirmacion';
import { Notificacion } from '@/components/Notificacion';
import { PantallaCerrada } from '@/components/PantallaCerrada';
import {
  Activity,
  HeartPulse,
  Database,
  ShieldCheck,
  Sparkles,
  ClipboardList
} from 'lucide-react';

const DATOS_INICIALES: PacienteFormData = {
  rut: '',
  nombres: '',
  apellidos: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  email: '',
  fechaNacimiento: '',
  estadoCivil: '',
  comentarios: '',
};

export default function FichaMedicaPage() {
  const [formData, setFormData] = useState<PacienteFormData>(DATOS_INICIALES);
  const [formularioAbierto, setFormularioAbierto] = useState<boolean>(true);
  const [notificacion, setNotificacion] = useState<NotificacionInfo | null>(null);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [storageKeyVersion, setStorageKeyVersion] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Estado para el modal de confirmación de sobrescritura
  const [modalSobrescritura, setModalSobrescritura] = useState<{
    abierto: boolean;
    datosPendientes: PacienteFormData | null;
  }>({
    abierto: false,
    datosPendientes: null,
  });

  // Evitar desajustes de hidratación con SSR
  useEffect(() => {
    setIsMounted(true);
    actualizarConteoPacientes();
  }, []);

  const actualizarConteoPacientes = () => {
    const lista = obtenerPacientes();
    setTotalPacientes(lista.length);
    setStorageKeyVersion(prev => prev + 1);
  };

  const mostrarNotificacion = (
    tipo: NotificacionInfo['tipo'],
    mensaje: string,
    titulo?: string
  ) => {
    setNotificacion({
      id: Date.now().toString(),
      tipo,
      mensaje,
      titulo,
    });
  };

  const handleGuardadoExitoso = (mensaje: string, esActualizacion: boolean) => {
    mostrarNotificacion(
      'success',
      mensaje,
      esActualizacion ? 'Registro Actualizado' : 'Registro Guardado'
    );
    actualizarConteoPacientes();
  };

  const handleSolicitarSobrescritura = (datos: PacienteFormData) => {
    setModalSobrescritura({
      abierto: true,
      datosPendientes: datos,
    });
  };

  const handleConfirmarSobrescritura = () => {
    if (!modalSobrescritura.datosPendientes) return;

    const resultado = guardarPaciente(modalSobrescritura.datosPendientes, true);
    setModalSobrescritura({ abierto: false, datosPendientes: null });

    if (resultado.exito) {
      mostrarNotificacion(
        'success',
        resultado.mensaje,
        'Sobrescritura Confirmada'
      );
      actualizarConteoPacientes();
    } else {
      mostrarNotificacion('error', resultado.mensaje, 'Error al actualizar');
    }
  };

  const handleCancelarSobrescritura = () => {
    setModalSobrescritura({ abierto: false, datosPendientes: null });
    mostrarNotificacion(
      'info',
      'Operación cancelada. El registro existente no fue modificado.',
      'Acción Cancelada'
    );
  };

  const handleLimpiarFormulario = () => {
    setFormData(DATOS_INICIALES);
    mostrarNotificacion(
      'info',
      'El formulario ha sido restablecido a su estado inicial.',
      'Formulario Limpio'
    );
  };

  const handleCerrarFormulario = () => {
    setFormData(DATOS_INICIALES);
    setFormularioAbierto(false);
    mostrarNotificacion(
      'info',
      'La ficha actual ha sido cerrada y guardada de forma segura.',
      'Ficha Cerrada'
    );
  };

  const handleAbrirFormulario = () => {
    setFormularioAbierto(true);
    setFormData(DATOS_INICIALES);
    mostrarNotificacion(
      'info',
      'Formulario habilitado para nuevo registro o edición.',
      'Formulario Abierto'
    );
  };

  const handleSeleccionarPacienteDesdeBusqueda = (paciente: Paciente) => {
    setFormData({
      rut: paciente.rut,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      direccion: paciente.direccion,
      ciudad: paciente.ciudad,
      telefono: paciente.telefono,
      email: paciente.email,
      fechaNacimiento: paciente.fechaNacimiento,
      estadoCivil: paciente.estadoCivil,
      comentarios: paciente.comentarios || '',
    });

    if (!formularioAbierto) {
      setFormularioAbierto(true);
    }

    mostrarNotificacion(
      'info',
      `Ficha del paciente ${paciente.nombres} ${paciente.apellidos} cargada en el formulario para visualización o edición.`,
      'Paciente Cargado'
    );

    // Desplazar suavemente hacia el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-medical-600 font-semibold text-sm">
          <HeartPulse className="w-6 h-6 animate-pulse" />
          <span>Iniciando Sistema de Ficha Médica...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      {/* Barra de Navegación / Header Principal */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-medical-600 to-tealMed-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Ficha Médica
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-medical-50 text-medical-700 border border-medical-200">
                  <Sparkles className="w-3 h-3 text-medical-600" />
                  Testing & Calidad
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistema de Ingreso y Administración de Fichas de Pacientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700 font-medium">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Pacientes en localStorage:</span>
              <strong className="text-medical-700 font-mono text-sm">{totalPacientes}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Validaciones Activas</span>
              <span className="sm:hidden">V&V</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Banner de Notificaciones / Alertas */}
        {notificacion && (
          <div className="max-w-4xl mx-auto">
            <Notificacion
              tipo={notificacion.tipo}
              mensaje={notificacion.mensaje}
              titulo={notificacion.titulo}
              onCerrar={() => setNotificacion(null)}
            />
          </div>
        )}

        {/* Sección Formulario Principal o Pantalla Cerrada */}
        <section aria-label="Sección de Ficha Médica">
          {formularioAbierto ? (
            <FormularioPaciente
              formData={formData}
              onChange={setFormData}
              onLimpiar={handleLimpiarFormulario}
              onCerrar={handleCerrarFormulario}
              onGuardadoExitoso={handleGuardadoExitoso}
              onSolicitarSobrescritura={handleSolicitarSobrescritura}
            />
          ) : (
            <PantallaCerrada
              onAbrirFormulario={handleAbrirFormulario}
              totalPacientes={totalPacientes}
            />
          )}
        </section>

        {/* Sección Búsqueda de Paciente */}
        <section aria-label="Sección de Búsqueda">
          <BusquedaPaciente
            onSeleccionarPaciente={handleSeleccionarPacienteDesdeBusqueda}
            pacienteActualRut={formData.rut}
            actualizadorKey={storageKeyVersion}
          />
        </section>
      </main>

      {/* Modal para Sobrescritura de RUT */}
      <ModalConfirmacion
        abierto={modalSobrescritura.abierto}
        titulo="RUT ya registrado en el sistema"
        mensaje="El RUT ingresado ya pertenece a una ficha médica almacenada previamente. ¿Desea actualizar y sobrescribir el registro con la nueva información?"
        detalleRut={modalSobrescritura.datosPendientes?.rut}
        onConfirmar={handleConfirmarSobrescritura}
        onCancelar={handleCancelarSobrescritura}
      />

      {/* Footer Académico e Informativo */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <ClipboardList className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-950 mb-0.5">
                Aviso de Privacidad y Almacenamiento Local:
              </strong>
              Los datos se almacenan mediante localStorage y, por lo tanto, permanecen únicamente en el navegador y dispositivo donde fueron creados. Esta implementación se utiliza con fines demostrativos y académicos.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <p>
              Taller de Testing y Calidad de Software &bull; Actividad Práctica Sumativa
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-medical-600" />
                Despliegue Estático en GitHub Pages
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
