import { ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from 'app/store'
import { AuthProvider } from 'common/auth'
import { TechnicalError } from 'pages/TechnicalError/TechnicalError'
import { useInitialTablePagesClearing } from 'shared/tableCurrentPage'

import { Router } from './Router'
import { theme } from './theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

export function App() {
  useInitialTablePagesClearing()

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider hideIconVariant dense>
            <ErrorBoundary fallback={<TechnicalError />}>
              <BrowserRouter basename="/">
                <AuthProvider>
                  <Router />
                </AuthProvider>
              </BrowserRouter>
            </ErrorBoundary>
          </SnackbarProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  )
}
