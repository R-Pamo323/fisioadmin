import { useCallback, useSyncExternalStore } from 'react'

/** Se suscribe a una media query y avisa cuando cambia. */
function subscribeToQuery(query: string, onChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(query)
  mediaQueryList.addEventListener('change', onChange)
  return () => mediaQueryList.removeEventListener('change', onChange)
}

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToQuery(query, onChange),
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
