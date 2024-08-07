import { useMemo } from 'react'

import { Scan } from '@sberauto/loanapplifecycledc-proto/public'

import { selectApplication } from 'entities/order/model/selectors'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import {
  GOV_PROGRAM_DOCUMENTS_MAP,
  GOV_PROGRAM_DOCUMENT_TYPES,
  GovProgramCode,
} from '../GovProgramDocumentsArea.config'
import { getAllGovProgramDocumentsStatus } from '../GovProgramDocumentsArea.utils'

export const useGovProgramScans = () => {
  const application = useAppSelector(selectApplication)
  const { loanData, scans } = application

  const govProgramScans = useMemo(
    () => scans?.filter(scan => scan?.type && GOV_PROGRAM_DOCUMENT_TYPES.includes(scan.type)) || [],
    [scans],
  )

  const necessaryGovProgramDocuments = useMemo(() => {
    const { documents = [], dfoDocuments = [] } =
      GOV_PROGRAM_DOCUMENTS_MAP[(loanData?.govprogramCode ?? '') as GovProgramCode] || {}

    return [...documents, ...(loanData?.govprogramDfoFlag ? dfoDocuments : [])]
  }, [loanData?.govprogramCode, loanData?.govprogramDfoFlag])

  const necessaryGovProgramDocumentsCount = necessaryGovProgramDocuments.length

  const currentGovProgramScans = useMemo(
    () =>
      necessaryGovProgramDocuments.reduce<(Scan | undefined)[]>((acc, document, i) => {
        const isArray = Array.isArray(document)
        if (isArray) {
          const scan = govProgramScans.find(scan =>
            document.some(documentChild => scan?.type === documentChild),
          )

          if (scan) {
            acc[i] = scan
          }
        }

        const scan = govProgramScans.find(scan => scan?.type === document)
        if (scan) {
          acc[i] = scan
        }

        return acc
      }, []),
    [govProgramScans, necessaryGovProgramDocuments],
  )
  const {
    isAllSendToEcm,
    isAllReceivedFromEcm,
    isAllReceivedFromRmoc,
    isSomeAgreeFromRmocNull,
    isDocumentsSuccess,
    isDocumentsChangeBlocked,
    isDocumentsSendingBlocked,
    isNecessaryDecisionRequest,
    isDecisionPending,
  } = useMemo(
    () => getAllGovProgramDocumentsStatus(currentGovProgramScans, necessaryGovProgramDocumentsCount),
    [currentGovProgramScans, necessaryGovProgramDocumentsCount],
  )

  return {
    necessaryGovProgramDocuments,
    govProgramScans,
    currentGovProgramScans,
    isAllSendToEcm,
    isAllReceivedFromEcm,
    isAllReceivedFromRmoc,
    isSomeAgreeFromRmocNull,
    isDocumentsSuccess,
    isDocumentsChangeBlocked,
    isDocumentsSendingBlocked,
    isNecessaryDecisionRequest,
    isDecisionPending,
  }
}
