import { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, Form } from 'formik'
import { act } from 'react-dom/test-utils'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import * as useCarYearsModule from 'common/OrderCalculator/hooks/useCarYears'
import { FieldLabels } from 'shared/constants/fieldLabels'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { fullOrderFormValidationSchema } from '../../../fullOrderFormValidation.utils'
import { CarSettingsArea } from '../CarSettingsArea'
import { FieldMessages } from 'shared/constants/fieldMessages'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const previousYear = currentDate.getFullYear() - 1
const currentDateString = `3112${currentDate.getFullYear()}`

jest.mock('entities/pointOfSale')
jest.mock('shared/hooks/useScrollToErrorField')
disableConsole('error')

jest.mock('common/OrderCalculator/hooks/useCarBrands.ts', () => ({
  useCarBrands: () => ({
    carBrands: ['BMW', 'Fiat'],
    carModels: ['1 series', '3 series'],
    isDisabledCarModel: false,
    isCarsLoading: false,
    isCarLoaded: true,
    isCarError: false,
  }),
}))

const mockedUseCarYears = jest.spyOn(useCarYearsModule, 'useCarYears')

const FORM_FIELDS = [
  'Состояние',
  'Марка',
  'Модель',
  'Год выпуска',
  'Стоимость',
  'Пробег, тыс. км',
  'Тип ПТС',
  'Серия и номер ПТС',
  'Дата выдачи ПТС',
  'VIN или номер кузова',
  'Номер VIN/кузова',
  'Номер ДКП',
  'Дата ДКП',
]

const createWrapper = ({ children }: PropsWithChildren) => (
  <MockProviders>
    <Formik
      initialValues={{ ...fullInitialValueMap, carYear: undefined }}
      onSubmit={() => {}}
      validationSchema={fullOrderFormValidationSchema}
    >
      <Form>
        {children}
        <Button type="submit" data-testid="submit" />
      </Form>
    </Formik>
  </MockProviders>
)

