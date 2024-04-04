import { PropsWithChildren, RefObject } from 'react'

import { render, screen } from '@testing-library/react'
import { FormikProps } from 'formik'
import { MockStore } from 'redux-mock-store'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import * as useInitialValuesModule from 'common/OrderCalculator/hooks/useInitialValues'
import * as useOrderCalculatorModule from 'common/OrderCalculator/hooks/useOrderCalculator'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { MockProviders } from 'tests/mocks'

import { FullOrderCalculator } from '../FullOrderCalculator'

jest.mock('common/OrderCalculator/ui/OrderCalculator/FullOrderCalculator/FormContainer/FormContainer.tsx')

const mockedRemapApplicationValues = jest.fn()
const mockedOnSubmit = jest.fn()

const mockedUseInitialValues = jest.spyOn(useInitialValuesModule, 'useInitialValues')
const mockedUseOrderCalculator = jest.spyOn(useOrderCalculatorModule, 'useOrderCalculator')

const createWrapper = ({ store, children }: PropsWithChildren<{ store?: MockStore }>) => (
  <MockProviders mockStore={store}>{children}</MockProviders>
)

describe('FullOrderCalculator', () => {
  beforeEach(() => {
    mockedUseInitialValues.mockImplementation(() => ({
      remapApplicationValues: mockedRemapApplicationValues,
      initialValues: {} as FullOrderCalculatorFields,
      hasCustomInitialValues: false,
    }))
    mockedUseOrderCalculator.mockImplementation(() => ({
      formRef: {} as RefObject<FormikProps<useOrderCalculatorModule.OrderCalculatorFields>>,
      isDisabled: false,
      enableFormSubmit: jest.fn(),
      handleSubmit: jest.fn(),
    }))
    render(
      <FullOrderCalculator onSubmit={mockedOnSubmit} onChangeForm={jest.fn()} isSubmitLoading={false} />,
      {
        wrapper: createWrapper,
      },
    )
  })

  it('Форма отображается корректно', () => {
    const loginForm = screen.getByTestId('fullOrderCalculatorForm')
    const loginFormContainer = screen.getByTestId('fullOrderCalculatorFormContainer')
    expect(loginForm).toBeInTheDocument()
    expect(loginFormContainer).toBeInTheDocument()
  })

  it('Хуки вызываются корректно', () => {
    expect(mockedUseInitialValues).toBeCalledWith(fullInitialValueMap, true)
    expect(mockedUseOrderCalculator).toBeCalledWith(mockedRemapApplicationValues, mockedOnSubmit)
  })
})
