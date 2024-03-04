import { PropsWithChildren } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'
import { UseQueryResult } from 'react-query'

import { ADDRESS_MAP } from 'pages/CreateOrder/ClientForm/hooks/__tests__/useGetAddressMapQuery.mock'
import * as useGetAddressMapQueryModule from 'pages/CreateOrder/ClientForm/hooks/useGetAddressMapQuery'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { Address, AddressMap } from '../../../ClientForm.types'
import { AddressDialog } from '../AddressDialog'

const mockedUseGetAddressMapQuery = jest.spyOn(useGetAddressMapQueryModule, 'useGetAddressMapQuery')

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
type Props = {
  id: string
  isError: boolean
}
jest.mock('shared/ui/AutocompleteInput/AutocompleteInput', () => ({
  AutocompleteInput: ({ id, isError }: Props) => (
    <div data-testid={id}>{isError && <div data-testid={id + 'ErrorMessage'} />}</div>
  ),
}))

const formFields = [
  'unit',
  'city',
  'cityType',
  'area',
  'areaType',
  'house',
  'regCode',
  'street',
  'streetType',
  'settlement',
  'settlementType',
]

const mockedAddressFieldsEmpty: Address = {
  postalCode: '',
  regCode: '',
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
  postalCode: '123456',
  regCode: '27',
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
  beforeEach(() => {
    mockedUseGetAddressMapQuery.mockImplementation(
      () =>
        ({
          data: ADDRESS_MAP,
          isLoading: false,
        } as unknown as UseQueryResult<AddressMap, unknown>),
    )
  })
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

    it('Поле "regCode" валидируется', async () => {
      expect(await screen.findByTestId('regCodeErrorMessage')).toBeInTheDocument()
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
