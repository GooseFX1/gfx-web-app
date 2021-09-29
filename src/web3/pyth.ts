import { parseMappingData, parsePriceData, parseProductData, ProductData } from '@pythnetwork/client'
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js'
import { chunks } from '../utils'

const ORACLE_PUBLIC_KEY = new PublicKey('AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J')

const getMultipleAccountsCore = async (connection: any, keys: string[], commitment: string) => {
  const args = connection._buildArgs([keys], commitment, 'base64')

  const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args)
  if (unsafeRes.error) {
    throw new Error('failed to get info about account ' + unsafeRes.error.message)
  }

  if (unsafeRes.result.value) {
    const array = unsafeRes.result.value as AccountInfo<string[]>[]
    return { keys, array }
  }

  throw new Error()
}

const getMultipleAccounts = async (connection: any, keys: string[], commitment: string) => {
  const result = await Promise.all(
    chunks(keys, 99).map((chunk) => getMultipleAccountsCore(connection, chunk, commitment))
  )

  const array = result
    .map(
      (a: any) =>
        a.array
          .map((acc: any) => {
            if (!acc) return undefined
            const { data, ...rest } = acc
            return { ...rest, data: Buffer.from(data[0], 'base64') } as AccountInfo<Buffer>
          })
          .filter((_: any) => _) as AccountInfo<Buffer>[]
    )
    .flat()

  return { keys, array }
}

export const getPriceFromPythPriceAccount = (product: AccountInfo<any>) => {
  return parsePriceData(product.data).price
}

export const fetchPythPriceAccounts = async (
  connection: Connection,
  products: ProductData[]
): Promise<{ mint: PublicKey; price: number; symbol: string }[]> => {
  const prices = await getMultipleAccounts(
    connection,
    products.map((p) => p.priceAccountKey.toBase58()),
    'confirmed'
  )
  return prices.array.map(({ data }, index) => {
    const { product, priceAccountKey } = products[index]
    const { price } = parsePriceData(data)
    return { mint: priceAccountKey, price, symbol: product.symbol }
  })
}

export const fetchPythProducts = async (connection: Connection, markets?: string[]): Promise<ProductData[]> => {
  let allProductAccountKeys: PublicKey[] = []
  let anotherMappingAccount: PublicKey | null = ORACLE_PUBLIC_KEY
  do {
    const accountInfo = await connection.getAccountInfo(anotherMappingAccount)
    if (!accountInfo || !accountInfo.data) {
      anotherMappingAccount = null
    } else {
      const { productAccountKeys, nextMappingAccount } = parseMappingData(accountInfo.data)
      allProductAccountKeys = [...allProductAccountKeys, ...productAccountKeys]
      anotherMappingAccount = nextMappingAccount
    }
  } while (anotherMappingAccount)

  const products = await getMultipleAccounts(
    connection,
    allProductAccountKeys.map((p) => p.toBase58()),
    'confirmed'
  )
  const productsData = products.array.map((p) => parseProductData(p.data))
  return markets ? productsData.filter(({ product }) => markets.includes(product.symbol)) : productsData
}
