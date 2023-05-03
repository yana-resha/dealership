import { useCallback, useState } from 'react'

import { Box, Button } from '@mui/material'

import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'

import useStyles from './FooterArea.styles'
import { SpecialMarkModal } from './SpecialMarkModal/SpecialMarkModal'

export function FooterArea() {
  const classes = useStyles()
  const [isVisibleModal, setVisibleModal] = useState(false)
  const openModal = useCallback(() => {
    setVisibleModal(true)
  }, [])
  const closeModal = useCallback(() => setVisibleModal(false), [])

  return (
    <Box className={classes.footerContainer} gridColumn="1 / -1">
      <Button
        className={classes.specialMarkBtn}
        variant="text"
        startIcon={<WarningIcon />}
        onClick={openModal}
      >
        Специальная отметка
      </Button>
      <Button type="submit" className={classes.submitBtn} variant="contained">
        Показать
      </Button>
      <SpecialMarkModal isVisible={isVisibleModal} onClose={closeModal} />
    </Box>
  )
}
