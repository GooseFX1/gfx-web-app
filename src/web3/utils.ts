import { Program, Provider } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js'
import { ADDRESSES } from './ids'
const SwapIDL = require('./idl/swap.json')

export const computePoolsPDAs = async (
  tokenASymbol: string,
  tokenBSymbol: string,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey }> => {
  const {
    swap,
    seeds: { pools }
  } = ADDRESSES[network]
  const pair = pools[[tokenASymbol, tokenBSymbol].sort((a, b) => a.localeCompare(b)).join('/')]
  const poolSeed = [new Buffer('GFXPool', 'utf-8'), new PublicKey(pair).toBuffer()]
  const mintSeed = [new Buffer('GFXLPMint', 'utf-8'), new PublicKey(pair).toBuffer()]
  const PDAs = await Promise.all([
    PublicKey.findProgramAddress(mintSeed, swap),
    PublicKey.findProgramAddress(poolSeed, swap)
  ])
  const [[lpTokenMint], [pool]] = PDAs
  return { lpTokenMint, pool }
}

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0]
}

export const getLPProgram = (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
): Program =>
  new Program(SwapIDL, ADDRESSES[network].swap, new Provider(connection, wallet as any, { commitment: 'processed' }))

export const signAndSendRawTransaction = async (
  connection: Connection,
  transaction: Transaction,
  wallet: any,
  ...signers: Array<Signer>
) => {
  if (!wallet.signTransaction) return

  transaction.feePayer = wallet.publicKey
  transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
  signers.forEach((signer) => transaction.partialSign(signer))

  transaction = await wallet.signTransaction(transaction)

  return await connection.sendRawTransaction(transaction!.serialize())
}
