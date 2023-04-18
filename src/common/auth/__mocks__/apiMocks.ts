import {
  GetStateAndNonceResponse,
  GetTokenResponse,
  RefreshAuthByTokenResponse,
} from '@sberauto/authdc-proto/public'

//TODO DCB-126: Убрать мок после интеграции
export function mockStartAuthSessionResponse(): GetStateAndNonceResponse {
  return {
    state: 'test_state',
    nonce: 'test_nonce',
    clientId: 'frontDC',
    redirectUri: 'dc.ru/auth',
    scope: 'username+phone+lastname',
  }
}

export function mockGetTokenResponse(): GetTokenResponse {
  return {
    jwtAccessToken: 'test_jwtAccessToken',
    refreshToken: 'test_refreshToken',
  }
}

export function mockGetRefreshTokenResponse(): RefreshAuthByTokenResponse {
  return {
    jwtAccessToken: 'test_jwtAccessToken',
    refreshToken: 'test_refreshToken',
  }
}
