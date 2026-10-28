// Datos de contacto públicos (no son secretos).
// VITE_WHATSAPP_NUMBER permite sobrescribir el número en build (formato internacional sin '+', ej. 569XXXXXXXX).
const DEFAULT_WHATSAPP_NUMBER = '56997722404';

export const WHATSAPP_NUMBER = (
  import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
).replace(/\D/g, '');

export const WHATSAPP_MESSAGE =
  'Hola Arland, vi tu portafolio en arlandstack.com y me gustaría conversar sobre un proyecto. Mi nombre es ___ y mi empresa es ___.';

export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : '';
