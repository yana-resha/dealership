import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { FraudDialog } from '../FraudDialog'

jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))

const mockedFraudDialog = {
  specialMark: false,
  specialMarkReason: '',
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedFraudDialog}
      validationSchema={clientFormValidationSchema}
      onSubmit={() => {}}
    >
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('FraudDialogTest', () => {
  describe('Все элементы формы отображаются', () => {
    beforeEach(() => {
      render(<FraudDialog />, {
        wrapper: createWrapper,
      })
    })

    it('Отображается кнопка "Специальная отметка"', () => {
      expect(screen.getByText('Специальная отметка')).toBeInTheDocument()
    })

    it('Отображается заголовок формы', () => {
      userEvent.click(screen.getByText('Специальная отметка'))
      expect(screen.getAllByText('Специальная отметка')).toHaveLength(2)
    })

    it('Комментарий о специальной отметке отображается на форме', () => {
      userEvent.click(screen.getByText('Специальная отметка'))
      expect(screen.getByText(/Если у вас есть подозрение на мошенничество/)).toBeInTheDocument()
    })

    it('Поле для выбора причины отметки отображается на форме', () => {
      userEvent.click(screen.getByText('Специальная отметка'))
      expect(screen.getByTestId('fraudReason')).toBeInTheDocument()
    })

    it('Кнопка сохранения специальной отметки отображается на форме', () => {
      userEvent.click(screen.getByText('Специальная отметка'))
      expect(screen.getByText('Сохранить')).toBeInTheDocument()
    })
  })

  describe('Значения формы сохраняются', () => {
    const mockedSetField = jest.fn()
    beforeEach(() => {
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            values: mockedFraudDialog,
            setFieldValue: mockedSetField,
          } as any),
      )
      render(<FraudDialog />, {
        wrapper: createWrapper,
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('При нажатии на "Сохранить" специальная отметка и причина сохраняются', async () => {
      userEvent.click(screen.getByText('Специальная отметка'))
      userEvent.click(screen.getByTestId('fraudReason'))
      const options = await screen.findAllByRole('option')
      userEvent.click(options[0])
      userEvent.click(screen.getByText('Сохранить'))
      expect(mockedSetField).toBeCalledTimes(2)
    })

    it('При нажатии на "Закрыть" изменения не сохраняются', async () => {
      userEvent.click(screen.getByText('Специальная отметка'))
      userEvent.click(screen.getByTestId('fraudReason'))
      const options = await screen.findAllByRole('option')
      userEvent.click(options[0])
      userEvent.click(screen.getByTestId('modalDialogClose'))
      expect(mockedSetField).toBeCalledTimes(0)
    })
  })
})
