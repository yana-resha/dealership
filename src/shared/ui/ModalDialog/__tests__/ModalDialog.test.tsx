import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { ModalDialog } from '../ModalDialog'

const onClose = jest.fn()

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ModalDialogTest', () => {
  describe('Все элементы диалога отображаются на форме', () => {
    beforeEach(() => {
      render(
        <ModalDialog isVisible={true} label="Тестовый диалог" onClose={onClose}>
          Тестовый контент
        </ModalDialog>,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Заголовок диалога отображается на форме', () => {
      expect(screen.getByText('Тестовый диалог')).toBeInTheDocument()
    })

    it('Кнопка закрытия диалога отображается на форме', () => {
      expect(screen.getByTestId('modalDialogClose')).toBeInTheDocument()
    })

    it('Контент диалога отображается на форме', () => {
      expect(screen.getByText('Тестовый контент')).toBeInTheDocument()
    })
  })

  describe('Диалог закрывается', () => {
    beforeEach(() => {
      render(
        <ModalDialog isVisible={true} label="Тестовый диалог" onClose={onClose}>
          Тестовый контент
        </ModalDialog>,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Диалог закрывается при нажатии на кнопку закрытия', () => {
      userEvent.click(screen.getByTestId('modalDialogClose'))
      expect(onClose).toBeCalledTimes(1)
    })
  })
})
