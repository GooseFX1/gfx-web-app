import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AccountInfo, ParsedAccountData, PublicKey, RpcResponseAndContext, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { notify } from '@/utils'

interface UseTokenAccountReturn {
  walletPublicKey: PublicKey | null
  createTokenAccountIfNotExist: (
    mint: PublicKey,
    rest?: { allowOffCurve?: boolean; programId?: PublicKey; associatedTokenAddress?: PublicKey }
  ) => Promise<void>
  getAccountInfo: (
    mint: PublicKey,
    rest?: { allowOffCurve?: boolean; programId?: PublicKey; associatedTokenAddress?: PublicKey }
  ) => Promise<{
    tokenAccountInfo: RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData>>
    tokenAccount: PublicKey
  }>
}
// eslint-disable-line @typescript-eslint/no-unused-vars
export default function useTokenAccount(): UseTokenAccountReturn {
  const walletContext = useWallet()
  const { connection } = useConnection()
  const { wallet, sendTransaction } = walletContext
  const walletPublicKey = wallet?.adapter?.publicKey || null

  async function createTokenAccountIfNotExist(
    mint: PublicKey,
    rest?: {
      allowOffCurve?: boolean
      programId?: PublicKey
      associatedTokenAddress?: PublicKey
    }
  ) {
    if (!walletPublicKey) return
    const { tokenAccountInfo, tokenAccount } = await getAccountInfo(mint, rest)
    if (tokenAccountInfo.value === null) {
      const tx = await createAssociatedTokenAccountInstruction(
        walletPublicKey,
        tokenAccount,
        walletPublicKey,
        mint,
        rest?.programId,
        rest?.associatedTokenAddress
      )

      await sendTransaction(new Transaction().add(tx), connection)
        .then((sig) => {
          console.log(sig)
          notify({
            description: 'Transaction confirmed',
            message: 'Token account created'
          })
        })
        .catch((err) => {
          notify(
            {
              description: 'Error creating token account',
              message: 'Error'
            },
            err
          )
        })
    }
  }
  async function getAccountInfo(
    mint: PublicKey,
    rest?: {
      allowOffCurve?: boolean
      programId?: PublicKey
      associatedTokenAddress?: PublicKey
    }
  ) {
    if (!walletPublicKey) return { tokenAccountInfo: null, tokenAccount: null }
    const tokenAccount = getAssociatedTokenAddressSync(
      mint,
      walletPublicKey,
      rest?.allowOffCurve,
      rest?.programId,
      rest?.associatedTokenAddress
    )
    const tokenAccountInfo = await connection.getParsedAccountInfo(tokenAccount)
    return { tokenAccountInfo, tokenAccount }
  }
  return {
    walletPublicKey,
    createTokenAccountIfNotExist,
    getAccountInfo
  }
}
