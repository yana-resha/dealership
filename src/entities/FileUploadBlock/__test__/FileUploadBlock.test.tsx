import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockProviders } from 'tests/mocks'

import { FileUploadBlock } from '../FileUploadBlock'

const changeFn = jest.fn()
const file = new File(['(⌐□_□)'], 'chucknorris.png', {
  type: 'image/png',
})

describe('FileUploadBlock', () => {
  it('корректная отрисовка компонента', () => {
    render(
      <MockProviders>
        <FileUploadBlock
          buttonText="button"
          title="title"
          text="text"
          multipleUpload
          onChange={changeFn}
          uniqName="uniq"
        />
      </MockProviders>,
    )

    expect(screen.getByText('button')).toBeVisible()
    expect(screen.getByText('title')).toBeVisible()
    expect(screen.getByText('text')).toBeVisible()
    expect(screen.getByTestId('fileUploadButtonInput')).toHaveAttribute('multiple')
  })

  it('корректная отрисовка компонента, только обязательные пропсы', () => {
    render(
      <MockProviders>
        <FileUploadBlock buttonText="button" onChange={changeFn} uniqName="uniq" />
      </MockProviders>,
    )

    expect(screen.getByText('button')).toBeVisible()
    expect(screen.queryByTestId('uploadFile')).not.toBeInTheDocument()
    expect(screen.queryByText('title')).not.toBeInTheDocument()
    expect(screen.queryByText('text')).not.toBeInTheDocument()
    expect(screen.getByTestId('fileUploadButtonInput')).not.toHaveAttribute('multiple')
  })

  it('Вызывается переданная функция, Показывается файл', () => {
    global.URL.createObjectURL = jest.fn().mockReturnValueOnce('foo.jpeg')

    render(
      <MockProviders>
        <FileUploadBlock buttonText="button" onChange={changeFn} uniqName="uniq" />
      </MockProviders>,
    )

    Object.defineProperty(screen.getByTestId('fileUploadButtonInput'), 'files', {
      value: [file],
    })

    fireEvent.change(screen.getByTestId('fileUploadButtonInput'))

    expect(changeFn).toBeCalledTimes(1)
    expect(screen.getByTestId('uploadFile')).toBeInTheDocument()
    expect(screen.getByText('chucknorris.png')).toBeInTheDocument()
  })

  it('при удалении файла он пропадает из видимости', () => {
    global.URL.createObjectURL = jest.fn().mockReturnValueOnce('foo.jpeg')

    render(
      <MockProviders>
        <FileUploadBlock buttonText="button" onChange={changeFn} uniqName="uniq" />
      </MockProviders>,
    )

    Object.defineProperty(screen.getByTestId('fileUploadButtonInput'), 'files', {
      value: [file],
    })

    fireEvent.change(screen.getByTestId('fileUploadButtonInput'))

    expect(changeFn).toBeCalledTimes(1)
    expect(screen.getByTestId('uploadFile')).toBeInTheDocument()
    expect(screen.getByText('chucknorris.png')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('deleteFileButton'))

    expect(screen.queryByTestId('uploadFile')).not.toBeInTheDocument()
  })
})
