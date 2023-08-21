import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import * as mockFormik from 'formik'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { maskMobilePhoneNumber } from '../../../masks/InputMasks'
import { MaskedInputFormik } from '../MaskedInputFormik'

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik initialValues={{ testMaskedInputName: '' }} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('MaskedInputFormikTest', () => {
  describe('MaskedInputFormik обновляет значение формы', () => {
    it('При вводе текста в MaskedInputFormik вызывается setFieldValue', () => {
      const mockedSetFieldValue = jest.fn()
      jest.spyOn(mockFormik, 'useFormikContext').mockImplementation(
        () =>
          ({
            setFieldValue: mockedSetFieldValue,
          } as any),
      )
      render(
        <MaskedInputFormik
          name="testMaskedInputName"
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
