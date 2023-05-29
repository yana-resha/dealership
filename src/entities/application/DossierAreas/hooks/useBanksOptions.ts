import { useState } from 'react'

import { usePrevious } from 'shared/hooks/usePrevious'

type Params = {
  beneficiaryBank: string
  bankAccountNumber: string
}
export function useBanksOptions({ beneficiaryBank, bankAccountNumber }: Params) {
  const [banksOptions, setBanksOptions] = useState<{ value: string }[]>([{ value: beneficiaryBank }])
  const [accountNumberOptions, setAccountNumberOptions] = useState<{ value: string }[]>([
    { value: bankAccountNumber },
  ])
  const [manualEntry, setManualEntry] = useState(false)
  const previousAccountNumber = usePrevious(bankAccountNumber)

  return {
    banksOptions,
    setBanksOptions,
    accountNumberOptions,
    setAccountNumberOptions,
    manualEntry,
    setManualEntry,
    previousAccountNumber,
  }
}
