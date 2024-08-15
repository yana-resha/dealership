import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { BriefOrderCalculatorFields, FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { MockProviders } from 'tests/mocks'

import { getPercentFromValue, getValueFromPercent, useInitialPayment } from '../useInitialPayment'

jest.mock('lodash/debounce', () => (fn: (...args: any[]) => any) => fn)

const mockedFormikContext = {
  values: {} as FullOrderCalculatorFields | BriefOrderCalculatorFields,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => {},
}

jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useFormikContext: () => {
    const formikContext = jest.requireActual('formik').useFormikContext()

    mockedFormikContext.values = formikContext.values
    mockedFormikContext.setFieldValue = formikContext.setFieldValue

    return formikContext
  },
}))

const initialData: FullOrderCalculatorFields = {
  ...fullInitialValueMap,
  carCost: '100',
  initialPayment: '10',
}

const createWrapper =
  (initialValues: Partial<FullOrderCalculatorFields>) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Form>{children}</Form>
        </Formik>
      </MockProviders>
    )

describe('useInitialPayment', () => {
  it('При заполнении initialPayment меняется initialPaymentPercent, и наоборот', async () => {
    const { result } = renderHook(() => useInitialPayment(false), {
      wrapper: createWrapper(initialData),
    })

    result.current.handleInitialPaymentFocus()
    mockedFormikContext.setFieldValue('initialPayment', 20)
    result.current.handleInitialPaymentBlur()
    expect(mockedFormikContext.values.initialPaymentPercent).toEqual('20')

    result.current.handleInitialPaymentPercentFocus()
    mockedFormikContext.setFieldValue('initialPaymentPercent', 5)
    result.current.handleInitialPaymentPercentBlur()
    expect(mockedFormikContext.values.initialPayment).toEqual('5')
  })

  it('При смене carCost меняется initialPaymentPercent', async () => {
    renderHook(() => useInitialPayment(false), {
      wrapper: createWrapper(initialData),
    })

    mockedFormikContext.setFieldValue('carCost', 200)
    expect(mockedFormikContext.values.initialPaymentPercent).toEqual('5')
  })

  it('При добалении дополнительного оборудования (в кредит) меняется initialPaymentPercent', async () => {
    renderHook(() => useInitialPayment(false), {
      wrapper: createWrapper(initialData),
    })
    mockedFormikContext.setFieldValue('additionalEquipments[0].productType', 1)
    mockedFormikContext.setFieldValue('additionalEquipments[0].productCost', 100)
    mockedFormikContext.setFieldValue('additionalEquipments[0].isCredit', true)
    expect(mockedFormikContext.values.initialPaymentPercent).toEqual('5')
  })
})

describe('getPercentFromValue', () => {
  it('Если значение больше 100 то возвращаем пустую строку', () => {
    expect(getPercentFromValue('100', 77)).toEqual('')
  })

  it('Если аргументы невалидны то возвращаем пустую строку', () => {
    expect(getPercentFromValue('', 77)).toEqual('')
    expect(getPercentFromValue('undefined', 77)).toEqual('')
    expect(getPercentFromValue('100', NaN)).toEqual('')
    expect(getPercentFromValue('100', 0)).toEqual('')
  })

  it('Результат округляется до сотых', () => {
    expect(getPercentFromValue('13', 77)).toEqual('16.88')
  })
})

describe('getValueFromPercent', () => {
  it('Если аргументы невалидны то возвращаем пустую строку', () => {
    expect(getValueFromPercent('', 77)).toEqual('')
    expect(getValueFromPercent('undefined', 77)).toEqual('')
    expect(getValueFromPercent('100', NaN)).toEqual('')
  })
  it('Результат округляется до целых', () => {
    expect(getValueFromPercent('13', 77)).toEqual('11')
  })
})
