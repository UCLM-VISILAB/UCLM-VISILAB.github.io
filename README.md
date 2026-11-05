# 🎧 Audioguía Web Móvil • Presentación ACUA

Web de audioguía minimalista diseñada **exclusivamente para teléfonos móviles**, con soporte para múltiples presentaciones, slides con múltiples imágenes y subenlaces independientes para códigos QR sin recargas de página.

---

## 🚀 Inicio Rápido

### Servidor de desarrollo
```bash
npm run dev
```
Acceso en local: `http://localhost:3000`

### Compilación para producción
```bash
npm run build
```
Genera la carpeta `dist/` estática, con rutas relativas.

### Despliegue en GitHub Pages
1. En **Settings → Pages → Source** del repositorio, selecciona **GitHub Actions**.
2. Cada push a `main` o `master` publica la web automáticamente en `https://uclm-visilab.github.io/`.

> Genera y descarga los códigos QR desde la web publicada: codifican la URL desde la que se abre la página, así que los generados en local apuntarían a tu equipo.

---

## 🖼️ Imágenes y Audios

Las presentaciones y los slides se detectan automáticamente a partir de los archivos de `public/media/`. No hace falta editar ningún archivo de código:

```text
public/media/<presentación>/images/slide-<slide>.<ext>           Una imagen
public/media/<presentación>/images/slide-<slide>-<orden>.<ext>   Varias imágenes
public/media/<presentación>/audio/slide-<slide>.<ext>            Audio del slide
```

Por ejemplo, estos archivos crean el slide 1 con dos imágenes y su audio, y el slide 2 con una imagen:

```text
public/media/acua/images/slide-1-1.jpg
public/media/acua/images/slide-1-2.png
public/media/acua/audio/slide-1.mp3
public/media/acua/images/slide-2.svg
```

- **Imágenes:** `.jpg`, `.jpeg`, `.png`, `.webp` y `.svg`.
- **Audios:** `.mp3`, `.m4a`, `.ogg` y `.wav`. Cada slide tiene un solo audio, vinculado por el número de slide.
- **Orden:** los slides y las imágenes se ordenan por número. El orden de las imágenes puede ser cualquier número, y una imagen sin orden va primero.
- **Nuevas presentaciones:** cada carpeta dentro de `public/media/` es una presentación, con su enlace `#/<carpeta>/1`.
- **Sin audio:** el slide usa la voz sintética para leer su texto.
- **Otros nombres:** los archivos con otro formato, como `slide-1-detalle.png`, se ignoran.
- **Mayúsculas:** GitHub Pages las distingue en las rutas, pero la detección usa el nombre real del archivo, así que `.JPG` también funciona.

Si un carrusel tiene más de una imagen, aparecen flechas y puntos indicadores. Con `npm run dev` en marcha, la página se recarga sola al añadir o quitar archivos; al publicar, se detectan en cada despliegue.

### Títulos y textos

Los títulos y textos son lo único que no se puede deducir de los archivos. Son opcionales y se escriben en el objeto `texts` de `src/data/presentations.js`, usando como clave el número de slide. Sin entrada, el título es `Slide <número>`:

```javascript
const texts = {
  acua: {
    title: 'ACUA',
    slides: {
      1: {
        title: 'Introducción a ACUA',
        subtitle: 'El origen del ciclo del agua',
        text: 'Texto descriptivo limpio y legible en pantalla.'
      }
    }
  }
};
```

---

## 🔗 Subenlaces y Códigos QR

- Cada slide tiene su subenlace directo:
  - `https://uclm-visilab.github.io/#/acua/1` $\rightarrow$ Slide 1
  - `https://uclm-visilab.github.io/#/acua/2` $\rightarrow$ Slide 2
  - `https://uclm-visilab.github.io/#/acua/3` $\rightarrow$ Slide 3
- Al navegar entre slides mediante los botones o deslizando con el dedo (swipe), la URL cambia dinámicamente **sin recargar la página**.
- El icono de QR en la cabecera permite previsualizar y descargar el código QR de cualquier slide para imprimirlo en cartelería.
