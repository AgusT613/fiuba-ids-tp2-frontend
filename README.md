# IntroDex 🔴⚪

> **Proyecto Integrador Académico**  
> Materia: **Introducción al Desarrollo de Software**  
> **Facultad de Ingeniería (FIUBA)** — **Universidad de Buenos Aires (UBA)**

IntroDex es una aplicación web moderna e interactiva para explorar la Pokédex, consultar movimientos en profundidad y gestionar alineaciones tácticas competitivas con validaciones en tiempo real.

---

## 🌟 Características Principales

### 🔴 Explorador de Pokémon (`/pokemones`)

- **Búsqueda y Filtros**: Búsqueda por nombre parcial y filtrado por tipo elemental (Fuego, Agua, Planta, Eléctrico, etc.).
- **Vistas Flexibles**: Selector de visualización entre **Cuadrícula de Tarjetas** y **Tabla Comparativa**.
- **Paginación Semántica**: Navegación fluida y accesible con URLs sincronizadas y soporte completo para historial y enlaces directos.
- **Detalle de Pokémon (`/pokemones/[id]`)**:
  - Medidores visuales de estadísticas base (PS, Ataque, Defensa, Atq. Especial, Def. Especial, Velocidad).
  - Cadena evolutiva con navegación directa entre especies.
  - Movimientos organizados por método de aprendizaje: Nivel, Máquina (MT/MO) y Huevo.

### ⚡ Compendio de Movimientos (`/movimientos`)

- Catálogo completo con categorización oficial: **Físico** (naranja), **Especial** (índigo) y **Estado** (gris).
- Métricas de combate: Potencia, Precisión, Puntos de Poder (PP) y descripción de efectos secundarios.
- Filtro por tipo elemental y búsqueda textual en servidor y cliente.
- Vista de detalle individual (`/movimientos/[id]`).

### 🛡️ Gestor de Equipos Competitivos (`/equipos`)

- Creación, listado y edición de equipos con regla generacional máxima (Generaciones I a IX).
- **Roster Táctico (`/equipos/[id]`)**:
  - Indicador visual de 6 slots con estado de Pokéball (vacante o asignado).
  - Hasta **6 integrantes por equipo** con personalización de apodo.
  - Hasta **4 movimientos por integrante** con validación de duplicados y límites reglamentarios.
  - Autocompletado interactivo con [`Typeahead`](src/lib/components/Typeahead.svelte) para especies y movimientos.
  - Desvinculación de movimientos y eliminación de integrantes con confirmación segura.

### 🎨 Experiencia de Usuario & Resiliencia

- **Barra de Navegación Glassmorphism**: Cabecera fija con fondo translúcido (`backdrop-blur-md`), buscador rápido con atajo de teclado, detección inteligente de ruta activa e íconos vectoriales SVG.
- **Feedback de Carga & Notificaciones**: Barra superior de progreso durante la navegación y toasts flotantes para confirmaciones.
- **Pantalla de Respaldo (`+error.svelte`)**: Manejo elegante de desconexión en caso de servidor backend inactivo con opción de reintento.

---

## 🛠️ Stack Tecnológico

| Componente             | Tecnología                                                                            | Versión        |
| ---------------------- | ------------------------------------------------------------------------------------- | -------------- |
| **Frontend Framework** | [Svelte](https://svelte.dev/) (Runes Mode: `$state`, `$derived`, `$props`, `$effect`) | `v5.59+`       |
| **Meta-Framework**     | [SvelteKit](https://kit.svelte.dev/)                                                  | `v3.4+`        |
| **Bundler / Servidor** | [Vite](https://vite.dev/)                                                             | `v8.3+`        |
| **Estilos**            | [Tailwind CSS](https://tailwindcss.com/) con `@tailwindcss/vite`                      | `v4.3+`        |
| **Tipografía**         | [Inter Font](https://fontsource.org/fonts/inter) vía Fontsource                       | `v5.3+`        |
| **Backend API**        | [FastAPI](https://fastapi.tiangolo.com/) en Python + SQLite                           | REST API       |
| **Linter / Formatter** | ESLint + Prettier con plugins oficiales de Svelte y Tailwind                          | `v10+` / `v3+` |

---

## 🚀 Requisitos Previos

- **Node.js**: `v20.0.0` o superior (probado en Node.js v26 en Linux).
- **npm**: `v9.0.0` o superior.
- **Backend API**: Servidor FastAPI en ejecución en `http://localhost:8000/api/`.

---

## 📦 Instalación y Puesta en Marcha

1. **Clonar el repositorio**:

   ```bash
   git clone <url-del-repositorio>
   cd fiuba-ids-tp2-frontend
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Verificar que el backend esté ejecutándose**:

   ```bash
   curl http://localhost:8000/api/pokemon/?limit=1
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 📜 Scripts Disponibles

| Comando           | Descripción                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `npm run dev`     | Inicia el entorno local de desarrollo con Hot Module Replacement (HMR).  |
| `npm run build`   | Compila la aplicación optimizada para producción (SSR + Cliente).        |
| `npm run preview` | Previsualiza localmente el build de producción generado.                 |
| `npm run format`  | Aplica formateo automático en todo el proyecto con Prettier.             |
| `npm run lint`    | Ejecuta validación estática de código con ESLint y revisión de Prettier. |

---

## 📂 Estructura del Proyecto

```text
fiuba-ids-tp2-frontend/
├── src/
│   ├── app.css                  # Directivas globales de Tailwind CSS v4 y variables de color
│   ├── app.html                 # Plantilla HTML base con soporte de tipografía Inter
│   ├── lib/
│   │   ├── components/          # Componentes reusables de interfaz
│   │   │   ├── Encabezado.svelte       # Barra de navegación principal con buscador y menú móvil
│   │   │   ├── EtiquetaTipo.svelte     # Badges de tipos elementales con colores oficiales
│   │   │   ├── Pagination.svelte       # Controles semánticos de paginación
│   │   │   ├── TarjetaPokemon.svelte   # Card con imagen, número, nombre y tipos
│   │   │   └── Typeahead.svelte        # Campo con autocompletado reactivo
│   │   ├── constantes/          # URLs base, diccionarios de tipos y utilidades
│   │   └── helpers/             # Funciones de búsqueda y navegación
│   └── routes/                  # Enrutador basado en carpetas de SvelteKit
│       ├── +error.svelte        # Pantalla de fallback amigable si el servidor está inactivo
│       ├── +layout.svelte       # Layout principal, barra de carga y pie institucional FIUBA
│       ├── +page.svelte         # Landing page con buscador hero y acceso rápido
│       ├── pokemones/           # Catálogo y detalle de especies
│       ├── movimientos/         # Catálogo y detalle de movimientos
│       └── equipos/             # Gestor de equipos y alineación táctica
├── CONSIGNA.md                  # Consigna original del trabajo práctico
├── package.json
└── eslint.config.js             # Configuración adaptada para Svelte 5 y SvelteKit 3
```

---

## 👥 Proyecto Académico

Desarrollado como entrega de la **Parte 3** del Trabajo Práctico Integrador de la materia **Introducción al Desarrollo de Software** (Facultad de Ingeniería, Universidad de Buenos Aires).
