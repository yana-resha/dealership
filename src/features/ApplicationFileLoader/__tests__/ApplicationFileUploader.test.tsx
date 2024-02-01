import { PropsWithChildren } from 'react'

import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'
import { fireEvent, render, screen } from '@testing-library/react'

import * as useDownloadDocumentModule from 'features/ApplicationFileLoader/hooks/useDownloadDocument'
import * as useUploadDocumentModule from 'features/ApplicationFileLoader/hooks/useUploadDocument'
import { ThemeProviderMock } from 'tests/mocks'

import { Uploader } from '../ApplicationFileUploader'
import { DocumentUploadStatus, FileInfo, UploaderConfig } from '../ApplicationFileUploader.types'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

jest.mock('shared/ui/FileDownloader')
const mockedOnUploadDocument = jest.fn()
const mockedOnRemoveDocument = jest.fn()
const mockedSendFile = jest.fn()

const mockedUseUploadDocument = jest.spyOn(useUploadDocumentModule, 'useUploadDocument')
const mockedUseDownloadDocument = jest.spyOn(useDownloadDocumentModule, 'useDownloadDocument')

const UPLOADER_CONFIG: UploaderConfig = {
  documentLabel: '2НДФЛ',
  documentName: 'ndfl2File',
  documentType: DocumentType.TWO_NDFL,
  documentFile: {
    file: {
      dcAppId: '1',
      documentType: DocumentType.TWO_NDFL,
      name: 'fileName',
    },
    status: DocumentUploadStatus.Local,
  },
}

