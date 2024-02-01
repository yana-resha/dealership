import React, { PropsWithChildren } from 'react'

import { ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, Location } from 'react-router-dom'
import { MockStore } from 'redux-mock-store'

import { store } from 'app/store'
import { theme } from 'app/theme'

export function ThemeProviderMock({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export function StoreProviderMock({
  mockStore,
  children,
}: { mockStore?: MockStore<RootState> } & PropsWithChildren) {
  return <Provider store={mockStore || store}>{children}</Provider>
}

const queryClient = new QueryClient()

export function MockProviders({
  mockStore,
  initialEntries,
  children,
}: { mockStore?: MockStore; initialEntries?: Partial<Location>[] } & PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={mockStore || store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter basename="/" initialEntries={initialEntries}>
            <Routes>
              <Route path={'/*'} element={children} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  )
}
