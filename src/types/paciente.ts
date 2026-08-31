export interface Paciente {
  rut: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  estadoCivil: string;
  comentarios: string;
  creadoEn: string;
  actualizadoEn?: string;
}

export type PacienteFormData = Omit<Paciente, 'creadoEn' | 'actualizadoEn'>;

export type FormErrors = Partial<Record<keyof PacienteFormData, string>>;

export const ESTADOS_CIVILES = [
  'Soltero/a',
  'Casado/a',
  'Divorciado/a',
  'Viudo/a',
  'Otro'
] as const;

export type EstadoCivil = typeof ESTADOS_CIVILES[number];

export type TipoNotificacion = 'success' | 'info' | 'warning' | 'error';

export interface NotificacionInfo {
  id: string;
  tipo: TipoNotificacion;
  mensaje: string;
  titulo?: string;
}
