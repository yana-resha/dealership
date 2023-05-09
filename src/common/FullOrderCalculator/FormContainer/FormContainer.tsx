import { useEffect } from 'react'

import { Form, useFormikContext } from 'formik'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  onChangeForm: () => void
}

export function FormContainer({ onChangeForm }: Props) {
  const { values } = useFormikContext()

  useEffect(() => {
    onChangeForm()
  }, [values])

  return (
    <Form>
      <CarSettingsArea />
      <OrderSettingsArea />
    </Form>
  )
}
