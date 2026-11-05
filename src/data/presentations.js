/**
 * Configuración de Presentaciones y Slides para la Audioguía Móvil.
 * 
 * Cada presentación tiene su propio subenlace (ej: #/acua)
 * Cada slide tiene su propio subenlace (ej: #/acua/1, #/acua/2)
 * Cada slide puede tener una o varias imágenes (array en `images`).
 * Las rutas de imágenes y audios son relativas (sin "/" inicial) para que
 * funcionen tanto en la raíz del dominio como en una subcarpeta.
 */

export const presentations = [
  {
    id: 'acua',
    slug: 'acua',
    title: 'ACUA',
    subtitle: 'Subtítulo de la presentación',
    slides: [
      {
        id: '1',
        slug: '1',
        title: 'Slide 1',
        subtitle: 'Subtítulo #1',
        images: [
          'media/acua/images/slide-1.svg',
          'media/acua/images/slide-1-detail.svg'
        ],
        audio: 'media/acua/audio/slide-1.mp3',
        durationSec: 60,
        durationFormatted: '01:00',
        text: 'Texto de ejemplo #1. Este es un texto de prueba para el primer slide de la presentación.'
      },
      {
        id: '2',
        slug: '2',
        title: 'Slide 2',
        subtitle: 'Subtítulo #2',
        images: [
          'media/acua/images/slide-2.svg'
        ],
        audio: 'media/acua/audio/slide-2.mp3',
        durationSec: 60,
        durationFormatted: '01:00',
        text: 'Texto de ejemplo #2. Este es un texto de prueba para el segundo slide de la presentación.'
      },
      {
        id: '3',
        slug: '3',
        title: 'Slide 3',
        subtitle: 'Subtítulo #3',
        images: [
          'media/acua/images/slide-3.svg'
        ],
        audio: 'media/acua/audio/slide-3.mp3',
        durationSec: 60,
        durationFormatted: '01:00',
        text: 'Texto de ejemplo #3. Este es un texto de prueba para el tercer slide de la presentación.'
      },
      {
        id: '4',
        slug: '4',
        title: 'Slide 4',
        subtitle: 'Subtítulo #4',
        images: [
          'media/acua/images/slide-4.svg'
        ],
        audio: 'media/acua/audio/slide-4.mp3',
        durationSec: 60,
        durationFormatted: '01:00',
        text: 'Texto de ejemplo #4. Este es un texto de prueba para el cuarto slide de la presentación.'
      },
      {
        id: '5',
        slug: '5',
        title: 'Slide 5',
        subtitle: 'Subtítulo #5',
        images: [
          'media/acua/images/slide-5.svg'
        ],
        audio: 'media/acua/audio/slide-5.mp3',
        durationSec: 60,
        durationFormatted: '01:00',
        text: 'Texto de ejemplo #5. Este es un texto de prueba para el quinto slide de la presentación.'
      }
    ]
  }
];

export function getPresentation(slugOrId) {
  if (!slugOrId) return presentations[0];
  const normalized = String(slugOrId).toLowerCase().trim();
  return presentations.find(p => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized) || presentations[0];
}

export function getSlide(presentation, slideSlugOrId) {
  if (!presentation || !presentation.slides || presentation.slides.length === 0) return null;
  if (!slideSlugOrId) return presentation.slides[0];

  const normalized = String(slideSlugOrId).toLowerCase().trim();
  
  // Buscar por slug o id
  const match = presentation.slides.find(s => 
    s.slug.toLowerCase() === normalized || 
    s.id.toLowerCase() === normalized ||
    `slide-${s.id}`.toLowerCase() === normalized
  );
  if (match) return match;

  // Buscar por índice numérico (1-based)
  const num = parseInt(normalized, 10);
  if (!isNaN(num) && num >= 1 && num <= presentation.slides.length) {
    return presentation.slides[num - 1];
  }

  return presentation.slides[0];
}

export function getSlideIndex(presentation, slide) {
  if (!presentation || !slide) return 0;
  return presentation.slides.findIndex(s => s.id === slide.id);
}
