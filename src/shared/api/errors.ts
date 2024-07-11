import { Service, ServiceApi } from './constants'

export enum ErrorCode {
  Unautorization = 'Unautorization',
  NotFound = 'NotFound',
  InvalidArgument = 'InvalidArgument',
}

const DEFAULT_ERROR = 'Произошла ошибка. Повторите позже или свяжитесь с тех.поддержкой'

type ServiceApiError = Partial<Record<ErrorCode, string> & { default?: string }>
type ServiceErrors = Partial<Record<Service, ServiceApiError & Partial<Record<ServiceApi, ServiceApiError>>>>

/* У Бэка есть набор кодов ошибок (InvalidArgument, Unautorization и т.д.), этот набор неизменен.
Для каждого сервиса и для каждой ручки ошибка с конкретным кодом может иметь разное
значение (для пользователя). serviceErrors - нобор "переводов" для пользователя таких ошибок */
const serviceErrors: ServiceErrors = {
  [Service.Authdc]: {
    [ServiceApi.TrainingCreateSession]: {
      [ErrorCode.InvalidArgument]: 'Неверный пароль. Попробуйте еще раз',
    },
    [ServiceApi.CHANGE_PASSWORD]: {
      [ErrorCode.NotFound]: 'Пользователь c данным логином не найден',
    },
    [ErrorCode.Unautorization]: 'Ошибка авторизации. Попробуйте еще раз',
    [ErrorCode.NotFound]: 'Пользователь не найден. Не удалось авторизоваться, попробуйте еще раз',
    [ErrorCode.InvalidArgument]: 'Ошибка запроса. Попробуйте еще раз',
  },
  [Service.Filestoragedc]: {
    [ServiceApi.RemoveCatalog]: {
      default: 'Ошибка. Не удалось удалить каталог/файл',
    },
  },
  [Service.EMAILAPPDC]: {
    [ServiceApi.SEND_EMAIL_DECISION]: {
      default: 'Ошибка. Не удалось отправить решение',
    },
  },
  [Service.Dictionarydc]: {
    [ServiceApi.CALCULATE_CREDIT]: {
      [ErrorCode.NotFound]: 'Подходящие кредитные продукты не найдены. Попробуйте изменить параметры кредита',
    },
    [ServiceApi.GET_CREDIT_PRODUCT_LIST]: {
      [ErrorCode.NotFound]: 'Подходящие кредитные продукты не найдены. Попробуйте изменить параметры Авто',
    },
  },
}
/* В случае, если кода ошибки недостаточно, чтобы получить описание ошибки
(например одна и таже ручка возвращает InvalidArgument по различным ошибкам),
у Бэка есть возможность прислать alias ошибки - псевдомним, который описывает конкретную ошибку.
ErrorAlias содержит псевдонимы, которые Фронт обрабатывает. */
export enum ErrorAlias {
  RemoveCatalog_catalogIsNotEmpty = 'RemoveCatalog_catalogIsNotEmpty',
  AuthorizeUser_BadLoginOrPassword = 'AuthorizeUser_BadLoginOrPassword',
  CheckCode_WrongCode = 'CheckCode_WrongCode',
  CheckCode_InactiveCode = 'CheckCode_InactiveCode',
  AuthorizeUser_UserBlocked = 'AuthorizeUser_UserBlocked',
  AuthorizeUser_UserBlockedBySmsCount = 'AuthorizeUser_UserBlockedBySmsCount',
  CheckUserByLogin_EarlyResetPasswordCode = 'CheckUserByLogin_EarlyResetPasswordCode',
  ChangePassword_MismatchResetCode = 'ChangePassword_MismatchResetCode',
  GetEmails_VendorNotFound = 'GetEmails_VendorNotFound',
  SendEmailDecision_AlreadyAnswered = 'SendEmailDecision_AlreadyAnswered',
  SendEmailDecision_EmptyText = 'SendEmailDecision_EmptyText',
}
export const errorAliasMap = {
  [ErrorAlias.RemoveCatalog_catalogIsNotEmpty]: 'Ошибка. Невозможно удалить папку, так как в ней есть файлы',
  [ErrorAlias.AuthorizeUser_BadLoginOrPassword]: 'Неправильный логин или пароль',
  [ErrorAlias.CheckCode_WrongCode]: 'Введен некорректный код',
  [ErrorAlias.CheckCode_InactiveCode]:
    'Превышено количество попыток ввода смс, необходимо авторизоваться снова',
  [ErrorAlias.AuthorizeUser_UserBlocked]:
    'Учетная запись заблокирована, превышено количество попыток ввода пароля, обратитесь в тех.поддержку',
  [ErrorAlias.AuthorizeUser_UserBlockedBySmsCount]:
    'Учетная запись заблокирована, превышено количество запрошенных СМС-кодов, обратитесь в тех.поддержку',
  [ErrorAlias.CheckUserByLogin_EarlyResetPasswordCode]: '',
  [ErrorAlias.ChangePassword_MismatchResetCode]: 'Неверный код восстановления пароля',
  [ErrorAlias.GetEmails_VendorNotFound]: 'Дилерский центр не найден',
  [ErrorAlias.SendEmailDecision_AlreadyAnswered]: 'По этой заявке решение уже отправлено',
  [ErrorAlias.SendEmailDecision_EmptyText]: 'Письмо не может быть пустым',
}

type GetErrorMessageParams = {
  alias?: ErrorAlias
  code?: ErrorCode
  service?: Service
  serviceApi?: ServiceApi
}

/* Возвращает описание ошибки на основании параметров. Приоритетно используется alias,
затем ошибка берется по коду из serviceApi, затем service, если из предыдущего не было получено ошибки. */
export const getErrorMessage = ({ alias, code, service, serviceApi }: GetErrorMessageParams) => {
  if (alias && errorAliasMap[alias]) {
    return errorAliasMap[alias]
  }
  if (service && code) {
    return (
      serviceErrors[service]?.[serviceApi as ServiceApi]?.[code] ??
      serviceErrors[service]?.[serviceApi as ServiceApi]?.default ??
      serviceErrors[service]?.[code] ??
      serviceErrors[service]?.default ??
      DEFAULT_ERROR
    )
  }

  return DEFAULT_ERROR
}
