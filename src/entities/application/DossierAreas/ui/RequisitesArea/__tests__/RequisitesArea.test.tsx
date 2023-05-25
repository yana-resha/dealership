import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { getMockedClientDossier } from '../../../__tests__/mocks/clientDetailedDossier.mock'
import { RequisitesArea } from '../RequisitesArea'

jest.mock('../../Requisite/Requisite', () => ({
  Requisite: () => <div data-testid="requisite" />,
}))

const { additionalOptions } = getMockedClientDossier('1')

const mockedSetFinancingEnabled = jest.fn()

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('RequisiteAreaTest', () => {
  describe('Все элементы экрана отображаются', () => {
    beforeEach(() => {
      render(
        <RequisitesArea
          creditReceiverBank="Сбербанк"
          creditBankAccountNumber="40702810038000017239"
          creditLegalEntity="Anex"
          creditSum={10000}
          additionalOptions={additionalOptions}
          setFinancingEnabled={mockedSetFinancingEnabled}
          changeRequisites={jest.fn}
        />,
        { wrapper: createWrapper },
      )
    })

    it('Отображается блок "Кредит"', () => {
      expect(screen.getByText('Кредит')).toBeInTheDocument()
    })

    it('Отображается блок "Дополнительное оборудование"', () => {
      expect(screen.getByText('Дополнительное оборудование')).toBeInTheDocument()
    })

    it('Отображается блок "Дополнительные услуги дилера"', () => {
      expect(screen.getByText('Дополнительные услуги дилера')).toBeInTheDocument()
    })

    it('Отображается свитч для каждого блока', () => {
      expect(screen.getAllByText('Проверено')).toHaveLength(3)
    })
  })

  describe('При подтверждении реквизитов становится возможной отправка на финансирование', () => {
    beforeEach(() => {
      render(
        <RequisitesArea
          creditReceiverBank="Сбербанк"
          creditBankAccountNumber="40702810038000017239"
          creditLegalEntity="Anex"
          creditSum={10000}
          additionalOptions={additionalOptions}
          setFinancingEnabled={mockedSetFinancingEnabled}
          changeRequisites={jest.fn}
        />,
        { wrapper: createWrapper },
      )
    })

    it('При подтверждении всех реквизитов активируется кнопка отправки на финансирование', () => {
      const switches = screen.getAllByText('Проверено')
      for (const requisiteSwitch of switches) {
        userEvent.click(requisiteSwitch)
      }
      expect(mockedSetFinancingEnabled).toBeCalledTimes(4)
    })
  })
})
