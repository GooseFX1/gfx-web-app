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
import { TOKEN_PROGRAM_ID } from '@solana/spl-token-v2'
import { Metadata, PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import {
  AccountMeta,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction
} from '@solana/web3.js'
import { AUCTION_HOUSE, AUCTION_HOUSE_AUTHORITY } from '../ids'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import {
  createSellInstruction,
  SellInstructionAccounts,
  createPrintListingReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'
import { getMetadata } from '../nfts/metadata'
import { findTokenRecordPda, getAssociatedTokenAddressSync } from './pda'

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
  printReceipt: boolean,
  isPnft: boolean
): Promise<TransactionInstruction[]> => {
  const price: SplTokenAmount = {
    basisPoints: toBigNumber(amount * LAMPORTS_PER_SOL_NUMBER),
    currency
  }
  const seller = wallet?.wallet?.adapter?.publicKey

  const metaplex: Metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))
  const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

  const metadataAccount = await getMetadata(mintAccount.toBase58())

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
  let sellRemainingAccounts: ISellAnchorRemainingAccounts
  if (isPnft) {
    const pnftAccounts = await derivePNFTAccounts(connection, seller, programAsSigner, mintAccount)

    sellRemainingAccounts = {
      metadataProgram: pnftAccounts.metadataProgram,
      delegateRecord: pnftAccounts.delegateRecord,
      tokenRecord: pnftAccounts.tokenRecord,
      tokenMint: pnftAccounts.tokenMint,
      edition: pnftAccounts.edition,
      authRulesProgram: pnftAccounts.authRulesProgram,
      authRules: pnftAccounts.authRules,
      sysvarInstructions: pnftAccounts.sysvarInstructions
    }
  }

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
    programAsSigner: programAsSigner,
    anchorRemainingAccounts: isPnft ? Object.values(sellRemainingAccounts) : null
  }

  const args = {
    tradeStateBump: sellerTradeState.bump,
    freeTradeStateBump: freeSellerTradeState.bump,
    programAsSignerBump: programAsSigner.bump,
    buyerPrice: price.basisPoints,
    tokenSize: tokenSizeSDK.basisPoints
  }
  const additionalComputeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 })
  const instructions: TransactionInstruction[] = []

  const sellInstruction = createSellInstruction(accounts, args)

  /** We should set metadata account as writable for pnfts, when we do createSellInstruction for normal nfts,
   *  the metadata is set to be non writable **/
  if (isPnft) sellInstruction.keys.at(2).isWritable = true

  // Make seller as signer since createSellInstruction don't assign a signer
  const signerKeyIndex = sellInstruction.keys.findIndex((key) => key.pubkey.equals(seller))
  sellInstruction.keys[signerKeyIndex].isSigner = true
  sellInstruction.keys[signerKeyIndex].isWritable = true

  if (isPnft) instructions.push(additionalComputeBudgetInstruction)
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

const TOKEN_AUTH_RULES_ID = new PublicKey('auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg')

export const getMasterEditionAccount = (mint: PublicKey): PublicKey =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition', 'utf8')
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]

export function findDelegateRecordPdas(
  collectionMint: PublicKey,
  payer: PublicKey,
  delegate: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
      Buffer.from('programmable_config_delegate'),
      payer.toBuffer(),
      delegate.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]
}

interface ISellAnchorRemainingAccounts {
  metadataProgram: AccountMeta
  delegateRecord: AccountMeta
  tokenRecord: AccountMeta
  tokenMint: AccountMeta
  edition: AccountMeta
  authRulesProgram: AccountMeta
  authRules: AccountMeta
  sysvarInstructions: AccountMeta
}

interface IPNFTAccounts {
  metadataProgram: AccountMeta
  delegateRecord: AccountMeta
  tokenRecord: AccountMeta
  tokenMint: AccountMeta
  edition: AccountMeta
  authRulesProgram: AccountMeta
  authRules: AccountMeta
  sysvarInstructions: AccountMeta
  programAsSigner: AccountMeta
  systemProgram: AccountMeta
  sellerTokenRecord: AccountMeta
  metadataAccount: AccountMeta
}

export const derivePNFTAccounts = async (
  connection: Connection,
  wallet: PublicKey,
  programAsSigner: PublicKey,
  mint: PublicKey,
  seller?: PublicKey
): Promise<IPNFTAccounts> => {
  const metadataAccount = await getMetadata(mint.toBase58())
  const metadata = await Metadata.fromAccountAddress(connection, toPublicKey(metadataAccount))
  const associatedTokenAccount = getAssociatedTokenAddressSync(mint, wallet)
  const tokenRecord = findTokenRecordPda(mint, associatedTokenAccount)
  const masterEdition = getMasterEditionAccount(mint)
  const authRules = metadata.programmableConfig?.ruleSet
  const pasAssociatedTokenAccount = getAssociatedTokenAddressSync(mint, programAsSigner, true)
  const delegateRecord = findTokenRecordPda(mint, pasAssociatedTokenAccount)
  let sellerTokenRecord = TOKEN_METADATA_PROGRAM_ID

  if (seller) {
    const sellerAssociatedTokenAccount = getAssociatedTokenAddressSync(mint, seller)
    sellerTokenRecord = findTokenRecordPda(mint, sellerAssociatedTokenAccount)
  }

  return {
    metadataProgram: {
      isSigner: false,
      isWritable: false,
      pubkey: TOKEN_METADATA_PROGRAM_ID
    },
    delegateRecord: {
      isSigner: false,
      isWritable: true,
      pubkey: delegateRecord ?? tokenRecord
    },
    tokenRecord: {
      isSigner: false,
      isWritable: true,
      pubkey: tokenRecord
    },
    tokenMint: {
      isSigner: false,
      isWritable: false,
      pubkey: mint
    },
    edition: {
      isSigner: false,
      isWritable: false,
      pubkey: masterEdition
    },
    authRulesProgram: {
      isSigner: false,
      isWritable: false,
      pubkey: TOKEN_AUTH_RULES_ID
    },
    authRules: {
      isSigner: false,
      isWritable: false,
      pubkey: authRules ?? TOKEN_METADATA_PROGRAM_ID
    },
    sysvarInstructions: {
      isSigner: false,
      isWritable: false,
      pubkey: SYSVAR_INSTRUCTIONS_PUBKEY
    },
    programAsSigner: {
      isSigner: false,
      isWritable: false,
      pubkey: programAsSigner
    },
    systemProgram: {
      isSigner: false,
      isWritable: false,
      pubkey: SystemProgram.programId
    },
    sellerTokenRecord: {
      isSigner: false,
      isWritable: true,
      pubkey: sellerTokenRecord
    },
    metadataAccount: {
      isSigner: false,
      isWritable: true,
      pubkey: toPublicKey(metadataAccount)
    }
  }
}
