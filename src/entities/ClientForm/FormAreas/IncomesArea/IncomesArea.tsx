import React from 'react'

import { Box, Typography } from '@mui/material'

import { ReactComponent as AttachFileTwoTone } from 'assets/icons/attach.svg'
import { maskDigitsOnly } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import useStyles from './IncomesArea.styles'

export function IncomesArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Доходы</Typography>
      </Box>

      <MaskedInputFormik
        name="averageIncome"
        label="Среднемесячный доход"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <MaskedInputFormik
        name="additionalIncome"
        label="Дополнительный личный доход"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <Box className={classes.switchConfirm}>
        <SwitchInputFormik name="incomeConfirmed" label="Подтверждение" />
      </Box>

      <MaskedInputFormik
        name="familyIncome"
        label="Доход семьи без дохода заявит."
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <MaskedInputFormik
        name="expenses"
        label="Общие расходы"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />

      <SelectInputFormik
        name="relatedToPublic"
        label="Принадлежность клиента к категории публичных лиц"
        placeholder="-"
        options={['Нет', 'Да']}
        gridColumn="span 12"
      />
      <Box gridColumn="span 4" />

      <SwitchInputFormik name="ndfl2" label="2ндфл" gridColumn="span 3" />
      <SwitchInputFormik name="ndfl3" label="3ндфл" gridColumn="span 3" />
      <SwitchInputFormik name="extracts" label="Выписки" gridColumn="span 3" />
      <Box gridColumn="span 4" />

      <Box className={classes.textButtonContainer} gridColumn="span 7">
        <AttachFileTwoTone />
        <Typography>Загрузить 2ндфл</Typography>
      </Box>
    </Box>
  )
}
