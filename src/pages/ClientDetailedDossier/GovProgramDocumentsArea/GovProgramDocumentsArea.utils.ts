import { Scan } from '@sberauto/loanapplifecycledc-proto/public'

const checkIsBool = (value: any): value is boolean => value === true || value === false

// Т.к. нас интересует три статуса false, true, undefined,
// то важно использовать строгое сравнение на false и undefined
export const getGovProgramDocumentStatus = (
  scan: Scan | undefined,
  isAllSendToEcm: boolean,
  isAllReceivedFromEcm: boolean,
  isAllReceivedFromRmoc: boolean,
  isSomeAgreeFromRmocNull: boolean,
) => {
  if (!scan) {
    return {}
  }

  const isReceivedFromEcm = scan.isReceivedFromEcm?.boolValue
  const isAgreeFromRmoc = scan.isAgreeFromRmoc?.boolValue

  const isDocumentSuccess = isAllSendToEcm && isAllReceivedFromEcm && isAllReceivedFromRmoc && isAgreeFromRmoc
  // Документ нельзя удалять или менять
  const isDocumentBlocked =
    (isAllSendToEcm && isReceivedFromEcm && !isAllReceivedFromEcm) || isDocumentSuccess

  const isDocumentError =
    isAllSendToEcm &&
    isAllReceivedFromEcm &&
    isAllReceivedFromRmoc &&
    !isSomeAgreeFromRmocNull &&
    isAgreeFromRmoc === false

  return {
    isDocumentBlocked,
    isDocumentError,
    isDocumentSuccess,
    errorDescription: isDocumentError ? scan.errorDescription : undefined,
  }
}

export const getAllGovProgramDocumentsStatus = (scans: (Scan | undefined)[], necessaryScansCount: number) => {
  const {
    isSomeReceivedFromEcmNull,
    isSomeReceivedFromEcmFalse,
    isSomeReceivedFromRmocNull,
    isSomeReceivedFromRmocFalse,
    isSomeAgreeFromRmocNull,
    isSomeSendToEcmNotTrue,
    isSomeReceivedFromEcmNotTrue,
    isSomeReceivedFromRmocNotTrue,
    isSomeAgreeFromRmocNotTrue,
  } = scans.reduce(
    (acc, cur) => {
      if (!checkIsBool(cur?.isReceivedFromEcm?.boolValue)) {
        acc.isSomeReceivedFromEcmNull = true
      }
      if (cur?.isReceivedFromEcm?.boolValue === false) {
        acc.isSomeReceivedFromEcmFalse = true
      }
      if (!checkIsBool(cur?.isReceivedFromRmoc?.boolValue)) {
        acc.isSomeReceivedFromRmocNull = true
      }
      if (cur?.isReceivedFromRmoc?.boolValue === false) {
        acc.isSomeReceivedFromRmocFalse = true
      }
      if (!checkIsBool(cur?.isAgreeFromRmoc?.boolValue)) {
        acc.isSomeAgreeFromRmocNull = true
      }
      if (cur?.isSendToEcm?.boolValue !== true) {
        acc.isSomeSendToEcmNotTrue = true
      }
      if (cur?.isReceivedFromEcm?.boolValue !== true) {
        acc.isSomeReceivedFromEcmNotTrue = true
      }
      if (cur?.isReceivedFromRmoc?.boolValue !== true) {
        acc.isSomeReceivedFromRmocNotTrue = true
      }
      if (cur?.isAgreeFromRmoc?.boolValue !== true) {
        acc.isSomeAgreeFromRmocNotTrue = true
      }

      return acc
    },
    {
      isSomeReceivedFromEcmNull: false,
      isSomeReceivedFromEcmFalse: false,
      isSomeReceivedFromRmocNull: false,
      isSomeReceivedFromRmocFalse: false,
      isSomeAgreeFromRmocNull: false,
      isSomeSendToEcmNotTrue: false,
      isSomeReceivedFromEcmNotTrue: false,
      isSomeReceivedFromRmocNotTrue: false,
      isSomeAgreeFromRmocNotTrue: false,
    },
  )

  const isAllDocumentsUploaded = scans.filter(scan => !!scan).length === necessaryScansCount
  const isAllSendToEcm = isAllDocumentsUploaded && !isSomeSendToEcmNotTrue
  const isAllReceivedFromEcm = isAllDocumentsUploaded && !isSomeReceivedFromEcmNotTrue
  const isAllReceivedFromRmoc = isAllDocumentsUploaded && !isSomeReceivedFromRmocNotTrue
  const isAllAgreeFromRmoc = isAllDocumentsUploaded && !isSomeAgreeFromRmocNotTrue

  const isDocumentsSuccess =
    isAllSendToEcm && isAllReceivedFromEcm && isAllReceivedFromRmoc && isAllAgreeFromRmoc

  const isReceivedFromEcmNull = isAllSendToEcm && isSomeReceivedFromEcmNull
  const isReceivedFromRmocNull = isAllSendToEcm && isAllReceivedFromEcm && isSomeReceivedFromRmocNull
  const isReceivedFromRmocFalse = isAllSendToEcm && isAllReceivedFromEcm && isSomeReceivedFromRmocFalse
  const isAgreeFromRmocNull =
    isAllSendToEcm && isAllReceivedFromEcm && isAllReceivedFromRmoc && isSomeAgreeFromRmocNull

  const isDocumentsChangeBlocked =
    isReceivedFromEcmNull ||
    isReceivedFromRmocNull ||
    isReceivedFromRmocFalse ||
    isAgreeFromRmocNull ||
    isDocumentsSuccess

  const isDocumentsSendingBlocked =
    !isAllDocumentsUploaded ||
    isReceivedFromEcmNull ||
    isReceivedFromRmocNull ||
    isAgreeFromRmocNull ||
    isDocumentsSuccess

  const isNecessaryDecisionRequest =
    (isAllSendToEcm && isSomeReceivedFromEcmFalse) || (isReceivedFromRmocFalse && !isSomeReceivedFromRmocNull)

  const isDecisionPending = isReceivedFromRmocNull || isAgreeFromRmocNull

  return {
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
