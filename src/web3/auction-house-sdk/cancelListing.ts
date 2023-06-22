/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Metaplex,
  Pda,
  SplTokenAmount,
  SplTokenCurrency,
  toBigNumber,
  toPublicKey,
  walletAdapterIdentity
} from '@metaplex-foundation/js'
import { Connection, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, TransactionInstruction } from '@solana/web3.js'
import { AUCTION_HOUSE } from '../ids'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { INFTAsk } from '../../types/nft_details'
import {
  CancelInstructionAccounts,
  createCancelInstruction,
  createCancelListingReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'

export const currency: SplTokenCurrency = {
  symbol: 'SOL',
  decimals: 9,
  namespace: 'spl-token'
}

export const cancelListing = async (
  connection: Connection,
  wallet: WalletContextState,
  ask: INFTAsk
): Promise<TransactionInstruction[]> => {
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))
  const auctionHouseClient = metaplex.auctionHouse()

  try {
    const auctionHouse = await auctionHouseClient.findByAddress({
      address: new PublicKey(AUCTION_HOUSE)
    })

    const listing = await auctionHouseClient.findListingByTradeState({
      auctionHouse,
      tradeStateAddress: toPublicKey(ask?.seller_trade_state)
    })

    const { asset, sellerAddress, receiptAddress, tradeStateAddress, price, tokens } = listing
    const { address, authorityAddress, feeAccountAddress } = auctionHouse
    const accounts: CancelInstructionAccounts = {
      wallet: sellerAddress,
      tokenAccount: asset.token.address,
      tokenMint: asset.address,
      authority: authorityAddress,
      auctionHouse: address,
      auctionHouseFeeAccount: feeAccountAddress,
      tradeState: tradeStateAddress
    }

    const args = {
      buyerPrice: price.basisPoints,
      tokenSize: tokens.basisPoints
    }
    const instructions: TransactionInstruction[] = []
    instructions.push(createCancelInstruction(accounts, args))

    /* eslint-disable no-extra-boolean-cast */
    if (!!receiptAddress) {
      instructions.push(
        createCancelListingReceiptInstruction({
          receipt: receiptAddress as Pda,
          instruction: SYSVAR_INSTRUCTIONS_PUBKEY
        })
      )
    }

    return instructions
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}
