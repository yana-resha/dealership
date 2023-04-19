import { ThemeProvider } from '@mui/material'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from 'app/store'
import { AuthProvider } from 'common/auth'
// import { TabBlocker } from 'entities/tabManagement'

import { SnackbarErrorProvider } from 'shared/ui/SnackbarErrorProvider/SnackbarErrorProvider'

import { Router } from './Router'
import { theme } from './theme'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarErrorProvider>
            <AuthProvider>
              {/* FIXME: https://jira.x.sberauto.com/browse/DCB-146 */}
              {/* <TabBlocker> */}
              <BrowserRouter basename="/">
                <Router />
              </BrowserRouter>
              {/* </TabBlocker> */}
            </AuthProvider>
          </SnackbarErrorProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  )
}
