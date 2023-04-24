import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SwitchInputFormik } from '../SwitchInputFormik'

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik initialValues={{ testSwitchInputName: '' }} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('SwitchInputFormikTest', () => {
  describe('SwitchInputFormik обновляет значение формы', () => {
    it('При нажатии на SwitchInputFormik вызывается setFieldValue', () => {
      const mockedSetFieldValue = jest.fn()
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(<SwitchInputFormik name="testSwitchInputName" label="Тестовый switch" />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Тестовый switch'))
      expect(mockedSetFieldValue).toBeCalledTimes(1)
    })
  })
})
