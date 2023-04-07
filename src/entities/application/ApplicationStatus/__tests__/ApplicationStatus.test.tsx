import React from 'react'

import { render, screen } from '@testing-library/react'

import { ApplicationStatus } from '../ApplicationStatus'

describe('ApplicationStatus', () => {
  describe('в зависимости от полученного на вход значения верно отрисовывает компонент', () => {
    it('initial', () => {
      render(<ApplicationStatus status="initial" />)

      expect(screen.getByText('Черновик')).toBeInTheDocument()
      expect(screen.getByText('Черновик')).toHaveStyle('background-color: rgb(0, 0, 255)')
    })
    it('processed', () => {
      render(<ApplicationStatus status="processed" />)

      expect(screen.getByText('Ожидает решение')).toBeInTheDocument()
      expect(screen.getByText('Ожидает решение')).toHaveStyle('background-color: rgb(255, 140, 0)')
    })
    it('rejected', () => {
      render(<ApplicationStatus status="rejected" />)

      expect(screen.getByText('Отказ')).toBeInTheDocument()
      expect(screen.getByText('Отказ')).toHaveStyle('background-color: rgb(139, 0, 0)')
    })
    it('error', () => {
      render(<ApplicationStatus status="error" />)

      expect(screen.getByText('Ошибка')).toBeInTheDocument()
      expect(screen.getByText('Ошибка')).toHaveStyle('background-color: rgb(255, 0, 0)')
    })
    it('approved', () => {
      render(<ApplicationStatus status="approved" />)

      expect(screen.getByText('Предварительно одобрен')).toBeInTheDocument()
      expect(screen.getByText('Предварительно одобрен')).toHaveStyle('background-color: rgb(34, 139, 34)')
    })
    it('canceled', () => {
      render(<ApplicationStatus status="canceled" />)

      expect(screen.getByText('Отменен')).toBeInTheDocument()
      expect(screen.getByText('Отменен')).toHaveStyle('background-color: rgb(211, 211, 211)')
    })
    it.todo('Дописать на остальные статусы когда появится enum')
  })

  it('если пришло неопознанное значение, показываем ошибку', () => {
    render(<ApplicationStatus status="ацыацу" />)

    expect(screen.getByText('Ошибка')).toBeInTheDocument()
    expect(screen.getByText('Ошибка')).toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})
