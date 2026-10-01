import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { ROUTE_PATHS } from '../../core/routes/paths'
import { DropdownMenu, LogoMark } from '../components'
import styles from './MainLayout.module.css'

const NAV_ITEMS = [
  { to: ROUTE_PATHS.calendar, label: 'Calendario', icon: CalendarDays },
  { to: ROUTE_PATHS.patients, label: 'Pacientes', icon: Users },
  { to: ROUTE_PATHS.appointmentTypes, label: 'Tipos de citas', icon: ClipboardList },
  { to: ROUTE_PATHS.statistics, label: 'Estadísticas', icon: TrendingUp },
  { to: ROUTE_PATHS.settings, label: 'Configuración', icon: Settings },
] as const

const SECTION_TITLES: Record<string, string> = {
  [ROUTE_PATHS.calendar]: 'Calendario',
  [ROUTE_PATHS.patients]: 'Pacientes',
  [ROUTE_PATHS.statistics]: 'Estadísticas',
  [ROUTE_PATHS.appointmentTypes]: 'Tipos de citas',
  [ROUTE_PATHS.settings]: 'Configuración',
  [ROUTE_PATHS.support]: 'Soporte',
}

export function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const title = SECTION_TITLES[pathname] ?? 'FisioAdmin'

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={closeSidebar}
      />
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <LogoMark width={36} height={36} />
          <span className={styles.brand}>FisioAdmin</span>
          <button className={styles.closeBtn} onClick={closeSidebar} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                [styles.navItem, isActive ? styles.navItemActive : ''].filter(Boolean).join(' ')
              }
            >
              <Icon size={18} />
              <span className={styles.navItemLabel}>{label}</span>
              {pathname === to && <ChevronRight size={16} className={styles.navItemChevron} />}
            </NavLink>
          ))}
        </nav>
        <div className={styles.helpCard}>
          <div className={styles.helpIcon}>
            <HelpCircle size={18} />
          </div>
          <strong className={styles.helpTitle}>¿Necesitas ayuda?</strong>
          <span className={styles.helpText}>Contacta con nuestro equipo de soporte</span>
          <button
            className={[
              styles.helpButton,
              pathname === ROUTE_PATHS.support ? styles.helpButtonActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              navigate(ROUTE_PATHS.support)
              closeSidebar()
            }}
          >
            Soporte
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
          <div className={styles.headerRight}>
            <DropdownMenu
              ariaLabel="Menú de usuario"
              triggerClassName={styles.profileTrigger}
              items={[
                {
                  label: 'Cerrar sesión',
                  icon: <LogOut size={15} />,
                  tone: 'danger',
                  onSelect: () => navigate(ROUTE_PATHS.login),
                },
              ]}
              trigger={
                <>
                  <div className={styles.avatar}>
                    <span>JP</span>
                    <span className={styles.statusDot} />
                  </div>
                  <div className={styles.profileText}>
                    <strong>Dr. Juan Pérez</strong>
                    <span>Administrador</span>
                  </div>
                  <ChevronDown size={16} className={styles.profileChevron} />
                </>
              }
            />
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}