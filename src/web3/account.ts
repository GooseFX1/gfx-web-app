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
) {
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
) {
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

export function createAssociatedTokenAccountInstruction(
  instructions: TransactionInstruction[],
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }
  ]
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([])
    })
  )
}

export function createMint(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  mintRentExempt: number,
  decimals: number,
  owner: PublicKey,
  freezeAuthority: PublicKey,
  signers: Keypair[]
) {
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
) {
  const account = createUninitializedAccount(instructions, payer, accountRentExempt, signers)

  instructions.push(createInitializeAccountInstruction(account, mint, owner))

  return account
}
