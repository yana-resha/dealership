import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { AdditionalOptions } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { Requisite } from '../Requisite'

const additionalOption: AdditionalOptions = {
  optionType: 'dealerServices',
  typeOfProduct: 'Страхование колеса',
  insuranceCompany: 'РосГосСтрах',
  provider: 'Росгосстрах',
  agentReceiver: 'Имя агента',
  price: 400000,
  term: 24,
  policyNumber: '6566644-33',
  receiver: 'ФК Открытие',
  bankNumber: '40702810038000017240',
  accountNumber: '40702810038000017241',
  tax: 'Без НДС',
  inCredit: true,
}

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('RequisiteTest', () => {
  describe('Все элементы экрана отображаются', () => {
    beforeEach(() => {
      render(<Requisite additionalOption={additionalOption} />, { wrapper: createWrapper })
    })

    it('Отображается "Тип продукта"', () => {
      expect(screen.getByText('Тип продукта')).toBeInTheDocument()
      expect(screen.getByText('Страхование колеса')).toBeInTheDocument()
    })

    it('Отображается "Страховая компания"', () => {
      expect(screen.getByText('Страховая компания')).toBeInTheDocument()
      expect(screen.getByText('РосГосСтрах')).toBeInTheDocument()
    })

    it('Отображается "Агент получатель"', () => {
      expect(screen.getByText('Агент получатель')).toBeInTheDocument()
      expect(screen.getByText('Имя агента')).toBeInTheDocument()
    })

    it('Отображается "Стоимость"', () => {
      expect(screen.getByText('Стоимость')).toBeInTheDocument()
      expect(screen.getByText('400000 руб.')).toBeInTheDocument()
    })

    it('Отображается "Срок"', () => {
      expect(screen.getByText('Срок')).toBeInTheDocument()
      expect(screen.getByText('24 мес.')).toBeInTheDocument()
    })

    it('Отображается "Номер полиса"', () => {
      expect(screen.getByText('Номер полиса')).toBeInTheDocument()
      expect(screen.getByText('6566644-33')).toBeInTheDocument()
    })

    it('Отображается "Получатель"', () => {
      expect(screen.getByText('Получатель')).toBeInTheDocument()
      expect(screen.getByText('ФК Открытие')).toBeInTheDocument()
    })

    it('Отображается "Номер счета банка"', () => {
      expect(screen.getByText('Номер счета банка')).toBeInTheDocument()
      expect(screen.getByText('40702810038000017240')).toBeInTheDocument()
    })

    it('Отображается "Расчетный счет"', () => {
      expect(screen.getByText('Расчетный счет')).toBeInTheDocument()
      expect(screen.getByText('40702810038000017241')).toBeInTheDocument()
    })

    it('Отображается "Налог"', () => {
      expect(screen.getByText('Налог')).toBeInTheDocument()
      expect(screen.getByText('Без НДС')).toBeInTheDocument()
    })
  })
})
