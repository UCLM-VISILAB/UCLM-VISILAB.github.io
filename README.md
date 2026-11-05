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

## 🖼️ Múltiples Imágenes por Slide

Ahora cada slide puede tener un arreglo de imágenes en `src/data/presentations.js`:

```javascript
{
  id: '1',
  slug: '1',
  title: 'Introducción a ACUA',
  subtitle: 'El origen del ciclo del agua',
  images: [
    'media/acua/images/slide-1.svg',
    'media/acua/images/slide-1-detail.svg'
  ],
  audio: 'media/acua/audio/slide-1.mp3',
  durationFormatted: '01:45',
  text: 'Texto descriptivo limpio y legible en pantalla.'
}
```

- Si un slide tiene más de una imagen, aparece un carrusel limpio con flechas y puntos indicadores.
- Cada imagen se puede ampliar a pantalla completa con el botón de expansión.
- También es compatible con una sola imagen usando `images: ['ruta/imagen.jpg']` o `image: 'ruta/imagen.jpg'`.
- Escribe las rutas sin `/` inicial, para que la web funcione tanto en la raíz del dominio como en una subcarpeta.

---

## 🔗 Subenlaces y Códigos QR

- Cada slide tiene su subenlace directo:
  - `https://uclm-visilab.github.io/#/acua/1` $\rightarrow$ Slide 1
  - `https://uclm-visilab.github.io/#/acua/2` $\rightarrow$ Slide 2
  - `https://uclm-visilab.github.io/#/acua/3` $\rightarrow$ Slide 3
- Al navegar entre slides mediante los botones o deslizando con el dedo (swipe), la URL cambia dinámicamente **sin recargar la página**.
- El icono de QR en la cabecera permite previsualizar y descargar el código QR de cualquier slide para imprimirlo en cartelería.

---

## 📁 Subir Audios e Imágenes

Coloca tus archivos en:
- Audios: `public/media/acua/audio/slide-1.mp3`, `slide-2.mp3`, etc.
- Imágenes: `public/media/acua/images/`
