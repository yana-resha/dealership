import React from 'react'

import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'store'

import { TabBlocker } from 'entities/tabManagement'

import { Router } from './Router'
import { theme } from './theme'

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <TabBlocker>
          <BrowserRouter basename="/">
            <Router />
          </BrowserRouter>
        </TabBlocker>
      </ThemeProvider>
    </Provider>
  )
}
