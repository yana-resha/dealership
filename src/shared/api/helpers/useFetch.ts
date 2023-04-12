import { useState, useEffect } from 'react'

type Request = (arg: any) => Promise<any>
type FirstParameter<T extends Request> = Parameters<T>[0]

export function useFetch<T extends Request>(request: T, params: FirstParameter<T>) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<Awaited<ReturnType<T>> | undefined>()
  const [error, setError] = useState<any | undefined>()

  const serializeParams = JSON.stringify(params)

  useEffect(() => {
    async function fetch() {
      try {
        const response = await request(params)
        setData(response)
      } catch (error) {
        console.log('err', error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializeParams, request])

  return { isLoading, data, error }
}
