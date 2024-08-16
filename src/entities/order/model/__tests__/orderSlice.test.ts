import { orderSlice, updateOrder, setOrder, clearOrder } from '../orderSlice'

type OrderState = Omit<RootState['order'], '_persist'>

describe('orderSlice', () => {
  const initialState: OrderState = {}

  it('должен обрабатывать действие setOrder', () => {
    const order: OrderState['order'] = { lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович' }
    expect(
      orderSlice.reducer(initialState, {
        type: setOrder.type,
        payload: order,
      }),
    ).toEqual({ order })
  })

  it('должен обрабатывать действие updateOrder', () => {
    const initialOrder: OrderState['order'] = {
      lastName: 'Иванов',
      firstName: 'Иван',
      middleName: 'Иванович',
    }
    const updatedOrder: OrderState['order'] = { lastName: 'Петров', phoneNumber: '1234567890' }
    expect(
      orderSlice.reducer(
        { order: initialOrder },
        {
          type: updateOrder.type,
          payload: updatedOrder,
        },
      ),
    ).toEqual({ order: { ...initialOrder, ...updatedOrder } })
  })

  it('должен обрабатывать действие clearOrder', () => {
    const order: OrderState['order'] = { lastName: 'Иванов', firstName: 'Иван', middleName: 'Иванович' }
    expect(
      orderSlice.reducer(
        { order },
        {
          type: clearOrder.type,
        },
      ),
    ).toEqual({ order: undefined })
  })
})
