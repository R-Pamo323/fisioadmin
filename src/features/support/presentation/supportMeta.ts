/**
 * Datos de contacto del soporte. Todo lo que hay que editar para apuntar a un
 * número real está en este archivo.
 */
export const WHATSAPP_NUMBER = '51999999999'

export const WHATSAPP_MESSAGE = 'Hola, tengo una duda sobre FisioAdmin'

/** Verde de marca de WhatsApp; `colors.success` es esmeralda, no sirve. */
export const WHATSAPP_GREEN = '#25D366'

const WHATSAPP_WASH = 'color-mix(in srgb, #25d366 14%, #ffffff)'

export const whatsappStyles = {
  green: WHATSAPP_GREEN,
  wash: WHATSAPP_WASH,
}

export function buildWhatsAppUrl(
  message: string = WHATSAPP_MESSAGE,
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}