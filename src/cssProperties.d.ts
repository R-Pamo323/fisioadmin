import 'react'

declare module 'react' {
  interface CSSProperties {
    /**
     * Variables CSS personalizadas (--x) que los componentes compartidos
     * exponen a los consumidores a través de `style`.
     */
    [key: `--${string}`]: string | number | undefined
  }
}
