import { makeStyles } from '@mui/styles'
import { Property } from 'csstype'

import { WHITE } from 'app/theme/palette'

export const useStyles = makeStyles(theme => ({
  modalWrapper: {
    padding: theme.spacing(4),
    backgroundColor: 'transparent' + '!important',
    boxShadow: 'unset' + '!important',
  },

  modalContainer: {
    padding: theme.spacing(3),
    width: '378px',
    boxSizing: 'border-box',

    backgroundColor: theme.palette.background.paper,
    borderRadius: 3 * theme.shape.borderRadius,
    boxShadow: `0 4px 16px ${theme.palette.grey[600]}`,

    '& .MuiDialogContent-root': {
      marginTop: theme.spacing(5),
      padding: 0,
    },
    '& .MuiDialogActions-root': {
      marginTop: theme.spacing(3),
      padding: 0,
      width: '100%',
    },
  },

  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  modalText: {
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.text.primary + '!important',
  },

  modalTitle: {
    fontSize: '24px',
    fontWeight: 600 + '!important',
    lineHeight: '32px',
  },

  confirmBtn: {
    minHeight: '48px' + '!important',
  },

  closeBtn: {
    right: 0,
    position: ('absolute' + '!important') as Property.Position,
    padding: theme.spacing(0.5) + '!important',

    '& svg': {
      width: '16px',
      height: '16px',
      fill: theme.palette.colors.white,
    },
  },
}))
