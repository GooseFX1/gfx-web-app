import { PublicKey, Transaction, TransactionInstruction, Connection } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { notify } from '../../utils'
import apiClient from '../../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../../api/NFTs'
import {
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  AH_FEE_ACCT,
  toPublicKey,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  SellInstructionAccounts,
  BuyInstructionAccounts,
  WithdrawInstructionArgs,
  WithdrawInstructionAccounts,
  StringPublicKey,
  bnTo8
} from '../../web3'
import { ISingleNFT } from '../../types/nft_details.d'
import BN from 'bn.js'

export const tokenSize: BN = new BN(1)

export const tradeStatePDA = async (
  publicKey: PublicKey,
  general: ISingleNFT,
  buyerPrice: Uint8Array
): Promise<undefined | [PublicKey, number]> => {
  try {
    const pda = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        publicKey.toBuffer(),
        toPublicKey(AUCTION_HOUSE).toBuffer(),
        toPublicKey(general.token_account).toBuffer(),
        toPublicKey(TREASURY_MINT).toBuffer(),
        toPublicKey(general.mint_address).toBuffer(),
        buyerPrice,
        bnTo8(tokenSize)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )
    return pda
  } catch (err) {
    return undefined
  }
}

export const freeSellerTradeStatePDA = async (
  publicKey: PublicKey,
  general: ISingleNFT
): Promise<undefined | [PublicKey, number]> => {
  try {
    const pda = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        publicKey.toBuffer(),
        toPublicKey(AUCTION_HOUSE).toBuffer(),
        toPublicKey(general.token_account).toBuffer(),
        toPublicKey(TREASURY_MINT).toBuffer(),
        toPublicKey(general.mint_address).toBuffer(),
        bnTo8(new BN(0)),
        bnTo8(tokenSize)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    return pda
  } catch (err) {
    return undefined
  }
}

export const getSellInstructionAccounts = (
  publicKey: PublicKey,
  general: ISingleNFT,
  metaDataAccount: StringPublicKey,
  sTradeState: PublicKey,
  fsTradeState: PublicKey,
  programAsSignerPDA: PublicKey
): SellInstructionAccounts => ({
  wallet: publicKey,
  tokenAccount: new PublicKey(general.token_account),
  metadata: new PublicKey(metaDataAccount),
  authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
  auctionHouse: new PublicKey(AUCTION_HOUSE),
  auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
  sellerTradeState: sTradeState,
  freeSellerTradeState: fsTradeState,
  programAsSigner: programAsSignerPDA
})

export const getBuyInstructionAccounts = (
  publicKey: PublicKey,
  general: ISingleNFT,
  metaDataAccount: StringPublicKey,
  escrowPaymentAccount: PublicKey,
  buyerTradeState: PublicKey
): BuyInstructionAccounts => ({
  wallet: publicKey,
  paymentAccount: publicKey,
  transferAuthority: publicKey,
  treasuryMint: new PublicKey(TREASURY_MINT),
  tokenAccount: new PublicKey(general.token_account),
  metadata: new PublicKey(metaDataAccount),
  escrowPaymentAccount: escrowPaymentAccount,
  authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
  auctionHouse: new PublicKey(AUCTION_HOUSE),
  auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
  buyerTradeState: buyerTradeState
})

export const callCancelInstruction = async (
  wallet: WalletContextState,
  connection: Connection,
  general: ISingleNFT,
  tradeState: [PublicKey, number],
  buyerPrice: BN
) => {
  const cancelInstructionArgs: CancelInstructionArgs = {
    buyerPrice: buyerPrice,
    tokenSize: tokenSize
  }

  const cancelInstructionAccounts: CancelInstructionAccounts = {
    wallet: wallet.publicKey,
    tokenAccount: new PublicKey(general.token_account),
    tokenMint: new PublicKey(general.mint_address),
    authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
    auctionHouse: new PublicKey(AUCTION_HOUSE),
    auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
    tradeState: tradeState[0]
  }

  const cancelIX: TransactionInstruction = await createCancelInstruction(
    cancelInstructionAccounts,
    cancelInstructionArgs
  )

  const transaction = new Transaction().add(cancelIX)
  const signature = await wallet.sendTransaction(transaction, connection)
  console.log(signature)
  const confirm = await connection.confirmTransaction(signature, 'finalized')
  console.log(confirm)
  return { signature, confirm }
}

export const callWithdrawInstruction = async (wallet: PublicKey, escrow: [PublicKey, number], bidAmount: BN) => {
  const withdrawInstructionArgs: WithdrawInstructionArgs = {
    escrowPaymentBump: escrow[1],
    amount: bidAmount
  }

  const withdrawInstructionAccounts: WithdrawInstructionAccounts = {
    wallet: wallet,
    receiptAccount: wallet,
    escrowPaymentAccount: escrow[0],
    treasuryMint: new PublicKey(TREASURY_MINT),
    authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
    auctionHouse: new PublicKey(AUCTION_HOUSE),
    auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT)
  }

  return { withdrawInstructionAccounts, withdrawInstructionArgs }
}

export const deleteDraft = async (currentDraftId: string) => {
  try {
    const res = await apiClient(NFT_API_BASE).delete(`${NFT_API_ENDPOINTS.DRAFTS}`, {
      data: { draft_id: currentDraftId }
    })

    const result = await res.data
    notify({ type: 'success', message: 'Draft deleted', icon: 'success' })
    return result
  } catch (err) {
    console.log(err)
    notify({ type: 'error', message: 'Draft failed to delete', icon: 'error' }, err)
  }
}
