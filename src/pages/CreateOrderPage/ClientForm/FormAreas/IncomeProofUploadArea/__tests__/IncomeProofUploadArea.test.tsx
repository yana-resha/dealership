import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { IncomeProofUploadArea } from '../IncomeProofUploadArea'

const mockedIncomeProofUploadFields = {
  incomeProofUploadValidator: '',
  incomeConfirmation: true,
  ndfl2File: null,
  ndfl3File: null,
  bankStatementFile: null,
}

const mockedFile = new File(['file'], 'File', {
  type: 'application/pdf',
})

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedIncomeProofUploadFields}
      validationSchema={clientFormValidationSchema}
      onSubmit={() => {}}
    >
      <Form>
        {children}
        <Button type="submit" data-testid="submit" />
      </Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('IncomeProofUploadAreaTest', () => {
  describe('Все элементы отображаются на форме', () => {
    beforeEach(() => {
      render(<IncomeProofUploadArea />, {
        wrapper: createWrapper,
      })
    })

    it('Кнопка загрузки файлов отображается на форме', () => {
      expect(screen.getByText('Загрузить документы, подтверждающие доход')).toBeInTheDocument()
    })

    it('Отображается заголовок формы', () => {
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(screen.getByText('Документы, подтверждающие доход')).toBeInTheDocument()
    })

    it('Отображается секция для загрузки 2НДФЛ', () => {
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(screen.getByText('2НДФЛ')).toBeInTheDocument()
    })

    it('Отображается секция для загрузки 3НДФЛ', () => {
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(screen.getByText('3НДФЛ')).toBeInTheDocument()
    })

    it('Отображается секция для загрузки Выписки из банка', () => {
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(screen.getByText('Выписка из банка')).toBeInTheDocument()
    })
  })

  describe('Форма валидируется', () => {
    beforeEach(() => {
      render(<IncomeProofUploadArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
    })

    it('Если файлы отсутствуют, выводится сообщение об ошибке', async () => {
      expect(await screen.findAllByText('Необходимо загрузить подтверждающие документы')).toHaveLength(2)
    })

    it('Если загружен 2НДФЛ и другой файл, выводится сообщение об ошибке', async () => {
      const uploadButton = screen.getAllByText('Загрузить документ')
      fireEvent.change(uploadButton[0], {
        target: { files: [mockedFile] },
      })
      fireEvent.change(uploadButton[1], {
        target: { files: [mockedFile] },
      })
      expect(await screen.findAllByText('Необходимо загрузить подтверждающие документы')).toHaveLength(2)
    })
  })
})
