import React from 'react'

import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'store'

import { Router } from './Router'
import { theme } from './theme'

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/">
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
