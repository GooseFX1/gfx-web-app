import { Connection, ParsedAccountData, PublicKey, AccountInfo } from '@solana/web3.js'
import chunks from 'lodash.chunk'
import orderBy from 'lodash.orderby'
import { decodeTokenMetadata, getSolanaMetadataAddress } from './utils'
import { isValidSolanaAddress } from '../utils'
import { TOKEN_PROGRAM_ID } from '../ids'
import { MetaplexMetadata, StringPublicKey } from '../metaplex'
import { PromiseSettledResult, PromiseFulfilledResult } from './types'

// sanitize: Remove possible rusts empty string symbols `\x00` from the values
// sort: tokens by Update Authority (read by Collection)
export type Options = {
  publicAddress: StringPublicKey
  connection: Connection
  sanitize?: boolean
  stringifyPubKeys?: boolean
  sort?: boolean
  limit?: number
}

enum sortKeys { //eslint-disable-line
  updateAuthority = 'updateAuthority' //eslint-disable-line
}

export const getParsedNftAccountsByOwner = async ({
  publicAddress,
  connection,
  sanitize = true,
  stringifyPubKeys = true,
  sort = true,
  limit = 5000
}: Options) => {
  const isValidAddress = isValidSolanaAddress(publicAddress)
  if (!isValidAddress) {
    return []
  }

  // gets all accounts owned by user and created by SPL Token Program includes all NFTs, Coins, Tokens, etc.
  const { value: splAccounts } = await connection.getParsedTokenAccountsByOwner(new PublicKey(publicAddress), {
    programId: new PublicKey(TOKEN_PROGRAM_ID)
  })

  // filters out coins. assumes NFT is SPL token with decimals === 0 and amount at least 1
  // remove NFTs created before Metaplex NFT Standard like (Solarians) need to check in separate call
  const nftAccounts = splAccounts
    .filter((t) => {
      const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount
      const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals
      return decimals === 0 && amount >= 1
    })
    .map((t) => {
      const address = t.account?.data?.parsed?.info?.mint
      return new PublicKey(address)
    })

  const accountsSlice = nftAccounts?.slice(0, limit)

  // Get Addresses of Metadata Account assosiated with Mint Token
  // This info can be deterministically calculated by Associated Token Program
  const metadataAcountsAddressPromises = await Promise.allSettled(accountsSlice.map(getSolanaMetadataAddress))

  const metadataAccounts = metadataAcountsAddressPromises
    .filter(onlySuccessfullPromises)
    .map((p) => (p as PromiseFulfilledResult<PublicKey>).value)

  // Fetch Found Metadata Account data by chunks
  const metaAccountsRawPromises: PromiseSettledResult<(AccountInfo<Buffer | ParsedAccountData> | null)[]>[] =
    await Promise.allSettled(
      chunks(metadataAccounts, 99).map((chunk) => connection.getMultipleAccountsInfo(chunk as PublicKey[]))
    )

  const accountsRawMeta = metaAccountsRawPromises
    .filter(({ status }) => status === 'fulfilled')
    .flatMap((p) => (p as PromiseFulfilledResult<unknown>).value)

  // if Mints doesn't have associated metadata account. just return []
  if (!accountsRawMeta?.length || accountsRawMeta?.length === 0) {
    return []
  }

  // Decode data from Buffer to readable objects
  const accountsDecodedMeta = await Promise.allSettled(
    accountsRawMeta.map((accountInfo) => decodeTokenMetadata((accountInfo as AccountInfo<Buffer>)?.data))
  )

  const accountsFiltered = accountsDecodedMeta
    .filter(onlySuccessfullPromises)
    .filter(onlyNftsWithMetadata)
    .map((p) => {
      const { value } = p as PromiseFulfilledResult<MetaplexMetadata>
      return sanitize ? sanitizeTokenMeta(value) : value
    })
    .map((token) => (stringifyPubKeys ? publicKeyToString(token) : token))

  // sort accounts if sort is true & updateAuthority stringified
  if (stringifyPubKeys && sort) {
    const accountsSorted = orderBy(accountsFiltered, [sortKeys.updateAuthority], ['asc'])

    return accountsSorted
  }
  // otherwise return unsorted
  return accountsFiltered
}

const sanitizeTokenMeta = (tokenData: MetaplexMetadata) => ({
  ...tokenData,
  data: {
    ...tokenData?.data,
    name: sanitizeMetaStrings(tokenData?.data?.name),
    symbol: sanitizeMetaStrings(tokenData?.data?.symbol),
    uri: sanitizeMetaStrings(tokenData?.data?.uri)
  }
})

// Convert all PublicKey to string
const publicKeyToString = (tokenData: MetaplexMetadata) => ({
  ...tokenData,
  mint: tokenData?.mint?.toString?.(),
  updateAuthority: tokenData?.updateAuthority?.toString?.(),
  data: {
    ...tokenData?.data,
    creators: tokenData?.data?.creators?.map((c: any) => ({
      ...c,
      address: new PublicKey(c?.address)?.toString?.()
    }))
  }
})

// cleans string; symbols from buffer return "\x0000" instead of usual spaces
export const sanitizeMetaStrings = (metaString: string) => metaString.replace(/\0/g, '')

const onlySuccessfullPromises = (result: PromiseSettledResult<unknown>): boolean =>
  result && result.status === 'fulfilled'

// Remove any NFT Metadata Account which doesn't have uri field = invalid
const onlyNftsWithMetadata = (t: PromiseSettledResult<MetaplexMetadata>) => {
  const uri = (t as PromiseFulfilledResult<MetaplexMetadata>).value.data?.uri?.replace?.(/\0/g, '')
  return uri !== '' && uri !== undefined
}
