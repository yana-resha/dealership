import { makeStyles } from '@mui/styles'
import { Property } from 'csstype'

export const useStyles = makeStyles(theme => ({
  modalWrapper: {
    padding: theme.spacing(4),
    backgroundColor: 'transparent' + '!important',
    boxShadow: 'unset' + '!important',
  },

  modalContainer: {
    padding: theme.spacing(3),
    width: '434px',
    boxSizing: 'border-box',

    backgroundColor: theme.palette.background.paper,
    borderRadius: 3 * theme.shape.borderRadius,
    boxShadow: `0 4px 16px ${theme.palette.grey[600]}`,

    '& .MuiDialogContent-root': {
      padding: 0,
    },
    '& .MuiDialogActions-root': {
      marginTop: theme.spacing(4),
      padding: 0,
      width: '100%',
    },
  },

  modalText: {
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.text.primary + '!important',
  },

  modalTitle: {
    padding: theme.spacing(0, 0, 2, 0) + '!important',
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

    '& path': {
      fill: theme.palette.colors.white,
    },
  },

  specialMark: {
    marginTop: theme.spacing(2),
  },
}))
