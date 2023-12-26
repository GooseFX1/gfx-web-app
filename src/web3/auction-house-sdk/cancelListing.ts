import { Metaplex, SplTokenCurrency, walletAdapterIdentity } from '@metaplex-foundation/js'
import { AccountMeta, Connection, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { AH_FEE_ACCT, AUCTION_HOUSE, AUCTION_HOUSE_AUTHORITY, TREASURY_MINT } from '../ids'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { INFTAsk, ISingleNFT } from '../../types/nft_details'
import { CancelInstructionAccounts, createCancelInstruction } from '@metaplex-foundation/mpl-auction-house'
import { derivePNFTAccounts } from './list'
import { CancelInstructionArgs } from '../auction-house/generated/instructions'
import BN from 'bn.js'
import { tokenSize, tradeStatePDA } from '../../pages/NFTs/actions'
import { bnTo8 } from '../utils'

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

export const createRemoveAskIX = async (
  connection: Connection,
  wallet: WalletContextState,
  ask: INFTAsk,
  general: ISingleNFT,
  isPnft: boolean
): Promise<TransactionInstruction> => {
  const usrAddr: PublicKey = wallet?.wallet?.adapter?.publicKey
  if (!usrAddr) {
    console.log('no public key connected')
    return
  }
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))
  const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

  const curAskingPrice: BN = new BN(parseFloat(ask.buyer_price))
  const tradeState: [PublicKey, number] = await tradeStatePDA(
    usrAddr,
    ask?.auction_house_key ?? AUCTION_HOUSE,
    general.token_account,
    general.mint_address,
    TREASURY_MINT,
    bnTo8(curAskingPrice)
  )

  const cancelInstructionArgs: CancelInstructionArgs = {
    buyerPrice: curAskingPrice,
    tokenSize: tokenSize
  }
  const pnftAccounts = await derivePNFTAccounts(
    connection,
    wallet.publicKey,
    programAsSigner,
    new PublicKey(ask.token_account_mint_key)
  )

  let cancelAnchorRemainingAccounts: ICancelAnchorRemainingAccounts
  if (isPnft) {
    cancelAnchorRemainingAccounts = {
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
  }

  const cancelInstructionAccounts: CancelInstructionAccounts = {
    wallet: wallet?.wallet?.adapter?.publicKey,
    tokenAccount: new PublicKey(general.token_account),
    tokenMint: new PublicKey(general.mint_address),
    authority: new PublicKey(ask?.auction_house_authority ?? AUCTION_HOUSE_AUTHORITY),
    auctionHouse: new PublicKey(ask?.auction_house_key ?? AUCTION_HOUSE),
    auctionHouseFeeAccount: new PublicKey(ask?.auction_house_fee_account ?? AH_FEE_ACCT),
    tradeState: tradeState[0],
    anchorRemainingAccounts: isPnft ? Object.values(cancelAnchorRemainingAccounts) : null
  }

  const cancelIX: TransactionInstruction = await createCancelInstruction(
    cancelInstructionAccounts,
    cancelInstructionArgs
  )
  return cancelIX
}
