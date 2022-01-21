import { deserializeUnchecked } from 'borsh'
import { PublicKey } from '@solana/web3.js'
import { METADATA_SCHEMA, Metadata, METADATA_PREFIX, METADATA_PROGRAM } from '../metaplex'
import { extendBorsh } from '../../utils'

export const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

extendBorsh()

const metaProgamPublicKey = new PublicKey(METADATA_PROGRAM)
const metaProgamPublicKeyBuffer = metaProgamPublicKey.toBuffer()
const metaProgamPrefixBuffer = Buffer.from(METADATA_PREFIX)

export const decodeTokenMetadata = async (buffer: Buffer) => deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer)

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
