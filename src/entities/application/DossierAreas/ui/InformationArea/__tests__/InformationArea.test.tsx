import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { InformationArea } from '../InformationArea'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

const informationAreaProps = {
  statusCode: StatusCode.INITIAL,
  vendorCode: '2003023272',
  vendorInfo: 'ANEX TOUR, Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
  carBrand: 'KIA',
  carModel: 'RIO',
  creditAmount: 2000000,
  monthlyPayment: 10400,
  downPayment: 200000,
  rate: 9.8,
  productName: 'Драйв В',
  term: 60,
  additionalOptions: [
    {
      name: 'Название продукта',
      price: 400000,
      inCreditFlag: true,
      bankOptionType: 1,
    },
    {
      name: 'Название продукта 2',
      price: 300000,
      inCreditFlag: true,
      bankOptionType: 2,
    },
  ],
}

describe('InformationAreaTest', () => {
  describe('Отображаются вся информация о заявке', () => {
    beforeEach(() => {
      render(<InformationArea {...informationAreaProps} />, { wrapper: createWrapper })
    })
    it('Отображается название области экрана "Информация"', () => {
      expect(screen.getByText('Информация')).toBeInTheDocument()
    })

    it('Отображается кнопка "Поделиться"', () => {
      expect(screen.getByText('Поделиться')).toBeInTheDocument()
    })

    it('Отображается информация о ДЦ', () => {
      expect(screen.getByText(/ДЦ/)).toBeInTheDocument()
      expect(screen.getByText(/2003023272/))
      expect(screen.getByText(/ANEX TOUR, Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж/))
    })

    it('Отображается Марка / модель', () => {
      expect(screen.getByText('Марка / модель')).toBeInTheDocument()
      expect(screen.getByText('KIA RIO')).toBeInTheDocument()
    })

    it('Отображается Сумма кредита', () => {
      expect(screen.getByText('Сумма кредита')).toBeInTheDocument()
      expect(screen.getByText('2 000 000 руб.')).toBeInTheDocument()
    })

    it('Отображается платеж', () => {
      expect(screen.getByText('Платеж')).toBeInTheDocument()
      expect(screen.getByText('10 400 руб.')).toBeInTheDocument()
    })

    it('Отображается ПВ', () => {
      expect(screen.getByText('ПВ')).toBeInTheDocument()
      expect(screen.getByText('200 000 руб.')).toBeInTheDocument()
    })

    it('Отображается Переплата', () => {
      expect(screen.getByText('Переплата')).toBeInTheDocument()
      /* TODO Добавить после подключения ручки getFullApplication */
      // expect(screen.getByText('0 руб.')).toBeInTheDocument()
    })

    it('Отображается Процентная ставка', () => {
      expect(screen.getByText('% ставка')).toBeInTheDocument()
      expect(screen.getByText('9.8%')).toBeInTheDocument()
    })

    it('Отображается Кредитный продукт', () => {
      expect(screen.getByText('Кредитный продукт')).toBeInTheDocument()
      expect(screen.getByText('Драйв В')).toBeInTheDocument()
    })

    it('Отображается Сумма продуктов', () => {
      expect(screen.getByText('Сумма продуктов')).toBeInTheDocument()
      expect(screen.getByText('700 000 руб.')).toBeInTheDocument()
    })

    it('Отображается Срок кредита', () => {
      expect(screen.getByText('Срок кредита')).toBeInTheDocument()
      expect(screen.getByText('60 месяцев')).toBeInTheDocument()
    })
  })

  describe('Отображается информация о дополнительных услугах', () => {
    beforeEach(() => {
      render(<InformationArea {...informationAreaProps} />, { wrapper: createWrapper })
    })

    it('Отображается заголовок для дополнительного оборудования', () => {
      expect(screen.getByText('Дополнительное оборудование')).toBeInTheDocument()
    })

    it('Отображается информация о дополнительном оборудовании', () => {
      expect(screen.getByText('Название продукта 2')).toBeInTheDocument()
      expect(screen.getByText('300000 руб.')).toBeInTheDocument()
    })

    it('Отображается информация о дополнительных услугах дилера', () => {
      expect(screen.getByText('Название продукта')).toBeInTheDocument()
      expect(screen.getByText('400000 руб.')).toBeInTheDocument()
    })
  })

  describe('Кнопка "График платежей" отображается при определенных статусах', () => {
    it('График платежей отображается при статусе Initial (Черновик)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.INITIAL }} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('График платежей')).toBeInTheDocument()
    })

    it('График платежей отображается при статусе Processed (Ожидает решение)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.PROCESSED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('График платежей')).toBeInTheDocument()
    })

    it('График платежей отображается при статусе Approved (Предварительно одобрен)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.APPROVED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('График платежей')).toBeInTheDocument()
    })

    it('График платежей отображается при статусе FinallyApproved (Кредит одобрен)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.FINALLY_APPROVED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('График платежей')).toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Formation (Формирование КД)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.FORMATION }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Singed (КД подписан)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.SIGNED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Rejected (Отказ)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.REJECTED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе CanceledDeal (КД Отменен)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.CANCELED_DEAL }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Canceled (Отменен)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.CANCELED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Authorized (Ожидание финансирования)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.AUTHORIZED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Financed (Кредит выдан)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.ISSUED }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })

    it('График платежей отсутствует при статусе Error (Ошибка)', () => {
      render(<InformationArea {...{ ...informationAreaProps, statusCode: StatusCode.ERROR }} />, {
        wrapper: createWrapper,
      })

      expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
    })
  })
})
