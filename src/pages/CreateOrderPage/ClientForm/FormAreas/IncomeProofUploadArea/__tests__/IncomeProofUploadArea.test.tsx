import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { MockProviders } from 'tests/mocks'
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

const createWrapper =
  (additionalData?: { occupation: number }) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders>
        <Formik
          initialValues={{ ...mockedIncomeProofUploadFields, ...additionalData }}
          validationSchema={clientFormValidationSchema}
          onSubmit={() => {}}
        >
          <Form>
            {children}
            <Button type="submit" data-testid="submit" />
          </Form>
        </Formik>
      </MockProviders>
    )

disableConsole('error')

describe('IncomeProofUploadAreaTest', () => {
  describe('Все элементы отображаются на форме', () => {
    beforeEach(() => {
      render(<IncomeProofUploadArea />, {
        wrapper: createWrapper({ occupation: 1 }),
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

    it('Отображается секция для загрузки Выписки из банка', () => {
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(screen.getByText('Выписка из банка')).toBeInTheDocument()
    })
  })

  describe('Валидация при выборе Вида занятости', () => {
    it('Валидация при выборе ИП', async () => {
      render(<IncomeProofUploadArea />, {
        wrapper: createWrapper({ occupation: 4 }),
      })
      userEvent.click(screen.getByTestId('submit'))
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(screen.getByText('3НДФЛ')).toBeInTheDocument()
      expect(
        await screen.findAllByText('Необходимо загрузить подтверждающие документы (3НДФЛ обязателен)'),
      ).toHaveLength(2)
    })

    it('Валидация при выборе Служит по временному контракту', async () => {
      render(<IncomeProofUploadArea />, {
        wrapper: createWrapper({ occupation: 1 }),
      })
      userEvent.click(screen.getByTestId('submit'))
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(
        await screen.findAllByText('Необходимо загрузить подтверждающие документы (2НДФЛ обязателен)'),
      ).toHaveLength(2)
    })

    it('Валидация при выборе Частная практика', async () => {
      render(<IncomeProofUploadArea />, {
        wrapper: createWrapper({ occupation: 3 }),
      })
      userEvent.click(screen.getByTestId('submit'))
      userEvent.click(screen.getByText('Загрузить документы, подтверждающие доход'))
      expect(
        await screen.findAllByText(
          'Необходимо загрузить подтверждающие документы - 2НДФЛ или Выписка из банка',
        ),
      ).toHaveLength(2)
    })
  })
})
