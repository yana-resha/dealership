import { useMemo } from 'react'

import { useParams } from 'react-router-dom'

import { selectApplicationScans } from 'entities/order/model/selectors'
import { RequiredScan } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { ADDITIONAL_AGREEMENT_DOC_TYPES, AGREEMENT_DOC_TYPES } from '../config'

export const useAgreementDocs = (isShowAgreementDocs = false) => {
  const { applicationId = '' } = useParams()
  const scans = useAppSelector(selectApplicationScans)

  const uploadedAgreementScans = useMemo(
    () =>
      (scans || []).filter(scan => AGREEMENT_DOC_TYPES.find(type => type === scan.type)) as RequiredScan[],
    [scans],
  )

  const uploadedAdditionalAgreementScans = useMemo(
    () =>
      (scans || []).filter(scan =>
        ADDITIONAL_AGREEMENT_DOC_TYPES.find(type => type === scan.type),
      ) as RequiredScan[],
    [scans],
  )

  const agreementDocs = useMemo(
    () =>
      isShowAgreementDocs
        ? [...uploadedAgreementScans, ...uploadedAdditionalAgreementScans].map(scan => ({
            dcAppId: applicationId,
            documentType: scan.type,
            name: scan.name || 'name',
          }))
        : [],
    [applicationId, isShowAgreementDocs, uploadedAdditionalAgreementScans, uploadedAgreementScans],
  )

  return { uploadedAgreementScans, uploadedAdditionalAgreementScans, agreementDocs }
}
