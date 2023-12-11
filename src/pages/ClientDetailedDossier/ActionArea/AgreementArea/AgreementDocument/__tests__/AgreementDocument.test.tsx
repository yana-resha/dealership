import { PropsWithChildren } from 'react'

import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { DocsStatus } from '../../AgreementArea.config'
import { AgreementDocument } from '../AgreementDocument'

const DOCUMENT_TYPES = [
  DocumentType.UNSPECIFIED,
  DocumentType.CONSENT_FORM,
  DocumentType.CREDIT_CONTRACT,
  DocumentType.TWO_NDFL,
  DocumentType.TAX_DECLARATION,
  DocumentType.CERTIFICATE_FREE_FORM,
  DocumentType.FEE_SCHEDULE,
  DocumentType.ACCOUNT_OPEN_FORM,
  DocumentType.STATEMENT_FORM,
  DocumentType.OUK_FORM,
  DocumentType.ESTIMATED_FEE_SCHEDULE,
  DocumentType.ACCOUNT_OPEN_INSTRUCTION,
  DocumentType.CREDIT_CHECKLIST,
  DocumentType.SHARING_FORM,
]
const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

describe('AgreementDocument', () => {
  it('При статусе Received отображается только сам документ', async () => {
    render(
      <AgreementDocument
        document={{
          dcAppId: 'applicationId',
          documentType: DocumentType.CREDIT_CONTRACT,
          name: 'name',
        }}
        index={0}
        isRightsAssigned={false}
        docsStatus={[DocsStatus.Received]}
        setDocsStatus={jest.fn}
        setRightsAssigned={jest.fn}
        changeApplicationStatusToSigned={jest.fn}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.queryByTestId('uploadFile')).toBeInTheDocument()
    expect(screen.queryByText('Подписан')).not.toBeInTheDocument()
    expect(screen.queryByText('Согласие на уступку прав')).not.toBeInTheDocument()
  })

  it('При статусе Downloaded отображается документ, свитчи и радио-кнопки(если документ - ИУК)', async () => {
    render(
      <AgreementDocument
        document={{
          dcAppId: 'applicationId',
          documentType: DocumentType.CREDIT_CONTRACT,
          name: 'name',
        }}
        index={0}
        isRightsAssigned={false}
        docsStatus={[DocsStatus.Downloaded]}
        setDocsStatus={jest.fn}
        setRightsAssigned={jest.fn}
        changeApplicationStatusToSigned={jest.fn}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(screen.queryByTestId('uploadFile')).toBeInTheDocument()
    expect(screen.queryByText('Подписан')).toBeInTheDocument()
    expect(screen.queryByText('Согласие на уступку прав')).toBeInTheDocument()
  })

  for (const documentType of DOCUMENT_TYPES) {
    it(`Радио-кнопки о Согласии на уступку прав отображаются только для ИУК: проверка типа документа ${documentType}`, async () => {
      render(
        <AgreementDocument
          document={{
            dcAppId: 'applicationId',
            documentType: documentType,
            name: 'name',
          }}
          index={0}
          isRightsAssigned={false}
          docsStatus={[DocsStatus.Downloaded]}
          setDocsStatus={jest.fn}
          setRightsAssigned={jest.fn}
          changeApplicationStatusToSigned={jest.fn}
        />,
        {
          wrapper: createWrapper,
        },
      )
      if (documentType === DocumentType.CREDIT_CONTRACT) {
        expect(screen.queryByText('Согласие на уступку прав')).toBeInTheDocument()
      } else {
        expect(screen.queryByText('Согласие на уступку прав')).not.toBeInTheDocument()
      }
    })
  }

  it('Tсли документ - ИУК, то свитч заблокирован, пока не указано Согласие или Несогласие на уступку прав', async () => {
    render(
      <AgreementDocument
        document={{
          dcAppId: 'applicationId',
          documentType: DocumentType.CREDIT_CONTRACT,
          name: 'name',
        }}
        index={0}
        isRightsAssigned={undefined}
        docsStatus={[DocsStatus.Downloaded]}
        setDocsStatus={jest.fn}
        setRightsAssigned={jest.fn}
        changeApplicationStatusToSigned={jest.fn}
      />,
      {
        wrapper: createWrapper,
      },
    )
    expect(document.querySelector('#document_0')).toHaveAttribute('disabled')
  })
})
