import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DealerCenterRequisites } from 'entities/application/AdditionalOptionsRequisites/ui'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { EditRequisitesArea } from '../EditRequisitesArea'
import { getMockedClientDossier, Requisites } from './EditRequisitesArea.mock'

jest.mock('entities/application/AdditionalOptionsRequisites/ui', () => ({
  DealerCenterRequisites: () => <div data-testid="dealerCenterRequisites" />,
}))
jest.mock('entities/application/AdditionalOptionsRequisites/ui', () => ({
  DealerServicesRequisites: () => <div data-testid="dealerServicesRequisites" />,
}))
jest.mock('entities/application/AdditionalOptionsRequisites/ui', () => ({
  AdditionalEquipmentRequisites: () => <div data-testid="additionalEquipmentRequisites" />,
}))
jest.mock('./EditRequisitesArea.mock', () => ({
  ...jest.requireActual('./EditRequisitesArea.mock'),
  mockRequisites: (): Requisites => ({
    dealerCenterRequisites: [],
    dealerServicesRequisites: [],
    additionalEquipmentRequisites: [],
  }),
}))

const mockedReturnToDetailedDossier = jest.fn()
getMockedClientDossier('1')

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>
disableConsole('error')

describe('EditRequisitesAreaTest', () => {
  it.todo('Тесты для EditRequisitesArea')

  // describe('Все блоки отображаются на форме', () => {
  //   beforeEach(() => {
  //     render(<EditRequisitesArea applicationId="123" changeRequisites={mockedReturnToDetailedDossier} />, {
  //       wrapper: createWrapper,
  //     })
  //   })

  //   it('Отображается один блок "Реквизиты дилерского центра"', () => {
  //     expect(screen.getByTestId('dealerCenterRequisites')).toBeInTheDocument()
  //   })

  //   it('Отображается один блок "Дополнительные услуги дилера"', () => {
  //     expect(screen.getByTestId('dealerServicesRequisites')).toBeInTheDocument()
  //   })

  //   it('Отображается два блока "Дополнительное оборудование"', () => {
  //     expect(screen.getAllByTestId('additionalEquipmentRequisites')).toHaveLength(2)
  //   })

  //   it('Отображается кнопка "Назад к заявке"', () => {
  //     expect(screen.getByText('Назад к заявке')).toBeInTheDocument()
  //   })

  //   it('Отображается кнопка "Отправить на решение"', () => {
  //     expect(screen.getByText('Отправить на решение')).toBeInTheDocument()
  //   })
  // })

  // describe('Кнопки на форме работают корректно', () => {
  //   beforeEach(() => {
  //     render(<EditRequisitesArea applicationId="123" changeRequisites={mockedReturnToDetailedDossier} />, {
  //       wrapper: createWrapper,
  //     })
  //   })

  //   it('При нажатии на "Назад к заявке открывается модальный диалог"', async () => {
  //     userEvent.click(screen.getByText('Назад к заявке'))
  //     expect(await screen.findByText(/Возвращаясь назад, вы не сохраните/))
  //   })

  //   it('При нажатии на "Продолжить" в диалоге выполняется возвращение к подробной заявке', async () => {
  //     userEvent.click(screen.getByText('Назад к заявке'))
  //     const continueButton = await screen.findByText('Продолжить')
  //     userEvent.click(continueButton)
  //     expect(mockedReturnToDetailedDossier).toBeCalledTimes(1)
  //   })
  // })
})
