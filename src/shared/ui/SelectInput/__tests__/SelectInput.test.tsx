import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import { MockStore } from 'redux-mock-store'
import * as Yup from 'yup'

import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SelectInput } from '../SelectInput'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

let validationSchema = Yup.object().shape({})

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>
      <Formik initialValues={{ testSelectName: '' }} validationSchema={validationSchema} onSubmit={() => {}}>
        <Form>
          {children}
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('SelectInputTest', () => {
  describe('SelectInput отображается корректно', () => {
    beforeEach(() => {
      render(
        <SelectInput
          name="testSelectName"
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Label для SelectInput отображается', () => {
      expect(screen.getByText('Тестовый select')).toBeInTheDocument()
    })

    it('Placeholder в SelectInput отображается', () => {
      expect(screen.getByText('Тестовый placeholder')).toBeInTheDocument()
    })
  })

  describe('SelectInput работает корректно', () => {
    beforeEach(() => {
      render(
        <SelectInput
          name="testSelectName"
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('При нажатии на поле отображаются опции', async () => {
      userEvent.click(screen.getByText('Тестовый placeholder'))
      expect(await screen.findAllByRole('option')).toHaveLength(4)
    })

    it('Опция выбирается корректно', async () => {
      userEvent.click(screen.getByText('Тестовый placeholder'))
      const option = await screen.findByText('Первая')
      userEvent.click(option)
      expect(await screen.findByText('Первая')).toBeInTheDocument()
    })
  })

  describe('SelectInput валидируется', () => {
    beforeEach(() => {
      validationSchema = Yup.object().shape({
        testSelectName: Yup.string().required('Поле обязательно для заполнения'),
      })
      render(
        <SelectInput
          name="testSelectName"
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Отображается сообщение об ошибке, если поле обязательное', async () => {
      userEvent.click(screen.getByText('Submit'))
      expect(await screen.findByText('Поле обязательно для заполнения')).toBeInTheDocument()
    })
  })
})
