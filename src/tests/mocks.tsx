import React, { PropsWithChildren } from 'react'

import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MockStore } from 'redux-mock-store'
import { store } from 'store'

import { theme } from 'app/theme'

export function ThemeProviderMock({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export function StoreProviderMock({ mockStore, children }: { mockStore?: MockStore } & PropsWithChildren) {
  return <Provider store={mockStore || store}>{children}</Provider>
}

export function MockProviders({ children }: React.PropsWithChildren<{}>) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter basename="/">
          <Routes>
            <Route path={'/*'} element={children} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  )
}
