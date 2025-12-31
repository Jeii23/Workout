# Aplicación de Rutinas de Entrenamiento

Esta app en React + Vite te permite:

- Gestionar una biblioteca personalizada de ejercicios.
- Construir rutinas combinando ejercicios existentes.
- Ejecutar la rutina con temporizador, descansos y feedback sonoro.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre la URL que se muestra en la terminal (por defecto http://localhost:5173) para usar la app en modo interactivo.

## Build de producción

```bash
npm run build
```

Para servir el build localmente:

```bash
npm run preview
```

## Video motivacional con YouTube

Mientras ejecutas una rutina, la pantalla se divide entre los controles y un reproductor de YouTube. Desde ese panel puedes buscar videos, ver miniaturas y seleccionar el que quieras; el video permanecerá reproduciéndose hasta que completes la sesión.

- Para usar resultados reales de YouTube crea un archivo `.env` y añade tu clave: `VITE_YOUTUBE_API_KEY=tu_clave`.
- Si no defines una clave, la app usa una biblioteca simulada con recomendaciones curadas (HIIT, cardio, yoga, dance, fuerza…) y filtra según tus palabras clave.
- El reproductor mantiene la relación 16:9 y la interfaz se adapta en escritorio y móvil para que ambos paneles sean cómodos.

## Notas

- El estado se persiste en `localStorage`, por lo que tus ejercicios y rutinas se mantienen entre recargas.
- Tailwind se importa mediante CDN en `index.html` para que las clases utilitarias funcionen sin configuración adicional.
