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

export const formFields = [
  'ФИО',
  'Менялось',
  'Количество детей',
  'Семейное положение',
  'Серия и номер паспорта',
  'День рождения',
  'Место рождения',
  'Дата выдачи',
  'Код подразделения',
  'Адрес по регистрации (КЛАДР)',
  'Адрес проживания',
  'Адрес проживания совпадает с адресом регистрации',
  'Дата регист. по прописке',
  'Тип телефона',
  'Телефон',
  'Email',
  'Среднемесячный доход',
  'Дополнительный личный доход',
  'Подтверждение',
  'Доход семьи без дохода заявит.',
  'Общие расходы',
  'Принадлежность клиента к категории публичных лиц',
  '2ндфл',
  '3ндфл',
  'Выписки',
  'Тип второго документа',
  'Серия и номер',
  'Дата выдачи второго документа',
  'Должность/Вид занятости',
  'Дата устройства на работу',
  'Наименование организации',
  'Телефон работодателя',
  'Адрес работодателя',
  'ИНН организации',
  'Тип Контракта',
  'Анкета подписана',
  'Распечатать',
  'Отправить',
]
