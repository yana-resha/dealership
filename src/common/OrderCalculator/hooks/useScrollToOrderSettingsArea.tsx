import { useEffect, useMemo, useRef, useState } from 'react'

import { usePrevious } from 'shared/hooks/usePrevious'

export const useScrollToOrderSettingsArea = (creditProductId: string | undefined) => {
  const prevCreditProductId = usePrevious(creditProductId)
  const [isShouldScroll, setShouldScroll] = useState(false)
  const elementRef = useRef<Element | null>(null)

  // Обсервер проверяет находится ли элемент в области видимости.
  // Проверка будет вызвана один раз, сразу после этого вызывается disconnect
  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio !== 1) {
          setShouldScroll(true)
        }
        observer.disconnect()
      }),
    [],
  )

  // Если  есть creditProductId и он только появился, то передаем его обсерверу.
  useEffect(() => {
    if (!creditProductId || creditProductId === prevCreditProductId) {
      return
    }
    if (elementRef.current) {
      observer.observe(elementRef.current)
    }
  }, [creditProductId, observer, prevCreditProductId])

  // Если есть элемент и isShouldScroll == true, скролим до элемента.
  // Ставим флаг setShouldScroll false при успешном скроле или если нет элемента
  useEffect(() => {
    if (isShouldScroll && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setShouldScroll(false)
    }
    if (!elementRef.current && isShouldScroll) {
      setShouldScroll(false)
    }
  }, [isShouldScroll])

  return elementRef
}
