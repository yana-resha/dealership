import { useMemo } from 'react'

import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined'
import cx from 'classnames'
import { useDispatch } from 'react-redux'

import { ReactComponent as HelpdeskIcon } from 'assets/icons/helpdesk.svg'
import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'
import { ReactComponent as OrderListIcon } from 'assets/icons/orderList.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { AuthType } from 'common/auth'
import { clearOrder } from 'entities/reduxStore/orderSlice'
import { appRoutePaths } from 'shared/navigation/routerPath'

import useStyles from './menuIcon.styles'
import { MenuItem } from './types'

type UseGetItemsProps = {
  authType: AuthType
}

export const useGetItems = ({ authType }: UseGetItemsProps): MenuItem[] => {
  const styles = useStyles()
  const dispatch = useDispatch()

  const menuItems = useMemo(() => {
    switch (authType) {
      case 'auth': {
        const items: MenuItem[] = [
          {
            label: 'Создать заявку',
            icon: ({ isSelected }) => (
              <OrderCreateIcon className={cx(styles.icon, { [styles.selectedIcon]: isSelected })} />
            ),
            path: appRoutePaths.createOrder,
            onCallback: () => dispatch(clearOrder()),
          },
          {
            label: 'Текущие заявки',
            icon: ({ isSelected }) => (
              <OrderListIcon className={cx(styles.icon, { [styles.selectedIcon]: isSelected })} />
            ),
            path: appRoutePaths.orderList,
          },
          {
            label: 'Калькулятор',
            icon: ({ isSelected }) => (
              <CalculateOutlinedIcon
                className={cx(styles.icon, { [styles.selectedIcon]: isSelected })}
                viewBox="3 3 18 18"
              />
            ),
            path: appRoutePaths.calculator,
          },
          {
            label: 'Документы',
            icon: ({ isSelected }) => (
              <ScheduleIcon className={cx(styles.icon, { [styles.selectedIcon]: isSelected })} />
            ),
            path: appRoutePaths.documentStorage,
          },
          {
            label: 'Поддержка',
            icon: ({ isSelected }) => (
              <HelpdeskIcon className={cx(styles.icon, { [styles.selectedIcon]: isSelected })} />
            ),
            path: appRoutePaths.helpdesk,
          },
        ]

        return items
      }
      default: {
        return []
      }
    }
  }, [authType, dispatch, styles.icon, styles.selectedIcon])

  return menuItems
}
