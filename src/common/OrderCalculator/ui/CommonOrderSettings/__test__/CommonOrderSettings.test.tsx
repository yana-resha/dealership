import { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, Form } from 'formik'
import { act } from 'react-dom/test-utils'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { baseFormValidation } from 'common/OrderCalculator/utils/baseFormValidation'
import { MockProviders } from 'tests/mocks'

import { briefOrderFormValidationSchema } from '../../OrderCalculator/BriefOrderCalculator/utils/briefOrderFormValidation'
import { CommonOrderSettings } from '../CommonOrderSettings'

const mockedHandleInitialPaymentFocus = jest.fn()
const mockedHandleInitialPaymentPercentFocus = jest.fn()
const mockedHandleInitialPaymentBlur = jest.fn()
const mockedHandleInitialPaymentPercentBlur = jest.fn()

jest.mock('common/OrderCalculator/hooks/useInitialPayment', () => ({
  useInitialPayment: () => ({
    handleInitialPaymentFocus: mockedHandleInitialPaymentFocus,
    handleInitialPaymentPercentFocus: mockedHandleInitialPaymentPercentFocus,
    handleInitialPaymentBlur: mockedHandleInitialPaymentBlur,
    handleInitialPaymentPercentBlur: mockedHandleInitialPaymentPercentBlur,
  }),
}))

const FORM_FIELDS = ['Кредитный продукт', 'Первоначальный взнос', 'Первоначальный взнос в %', 'Срок']

const createWrapper = ({ children }: PropsWithChildren) => (
  <MockProviders>
    <Formik
      initialValues={fullInitialValueMap}
      onSubmit={() => {}}
      validationSchema={briefOrderFormValidationSchema}
    >
      <Form>
        {children}
        <Button type="submit" data-testid="submit" />
      </Form>
    </Formik>
  </MockProviders>
)

describe('CommonOrderSettings', () => {
  describe('Форма отображается корректно', () => {
    it('Основные и дополнительные поля присутствуют на форме', () => {
      render(
        <CommonOrderSettings
          disabled={false}
          minInitialPaymentPercent={0}
          maxInitialPaymentPercent={0}
          minInitialPayment={0}
          maxInitialPayment={0}
          currentProduct={undefined}
          loanTerms={[]}
          durationMaxFromAge={0}
          currentDurationMin={0}
          currentDurationMax={0}
          isGetCarsLoading={true}
          isGetCarsSuccess={true}
        />,
        {
          wrapper: createWrapper,
        },
      )
      for (const fieldName of FORM_FIELDS) {
        expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
      }
    })
  })

  describe('Валидация работает корректно', () => {
    beforeEach(() => {
      render(
        <CommonOrderSettings
          disabled={false}
          minInitialPaymentPercent={0}
          maxInitialPaymentPercent={0}
          minInitialPayment={0}
          maxInitialPayment={0}
          currentProduct={undefined}
          loanTerms={[]}
          durationMaxFromAge={0}
          currentDurationMin={0}
          currentDurationMax={0}
          isGetCarsLoading={true}
          isGetCarsSuccess={true}
        />,
        {
          wrapper: createWrapper,
        },
      )
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      // Первоначальный взнос и Срок
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(2)
    })

    it('Поле Первоначальный взнос - принимает только числа', async () => {
      const initialPaymentField = document.querySelector('#initialPayment') as HTMLInputElement
      await act(() => userEvent.type(initialPaymentField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(2)
      await act(() => userEvent.type(initialPaymentField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(1)
    })

    it('Поле Первоначальный взнос в % - принимает только числа: максимум две цифры после запятой', async () => {
      const initialPaymentPercentField = document.querySelector('#initialPaymentPercent') as HTMLInputElement
      await act(() => userEvent.type(initialPaymentPercentField, 'test'))
      expect(initialPaymentPercentField.value).toEqual('')
      await act(() => userEvent.type(initialPaymentPercentField, '12345'))
      expect(initialPaymentPercentField.value).toEqual('12.34')
    })
  })

  it('Значения из хука useInitialPayment, подключены к форме корректно', () => {
    render(
      <CommonOrderSettings
        disabled={false}
        minInitialPaymentPercent={0}
        maxInitialPaymentPercent={0}
        minInitialPayment={0}
        maxInitialPayment={0}
        currentProduct={undefined}
        loanTerms={[]}
        durationMaxFromAge={0}
        currentDurationMin={0}
        currentDurationMax={0}
        isGetCarsLoading={true}
        isGetCarsSuccess={true}
      />,
      {
        wrapper: createWrapper,
      },
    )

    const initialPaymentInput = document.querySelector('#initialPayment') as HTMLInputElement
    const initialPaymentPercent = document.querySelector('#initialPaymentPercent') as HTMLInputElement

    fireEvent.focus(initialPaymentInput)
    expect(mockedHandleInitialPaymentFocus).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentFocus).toHaveBeenCalledTimes(0)
    expect(mockedHandleInitialPaymentBlur).toHaveBeenCalledTimes(0)
    expect(mockedHandleInitialPaymentPercentBlur).toHaveBeenCalledTimes(0)

    fireEvent.blur(initialPaymentInput)
    expect(mockedHandleInitialPaymentFocus).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentFocus).toHaveBeenCalledTimes(0)
    expect(mockedHandleInitialPaymentBlur).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentBlur).toHaveBeenCalledTimes(0)

    fireEvent.focus(initialPaymentPercent)
    expect(mockedHandleInitialPaymentFocus).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentFocus).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentBlur).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentBlur).toHaveBeenCalledTimes(0)

    fireEvent.blur(initialPaymentPercent)
    expect(mockedHandleInitialPaymentFocus).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentFocus).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentBlur).toHaveBeenCalledTimes(1)
    expect(mockedHandleInitialPaymentPercentBlur).toHaveBeenCalledTimes(1)
  })
})
