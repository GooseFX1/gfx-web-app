import { CANCELED_STATUS_CODE, httpClient } from '@/api'
import { GAMMA_API_BASE, GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import {
  GAMMAConfig,
  GAMMAListTokenResponse,
  GAMMAPoolsResponse,
  GAMMAPortfolioPoolResponse,
  GAMMAStats,
  GAMMAUser,
  UserPortfolioLPPosition,
  UserPortfolioStats
} from '@/types/gamma'
import { BlockheightBasedTransactionConfirmationStrategy, Connection } from '@solana/web3.js'
import { aborter } from '@/utils'

const fetchGAMMAConfig = async (): Promise<GAMMAConfig | null> => {
  try {
    // const response = await httpClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.CONFIG)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching GAMMA Config:', error)
    return null
  }
}

const fetchAggregateStats = async (): Promise<GAMMAStats | null> => {
  try {
    const response = await httpClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.STATS)
    return response.data.data.stats as GAMMAStats
  } catch (error) {
    console.error('Error fetching aggregate stats:', error)
    return null
  }
}

const fetchAllPools = async ({
  page,
  pageSize,
  poolType = 'all',
  sortOrder,
  sortKey,
  searchTokens,
  abortSignal,
  showCreated,
  showDeposited,
  userPublicKey
}: {
  page: number
  pageSize: number
  poolType: 'all' | 'hyper' | 'primary'
  sortOrder: 'asc' | 'desc'
  sortKey: string
  searchTokens: string
  abortSignal?: AbortSignal
  showCreated?: boolean
  showDeposited?: boolean
  userPublicKey?: string
}): Promise<GAMMAPoolsResponse | null> => {
  let search = searchTokens.trim().toLowerCase()
  search = search.length === 0 ? '' : `&search=${search}`
  const showCreatedQuery = showCreated ? `&showCreated=${showCreated}` : ''
  const showDepositedQuery = showDeposited ? `&showDeposited=${showDeposited}` : ''
  const userPublicKeyQuery = userPublicKey ? `&userPublicKey=${userPublicKey}` : ''
  try {
    const response = await httpClient(GAMMA_API_BASE).get(
      GAMMA_ENDPOINTS_V1.POOLS_INFO_ALL +
        `?pageSize=${pageSize}&page=${page}&poolType=${poolType}&sortOrder=${sortOrder}&sortBy=${sortKey}${search}` +
        `${showCreatedQuery}${showDepositedQuery}${userPublicKeyQuery}`,
      { signal: abortSignal }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching gamma pools:', error)
    return null
  }
}
const fetchPoolsByMints = async ({
  mintA,
  mintB,
  page,
  pageSize,
  signal,
  poolType,
  sortOrder,
  sortKey,
  showCreated,
  showDeposited,
  userPublicKey
}: {
  mintA: string
  mintB?: string
  page: number
  pageSize: number
  signal?: AbortSignal
  poolType: 'all' | 'hyper' | 'primary'
  sortOrder: 'asc' | 'desc'
  sortKey: string
  showCreated?: boolean
  showDeposited?: boolean
  userPublicKey?: string
}): Promise<GAMMAPoolsResponse | null> => {
  const mintQuery = `mint1=${mintA}${mintB ? `&mint2=${mintB}` : ''}`
  const pageQuery = `page=${page}&pageSize=${pageSize}`
  const sortQuery = `poolType=${poolType}&sortOrder=${sortOrder}&sortBy=${sortKey}`
  const showCreatedQuery = showCreated ? `&showCreated=${showCreated}` : ''
  const showDepositedQuery = showDeposited ? `&showDeposited=${showDeposited}` : ''
  const userPublicKeyQuery = userPublicKey ? `&userPublicKey=${userPublicKey}` : ''
  try {
    const response = await httpClient(GAMMA_API_BASE).get(
      GAMMA_ENDPOINTS_V1.POOLS_INFO_MINTS +
        `?${mintQuery}&${pageQuery}&${sortQuery}${showCreatedQuery}${showDepositedQuery}${userPublicKeyQuery}`,
      { signal }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching gamma pools:', error)
    return null
  }
}
export const fetchAndConcatAllPoolsByMints = async (
  {
    mintA,
    mintB,
    page,
    pageSize
  }: {
    mintA: string
    mintB?: string
    page: number
    pageSize: number
  },
  currentResponse?: GAMMAPoolsResponse
) => {
  const mintQuery = `mint1=${mintA}${mintB ? `&mint2=${mintB}` : ''}`

  try {
    const response = (await httpClient(GAMMA_API_BASE).get(
      GAMMA_ENDPOINTS_V1.POOLS_INFO_MINTS + `?${mintQuery}&page=${page}&pageSize=${pageSize}`
    ))?.data as GAMMAPoolsResponse
    if (!response || !response.success) {
      throw new Error('Error fetching pools by mints')
    }
    if (currentResponse) {
      currentResponse.data.pools = currentResponse.data.pools.concat(response.data.pools)
    }
    if (response.data.totalPages > response.data.currentPage) {
      return fetchAndConcatAllPoolsByMints(
        {
          mintA,
          mintB,
          page: response.data.currentPage + 1,
          pageSize
        },
        currentResponse ?? response
      )
    }
    // incase of no prev response
    return currentResponse?.data ?? response.data
  } catch (error) {
    console.error('Error fetching gamma pools:', error)
    return null
  }
}
const fetchUser = async (publicKey: string): Promise<GAMMAUser | null> => {
  console.log(publicKey)
  try {
    // const response = await httpClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.USER}/${publicKey}`)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

const fetchPortfolioStats = async (userId: string): Promise<UserPortfolioStats | null> => {
  console.log(userId)
  try {
    // const response = await httpClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.PORTFOLIO_STATS}/${userId}`)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching portfolio stats:', error)
    return null
  }
}

const fetchLpPositions = async (userId: string): Promise<UserPortfolioLPPosition[] | null> => {
  if (!userId) return null
  try {
    const response = await httpClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.LP_POSITIONS}/${userId}`)
    return response.status === 200 ? response.data.data.accounts : []
  } catch (error) {
    console.error('Error fetching LP positions:', error)
    return null
  }
}

const fetchTokenList = async (
  page: number,
  pageSize: number,
  poolType?: string,
  searchValue?: string,
  signal?: AbortSignal
): Promise<GAMMAListTokenResponse | null> => {
  try {
    const search = searchValue ? `&search=${searchValue}` : ''
    const poolTypeQuery = poolType ? `&tokenType=${poolType}` : ''
    const response = await httpClient(GAMMA_API_BASE).get(
      GAMMA_ENDPOINTS_V1.TOKEN_LIST + `?pageSize=${pageSize}&page=${page}${poolTypeQuery}${search}`,
      {
        signal: signal
      }
    )
    if (response.status === CANCELED_STATUS_CODE) {
      return {
        success: false,
        data: null
      }
    }
    return await response.data
  } catch (error) {
    console.log('Error fetching token list', error)
    return null
  }
}
const chunkTokens = (tokens: string, charLimit: number): string[] => {
  const tokenSplit = tokens.split(',')
  let searchTokens = ''
  const searchTokensArray = []
  for (const token of tokenSplit) {
    if (searchTokens.length + token.length > charLimit) {
      searchTokensArray.push(searchTokens.slice(0, -1))
      searchTokens = ''
    }
    searchTokens += token + ','
  }
  if (searchTokens.length > 0) {
    searchTokensArray.push(searchTokens.slice(0, -1))
  }
  return searchTokensArray
}
const attachTokenList = async (
  tokens: string,
  page: number,
  pageSize: number
): Promise<GAMMAListTokenResponse | null> => {
  // if no tokens passed terminate
  if (tokens?.length === 0) throw new Error('No tokens passed')
  const pageQuery = `&pageSize=${pageSize}&page=${page}`
  // 2k limit
  const remainingSearchChars =
    2000 - GAMMA_API_BASE.length - GAMMA_ENDPOINTS_V1.TOKEN_LIST.length - 5 - pageQuery.length
  const searchTokens = chunkTokens(tokens, remainingSearchChars)
  const response = (await Promise.all(
    searchTokens.map(async (searchToken) =>
      httpClient(GAMMA_API_BASE)
        .get(GAMMA_ENDPOINTS_V1.TOKEN_LIST + `?ids=${searchToken}${pageQuery}`)
        .then((response) => response.data)
    )
  )) as GAMMAListTokenResponse[]
  if (response.length == 0) return null
  return response.reduce((acc, curr, currentIndex) => {
    if (currentIndex != 0) {
      acc.data.tokens = acc.data.tokens.concat(curr.data.tokens)
    }
    return acc
  }, response[0])
}
/**
 *
 * @param tokens comma separated string for token e.g SOL1111,EFAC22141
 */
const fetchTokensByPublicKey = async (tokens: string): Promise<GAMMAListTokenResponse | null> => {
  if (tokens?.length === 0) return null

  try {
    // recursively fetch all tokens in users wallet
    return await attachTokenList(tokens, 1, 200)
  } catch (e) {
    console.log('Error fetching token list', e)
    return {
      success: false,
      data: null
    }
  }
}

const forceCronUpdate = async () => {
  try {
    await httpClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.FORCE_CRON)
    return true
  } catch (e) {
    console.log('Error forcing cron update', e)
    return false
  }
}
const forceCronUpdateWithConnectionAndTxSig = async (connection: Connection, txSig: string) => {
  if (txSig) {
    // if txSig is given wait for confirmation
    const blockHash = await connection.getLatestBlockhash()
    const blockHeightConfirmationStrategy: BlockheightBasedTransactionConfirmationStrategy = {
      signature: txSig,
      blockhash: blockHash.blockhash,
      lastValidBlockHeight: blockHash.lastValidBlockHeight
    }
    await connection.confirmTransaction(blockHeightConfirmationStrategy, 'confirmed')
  }
  return await forceCronUpdate()
}

const fetchProfilePools = async ({
  publicKey,
  sortOrder,
  sortBy,
  page,
  pageSize,
  poolType,
  search
}: {
  publicKey: string
  sortOrder: 'desc' | 'asc'
  sortBy: string
  page: number
  pageSize: number,
  poolType: 'all' | 'primary' | 'hyper',
  search: string
}): Promise<GAMMAPortfolioPoolResponse> => {
  const signal = aborter.addSignal(`GAMMA-PORTFOLIO-POOLS`)
  const searchQuery = search ? `&search=${search}` : ''
  // eslint-disable-next-line max-len
  const url = `${GAMMA_ENDPOINTS_V1.PORTFOLIO_POOLS}?userPublicKey=${publicKey}&sortOrder=${sortOrder}&sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&poolType=${poolType}${searchQuery}`
  return await httpClient(GAMMA_API_BASE)
    .get(url,{ signal })
    .then((response)=> response.data) as GAMMAPortfolioPoolResponse
}

export {
  fetchGAMMAConfig,
  fetchAggregateStats,
  fetchUser,
  fetchPortfolioStats,
  fetchLpPositions,
  fetchAllPools,
  fetchTokenList,
  fetchTokensByPublicKey,
  fetchPoolsByMints,
  forceCronUpdate,
  forceCronUpdateWithConnectionAndTxSig,
  fetchProfilePools
}
