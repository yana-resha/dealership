import { useMemo } from 'react'

import { OptionType } from '@sberauto/dictionarydc-proto/public'

import { AdditionalOptions, getMockedClientDossier } from '../../__tests__/mocks/clientDetailedDossier.mock'

export interface DossierRequisites {
  legalPerson: string
  loanAmount: string
  isCustomFields: boolean
  bankIdentificationCode: string
  beneficiaryBank: string
  bankAccountNumber: string
  correspondentAccount: string
  taxPresence: boolean
  dealerAdditionalServices: AdditionalOptions[]
  additionalEquipments: AdditionalOptions[]
  taxation: string
}

export function useInitialValues(applicationId: string) {
  // const {
  //   data: fullApplicationData,
  //   error,
  //   isLoading,
  // } = useGetFullApplicationQuery({ applicationId }, { enabled: !!applicationId })

  // TODO DCB-395 | Перейти на useGetFullApplicationQuery после подключения ручки реквизитов
  const clientDossier = getMockedClientDossier(applicationId)
  const { additionalOptions, creditLegalEntity, creditSum, creditReceiverBank, creditBankAccountNumber } =
    clientDossier

  const [dealerServices, additionalEquipment] = useMemo(
    () => [
      additionalOptions.filter(option => option.bankOptionType === OptionType.ADDITIONAL),
      additionalOptions.filter(option => option.bankOptionType === OptionType.EQUIPMENT),
    ],
    [additionalOptions],
  )

  return {
    legalPerson: creditLegalEntity,
    loanAmount: creditSum.toString(),
    isCustomFields: false,
    bankIdentificationCode: '',
    beneficiaryBank: creditReceiverBank,
    bankAccountNumber: creditBankAccountNumber,
    correspondentAccount: '',
    taxPresence: false,
    dealerAdditionalServices: dealerServices,
    additionalEquipments: additionalEquipment,
    taxation: '0',
  }
}
