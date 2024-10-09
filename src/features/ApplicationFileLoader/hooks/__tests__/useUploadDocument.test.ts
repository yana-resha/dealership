import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'
import { renderHook } from '@testing-library/react-hooks'

import * as ApplicationProviderModule from 'entities/applications/ApplicationProvider/ApplicationProvider'
import {
  DocumentUploadStatus,
  UploaderConfig,
} from 'features/ApplicationFileLoader/ApplicationFileUploader.types'
import * as useCheckDocumentsListModule from 'features/ApplicationFileLoader/hooks/useCheckDocumentsList'
import { MockProviders } from 'tests/mocks'

import { useUploadDocument } from '../useUploadDocument'

const mockedFile = new File(['testFile'], 'foo.pdf', { type: 'application/pdf' })
const mockedOnUploadDocument = jest.fn()
const mockedUploadDocumentMutate = jest.fn()
const mockedOnError = jest.fn()

jest.mock('shared/api/requests/loanAppLifeCycleDc', () => ({
  useUploadDocumentMutation: () => ({ mutateAsync: mockedUploadDocumentMutate }),
}))

const mockedUseApplicationContext = jest.spyOn(ApplicationProviderModule, 'useApplicationContext')
const mockedUseCheckDocumentsList = jest.spyOn(useCheckDocumentsListModule, 'useCheckDocumentsList')

describe('useUploadDocument', () => {
  beforeEach(() => {
    mockedUseApplicationContext.mockImplementation(() => ({
      getOrderId: () => Promise.resolve('1'),
    }))
    mockedUseCheckDocumentsList.mockImplementation(() => ({
      checkApplicationDocumentsList: () =>
        Promise.resolve([{ documentType: DocumentType.CREDIT_CONTRACT, fileName: 'CREDIT_CONTRACT' }]),
    }))
  })

  it('sendFile загружает файл с верным именем, корректно меняет статусы', async () => {
    const { result } = renderHook(
      () =>
        useUploadDocument({
          uploaderConfig: {
            documentName: 'TWO_NDFL',
            documentFile: { file: mockedFile, status: DocumentUploadStatus.Local },
            documentType: DocumentType.TWO_NDFL,
          } as UploaderConfig,
          onError: mockedOnError,
          onUploadDocument: mockedOnUploadDocument,
        }),
      { wrapper: MockProviders },
    )
    await result.current.sendFile()

    expect(mockedUploadDocumentMutate).toHaveBeenCalled()
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Progress)
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Sended)
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Uploaded)
    expect(mockedOnUploadDocument).toHaveBeenCalledTimes(3)
  })

  it('Без файла sendFile ничего не делает', async () => {
    const { result } = renderHook(
      () =>
        useUploadDocument({
          uploaderConfig: {
            documentName: 'TWO_NDFL',
            documentFile: {
              file: { dcAppId: '1', documentType: DocumentType.CREDIT_CONTRACT }, // не файл
              status: DocumentUploadStatus.Local,
            },
            documentType: DocumentType.TWO_NDFL,
          } as UploaderConfig,
          onError: mockedOnError,
          onUploadDocument: mockedOnUploadDocument,
        }),
      { wrapper: MockProviders },
    )
    await result.current.sendFile()

    expect(mockedUploadDocumentMutate).not.toHaveBeenCalled()
    expect(mockedOnUploadDocument).not.toHaveBeenCalled()
  })

  it('Если checkApplicationDocumentsList не вернет инфо о загруженном файле, обработается ошибка', async () => {
    mockedUseCheckDocumentsList.mockImplementation(() => ({
      checkApplicationDocumentsList: () => Promise.resolve([]),
    }))

    const { result } = renderHook(
      () =>
        useUploadDocument({
          uploaderConfig: {
            documentName: 'TWO_NDFL',
            documentFile: { file: mockedFile, status: DocumentUploadStatus.Local },
            documentType: DocumentType.TWO_NDFL,
          } as UploaderConfig,
          onError: mockedOnError,
          onUploadDocument: mockedOnUploadDocument,
        }),
      { wrapper: MockProviders },
    )
    await result.current.sendFile()

    expect(mockedUploadDocumentMutate).toHaveBeenCalled()
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Progress)
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Sended)
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Error)
    expect(mockedOnUploadDocument).toHaveBeenCalledTimes(3)
    expect(mockedOnError).toHaveBeenCalledWith('TWO_NDFL')
  })

  it('Если getOrderId не вернет id заявки, обработается ошибка, файл загружаться не будет', async () => {
    mockedUseApplicationContext.mockImplementation(() => ({
      getOrderId: () => Promise.resolve(''),
    }))

    const { result } = renderHook(
      () =>
        useUploadDocument({
          uploaderConfig: {
            documentName: 'TWO_NDFL',
            documentFile: { file: mockedFile, status: DocumentUploadStatus.Local },
            documentType: DocumentType.TWO_NDFL,
          } as UploaderConfig,
          onError: mockedOnError,
          onUploadDocument: mockedOnUploadDocument,
        }),
      { wrapper: MockProviders },
    )
    await result.current.sendFile()

    expect(mockedUploadDocumentMutate).not.toHaveBeenCalled()
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Progress)
    expect(mockedOnUploadDocument).toHaveBeenCalledWith(mockedFile, 'TWO_NDFL', DocumentUploadStatus.Error)
    expect(mockedOnUploadDocument).toHaveBeenCalledTimes(2)
    expect(mockedOnError).toHaveBeenCalledWith('TWO_NDFL')
  })
})
