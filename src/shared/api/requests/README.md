## Описание методов API

В данной директории (`src/shared/api/requests`) описываются все методы API.

### Соглашения по описанию запросов

1.  Для каждого эндпоинта создается отдельный файл. Например, для ручки `/authsberteamid/isClient` соответствует эндпоинт `/authsberteamid`, то методы этого эндпоинта следует поместить в файл `authsberteamid.ts`.
2.  Для реализации метода следует использовать `proto-конструктор`, который возвращает готовую реализацию для всех методов эндпоинта. Подробнее можно прочитать по ссылке [Typescript proto client](https://wiki.x.sberauto.com/display/DOCS/Typescript+proto+client).

```typescript
import { createAuthSberTeamID, GetStateAndNonceRequest } from '@sberauto/authsberteamid-proto/public'
import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

const authsberteamidApi = createAuthSberTeamID(`${appConfig.apiUrl}/authsberteamid`, Rest.request)

export const getStateAndNonce = (params: GetStateAndNonceRequest) =>
  authsberteamidApi.getStateAndNonce({ data: params }).then(response => response.data || {})
```

3.  Каждый метод api возвращает поле `data` с полезными данными. Необходимо извлечь эти данные из поля `data`.

4.  Каждый метод api при вызове запроса получает `data` с полезными данными. Что бы при вызове метода постоянно не указывать поле `data` его стоит определить тут при описании метода

```typescript
export const getStateAndNonce = (params: GetStateAndNonceRequest) =>
  authsberteamidApi.getStateAndNonce({ data: params }).then(response => response.data || {})
```

5.  В директории `shared/api` могут находиться хуки `useQuery`. Они должны быть простыми и в них не должно быть дополнительные преобразования с response. Название хука должно соответствовать шаблону `use{название ручки}Query`. Если требуется более сложный `useQuery\-хук`, он должен быть описан в хуках соответствующего компонента.

```typescript
export const useGetVendorOptionsQuery = (
  params: GetVendorOptionsRequest,
  options?: UseQueryOptions<unknown, unknown, GetVendorOptionsResponse, string[]>,
) =>
  useQuery(['getVendorOptions'], () => createDictionaryDcApi.method(params), {
    retry: false,
    cacheTime: Infinity,
    ...options,
  })
```

5.  Чего следует избегать

- Не выполняйте дополнительные преобразования с ответом эндпоинта. Ожидается, что эндпоинт возвращает именно то, что описано в документации. Отклонение от стандартного поведения может запутать разработчика и потребовать дополнительного времени для разбора проблемы. Если требуется обработать ответ, следует написать утилиту в соответствующем компоненте.
- Не изменяйте название метода. Экспортируемый метод должен иметь то же название, что и сама ручка. Можно отклониться от этого правила только в случае, если название ручки на бэке выбрано неудачно, но даже в таком случае название метода должно быть максимально приближено к исходному.

```typescript
// Изначальное название "isClient" пересекается с правилами наименования переменных, поэтому здесь можно изменить название на более подходящее
export const checkIfSberClient = (params: IsClientRequest) =>
  loanapplifecycledcApi.isClient({ data: params }).then(response => response.data ?? {})
```

- Не описывайте методы API в других местах.
