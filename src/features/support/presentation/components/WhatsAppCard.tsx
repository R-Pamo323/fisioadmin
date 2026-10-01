import { MessageCircle } from 'lucide-react'
import { Button, Card } from '../../../../shared/components'
import { buildWhatsAppUrl, whatsappStyles } from '../supportMeta'
import styles from './WhatsAppCard.module.css'

export function WhatsAppCard() {
  const openWhatsApp = () => {
    // noopener evita que la pestaña nueva tenga acceso a window.opener.
    window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className={styles.card}>
      <span
        className={styles.icon}
        style={{ background: whatsappStyles.wash, color: whatsappStyles.green }}
      >
        <MessageCircle size={26} />
      </span>

      <h3 className={styles.title}>¿Prefieres algo más rápido?</h3>
      <p className={styles.text}>
        Escríbenos directo por WhatsApp y te respondemos en el momento.
      </p>

      <Button
        fullWidth
        onClick={openWhatsApp}
        style={{ background: whatsappStyles.green, color: '#ffffff' }}
      >
        <MessageCircle size={16} />
        Escribir por WhatsApp
      </Button>

      <span className={styles.hint}>Se abre en una pestaña nueva</span>
    </Card>
  )
}