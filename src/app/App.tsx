import { ThemeProvider } from '@mui/material'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from 'app/store'
import { AuthProvider } from 'common/auth'
// import { TabBlocker } from 'entities/tabManagement'

import { Router } from './Router'
import { theme } from './theme'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {/* FIXME: https://jira.x.sberauto.com/browse/DCB-146 */}
            {/* <TabBlocker> */}
            <BrowserRouter basename="/">
              <Router />
            </BrowserRouter>
            {/* </TabBlocker> */}
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  )
}
