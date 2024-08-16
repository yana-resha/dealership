import { RequisitesForFinancing } from 'entities/applications/AdditionalOptionsRequisites/hooks/useRequisitesForFinancingQuery'
import createContext from 'shared/utils/createContext'

const defaultValue = {
  requisites: undefined as RequisitesForFinancing | undefined,
  isRequisitesFetched: false,
}

export const [RequisitesContextProvider, useRequisitesContext] = createContext(defaultValue)
