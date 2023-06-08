import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { getMockedClientDossier } from '../../../__tests__/mocks/clientDetailedDossier.mock'
import { InformationArea } from '../InformationArea'

const mockedDossier = getMockedClientDossier('1')

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

      expect(screen.getByText('Марка / модель')).toBeInTheDocument()
      expect(screen.getByText('KIA RIO')).toBeInTheDocument()
    })

    it('Отображается Сумма кредита', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Сумма кредита')).toBeInTheDocument()
      expect(screen.getByText('2 000 000 руб.')).toBeInTheDocument()
    })

    it('Отображается платеж', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Платеж')).toBeInTheDocument()
      expect(screen.getByText('10 400 руб.')).toBeInTheDocument()
    })

    it('Отображается ПВ', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('ПВ')).toBeInTheDocument()
      expect(screen.getByText('200 000 руб.')).toBeInTheDocument()
    })

    it('Отображается Переплата', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Переплата')).toBeInTheDocument()
      expect(screen.getByText('0 руб.')).toBeInTheDocument()
    })

    it('Отображается Процентная ставка', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('% ставка')).toBeInTheDocument()
      expect(screen.getByText('9.8%')).toBeInTheDocument()
    })

    it('Отображается Кредитный продукт', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Кредитный продукт')).toBeInTheDocument()
      expect(screen.getByText('Драйв В')).toBeInTheDocument()
    })

    it('Отображается Сумма продуктов', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Сумма продуктов')).toBeInTheDocument()
      expect(screen.getByText('300 000 руб.')).toBeInTheDocument()
    })

    it('Отображается Срок кредита', () => {
      render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

      expect(screen.getByText('Срок кредита')).toBeInTheDocument()
      expect(screen.getByText('5 лет')).toBeInTheDocument()
    })

    describe('Отображается информация о дополнительных услугах', () => {
      it('Отображается заголовок для дополнительного оборудования', () => {
        render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

        expect(screen.getByText('Дополнительное оборудование')).toBeInTheDocument()
      })

      it('Отображается информация о дополнительном оборудовании', () => {
        render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

        expect(screen.getByText('Коврики')).toBeInTheDocument()
        expect(screen.getByText('10000 руб.')).toBeInTheDocument()
      })

      it('Отображается информация о дополнительных услугах дилера', () => {
        render(<InformationArea clientDossier={mockedDossier} />, { wrapper: createWrapper })

        expect(screen.getByText('Название продукта')).toBeInTheDocument()
        expect(screen.getByText('400000 руб.')).toBeInTheDocument()
      })
    })

    describe('Кнопка "График платежей" отображается при определенных статусах', () => {
      it('График платежей отображается при статусе Initial (Черновик)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.INITIAL }} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе Processed (Ожидает решение)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.PROCESSED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе Approved (Предварительно одобрен)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.APPROVED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отображается при статусе FinallyApproved (Кредит одобрен)', () => {
        render(
          <InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.FINALLY_APPROVED }} />,
          { wrapper: createWrapper },
        )

        expect(screen.getByText('График платежей')).toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Formation (Формирование КД)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.FORMATION }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Singed (КД подписан)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.SIGNED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Rejected (Отказ)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.REJECTED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе CanceledDeal (КД Отменен)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.CANCELED_DEAL }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Canceled (Отменен)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.CANCELED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Authorized (Ожидание финансирования)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.AUTHORIZED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Financed (Кредит выдан)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.ISSUED }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })

      it('График платежей отсутствует при статусе Error (Ошибка)', () => {
        render(<InformationArea clientDossier={{ ...mockedDossier, status: StatusCode.ERROR }} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('График платежей')).not.toBeInTheDocument()
      })
    })
  })
})
