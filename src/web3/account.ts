import {
  AccountLayout,
  MintLayout,
  createInitializeMintInstruction,
  createInitializeAccountInstruction
} from '@solana/spl-token-v2'
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js'
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, TOKEN_PROGRAM_ID } from './ids'

export function createUninitializedMint(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  amount: number,
  signers: Keypair[]
): PublicKey {
  const account = Keypair.generate()
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: amount,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID
    })
  )

  signers.push(account)

  return account.publicKey
}

export function createUninitializedAccount(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  amount: number,
  signers: Keypair[]
): PublicKey {
  const account = Keypair.generate()
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: amount,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID
    })
  )

  signers.push(account)

  return account.publicKey
}

export function createMint(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  mintRentExempt: number,
  decimals: number,
  owner: PublicKey,
  freezeAuthority: PublicKey,
  signers: Keypair[]
): PublicKey {
  const account = createUninitializedMint(instructions, payer, mintRentExempt, signers)

  instructions.push(createInitializeMintInstruction(account, decimals, owner, freezeAuthority))

  return account
}

export function createTokenAccount(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  accountRentExempt: number,
  mint: PublicKey,
  owner: PublicKey,
  signers: Keypair[]
): PublicKey {
  const account = createUninitializedAccount(instructions, payer, accountRentExempt, signers)

  instructions.push(createInitializeAccountInstruction(account, mint, owner))

  return account
}
