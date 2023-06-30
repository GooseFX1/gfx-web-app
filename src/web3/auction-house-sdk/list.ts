import {
  Metaplex,
  SplTokenAmount,
  SplTokenCurrency,
  lamports,
  toBigNumber,
  toPublicKey,
  token,
  walletAdapterIdentity
} from '@metaplex-foundation/js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Metadata, PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction,
  SYSVAR_CLOCK_PUBKEY
} from '@solana/web3.js'
import { AUCTION_HOUSE, AUCTION_HOUSE_AUTHORITY, AUTH_PROGRAM_ID } from '../ids'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import {
  createSellInstruction,
  createPrintListingReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'
import { getAtaForMint, findTokenRecordPda, getEditionDataAccount } from './pda'
import { getMetadata } from '../nfts/metadata'

export const currency: SplTokenCurrency = {
  symbol: 'SOL',
  decimals: 9,
  namespace: 'spl-token'
}

export const tokenSizeSDK = token(1, 0)
export const constructListInstruction = async (
  connection: Connection,
  wallet: WalletContextState,
  mintAccount: PublicKey,
  tokenAccount: PublicKey,
  amount: number,
  printReceipt: boolean
): Promise<TransactionInstruction[]> => {
  const price: SplTokenAmount = {
    basisPoints: toBigNumber(amount * LAMPORTS_PER_SOL_NUMBER),
    currency
  }

  const seller = wallet?.wallet?.adapter?.publicKey
  const metaplex: Metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))

  const findOurAuctionHouse = async (): Promise<any> =>
    metaplex.auctionHouse().findByAddress({ address: toPublicKey(AUCTION_HOUSE) })

  const metadata = metaplex.nfts().pdas().metadata({
    mint: mintAccount
  })

  const metadataAccount = await getMetadata(mintAccount.toBase58())

  const metadataObj = await connection.getAccountInfo(toPublicKey(metadataAccount))

  const metadataParsed = Metadata.deserialize(metadataObj.data)[0]

  const auctionHouse = await findOurAuctionHouse()
  const sellerTradeState = metaplex.auctionHouse().pdas().tradeState({
    auctionHouse: auctionHouse.address,
    wallet: wallet?.wallet?.adapter?.publicKey,
    treasuryMint: auctionHouse.treasuryMint.address,
    tokenMint: mintAccount,
    price: price.basisPoints,
    tokenSize: tokenSizeSDK.basisPoints,
    tokenAccount
  })

  const freeSellerTradeState = metaplex
    .auctionHouse()
    .pdas()
    .tradeState({
      auctionHouse: auctionHouse.address,
      wallet: wallet?.wallet?.adapter?.publicKey,
      treasuryMint: auctionHouse.treasuryMint.address,
      tokenMint: mintAccount,
      price: lamports(0).basisPoints,
      tokenSize: tokenSizeSDK.basisPoints,
      tokenAccount
    })

  const tokenAccountKey: PublicKey = (await getAtaForMint(mintAccount, seller))[0]
  const tokenRecord = findTokenRecordPda(mintAccount, tokenAccountKey)
  const editionAccount: PublicKey = (await getEditionDataAccount(mintAccount))[0]

  const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

  const accounts = {
    wallet: seller,
    tokenAccount,
    metadata,
    authority: toPublicKey(AUCTION_HOUSE_AUTHORITY),
    auctionHouse: auctionHouse.address,
    auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    sellerTradeState,
    freeSellerTradeState,
    programAsSigner,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    metadataProgram: TOKEN_METADATA_PROGRAM_ID,
    instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    tokenRecord: tokenRecord,
    editionAccount: editionAccount,
    authorizationRules: metadataParsed.programmableConfig?.ruleSet
      ? metadataParsed.programmableConfig.ruleSet
      : TOKEN_METADATA_PROGRAM_ID,
    mplTokenAuthRulesProgram: AUTH_PROGRAM_ID,
    clock: SYSVAR_CLOCK_PUBKEY
  }

  const args = {
    tradeStateBump: sellerTradeState.bump,
    freeTradeStateBump: freeSellerTradeState.bump,
    programAsSignerBump: programAsSigner.bump,
    buyerPrice: price.basisPoints,
    tokenSize: tokenSizeSDK.basisPoints
  }
  const instructions: TransactionInstruction[] = []

  // Sell Instruction.
  const sellInstruction = createSellInstruction(accounts, args)

  // Make seller as signer since createSellInstruction don't assign a signer
  const signerKeyIndex = sellInstruction.keys.findIndex((key) => key.pubkey.equals(seller))
  sellInstruction.keys[signerKeyIndex].isSigner = true
  sellInstruction.keys[signerKeyIndex].isWritable = true

  instructions.push(sellInstruction)

  if (printReceipt) {
    const receipt = metaplex.auctionHouse().pdas().listingReceipt({
      tradeState: sellerTradeState
    })

    instructions.push(
      createPrintListingReceiptInstruction(
        {
          receipt,
          bookkeeper: seller,
          instruction: SYSVAR_INSTRUCTIONS_PUBKEY
        },
        { receiptBump: receipt.bump }
      )
    )
  }

  return instructions
}
