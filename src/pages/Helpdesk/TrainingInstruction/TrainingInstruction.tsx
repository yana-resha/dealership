import { Box, List, ListItemText } from '@mui/material'

import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './TrainingInstruction.styles'

export function TrainingInstruction() {
  const classes = useStyles()

  return (
    <div data-testid="TrainingInstruction">
      <Box className={classes.container}>
        <SberTypography component="p" sberautoVariant="body3">
          Вы находитесь на учебной версии приложения:
        </SberTypography>

        <Box className={classes.listWrapper}>
          <List className={classes.listContainer}>
            <ListItemText
              className={classes.listItem}
              primary="Если вы хотите получить одобрение по заявке, то укажите количество детей отличное от 5."
            />
            <ListItemText
              className={classes.listItem}
              primary="Если вы хотите получить отказ по скорингу заявки, то укажите количество детей в анкете равным 5 или
              добавьте специальную отметку при заполнении анкеты."
            />
            <ListItemText
              className={classes.listItem}
              primary="Если вы хотите создать новую заявку, то используйте любую серию и номер паспорта отличные от 0000
              000000."
            />
            <ListItemText
              className={classes.listItem}
              primary="Если вы хотите получить отказ на этапе предварительных проверок клиента до скоринга заявки, то
              используйте серию и номер паспорта 0000 000000."
            />
            <ListItemText
              className={classes.listItem}
              primary="Заявки, заведенные на учебной версии приложения, не попадают в банк и хранятся не более 5 дней."
            />
          </List>
        </Box>
      </Box>
    </div>
  )
}
