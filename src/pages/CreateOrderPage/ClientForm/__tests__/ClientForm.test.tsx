import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import { FormikProps } from 'formik'
import { MockStore } from 'redux-mock-store'

import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { ClientForm } from '../ClientForm'
import { ClientData } from '../ClientForm.types'

jest.mock('../FormAreas/PassportArea/PassportArea', () => ({
  PassportArea: () => <div data-testid="passportArea" />,
}))
jest.mock('../FormAreas/CommunicationArea/CommunicationArea', () => ({
  CommunicationArea: () => <div data-testid="communicationArea" />,
}))
jest.mock('../FormAreas/IncomesArea/IncomesArea', () => ({
  IncomesArea: () => <div data-testid="incomesArea" />,
}))
jest.mock('../FormAreas/SecondDocArea/SecondDocArea', () => ({
  SecondDocArea: () => <div data-testid="secondDocArea" />,
}))
jest.mock('../FormAreas/JobArea/JobArea', () => ({
  JobArea: () => <div data-testid="jobArea" />,
}))
jest.mock('../FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea', () => ({
  QuestionnaireUploadArea: () => <div data-testid="questionnaireUploadArea" />,
}))
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}))
const formRef = React.createRef<FormikProps<ClientData>>()

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ children }: WrapperProps) => <MockProviders>{children}</MockProviders>

disableConsole('error')

describe('ClientFormTest', () => {
  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      render(<ClientForm formRef={formRef} onMount={jest.fn} />, { wrapper: createWrapper })
    })

    it('Отображается блок "Паспортные данные"', () => {
      expect(screen.getByTestId('passportArea')).toBeInTheDocument()
    })

    it('Отображается блок "Связь с клиентом"', () => {
      expect(screen.getByTestId('communicationArea')).toBeInTheDocument()
    })

    it('Отображается блок "Доходы"', () => {
      expect(screen.getByTestId('incomesArea')).toBeInTheDocument()
    })

    it('Отображается блок "Второй документ"', () => {
      expect(screen.getByTestId('secondDocArea')).toBeInTheDocument()
    })

    it('Отображается блок "Работа"', () => {
      expect(screen.getByTestId('jobArea')).toBeInTheDocument()
    })

    it('Отображается загрузчик анкеты', () => {
      expect(screen.getByTestId('questionnaireUploadArea')).toBeInTheDocument()
    })

    it('Отображается специальная отметка', () => {
      expect(screen.getByTestId('jobArea')).toBeInTheDocument()
    })

    it('Отображается кнопка "Сохранить черновик"', () => {
      expect(screen.getByText('Сохранить черновик')).toBeInTheDocument()
    })

    // it('Отображается кнопка "Распечатать"', () => {
    //   expect(screen.getByText('Распечатать')).toBeInTheDocument()
    // })

    it('Отображается кнопка "Далее"', () => {
      expect(screen.getByText('Далее')).toBeInTheDocument()
    })
  })
})
