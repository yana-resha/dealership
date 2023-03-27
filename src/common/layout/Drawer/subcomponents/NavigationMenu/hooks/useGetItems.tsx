import React, { useMemo } from 'react'

import { appRoutePaths } from 'app/Router/Router.utils'
import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'
import { ReactComponent as OrderCreateIconSelected } from 'assets/icons/orderCreateSelected.svg'
import { ReactComponent as OrderListIcon } from 'assets/icons/orderList.svg'
import { ReactComponent as OrderListIconSelected } from 'assets/icons/orderListSelected.svg'
import { AuthType } from 'common/auth/CheckToken'

import { MenuItem } from './types'

type UseGetItemsProps = {
  authType: AuthType
}

export const useGetItems = (props: UseGetItemsProps): MenuItem[] => {
  const { authType } = props

  const menuItems = useMemo(() => {
    switch (authType) {
      case 'auth': {
        const items: MenuItem[] = [
          {
            label: 'Создать заявку',
            icon: ({ isSelected }) => (isSelected ? <OrderCreateIconSelected /> : <OrderCreateIcon />),
            path: appRoutePaths.createOrder,
          },
          {
            label: 'Текущие заявки',
            icon: ({ isSelected }) => (isSelected ? <OrderListIconSelected /> : <OrderListIcon />),
            path: appRoutePaths.orderList,
          },
        ]

        return items
      }
      default: {
        return []
      }
    }
  }, [authType])

  return menuItems
}
