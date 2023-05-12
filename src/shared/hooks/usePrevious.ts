import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T, extraDependencies: any[] = []): T {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ...extraDependencies])

  return ref.current
}
