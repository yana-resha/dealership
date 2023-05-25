import { useState } from 'react'

import createContext from '../../createContext'

const defaultValue = {
  testValue: '',
  changeTestValue: (value: string) => {},
}

export const [TestContextProvider, useTestContext] = createContext(defaultValue)

export function TestChild() {
  const { testValue, changeTestValue } = useTestContext()

  return (
    <button data-testid="testButton" onClick={() => changeTestValue('newTestValue')}>
      {testValue}
    </button>
  )
}

export function TestParent() {
  const [value, setValue] = useState('test')

  return (
    <TestContextProvider testValue={value} changeTestValue={value => setValue(value)}>
      <TestChild />
    </TestContextProvider>
  )
}
