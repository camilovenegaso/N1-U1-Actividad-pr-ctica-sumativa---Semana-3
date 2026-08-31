# Ficha Médica - Sistema de Gestión de Pacientes

Aplicación web moderna y responsiva desarrollada con **Next.js (App Router)**, **React**, **TypeScript** y **Tailwind CSS**, diseñada para el ingreso, validación, almacenamiento local y búsqueda de fichas médicas en el marco de la actividad práctica de **Taller de Testing y Calidad de Software**.

El proyecto está preparado para ejecutarse completamente del lado cliente y desplegarse de manera gratuita en **GitHub Pages** mediante exportación estática (`output: 'export'`).

---

> ### ⚠️ Advertencia de Almacenamiento Local y Privacidad
> **Los datos se almacenan mediante localStorage y, por lo tanto, permanecen únicamente en el navegador y dispositivo donde fueron creados. Esta implementación se utiliza con fines demostrativos y académicos.**

---

## Tabla de Contenidos
1. [Características y Requisitos Académicos](#características-y-requisitos-académicos)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Validaciones Implementadas](#validaciones-implementadas)
5. [Comportamiento de Botones y Flujos de Trabajo](#comportamiento-de-botones-y-flujos-de-trabajo)
   - [Botón Guardar y Sobrescritura de RUT](#1-botón-guardar-y-sobrescritura-de-rut)
   - [Botón Limpiar](#2-botón-limpiar)
   - [Botón Cerrar y Decisión de Diseño](#3-botón-cerrar-y-decisión-de-diseño)
6. [Módulo de Búsqueda por Apellido](#módulo-de-búsqueda-por-apellido)
7. [Persistencia con localStorage](#persistencia-con-localstorage)
8. [Identificadores para Pruebas (data-testid)](#identificadores-para-pruebas-data-testid)
9. [Instalación y Ejecución Local](#instalación-y-ejecución-local)
10. [Guía de Despliegue en GitHub Pages](#guía-de-despliegue-en-github-pages)
    - [Subir el Repositorio a GitHub](#paso-1-subir-el-repositorio-a-github)
    - [Configuración de GitHub Pages y GitHub Actions](#paso-2-configuración-de-github-pages)
    - [Configuración de basePath para subdirectorios](#paso-3-configuración-de-basepath)

---

## Características y Requisitos Académicos

- ✅ **10 Campos Validados:** RUT, Nombres, Apellidos, Dirección, Ciudad, Teléfono, Email, Fecha de Nacimiento, Estado Civil y Comentarios (con contador de caracteres hasta 500).
- ✅ **Validación Algorítmica de RUT Chileno:** Algoritmo Módulo 11 para comprobación del Dígito Verificador (DV) y auto-formateo.
- ✅ **Detección y Modal de RUT Duplicado:** Advertencia visual accesible antes de sobrescribir una ficha previa.
- ✅ **Búsqueda Flexible:** Búsqueda por apellido insensible a mayúsculas/minúsculas/acentos y con coincidencia parcial.
- ✅ **Carga Rápida de Datos:** Botón para cargar pacientes buscados directamente en el formulario.
- ✅ **Cierre Seguro de Ficha:** Transición a vista de reposo con botón para reabrir el formulario.
- ✅ **100% Exportable a GitHub Pages:** Sin Node.js en servidor, sin API Routes, sin Server Actions y sin errores de hidratación SSR.
- ✅ **Testing Ready:** Selectores `data-testid` normalizados y etiquetas semánticas ARIA en todos los elementos interactivos.

---

## Tecnologías Utilizadas

- **Core:** [Next.js 14](https://nextjs.org/) (App Router, Static HTML Export)
- **Biblioteca UI:** [React 18](https://react.dev/)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Persistencia:** Web Storage API (`localStorage`)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) con workflow automatizado

---

## Estructura del Proyecto

```text
ficha-medica/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Pipeline CI/CD para GitHub Pages
├── public/
│   └── icon.svg                    # Favicon e icono médico
├── src/
│   ├── app/
│   │   ├── globals.css             # Estilos globales y Tailwind base
│   │   ├── layout.tsx              # Layout HTML con metadatos SEO
│   │   └── page.tsx                # Página principal (Dashboard clínico)
│   ├── components/
│   │   ├── BusquedaPaciente.tsx    # Búsqueda por apellido y resultados
│   │   ├── FormularioPaciente.tsx  # Formulario con los 10 campos y validaciones
│   │   ├── ModalConfirmacion.tsx   # Modal de confirmación para sobrescritura
│   │   ├── Notificacion.tsx        # Alertas contextuales y toasts
│   │   └── PantallaCerrada.tsx     # Estado en reposo tras cerrar ficha
│   ├── lib/
│   │   ├── storage.ts              # Capa de datos y persistencia en localStorage
│   │   └── validations.ts          # Reglas de negocio y algoritmo Módulo 11
│   └── types/
│       └── paciente.ts             # Interfaces TypeScript (Paciente, Errores, etc.)
├── .gitignore
├── next.config.mjs                 # Configuración de exportación estática
├── package.json                    # Dependencias y scripts
├── postcss.config.mjs              # Configuración PostCSS
├── tailwind.config.ts              # Paleta médica y tokens de diseño
├── tsconfig.json                   # Configuración estricta de TypeScript
└── README.md                       # Documentación del proyecto
```

---

## Validaciones Implementadas

Todas las validaciones están desacopladas en el módulo `src/lib/validations.ts` para facilitar pruebas unitarias:

| Campo | Regla de Validación | Mensaje / Comportamiento |
| :--- | :--- | :--- |
| **RUT** | Obligatorio. Formato chileno. Algoritmo Módulo 11 (DV). | Informa si está vacío, formato incorrecto o si el DV calculado no coincide. |
| **Nombres** | Obligatorio. Mínimo 2 caracteres. No solo espacios. | "Los nombres deben contener al menos 2 caracteres." |
| **Apellidos** | Obligatorio. Mínimo 2 caracteres. No solo espacios. | "Los apellidos deben contener al menos 2 caracteres." |
| **Dirección** | Obligatoria. Mínimo 5 caracteres. | "La dirección debe contener al menos 5 caracteres." |
| **Ciudad** | Obligatoria. Mínimo 2 caracteres. | "La ciudad es obligatoria." |
| **Teléfono** | Obligatorio. Formato chileno (8 a 12 dígitos). Sin letras. | Valida longitud, prefijo nacional opcional (+56) y prohíbe letras. |
| **Email** | Obligatorio. Formato RFC 5322 (`usuario@dominio.cl`). | "Ingrese un correo electrónico válido (ej: nombre@correo.cl)." |
| **Fecha Nacimiento** | Obligatoria. Fecha válida en el pasado (no futura). | "La fecha de nacimiento no puede ser una fecha futura." |
| **Estado Civil** | Obligatorio. Selección de lista permitida. | "Debe seleccionar un estado civil." |
| **Comentarios** | Opcional. Máximo 500 caracteres. | Contador dinámico visible (`X/500`). Bloquea y avisa si supera 500. |

---

## Comportamiento de Botones y Flujos de Trabajo

### 1. Botón Guardar y Sobrescritura de RUT
- Valida la totalidad del formulario.
- Si hay errores, resalta los campos afectados con mensajes descriptivos y enfoca el primer error.
- Si los datos son válidos, consulta en `localStorage` si el RUT ya existe:
  - **Si no existe:** Se guarda inmediatamente como nuevo paciente con marca de tiempo `creadoEn`.
  - **Si ya existe:** Se abre el **Modal de Confirmación de Sobrescritura** (`data-testid="modal-sobrescribir"`).
    - **"Sí, Sobrescribir":** Actualiza la ficha existente preservando `creadoEn` y añadiendo `actualizadoEn`.
    - **"No, Cancelar":** Cancela la operación sin alterar el registro guardado.

### 2. Botón Limpiar
- Restablece todos los campos a su estado vacío inicial.
- Elimina los mensajes de error visuales.
- **No elimina ni altera los registros previamente almacenados en `localStorage`**.

### 3. Botón Cerrar y Decisión de Diseño
> **Decisión Técnica:** Los navegadores modernos bloquean por seguridad las llamadas directas a `window.close()` en pestañas que no fueron abiertas mediante un script (`window.open`).
>
> Para ofrecer una experiencia consistente y útil, el botón **Cerrar** implementa el *cierre de la ficha clínica actual*:
> 1. Limpia los datos del formulario.
> 2. Oculta el formulario de la vista activa.
> 3. Muestra una **Pantalla de Reposo** (`PantallaCerrada`) que indica que la ficha ha sido protegida y muestra el total de pacientes guardados.
> 4. Dispone del botón **"Abrir Formulario de Ficha Médica"** (`data-testid="btn-abrir-formulario"`) para retomar el trabajo cuando se requiera.

---

## Módulo de Búsqueda por Apellido

Ubicado en la sección inferior de la pantalla:
1. Permite ingresar cualquier apellido o fragmento.
2. Es **insensible a mayúsculas/minúsculas y acentos** (ej: buscar *"perez"* encuentra *"PÉREZ"* o *"Pérez González"*).
3. Si existen coincidencias, presenta una lista con RUT, Nombres, Apellidos, Ciudad, Teléfono, Email y Comentarios.
4. Cada tarjeta cuenta con el botón **"Cargar en formulario"**, que rellena automáticamente los 10 campos para su consulta o edición.
5. Si no existen coincidencias, muestra un aviso claro (`data-testid="msg-sin-resultados"`).
6. Cuenta con el botón **"Limpiar"** para restablecer la búsqueda.

---

## Persistencia con localStorage

- Clave utilizada: `"fichas-medicas"`.
- Estructura JSON almacenada:
```typescript
interface Paciente {
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
```
- La aplicación implementa verificación de entorno de ejecución (`typeof window !== 'undefined'`) y montaje diferido en React para garantizar cero errores de hidratación SSR.

---

## Identificadores para Pruebas (data-testid)

Para facilitar la automatización de pruebas (Playwright, Cypress, Selenium o Jest) y la redacción del informe de aseguramiento de calidad (QA), se incluyen los siguientes atributos:

| Elemento | Selector `data-testid` | Propósito |
| :--- | :--- | :--- |
| **Input RUT** | `data-testid="input-rut"` | Campo de texto del RUT |
| **Input Nombres** | `data-testid="input-nombres"` | Campo de texto de Nombres |
| **Input Apellidos** | `data-testid="input-apellidos"` | Campo de texto de Apellidos |
| **Input Dirección** | `data-testid="input-direccion"` | Campo de texto de Dirección |
| **Input Ciudad** | `data-testid="input-ciudad"` | Campo de texto de Ciudad |
| **Input Teléfono** | `data-testid="input-telefono"` | Campo de texto de Teléfono |
| **Input Email** | `data-testid="input-email"` | Campo de texto de Email |
| **Input Fecha Nac.** | `data-testid="input-fecha-nacimiento"` | Selector de fecha |
| **Select Estado Civil** | `data-testid="select-estado-civil"` | Menú desplegable de Estado Civil |
| **Textarea Comentarios**| `data-testid="textarea-comentarios"` | Área de texto de comentarios |
| **Contador Comentarios**| `data-testid="contador-comentarios"` | Etiqueta `0/500` |
| **Botón Guardar** | `data-testid="btn-guardar"` | Envío y validación del formulario |
| **Botón Limpiar** | `data-testid="btn-limpiar"` | Reseteo del formulario |
| **Botón Cerrar** | `data-testid="btn-cerrar"` | Cierre de la ficha activa |
| **Botón Reabrir Ficha**| `data-testid="btn-abrir-formulario"` | Reapertura desde pantalla de reposo |
| **Input Búsqueda** | `data-testid="input-busqueda-apellido"` | Búsqueda por apellido |
| **Botón Buscar** | `data-testid="btn-buscar"` | Ejecuta la búsqueda |
| **Botón Limpiar Busq.**| `data-testid="btn-limpiar-busqueda"` | Limpia filtro de búsqueda |
| **Lista Resultados** | `data-testid="lista-resultados"` | Contenedor de fichas encontradas |
| **Sin Resultados** | `data-testid="msg-sin-resultados"` | Mensaje cuando no hay coincidencias |
| **Modal Sobrescritura** | `data-testid="modal-sobrescribir"` | Modal de advertencia de RUT |
| **Confirmar Sobresc.** | `data-testid="btn-confirmar-sobrescritura"` | Botón Sí en modal |
| **Cancelar Sobresc.** | `data-testid="btn-cancelar-sobrescritura"` | Botón No en modal |
| **Notificación/Alerta**| `data-testid="mensaje-notificacion"` | Banner informativo/éxito/error |
| **Errores de Campo** | `data-testid="error-[nombreCampo]"` | Mensaje de validación específico |

---

## Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** v18 o superior instalado en el sistema.
- **npm** v9 o superior.

### Pasos

1. **Clonar o descargar el proyecto:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd "N1-U1 Actividad práctica sumativa - Semana 3"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   Abra en su navegador: [http://localhost:3000](http://localhost:3000)

4. **Probar la compilación y exportación estática:**
   ```bash
   npm run build
   ```
   Esto generará la carpeta `out/` con el HTML, JS y CSS listos para producción estática.

---

## Guía de Despliegue en GitHub Pages

El proyecto incluye el workflow `.github/workflows/deploy.yml` que compila y publica automáticamente la aplicación en GitHub Pages al realizar un `push` a la rama `main`.

### Paso 1: Subir el Repositorio a GitHub

Abra una terminal en la carpeta raíz del proyecto y ejecute los siguientes comandos:

```bash
# 1. Inicializar repositorio git local
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: implementacion inicial ficha medica con static export para github pages"

# 4. Establecer la rama principal como 'main'
git branch -M main

# 5. Vincular el repositorio remoto de GitHub (reemplace USUARIO y REPOSITORIO con los suyos)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# 6. Subir los archivos a GitHub
git push -u origin main
```

### Paso 2: Configuración de GitHub Pages

1. Ingrese a su repositorio en GitHub (`https://github.com/TU-USUARIO/TU-REPOSITORIO`).
2. Haga clic en la pestaña **Settings** (Configuración).
3. En el menú lateral izquierdo, seleccione **Pages**.
4. En la sección **Build and deployment**:
   - En **Source**, elija **GitHub Actions**.
5. ¡Listo! El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente y en unos minutos su sitio estará disponible en:
   ```
   https://TU-USUARIO.github.io/TU-REPOSITORIO/
   ```

### Paso 3: Configuración de basePath (si es necesario)

Next.js gestiona automáticamente las rutas relativas en GitHub Pages gracias al paso `actions/configure-pages@v5` incluido en el workflow.

Si desea probar localmente la exportación con un `basePath` específico o modificarlo manualmente, puede definir la variable de entorno antes de compilar:

```bash
# En Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/NOMBRE-REPOSITORIO"; npm run build

# En Linux/macOS
NEXT_PUBLIC_BASE_PATH="/NOMBRE-REPOSITORIO" npm run build
```

O editar directamente la constante `basePath` en [next.config.mjs](file:///next.config.mjs):
```javascript
basePath: '/NOMBRE-REPOSITORIO',
```
