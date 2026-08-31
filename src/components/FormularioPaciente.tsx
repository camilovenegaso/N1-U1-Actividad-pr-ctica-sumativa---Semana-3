'use client';

import React, { useState } from 'react';
import { PacienteFormData, FormErrors, ESTADOS_CIVILES } from '@/types/paciente';
import { validarFormularioPaciente, formatearRut } from '@/lib/validations';
import { guardarPaciente } from '@/lib/storage';
import {
  Save,
  RotateCcw,
  XCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Heart,
  MessageSquare,
  CreditCard,
  Building2,
  AlertCircle
} from 'lucide-react';

interface FormularioPacienteProps {
  formData: PacienteFormData;
  onChange: (data: PacienteFormData) => void;
  onLimpiar: () => void;
  onCerrar: () => void;
  onGuardadoExitoso: (mensaje: string, esActualizacion: boolean) => void;
  onSolicitarSobrescritura: (datos: PacienteFormData) => void;
}

export const FormularioPaciente: React.FC<FormularioPacienteProps> = ({
  formData,
  onChange,
  onLimpiar,
  onCerrar,
  onGuardadoExitoso,
  onSolicitarSobrescritura,
}) => {
  const [errores, setErrores] = useState<FormErrors>({});
  const [haIntentadoGuardar, setHaIntentadoGuardar] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let nuevoValor = value;

    if (name === 'rut') {
      // Formatear RUT automáticamente mientras escribe si tiene longitud suficiente
      nuevoValor = value;
    }

    const nuevosDatos = {
      ...formData,
      [name]: nuevoValor,
    };

    onChange(nuevosDatos);

    // Si ya intentó guardar previamente, validar reactivamente el campo modificado
    if (haIntentadoGuardar) {
      const validacion = validarFormularioPaciente(nuevosDatos);
      setErrores(validacion.errores);
    }
  };

  const handleRutBlur = () => {
    if (formData.rut && formData.rut.trim()) {
      const rutFormateado = formatearRut(formData.rut);
      onChange({
        ...formData,
        rut: rutFormateado,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHaIntentadoGuardar(true);

    const validacion = validarFormularioPaciente(formData);

    if (!validacion.esValido) {
      setErrores(validacion.errores);
      // Foco en el primer campo con error
      const primerErrorKey = Object.keys(validacion.errores)[0];
      const elemento = document.getElementById(`input-${primerErrorKey}`) || document.getElementById(`select-${primerErrorKey}`) || document.getElementById(`textarea-${primerErrorKey}`);
      if (elemento) elemento.focus();
      return;
    }

    setErrores({});

    // Intentar guardar en localStorage
    const resultado = guardarPaciente(formData, false);

    if (resultado.requiereConfirmacion) {
      // Abrir modal de sobrescritura
      onSolicitarSobrescritura(formData);
      return;
    }

    if (resultado.exito) {
      onGuardadoExitoso(resultado.mensaje, resultado.esActualizacion || false);
      setHaIntentadoGuardar(false);
    }
  };

  const handleLimpiarFormulario = () => {
    setErrores({});
    setHaIntentadoGuardar(false);
    onLimpiar();
  };

  const handleCerrarFormulario = () => {
    handleLimpiarFormulario();
    onCerrar();
  };

  const maxComentarios = 500;
  const longitudComentarios = (formData.comentarios || '').length;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden transition-all">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-medical-700 via-medical-600 to-medical-800 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-medical-200 font-semibold">
                Gestión Clínica
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Datos del paciente
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-medical-100 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Campos con asterisco (*) son obligatorios
          </div>
        </div>
      </div>

      {/* Cuerpo del Formulario */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. RUT */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-rut"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              RUT del Paciente <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="input-rut"
                name="rut"
                data-testid="input-rut"
                value={formData.rut}
                onChange={handleInputChange}
                onBlur={handleRutBlur}
                placeholder="12.345.678-5 o 12345678-K"
                aria-invalid={!!errores.rut}
                aria-describedby={errores.rut ? "error-rut" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.rut
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.rut && (
              <p
                id="error-rut"
                data-testid="error-rut"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.rut}
              </p>
            )}
          </div>

          {/* 2. Nombres */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-nombres"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Nombres <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="input-nombres"
                name="nombres"
                data-testid="input-nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                placeholder="Ej. Juan Andrés"
                aria-invalid={!!errores.nombres}
                aria-describedby={errores.nombres ? "error-nombres" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.nombres
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.nombres && (
              <p
                id="error-nombres"
                data-testid="error-nombres"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.nombres}
              </p>
            )}
          </div>

          {/* 3. Apellidos */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-apellidos"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Apellidos <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="input-apellidos"
                name="apellidos"
                data-testid="input-apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="Ej. Pérez González"
                aria-invalid={!!errores.apellidos}
                aria-describedby={errores.apellidos ? "error-apellidos" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.apellidos
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.apellidos && (
              <p
                id="error-apellidos"
                data-testid="error-apellidos"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.apellidos}
              </p>
            )}
          </div>

          {/* 4. Dirección */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-direccion"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Dirección <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="input-direccion"
                name="direccion"
                data-testid="input-direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ej. Av. Providencia 1234, Depto 501"
                aria-invalid={!!errores.direccion}
                aria-describedby={errores.direccion ? "error-direccion" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.direccion
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.direccion && (
              <p
                id="error-direccion"
                data-testid="error-direccion"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.direccion}
              </p>
            )}
          </div>

          {/* 5. Ciudad */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-ciudad"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Ciudad <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="input-ciudad"
                name="ciudad"
                data-testid="input-ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                placeholder="Ej. Santiago, Concepción, etc."
                aria-invalid={!!errores.ciudad}
                aria-describedby={errores.ciudad ? "error-ciudad" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.ciudad
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.ciudad && (
              <p
                id="error-ciudad"
                data-testid="error-ciudad"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.ciudad}
              </p>
            )}
          </div>

          {/* 6. Teléfono */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-telefono"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Teléfono <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                id="input-telefono"
                name="telefono"
                data-testid="input-telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="+56 9 1234 5678 o 912345678"
                aria-invalid={!!errores.telefono}
                aria-describedby={errores.telefono ? "error-telefono" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.telefono
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.telefono && (
              <p
                id="error-telefono"
                data-testid="error-telefono"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.telefono}
              </p>
            )}
          </div>

          {/* 7. Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Correo Electrónico <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="input-email"
                name="email"
                data-testid="input-email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="paciente@correo.cl"
                aria-invalid={!!errores.email}
                aria-describedby={errores.email ? "error-email" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.email
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.email && (
              <p
                id="error-email"
                data-testid="error-email"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.email}
              </p>
            )}
          </div>

          {/* 8. Fecha de Nacimiento */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-fecha-nacimiento"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Fecha de Nacimiento <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                id="input-fecha-nacimiento"
                name="fechaNacimiento"
                data-testid="input-fecha-nacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                aria-invalid={!!errores.fechaNacimiento}
                aria-describedby={errores.fechaNacimiento ? "error-fecha-nacimiento" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.fechaNacimiento
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              />
            </div>
            {errores.fechaNacimiento && (
              <p
                id="error-fecha-nacimiento"
                data-testid="error-fecha-nacimiento"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.fechaNacimiento}
              </p>
            )}
          </div>

          {/* 9. Estado Civil */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-estado-civil"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Estado Civil <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Heart className="w-4 h-4" />
              </div>
              <select
                id="select-estado-civil"
                name="estadoCivil"
                data-testid="select-estado-civil"
                value={formData.estadoCivil}
                onChange={handleInputChange}
                aria-invalid={!!errores.estadoCivil}
                aria-describedby={errores.estadoCivil ? "error-estado-civil" : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                  errores.estadoCivil
                    ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                    : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
                }`}
              >
                <option value="">-- Seleccione estado civil --</option>
                {ESTADOS_CIVILES.map(opcion => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
            {errores.estadoCivil && (
              <p
                id="error-estado-civil"
                data-testid="error-estado-civil"
                role="alert"
                className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errores.estadoCivil}
              </p>
            )}
          </div>

        </div>

        {/* 10. Comentarios */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="textarea-comentarios"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Comentarios y Observaciones Clínicas <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <span
              data-testid="contador-comentarios"
              className={`text-xs font-mono font-medium ${
                longitudComentarios > maxComentarios ? 'text-rose-600' : 'text-slate-500'
              }`}
            >
              {longitudComentarios}/{maxComentarios}
            </span>
          </div>
          <div className="relative rounded-xl shadow-sm">
            <textarea
              id="textarea-comentarios"
              name="comentarios"
              data-testid="textarea-comentarios"
              rows={3}
              maxLength={maxComentarios}
              value={formData.comentarios}
              onChange={handleInputChange}
              placeholder="Antecedentes médicos, alergias, observaciones relevantes o motivos de consulta..."
              aria-invalid={!!errores.comentarios}
              aria-describedby={errores.comentarios ? "error-comentarios" : undefined}
              className={`block w-full p-3 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 resize-y ${
                errores.comentarios
                  ? 'border-rose-400 text-rose-900 bg-rose-50/40 focus:ring-rose-500/30'
                  : 'border-slate-300 text-slate-900 bg-white focus:border-medical-500 focus:ring-medical-500/20'
              }`}
            />
          </div>
          {errores.comentarios && (
            <p
              id="error-comentarios"
              data-testid="error-comentarios"
              role="alert"
              className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errores.comentarios}
            </p>
          )}
        </div>

        {/* Barra de Botones Obligatorios: Guardar, Limpiar, Cerrar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            Verifique la información antes de guardar la ficha médica.
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {/* Botón LIMPIAR */}
            <button
              type="button"
              data-testid="btn-limpiar"
              onClick={handleLimpiarFormulario}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Limpiar
            </button>

            {/* Botón CERRAR */}
            <button
              type="button"
              data-testid="btn-cerrar"
              onClick={handleCerrarFormulario}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/60 hover:bg-rose-100 font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 active:scale-98"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              Cerrar
            </button>

            {/* Botón GUARDAR */}
            <button
              type="submit"
              data-testid="btn-guardar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-sm transition-all shadow-md shadow-medical-500/20 hover:shadow-lg hover:shadow-medical-500/30 focus:outline-none focus:ring-2 focus:ring-medical-500 active:scale-98"
            >
              <Save className="w-4 h-4" />
              Guardar Ficha
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
