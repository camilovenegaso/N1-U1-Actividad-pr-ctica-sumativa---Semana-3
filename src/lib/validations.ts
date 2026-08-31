import { PacienteFormData, FormErrors, ESTADOS_CIVILES } from '@/types/paciente';

/**
 * Limpia un RUT eliminando puntos, guiones y espacios en blanco.
 */
export function limpiarRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Formatea un RUT al formato estándar chileno XX.XXX.XXX-X
 */
export function formatearRut(rut: string): string {
  const limpio = limpiarRut(rut);
  if (limpio.length <= 1) return limpio;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  // Formatear cuerpo con puntos
  let cuerpoFormateado = '';
  let contador = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
    if (contador % 3 === 0 && i !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
  }

  return `${cuerpoFormateado}-${dv}`;
}

/**
 * Valida un RUT chileno usando el algoritmo Módulo 11 para el Dígito Verificador.
 */
export function validarRut(rut: string): { valido: boolean; mensaje?: string } {
  if (!rut || !rut.trim()) {
    return { valido: false, mensaje: 'El RUT es obligatorio.' };
  }

  const limpio = limpiarRut(rut);

  if (limpio.length < 8 || limpio.length > 9) {
    return { valido: false, mensaje: 'El RUT debe tener entre 7 y 8 dígitos más el dígito verificador.' };
  }

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();

  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(cuerpo)) {
    return { valido: false, mensaje: 'El cuerpo del RUT solo debe contener números.' };
  }

  // Algoritmo Módulo 11
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = suma % 11;
  const dvEsperadoCalculado = 11 - resto;

  let dvEsperado = '';
  if (dvEsperadoCalculado === 11) {
    dvEsperado = '0';
  } else if (dvEsperadoCalculado === 10) {
    dvEsperado = 'K';
  } else {
    dvEsperado = dvEsperadoCalculado.toString();
  }

  if (dv !== dvEsperado) {
    return { valido: false, mensaje: `RUT inválido. El dígito verificador ingresado no coincide (esperado: ${dvEsperado}).` };
  }

  return { valido: true };
}

/**
 * Valida nombres (mínimo 2 caracteres, no solo espacios).
 */
export function validarNombres(nombres: string): { valido: boolean; mensaje?: string } {
  if (!nombres || !nombres.trim()) {
    return { valido: false, mensaje: 'El campo Nombres es obligatorio.' };
  }
  if (nombres.trim().length < 2) {
    return { valido: false, mensaje: 'Los nombres deben contener al menos 2 caracteres.' };
  }
  return { valido: true };
}

/**
 * Valida apellidos (mínimo 2 caracteres, no solo espacios).
 */
export function validarApellidos(apellidos: string): { valido: boolean; mensaje?: string } {
  if (!apellidos || !apellidos.trim()) {
    return { valido: false, mensaje: 'El campo Apellidos es obligatorio.' };
  }
  if (apellidos.trim().length < 2) {
    return { valido: false, mensaje: 'Los apellidos deben contener al menos 2 caracteres.' };
  }
  return { valido: true };
}

/**
 * Valida dirección (mínimo 5 caracteres).
 */
export function validarDireccion(direccion: string): { valido: boolean; mensaje?: string } {
  if (!direccion || !direccion.trim()) {
    return { valido: false, mensaje: 'La dirección es obligatoria.' };
  }
  if (direccion.trim().length < 5) {
    return { valido: false, mensaje: 'La dirección debe contener al menos 5 caracteres.' };
  }
  return { valido: true };
}

/**
 * Valida ciudad (obligatoria, mínimo 2 caracteres).
 */
export function validarCiudad(ciudad: string): { valido: boolean; mensaje?: string } {
  if (!ciudad || !ciudad.trim()) {
    return { valido: false, mensaje: 'La ciudad es obligatoria.' };
  }
  if (ciudad.trim().length < 2) {
    return { valido: false, mensaje: 'La ciudad debe contener al menos 2 caracteres.' };
  }
  return { valido: true };
}

/**
 * Valida teléfono para Chile (números, prefijo opcional +56, 8 a 12 dígitos, sin letras).
 */