describe('CarSettingsArea', () => {
  const fn = jest.fn()
  beforeEach(() => {
    mockedUseCarYears.mockImplementation(() => ({
      carYears: [{ value: currentYear }, { value: previousYear }],
    }))
  })

  describe('Форма отображается корректно', () => {
    it('Отображается кнопка Показать, если visibleFooter=true', () => {
      render(<CarSettingsArea onFilled={fn} visibleFooter={true} isLoading={false} />, {
        wrapper: createWrapper,
      })
      expect(screen.getByText('Показать')).toBeInTheDocument()
    })

    it('Не отображается кнопка Показать, если visibleFooter=false', () => {
      render(<CarSettingsArea onFilled={fn} visibleFooter={false} isLoading={false} />, {
        wrapper: createWrapper,
      })
      expect(screen.queryByText('Показать')).not.toBeInTheDocument()
    })

    it('Основные и дополнительные поля присутствуют на форме', () => {
      render(<CarSettingsArea onFilled={fn} visibleFooter={true} isLoading={false} />, {
        wrapper: createWrapper,
      })
      for (const fieldName of FORM_FIELDS) {
        expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
      }
    })
  })

  describe('Валидация работает корректно', () => {
    beforeEach(() => {
      render(<CarSettingsArea onFilled={fn} visibleFooter={true} isLoading={false} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      // TODO DCB-1410 DealerCenterRequisites вынести в отдельные тесты,
      // чтобы не учитывать их поля в данном тесте
      // (вероятно придется создать отдельный компонент для оставшихся полей)
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)

      // Если состояние "Б/У", то поле Пробег тоже обязательное
      userEvent.click(screen.getByText('Новый'))
      await act(async () => userEvent.click(await screen.findByText('Б/У')))
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
    })

    it('Поле стоимость - принимает только числа', async () => {
      const carCostField = document.querySelector('#carCost')!
      await act(() => userEvent.type(carCostField, 'test'))
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      await act(() => userEvent.type(carCostField, '12'))
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(13)
    })

    it('Поле пробег - принимает только числа', async () => {
      userEvent.click(screen.getByText('Новый'))
      await act(async () => userEvent.click(await screen.findByText('Б/У')))
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)

      const carMileageField = document.querySelector('#carMileage')!
      await act(() => userEvent.type(carMileageField, 'test'))
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
      await act(() => userEvent.type(carMileageField, '12'))
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
    })

    it('Поле Серия и номер ПТС - принимает только числа если електронный ПТС', async () => {
      userEvent.click(screen.getByTestId('carPassportType').firstElementChild as Element)
      await act(async () => userEvent.click(await screen.findByText('ЭПТС')))
      const carPassportIdField = document.querySelector('#carPassportId')!
      await act(() => userEvent.type(carPassportIdField, 'test'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, '12'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, '3123412341234'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Поле Серия и номер ПТС - принимает числа и русские буквы если бумажный ПТС', async () => {
      userEvent.click(screen.getByTestId('carPassportType').firstElementChild as Element)
      await act(async () => userEvent.click(await screen.findByText('Бумажный')))
      const carPassportIdField = document.querySelector('#carPassportId')!
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, '1234'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, 'яч123123'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Дата выдачи ПТС не превышает дату выпуска автомобиля', async () => {
      const carBrand = screen.getByTestId('carBrand')
      const carBrandBtn = carBrand.querySelector('button')
      userEvent.click(carBrandBtn as Element)
      await act(() => {})
      userEvent.click(await screen.findByText('BMW'))

      userEvent.click(screen.getByTestId('carYear').firstElementChild as Element)
      userEvent.click(await screen.findByText(previousYear))

      const carPassportCreationDateField = document.getElementById('carPassportCreationDate')!

      userEvent.clear(carPassportCreationDateField)
      userEvent.type(carPassportCreationDateField, '10101900')
      await act(() => {})
      expect(
        await screen.findByText('Дата выдачи ПТС не может превышать дату выпуска автомобиля'),
      ).toBeInTheDocument()

      userEvent.clear(carPassportCreationDateField)
      userEvent.type(carPassportCreationDateField, currentDateString)
      await act(() => {})
      expect(
        screen.queryByText('Дата выдачи ПТС не может превышать дату выпуска автомобиля'),
      ).not.toBeInTheDocument()
    })

    it('Дата ДКП не превышает дату выпуска автомобиля', async () => {
      const carBrand = screen.getByTestId('carBrand')
      const carBrandBtn = carBrand.querySelector('button')
      userEvent.click(carBrandBtn as Element)
      await act(() => {})
      userEvent.click(await screen.findByText('BMW'))

      userEvent.click(screen.getByTestId('carYear').firstElementChild as Element)
      userEvent.click(await screen.findByText(previousYear))

      const salesContractDateField = document.getElementById('salesContractDate')!

      userEvent.clear(salesContractDateField)
      userEvent.type(salesContractDateField, '10101900')
      await act(() => {})
      expect(screen.queryByText('Дата ДКП не может превышать дату выпуска автомобиля')).toBeInTheDocument()

      userEvent.clear(salesContractDateField)
      userEvent.type(salesContractDateField, currentDateString)
      await act(() => {})
      expect(
        screen.queryByText('Дата ДКП не может превышать дату выпуска автомобиля'),
      ).not.toBeInTheDocument()
    })

    it('Поле Номер VIN/кузова - принимает только числа и латиницу', async () => {
      const carIdField = document.querySelector('#carId')!
      await act(() => userEvent.type(carIdField, 'Ы'))
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      await act(() => userEvent.type(carIdField, '12'))
      // TODO DCB-1720 Разблокировать после исправления проблемы
      // expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(13)
      expect(await screen.findByText(FieldMessages.vinError)).toBeInTheDocument()
      await act(() => userEvent.type(carIdField, 'TEST12312312312'))
      expect(screen.queryByText(FieldMessages.vinError)).not.toBeInTheDocument()
    })

    // TODO DCB-1410 DealerCenterRequisites вынести в отдельные тесты
    //Тесты выключены, пока отключен ручной ввод

    // it('Поле БИК - принимает только числа', async () => {
    //   await act(() => userEvent.click(screen.getAllByText(FieldLabels.MANUAL_ENTRY)[0]))
    //   expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    //   const bankIdentificationCodeField = document.getElementById('bankIdentificationCode')!
    //   await act(() => userEvent.type(bankIdentificationCodeField, 'Test'))
    //   expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    // })
    //
    // it('Поле БИК - ожидает ввода 9 цифр', async () => {
    //   await act(() => userEvent.click(screen.getAllByText(FieldLabels.MANUAL_ENTRY)[0]))
    //   const bankIdentificationCodeField = document.getElementById('bankIdentificationCode')!
    //   await act(() => userEvent.type(bankIdentificationCodeField, '12341234'))
    //   expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
    //   await act(() => userEvent.type(bankIdentificationCodeField, '1'))
    //   expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    // })
    //
    // it('Поле Расчетный счет - принимает только числа', async () => {
    //   await act(() => userEvent.click(screen.getAllByText(FieldLabels.MANUAL_ENTRY)[0]))
    //   expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    //   const bankAccountNumberField = document.getElementById('bankAccountNumber')!
    //   await act(() => userEvent.type(bankAccountNumberField, 'Test'))
    //   expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    // })
    //
    // it('Поле Расчетный счет - ожидает ввода 20 цифр', async () => {
    //   await act(() => userEvent.click(screen.getAllByText(FieldLabels.MANUAL_ENTRY)[0]))
    //   const bankAccountNumberField = document.getElementById('bankAccountNumber')!
    //   await act(() => userEvent.type(bankAccountNumberField, '1234123412341234123'))
    //   expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
    //   await act(() => userEvent.type(bankAccountNumberField, '1'))
    //   expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    // }, 10000)
    //
    // it('Поле Корреспондентский счет - принимает только числа', async () => {
    //   await act(() => userEvent.click(screen.getAllByText(FieldLabels.MANUAL_ENTRY)[0]))
    //   expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    //   const correspondentAccountField = document.getElementById('correspondentAccount')!
    //   await act(() => userEvent.type(correspondentAccountField, 'Test'))
    //   expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    // }, 10000)
    //
    // it('Поле Корреспондентский счет - ожидает ввода 20 цифр', async () => {
    //   await act(() => userEvent.click(screen.getAllByText(FieldLabels.MANUAL_ENTRY)[0]))
    //   const correspondentAccountField = document.getElementById('correspondentAccount')!
    //   await act(() => userEvent.type(correspondentAccountField, '1234123412341234123'))
    //   expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
    //   await act(() => userEvent.type(correspondentAccountField, '1'))
    //   expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    // }, 10000)
  })
})
