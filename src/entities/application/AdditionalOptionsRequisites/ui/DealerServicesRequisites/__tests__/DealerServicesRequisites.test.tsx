import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { FullInitialAdditionalService } from 'common/OrderCalculator/types'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { editRequisitesValidationSchema } from '../../../configs/editRequisitesValidation'
import { DealerServicesRequisites } from '../DealerServicesRequisites'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))
jest.mock('shared/ui/SwitchInput/SwitchInput', () => ({
  SwitchInput: MockedSwitchInput,
}))

const mockedDealerServicesFields: { dealerAdditionalServices: FullInitialAdditionalService[] } = {
  dealerAdditionalServices: [
    {
      productType: null,
      provider: null,
      providerName: undefined,
      broker: null,
      brokerName: undefined,
      productCost: '0',
      loanTerm: 0,
      bankIdentificationCode: '',
      beneficiaryBank: '',
      correspondentAccount: '',
      bankAccountNumber: '',
      taxPresence: false,
      taxation: undefined,
      isCredit: true,
      taxPercent: undefined,
      taxValue: undefined,
      documentNumber: '32ук23к22',
      documentType: 2,
      documentDate: new Date('2023-04-23T00:00:00.000Z'),
      isCustomFields: false,
    },
  ],
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedDealerServicesFields}
      // TODO DCB-1410 переделать тесты - editRequisitesValidationSchema - должен браться из калькулятора
      validationSchema={editRequisitesValidationSchema}
      onSubmit={() => {}}
    >
      <Form>
        {children}
        <Button type="submit" data-testid="submit" />
      </Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('DealerServicesRequisitesTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(
        <DealerServicesRequisites
          index={0}
          arrayLength={1}
          isRequisiteEditable={false}
          parentName={ServicesGroupName.dealerAdditionalServices}
          servicesItem={mockedDealerServicesFields.dealerAdditionalServices[0]}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Отображается поле "Тип продукта"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].productType')).toBeInTheDocument()
    })

    it('Отображается поле "Страховая компания"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].provider')).toBeInTheDocument()
    })

    it('Отображается switch "В кредит"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].isCredit')).toBeInTheDocument()
    })

    it('Отображается поле "Имя агента"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].broker')).toBeInTheDocument()
    })

    it('Отображается поле "Срок"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].loanTerm')).toBeInTheDocument()
    })

    it('Отображается поле "Стоимость"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].productCost')).toBeInTheDocument()
    })

    it('Отображается поле "Банк получатель"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].beneficiaryBank')).toBeInTheDocument()
    })

    it('Отображается поле "Расчетный счет"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].bankAccountNumber')).toBeInTheDocument()
    })

    //Тесты отключены, пока выключен ручной ввод

    // it('Отображается switch "Ввести вручную"', () => {
    //   expect(screen.getByText('Ввести вручную')).toBeInTheDocument()
    // })
    //
    // it('Отображается поле "БИК"', () => {
    //   expect(screen.getByTestId('dealerAdditionalServices[0].bankIdentificationCode')).toBeInTheDocument()
    // })
    //
    // it('Поле "Кор. счет" отображается, если включен ручной ввод', async () => {
    //   expect(screen.queryByTestId('dealerAdditionalServices[0]
    //   .correspondentAccount')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText('Ввести вручную'))
    //   expect(
    //     await screen.findByTestId('dealerAdditionalServices[0].correspondentAccount'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Radio для выбора налога отображаются, если включен ручной ввод', async () => {
    //   expect(screen.queryByText('С НДС')).not.toBeInTheDocument()
    //   expect(screen.queryByText('Без НДС')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText('Ввести вручную'))
    //   expect(await screen.findByText('С НДС')).toBeInTheDocument()
    //   expect(await screen.findByText('Без НДС')).toBeInTheDocument()
    // })
    //
    // it('Поле "Налог" отображается, если включен ручной ввод', async () => {
    //   expect(screen.queryByTestId('dealerAdditionalServices[0].taxation')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText('Ввести вручную'))
    //   expect(await screen.findByTestId('dealerAdditionalServices[0].taxation')).toBeInTheDocument()
    // })

    it('Поле "Банк получатель" заблокировано, если агент не выбран', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].beneficiaryBank')).not.toBeEnabled()
    })

    it('Поле "Расчетный счет" заблокировано, если банк не выбран', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].bankAccountNumber')).not.toBeEnabled()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(
        <DealerServicesRequisites
          index={0}
          arrayLength={1}
          isRequisiteEditable={false}
          parentName={ServicesGroupName.dealerAdditionalServices}
          servicesItem={mockedDealerServicesFields.dealerAdditionalServices[0]}
        />,
        {
          wrapper: createWrapper,
        },
      )
      // userEvent.click(screen.getByText('Ввести вручную'))
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Валидируется поле "Тип продукта"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].productTypeErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Страхования компания"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].providerErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Имя агента"', async () => {
      expect(await screen.findByTestId('dealerAdditionalServices[0].brokerErrorMessage')).toBeInTheDocument()
    })

    it('Валидируется поле "Срок"', async () => {
      fireEvent.change(screen.getByTestId('dealerAdditionalServices[0].loanTerm'), { target: { value: '' } })
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].loanTermErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Стоимость"', async () => {
      fireEvent.change(screen.getByTestId('dealerAdditionalServices[0].productCost'), {
        target: { value: '' },
      })
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].productCostErrorMessage'),
      ).toBeInTheDocument()
    })

    //Тесты отключены, пока выключен ручной ввод

    // it('Валидируется поле "БИК"', async () => {
    //   expect(
    //     await screen.findByTestId('dealerAdditionalServices[0].bankIdentificationCodeErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Банк получатель"', async () => {
    //   expect(
    //     await screen.findByTestId('dealerAdditionalServices[0].beneficiaryBankErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Расчетный счет"', async () => {
    //   expect(
    //     await screen.findByTestId('dealerAdditionalServices[0].bankAccountNumberErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Кор. счет"', async () => {
    //   expect(
    //     await screen.findByTestId('dealerAdditionalServices[0].correspondentAccountErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Налог"', async () => {
    //   userEvent.click(screen.getByText('С НДС'))
    //   expect(
    //     await screen.findByTestId('dealerAdditionalServices[0].taxationErrorMessage'),
    //   ).toBeInTheDocument()
    // })
  })
})
