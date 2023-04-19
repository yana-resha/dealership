import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { InformationArea } from '../InformationArea'

const mockedDossier = {
  status: StatusCode.STATUS_CODE_INITIAL,
  dealerCenterNumber: '2003023272',
  dealerCenterName: 'ANEX TOUR',
  dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
  applicationNumber: '545544',
  clientName: 'Терентьев Михаил Павлович',
  passport: '0604060423',
  carBrand: 'KIA',
  carModel: 'RIO',
  creditSum: 2000000,
  monthlyPayment: 10400,
  downPayment: 200000,
  overdraft: 0,
  rate: 9.8,
  productSum: 300000,
  term: 5,
  productName: 'Драйв В',
}

jest.mock('shared/ui/InfoText/InfoText', () => ({
  InfoText: ({ label, children }: any) => (
    <span>
      {label} {children}
    </span>
  ),
}))

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('InformationAreaTest', () => {
  describe('Отображаются вся информация о заявке', () => {
    it('Отображается название области экрана "Информация"', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Информация')).toBeInTheDocument()
    })

    it('Отображается кнопка "Поделиться"', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Поделиться')).toBeInTheDocument()
    })

    it('Отображается информация о ДЦ', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText(/ДЦ/)).toBeInTheDocument()
      expect(screen.getByText(/2003023272/))
      expect(screen.getByText(/ANEX TOUR, Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж/))
    })

    it('Отображается Марка / модель', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Марка / модель KIA RIO')).toBeInTheDocument()
    })

    it('Отображается Сумма кредита', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Сумма кредита 2 000 000 руб.')).toBeInTheDocument()
    })

    it('Отображается платеж', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Платеж 10 400 руб.')).toBeInTheDocument()
    })

    it('Отображается ПВ', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('ПВ 200 000 руб.')).toBeInTheDocument()
    })

    it('Отображается Переплата', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Переплата 0 руб.')).toBeInTheDocument()
    })

    it('Отображается Процентная ставка', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('% ставка 9.8%')).toBeInTheDocument()
    })

    it('Отображается Кредитный продукт', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Кредитный продукт Драйв В')).toBeInTheDocument()
    })

    it('Отображается Сумма продуктов', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Сумма продуктов 300 000 руб.')).toBeInTheDocument()
    })

    it('Отображается Срок кредита', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Срок кредита 5 лет')).toBeInTheDocument()
    })

    describe('Кнопка "График платежей" отображается при определенных статусах', () => {
      it('График платежей отображается при статусе Initial (Черновик)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_INITIAL }} />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе Processed (Ожидает решение)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_PROCESSED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе Approved (Предварительно одобрен)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_APPROVED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе FinallyApproved (Кредит одобрен)', () => {
        render(
          <InformationArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FINALLY_APPROVED }}
          />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе Formation (Формирование КД)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }} />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе Singed (КД подписан)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_SIGNED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Rejected (Отказ)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_REJECTED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе CanceledDeal (КД Отменен)', () => {
        render(
          <InformationArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_CANCELED_DEAL }}
          />,
          { wrapper: createWrapper },
        )

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Canceled (Отменен)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_CANCELED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Authorized (Ожидание финансирования)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_AUTHORIZED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Financed (Кредит выдан)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FINANCED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Error (Ошибка)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_ERROR }} />,
          { wrapper: createWrapper },
        )

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })
    })
  })
})
