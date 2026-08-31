import { Paciente, PacienteFormData } from '@/types/paciente';
import { limpiarRut, formatearRut } from './validations';

const STORAGE_KEY = 'fichas-medicas';

/**
 * Verifica de forma segura si localStorage está disponible en el entorno actual.
 */
function estaEnNavegador(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Obtiene todos los pacientes almacenados en localStorage.
 */
export function obtenerPacientes(): Paciente[] {
  if (!estaEnNavegador()) return [];

  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al leer datos desde localStorage:', error);
    return [];
  }
}

/**
 * Guarda la lista completa de pacientes en localStorage.
 */
export function guardarTodosLosPacientes(pacientes: Paciente[]): boolean {
  if (!estaEnNavegador()) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes));
    return true;
  } catch (error) {
    console.error('Error al guardar datos en localStorage:', error);
    return false;
  }
}

/**
 * Busca un paciente por su RUT.
 */
export function obtenerPacientePorRut(rut: string): Paciente | null {
  const rutLimpio = limpiarRut(rut);
  const pacientes = obtenerPacientes();
  const encontrado = pacientes.find(p => limpiarRut(p.rut) === rutLimpio);
  return encontrado || null;
}

/**
 * Guarda o actualiza un paciente en localStorage.
 * Si ya existe y no se autorizó la sobrescritura, retorna que requiere confirmación.
 */
export function guardarPaciente(
  datos: PacienteFormData,
  permitirSobrescritura: boolean = false
): {
  exito: boolean;
  requiereConfirmacion?: boolean;
  esActualizacion?: boolean;
  mensaje: string;
  pacienteGuardado?: Paciente;
} {
  if (!estaEnNavegador()) {
    return {
      exito: false,
      mensaje: 'El almacenamiento no está disponible en este entorno.',
    };
  }

  const pacientes = obtenerPacientes();
  const rutLimpio = limpiarRut(datos.rut);
  const indiceExistente = pacientes.findIndex(p => limpiarRut(p.rut) === rutLimpio);
  const ahora = new Date().toISOString();

  // Si ya existe y no se ha confirmado la sobrescritura
  if (indiceExistente !== -1 && !permitirSobrescritura) {
    return {
      exito: false,
      requiereConfirmacion: true,
      mensaje: `Ya existe un paciente registrado con el RUT ${formatearRut(datos.rut)}. ¿Desea sobrescribir la ficha?`,
    };
  }

  if (indiceExistente !== -1 && permitirSobrescritura) {
    // Actualizar registro existente
    const pacienteActualizado: Paciente = {
      ...datos,
      rut: formatearRut(datos.rut),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      direccion: datos.direccion.trim(),
      ciudad: datos.ciudad.trim(),
      telefono: datos.telefono.trim(),
      email: datos.email.trim(),
      fechaNacimiento: datos.fechaNacimiento,
      estadoCivil: datos.estadoCivil,
      comentarios: datos.comentarios ? datos.comentarios.trim() : '',
      creadoEn: pacientes[indiceExistente].creadoEn,
      actualizadoEn: ahora,
    };

    pacientes[indiceExistente] = pacienteActualizado;
    guardarTodosLosPacientes(pacientes);

    return {
      exito: true,
      esActualizacion: true,
      mensaje: `Ficha médica del paciente ${pacienteActualizado.nombres} ${pacienteActualizado.apellidos} actualizada correctamente.`,
      pacienteGuardado: pacienteActualizado,
    };
  }

  // Crear nuevo registro
  const nuevoPaciente: Paciente = {
    ...datos,
    rut: formatearRut(datos.rut),
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    direccion: datos.direccion.trim(),
    ciudad: datos.ciudad.trim(),
    telefono: datos.telefono.trim(),
    email: datos.email.trim(),
    fechaNacimiento: datos.fechaNacimiento,
    estadoCivil: datos.estadoCivil,
    comentarios: datos.comentarios ? datos.comentarios.trim() : '',
    creadoEn: ahora,
  };

  pacientes.push(nuevoPaciente);
  guardarTodosLosPacientes(pacientes);

  return {
    exito: true,
    esActualizacion: false,
    mensaje: `Ficha médica del paciente ${nuevoPaciente.nombres} ${nuevoPaciente.apellidos} guardada exitosamente.`,
    pacienteGuardado: nuevoPaciente,
  };
}

/**
 * Normaliza cadenas de texto para búsquedas insensibles a mayúsculas y acentos.
 */
function normalizarTexto(texto: string): string {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Busca pacientes cuyo apellido coincida total o parcialmente con el término ingresado.
 * Es insensible a mayúsculas, minúsculas y tildes.
 */
export function buscarPacientesPorApellido(termino: string): Paciente[] {
  const pacientes = obtenerPacientes();
  const query = normalizarTexto(termino);

  if (!query) {
    return [];
  }

  return pacientes.filter(paciente => {
    const apellidoNormalizado = normalizarTexto(paciente.apellidos);
    return apellidoNormalizado.includes(query);
  });
}
