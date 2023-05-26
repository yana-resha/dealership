import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { getMockedClientDossier, Requisites } from '../../../__tests__/mocks/clientDetailedDossier.mock'
import { EditRequisitesArea } from '../EditRequisitesArea'

jest.mock('../../../ui/DealerCenterRequisites/DealerCenterRequisites', () => ({
  DealerCenterRequisites: () => <div data-testid="dealerCenterRequisites" />,
}))
jest.mock('../../../ui/DealerServicesRequisites/DealerServicesRequisites', () => ({
  DealerServicesRequisites: () => <div data-testid="dealerServicesRequisites" />,
}))
jest.mock('../../../ui/AdditionalEquipmentRequisites/AdditionalEquipmentRequisites', () => ({
  AdditionalEquipmentRequisites: () => <div data-testid="additionalEquipmentRequisites" />,
}))
jest.mock('../../../__tests__/mocks/clientDetailedDossier.mock', () => ({
  ...jest.requireActual('../../../__tests__/mocks/clientDetailedDossier.mock'),
  mockRequisites: (): Requisites => ({
    dealerCenterRequisites: [],
    dealerServicesRequisites: [],
    additionalEquipmentRequisites: [],
  }),
}))

const mockedReturnToDetailedDossier = jest.fn()
const mockedDossier = getMockedClientDossier('1')

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>
disableConsole('error')

describe('EditRequisitesAreaTest', () => {
  describe('Все блоки отображаются на форме', () => {
    beforeEach(() => {
      render(
        <EditRequisitesArea changeRequisites={mockedReturnToDetailedDossier} clientDossier={mockedDossier} />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Отображается один блок "Реквизиты дилерского центра"', () => {
      expect(screen.getByTestId('dealerCenterRequisites')).toBeInTheDocument()
    })

    it('Отображается один блок "Дополнительные услуги дилера"', () => {
      expect(screen.getByTestId('dealerServicesRequisites')).toBeInTheDocument()
    })

    it('Отображается два блока "Дополнительное оборудование"', () => {
      expect(screen.getAllByTestId('additionalEquipmentRequisites')).toHaveLength(2)
    })

    it('Отображается кнопка "Назад к заявке"', () => {
      expect(screen.getByText('Назад к заявке')).toBeInTheDocument()
    })

    it('Отображается кнопка "Отправить на решение"', () => {
      expect(screen.getByText('Отправить на решение')).toBeInTheDocument()
    })
  })

  describe('Кнопки на форме работают корректно', () => {
    beforeEach(() => {
      render(
        <EditRequisitesArea changeRequisites={mockedReturnToDetailedDossier} clientDossier={mockedDossier} />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('При нажатии на "Назад к заявке открывается модальный диалог"', async () => {
      userEvent.click(screen.getByText('Назад к заявке'))
      expect(await screen.findByText(/Возвращаясь назад, вы не сохраните/))
    })

    it('При нажатии на "Продолжить" в диалоге выполняется возвращение к подробной заявке', async () => {
      userEvent.click(screen.getByText('Назад к заявке'))
      const continueButton = await screen.findByText('Продолжить')
      userEvent.click(continueButton)
      expect(mockedReturnToDetailedDossier).toBeCalledTimes(1)
    })
  })
})
