import React, { useState, useMemo, useEffect, useRef } from 'react'
import { MainButton, SuccessfulListingMsg, TransactionErrorMsg } from '../../components'

export const successfulMessage = (msg: string, signature: any, price: string, name: string, network: any) => ({
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
  signature: any,
  price: string | number,
  name: string,
  network: any,
  operation: string
) => ({
  message: (
    <SuccessfulListingMsg
      title={`${operation} sucessfull!`}
      itemName={`You ${operation} ${price} ${name}`}
      supportText={`Farm ${name}`}
      tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
    />
  )
})
export const errorHandlingMessage = (msg: string, name: string, supportTxt: string, signature: any, network: any) => ({
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

export const sslErrorMessage = (name: string, supportTxt: string, signature: any, network: any, operation: string) => ({
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

export const insufficientSOLMsg = () => ({
  type: 'error',
  message: 'You need minimum of 0.000001 SOL in your wallet to perform this transaction'
})

export const invalidInputErrMsg = (userTokenBalance: number, name: string) => ({
  type: 'error',
  message: `Please give valid input from 0.00001 to ${userTokenBalance.toFixed(3)} ${name}`
})

export const genericErrMsg = (error: string) => ({
  type: 'error',
  message: error
})
