import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { PreparedAdditionalEquipmentForFinancingMap } from 'entities/application/DossierAreas/hooks/useRequisitesForFinancingQuery'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { RequisitesAdditionalOptions } from '../../../__tests__/mocks/clientDetailedDossier.mock'
import { editRequisitesValidationSchema } from '../../../configs/editRequisitesValidation'
import { AdditionalEquipmentRequisites } from '../AdditionalEquipmentRequisites'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))
jest.mock('shared/ui/SwitchInput/SwitchInput', () => ({
  SwitchInput: MockedSwitchInput,
}))

const mockedRequisites: PreparedAdditionalEquipmentForFinancingMap = {
  optionId: 1,
  optionType: 2,
  vendorsWithoutBroker: [
    {
      vendorCode: '2002703288',
      vendorName: 'Парини',
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
  vendorsWithoutBrokerMap: {
    2002703288: {
      vendorCode: '2002703288',
      vendorName: 'Тест3',
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
      },
    },
  },
}

const mockedAdditionalEquipmentFields = {
  additionalEquipments: [
    {
      optionType: 'additionalEquipment',
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
      taxation: '',
      isCredit: true,
      taxPercent: null,
      taxValue: null,
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
      initialValues={mockedAdditionalEquipmentFields}
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

describe('AdditionalEquipmentRequisitesTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(
        <AdditionalEquipmentRequisites
          optionRequisite={mockedRequisites}
          index={0}
          isRequisiteEditable={false}
          parentName={ServicesGroupName.additionalEquipments}
          equipmentItem={mockedAdditionalEquipmentFields.additionalEquipments[0]}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Отображается поле "Тип доп оборудования"', () => {
      expect(screen.getByTestId('additionalEquipments[0].productType')).toBeInTheDocument()
    })

    it('Отображается поле "Стоимость"', () => {
      expect(screen.getByTestId('additionalEquipments[0].productCost')).toBeInTheDocument()
    })

    it('Отображается switch "В кредит"', () => {
      expect(screen.getByTestId('additionalEquipments[0].isCredit')).toBeInTheDocument()
    })

    it('Отображается поле "Юридическое лицо"', () => {
      expect(screen.getByTestId('additionalEquipments[0].legalPerson')).toBeInTheDocument()
    })

    it('Отображается поле "Банк получатель"', () => {
      expect(screen.getByTestId('additionalEquipments[0].beneficiaryBank')).toBeInTheDocument()
    })

    it('Отображается поле "Расчетный счет"', () => {
      expect(screen.getByTestId('additionalEquipments[0].bankAccountNumber')).toBeInTheDocument()
    })

    //Тесты отключены, пока выключен ручной ввод

    // it('Отображается switch "Ввести вручную"', () => {
    //   expect(screen.getByText('Ввести вручную')).toBeInTheDocument()
    // })

    // it('Отображается поле "БИК"', () => {
    //   expect(screen.getByTestId('additionalEquipments[0].bankIdentificationCode')).toBeInTheDocument()
    // })
    //
    // it('Поле "Расчетный счет" отображается, если включен ручной ввод', async () => {
    //   expect(screen.queryByTestId('additionalEquipment[0].correspondentAccount')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText('Ввести вручную'))
    //   expect(await screen.findByTestId('additionalEquipments[0].correspondentAccount')).toBeInTheDocument()
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
    //   expect(screen.queryByTestId('additionalEquipments[0].taxation')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText('Ввести вручную'))
    //   expect(await screen.findByTestId('additionalEquipments[0].taxation')).toBeInTheDocument()
    // })

    it('Поле "Расчетный счет" заблокировано, если банк не выбран', () => {
      expect(screen.getByTestId('additionalEquipments[0].bankAccountNumber')).not.toBeEnabled()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(
        <AdditionalEquipmentRequisites
          optionRequisite={mockedRequisites}
          index={0}
          isRequisiteEditable={false}
          parentName={ServicesGroupName.additionalEquipments}
          equipmentItem={mockedAdditionalEquipmentFields.additionalEquipments[0]}
        />,
        {
          wrapper: createWrapper,
        },
      )
      // userEvent.click(screen.getByText('Ввести вручную'))
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Валидируется поле "Тип доп оборудования"', async () => {
      expect(await screen.findByTestId('additionalEquipments[0].productTypeErrorMessage')).toBeInTheDocument()
    })

    it('Валидируется поле "Стоимость"', async () => {
      fireEvent.change(screen.getByTestId('additionalEquipments[0].productCost'), { target: { value: '' } })
      expect(await screen.findByTestId('additionalEquipments[0].productCostErrorMessage')).toBeInTheDocument()
    })

    it('Валидируется поле "Юридическое лицо"', async () => {
      expect(await screen.findByTestId('additionalEquipments[0].legalPersonErrorMessage')).toBeInTheDocument()
    })

    //Тесты отключены, пока выключен ручной ввод

    // it('Валидируется поле "БИК"', async () => {
    //   expect(
    //     await screen.findByTestId('additionalEquipments[0].bankIdentificationCodeErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Банк получатель"', async () => {
    //   expect(
    //     await screen.findByTestId('additionalEquipments[0].beneficiaryBankErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Расчетный счет"', async () => {
    //   expect(
    //     await screen.findByTestId('additionalEquipments[0].bankAccountNumberErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Расчетный счет"', async () => {
    //   expect(
    //     await screen.findByTestId('additionalEquipments[0].correspondentAccountErrorMessage'),
    //   ).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Налог"', async () => {
    //   userEvent.click(screen.getByText('С НДС'))
    //   expect(await screen.findByTestId('additionalEquipments[0].taxationErrorMessage')).toBeInTheDocument()
    // })
  })
})
