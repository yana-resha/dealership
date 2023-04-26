import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SelectInputFormik } from '../SelectInputFormik'

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik initialValues={{ testSelectInputName: '' }} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('SelectInputFormikTest', () => {
  describe('SelectInputFormik обновляет значение формы', () => {
    it('При выборе опции в SelectInputFormik вызывается setFieldValue', async () => {
      const mockedSetFieldValue = jest.fn()
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(
        <SelectInputFormik
          name="testSelectInputName"
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
        />,
        {
          wrapper: createWrapper,
        },
      )
      userEvent.click(screen.getByText('Тестовый placeholder'))
      const option = await screen.findByText('Первая')
      userEvent.click(option)
      expect(mockedSetFieldValue).toBeCalledTimes(1)
    })
  })
})
