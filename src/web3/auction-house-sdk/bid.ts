/* eslint-disable @typescript-eslint/no-unused-vars */

import { Connection, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction, TransactionInstruction } from '@solana/web3.js'

import { findOurAuctionHouse, getMetaplexInstance } from '../nfts/utils'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { currency, tokenSizeSDK } from './list'
import { toPublicKey } from '../ids'
import {
  SplTokenAmount,
  isSigner,
  Signer,
  toBigNumber,
  TransactionBuilder,
  CreateBidBuilderContext,
  Metaplex,
  Bid,
  AuctionHouse,
  NftWithToken,
  SftWithToken,
  Pda,
  PublicKey
} from '@metaplex-foundation/js'
import {
  createBuyInstruction,
  createPublicBuyInstruction,
  CancelInstructionAccounts,
  createCancelInstruction,
  createCancelBidReceiptInstruction,
  createPrintBidReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import {
  findAssociatedTokenAccountPda,
  findAuctionHouseBuyerEscrowPda,
  findAuctionHouseTradeStatePda,
  findBidReceiptPda,
  findMetadataPda
} from './pda'
import { INFTAsk, ISingleNFT } from '../../types/nft_details'
import { BuyInstructionAccounts } from '../auction-house'

export const constructBidInstruction = async (
  connection: Connection,
  wallet: WalletContextState,
  bidAmount: number,
  general: ISingleNFT
): Promise<Transaction> => {
  const metaplex = await getMetaplexInstance(connection, wallet)
  const auctionHouseClient = await metaplex.auctionHouse()
  const auctionHouse = await findOurAuctionHouse(metaplex)
  const buyer = wallet?.wallet?.adapter?.publicKey
  const token = tokenSizeSDK
  const authority = auctionHouse.authorityAddress
  const mintAccount = toPublicKey(general?.mint_address)
  const tokens = tokenSizeSDK
  const price: SplTokenAmount = {
    basisPoints: toBigNumber(bidAmount * LAMPORTS_PER_SOL_NUMBER),
    currency
  }
  const priceBasisPoint = price?.basisPoints ?? 0

  // Accounts.
  const metadata = await findMetadataPda(mintAccount)

  const paymentAccount = auctionHouse.isNative
    ? buyer
    : findAssociatedTokenAccountPda(auctionHouse.treasuryMint.address, toPublicKey(buyer))
  const escrowPayment = findAuctionHouseBuyerEscrowPda(auctionHouse.address, toPublicKey(buyer))
  const tokenAccount = toPublicKey(general?.token_account)
  const buyerTokenAccount = findAssociatedTokenAccountPda(mintAccount, toPublicKey(buyer))

  const buyerTradeState = findAuctionHouseTradeStatePda(
    auctionHouse.address,
    toPublicKey(buyer),
    auctionHouse.treasuryMint.address,
    mintAccount,
    price.basisPoints,
    tokens.basisPoints,
    tokenAccount
  )

  const accounts: Omit<BuyInstructionAccounts, 'tokenAccount'> = {
    wallet: toPublicKey(buyer),
    paymentAccount,
    transferAuthority: toPublicKey(buyer),
    treasuryMint: auctionHouse.treasuryMint.address,
    metadata,
    escrowPaymentAccount: escrowPayment,
    authority: toPublicKey(authority),
    auctionHouse: auctionHouse.address,
    auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    buyerTradeState
  }

  // Args.
  const args = {
    tradeStateBump: buyerTradeState.bump,
    escrowPaymentBump: escrowPayment.bump,
    buyerPrice: price.basisPoints,
    tokenSize: tokens.basisPoints
  }

  // Sell Instruction.
  const buyInstruction = tokenAccount
    ? createBuyInstruction({ ...accounts, tokenAccount }, args)
    : createPublicBuyInstruction({ ...accounts, tokenAccount: buyerTokenAccount }, args)

  // Signers.
  const buySigners = [buyer, authority].filter((input): input is Signer => !!input && isSigner(input))

  // Receipt.
  // Since createPrintBidReceiptInstruction can't deserialize createAuctioneerBuyInstruction due to a bug
  // Don't print Auctioneer Bid receipt for the time being.
  const shouldPrintReceipt = true
  const bookkeeper = metaplex.identity()
  const receipt = findBidReceiptPda(buyerTradeState)

  const builder = TransactionBuilder.make<CreateBidBuilderContext>().setContext({
    buyerTradeState,
    tokenAccount,
    metadata,
    buyer: toPublicKey(buyer),
    receipt: shouldPrintReceipt ? receipt : null,
    bookkeeper: shouldPrintReceipt ? bookkeeper.publicKey : null,
    price,
    tokens
  })
  // Create a TA for public bid if it doesn't exist
  if (!tokenAccount) {
    const account = await metaplex.rpc().getAccount(buyerTokenAccount)
    if (!account.exists) {
      builder.add(
        await metaplex
          .tokens()
          .builders()
          .createToken({
            mint: mintAccount,
            owner: toPublicKey(buyer)
          })
      )
    }
  }

  const tx = new Transaction()
  const printInstruction = createPrintBidReceiptInstruction(
    {
      receipt,
      bookkeeper: bookkeeper.publicKey,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY
    },
    { receiptBump: receipt.bump }
  )
  tx.add(buyInstruction)
  tx.add(printInstruction)

  return tx
}

export const constructCancelBidInstruction = async (
  connection: Connection,
  wallet: WalletContextState,
  general: ISingleNFT,
  buyerTradeState: [PublicKey, number]
): Promise<TransactionInstruction[]> => {
  const metaplex = await getMetaplexInstance(connection, wallet)

  const auctionHouse = await findOurAuctionHouse(metaplex)
  const { authorityAddress, address: auctionHouseAddress, feeAccountAddress } = auctionHouse

  const metadata = metaplex
    .nfts()
    .pdas()
    .metadata({
      mint: toPublicKey(general?.mint_address)
    })

  const receipt = findBidReceiptPda(buyerTradeState[0])

  const bid = await metaplex.auctionHouse().findBidByReceipt({
    auctionHouse,
    receiptAddress: receipt
  })
  const { asset, buyerAddress, tradeStateAddress, price, receiptAddress, tokens } = bid
  const tokenAccount = (asset as NftWithToken | SftWithToken).token.address

  const accounts: CancelInstructionAccounts = {
    wallet: buyerAddress,
    tokenAccount,
    tokenMint: asset.address,
    authority: authorityAddress,
    auctionHouse: auctionHouseAddress,
    auctionHouseFeeAccount: feeAccountAddress,
    tradeState: tradeStateAddress
  }

  const instruction: TransactionInstruction[] = []
  const args = {
    buyerPrice: price.basisPoints,
    tokenSize: tokens.basisPoints
  }

  instruction.push(createCancelInstruction(accounts, args))
  /* eslint-disable no-extra-boolean-cast */
  if (!!receiptAddress) {
    instruction.push(
      createCancelBidReceiptInstruction({
        receipt: receiptAddress as Pda,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY
      })
    )
  }

  return instruction
}
