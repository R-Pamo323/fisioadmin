import { colors } from '../../../../core/theme/colors'
import { typography } from '../../../../core/theme/typography'
import { LoginForm } from '../components/LoginForm'
import { LoginShowcase } from '../components/LoginShowcase'
import styles from './Login.module.css'

export function Login() {
  return (
    <main
      className={styles.page}
      style={{
        background: colors.background,
        fontFamily: typography.fontFamily,
      }}
    >
      <div className={styles.grid}>
        <div className={styles.formColumn}>
          <LoginForm />
        </div>
        <div className={styles.showcaseColumn}>
          <LoginShowcase />
        </div>
      </div>
    </main>
  )
}