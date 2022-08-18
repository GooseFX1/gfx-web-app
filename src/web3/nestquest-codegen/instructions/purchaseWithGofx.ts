import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ADDRESSES } from '../../ids'

export interface PurchaseWithGofxAccounts {
  payer: PublicKey
  nftVault: PublicKey
  nftUserAccount: PublicKey
  gofxUserAccount: PublicKey
  /** CHECK */
  nftAuth: PublicKey
  /** CHECK */
  revenue: PublicKey
  gofxRevenue: PublicKey
  gofxMint: PublicKey
  /** CHECK */
  civicGatewayToken: PublicKey
  /** CHECK */
  civicGatekeeper: PublicKey
  nftMint: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export function purchaseWithGofx(accounts: PurchaseWithGofxAccounts, network: WalletAdapterNetwork) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.nftVault, isSigner: false, isWritable: true },
    { pubkey: accounts.nftUserAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.gofxUserAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.nftAuth, isSigner: false, isWritable: true },
    { pubkey: accounts.revenue, isSigner: false, isWritable: true },
    { pubkey: accounts.gofxRevenue, isSigner: false, isWritable: true },
    { pubkey: accounts.gofxMint, isSigner: false, isWritable: false },
    { pubkey: accounts.civicGatewayToken, isSigner: false, isWritable: false },
    { pubkey: accounts.civicGatekeeper, isSigner: false, isWritable: false },
    { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([118, 31, 242, 9, 254, 162, 200, 84])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: ADDRESSES[network].programs.nestquestSale.program_id, data })
  return ix
}
