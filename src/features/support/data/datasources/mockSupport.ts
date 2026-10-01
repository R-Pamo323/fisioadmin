import type { SupportMessageDraft } from '../../domain/entities/SupportMessage'

/** Latencia simulada para que el botón muestre su estado de carga. */
const SEND_DELAY_MS = 900

/** Copia de los envíos, solo para poder inspeccionar qué se mandó. */
const sentMessages: SupportMessageDraft[] = []

export const mockSupport = {
  sendMessage(draft: SupportMessageDraft): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        sentMessages.push({ ...draft })
        resolve()
      }, SEND_DELAY_MS)
    })
  },

  /** Expuesto solo para depuración en desarrollo. */
  getSentMessages(): SupportMessageDraft[] {
    return sentMessages.map((draft) => ({ ...draft }))
  },
}