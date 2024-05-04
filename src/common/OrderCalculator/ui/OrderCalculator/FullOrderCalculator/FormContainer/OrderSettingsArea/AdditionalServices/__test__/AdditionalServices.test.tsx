import { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, Form } from 'formik'

import {
  FormFieldNameMap,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { fullOrderFormValidationSchema } from '../../../../fullOrderFormValidation.utils'
import { AdditionalServices } from '../AdditionalServices'

disableConsole('error')
disableConsole('warn')

const mockedInitialValues = {
  [FormFieldNameMap.carCost]: '1000',
  [ServicesGroupName.additionalEquipments]: [
    { productType: 1, productCost: '100', isCredit: true },
    { productType: 2, productCost: '200', isCredit: true },
  ],
  [ServicesGroupName.dealerAdditionalServices]: [
    { productType: 15, productCost: '', isCredit: false, cascoLimit: '1299' },
  ],
  [FormFieldNameMap.commonError]: { isExceededServicesTotalLimit: false },
  [FormFieldNameMap.validationParams]: { isNecessaryCasco: true },
}

const createWrapper =
  (additionalData?: Partial<FullOrderCalculatorFields>) =>
  ({ children }: PropsWithChildren) =>
    (
      <ThemeProviderMock>
        <Formik
          initialValues={{ ...mockedInitialValues, ...additionalData }}
          validationSchema={fullOrderFormValidationSchema}
          onSubmit={() => {}}
        >
          <Form>
            {children}
            <Button type="submit" data-testid="submit" />
          </Form>
        </Formik>
      </ThemeProviderMock>
    )

describe('FullAdditionalServices', () => {
  it.todo('Раздробить FullOrderCalculator и часть тестов вынести сюда')

  describe('Валидация основных полей формы работает корректно', () => {
    it('Если Сумма покрытия КАСКО ниже суммы авто и доп. оборудования', async () => {
      render(<AdditionalServices options={{ productType: [], loanTerms: [] }} isNecessaryCasco />, {
        wrapper: createWrapper(),
      })
      userEvent.click(screen.getByTestId('submit'))

      expect(screen.queryByText('Сумма покрытия КАСКО')).toBeInTheDocument()
      expect(
        await screen.findAllByText('Сумма покрытия должна быть больше или равна сумме залога'),
      ).toHaveLength(1)
    })

    it('Если Сумма покрытия КАСКО выше суммы авто и доп. оборудования', async () => {
      render(<AdditionalServices options={{ productType: [], loanTerms: [] }} isNecessaryCasco />, {
        wrapper: createWrapper({
          [ServicesGroupName.dealerAdditionalServices]: [
            {
              productType: 15,
              productCost: '',
              isCredit: false,
              cascoLimit: '1300',
            } as FullInitialAdditionalService,
          ],
        }),
      })
      userEvent.click(screen.getByTestId('submit'))

      expect(
        screen.queryByText('Сумма покрытия должна быть больше или равна сумме залога'),
      ).not.toBeInTheDocument()
    })
  })
})