describe('ApplicationFileUploader', () => {
  describe('Отображение компонента', () => {
    beforeEach(() => {
      mockedUseUploadDocument.mockImplementation(() => ({
        sendFile: mockedSendFile,
      }))
      mockedUseDownloadDocument.mockImplementation(() => ({
        downloadFile: jest.fn(),
      }))
    })

    it('Если нет ни функции загрузки, ни файла, то компонент ничего не возвращает', () => {
      render(<Uploader uploaderConfig={{ ...UPLOADER_CONFIG, documentFile: null }} />, {
        wrapper: createWrapper,
      })
      expect(screen.queryByTestId('uploaderContainer')).not.toBeInTheDocument()
      expect(screen.queryByTestId('uploaderDragAndDropContainer')).not.toBeInTheDocument()
    })

    it('Если нет функции загрузки, но есть файл, то компонент возвращает uploaderContainer', () => {
      render(<Uploader uploaderConfig={UPLOADER_CONFIG} />, {
        wrapper: createWrapper,
      })
      expect(screen.queryByTestId('uploaderContainer')).toBeInTheDocument()
      expect(screen.queryByTestId('uploaderDragAndDropContainer')).not.toBeInTheDocument()
      expect(screen.queryByTestId('documentLabel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('errorMessage')).not.toBeInTheDocument()
    })

    it('Если есть функция загрузки, то компонент возвращает uploaderDragAndDropContainer', () => {
      render(<Uploader uploaderConfig={UPLOADER_CONFIG} onUploadDocument={mockedOnUploadDocument} />, {
        wrapper: createWrapper,
      })
      expect(screen.queryByTestId('uploaderContainer')).not.toBeInTheDocument()
      expect(screen.queryByTestId('uploaderDragAndDropContainer')).toBeInTheDocument()
      expect(screen.queryByTestId('documentLabel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('errorMessage')).not.toBeInTheDocument()
      expect(screen.queryByTestId('documentLabel')).not.toBeInTheDocument()
      expect(screen.queryByTestId('suggestion')).not.toBeInTheDocument()
    })

    it('Лэйбл, ошибка отображаются (при наличии) в uploaderContainer', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentFile: {
              ...(UPLOADER_CONFIG.documentFile as FileInfo),
              status: DocumentUploadStatus.Error,
            },
          }}
          isShowLabel={true}
        />,
        { wrapper: createWrapper },
      )
      expect(screen.getByText('2НДФЛ')).toBeInTheDocument()
      expect(screen.getByText('Не удалось загрузить файл')).toBeInTheDocument()
    })

    it('Лэйбл, подсказка, ошибка отображаются (при наличии) в uploaderDragAndDropContainer', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentFile: {
              ...(UPLOADER_CONFIG.documentFile as FileInfo),
              status: DocumentUploadStatus.Error,
            },
          }}
          onUploadDocument={mockedOnUploadDocument}
          suggest="Загрузите или перетащите файл"
          isShowLabel={true}
        />,
        { wrapper: createWrapper },
      )
      expect(screen.getByText('Загрузите или перетащите файл')).toBeInTheDocument()
      expect(screen.getByText('2НДФЛ')).toBeInTheDocument()
      expect(screen.getByText('Не удалось загрузить файл')).toBeInTheDocument()
      expect(screen.queryByTestId('uploadFile')).toBeInTheDocument()
    })

    it('В uploaderDragAndDropContainer отображается fileUploadButton если нет файла', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentFile: null,
          }}
          onUploadDocument={mockedOnUploadDocument}
        />,
        { wrapper: createWrapper },
      )
      expect(screen.queryByTestId('uploadFile')).not.toBeInTheDocument()
      expect(screen.queryByTestId('fileUploadButton')).toBeInTheDocument()
    })

    it('В uploaderDragAndDropContainer отображается fileUploadButton если статус файла Progress', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentFile: {
              ...(UPLOADER_CONFIG.documentFile as FileInfo),
              status: DocumentUploadStatus.Progress,
            },
          }}
          onUploadDocument={mockedOnUploadDocument}
        />,
        { wrapper: createWrapper },
      )
      expect(screen.queryByTestId('uploadFile')).not.toBeInTheDocument()
      expect(screen.queryByTestId('fileUploadButton')).toBeInTheDocument()
    })

    it('Ошибка отображается в uploaderContainer, если есть documentError', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentError: 'documentError',
          }}
        />,
        { wrapper: createWrapper },
      )
      expect(screen.getByText('documentError')).toBeInTheDocument()
    })

    it('Ошибка отображается в uploaderDragAndDropContainer, если есть documentError', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentError: 'documentError',
          }}
          onUploadDocument={mockedOnUploadDocument}
        />,
        { wrapper: createWrapper },
      )
      expect(screen.getByText('documentError')).toBeInTheDocument()
    })
  })

  describe('Работа компонента', () => {
    beforeEach(() => {
      mockedUseUploadDocument.mockImplementation(() => ({
        sendFile: mockedSendFile,
      }))
      mockedUseDownloadDocument.mockImplementation(() => ({
        downloadFile: jest.fn(),
      }))
    })

    it('Если есть функция удаления, то она будет вызвана по нажатию на кнопку удалить', () => {
      render(
        <Uploader
          uploaderConfig={UPLOADER_CONFIG}
          onUploadDocument={mockedOnUploadDocument}
          onRemoveDocument={mockedOnRemoveDocument}
        />,
        {
          wrapper: createWrapper,
        },
      )
      fireEvent.click(screen.getByTestId('uploadFileRemove'))
      expect(mockedOnRemoveDocument).toBeCalledWith('ndfl2File')
    })

    it('Функция удаления будет вызвана, если удаление отключено', () => {
      render(
        <Uploader
          uploaderConfig={UPLOADER_CONFIG}
          onUploadDocument={mockedOnUploadDocument}
          onRemoveDocument={mockedOnRemoveDocument}
          isDisabledRemove
        />,
        {
          wrapper: createWrapper,
        },
      )
      fireEvent.click(screen.getByTestId('uploadFileRemove'))
      expect(mockedOnRemoveDocument).not.toBeCalled()
    })

    it('sendFile вызывается', () => {
      render(<Uploader uploaderConfig={UPLOADER_CONFIG} onUploadDocument={mockedOnUploadDocument} />, {
        wrapper: createWrapper,
      })
      expect(mockedSendFile).toBeCalled()
    })

    it('sendFile не вызывается, если не передана функция загрузки', () => {
      render(<Uploader uploaderConfig={UPLOADER_CONFIG} />, {
        wrapper: createWrapper,
      })
      expect(mockedSendFile).not.toBeCalled()
    })

    it('sendFile не вызывается, если не передана file', () => {
      render(
        <Uploader
          uploaderConfig={{ ...UPLOADER_CONFIG, documentFile: null }}
          onUploadDocument={mockedOnUploadDocument}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(mockedSendFile).not.toBeCalled()
    })

    it('sendFile не вызывается, если статус загрузки файла отличен от local', () => {
      render(
        <Uploader
          uploaderConfig={{
            ...UPLOADER_CONFIG,
            documentFile: {
              ...(UPLOADER_CONFIG.documentFile as FileInfo),
              status: DocumentUploadStatus.Progress,
            },
          }}
          onUploadDocument={mockedOnUploadDocument}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(mockedSendFile).not.toBeCalled()
    })

    it('sendFile не вызывается, если загрузка запрещена', () => {
      render(
        <Uploader
          uploaderConfig={UPLOADER_CONFIG}
          onUploadDocument={mockedOnUploadDocument}
          isAllowedUploadToServer={false}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(mockedSendFile).not.toBeCalled()
    })
  })
})
