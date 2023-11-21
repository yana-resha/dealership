import { useCallback } from 'react'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, Link, List, ListItemText } from '@mui/material'
import copy from 'copy-to-clipboard'
import { useSnackbar } from 'notistack'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'
import SberTypography from 'shared/ui/SberTypography'
import { SquareBtn } from 'shared/ui/SquareBtn/SquareBtn'

import { HELPDESK_MAIL, MAIL_FORM_FIELDS } from './Instruction.config'
import { useStyles } from './Instruction.styles'
import { getMailBody } from './Instruction.utils'

export function Instruction() {
  const classes = useStyles()
  const user = useAppSelector(state => state.user.user)
  const { vendorCode } = getPointOfSaleFromCookies()
  const { enqueueSnackbar } = useSnackbar()

  const mailBody = getMailBody(user, vendorCode)
  const link = `mailto:${HELPDESK_MAIL}?body=${encodeURIComponent(mailBody)}`

  const handleCopy = useCallback(() => {
    copy(mailBody, {
      format: 'text/plain', // когда задан onCopy, copy не работет без свойства format
      onCopy: () => {
        enqueueSnackbar('Скопировано в буфер обмена', { variant: 'success' })
      },
    })
  }, [enqueueSnackbar, mailBody])

  return (
    <div data-testid="Instruction">
      <Box className={classes.container}>
        <SberTypography component="p" sberautoVariant="body3">
          Для обращения в службу поддержки отправьте письмо на электронную почту{' '}
          <Link data-testid="helpdeskLink" href={link} target="_blank">
            {HELPDESK_MAIL}
          </Link>
          .
        </SberTypography>

        <Box className={classes.listWrapper}>
          <List className={classes.listContainer}>
            <SberTypography component="p" sberautoVariant="body3">
              В письме необходимо указать следующую информацию:
            </SberTypography>
            {MAIL_FORM_FIELDS.map(field => (
              <ListItemText key={field} className={classes.listItem} primary={field} />
            ))}
          </List>

          <CustomTooltip
            arrow
            title={<span>Нажмите, чтобы скопировать указанные поля с предзаполенными данными</span>}
          >
            <Box>
              <SquareBtn onClick={handleCopy} testId="copyingSquareBtn">
                <ContentCopyIcon />
              </SquareBtn>
            </Box>
          </CustomTooltip>
        </Box>

        <SberTypography component="p" sberautoVariant="body3">
          Обращаем ваше внимание, что для лучшего описания проблемы к письму желательно приложить скриншот
          (или несколько). Результат рассмотрения обращения вы получите в ответном письме на Вашу почту.
        </SberTypography>
      </Box>
    </div>
  )
}
