import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ADDRESSES } from '../../ids'

export interface PurchaseWithSolAccounts {
  payer: PublicKey
  nftVault: PublicKey
  nftUserAccount: PublicKey
  /** CHECK */
  nftAuth: PublicKey
  /** CHECK */
  revenue: PublicKey
  /** CHECK */
  civicGatewayToken: PublicKey
  /** CHECK */
  civicGatekeeper: PublicKey
  nftMint: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export function purchaseWithSol(accounts: PurchaseWithSolAccounts, network: WalletAdapterNetwork) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.nftVault, isSigner: false, isWritable: true },
    { pubkey: accounts.nftUserAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.nftAuth, isSigner: false, isWritable: true },
    { pubkey: accounts.revenue, isSigner: false, isWritable: true },
    { pubkey: accounts.civicGatewayToken, isSigner: false, isWritable: false },
    { pubkey: accounts.civicGatekeeper, isSigner: false, isWritable: false },
    { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([27, 238, 240, 155, 170, 180, 26, 118])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: ADDRESSES[network].programs.nestquestSale.program_id, data })
  return ix
}
