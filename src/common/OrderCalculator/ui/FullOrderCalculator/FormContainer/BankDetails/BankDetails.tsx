import { useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useField } from 'formik'

import { FormFieldNameMap } from 'common/OrderCalculator/types'
import {
  bankAccountNumbers,
  bankIdentificationCodes,
  beneficiaryBanks,
} from 'common/OrderCalculator/ui/FullOrderCalculator/__tests__/FullOrderCalculator.mock'
import {
  maskNoRestrictions,
  maskPercent,
  maskBankIdentificationCode,
  maskBankAccountNumber,
} from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './BankDetails.styles'

type Props = {
  namePrefix?: string
}

export function BankDetails({ namePrefix = '' }: Props) {
  const classes = useStyles()
  const [isCustomField] = useField(namePrefix + FormFieldNameMap.isCustomFields)

  const [hasTaxation, setHasTaxation] = useState(false)

  useEffect(() => {
    if (!isCustomField.value) {
      setHasTaxation(false)
    }
  }, [isCustomField.value])

  if (isCustomField.value) {
    return (
      <Box className={classes.gridContainer}>
        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.bankIdentificationCode}
          label="БИК"
          placeholder="-"
          mask={maskBankIdentificationCode}
          gridColumn="span 1"
        />

        <Box className={classes.bankAccountContainer} gridColumn="span 3">
          <MaskedInputFormik
            name={namePrefix + FormFieldNameMap.beneficiaryBank}
            label="Банк получатель денежных средств"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 1"
          />
          <MaskedInputFormik
            name={namePrefix + FormFieldNameMap.bankAccountNumber}
            label="Номер счета банка"
            placeholder="-"
            mask={maskBankAccountNumber}
            gridColumn="span 1"
          />
        </Box>
        <Box className={classes.switchContainer} gridColumn="span 1">
          <SwitchInputFormik name={namePrefix + FormFieldNameMap.isCustomFields} label="Ввести вручную" />
        </Box>

        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.correspondentAccount}
          label="Корреспондентский счет"
          placeholder="-"
          mask={maskBankAccountNumber}
          gridColumn="span 2"
        />
        <Box className={classes.btnContainer} gridColumn="span 1">
          <RadioGroupInput
            radioValues={[
              { radioValue: false, radioLabel: 'Без НДС' },
              { radioValue: true, radioLabel: 'С НДС' },
            ]}
            defaultValue={false}
            onChange={setHasTaxation}
          />
        </Box>
        {hasTaxation && (
          <MaskedInputFormik
            name={namePrefix + FormFieldNameMap.taxation}
            label="Налог"
            placeholder="-"
            mask={maskPercent}
            gridColumn="span 1"
            InputProps={{ endAdornment: '%' }}
          />
        )}
      </Box>
    )
  }

  return (
    <Box className={classes.gridContainer}>
      <SelectInputFormik
        name={namePrefix + FormFieldNameMap.bankIdentificationCode}
        label="БИК"
        placeholder="-"
        options={bankIdentificationCodes}
        gridColumn="span 1"
      />
      <Box className={classes.bankAccountContainer} gridColumn="span 3">
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.beneficiaryBank}
          label="Банк получатель денежных средств"
          placeholder="-"
          options={beneficiaryBanks}
          gridColumn="span 1"
        />
        <SelectInputFormik
          name={namePrefix + FormFieldNameMap.bankAccountNumber}
          label="Номер счета банка"
          placeholder="-"
          options={bankAccountNumbers}
          gridColumn="span 1"
        />
      </Box>
      <Box className={classes.switchContainer} gridColumn="span 1">
        <SwitchInputFormik name={namePrefix + FormFieldNameMap.isCustomFields} label="Ввести вручную" />
      </Box>
    </Box>
  )
}