export function validarTelefono(telefono: string): { valido: boolean; mensaje?: string } {
  if (!telefono || !telefono.trim()) {
    return { valido: false, mensaje: 'El teléfono es obligatorio.' };
  }

  // Verificar si contiene letras
  if (/[a-zA-Z]/.test(telefono)) {
    return { valido: false, mensaje: 'El teléfono no puede contener letras.' };
  }

  // Limpiar caracteres permitidos para contar dígitos
  const soloNumeros = telefono.replace(/[^0-9]/g, '');

  // Formatos comunes en Chile: 9 dígitos (912345678), o con código país (56912345678, 11 dígitos), fijos (221234567, 9 dígitos)
  if (soloNumeros.length < 8 || soloNumeros.length > 12) {
    return { valido: false, mensaje: 'Ingrese un número telefónico válido (entre 8 y 12 dígitos).' };
  }

  // Validar formato general razonable
  const regexTelefono = /^(\+?56)?\s?(\d{1,2})?\s?\d{4}\s?\d{4}$|^\d{8,12}$/;
  if (!regexTelefono.test(telefono.trim().replace(/\s+/g, ''))) {
    return { valido: false, mensaje: 'Formato telefónico inválido (ej: +56 9 1234 5678 o 912345678).' };
  }

  return { valido: true };
}

/**
 * Valida formato estándar de Email.
 */
export function validarEmail(email: string): { valido: boolean; mensaje?: string } {
  if (!email || !email.trim()) {
    return { valido: false, mensaje: 'El correo electrónico es obligatorio.' };
  }

  const emailLimpio = email.trim();
  // Regex estándar RFC 5322 compatible para validación de email
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regexEmail.test(emailLimpio)) {
    return { valido: false, mensaje: 'Ingrese un correo electrónico válido (ej: nombre@correo.cl).' };
  }

  return { valido: true };
}

/**
 * Valida fecha de nacimiento (obligatoria, válida y no futura).
 */
export function validarFechaNacimiento(fecha: string): { valido: boolean; mensaje?: string } {
  if (!fecha || !fecha.trim()) {
    return { valido: false, mensaje: 'La fecha de nacimiento es obligatoria.' };
  }

  const parsedDate = new Date(fecha + 'T00:00:00');
  if (isNaN(parsedDate.getTime())) {
    return { valido: false, mensaje: 'Ingrese una fecha válida.' };
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (parsedDate > hoy) {
    return { valido: false, mensaje: 'La fecha de nacimiento no puede ser una fecha futura.' };
  }

  // Opcional: verificar año razonable (mayor a 1900)
  if (parsedDate.getFullYear() < 1900) {
    return { valido: false, mensaje: 'El año de nacimiento debe ser mayor a 1900.' };
  }

  return { valido: true };
}

/**
 * Valida estado civil (debe ser una opción válida).
 */
export function validarEstadoCivil(estadoCivil: string): { valido: boolean; mensaje?: string } {
  if (!estadoCivil || !estadoCivil.trim()) {
    return { valido: false, mensaje: 'Debe seleccionar un estado civil.' };
  }

  if (!ESTADOS_CIVILES.includes(estadoCivil as any)) {
    return { valido: false, mensaje: 'Seleccione una opción válida de estado civil.' };
  }

  return { valido: true };
}

/**
 * Valida comentarios (opcional, máximo 500 caracteres).
 */
export function validarComentarios(comentarios: string): { valido: boolean; mensaje?: string } {
  if (comentarios && comentarios.length > 500) {
    return { valido: false, mensaje: 'Los comentarios no pueden superar los 500 caracteres.' };
  }
  return { valido: true };
}

/**
 * Valida todo el formulario de paciente.
 */
export function validarFormularioPaciente(data: PacienteFormData): {
  esValido: boolean;
  errores: FormErrors;
} {
  const errores: FormErrors = {};

  const vRut = validarRut(data.rut);
  if (!vRut.valido) errores.rut = vRut.mensaje;

  const vNombres = validarNombres(data.nombres);
  if (!vNombres.valido) errores.nombres = vNombres.mensaje;

  const vApellidos = validarApellidos(data.apellidos);
  if (!vApellidos.valido) errores.apellidos = vApellidos.mensaje;

  const vDireccion = validarDireccion(data.direccion);
  if (!vDireccion.valido) errores.direccion = vDireccion.mensaje;

  const vCiudad = validarCiudad(data.ciudad);
  if (!vCiudad.valido) errores.ciudad = vCiudad.mensaje;

  const vTelefono = validarTelefono(data.telefono);
  if (!vTelefono.valido) errores.telefono = vTelefono.mensaje;

  const vEmail = validarEmail(data.email);
  if (!vEmail.valido) errores.email = vEmail.mensaje;

  const vFecha = validarFechaNacimiento(data.fechaNacimiento);
  if (!vFecha.valido) errores.fechaNacimiento = vFecha.mensaje;

  const vEstadoCivil = validarEstadoCivil(data.estadoCivil);
  if (!vEstadoCivil.valido) errores.estadoCivil = vEstadoCivil.mensaje;

  const vComentarios = validarComentarios(data.comentarios);
  if (!vComentarios.valido) errores.comentarios = vComentarios.mensaje;

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
}
