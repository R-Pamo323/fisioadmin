export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * El registro se oculta porque la clínica tiene un único administrador. La ruta
 * `/register` y todo el flujo siguen existiendo: poner esto en `true` los vuelve
 * a mostrar.
 */
export const SHOW_REGISTER_LINK = false
