import { Box, Button } from '@mui/material'
import { useDispatch } from 'react-redux'

import { ReactComponent as CloseIcon } from 'assets/icons/closeButton.svg'
import { setDate, setStatuses } from 'entities/filters/model/filterSlice'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { convertedDateToString } from 'shared/utils/dateTransform'

import { PreparedStatus } from '../application.utils'
import { useStyles } from './FiltersInfo.style'

const convert = (val: any) => convertedDateToString(new Date(val as string), 'dd.LL.yyyy')

const FilterButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
  const classes = useStyles()

  return (
    <Button variant="contained" endIcon={<CloseIcon onClick={onClick} />} className={classes.button}>
      {label}
    </Button>
  )
}

export const FilterInfo = () => {
  const classes = useStyles()
  const filters = useAppSelector(state => state.filter)
  const dispatch = useDispatch()

  const handleDeleteDate = (isPeriodTypeSelected: boolean) => {
    dispatch(
      setDate({
        day: undefined,
        period: undefined,
        isPeriodTypeSelected,
      }),
    )
  }

  const handleDeleteStatus = (status: string) => {
    dispatch(setStatuses(filters?.statuses?.filter(s => s !== status) || []))
  }

  const handleReset = () => {
    handleDeleteDate(false)
    dispatch(setStatuses([]))
  }

  return (
    <Box className={classes.main}>
      <Box className={classes.row}>
        {filters?.date?.day && (
          <FilterButton
            key="remove-date"
            label={convert(filters?.date?.day)}
            onClick={() => handleDeleteDate(false)}
          />
        )}
        {!!filters.date?.period?.from && !!filters.date?.period?.to && (
          <FilterButton
            key="remove-ate-from-to"
            label={`${convert(filters.date?.period?.from)} - ${convert(filters.date?.period?.to)}`}
            onClick={() => handleDeleteDate(true)}
          />
        )}
        {filters?.statuses &&
          filters?.statuses.map(s => (
            <FilterButton
              key={`remove-status-${s}`}
              label={PreparedStatus[s as keyof typeof PreparedStatus]}
              onClick={() => handleDeleteStatus(s)}
            />
          ))}
        <Button key="remove-all" onClick={handleReset} variant="contained">
          Сбросить все фильтры
        </Button>
      </Box>
    </Box>
  )
}
