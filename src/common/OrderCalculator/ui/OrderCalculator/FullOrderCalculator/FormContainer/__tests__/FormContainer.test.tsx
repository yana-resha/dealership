import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import { Formik, Form } from 'formik'

import { MockProviders } from 'tests/mocks'

import { FormContainer } from '../FormContainer'

const createWrapper = ({ children }: PropsWithChildren) => (
  <MockProviders>
    <Formik
      initialValues={{
        additionalEquipments: [],
        bankAdditionalServices: [],
        dealerAdditionalServices: [],
      }}
      onSubmit={() => {}}
    >
      <Form>{children}</Form>
    </Formik>
  </MockProviders>
)

jest.mock(
  'common/OrderCalculator/ui/OrderCalculator/FullOrderCalculator/FormContainer/CarSettingsArea/CarSettingsArea.tsx',
)
jest.mock(
  'common/OrderCalculator/ui/OrderCalculator/FullOrderCalculator/FormContainer/OrderSettingsArea/OrderSettingsArea.tsx',
)

const mockedUseScrollToErrorField = jest.fn()
jest.mock('shared/hooks/useScrollToErrorField.tsx', () => ({
  useScrollToErrorField: () => mockedUseScrollToErrorField(),
}))

const mockedUseFormChanging = jest.fn()
jest.mock('common/OrderCalculator/hooks/useFormChanging.ts', () => ({
  useFormChanging: (param: any) => mockedUseFormChanging(param),
}))

jest.mock('entities/pointOfSale/utils/getPointOfSaleFromCookies.ts', () => ({
  getPointOfSaleFromCookies: () => ({
    vendorCode: '1',
  }),
}))

jest.mock('common/OrderCalculator/hooks/useOrderCalculator', () => ({
  useOrderCalculator: () => ({
    formRef: null,
    isDisabled: false,
    enableFormSubmit: jest.fn(),
    handleSubmit: jest.fn(),
  }),
}))

const mockedRemapApplicationValues = jest.fn()
const mockedOnChangeForm = jest.fn()
const mockedEnableFormSubmit = jest.fn()

describe('FormContainer', () => {
  beforeEach(() => {
    render(
      <FormContainer
        isSubmitLoading={false}
        onChangeForm={mockedOnChangeForm}
        shouldFetchProductsOnStart={false}
        remapApplicationValues={mockedRemapApplicationValues}
        isDisabledFormSubmit={false}
        enableFormSubmit={mockedEnableFormSubmit}
      />,
      {
        wrapper: createWrapper,
      },
    )
  })

  it('Форма отображается корректно', () => {
    const loginFormContainer = screen.getByTestId('fullOrderCalculatorFormContainer')
    const carSettingsArea = screen.getByTestId('carSettingsArea')
    const orderSettingsArea = screen.getByTestId('orderSettingsArea')
    expect(loginFormContainer).toBeInTheDocument()
    expect(carSettingsArea).toBeInTheDocument()
    expect(orderSettingsArea).toBeInTheDocument()
  })

  it('Хук useScrollToErrorField подключен корректно', () => {
    expect(mockedUseScrollToErrorField).toHaveBeenCalled()
  })

  it('Хук useFormChanging подключен корректно', () => {
    expect(mockedUseFormChanging).toHaveBeenCalledWith({
      remapApplicationValues: mockedRemapApplicationValues,
      onChangeForm: mockedOnChangeForm,
      enableFormSubmit: mockedEnableFormSubmit,
    })
  })

  it.todo('Проверка на вызов useRequisitesForFinancingQuery с верными (отфильтрованными параметрами)')
  it.todo('Проверка на вызов useCreditProducts с верными параметрами')
})
