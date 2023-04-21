import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import { MockStore } from 'redux-mock-store'
import * as Yup from 'yup'

import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { DateInput } from '../DateInput'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

let validationSchema = Yup.object().shape({})

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>
      <Formik initialValues={{ testDateName: '' }} validationSchema={validationSchema} onSubmit={() => {}}>
        <Form>
          {children}
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('DateInputTest', () => {
  describe('DateInput отображается', () => {
    beforeEach(() => {
      render(<DateInput name="testDateName" label="Тестовая дата" />, { wrapper: createWrapper })
    })

    it('Label для DateInput отображается', () => {
      expect(screen.getByText('Тестовая дата')).toBeInTheDocument()
    })

    it('Placeholder использует кириллицу', () => {
      expect(screen.getByPlaceholderText('ДД.ММ.ГГГГ')).toBeInTheDocument()
    })
  })

  describe('DateInput работает корректно', () => {
    beforeEach(() => {
      render(<DateInput name="testDateName" label="Тестовая дата" />, { wrapper: createWrapper })
    })

    it('Value использует кириллицу', () => {
      userEvent.type(screen.getByRole('textbox'), '1010')
      expect(screen.getByDisplayValue(/ГГГГ/)).toBeInTheDocument()
    })

    it('При нажатии на иконку открывается календарь', () => {
      userEvent.click(screen.getAllByRole('button')[0])
      expect(screen.getByTestId('sentinelStart')).toBeInTheDocument()
      expect(screen.getByTestId('sentinelEnd')).toBeInTheDocument()
    })
  })

  describe('DateInput валидируется', () => {
    beforeEach(() => {
      validationSchema = Yup.object().shape({
        testDateName: Yup.date().required('Поле обязательно для заполнения'),
      })
      render(<DateInput name="testDateName" label="Тестовая дата" />, { wrapper: createWrapper })
    })

    it('Отображается сообщение об ошибке, если поле обязательное', async () => {
      userEvent.click(screen.getByText('Submit'))
      expect(await screen.findByText('Поле обязательно для заполнения')).toBeInTheDocument()
    })
  })
})
