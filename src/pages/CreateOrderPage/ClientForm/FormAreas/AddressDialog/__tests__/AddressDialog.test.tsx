import React, { PropsWithChildren } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { Address } from '../../../ClientForm.types'
import { AddressDialog } from '../AddressDialog'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))

const formFields = [
  'unit',
  'city',
  'cityType',
  'area',
  'areaType',
  'house',
  'region',
  'street',
  'streetType',
  'settlement',
  'settlementType',
]

const mockedAddressFieldsEmpty: Address = {
  unit: '',
  city: '',
  cityType: '',
  area: '',
  areaType: '',
  house: '',
  region: '',
  street: '',
  streetType: '',
  settlement: '',
  settlementType: '',
  houseExt: '',
  unitNum: '',
}

const mockedAddressFieldsFilled: Address = {
  unit: 'Тест',
  city: 'Тест',
  cityType: '310',
  area: 'Тест',
  areaType: '201',
  house: 'Тест',
  region: 'Тест',
  street: 'Тест',
  streetType: '501',
  settlement: 'Тест',
  settlementType: '403',
  houseExt: 'Тест',
  unitNum: 'Тест',
}

const submitForm = jest.fn()
const closeForm = jest.fn()

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik initialValues={{ testAddress: mockedAddressFieldsEmpty }} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('AddressDialogTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(
        <AddressDialog
          isVisible={true}
          address={mockedAddressFieldsEmpty}
          label="Тестовый адрес"
          setIsVisible={closeForm}
          addressName="testAddress"
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Заголовок формы отображатеся', () => {
      expect(screen.getByText('Тестовый адрес')).toBeInTheDocument()
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" отображается на форме`, () => {
        expect(screen.getByTestId(`${fieldName}`)).toBeInTheDocument()
      })
    }

    it('Кнопка "Сохранить" отображается на форме', () => {
      expect(screen.getByText('Сохранить')).toBeInTheDocument()
    })
  })

  describe('Форма валидируется и сохраняется', () => {
    beforeEach(() => {
      render(
        <AddressDialog
          isVisible={true}
          address={mockedAddressFieldsEmpty}
          label="Тестовый адрес"
          setIsVisible={closeForm}
          addressName="testAddress"
        />,
        {
          wrapper: createWrapper,
        },
      )
      userEvent.click(screen.getByText('Сохранить'))
    })

    it('Поле "region" валидируется', async () => {
      expect(await screen.findByTestId('regionErrorMessage')).toBeInTheDocument()
    })

    it('Поле "city" валидируется', async () => {
      expect(await screen.findByTestId('cityErrorMessage')).toBeInTheDocument()
    })

    it('Поле "settlement" валидируется', async () => {
      expect(await screen.findByTestId('settlementErrorMessage')).toBeInTheDocument()
    })

    it('Поле "streetType" валидируется', async () => {
      expect(await screen.findByTestId('streetTypeErrorMessage')).toBeInTheDocument()
    })

    it('Поле "house" валидируется', async () => {
      expect(await screen.findByTestId('houseErrorMessage')).toBeInTheDocument()
    })
  })

  describe('Форма сохраняется', () => {
    beforeEach(() => {
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: submitForm,
          } as any),
      )
      render(
        <AddressDialog
          isVisible={true}
          address={mockedAddressFieldsFilled}
          label="Тестовый адрес"
          setIsVisible={closeForm}
          addressName="testAddress"
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('При нажатии на "Сохранить" форма сохраняется и диалог закрывается', async () => {
      userEvent.click(screen.getByText('Сохранить'))
      await waitFor(async () => expect(submitForm).toBeCalledTimes(2))
      await waitFor(async () => expect(closeForm).toBeCalledTimes(1))
    })
  })
})
