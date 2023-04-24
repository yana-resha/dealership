import React, { PropsWithChildren } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { DateInputFormik } from '../DateInputFormik'

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik initialValues={{ testDateName: '' }} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('DateInputFormikTest', () => {
  describe('DateInputFormik обновляет значение формы', () => {
    it('При вводе текста в DateInputFormik вызывается setFieldValue', () => {
      const mockedSetFieldValue = jest.fn()
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(<DateInputFormik name="testDateName" label="Тестовое поле для даты" />, {
        wrapper: createWrapper,
      })
      fireEvent.change(screen.getByPlaceholderText('ДД.ММ.ГГГГ'), { target: { value: '20.01.1998' } })
      expect(mockedSetFieldValue).toBeCalledTimes(1)
    })
  })
})
