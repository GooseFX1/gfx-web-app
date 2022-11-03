import React from 'react'
import { SuccessfulListingMsg, TransactionErrorMsg } from '../../components'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

interface Message {
  type?: string
  message: string | JSX.Element
}

export const successfulMessage = (
  msg: string,
  signature: string,
  price: string,
  name: string,
  network: WalletAdapterNetwork
): Message => ({
  message: (
    <SuccessfulListingMsg
      title={msg}
      itemName={`${name}`}
      supportText={`Stake of: ${price}`}
      tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
    />
  )
})
export const sslSuccessfulMessage = (
  signature: string,
  price: string | number,
  name: string,
  network: WalletAdapterNetwork,
  operation: string
): Message => ({
  message: (
    <SuccessfulListingMsg
      title={`${name} ${operation} sucessfull!`}
      itemName={`You ${operation} ${price} ${name}`}
      supportText={`Farm ${name}`}
      tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
    />
  )
})
export const errorHandlingMessage = (
  msg: string,
  name: string,
  supportTxt: string,
  signature: string,
  network: WalletAdapterNetwork
): Message => ({
  type: 'error',
  message: (
    <TransactionErrorMsg
      title={msg}
      itemName={`Stake ${name} Error`}
      supportText={supportTxt}
      tx_url={signature ? `https://solscan.io/tx/${signature}?cluster=${network}` : null}
    />
  )
})

export const sslErrorMessage = (
  name: string,
  supportTxt: string,
  signature: string,
  network: WalletAdapterNetwork,
  operation: string
): Message => ({
  type: 'error',
  message: (
    <TransactionErrorMsg
      title={`${operation} error!`}
      itemName={`${operation} ${name} Error`}
      supportText={supportTxt}
      tx_url={signature ? `https://solscan.io/tx/${signature}?cluster=${network}` : null}
    />
  )
})

export const insufficientSOLMsg = (): Message => ({
  type: 'error',
  message: 'You need minimum of 0.000001 SOL in your wallet to perform this transaction'
})

export const invalidInputErrMsg = (userTokenBalance: number, name: string): Message => ({
  type: 'error',
  message: `Please give valid input from 0.00001 to ${userTokenBalance?.toFixed(3)} ${name}`
})

export const genericErrMsg = (error: string): Message => ({
  type: 'error',
  message: error
})

export const Mint = `Mint`
export const Burn = `Burn`
export const Deposit = `Deposit`
export const Withdraw = `Withdraw`
export const StakeString = `Stake`
export const UnstakeString = 'Unstake and Cliam'
