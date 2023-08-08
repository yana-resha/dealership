type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export interface GenericResponse<T> {
  success: boolean
  data: T | null
}

export interface Options<T> {
  headers?: Record<string, string>
  data?: T
  method?: Method
  sendSessionId?: boolean
  isResponseBlob?: boolean
  isReadOnly?: boolean
  withCredentials?: boolean
}
