import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { maskMobilePhoneNumber } from '../../../masks/InputMasks'
import { AdornmentInputFormik } from '../AdornmentInputFormik'

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik initialValues={{ testMaskedInputName: '' }} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('AdornmentInputFormikTest', () => {
  describe('AdornmentInputFormik обновляет значение формы', () => {
    it('При вводе текста в MaskedInputFormik вызывается setFieldValue', () => {
      const mockedSetFieldValue = jest.fn()
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(
        <AdornmentInputFormik
          name="testAdornmentInputName"
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskMobilePhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
      userEvent.type(screen.getByRole('textbox'), '89164737498')
      expect(mockedSetFieldValue).toBeCalledTimes(11)
    })
  })
})
