import React, { PropsWithChildren } from 'react'

import { Provider } from 'react-redux'
import { MockStore } from 'redux-mock-store'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'

import { theme } from 'app/theme'
import { store } from 'store'

export function ThemeProviderMock({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export function StoreProviderMock({ mockStore, children }: { mockStore?: MockStore } & PropsWithChildren) {
  return <Provider store={mockStore || store}>{children}</Provider>
}

export function MockProviders ({ children }: React.PropsWithChildren<{}>) {
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
  )}
