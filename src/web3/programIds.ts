import { PublicKey } from '@solana/web3.js'
import { ORACLE_ID } from './ids'
import { findProgramAddress } from './utils'

import {
  METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  METAPLEX_ID,
  BPF_UPGRADE_LOADER_ID,
  SYSTEM,
  MEMO_ID,
  VAULT_ID,
  AUCTION_ID,
  PACK_CREATE_ID,
  toPublicKey
} from './ids'

export interface Programs {
  token: PublicKey
  associatedToken: PublicKey
  bpf_upgrade_loader: PublicKey
  system: PublicKey
  metadata: string
  memo: PublicKey
  vault: string
  auction: string
  metaplex: string
  pack_create: PublicKey
  oracle: PublicKey
  store: PublicKey
}

export const getStoreID = async (storeOwnerAddress?: string): Promise<string> => {
  if (!storeOwnerAddress) {
    return undefined
  }

  console.log('Store owner', storeOwnerAddress, METAPLEX_ID)
  const programs = await findProgramAddress(
    [Buffer.from('metaplex'), toPublicKey(METAPLEX_ID).toBuffer(), toPublicKey(storeOwnerAddress).toBuffer()],
    toPublicKey(METAPLEX_ID)
  )
  const storeAddress = programs[0]

  return storeAddress
}

export const setProgramIds = async (store?: string): Promise<void> => {
  STORE = store ? toPublicKey(store) : undefined
}

let STORE: PublicKey | undefined

export const programIds = (): Programs => ({
  token: TOKEN_PROGRAM_ID,
  associatedToken: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  bpf_upgrade_loader: BPF_UPGRADE_LOADER_ID,
  system: SYSTEM,
  metadata: METADATA_PROGRAM_ID,
  memo: MEMO_ID,
  vault: VAULT_ID,
  auction: AUCTION_ID,
  metaplex: METAPLEX_ID,
  pack_create: PACK_CREATE_ID,
  oracle: ORACLE_ID,
  store: STORE
})
