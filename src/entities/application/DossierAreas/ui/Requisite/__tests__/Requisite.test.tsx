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
      expect(screen.getByText('РосГосСтрах')).toBeInTheDocument()
    })

    it('Отображается "Агент получатель"', () => {
      expect(screen.getByText('Агент получатель')).toBeInTheDocument()
      expect(screen.getByText('Почта Банк')).toBeInTheDocument()
    })

    it('Отображается "Стоимость"', () => {
      expect(screen.getByText('Стоимость')).toBeInTheDocument()
      expect(screen.getByText('21 ₽')).toBeInTheDocument()
    })

    it('Отображается "Срок"', () => {
      expect(screen.getByText('Срок')).toBeInTheDocument()
      expect(screen.getByText('24 мес.')).toBeInTheDocument()
    })

    it('Отображается "Получатель"', () => {
      expect(screen.getByText('Получатель')).toBeInTheDocument()
      expect(screen.getByText('Почта Банк')).toBeInTheDocument()
    })

    it('Отображается "Номер счета банка"', () => {
      expect(screen.getByText('Номер счета банка')).toBeInTheDocument()
      expect(screen.getByText('40702810038000054323')).toBeInTheDocument()
    })

    it('Отображается "Расчетный счет"', () => {
      expect(screen.getByText('Расчетный счет')).toBeInTheDocument()
      expect(screen.getByText('40702810038000012344')).toBeInTheDocument()
    })

    it('Отображается "Налог"', () => {
      expect(screen.getByText('Налог')).toBeInTheDocument()
      expect(screen.getByText('13.5')).toBeInTheDocument()
    })
  })
})
