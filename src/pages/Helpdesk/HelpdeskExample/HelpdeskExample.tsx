import { useCallback, useState } from 'react'

import { Dialog } from '@mui/material'
import cx from 'classnames'

import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './HelpdeskExample.styles'

export function HelpdeskExample() {
  const classes = useStyles()

  const [isVisible, setVisible] = useState(false)
  const openModal = useCallback(() => setVisible(true), [])
  const closeModal = useCallback(() => setVisible(false), [])

  return (
    <div data-testid="HelpdeskExample">
      <SberTypography component="p" sberautoVariant="body3" className={classes.exampleLabel}>
        Пример заполненной заявки представлен ниже.
      </SberTypography>

      <img
        src="images/helpdeskExample.webp"
        alt="Изображение примера письма в службу поддержки"
        width="200px"
        height="134px"
        className={classes.helpdeskExample}
        onClick={openModal}
      />

      <Dialog
        open={isVisible}
        maxWidth="md"
        fullWidth
        onClose={closeModal}
        classes={{ paper: classes.dialogBlock }}
      >
        <img
          src="images/helpdeskExample.webp"
          alt="Изображение примера письма в службу поддержки"
          width="200px"
          height="134px"
          className={cx(classes.helpdeskExample, classes.largeHelpdeskExample)}
          onClick={closeModal}
        />
      </Dialog>
    </div>
  )
}
