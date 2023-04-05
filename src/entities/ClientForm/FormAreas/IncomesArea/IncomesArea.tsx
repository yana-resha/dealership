import React from 'react'

import { AttachFileTwoTone } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

import { maskDigitsOnly, maskNoRestrictions } from 'shared/masks/InputMasks'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import useStyles from './IncomesArea.styles'

export function IncomesArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Доходы</Typography>
      </Box>

      <MaskedInput
        name="averageIncome"
        label="Среднемесячный доход"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <MaskedInput
        name="additionalIncome"
        label="Дополнительный личный доход"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <Box className={classes.switchConfirm}>
        <SwitchInput name="incomeConfirmed" label="Подтверждение" />
      </Box>

      <MaskedInput
        name="familyIncome"
        label="Доход семьи без дохода заявит."
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <MaskedInput
        name="expenses"
        label="Общие расходы"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />

      <SelectInput
        name="relatedToPublic"
        label="Принадлежность клиента к категории публичных лиц"
        placeholder="-"
        options={['Нет', 'Да']}
        gridColumn="span 12"
      />
      <Box gridColumn="span 4" />

      <SwitchInput name="ndfl2" label="2ндфл" gridColumn="span 3" />
      <SwitchInput name="ndfl3" label="3ндфл" gridColumn="span 3" />
      <SwitchInput name="extracts" label="Выписки" gridColumn="span 3" />
      <Box gridColumn="span 4" />

      <Box className={classes.textButtonContainer} gridColumn="span 7">
        <AttachFileTwoTone className={classes.attachFileIcon} />
        <Typography>Загрузить 2ндфл</Typography>
      </Box>
    </Box>
  )
}
