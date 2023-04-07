import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { PreparedStatus } from '../../../application.utils'
import { ActionArea } from '../ActionArea'

const mockedFileQuestionnaire = new File(['anketa'], 'anketa.png', {
  type: 'image/png',
})

jest.mock('entities/application/DossierAreas/AgreementArea/AgreementArea', () => ({
  AgreementArea: () => <div data-testid="agreementArea" />,
}))
jest.mock('shared/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progressBar" />,
}))

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ActionAreaTest', () => {
  describe('Отображаются все элементы для каждого статуса', () => {
    it('Отображается название области экрана "Действие"', () => {
      render(<ActionArea status={PreparedStatus.initial} fileQuestionnaire={undefined} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('Действие')).toBeInTheDocument()
    })

    describe('Статус Initial (Черновик)', () => {
      it('Если файл анкеты отсутствует, отображатеся только кнопка "Редактировать"', () => {
        render(<ActionArea status={PreparedStatus.initial} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
        expect(screen.queryByText('Отправить на решение')).not.toBeInTheDocument()
      })

      it('Если файл анкеты присутствует, отображаются 2 кнопки', () => {
        render(<ActionArea status={PreparedStatus.initial} fileQuestionnaire={mockedFileQuestionnaire} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
        expect(screen.getByText('Отправить на решение')).toBeInTheDocument()
      })
    })

    describe('Статус Approved (Предварительно одобрен)', () => {
      it('Отображаются кнопки "Редактировать" и "Дозаполнить анкету"', () => {
        render(<ActionArea status={PreparedStatus.approved} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
        expect(screen.getByText('Дозаполнить анкету')).toBeInTheDocument()
      })
    })

    describe('Статус FinallyApproved (Кредит одобрен)', () => {
      it('Отображается блок "AgreementArea"', () => {
        render(<ActionArea status={PreparedStatus.formation} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByTestId('agreementArea')).toBeInTheDocument()
      })
    })

    describe('Статус Formation (Формирование КД)', () => {
      it('Отображается блок "AgreementArea"', () => {
        render(<ActionArea status={PreparedStatus.formation} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByTestId('agreementArea')).toBeInTheDocument()
      })
    })

    describe('Статус CanceledDeal (КД отменен)', () => {
      it('Отображается кнопка "Пересоздать заявку"', () => {
        render(<ActionArea status={PreparedStatus.canceledDeal} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Пересоздать заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Canceled (Отменен)', () => {
      it('Отображается кнопка "Пересоздать заявку"', () => {
        render(<ActionArea status={PreparedStatus.canceled} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Пересоздать заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Signed (КД подписан)', () => {
      it('Отображается ProgressBar', () => {
        render(<ActionArea status={PreparedStatus.signed} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByTestId('progressBar')).toBeInTheDocument()
      })

      it('Отображается кнопка "Отправить на финансирование"', () => {
        render(<ActionArea status={PreparedStatus.signed} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Отправить на финансирование')).toBeInTheDocument()
      })
    })

    describe('Статус Error (Ошибка)', () => {
      it('Отображается кнопка "Редактировать"', () => {
        render(<ActionArea status={PreparedStatus.error} fileQuestionnaire={undefined} />, {
          wrapper: createWrapper,
        })

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
      })
    })
  })
})
