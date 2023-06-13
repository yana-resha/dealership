import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { AdditionalOptionFrontdc, fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { ThemeProviderMock } from 'tests/mocks'

import { Requisite } from '../Requisite'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('RequisiteTest', () => {
  describe('Все элементы экрана отображаются', () => {
    beforeEach(() => {
      render(
        <Requisite
          additionalOption={{
            ...(fullApplicationData.application?.loanData?.additionalOptions?.[1] as AdditionalOptionFrontdc),
            // bankOptionType: 1,
          }}
        />,
        { wrapper: createWrapper },
      )
    })

    it('Отображается "Тип продукта"', () => {
      expect(screen.getByText('Тип продукта')).toBeInTheDocument()
      expect(screen.getByText('ОСАГО')).toBeInTheDocument()
    })

    it('Отображается "Страховая компания"', () => {
      expect(screen.getByText('Страховая компания')).toBeInTheDocument()
      expect(screen.getByText('ОАО Рога и Копыта')).toBeInTheDocument()
    })

    it('Отображается "Агент получатель"', () => {
      expect(screen.getByText('Агент получатель')).toBeInTheDocument()
      expect(screen.getByText('043432323')).toBeInTheDocument()
    })

    it('Отображается "Стоимость"', () => {
      expect(screen.getByText('Стоимость')).toBeInTheDocument()
      expect(screen.getByText('21 руб.')).toBeInTheDocument()
    })

    it('Отображается "Срок"', () => {
      expect(screen.getByText('Срок')).toBeInTheDocument()
      expect(screen.getByText('24 мес.')).toBeInTheDocument()
    })

    it('Отображается "Номер полиса"', () => {
      expect(screen.getByText('Номер полиса')).toBeInTheDocument()
      expect(screen.getByText('32ук23к22')).toBeInTheDocument()
    })

    it('Отображается "Получатель"', () => {
      expect(screen.getByText('Получатель')).toBeInTheDocument()
      expect(screen.getByText('Росбанк')).toBeInTheDocument()
    })

    it('Отображается "Номер счета банка"', () => {
      expect(screen.getByText('Номер счета банка')).toBeInTheDocument()
      expect(screen.getByText('12345678901234567891')).toBeInTheDocument()
    })

    it('Отображается "Расчетный счет"', () => {
      expect(screen.getByText('Расчетный счет')).toBeInTheDocument()
      expect(screen.getByText('12345678901234567890')).toBeInTheDocument()
    })

    it('Отображается "Налог"', () => {
      expect(screen.getByText('Налог')).toBeInTheDocument()
      expect(screen.getByText('13.5')).toBeInTheDocument()
    })
  })
})