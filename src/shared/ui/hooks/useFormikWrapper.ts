import { useCallback } from 'react'

import { useField, useFormikContext } from 'formik'

export const useFormikWrapper = (name: string) => {
  const [field, meta] = useField(name)
  const { value } = field
  const { touched, error } = meta
  const isError = meta != undefined && touched && error != undefined
  const { setFieldValue } = useFormikContext()

  const onChange = useCallback(
    (value: any) => {
      setFieldValue(name, value)
    },
    [setFieldValue, name],
  )

  return { value, isError, error, onChange }
}
