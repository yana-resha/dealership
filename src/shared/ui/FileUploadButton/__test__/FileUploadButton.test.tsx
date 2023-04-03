import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { FileUploadButton } from '../FileUploadButton'

const changeFn = jest.fn()

describe('FileUploadButton', () => {
  it('корректная отрисовка компонента', () => {
    render(
      <MockProviders>
        <FileUploadButton buttonText="btn" uniqName="name" onChange={changeFn} multiple />
      </MockProviders>,
    )

    expect(screen.getByText('btn')).toBeVisible()
    expect(screen.getByTestId('fileUploadButtonInput')).toBeInTheDocument()
    expect(screen.getByTestId('fileUploadButtonInput')).toHaveAttribute('multiple')
  })

  it('Вызывается переданная функция', () => {
    render(
      <MockProviders>
        <FileUploadButton buttonText="btn" uniqName="name" onChange={changeFn} multiple />
      </MockProviders>,
    )

    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
      type: 'image/png',
    })

    Object.defineProperty(screen.getByTestId('fileUploadButtonInput'), 'files', {
      value: [file],
    })

    fireEvent.change(screen.getByTestId('fileUploadButtonInput'))

    expect(changeFn).toBeCalledTimes(1)
  })
})
