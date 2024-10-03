import { useEffect, useState } from 'react'
import React from 'react'

import { Box, Button, Divider, Popover } from '@mui/material'
import { useDispatch } from 'react-redux'

import { ReactComponent as KeyboardArrowDown } from 'assets/icons/keyboardArrowDown.svg'
import { ReactComponent as KeyboardArrowUp } from 'assets/icons/keyboardArrowUp.svg'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { CheckboxInput } from 'shared/ui/CheckboxInput/CheckboxInput'

import { setStatuses } from '../../filters/model/filterSlice'
import { PreparedStatus } from '../application.utils'
import { useStyles } from './StatusesFilter.style'

const statuses = Object.keys(PreparedStatus)

export const StatusesFilter = () => {
  const filters = useAppSelector(state => state.filter?.statuses)
  const [state, setState] = useState<string[]>([])
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFind = () => {
    dispatch(setStatuses(state))
    handleClose()
  }

  const reset = () => {
    setState([])
  }

  const itemClicked = (status: string) => {
    let mod = [...state]
    if (state?.includes(status)) {
      mod = mod.filter(v => v !== status)
    } else {
      mod.push(status)
    }
    setState(mod)
  }

  useEffect(() => {
    if (filters && open) {
      setState(filters)
    }
  }, [filters, open])

  return (
    <>
      <Box className={classes.headerCell} onClick={handleClick}>
        <span>Статус</span>
        {open ? <KeyboardArrowUp className={classes.icon} /> : <KeyboardArrowDown className={classes.icon} />}
      </Box>
      <Popover
        id="status-filter-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
        {statuses.map(status => (
          <CheckboxInput
            key={status}
            label={PreparedStatus[status as keyof typeof PreparedStatus]}
            checked={state?.includes(status)}
            onChange={() => itemClicked(status)}
          />
        ))}
        <Divider />
        <Box className={classes.searchButtonRow}>
          <Button type="submit" variant="contained" onClick={handleFind}>
            Найти
          </Button>
          <Button type="submit" variant="contained" className={classes.cancelButton} onClick={reset}>
            Сбросить
          </Button>
        </Box>
      </Popover>
    </>
  )
}
