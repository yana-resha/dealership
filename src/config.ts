const env = <T extends string>(key: string): T => {
  const value = process.env[key]
  if (value) {
    return value as T
  }

  // Енвы могут отсутствовать в зависимости от окружения и их отсутствие не должно ронять приложение
  console.warn(`${key} is undefined!`)

  return '' as T
}

export const appConfig = {
  appUrl: env('REACT_APP_APP_URL'),
  apiUrl: env('REACT_APP_API_URL'),
  apixUrl: env('REACT_APP_APIX_URL'),
  sberTeamIdUrl: env('REACT_APP_SBER_TEAM_ID_URL'),
  env: env<'dev' | 'stage' | 'prod'>('REACT_APP_ENVIROMENT'),
}
