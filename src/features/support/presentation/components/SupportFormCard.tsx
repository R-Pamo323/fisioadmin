import type { ChangeEvent, FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button, Card, Input, Textarea } from '../../../../shared/components'
import type { SupportFormValues } from '../hooks/useSupportForm'
import styles from './SupportFormCard.module.css'

interface SupportFormCardProps {
  values: SupportFormValues
  isValid: boolean
  isSending: boolean
  setValue: (field: keyof SupportFormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (field: keyof SupportFormValues) => () => void
  getError: (field: keyof SupportFormValues) => string | undefined
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SupportFormCard({
  values,
  isValid,
  isSending,
  setValue,
  onBlur,
  getError,
  onSubmit,
}: SupportFormCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>Envíanos un mensaje</h3>
        <p className={styles.subtitle}>
          Cuéntanos qué necesitas y te respondemos por correo.
        </p>
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Input
          label="Título"
          value={values.title}
          onChange={setValue('title')}
          onBlur={onBlur('title')}
          error={getError('title')}
          placeholder="Ej. No puedo generar el reporte"
        />

        <Input
          label="Asunto"
          value={values.subject}
          onChange={setValue('subject')}
          onBlur={onBlur('subject')}
          error={getError('subject')}
          placeholder="Ej. Consulta sobre facturación"
        />

        <Textarea
          label="Mensaje"
          rows={6}
          value={values.message}
          onChange={setValue('message')}
          onBlur={onBlur('message')}
          error={getError('message')}
          placeholder="Describe tu duda con el mayor detalle posible."
        />

        <Button type="submit" fullWidth disabled={!isValid || isSending} style={{ fontSize: 16 }}>
          <Send size={16} />
          {isSending ? 'Enviando…' : 'Enviar'}
        </Button>
      </form>
    </Card>
  )
}