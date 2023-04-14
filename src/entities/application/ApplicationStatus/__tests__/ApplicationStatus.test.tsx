import React from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ApplicationStatus } from '../ApplicationStatus'

describe('ApplicationStatus', () => {
  describe('в зависимости от полученного на вход значения верно отрисовывает компонент', () => {
    it('initial', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_INITIAL} />)

      expect(screen.getByText('Черновик')).toBeInTheDocument()
      expect(screen.getByText('Черновик')).toHaveStyle('background-color: rgb(11, 107, 157)')
    })
    it('processed', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_PROCESSED} />)

      expect(screen.getByText('Ожидает решение')).toBeInTheDocument()
      expect(screen.getByText('Ожидает решение')).toHaveStyle('background-color: rgb(255, 151, 30)')
    })
    it('rejected', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_REJECTED} />)

      expect(screen.getByText('Отказ')).toBeInTheDocument()
      expect(screen.getByText('Отказ')).toHaveStyle('background-color: rgb(255, 46, 67)')
    })
    it('error', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_ERROR} />)

      expect(screen.getByText('Ошибка')).toBeInTheDocument()
      expect(screen.getByText('Ошибка')).toHaveStyle('background-color: rgb(255, 0, 0)')
    })
    it('approved', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_APPROVED} />)

      expect(screen.getByText('Предварительно одобрен')).toBeInTheDocument()
      expect(screen.getByText('Предварительно одобрен')).toHaveStyle('background-color: rgb(23, 161, 49)')
    })
    it('canceled', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_CANCELED} />)

      expect(screen.getByText('Отменен')).toBeInTheDocument()
      expect(screen.getByText('Отменен')).toHaveStyle('background-color: rgb(215, 220, 225)')
    })
    it('authorized', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_AUTHORIZED} />)

      expect(screen.getByText('Ожидание финансирования')).toBeInTheDocument()
      expect(screen.getByText('Ожидание финансирования')).toHaveStyle('background-color: rgb(0, 255, 0)')
    })
    it('canceledDeal', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_CANCELED_DEAL} />)

      expect(screen.getByText('КД Отменен')).toBeInTheDocument()
      expect(screen.getByText('КД Отменен')).toHaveStyle('background-color: rgb(211, 211, 211)')
    })
    it('finallyApproved', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_FINALLY_APPROVED} />)

      expect(screen.getByText('Кредит одобрен')).toBeInTheDocument()
      expect(screen.getByText('Кредит одобрен')).toHaveStyle('background-color: rgb(0, 128, 0)')
    })
    it('financed', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_FINANCED} />)

      expect(screen.getByText('Кредит выдан')).toBeInTheDocument()
      expect(screen.getByText('Кредит выдан')).toHaveStyle('background-color: rgb(0, 255, 127)')
    })
    it('formation', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_FORMATION} />)

      expect(screen.getByText('Формирование КД')).toBeInTheDocument()
      expect(screen.getByText('Формирование КД')).toHaveStyle('background-color: rgb(0, 128, 0)')
    })
    it('signed', () => {
      render(<ApplicationStatus status={StatusCode.STATUS_CODE_SIGNED} />)

      expect(screen.getByText('КД подписан')).toBeInTheDocument()
      expect(screen.getByText('КД подписан')).toHaveStyle('background-color: rgb(0, 128, 0)')
    })
  })

  it('если пришло неопознанное значение, показываем ошибку', () => {
    //@ts-ignore
    render(<ApplicationStatus status="ацыацу" />)

    expect(screen.getByText('Ошибка')).toBeInTheDocument()
    expect(screen.getByText('Ошибка')).toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})
