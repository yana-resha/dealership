import { getAuthorizeUrl } from '../authorizeUrl'

describe('LoginForm.getAuthorizeUrl', () => {
  const outputQueryStr =
    'client_id=frontDC&redirect_uri=dc.ru%2Fauth&response_type=code&scope=username+phone+lastname&response_mode=query&state=12-3&nonce=4-.%3F%2056'

  it('Проверяем, что ссылка содержит необходимые параметры', () => {
    const params = {
      state: '12-3',
      nonce: '4-.? 56',
      clientId: 'frontDC',
      redirectUri: 'dc.ru/auth',
      scope: 'username+phone+lastname',
    }
    const [_, res] = (getAuthorizeUrl(params) || '').split('?')

    expect(res).toBe(outputQueryStr)
  })
})
