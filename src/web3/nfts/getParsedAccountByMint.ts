import { PublicKey, Connection, ParsedAccountData } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '../ids'
import { StringPublicKey } from '../metaplex'

interface IGetParsedAccountByMint {
  mintAddress: StringPublicKey
  connection: Connection
}

interface ITokenData {
  owner: string
  pubkey: string
}

function isParsedAccountData(obj: any): obj is ParsedAccountData {
  return obj?.parsed !== undefined
}

/**
 * This fn look for the account associated with passed NFT token mint field.
 * This associated account holds some useful information like who is current owner of token.
 * it is stored within result.account.data.parsed.info.owner
 * Finds current token owner
 */
export const getParsedAccountByMint = async ({
  mintAddress,
  connection
}: IGetParsedAccountByMint): Promise<ITokenData | undefined> => {
  const res = await connection.getParsedProgramAccounts(new PublicKey(TOKEN_PROGRAM_ID), {
    filters: [
      { dataSize: 165 },
      {
        memcmp: {
          offset: 0,
          bytes: mintAddress
        }
      }
    ]
  })

  if (!res?.length) {
    return undefined
  }

  const positiveAmountResult: any = res.find(({ account }) => {
    const data = account.data
    if (isParsedAccountData(data)) {
      const amount = data?.parsed?.info?.tokenAmount?.amount
      return amount === '1'
    }
    return false
  })

  return positiveAmountResult
    ? {
        owner: positiveAmountResult.account.data.parsed.info.owner,
        pubkey: positiveAmountResult.pubkey.toString()
      }
    : undefined
}
