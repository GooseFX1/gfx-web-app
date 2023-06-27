import { AuctionHouse, Metaplex, PublicKey, SolAmount, SplTokenAmount } from '@metaplex-foundation/js'
import { WithdrawInstructionAccounts, createWithdrawInstruction } from '@metaplex-foundation/mpl-auction-house'
import { TransactionInstruction } from '@solana/web3.js'

export function withdrawFromBuyerEscrow(
  metaplex: Metaplex,
  auctionHouse: AuctionHouse,
  buyer: PublicKey,
  amount: SolAmount | SplTokenAmount
): TransactionInstruction[] {
  const amountBasisPoint = amount.basisPoints

  const escrowPayment = metaplex.auctionHouse().pdas().buyerEscrow({
    auctionHouse: auctionHouse.address,
    buyer
  })

  const accounts: WithdrawInstructionAccounts = {
    wallet: buyer,
    receiptAccount: buyer,
    escrowPaymentAccount: escrowPayment,
    treasuryMint: auctionHouse.treasuryMint.address,
    authority: auctionHouse.authorityAddress,
    auctionHouse: auctionHouse.address,
    auctionHouseFeeAccount: auctionHouse.feeAccountAddress
  }

  const args = {
    escrowPaymentBump: escrowPayment.bump,
    amount: amountBasisPoint
  }

  const instructions: TransactionInstruction[] = []
  const withdrawInstruction = createWithdrawInstruction(accounts, args)

  const signerKeyIndex = withdrawInstruction.keys.findIndex((key) => key.pubkey.equals(buyer))

  withdrawInstruction.keys[signerKeyIndex].isSigner = true
  instructions.push(withdrawInstruction)

  return instructions
}
