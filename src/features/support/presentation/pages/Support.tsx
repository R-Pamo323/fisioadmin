import { useState } from 'react'
import { CheckIcon, Modal, SectionHeader } from '../../../../shared/components'
import { SupportFormCard } from '../components/SupportFormCard'
import { WhatsAppCard } from '../components/WhatsAppCard'
import { useSupportForm } from '../hooks/useSupportForm'
import styles from './Support.module.css'

const SUCCESS_MESSAGE = 'Tu mensaje ha sido enviado, te responderemos pronto.'

export function Support() {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  const { values, isValid, isSending, setValue, onBlur, getError, handleSubmit } =
    useSupportForm({ onSent: () => setIsConfirmationOpen(true) })

  return (
    <div className={styles.page}>
      <SectionHeader title="Soporte" subtitle="¿Tienes dudas? Escríbenos un mensaje." />

      <div className={styles.layout}>
        <SupportFormCard
          values={values}
          isValid={isValid}
          isSending={isSending}
          setValue={setValue}
          onBlur={onBlur}
          getError={getError}
          onSubmit={handleSubmit}
        />

        <WhatsAppCard />
      </div>

      <Modal
        open={isConfirmationOpen}
        onRequestClose={() => setIsConfirmationOpen(false)}
        size="sm"
      >
        <div className={styles.confirmation}>
          <span className={styles.confirmationIcon}>
            <CheckIcon width={28} height={28} />
          </span>
          <h3 className={styles.confirmationTitle}>Mensaje enviado</h3>
          <p className={styles.confirmationText}>{SUCCESS_MESSAGE}</p>
          <button
            type="button"
            className={styles.confirmationClose}
            onClick={() => setIsConfirmationOpen(false)}
          >
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  )
}