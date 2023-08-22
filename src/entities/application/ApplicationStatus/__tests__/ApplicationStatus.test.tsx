import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ApplicationStatus } from '../ApplicationStatus'

describe('ApplicationStatus', () => {
  describe('в зависимости от полученного на вход значения верно отрисовывает компонент', () => {
    it('initial', () => {
      render(<ApplicationStatus status={StatusCode.INITIAL} />)

      expect(screen.getByText('Черновик')).toBeInTheDocument()
      expect(screen.getByText('Черновик')).toHaveStyle('background-color: rgb(11, 107, 157)')
    })
    it('processed', () => {
      render(<ApplicationStatus status={StatusCode.PROCESSED} />)

      expect(screen.getByText('Ожидает решение')).toBeInTheDocument()
      expect(screen.getByText('Ожидает решение')).toHaveStyle('background-color: rgb(255, 151, 30)')
    })
    it('rejected', () => {
      render(<ApplicationStatus status={StatusCode.REJECTED} />)

      expect(screen.getByText('Отказ')).toBeInTheDocument()
      expect(screen.getByText('Отказ')).toHaveStyle('background-color: rgb(255, 46, 67)')
    })
    it('clientRejected', () => {
      render(<ApplicationStatus status={StatusCode.CLIENT_REJECTED} />)

      expect(screen.getByText('Отказ по клиенту')).toBeInTheDocument()
      expect(screen.getByText('Отказ по клиенту')).toHaveStyle('background-color: rgb(255, 46, 67)')
    })
    it('error', () => {
      render(<ApplicationStatus status={StatusCode.ERROR} />)

      expect(screen.getByText('Ошибка')).toBeInTheDocument()
      expect(screen.getByText('Ошибка')).toHaveStyle('background-color: rgb(255, 0, 0)')
    })
    it('approved', () => {
      render(<ApplicationStatus status={StatusCode.APPROVED} />)

      expect(screen.getByText('Предварительно одобрен')).toBeInTheDocument()
      expect(screen.getByText('Предварительно одобрен')).toHaveStyle('background-color: rgb(23, 161, 49)')
    })
    it('canceled', () => {
      render(<ApplicationStatus status={StatusCode.CANCELED} />)

      expect(screen.getByText('Отменен')).toBeInTheDocument()
      expect(screen.getByText('Отменен')).toHaveStyle('background-color: rgb(215, 220, 225)')
    })
    it('authorized', () => {
      render(<ApplicationStatus status={StatusCode.AUTHORIZED} />)

      expect(screen.getByText('Ожидание финансирования')).toBeInTheDocument()
      expect(screen.getByText('Ожидание финансирования')).toHaveStyle('background-color: rgb(255, 151, 30)')
    })
    it('canceledDeal', () => {
      render(<ApplicationStatus status={StatusCode.CANCELED_DEAL} />)

      expect(screen.getByText('КД Отменен')).toBeInTheDocument()
      expect(screen.getByText('КД Отменен')).toHaveStyle('background-color: rgb(211, 211, 211)')
    })
    it('finallyApproved', () => {
      render(<ApplicationStatus status={StatusCode.FINALLY_APPROVED} />)

      expect(screen.getByText('Кредит одобрен')).toBeInTheDocument()
      expect(screen.getByText('Кредит одобрен')).toHaveStyle('background-color: rgb(23, 161, 49)')
    })
    it('financed', () => {
      render(<ApplicationStatus status={StatusCode.ISSUED} />)

      expect(screen.getByText('Кредит выдан')).toBeInTheDocument()
      expect(screen.getByText('Кредит выдан')).toHaveStyle('background-color: rgb(23, 161, 49)')
    })
    it('formation', () => {
      render(<ApplicationStatus status={StatusCode.FORMATION} />)

      expect(screen.getByText('Формирование КД')).toBeInTheDocument()
      expect(screen.getByText('Формирование КД')).toHaveStyle('background-color: rgb(23, 161, 49)')
    })
    it('signed', () => {
      render(<ApplicationStatus status={StatusCode.SIGNED} />)

      expect(screen.getByText('КД подписан')).toBeInTheDocument()
      expect(screen.getByText('КД подписан')).toHaveStyle('background-color:  rgb(23, 161, 49)')
    })
  })

  it('если пришло неопознанное значение, показываем ошибку', () => {
    //@ts-ignore
    render(<ApplicationStatus status="Какой-то не валидный статус" />)

    expect(screen.getByText('Ошибка')).toBeInTheDocument()
    expect(screen.getByText('Ошибка')).toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})
