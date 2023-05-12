import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import { sleep } from 'shared/lib/sleep'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { FullOrderCalculator } from '../FullOrderCalculator'
import { additionalEquipments, dealerAdditionalServices, formFields } from './FullOrderCalculator.mock'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')

describe('FullOrderCalculator', () => {
  const fn = jest.fn()

  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      render(<FullOrderCalculator onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Основные и дополнительные поля присутствуют на форме', () => {
      for (const fieldName of formFields) {
        switch (fieldName) {
          case 'Стоимость':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Юридическое лицо':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          case 'БИК':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Банк получатель денежных средств':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Номер счета банка':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Страховая компания или поставщик':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          case 'Агент':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          case 'Тип продукта':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          default:
            expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
            break
        }
      }

      // Проверка наличия дополнительных полей блока BankDetails
      expect(screen.queryByText('Корреспондентский счет')).not.toBeInTheDocument()
      expect(screen.queryByText('С НДС')).not.toBeInTheDocument()
      expect(screen.queryByText('Без НДС')).not.toBeInTheDocument()
      expect(screen.queryByText('Налог')).not.toBeInTheDocument()

      userEvent.click(screen.getAllByText('Ввести вручную')[0])
      expect(screen.getAllByText('Корреспондентский счет')).toHaveLength(1)

      userEvent.click(screen.getByText('С НДС'))
      expect(screen.getAllByText('Налог')).toHaveLength(1)

      // Проверка наличия дополнительных полей блока AdditionalServiceItem
      expect(screen.queryAllByText('Срок')).toHaveLength(1)
      expect(screen.queryByText('Номер документа')).not.toBeInTheDocument()

      userEvent.click(screen.getAllByText('В кредит')[1])
      expect(screen.queryAllByText('Срок')).toHaveLength(2)
      expect(screen.queryByText('Номер документа')).toBeInTheDocument()
    })
  })

  describe('Валидация формы работает корректно', () => {
    beforeEach(() => {
      render(<FullOrderCalculator onSubmit={fn} onChangeForm={fn} />, { wrapper: createWrapper })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)

      // Если состояние "Б/У", то поле Пробег тоже обязательное
      userEvent.click(screen.getByText('Новый'))
      await act(async () => userEvent.click(await screen.findByText('Б/У')))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)

      // Дополнительное поле блока BankDetails Корреспондентский счет тоже обязательное
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(16)
    })

    it('Валидируется верное количество обязательных полей блока "Дополнительное оборудование"', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      // Поля элемента блока "Дополнительное оборудование" становятся обязательными,
      // если выбран тип продукта, в том числе и поля блока BankDetails
      userEvent.click(screen.getByTestId('additionalEquipments.0.productType').firstElementChild as Element)
      await act(async () => userEvent.click(await screen.findByText(additionalEquipments[0])))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(19)

      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[1]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(20)
    })

    it('Валидируется верное количество обязательных полей блока "Дополнительные услуги диллера"', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      // Поля элемента блока "Дополнительные услуги диллера" становятся обязательными,
      // если выбран тип продукта, в том числе и поля блока BankDetails
      userEvent.click(
        screen.getByTestId('dealerAdditionalServices.0.productType').firstElementChild as Element,
      )
      await act(async () => userEvent.click(await screen.findByText(dealerAdditionalServices[0])))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(20)

      await act(() => userEvent.click(screen.getAllByText('В кредит')[1]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(22)

      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[2]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(23)
    })

    it('Поле стоимость - принимает только числа', async () => {
      const carCostField = document.querySelector('#carCost')!
      await act(() => userEvent.type(carCostField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      await act(() => userEvent.type(carCostField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(13)
    })

    it('Поле пробег - принимает только числа', async () => {
      userEvent.click(screen.getByText('Новый'))
      await act(async () => userEvent.click(await screen.findByText('Б/У')))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)

      const carMileageField = document.querySelector('#carMileage')!
      await act(() => userEvent.type(carMileageField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
      await act(() => userEvent.type(carMileageField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
    })

    it('Поле Серия и номер ПТС - принимает только числа если електронный ПТС', async () => {
      const carPassportIdField = document.querySelector('#carPassportId')!
      await act(() => userEvent.type(carPassportIdField, 'test'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, '12'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, '3123412341234'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Поле Серия и номер ПТС - принимает числа и русские буквы если бумажный ПТС', async () => {
      const carPassportIdField = document.querySelector('#carPassportId')!
      userEvent.click(screen.getByText('ЭПТС'))
      await act(async () => userEvent.click(await screen.findByText('Бумажный')))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, '1234'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(carPassportIdField, 'яч123123'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Дата выдачи ПТС не превышает дату выпуска автомобиля', async () => {
      userEvent.click(screen.getByTestId('carYear').firstElementChild as Element)
      userEvent.click(await screen.findByText('2020'))

      const carPassportCreationDateField = document.getElementById('carPassportCreationDate')!

      userEvent.clear(carPassportCreationDateField)
      userEvent.type(carPassportCreationDateField, '10101900')
      await act(() => {})
      expect(
        screen.queryByText('Дата выдачи ПТС не может превышать дату выпуска автомобиля'),
      ).toBeInTheDocument()

      userEvent.clear(carPassportCreationDateField)
      userEvent.type(carPassportCreationDateField, '10102020')
      await act(() => {})
      expect(
        screen.queryByText('Дата выдачи ПТС не может превышать дату выпуска автомобиля'),
      ).not.toBeInTheDocument()
    })

    it('Дата ДКП не превышает дату выпуска автомобиля', async () => {
      userEvent.click(screen.getByTestId('carYear').firstElementChild as Element)
      userEvent.click(await screen.findByText('2020'))

      const salesContractDateField = document.getElementById('salesContractDate')!

      userEvent.clear(salesContractDateField)
      userEvent.type(salesContractDateField, '10101900')
      await act(() => {})
      expect(screen.queryByText('Дата ДКП не может превышать дату выпуска автомобиля')).toBeInTheDocument()

      userEvent.clear(salesContractDateField)
      userEvent.type(salesContractDateField, '10102020')
      await act(() => {})
      expect(
        screen.queryByText('Дата ДКП не может превышать дату выпуска автомобиля'),
      ).not.toBeInTheDocument()
    })

    it('Поле Номер VIN/кузова - принимает только числа и латиницу', async () => {
      const carIdField = document.querySelector('#carId')!
      await act(() => userEvent.type(carIdField, 'Ы'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      await act(() => userEvent.type(carIdField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(13)
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(carIdField, 'TEST12312312312'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Поле Сумма кредита - принимает только числа', async () => {
      const loanAmountField = document.querySelector('#loanAmount')!
      await act(() => userEvent.type(loanAmountField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      await act(() => userEvent.type(loanAmountField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(13)
    })

    it('Поле Первоначальный взнос - принимает только числа', async () => {
      const initialPaymentField = document.querySelector('#initialPayment')!
      await act(() => userEvent.type(initialPaymentField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(14)
      await act(() => userEvent.type(initialPaymentField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(13)
    })

    it('Поле стоиимость блока Доп. оборудования  - принимает только числа', async () => {
      userEvent.click(screen.getByTestId('additionalEquipments.0.productType').firstElementChild as Element)
      await act(async () => userEvent.click(await screen.findByText(additionalEquipments[0])))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(19)

      const additionalEquipmentsCostField = document.getElementById('additionalEquipments.0.productCost')!
      await act(() => userEvent.type(additionalEquipmentsCostField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(19)
      await act(() => userEvent.type(additionalEquipmentsCostField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(18)
    })

    it('Поле стоиимость блока Доп. услуг  - принимает только числа', async () => {
      userEvent.click(
        screen.getByTestId('dealerAdditionalServices.0.productType').firstElementChild as Element,
      )
      await act(async () => userEvent.click(await screen.findByText(dealerAdditionalServices[0])))

      const dealerAdditionalServicesCostField = document.getElementById(
        'dealerAdditionalServices.0.productCost',
      )!
      await act(() => userEvent.type(dealerAdditionalServicesCostField, 'test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(20)
      await act(() => userEvent.type(dealerAdditionalServicesCostField, '12'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(19)
    })

    it('Поле БИК - принимает только числа', async () => {
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
      const bankIdentificationCodeField = document.getElementById('bankIdentificationCode')!
      await act(() => userEvent.type(bankIdentificationCodeField, 'Test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
    })

    it('Поле БИК - ожидает ввода 9 цифр', async () => {
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      const bankIdentificationCodeField = document.getElementById('bankIdentificationCode')!
      await act(() => userEvent.type(bankIdentificationCodeField, '12341234'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(bankIdentificationCodeField, '1'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Поле Номер счета банка - принимает только числа', async () => {
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
      const bankAccountNumberField = document.getElementById('bankAccountNumber')!
      await act(() => userEvent.type(bankAccountNumberField, 'Test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
    })

    it('Поле Номер счета банка - ожидает ввода 20 цифр', async () => {
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      const bankAccountNumberField = document.getElementById('bankAccountNumber')!
      await act(() => userEvent.type(bankAccountNumberField, '1234123412341234123'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(bankAccountNumberField, '1'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })

    it('Поле Корреспондентский счет - принимает только числа', async () => {
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
      const correspondentAccountField = document.getElementById('correspondentAccount')!
      await act(() => userEvent.type(correspondentAccountField, 'Test'))
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(15)
    })

    it('Поле Корреспондентский счет - ожидает ввода 20 цифр', async () => {
      await act(() => userEvent.click(screen.getAllByText('Ввести вручную')[0]))
      const correspondentAccountField = document.getElementById('correspondentAccount')!
      await act(() => userEvent.type(correspondentAccountField, '1234123412341234123'))
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
      await act(() => userEvent.type(correspondentAccountField, '1'))
      expect(screen.queryByText('Введите данные полностью')).not.toBeInTheDocument()
    })
  })

  describe('Работа полей Первоначальный взнос, Первоначальный взносос в %', () => {
    beforeEach(() => {
      render(<FullOrderCalculator onSubmit={fn} onChangeForm={fn} />, { wrapper: createWrapper })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Значение в поле Первоначальный взносос в % появляется', async () => {
      const carCostField = document.getElementById('carCost')!
      await act(() => userEvent.type(carCostField, '77'))
      const initialPaymentField = document.getElementById('initialPayment')!
      await act(() => userEvent.type(initialPaymentField, '11'))

      expect(screen.getByDisplayValue('14.29')).toBeInTheDocument()
    })

    it('Значение в поле Первоначальный взносос появляется', async () => {
      const carCostField = document.getElementById('carCost')!
      await act(() => userEvent.type(carCostField, '77'))
      const initialPaymentField = document.getElementById('initialPaymentPercent')!
      await act(() => userEvent.type(initialPaymentField, '11'))
      await sleep(1500)

      expect(await screen.findByDisplayValue('8')).toBeInTheDocument()
    })
  })

  describe('Работа добавления и удаления доп услуг', () => {
    beforeEach(() => {
      render(<FullOrderCalculator onSubmit={fn} onChangeForm={fn} />, { wrapper: createWrapper })
    })

    it('Item добавляется и удаляется, но не последний', () => {
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
      const addingSquareBtn = screen.getAllByTestId('addingSquareBtn')[0]
      userEvent.click(addingSquareBtn)
      userEvent.click(addingSquareBtn)
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(5)

      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
    })
  })
})
