import React from 'react'

import { createEvent, fireEvent, render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { DragAndDropWrapper } from '../DragAndDropWrapper'

const changeFn = jest.fn()

describe('DragAndDropWrapper', () => {
  it('корректная отрисовка компонента, обязательное наличие враппера', () => {
    render(
      <MockProviders>
        <DragAndDropWrapper onChange={changeFn}>
          <div />
        </DragAndDropWrapper>
      </MockProviders>,
    )

    expect(screen.getByTestId('dragArea')).toBeVisible()
    expect(screen.getByTestId('dragAreaWrapper')).toBeVisible()
  })

  it('проверка действий при событиях перетаскивания', () => {
    render(
      <MockProviders>
        <DragAndDropWrapper onChange={changeFn}>
          <div />
        </DragAndDropWrapper>
      </MockProviders>,
    )

    fireEvent.dragOver(screen.getByTestId('dragAreaWrapper'))
    expect(screen.getByTestId('dragArea')).toHaveClass('makeStyles-leaveFocus-6')
    fireEvent.dragOver(screen.getByTestId('dragArea'))
    expect(screen.getByTestId('dragArea')).toHaveClass('makeStyles-enterFocus-5')
    fireEvent.dragLeave(screen.getByTestId('dragArea'))
    expect(screen.getByTestId('dragArea')).toHaveClass('makeStyles-leaveFocus-6')
    const fileDropzone = screen.getByTestId('dragArea')
    const fileDropEvent = createEvent.drop(fileDropzone)
    const file = new File([''], 'foo.png', {
      type: 'image/png',
    })
    const fileList = [file]

    Object.defineProperty(fileDropEvent, 'dataTransfer', {
      value: {
        files: {
          item: (itemIndex: number) => fileList[itemIndex],
          length: fileList.length,
        },
      },
    })

    fireEvent(fileDropzone, fileDropEvent)

    expect(changeFn).toBeCalledTimes(1)
  })
})
