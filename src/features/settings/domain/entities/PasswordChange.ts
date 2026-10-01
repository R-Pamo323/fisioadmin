/** Resultado de intentar cambiar la contraseña, tal como lo devuelve el mock. */
export type PasswordChangeResult =
  /** La contraseña actual no coincide con la registrada. */
  | 'invalid_current'
  /** La nueva no cumple la regla de longitud mínima. */
  | 'invalid_length'
  | 'success'
/*
 * La comparación entre la nueva y su confirmación no vive aquí: el repositorio
 * solo recibe current y next, así que la resuelve la capa de presentación.
 */