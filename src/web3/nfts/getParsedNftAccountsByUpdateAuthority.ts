import { clusterApiUrl, Connection, Commitment, PublicKey } from '@solana/web3.js'
import { MetaplexMetadata } from '..'
import { METADATA_PROGRAM } from '../metaplex'
import { decodeTokenMetadata } from './utils'

export const createConnectionConfig = (
  clusterApi = clusterApiUrl('mainnet-beta'),
  commitment = 'confirmed'
): Connection => new Connection(clusterApi, commitment as Commitment)

export const getParsedNftAccountsByUpdateAuthority = async ({
  updateAuthority,
  connection = createConnectionConfig()
}: {
  updateAuthority: PublicKey
  connection: Connection
}): Promise<MetaplexMetadata[]> => {
  try {
    const res = await connection.getProgramAccounts(new PublicKey(METADATA_PROGRAM), {
      encoding: 'base64',
      filters: [
        {
          memcmp: {
            offset: 1,
            bytes: updateAuthority.toString()
          }
        }
      ]
    })

    const decodedArray = await Promise.all(res.map((acc) => decodeTokenMetadata(acc.account.data)))

    return decodedArray
  } catch (err) {
    console.error(err)
    return []
  }
}
