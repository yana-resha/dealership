import React from 'react'

import { Routes, Route } from 'react-router-dom'

import { AuthPage } from 'pages/Auth'
import { DefaultLayout } from 'common/layout/DefaultLayout'

export function AuthRouter(): JSX.Element {
  return (
    <Routes>
      <Route element={<DefaultLayout isHeader={false} />}> 
        <Route path="*" element={<AuthPage />} />
      </Route>
    </Routes>
  )
}
