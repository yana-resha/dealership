import { useCallback, useState } from 'react'

import { alpha, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { uniq } from 'lodash'

import { PreparedStatus } from '../application.utils'

const useStyles = makeStyles(theme => ({
  buttonWrapper: {
    width: '100%',
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    flexWrap: 'wrap',
    '&.MuiToggleButtonGroup-root .MuiToggleButtonGroup-grouped': {
      padding: theme.spacing(0.625, 2),
      fontSize: 14,
      lineHeight: '18px',
      textTransform: 'none',
      borderTopRightRadius: theme.shape.borderRadius + 'px!important',
      borderBottomRightRadius: theme.shape.borderRadius + 'px!important',
      borderBottomLeftRadius: theme.shape.borderRadius + 'px!important',
      borderTopLeftRadius: theme.shape.borderRadius + 'px!important',
      backgroundColor: theme.palette.colors.blueGray,
      color: theme.palette.text.primary,
      border: 'none',
    },
    '&.MuiToggleButtonGroup-root .MuiButtonBase-root.MuiToggleButton-root.Mui-selected': {
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    },
  },
}))

const config = [
  {
    filter: [StatusCode.STATUS_CODE_INITIAL],
    textValue: PreparedStatus.initial,
  },
  {
    filter: [
      StatusCode.STATUS_CODE_INITIAL,
      StatusCode.STATUS_CODE_PROCESSED,
      StatusCode.STATUS_CODE_APPROVED,
      StatusCode.STATUS_CODE_FINALLY_APPROVED,
      StatusCode.STATUS_CODE_FORMATION,
      StatusCode.STATUS_CODE_AUTHORIZED,
      StatusCode.STATUS_CODE_FINANCED,
      StatusCode.STATUS_CODE_ERROR,
    ],
    textValue: 'Актуальные заявки',
  },
  {
    filter: [StatusCode.STATUS_CODE_PROCESSED],
    textValue: PreparedStatus.processed,
  },
  {
    filter: [StatusCode.STATUS_CODE_CANCELED_DEAL],
    textValue: PreparedStatus.canceledDeal,
  },
  {
    filter: [StatusCode.STATUS_CODE_AUTHORIZED],
    textValue: PreparedStatus.authorized,
  },
  {
    filter: [StatusCode.STATUS_CODE_FINALLY_APPROVED],
    textValue: PreparedStatus.finallyApproved,
  },
  {
    filter: [StatusCode.STATUS_CODE_REJECTED],
    textValue: PreparedStatus.rejected,
  },
]

type Props = { onChange: (value: StatusCode[]) => void }

export const StatusFilter = ({ onChange }: Props) => {
  const [checked, setChecked] = useState<number[]>([])
  const styles = useStyles()

  const onButtonClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, newValues: number[]) => {
      setChecked(newValues)

      const filters = newValues.reduce((acc, el) => [...acc, ...config[el].filter], [] as StatusCode[])

      //NOTE: Поскольку в Актуальных заявках множественный фильтр, убираем дубли
      //если вдруг пользователь нащелкал те что уже есть в Актуальных заявка
      onChange(uniq(filters))
    },
    [onChange],
  )

  return (
    <ToggleButtonGroup value={checked} onChange={onButtonClick} className={styles.buttonWrapper}>
      {config.map(({ textValue }, idx) => (
        <ToggleButton key={textValue} value={idx} size="small">
          {textValue}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
