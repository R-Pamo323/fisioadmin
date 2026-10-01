/** Datos públicos del profesional que el usuario puede editar. */
export interface SettingsProfile {
  /** "Dr. Juan Pérez" */
  name: string
  /** "Fisioterapeuta Deportivo" */
  specialty: string
  /** "juan.perez@fisioadmin.com" */
  email: string
}

/** Campo editable del perfil; permite teclear el setter sin repetir el key. */
export type SettingsProfileField = keyof SettingsProfile

export type SettingsProfileDraft = SettingsProfile