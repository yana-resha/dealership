import { MutableRefObject, useEffect, useMemo, useState } from 'react'

export function useOnScreen(
  ref: MutableRefObject<HTMLElement | undefined>,
  options?: IntersectionObserverInit,
) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(
    () => new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), options),
    [options],
  )

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [observer, ref])

  return isIntersecting
}
