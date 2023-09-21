export enum ErrorCode {
  Unautorization = 'Unautorization',
  NotFound = 'NotFound',
  InvalidArgument = 'InvalidArgument',
}

export enum Service {
  Authdc = 'authdc',
}
// Для каждого сервиса набор кодов ошибок одинаков, на значения разные.
export const errors = {
  [Service.Authdc]: {
    [ErrorCode.Unautorization]: 'Ошибка авторизации. Попробуйте еще раз',
    [ErrorCode.NotFound]: 'Пользователь не найден. Не удалось авторизоваться, попробуйте еще раз',
    [ErrorCode.InvalidArgument]: 'Ошибка запроса. Попробуйте еще раз',
  },
  default: 'Произошла ошибка. Повторите позже или свяжитесь с тех.поддержкой',
}

export const getErrorMessage = (service: Service, code = '') =>
  errors[service]?.[code as ErrorCode] || errors.default
