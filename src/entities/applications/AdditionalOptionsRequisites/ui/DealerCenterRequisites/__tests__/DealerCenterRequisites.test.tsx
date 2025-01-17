import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { FieldLabels } from 'shared/constants/fieldLabels'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { editRequisitesValidationSchema } from '../../../configs/editRequisitesValidation'
import { DealerCenterRequisites } from '../DealerCenterRequisites'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))
jest.mock('shared/ui/SwitchInput/SwitchInput', () => ({
  SwitchInput: MockedSwitchInput,
}))

const mockedDealerCenterFields = {
  legalPersonCode: '',
  loanAmount: '',
  bankIdentificationCode: '',
  beneficiaryBank: '',
  bankAccountNumber: '',
  correspondentAccount: '',
  taxPresence: true,
  taxation: '',
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedDealerCenterFields}
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

describe('DealerCenterRequisitesTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(<DealerCenterRequisites isRequisiteEditable={false} />, {
        wrapper: createWrapper,
      })
    })

    it('Отображается поле "Юридическое лицо"', () => {
      expect(screen.getByTestId('legalPersonCode')).toBeInTheDocument()
    })

    it('Отображается поле "Сумма кредита"', () => {
      expect(screen.getByTestId('loanAmount')).toBeInTheDocument()
    })

    it('Отображается поле "Банк получатель"', () => {
      expect(screen.getByTestId('beneficiaryBank')).toBeInTheDocument()
    })

    it('Отображается поле "Расчетный счет"', () => {
      expect(screen.getByTestId('bankAccountNumber')).toBeInTheDocument()
    })

    //Тесты отключены, пока выключен ручной ввод

    // it('Отображается switch "Ввести вручную"', () => {
    //   expect(screen.getByText(FieldLabels.MANUAL_ENTRY)).toBeInTheDocument()
    // })

    // it('Поле Кор. счет отображается, если включен ручной ввод', async () => {
    //   expect(screen.queryByTestId('correspondentAccount')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText(FieldLabels.MANUAL_ENTRY))
    //   expect(await screen.findByTestId('correspondentAccount')).toBeInTheDocument()
    // })

    // it('Radio для выбора налога отображаются, если включен ручной ввод', async () => {
    //   expect(screen.queryByText('С НДС')).not.toBeInTheDocument()
    //   expect(screen.queryByText('Без НДС')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText(FieldLabels.MANUAL_ENTRY))
    //   expect(await screen.findByText('С НДС')).toBeInTheDocument()
    //   expect(await screen.findByText('Без НДС')).toBeInTheDocument()
    // })

    // it('Поле "Налог" отображается, если включен ручной ввод', async () => {
    //   expect(screen.queryByTestId('taxation')).not.toBeInTheDocument()
    //   userEvent.click(screen.getByText(FieldLabels.MANUAL_ENTRY))
    //   expect(await screen.findByTestId('taxation')).toBeInTheDocument()
    // })

    it('Поле "Расчетный счет" заблокировано, если банк не выбран', () => {
      expect(screen.getByTestId('bankAccountNumber')).not.toBeEnabled()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(<DealerCenterRequisites isRequisiteEditable={false} />, {
        wrapper: createWrapper,
      })
      // userEvent.click(screen.getByText(FieldLabels.MANUAL_ENTRY))
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Валидируется поле "Юридическое лицо"', async () => {
      expect(await screen.findByTestId('legalPersonCodeErrorMessage')).toBeInTheDocument()
    })

    it('Валидируется поле "Банк получатель"', async () => {
      expect(await screen.findByTestId('beneficiaryBankErrorMessage')).toBeInTheDocument()
    })

    it('Валидируется поле "Расчетный счет"', async () => {
      expect(await screen.findByTestId('bankAccountNumberErrorMessage')).toBeInTheDocument()
    })

    //Тесты отключены, пока выключен ручной ввод

    // it('Валидируется поле "БИК"', async () => {
    //   expect(await screen.findByTestId('bankIdentificationCodeErrorMessage')).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Кор. счет"', async () => {
    //   expect(await screen.findByTestId('correspondentAccountErrorMessage')).toBeInTheDocument()
    // })
    //
    // it('Валидируется поле "Налог"', async () => {
    //   userEvent.click(screen.getByText('С НДС'))
    //   expect(await screen.findByTestId('taxationErrorMessage')).toBeInTheDocument()
    // })
  })
})
