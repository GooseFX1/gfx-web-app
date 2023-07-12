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
import { TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token-v2'
import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  TokenDelegateRole
} from '@metaplex-foundation/mpl-token-metadata'
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction
  // SYSVAR_CLOCK_PUBKEY
} from '@solana/web3.js'
import { AUCTION_HOUSE, AUCTION_HOUSE_AUTHORITY, AUTH_PROGRAM_ID } from '../ids'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import {
  createSellInstruction,
  SellInstructionAccounts,
  createSellRemainingAccountsInstruction,
  SellRemainingAccountsInstructionAccounts,
  createPrintListingReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'
import { findTokenRecordPda, getEditionDataAccount, findDelegateRecordPda } from './pda'
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
  const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

  // const metadata = metaplex.nfts().pdas().metadata({
  //   mint: mintAccount
  // })

  const metadataAccount = await getMetadata(mintAccount.toBase58())
  const metadataObj = await connection.getAccountInfo(toPublicKey(metadataAccount))
  const metadataParsed = Metadata.deserialize(metadataObj.data)[0]

  const auctionHouse = await metaplex.auctionHouse().findByAddress({ address: toPublicKey(AUCTION_HOUSE) })

  const sellerTradeState = metaplex.auctionHouse().pdas().tradeState({
    auctionHouse: auctionHouse.address,
    wallet: seller,
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
      wallet: seller,
      treasuryMint: auctionHouse.treasuryMint.address,
      tokenMint: mintAccount,
      price: lamports(0).basisPoints,
      tokenSize: tokenSizeSDK.basisPoints,
      tokenAccount
    })

  const tokenRecord: PublicKey = findTokenRecordPda(mintAccount, tokenAccount)
  const editionAccount: PublicKey = (await getEditionDataAccount(mintAccount))[0]

  const tokenAccountInfo = await getAccount(connection, tokenAccount)
  console.log('Delegate Value', tokenAccountInfo.delegate)

  const delegateRecord = findDelegateRecordPda(
    mintAccount,
    TokenDelegateRole.Transfer,
    metadataParsed.updateAuthority,
    tokenAccountInfo.delegate
  )

  const accounts: SellInstructionAccounts = {
    wallet: seller,
    tokenAccount: tokenAccount,
    metadata: toPublicKey(metadataAccount),
    authority: toPublicKey(AUCTION_HOUSE_AUTHORITY),
    auctionHouse: auctionHouse.address,
    auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    sellerTradeState,
    freeSellerTradeState,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    programAsSigner: programAsSigner
  }

  const remainingAccounts: SellRemainingAccountsInstructionAccounts = {
    metadataProgram: TOKEN_METADATA_PROGRAM_ID,
    delegateRecord: delegateRecord,
    tokenRecord: tokenRecord,
    tokenMint: mintAccount,
    edition: editionAccount,
    // sellerBrokerWallet: SystemProgram.programId,
    authRulesProgram: AUTH_PROGRAM_ID,
    authRules: metadataParsed.programmableConfig?.ruleSet
      ? metadataParsed.programmableConfig.ruleSet
      : TOKEN_METADATA_PROGRAM_ID,
    sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY
    // clock: SYSVAR_CLOCK_PUBKEY
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
  // remaining accounts
  const remainingInstructions = createSellRemainingAccountsInstruction(remainingAccounts)

  // Make seller as signer since createSellInstruction don't assign a signer
  const signerKeyIndex = sellInstruction.keys.findIndex((key) => key.pubkey.equals(seller))
  sellInstruction.keys[signerKeyIndex].isSigner = true
  sellInstruction.keys[signerKeyIndex].isWritable = true

  console.log(sellInstruction, remainingInstructions)

  instructions.push(sellInstruction)
  instructions.push(remainingInstructions)

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
