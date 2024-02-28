import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import useSolSub, { SubType } from '@/hooks/useSolSub'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { ADDRESSES as rewardAddresses } from 'goosefx-stake-rewards-sdk/dist/constants'
import { useConnectionConfig } from '@/context'
import { TokenAmount } from '@solana/web3.js'

type InitalState = Record<string, TokenAmount>

interface UseWalletBalanceReturn {
  balance: InitalState
}

const initialState: InitalState = {
  sol: {
    amount: '0.0',
    decimals: 0,
    uiAmount: 0.0,
    uiAmountString: '0.0'
  },
  gofx: {
    amount: '0.0',
    decimals: 0,
    uiAmount: 0.0,
    uiAmountString: '0.0'
  },
  usdc: {
    amount: '0.0',
    decimals: 0,
    uiAmount: 0.0,
    uiAmountString: '0.0'
  }
}

function useWalletBalance(): UseWalletBalanceReturn {
  const { wallet } = useWallet()
  const publicKey = wallet?.adapter?.publicKey
  const { network, connection } = useConnectionConfig()
  const { on, off } = useSolSub()
  const [balance, setBalance] = useState<InitalState>(initialState)

  useEffect(() => {
    if (!publicKey) return
    getInitialBalance()
    // subs
    const gofxId = 'user-gofx-balance'
    on({
      SubType: SubType.AccountChange,
      id: gofxId,
      callback: async () => {
        const currentNetwork =
          network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'
        const [address] = findProgramAddressSync(
          [
            publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            rewardAddresses[currentNetwork].GOFX_MINT.toBuffer()
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
        const balance = await connection.getTokenAccountBalance(address, 'confirmed')
        setBalance((prev) => ({ ...prev, gofx: balance.value }))
      },
      pubKeyRetrieval: () => {
        if (!publicKey) return null
        const currentNetwork =
          network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'
        const [address] = findProgramAddressSync(
          [
            publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            rewardAddresses[currentNetwork].GOFX_MINT.toBuffer()
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
        return address
      }
    })
    const usdcId = 'user-usdc-balance'
    on({
      SubType: SubType.AccountChange,
      id: usdcId,
      callback: async () => {
        const currentNetwork =
          network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'
        const [address] = findProgramAddressSync(
          [
            publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            rewardAddresses[currentNetwork].USDC_MINT.toBuffer()
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
        const balance = await connection.getTokenAccountBalance(address, 'confirmed')
        setBalance((prev) => ({ ...prev, usdc: balance.value }))
      },
      pubKeyRetrieval: () => {
        if (!publicKey) return null
        const currentNetwork =
          network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'
        const [address] = findProgramAddressSync(
          [
            publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            rewardAddresses[currentNetwork].USDC_MINT.toBuffer()
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
        return address
      }
    })

    const solId = 'user-sol-balance'
    on({
      SubType: SubType.AccountChange,
      id: solId,
      callback: async () => {
        const balance = await connection.getBalance(publicKey, 'confirmed')
        setBalance((prev) => ({ ...prev, sol: formatSolBalance(balance) }))
      },
      pubKeyRetrieval: () => publicKey
    })
    return () => {
      off(gofxId)
      off(usdcId)
      off(solId)
      return
    }
  }, [connection, network, publicKey])
  function formatSolBalance(balance: number) {
    return {
      amount: balance.toString(),
      decimals: 9,
      uiAmount: balance / 10 ** 9,
      uiAmountString: (balance / 10 ** 9).toFixed(2)
    }
  }
  async function getInitialBalance() {
    const results = await Promise.allSettled([
      connection.getBalance(publicKey, 'confirmed'),
      connection.getTokenAccountBalance(
        findProgramAddressSync(
          [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), rewardAddresses['MAINNET'].GOFX_MINT.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )[0],
        'confirmed'
      ),
      connection.getTokenAccountBalance(
        findProgramAddressSync(
          [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), rewardAddresses['MAINNET'].USDC_MINT.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        )[0],
        'confirmed'
      )
    ])
    const sol = results[0].status === 'fulfilled' ? formatSolBalance(results[0].value) : initialState.sol
    const gofx = results[1].status === 'fulfilled' ? results[1].value.value : initialState.gofx
    const usdc = results[2].status === 'fulfilled' ? results[2].value.value : initialState.usdc
    setBalance({ sol, gofx, usdc })
  }

  return {
    balance
  }
}

export default useWalletBalance
