import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { AdditionalOptions } from '../../../__tests__/mocks/clientDetailedDossier.mock'
import { Requisite } from '../Requisite'

const additionalOption: AdditionalOptions = {
  optionType: 'dealerServices',
  productType: 'Страхование колеса',
  legalPerson: 'ANEX',
  provider: 'РосГосСтрах',
  agent: 'Имя агента',
  productCost: 400000,
  loanTerm: 24,
  documentId: '6566644-33',
  beneficiaryBank: 'ФК Открытие',
  correspondentAccount: '40702810038000017240',
  bankAccountNumber: '40702810038000017241',
  taxPresence: false,
  bankIdentificationCode: '123456',
  taxation: '0',
  isCredit: true,
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
