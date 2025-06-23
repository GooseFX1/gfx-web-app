import BN from 'bn.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import {
  Connection,
  PublicKey,
  Signer,
  Transaction,
  TransactionSignature,
  TransactionInstruction,
  SimulatedTransactionResponse,
  RpcResponseAndContext
} from '@solana/web3.js'
import { useLocalStorage } from '../utils'
import { NETWORK_CONSTANTS } from '../constants'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from './ids'

const SECONDS_30 = 30 * 1000
const COMMITMENT_LEVELS = ['processed', 'confirmed', 'finalized']

export const SOL_TLD_AUTHORITY = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx')

export const isValidSolanaAddress = (address: string): boolean => {
  if (!address) return false
  try {
    const publicKey = new PublicKey(address)
    return PublicKey.isOnCurve(publicKey)
  } catch (err) {
    return false
  }
}

const getCommitmentIndex = (commitment: string): number => {
  const confirmationIndex = COMMITMENT_LEVELS.findIndex((element) => element === commitment)
  return confirmationIndex
}

const gfxConfirmTransaction = async (
  connection: Connection,
  sig: string,
  statusType: string,
  startTime: number
): Promise<any> => {
  const res = await connection.getSignatureStatuses([sig])
  const currentTime = new Date().getTime()
  if (currentTime - startTime >= SECONDS_30) {
    throw new Error('Transaction timeout error!')
  }
  const requiredCommitment = getCommitmentIndex(statusType)
  const onChainCommitment = getCommitmentIndex(res.value[0]?.confirmationStatus)
  if (res.value[0]?.err) throw new Error(res.value[0]?.err.toString())

  if (onChainCommitment > -1 && (onChainCommitment >= requiredCommitment || onChainCommitment === 2)) {
    const confirm = { value: { err: null } }
    return confirm
  } else {
    await new Promise((resolve) => setTimeout(() => resolve(true), 200))
    return gfxConfirmTransaction(connection, sig, statusType, startTime)
  }
}
export const confirmTransaction = async (
  connection: Connection,
  sig: string,
  statusType: string
): Promise<any> => {
  const startTime = new Date().getTime()
  return gfxConfirmTransaction(connection, sig, statusType, startTime)
}

export const createAssociatedTokenAccountIx = (
  mint: PublicKey,
  associatedAccount: PublicKey,
  owner: PublicKey
): TransactionInstruction => createAssociatedTokenAccountInstruction(owner, associatedAccount, owner, mint)

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey | null> =>
  (
    await PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]

export const signAndSendRawTransaction = async (
  connection: Connection,
  transactionData: Transaction,
  wallet: WalletContextState,
  ...signers: Array<Signer>
): Promise<TransactionSignature | null> => {
  try {
    const tx = new Transaction().add(...transactionData.instructions)
    tx.recentBlockhash = (await connection.getLatestBlockhash('max')).blockhash
    tx.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey))
    const signedTx = await wallet.signTransaction(tx)
    const signature = await connection.sendRawTransaction(signedTx.serialize())
    return signature
  } catch (error) {
    console.error('signAndSendRawTransaction error', error)
    return null
  }
}

export const simulateTransaction = async (
  connection: Connection,
  transactionData: Transaction,
  wallet: WalletContextState,
  ...signers: Array<Signer>
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> => {
  const transaction = transactionData
  transaction.feePayer = wallet.publicKey
  transaction.recentBlockhash = (await connection.getLatestBlockhash('max')).blockhash

  signers.forEach((signer) => transaction.partialSign(signer))

  const sim = await connection.simulateTransaction(transaction)

  return sim
}

export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
): Promise<[string, number]> => {
  const [address, bump] = await PublicKey.findProgramAddress(seeds, programId)
  return [address.toBase58(), bump]
}

export const int64to8 = (n: number): Uint8Array => {
  const a = new BN(n)
  return a.toArrayLike(Buffer, 'le', 8)
}

export const bnTo8 = (bn: BN): Uint8Array => Buffer.from([...bn.toArray('le', 8)])

export const getNetworkConnectionText = (network: string): string =>
  network === NETWORK_CONSTANTS.DEVNET ? NETWORK_CONSTANTS.DEVNET_SDK : NETWORK_CONSTANTS.MAINNET_SDK

export const openLinkInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

export const getPriceObject = (str: string): string => {
  const arr = str.split(' ')
  return arr[0]
}
