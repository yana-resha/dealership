import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { RequisitesDealerServices } from '../../../__tests__/mocks/clientDetailedDossier.mock'
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

const mockedRequisites: RequisitesDealerServices[] = [
  {
    provider: '',
    agents: [],
  },
]

const mockedDealerServicesFields = {
  dealerAdditionalServices: [
    {
      optionType: 'dealerServices',
      productType: '',
      legalPerson: '',
      provider: '',
      agent: '',
      productCost: 0,
      loanTerm: 0,
      bankIdentificationCode: '',
      documentId: '',
      beneficiaryBank: '',
      correspondentAccount: '',
      bankAccountNumber: '',
      taxPresence: false,
      taxation: '',
      isCredit: true,
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
          requisites={mockedRequisites}
          index={0}
          isRequisiteEditable={false}
          parentName={ServicesGroupName.dealerAdditionalServices}
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

    it('Отображается поле "Номер счета банка"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].bankAccountNumber')).toBeInTheDocument()
    })

    it('Отображается switch "Ввести вручную"', () => {
      expect(screen.getByText('Ввести вручную')).toBeInTheDocument()
    })

    it('Отображается поле "Номер полиса"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].documentId')).toBeInTheDocument()
    })

    it('Отображается поле "БИК"', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].bankIdentificationCode')).toBeInTheDocument()
    })

    it('Поле "Кор. счет" отображается, если включен ручной ввод', async () => {
      expect(screen.queryByTestId('dealerAdditionalServices[0].correspondentAccount')).not.toBeInTheDocument()
      userEvent.click(screen.getByText('Ввести вручную'))
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].correspondentAccount'),
      ).toBeInTheDocument()
    })

    it('Radio для выбора налога отображаются, если включен ручной ввод', async () => {
      expect(screen.queryByText('С НДС')).not.toBeInTheDocument()
      expect(screen.queryByText('Без НДС')).not.toBeInTheDocument()
      userEvent.click(screen.getByText('Ввести вручную'))
      expect(await screen.findByText('С НДС')).toBeInTheDocument()
      expect(await screen.findByText('Без НДС')).toBeInTheDocument()
    })

    it('Поле "Налог" отображается, если включен ручной ввод', async () => {
      expect(screen.queryByTestId('dealerAdditionalServices[0].taxation')).not.toBeInTheDocument()
      userEvent.click(screen.getByText('Ввести вручную'))
      expect(await screen.findByTestId('dealerAdditionalServices[0].taxation')).toBeInTheDocument()
    })

    it('Поле "Банк получатель" заблокировано, если агент не выбран', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].beneficiaryBank')).not.toBeEnabled()
    })

    it('Поле "Номер счета банка" заблокировано, если банк не выбран', () => {
      expect(screen.getByTestId('dealerAdditionalServices[0].bankAccountNumber')).not.toBeEnabled()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(
        <DealerServicesRequisites
          requisites={mockedRequisites}
          index={0}
          isRequisiteEditable={false}
          parentName={ServicesGroupName.dealerAdditionalServices}
        />,
        {
          wrapper: createWrapper,
        },
      )
      userEvent.click(screen.getByText('Ввести вручную'))
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

    it('Валидируется поле "Номер полиса"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].documentIdErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "БИК"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].bankIdentificationCodeErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Банк получатель"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].beneficiaryBankErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Номер счета банка"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].bankAccountNumberErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Кор. счет"', async () => {
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].correspondentAccountErrorMessage'),
      ).toBeInTheDocument()
    })

    it('Валидируется поле "Налог"', async () => {
      userEvent.click(screen.getByText('С НДС'))
      expect(
        await screen.findByTestId('dealerAdditionalServices[0].taxationErrorMessage'),
      ).toBeInTheDocument()
    })
  })
})
