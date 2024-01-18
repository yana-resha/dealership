import { useEffect, useMemo, useRef, useState } from 'react'

import { FormikErrors, useFormikContext } from 'formik'

import { usePrevious } from './usePrevious'

export const getFieldErrorNames = (formikErrors: FormikErrors<any>) => {
  const transformErrorsToList = (errorObj: FormikErrors<any>, prefix = '', result = [] as string[]) =>
    Object.entries(errorObj).reduce(
      (acc, [errKey, errValue]): string[] => {
        if (!errValue) {
          return acc
        }

        const nextKey = prefix ? `${prefix}.${errKey}` : errKey

        if (Array.isArray(errValue) && typeof errValue[0] === 'string') {
          acc.push(nextKey)
        }
        if (Array.isArray(errValue) && typeof errValue[0] !== 'string') {
          const values = errValue as FormikErrors<any>[]
          values.forEach((childErrorObj, i) => {
            acc.push(...transformErrorsToList(childErrorObj as FormikErrors<any>, `${nextKey}[${i}]`, result))
          })
        }
        if (typeof errValue === 'object' && !Array.isArray(errValue)) {
          acc.push(...transformErrorsToList(errValue, nextKey, result))
        }
        if (typeof errValue === 'string') {
          acc.push(nextKey)
        }

        return acc
      },
      [...result],
    )

  return transformErrorsToList(formikErrors)
}

export const useScrollToErrorField = () => {
  const { isValid, submitCount, errors } = useFormikContext()
  const prevSubmitCount = usePrevious(submitCount)

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

  useEffect(() => {
    if (isValid || prevSubmitCount === submitCount) {
      return
    }
    // Формируем список полей с ошибками.
    const fieldErrorNames = getFieldErrorNames(errors)
    if (fieldErrorNames.length <= 0) {
      return
    }
    // Находим первый элемент с ошибкой. Если нашли, то сохраняем его и передаем обсерверу.
    const element = document.querySelector(`[data-fieldId='${fieldErrorNames[0]}']`)
    if (element) {
      elementRef.current = element
      observer.observe(element)
    }
  }, [errors, isValid, observer, prevSubmitCount, submitCount])

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
}
