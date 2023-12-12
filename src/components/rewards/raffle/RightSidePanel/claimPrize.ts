/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import CLAIM_IDL from './claimPrize.json'
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'
import * as anchor from '@coral-xyz/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'

const GLOBAL_TREASURY_SIGNER_SEED = 'global-treasury-signer'
const GOOSEFX_RAFFLE_USER_SEED = 'goosefx-raffle-user'

export const RAFFLE_PROGRAM_PUBKEY = new PublicKey('3sFaV13movRZYWj33zLxgHDqU89V3F1VZw7cGTktE5LR')
export const USDC_MINT_PUBKEY = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
export const BONK_MINT_PUBKEY = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263')
export const GOFX_MINT_PUBKEY = new PublicKey('GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD')
export const CLAIM_PROGRAM_AUTHORITY = new PublicKey('kiraF71MNVhsqLn6aygKLWka98v2u1vffo7PvLeTyho')

export const globalTreasurySignerPDA = PublicKey.findProgramAddressSync(
  [Buffer.from(GLOBAL_TREASURY_SIGNER_SEED), CLAIM_PROGRAM_AUTHORITY.toBuffer()],
  RAFFLE_PROGRAM_PUBKEY
)[0]

export const getClaimProgram = (connection: Connection, wallet: WalletContextState): any => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'processed'
  })
  return new Program(CLAIM_IDL as anchor.Idl, RAFFLE_PROGRAM_PUBKEY, provider)
}

export const getUserClaimPDA = (wallet: PublicKey, mint: PublicKey): PublicKey =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from(GOOSEFX_RAFFLE_USER_SEED),
      mint.toBuffer(),
      wallet.toBuffer(),
      CLAIM_PROGRAM_AUTHORITY.toBuffer()
    ],
    RAFFLE_PROGRAM_PUBKEY
  )[0]

export const getUserClaimableAmount = async (
  pubKey: PublicKey,
  mintAddress: PublicKey,
  program: any
): Promise<number> => {
  try {
    const userPDA = getUserClaimPDA(pubKey, mintAddress)
    const userStateData: any = await program.account.raffleUserState.fetch(userPDA)
    return parseInt(userStateData.claimableAmount)
  } catch (err) {
    return null
  }
}

export const claimPrize = async (
  program: anchor.Program,
  pubKey: PublicKey,
  mintAddress: PublicKey
): Promise<string | boolean> => {
  try {
    await program.methods
      .claimRewards()
      .accounts({
        user: pubKey,
        globalTreasurySigner: globalTreasurySignerPDA,
        mint: mintAddress,
        userStateSigner: await getUserClaimPDA(pubKey, mintAddress),
        sourceTokenAccount: getAssociatedTokenAddressSync(mintAddress, globalTreasurySignerPDA, true),
        destinationTokenAccount: getAssociatedTokenAddressSync(mintAddress, pubKey),
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .rpc({ commitment: 'processed' })
    return true
  } catch (err) {
    console.log(err)
    return err
  }
}
