import { useCallback, useMemo } from 'react'

import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined'
import cx from 'classnames'
import { useDispatch } from 'react-redux'

import { ReactComponent as HelpdeskIcon } from 'assets/icons/helpdesk.svg'
import { ReactComponent as MailIcon } from 'assets/icons/mail.svg'
import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'
import { ReactComponent as OrderListIcon } from 'assets/icons/orderList.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { clearOrder } from 'entities/reduxStore/orderSlice'
import { useUserRoles } from 'entities/user'
import { appRoutePaths } from 'shared/navigation/routerPath'

import useStyles from './menuIcon.styles'
import { MenuItem } from './types'

interface IconParams {
  isSelected?: boolean
}

export const useGetItems = (): MenuItem[] => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const { isCreditExpert } = useUserRoles()

  const getClassName = useCallback(
    (isSelected?: boolean) => cx(styles.icon, { [styles.selectedIcon]: isSelected }),
    [styles.icon, styles.selectedIcon],
  )

  const menuItems = useMemo(
    () =>
      [
        {
          label: 'Создать заявку',
          icon: ({ isSelected }: IconParams) => <OrderCreateIcon className={getClassName(isSelected)} />,
          path: appRoutePaths.createOrder,
          onCallback: () => dispatch(clearOrder()),
          disabled: !isCreditExpert,
        },
        {
          label: 'Текущие заявки',
          icon: ({ isSelected }: IconParams) => <OrderListIcon className={getClassName(isSelected)} />,
          path: appRoutePaths.orderList,
          disabled: !isCreditExpert,
        },
        {
          label: 'Калькулятор',
          icon: ({ isSelected }: IconParams) => (
            <CalculateOutlinedIcon className={getClassName(isSelected)} viewBox="3 3 18 18" />
          ),
          path: appRoutePaths.calculator,
          disabled: !isCreditExpert,
        },
        {
          label: 'Письма',
          icon: ({ isSelected }: IconParams) => <MailIcon className={getClassName(isSelected)} />,
          path: appRoutePaths.emailList,
          disabled: !isCreditExpert,
        },
        {
          label: 'Документы',
          icon: ({ isSelected }: IconParams) => <ScheduleIcon className={getClassName(isSelected)} />,
          path: appRoutePaths.documentStorage,
        },
        {
          label: 'Поддержка',
          icon: ({ isSelected }: IconParams) => <HelpdeskIcon className={getClassName(isSelected)} />,
          path: appRoutePaths.helpdesk,
        },
      ].filter(item => !item.disabled),

    [dispatch, getClassName, isCreditExpert],
  )

  return menuItems
}
