import { useCallback, useEffect, useState } from 'react'

import { useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'

export function useDisableFormSubmit() {
  const { submitCount } = useFormikContext()
  const prevSubmitCount = usePrevious(submitCount)
  const [isDisabled, setDisabled] = useState(false)

  const enableFormSubmit = useCallback(() => setDisabled(false), [])

  useEffect(() => {
    if (submitCount !== prevSubmitCount) {
      setDisabled(true)
    }
  }, [prevSubmitCount, submitCount])

  return {
    isDisabled,
    enableFormSubmit,
  }
}
