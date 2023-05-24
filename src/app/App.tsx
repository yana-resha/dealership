import { ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from 'app/store'
import { AuthProvider } from 'common/auth'
import { TabBlocker } from 'entities/tabManagement'

import { Router } from './Router'
import { theme } from './theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider hideIconVariant dense>
            <TabBlocker>
              <BrowserRouter basename="/">
                <AuthProvider>
                  <Router />
                </AuthProvider>
              </BrowserRouter>
            </TabBlocker>
          </SnackbarProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  )
}
