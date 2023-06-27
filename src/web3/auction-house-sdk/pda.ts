import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, PublicKeyInitData, Transaction } from '@solana/web3.js'
import { AUCTION_HOUSE, AUCTION_HOUSE_PROGRAM_ID, toPublicKey } from '../ids'
import { BigNumber } from '@metaplex-foundation/js'
import { programIds } from '../programIds'

export class Pda extends PublicKey {
  /** The bump used to generate the PDA. */
  public readonly bump: number

  constructor(value: PublicKeyInitData, bump: number) {
    super(value)
    this.bump = bump
  }

  static find(programId: PublicKey, seeds: Array<Buffer | Uint8Array>): Pda {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(seeds, programId)

    return new Pda(publicKey, bump)
  }
}

export const findAssociatedTokenAccountPda = (
  mint: PublicKey,
  owner: PublicKey,
  tokenProgramId: PublicKey = TOKEN_PROGRAM_ID,
  associatedTokenProgramId: PublicKey = ASSOCIATED_TOKEN_PROGRAM_ID
): Pda => Pda.find(associatedTokenProgramId, [owner.toBuffer(), tokenProgramId.toBuffer(), mint.toBuffer()])

/** @group Pdas */
export const findAuctionHouseBuyerEscrowPda = (
  auctionHouse: PublicKey,
  buyer: PublicKey,
  programId: PublicKey = toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
): Pda => Pda.find(programId, [Buffer.from('auction_house', 'utf8'), auctionHouse.toBuffer(), buyer.toBuffer()])

export const findAuctionHouseTradeStatePda = (
  auctionHouse: PublicKey,
  wallet: PublicKey,
  treasuryMint: PublicKey,
  tokenMint: PublicKey,
  buyPrice: BigNumber,
  tokenSize: BigNumber,
  tokenAccount?: PublicKey,
  programId: PublicKey = toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
): Pda =>
  Pda.find(programId, [
    Buffer.from('auction_house', 'utf8'),
    wallet.toBuffer(),
    auctionHouse.toBuffer(),
    ...(tokenAccount ? [tokenAccount.toBuffer()] : []),
    treasuryMint.toBuffer(),
    tokenMint.toBuffer(),
    buyPrice.toArrayLike(Buffer, 'le', 8),
    tokenSize.toArrayLike(Buffer, 'le', 8)
  ])

export type Signer = KeypairSigner | IdentitySigner

export type KeypairSigner = {
  publicKey: PublicKey
  secretKey: Uint8Array
}

export type IdentitySigner = {
  publicKey: PublicKey
  signMessage(message: Uint8Array): Promise<Uint8Array>
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export const isSigner = (input: Signer | any): input is Signer =>
  typeof input === 'object' && 'publicKey' in input && ('secretKey' in input || 'signTransaction' in input)

export const findBidReceiptPda = (tradeState: PublicKey, programId: PublicKey = toPublicKey(AUCTION_HOUSE)): Pda =>
  Pda.find(programId, [Buffer.from('bid_receipt', 'utf8'), tradeState.toBuffer()])

export const findMetadataPda = (mint: PublicKey): Pda => {
  const PROGRAM_IDS = programIds()
  const programId = toPublicKey(PROGRAM_IDS.metadata)
  return Pda.find(programId, [Buffer.from('metadata', 'utf8'), programId.toBuffer(), mint.toBuffer()])
}
