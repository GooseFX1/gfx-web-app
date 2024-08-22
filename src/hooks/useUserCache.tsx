import { useCallback, useEffect, useState } from 'react'
import { USER_CONFIG_CACHE } from '@/types/app_params'

function newCache(): USER_CONFIG_CACHE {
  return {
    hasDexOnboarded: false,
    farm: {
      hasFarmOnboarded: false,
      showDepositedFilter: false
    },
    gamma: {
      hasGAMMAOnboarded: false,
      showDepositedFilter: false
    },
    hasSignedTC: false,
    endpointName: "QuickNode",
    endpoint: null,
    priorityFee: 'Default'
  } as USER_CONFIG_CACHE
}
export function resetUserCache(): void {
  window.localStorage.setItem('gfx-user-cache', JSON.stringify(newCache()))
}
export function getOrCreateCache(): USER_CONFIG_CACHE {
  const rawCache = window.localStorage.getItem('gfx-user-cache')
  if (rawCache) {
    try {
      return JSON.parse(rawCache) as USER_CONFIG_CACHE
    } catch (e) {
      console.error('Error parsing user cache', e)
    }
  }
  const cache = newCache()
  localStorage.setItem('gfx-user-cache', JSON.stringify(cache))
  return cache;
}
export function validateUserCache(cache?: USER_CONFIG_CACHE): boolean {
  const validCache = cache ?? getOrCreateCache();
  const validCacheKeys = Object.keys(validCache);
  const emptyValidCache = newCache();
  for (const key of validCacheKeys) {
    if (!(key in emptyValidCache)) {
      return false;
    }
    if (typeof validCache[key] !== typeof emptyValidCache[key]) {
      return false;
    }
  }
  return true;
}

type UseUserCacheReturn = {
  userCache: USER_CONFIG_CACHE
  setUserCache: (cache: USER_CONFIG_CACHE) => void
  updateUserCache: (cache: Partial<USER_CONFIG_CACHE>) => void
}

function useUserCache(): UseUserCacheReturn {
  const [userCache, setUserCache] = useState<USER_CONFIG_CACHE>(getOrCreateCache())
  const setCache = useCallback((cache: USER_CONFIG_CACHE) => {
    setUserCache(cache)
  }, [])

  const updateUserCache = useCallback((cache: Partial<USER_CONFIG_CACHE>) => {
    setUserCache((prevCache) => ({ ...prevCache, ...cache }))
  }, [])
  useEffect(() => {
    window.localStorage.setItem('gfx-user-cache', JSON.stringify(userCache))
  }, [userCache])

  return {
    userCache,
    setUserCache: setCache,
    updateUserCache
  }
}

export default useUserCache
