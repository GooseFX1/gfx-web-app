import { deserializeUnchecked } from 'borsh'
import { Connection, PublicKey } from '@solana/web3.js'
import { METADATA_PREFIX, METADATA_PROGRAM, MetaplexMetadata } from '../metaplex'
import { decodeMetadata, PARSE_NFT_ACCOUNT_SCHEMA } from './metadata'

const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
const metaProgamPublicKeyBuffer = metaProgamPublicKey.toBuffer()
const metaProgamPrefixBuffer = Buffer.from(METADATA_PREFIX)

export const decodeTokenMetadata = async (buffer: Buffer): Promise<MetaplexMetadata> =>
  deserializeUnchecked(PARSE_NFT_ACCOUNT_SCHEMA, MetaplexMetadata, buffer)

/**
 * Get Addresses of Metadata account assosiated with Mint Token
 **/
export async function getSolanaMetadataAddress(tokenMint: PublicKey): Promise<PublicKey> {
  const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
  return (
    await PublicKey.findProgramAddress(
      [metaProgamPrefixBuffer, metaProgamPublicKeyBuffer, tokenMint.toBuffer()],
      metaProgamPublicKey
    )
  )[0]
}

export const minimizeTheString = (str: string, neededLength?: number): string => {
  try {
    if (str.length > (neededLength ? neededLength : 12))
      return str.substring(0, neededLength ? neededLength : 12) + '...'
    return str
  } catch (err) {
    return ''
  }
}

const getDaysArray = function (start, end) {
  //eslint-disable-next-line
  for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}
function formatDate(input) {
  const datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits1
    month = datePart[1],
    day = datePart[2]
  return day + '-' + month + '-' + year
}
export const formatTommddyyyy = (input: string): string => {
  const datePart = input.match(/\d+/g),
    year = datePart[2],
    month = datePart[1],
    day = datePart[0]
  return month + '-' + day + '-' + year
}

export const getDateInArray = (): string[] => {
  const todayObj = new Date()
  let daylist = getDaysArray(new Date(new Date()), new Date(todayObj.setDate(todayObj.getDate() + 20)))
  daylist = daylist.map((v) => formatDate(v.toISOString().slice(0, 10)))
  return daylist
}

export const getNFTMetadata = async (metadataAccountPublicKey: String, connection: Connection): Promise<any> => {
  try {
    const metadataAddress = new PublicKey(metadataAccountPublicKey)
    const metadataAccount = await connection.getAccountInfo(metadataAddress)

    if (metadataAccount) {
      // Decode metadata account data
      const metadata = decodeMetadata(metadataAccount.data)
      return metadata
    } else {
      console.log('Metadata account not found')
      return null
    }
  } catch (err) {
    console.error(err)
    return err
  }
}
