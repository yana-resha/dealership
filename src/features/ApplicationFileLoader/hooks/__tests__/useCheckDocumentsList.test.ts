import {
  DocumentType,
  GetApplicationDocumentsListRequest,
  GetApplicationDocumentsListResponse,
} from '@sberauto/loanapplifecycledc-proto/public'
import { renderHook } from '@testing-library/react-hooks'
import { UseMutationResult } from 'react-query'

import * as loanAppLifeCycleDcModule from 'shared/api/requests/loanAppLifeCycleDc'
import { MockProviders } from 'tests/mocks'

import { useCheckDocumentsList } from '../useCheckDocumentsList'

const mockedUseGetApplicationDocumentsListMutation = jest.spyOn(
  loanAppLifeCycleDcModule,
  'useGetApplicationDocumentsListMutation',
)

const mockedGetApplicationDocumentsList = jest.fn()

describe('useCheckDocumentsList', () => {
  it('checkApplicationDocumentsList возвращает список документов', async () => {
    mockedUseGetApplicationDocumentsListMutation.mockImplementation(
      () =>
        ({
          mutateAsync: () =>
            Promise.resolve({
              uploadDocumentList: [
                { documentType: DocumentType.CREDIT_CONTRACT, fileName: 'CREDIT_CONTRACT' },
                { documentType: DocumentType.ACCOUNT_OPEN_FORM, fileName: 'ACCOUNT_OPEN_FORM' },
              ],
            }),
        } as unknown as UseMutationResult<
          GetApplicationDocumentsListResponse,
          unknown,
          GetApplicationDocumentsListRequest,
          unknown
        >),
    )

    const { result } = renderHook(() => useCheckDocumentsList(), { wrapper: MockProviders })
    const res = await result.current.checkApplicationDocumentsList('1', [
      DocumentType.CREDIT_CONTRACT,
      DocumentType.ACCOUNT_OPEN_FORM,
    ])

    expect(res).toEqual([
      { documentType: DocumentType.CREDIT_CONTRACT, fileName: 'CREDIT_CONTRACT' },
      { documentType: DocumentType.ACCOUNT_OPEN_FORM, fileName: 'ACCOUNT_OPEN_FORM' },
    ])
  })

  it(`Если возвращаемое кол-во доков не меньше запрашиваемого,
  checkApplicationDocumentsList повторяет запрос заданное кол-во попыток (в attemptLimit),
  после чего возвращает пустой массив`, async () => {
    mockedUseGetApplicationDocumentsListMutation.mockImplementation(
      () =>
        ({
          mutateAsync: mockedGetApplicationDocumentsList.mockImplementation(() => ({
            uploadDocumentList: [{ documentType: DocumentType.CREDIT_CONTRACT, fileName: 'CREDIT_CONTRACT' }],
          })),
        } as unknown as UseMutationResult<
          GetApplicationDocumentsListResponse,
          unknown,
          GetApplicationDocumentsListRequest,
          unknown
        >),
    )

    const { result } = renderHook(() => useCheckDocumentsList(), { wrapper: MockProviders })
    const res = await result.current.checkApplicationDocumentsList(
      '1',
      [DocumentType.CREDIT_CONTRACT, DocumentType.ACCOUNT_OPEN_FORM],
      {
        attemptLimit: 2,
        timeout: 5,
        interval: 0.1,
      },
    )

    expect(mockedGetApplicationDocumentsList).toBeCalledTimes(2)
    expect(res).toEqual([])
  })
})
