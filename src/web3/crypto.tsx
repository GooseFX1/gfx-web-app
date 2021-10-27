import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { Market, OpenOrders } from '@project-serum/serum'
import { Order } from '@project-serum/serum/lib/market'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
import { IOrder } from '../context'

const cancelOrder = async (connection: Connection, market: Market, order: Order, wallet: any) => {
  if (!wallet.publicKey || !wallet.signTransaction) return

  const tx = new Transaction()

  tx.add(market.makeMatchOrdersTransaction(5))
  tx.add(await market.makeCancelOrderTransaction(connection, wallet.publicKey, order))
  tx.add(market.makeMatchOrdersTransaction(5))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const placeOrder = async (connection: Connection, market: Market, order: IOrder, wallet: any) => {
  if (!wallet.publicKey || !wallet.signTransaction) return

  const tx = new Transaction()

  const mint = order.side === 'buy' ? market.quoteMintAddress : market.baseMintAddress
  const payer = mint.equals(WRAPPED_SOL_MINT)
    ? wallet.publicKey
    : await findAssociatedTokenAddress(wallet.publicKey, mint)

  const receiverMint = order.side === 'buy' ? market.baseMintAddress : market.quoteMintAddress
  const receiverATA = await findAssociatedTokenAddress(wallet.publicKey, receiverMint)

  const { value } = await connection.getParsedAccountInfo(receiverATA)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(receiverMint, receiverATA, wallet.publicKey))
  }

  tx.add(market.makeMatchOrdersTransaction(5))

  const { transaction, signers } = await market.makePlaceOrderTransaction(connection, {
    owner: wallet.publicKey,
    payer,
    side: order.side,
    price: order.price,
    size: order.size,
    orderType: order.type
  })
  tx.add(transaction)
  tx.add(market.makeMatchOrdersTransaction(5))

  return await signAndSendRawTransaction(connection, tx, wallet, ...signers)
}

const settleFunds = async (connection: Connection, market: Market, openOrders: OpenOrders, wallet: any) => {
  if (!wallet.publicKey || !wallet.signTransaction) return

  const tx = new Transaction()

  const [[baseAccount], [quoteAccount]] = await Promise.all([
    market.findBaseTokenAccountsForOwner(connection, openOrders.owner),
    market.findQuoteTokenAccountsForOwner(connection, openOrders.owner)
  ])

  const getOrCreateOpenOrdersWallet = async (account: { pubkey: PublicKey }, mintAddress: PublicKey) => {
    let openOrdersWallet = account?.pubkey || (mintAddress.equals(WRAPPED_SOL_MINT) && wallet.publicKey)
    if (!openOrdersWallet) {
      openOrdersWallet = await findAssociatedTokenAddress(wallet.publicKey, mintAddress)
      tx.add(createAssociatedTokenAccountIx(mintAddress, openOrdersWallet, wallet.publicKey))
    }
    return openOrdersWallet
  }

  const baseWallet = await getOrCreateOpenOrdersWallet(baseAccount, market.baseMintAddress)
  const quoteWallet = await getOrCreateOpenOrdersWallet(quoteAccount, market.quoteMintAddress)

  const settleFundsTx = await market.makeSettleFundsTransaction(connection, openOrders, baseWallet, quoteWallet)
  const { signers, transaction } = settleFundsTx
  tx.add(transaction)

  return await signAndSendRawTransaction(connection, tx, wallet, ...signers)
}

export const crypto = {
  cancelOrder,
  placeOrder,
  settleFunds
}
