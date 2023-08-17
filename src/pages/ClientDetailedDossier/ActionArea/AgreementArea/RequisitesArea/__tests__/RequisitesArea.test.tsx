import { PropsWithChildren } from 'react'

import { ApplicationFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { ThemeProviderMock } from 'tests/mocks'

import { RequisitesArea } from '../RequisitesArea'

jest.mock('../Requisite/Requisite', () => ({
  Requisite: () => <div data-testid="requisite" />,
}))

const mockedSetFinancingEnabled = jest.fn()

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('RequisiteAreaTest', () => {
  describe('Все элементы экрана отображаются', () => {
    beforeEach(() => {
      render(
        <RequisitesArea
          application={fullApplicationData.application as ApplicationFrontdc}
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
          application={fullApplicationData.application as ApplicationFrontdc}
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
