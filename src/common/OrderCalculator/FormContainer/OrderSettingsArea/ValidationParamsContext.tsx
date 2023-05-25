import { ValidationParams } from 'entities/OrderCalculator/utils/baseFormValidation'
import createContext from 'shared/utils/createContext'

type ContextValue = {
  changeSchemaParams: ({
    minPercent,
    maxPercent,
    minInitialPayment,
    maxInitialPayment,
  }: ValidationParams) => void
}

export const [ValidationParamsContext, useValidationParamsContext] = createContext<ContextValue>({
  changeSchemaParams: () => {},
})
