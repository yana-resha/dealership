import React, { PropsWithChildren } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { PreparedStatus } from '../../../application.utils'
import { AgreementArea } from '../AgreementArea'

const mockedFileAgreement = new File(['agreement'], 'Кредитный договор', {
  type: 'application/pdf',
})
const mockedFileExtra = new File(['extra'], 'Дополнительный документ', {
  type: 'application/pdf',
})

jest.mock('shared/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progressBar" />,
}))
jest.mock('shared/ui/UploadFile/UploadFile', () => ({
  UploadFile: ({ onClick }: any) => <div data-testid="uploadFile" onClick={onClick} />,
}))
jest.mock('../../__tests__/mocks/clientDetailedDossier.mock', () => ({
  getMockAgreement: async () => [mockedFileAgreement, mockedFileExtra],
}))

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('AgreementAreaTest', () => {
  describe('На каждом шаге отображаются все элементы', () => {
    it('Отображается ProgressBar', () => {
      render(<AgreementArea status={PreparedStatus.approved} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('progressBar')).toBeInTheDocument()
    })

    describe('Отображаются все элементы на 1-м шаге для статуса FinallyApproved (Кредит одобрен)', () => {
      it('Отображается кнопка "Редактировать"', () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
      })

      it('Отображается кнопка ""Сформировать договор', () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Сформировать договор')).toBeInTheDocument()
      })
    })

    describe('Отображается все элементы на 1-м шаге для статуса Formation (Формирование КД)', () => {
      it('Отсутствует кнопка "Редактировать"', () => {
        render(<AgreementArea status={PreparedStatus.formation} />, {
          wrapper: createWrapper,
        })

        expect(screen.queryByText('Редактировать')).not.toBeInTheDocument()
      })

      it('Отображается кнопка "Сформировать договор"', () => {
        render(<AgreementArea status={PreparedStatus.formation} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Сформировать договор')).toBeInTheDocument()
      })
    })

    describe('Отображаются все элементы на 2-м шаге', () => {
      it('Отображаются один плейсхолдер документа, пока они загружаются', async () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        userEvent.click(screen.getByText('Сформировать договор'))
        expect(await screen.findAllByTestId('uploadFile')).toHaveLength(1)
      })

      it('Отображается 2 документа после загрузки', async () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        userEvent.click(screen.getByText('Сформировать договор'))
        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(2))
      })

      it('После загрузки документов отображается кнопка "Вернуться..."', async () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        userEvent.click(screen.getByText('Сформировать договор'))
        await waitFor(async () =>
          expect(await screen.findByText('Вернуться на формирование договора')).toBeInTheDocument(),
        )
      })
    })

    describe('Отображаются все элементы на 3-м шаге', () => {
      it('После клика по документам появляются свитчи', async () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        userEvent.click(screen.getByText('Сформировать договор'))
        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(2))
        const documents = await screen.findAllByTestId('uploadFile')
        userEvent.click(documents[0])
        userEvent.click(documents[1])
        expect(await screen.findAllByText('Подписан')).toHaveLength(2)
      })
    })

    describe('Отображаются все элементы на 4-м шаге', () => {
      it('После подтверждения подписи документов появляется кнопка "Отправить..."', async () => {
        render(<AgreementArea status={PreparedStatus.finallyApproved} />, {
          wrapper: createWrapper,
        })

        userEvent.click(screen.getByText('Сформировать договор'))
        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(2))
        const documents = await screen.findAllByTestId('uploadFile')
        userEvent.click(documents[0])
        userEvent.click(documents[1])
        const switches = await screen.findAllByText('Подписан')
        userEvent.click(switches[0])
        userEvent.click(switches[1])
        expect(await screen.findByText('Отправить на финансирование')).toBeInTheDocument()
      })
    })
  })
})
