import { useMemo } from 'react'

import cx from 'classnames'

import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'
import { ReactComponent as OrderListIcon } from 'assets/icons/orderList.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { AuthType } from 'common/auth'
import { appRoutePaths } from 'shared/navigation/routerPath'

import useStyles from './menuIcon.styles'
import { MenuItem } from './types'

type UseGetItemsProps = {
  authType: AuthType
}

export const useGetItems = ({ authType }: UseGetItemsProps): MenuItem[] => {
  const styles = useStyles()

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
          },
          {
            label: 'Текущие заявки',
            icon: ({ isSelected }) => (
              <OrderListIcon className={cx(styles.icon, { [styles.selectedIcon]: isSelected })} />
            ),
            path: appRoutePaths.orderList,
          },
          {
            label: 'Документы',
            icon: ({ isSelected }) => (
              <ScheduleIcon className={cx(styles.icon, { [styles.selectedIcon]: isSelected })} />
            ),
            path: appRoutePaths.documentStorage,
          },
        ]

        return items
      }
      default: {
        return []
      }
    }
  }, [authType, styles.icon, styles.selectedIcon])

  return menuItems
}
