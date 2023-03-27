import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

export function transformRequestData(requestData: any) {
  if (typeof requestData === 'object') {
    return snakecaseKeys(requestData, { deep: true })
  }

  return requestData
}

export function transformResponseData(responseData: any) {
  if (typeof responseData === 'object') {
    return camelcaseKeys(responseData, { deep: true })
  }

  return responseData
}
