import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

type SearchParamOperations<T> = {
  clear: () => void
  getByKey: (key: keyof T) => string | number | boolean | null
  getByKeys: (keys: (keyof T)[]) => Partial<T>
  getSingleItemByKeys: (keys: (keyof T)[]) => any
  getByPartialKey: (key: string) => any
}

function useSearchParams<T extends Record<string, string | number | boolean>>(): {
  searchParams: Partial<T>
  operators: SearchParamOperations<T>
} {
  const { search } = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<Partial<T>>({})

  useEffect(() => {
    const params = new URLSearchParams(search)
    const queryParamsArray = Array.from(params.keys())
    const result: Partial<T> = {}

    queryParamsArray.forEach((param) => {
      const value = params.get(param)
      if (value) {
        if (!isNaN(Number(value))) {
          result[param as keyof T] = Number(value) as any
        } else if (value === 'true' || value === 'false') {
          result[param as keyof T] = (value === 'true') as any
        } else {
          result[param as keyof T] = value as any
        }
      }
    })

    setSearchParams(result)
  }, [search])

  const clearSearchParams = () => {
    const currentSearch = new URLSearchParams(search)
    for (const key of Object.keys(searchParams)) { // cleanup only the keys that are in the current search
      currentSearch.delete(key)
    }
    setSearchParams({})
    navigate({ search: currentSearch.toString() }, { replace: true })
  }

  function getByKey(key: keyof T) {
    return searchParams[key] ?? null
  }

  function getByKeys(keys: (keyof T)[]) {
    const result: Partial<T> = {}
    keys.forEach((key) => {
      result[key] = searchParams[key]
    })
    return result
  }

  function getSingleItemByKeys(keys: (keyof T)[]) {
    for (const key of keys) {
      if (searchParams[key] !== undefined) {
        return searchParams[key]
      }
    }
  }

  function getByPartialKey(key: string, cleanKey = true, normalizeKey = true) {
    for (const refKey of Object.keys(searchParams)) {
      const cleanedKey = cleanKey ? refKey.trim() : refKey
      const normKey = normalizeKey ? cleanedKey.toLowerCase() : cleanedKey
      if (normKey.includes(key) || normKey.startsWith(key) || normKey.endsWith(key)) {
        return searchParams[refKey]
      }
    }
    return null
  }

  return {
    searchParams,
    operators: {
      clear: clearSearchParams,
      getByKey,
      getByKeys,
      getSingleItemByKeys,
      getByPartialKey
    }
  }
}

export default useSearchParams
