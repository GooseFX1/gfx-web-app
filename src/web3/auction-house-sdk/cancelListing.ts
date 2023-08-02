import { Metaplex, Pda, SplTokenCurrency, toPublicKey, walletAdapterIdentity } from '@metaplex-foundation/js'
import {
  AccountMeta,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction
} from '@solana/web3.js'
import { AUCTION_HOUSE } from '../ids'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { INFTAsk } from '../../types/nft_details'
import {
  CancelInstructionAccounts,
  createCancelInstruction,
  createCancelListingReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'
import { derivePNFTAccounts } from './list'

export const currency: SplTokenCurrency = {
  symbol: 'SOL',
  decimals: 9,
  namespace: 'spl-token'
}

interface ICancelAnchorRemainingAccounts {
  metadataProgram: AccountMeta
  delegateRecord: AccountMeta
  programAsSigner: AccountMeta
  metadataAccount: AccountMeta
  edition: AccountMeta
  tokenRecord: AccountMeta
  tokenMint: AccountMeta
  authRulesProgram: AccountMeta
  authRules: AccountMeta
  sysvarInstructions: AccountMeta
  systemProgram: AccountMeta
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

    const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

    const pnftAccounts = await derivePNFTAccounts(
      connection,
      wallet.publicKey,
      programAsSigner,
      new PublicKey(ask.token_account_mint_key)
    )

    const cancelAnchorRemainingAccounts: ICancelAnchorRemainingAccounts = {
      metadataProgram: pnftAccounts.metadataProgram,
      delegateRecord: pnftAccounts.delegateRecord,
      programAsSigner: pnftAccounts.programAsSigner,
      metadataAccount: pnftAccounts.metadataAccount,
      edition: pnftAccounts.edition,
      tokenRecord: pnftAccounts.tokenRecord,
      tokenMint: pnftAccounts.tokenMint,
      authRulesProgram: pnftAccounts.authRulesProgram,
      authRules: pnftAccounts.authRules,
      sysvarInstructions: pnftAccounts.sysvarInstructions,
      systemProgram: pnftAccounts.systemProgram
    }

    const additionalComputeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 })

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
      tradeState: tradeStateAddress,
      anchorRemainingAccounts: Object.values(cancelAnchorRemainingAccounts)
    }

    const args = {
      buyerPrice: price.basisPoints,
      tokenSize: tokens.basisPoints
    }

    const instructions: TransactionInstruction[] = []
    instructions.push(additionalComputeBudgetInstruction)
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
