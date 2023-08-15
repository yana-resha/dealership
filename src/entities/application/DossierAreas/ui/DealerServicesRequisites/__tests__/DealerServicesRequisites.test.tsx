import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { PreparedAdditionalOptionForFinancingMap } from 'entities/application/DossierAreas/hooks/useRequisitesForFinancingQuery'
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

const mockedRequisites: PreparedAdditionalOptionForFinancingMap = {
  optionType: 1,
  optionId: 25,
  vendorsWithBroker: [
    {
      vendorCode: '2002703288',
      vendorName: 'Парини',
      tax: 0.13,
      brokers: [
        {
          brokerCode: '111',
          brokerName: 'Тест1',
          tax: 0.13,
          requisites: [
            {
              bankName: 'Тинькофф',
              bik: '044525974',
              accountCorrNumber: '23298374562932784',
              ogrn: '',
              kpp: '24356243562',
              inn: '34573457',
              accounts: ['2387945697'],
            },
          ],
        },
      ],
    },
  ],
  vendorsWithBrokerMap: {
    2002703288: {
      vendorCode: '2002703288',
      vendorName: 'Тест3',
      tax: 0.13,
      brokers: [
        {
          brokerCode: '111',
          brokerName: 'Тест1',
          tax: 0.13,
          requisites: [
            {
              bankName: 'Тинькофф',
              bik: '044525974',
              accountCorrNumber: '23298374562932784',
              ogrn: '',
              kpp: '24356243562',
              inn: '34573457',
              accounts: ['2387945697'],
            },
            {
              bankName: 'Сбер',
              bik: '044525225',
              accountCorrNumber: '92384765203475602',
              ogrn: '',
              kpp: '23462346',
              inn: '34573457',
              accounts: ['1793845697', '2374569834', '2374659837', '2378456987'],
            },
            {
              bankName: 'Альфа',
              bik: '044525593',
              accountCorrNumber: '23984765892374569',
              ogrn: '',
              kpp: '23462346',
              inn: '3457345',
              accounts: ['1378456987', '2783465972'],
            },
          ],
        },
      ],
      brokersMap: {
        111: {
          brokerCode: '111',
          brokerName: 'Тест1',
          tax: 0.13,
          requisites: [
            {
              bankName: 'Тинькофф',
              bik: '044525974',
              accountCorrNumber: '23298374562932784',
              ogrn: '',
              kpp: '24356243562',
              inn: '34573457',
              accounts: ['2387945697'],
            },
            {
              bankName: 'Сбер',
              bik: '044525225',
              accountCorrNumber: '92384765203475602',
              ogrn: '',
              kpp: '23462346',
              inn: '34573457',
              accounts: ['1793845697', '2374569834', '2374659837', '2378456987'],
            },
            {
              bankName: 'Альфа',
              bik: '044525593',
              accountCorrNumber: '23984765892374569',
              ogrn: '',
              kpp: '23462346',
              inn: '3457345',
              accounts: ['1378456987', '2783465972'],
            },
          ],
          requisitesMap: {
            Тинькофф: {
              bankName: 'Тинькофф',
              bik: '044525974',
              accountCorrNumber: '23298374562932784',
              ogrn: '',
              kpp: '24356243562',
              inn: '34573457',
              accounts: ['2387945697'],
            },
            Сбер: {
              bankName: 'Сбер',
              bik: '044525225',
              accountCorrNumber: '92384765203475602',
              ogrn: '',
              kpp: '23462346',
              inn: '34573457',
              accounts: ['1793845697', '2374569834', '2374659837', '2378456987'],
            },
            Альфа: {
              bankName: 'Альфа',
              bik: '044525593',
              accountCorrNumber: '23984765892374569',
              ogrn: '',
              kpp: '23462346',
              inn: '3457345',
              accounts: ['1378456987', '2783465972'],
            },
          },
        },
      },
    },
  },
}

const mockedDealerServicesFields = {
  dealerAdditionalServices: [
    {
      optionType: 'dealerServices',
      productType: null,
      legalPerson: '',
      provider: '',
      agent: '',
      productCost: '0',
      loanTerm: 0,
      bankIdentificationCode: '',
      beneficiaryBank: '',
      correspondentAccount: '',
      bankAccountNumber: '',
      taxPresence: false,
      taxation: undefined,
      isCredit: true,
      taxPercent: null,
      taxValue: null,
      documentNumber: '32ук23к22',
      documentType: 2,
      documentDate: new Date('2023-04-23T00:00:00.000Z'),
      isCustomFields: false,
      agentTaxPercent: null,
      agentTaxValue: null,
      providerTaxPercent: null,
      providerTaxValue: null,
    },
  ],
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedDealerServicesFields}
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
      expect(screen.getByTestId('dealerAdditionalServices[0].agent')).toBeInTheDocument()
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
      expect(await screen.findByTestId('dealerAdditionalServices[0].agentErrorMessage')).toBeInTheDocument()
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
