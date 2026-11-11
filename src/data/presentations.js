/**
 * Presentaciones y slides de la Audioguía Móvil, detectadas desde public/media:
 *
 *   public/media/<presentación>/images/slide-<slide>.<ext>
 *   public/media/<presentación>/images/slide-<slide>-<orden>.<ext>
 *   public/media/<presentación>/audio/slide-<slide>.<ext>
 *
 * Cada presentación tiene su propio subenlace (ej: #/acua) y cada slide el suyo
 * (ej: #/acua/1). Las rutas son relativas (sin "/" inicial) para que funcionen
 * tanto en la raíz del dominio como en una subcarpeta.
 */
import mediaFiles from 'virtual:media-files';

/**
 * Textos que no se pueden deducir de los archivos. Todos son opcionales: sin
 * entrada, el título es "Slide <número>" y la presentación usa el nombre de su carpeta.
 */
const texts = {
  acua: {
    title: 'ACUA',
    subtitle: 'Subtítulo de la presentación',
    slides: {
      1: {
        title: 'Pista - 1 - SALA ACUA',
        subtitle: 'Sala ACUA',
        text: 'Texto de ejemplo #1. Este es un texto de prueba para el primer slide de la presentación.'
      },
      2: {
        title: 'Slide 2',
        subtitle: 'Subtítulo #2',
        text: 'Texto de ejemplo #2. Este es un texto de prueba para el segundo slide de la presentación.'
      },
      3: {
        title: 'Slide 3',
        subtitle: 'Subtítulo #3',
        text: 'Texto de ejemplo #3. Este es un texto de prueba para el tercer slide de la presentación.'
      },
      4: {
        title: 'Slide 4',
        subtitle: 'Subtítulo #4',
        text: 'Texto de ejemplo #4. Este es un texto de prueba para el cuarto slide de la presentación.'
      },
      5: {
        title: 'Slide 5',
        subtitle: 'Subtítulo #5',
        text: 'Texto de ejemplo #5. Este es un texto de prueba para el quinto slide de la presentación.'
      }
    }
  },
  etsii: {
    title: 'ETSII • MICROLIVE',
    subtitle: 'Exposición de la E.T.S. de Ingeniería Industrial de Ciudad Real',
    slides: {
      1: {
        title: 'De los ojos del escriba al ojo que ve los átomos',
        subtitle: 'MICROLIVE – Parte 1',
        text: 'Historia de la microscopía, Santiago Ramón y Cajal y técnicas de observación.'
      },
      2: {
        title: 'Aplicaciones de la microscopía',
        subtitle: 'MICROLIVE – Parte 2',
        text: 'Arqueología, paleontología, hematología, histología, genética, parasitología, protistología, hidrobiología y geología.'
      },
      3: {
        title: 'Del microscopio al dato',
        subtitle: 'MICROLIVE – Parte 3',
        text: 'Procesado de imagen, inteligencia artificial e innovación. Demostraciones: observar, capturar, medir y analizar.'
      }
    }
  }
};

const IMAGE_FILE = /^([^/]+)\/images\/slide-(\d+)(?:-(\d+))?\.(?:jpe?g|png|webp|svg)$/i;
const AUDIO_FILE = /^([^/]+)\/audio\/slide-(\d+)\.(?:mp3|m4a|ogg|wav)$/i;

function buildPresentations(files) {
  const slidesByPresentation = new Map();

  const getSlideEntry = (presentationId, slideNumber) => {
    if (!slidesByPresentation.has(presentationId)) {
      slidesByPresentation.set(presentationId, new Map());
    }
    const slides = slidesByPresentation.get(presentationId);
    if (!slides.has(slideNumber)) {
      slides.set(slideNumber, { images: [], audio: undefined });
    }
    return slides.get(slideNumber);
  };

  for (const file of files) {
    const image = file.match(IMAGE_FILE);
    if (image) {
      // Una imagen sin número de orden (slide-1.jpg) va antes que las numeradas.
      const order = image[3] === undefined ? -1 : Number(image[3]);
      getSlideEntry(image[1], Number(image[2])).images.push({ order, path: `media/${file}` });
    }

    const audio = file.match(AUDIO_FILE);
    if (audio) {
      const entry = getSlideEntry(audio[1], Number(audio[2]));
      entry.audio ??= `media/${file}`;
    }
  }

  return [...slidesByPresentation.keys()].sort().map((id) => {
    const presentationTexts = texts[id] ?? {};
    const slides = [...slidesByPresentation.get(id).entries()]
      .sort(([a], [b]) => a - b)
      .map(([number, { images, audio }]) => ({
        id: String(number),
        slug: String(number),
        title: `Slide ${number}`,
        ...presentationTexts.slides?.[number],
        images: images.sort((a, b) => a.order - b.order).map(({ path }) => path),
        audio
      }));

    return {
      id,
      slug: id,
      title: presentationTexts.title ?? id,
      subtitle: presentationTexts.subtitle,
      slides
    };
  });
}

export const presentations = buildPresentations(mediaFiles);

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
