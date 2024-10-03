import { useState } from 'react'

import { Box, Button, Collapse, Divider, IconButton, Popover } from '@mui/material'
import { LocalizationProvider, MonthCalendar, YearCalendar } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import cx from 'classnames'
import { DateTime } from 'luxon'

import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import { ReactComponent as KeyboardArrowDown } from 'assets/icons/keyboardArrowDown.svg'
import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { ReactComponent as KeyboardArrowUp } from 'assets/icons/keyboardArrowUp.svg'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './DateFilter.styles'
import { CalendarType } from './DateFilter.types'
import { DateRow } from './DateRow/DateRow'
import { HeaderRow } from './HeaderRow/HeaderRow'
import { useDateFilterState } from './hooks/useDateFilterState'

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

export const DateFilter = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const {
    isPeriodTypeSelected,
    rows,
    handleBackBtnClick,
    handleForwardBtnClick,
    handleChangeType,
    handleCellClick,
    viewDate,
    setMonth,
    setYear,
    calendarType,
    handleMonthCalendarClick,
    handleYearCalendarClick,
    handleSubmit,
  } = useDateFilterState(open)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const onClose = () => {
    setAnchorEl(null)
  }

  const handleFindClicked = () => {
    handleSubmit()
    onClose()
  }

  return (
    <>
      <Box className={classes.headerCell} onClick={handleClick}>
        <span>Дата</span>
        <CalendarIcon className={classes.dateIcon} />
      </Box>
      <Popover
        id="date-filter-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className={classes.popover}
      >
        <Box className={classes.container}>
          <Box className={classes.monthYearRow}>
            <Box gridColumn="span 1">
              <IconButton
                data-testid="backMonthBtn"
                className={classes.iconButton}
                onClick={handleBackBtnClick}
              >
                <KeyboardArrowLeft />
              </IconButton>
            </Box>
            <Box
              className={cx(classes.headerCell, classes.month)}
              onClick={handleMonthCalendarClick}
              gridColumn="span 3"
            >
              <SberTypography component="div" sberautoVariant="body5">
                {MONTHS[viewDate.getMonth()]}
              </SberTypography>
              {calendarType === 'month' ? (
                <KeyboardArrowUp className={classes.icon} />
              ) : (
                <KeyboardArrowDown className={classes.icon} />
              )}
            </Box>
            <Box className={classes.headerCell} onClick={handleYearCalendarClick} gridColumn="span 2">
              <SberTypography component="div" sberautoVariant="body5">
                {viewDate.getFullYear()}
              </SberTypography>
              {calendarType === 'year' ? (
                <KeyboardArrowUp className={classes.icon} />
              ) : (
                <KeyboardArrowDown className={classes.icon} />
              )}
            </Box>
            <Box gridColumn="span 1">
              <IconButton
                data-testid="forwardMonthBtn"
                className={classes.iconButton}
                onClick={handleForwardBtnClick}
              >
                <KeyboardArrowLeft transform="scale(-1 1)" />
              </IconButton>
            </Box>
          </Box>
          <div className={classes.monthYearRow}>
            <Button
              key="day-select-button"
              onClick={handleChangeType}
              className={!isPeriodTypeSelected ? cx(classes.button, classes.selectedButton) : classes.button}
            >
              День
            </Button>
            <Button
              key="period-select-button"
              onClick={handleChangeType}
              className={isPeriodTypeSelected ? cx(classes.button, classes.selectedButton) : classes.button}
            >
              Период
            </Button>
          </div>
          <Collapse in={calendarType === CalendarType.MONTH}>
            <Box className={classes.calendar}>
              <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
                <MonthCalendar value={DateTime.fromJSDate(viewDate)} onChange={setMonth} />
              </LocalizationProvider>
            </Box>
          </Collapse>
          <Collapse in={calendarType === CalendarType.YEAR}>
            <Box className={classes.calendar}>
              <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
                <YearCalendar value={DateTime.fromJSDate(viewDate)} onChange={setYear} />
              </LocalizationProvider>
            </Box>
          </Collapse>
          <Collapse in={calendarType === CalendarType.DAY}>
            <HeaderRow />
            {rows.map((row, index) => (
              <DateRow key={index} values={row} onCellClicked={handleCellClick} />
            ))}
          </Collapse>
          <Divider />
          <Box className={classes.searchButtonRow}>
            <Button
              type="submit"
              variant="contained"
              className={classes.searchButton}
              onClick={handleFindClicked}
            >
              Найти
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
