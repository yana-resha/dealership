import createContext from 'shared/utils/createContext'

const defaultValue = {
  closeAccordion: () => {},
}

export const [AdditionalServicesContainerProvider, useAdditionalServicesContainerContext] =
  createContext(defaultValue)
