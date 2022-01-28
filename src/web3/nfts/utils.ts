import { deserializeUnchecked } from 'borsh'
import { PublicKey } from '@solana/web3.js'
import { METADATA_PREFIX, METADATA_PROGRAM, MetaplexMetadata } from '../metaplex'
import { PARSE_NFT_ACCOUNT_SCHEMA } from './metadata'
import { extendBorsh } from '../../utils'

extendBorsh()

const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
const metaProgamPublicKeyBuffer = metaProgamPublicKey.toBuffer()
const metaProgamPrefixBuffer = Buffer.from(METADATA_PREFIX)

export const decodeTokenMetadata = async (buffer: Buffer) =>
  deserializeUnchecked(PARSE_NFT_ACCOUNT_SCHEMA, MetaplexMetadata, buffer)

/**
 * Get Addresses of Metadata account assosiated with Mint Token
 */
export async function getSolanaMetadataAddress(tokenMint: PublicKey) {
  const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
  return (
    await PublicKey.findProgramAddress(
      [metaProgamPrefixBuffer, metaProgamPublicKeyBuffer, tokenMint.toBuffer()],
      metaProgamPublicKey
    )
  )[0]
}
