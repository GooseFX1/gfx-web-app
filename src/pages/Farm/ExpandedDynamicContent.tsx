import React, { useState, useMemo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'

import {
  successfulMessage,
  errorHandlingMessage,
  genericErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage,
  insufficientSOLMsg,
  invalidInputErrMsg
} from './FarmClickHandler'
import { notify } from '../../utils'
import { useTokenRegistry, useAccounts, useConnectionConfig, useFarmContext } from '../../context'
import {
  executeStake,
  executeUnstakeAndClaim,
  executeDeposit,
  executeWithdraw,
  executeMint,
  executeBurn
} from '../../web3'
import { SSLButtons, StakeButtons } from './ExpandedButtons'
import DisplayRowData from './DisplayRowData'
import { TOKEN_NAMES } from '../../constants'
import tw from 'twin.macro'

//#region styles
const STYLED_EXPANDED_ROW = styled.div`
  ${tw`sm:pr-0 pl-0`}
  padding-bottom: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(2)};
  background: ${({ theme }) => theme.expendedRowBg};
  @media (max-width: 500px) {
    padding-right: 0;
  }
`

const STYLED_EXPANDED_CONTENT = styled.div`
  ${tw`flex flex-row items-center sm:block`}
`
//#endregion

interface IExpandedContent {
  rowData: any
  stakeProgram: Program | undefined
  SSLProgram: Program | undefined
  stakeAccountKey: PublicKey | undefined
  onExpandIcon: any
}

const DISPLAY_DECIMAL = 3

export const ExpandedDynamicContent = ({
  rowData,
  stakeProgram,
  SSLProgram,
  onExpandIcon,
  stakeAccountKey
}: IExpandedContent) => {
  const { name, earned, currentlyStaked, type } = rowData
  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  const { getTokenInfoForFarming } = useTokenRegistry()
  const { network } = useConnectionConfig()
  const wallet = useWallet()
  const { connection } = useConnectionConfig()
  const { counter, setCounter, setOperationPending } = useFarmContext()
  //loading indicators
  const [isStakeLoading, setIsStakeLoading] = useState<boolean>(false)
  const [isUnstakeLoading, setIsUnstakeLoading] = useState<boolean>(false)
  const [isWithdrawLoading, setWithdrawLoading] = useState<boolean>(false)
  const [isMintLoading, setMintLoading] = useState<boolean>(false)
  const [isBurnLoading, setBurnLoading] = useState<boolean>(false)
  const [userSOLBalance, setSOLBalance] = useState<number>()
  const [tokenStaked, setTokenStaked] = useState<number>(parseFloat(currentlyStaked))
  const [tokenEarned, setTokenEarned] = useState<number>(parseFloat(earned))

  const stakeRef = useRef(null)
  const unstakeRef = useRef(null)

  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey, network, counter])
  useEffect(() => {
    if (wallet.publicKey && name === TOKEN_NAMES.SOL) {
      const SOL = connection.getAccountInfo(wallet.publicKey)
      SOL.then((res) => setSOLBalance(res.lamports / LAMPORTS_PER_SOL)).catch((err) => console.log(err))
    }
  }, [counter, getUIAmount, wallet.publicKey, userSOLBalance])

  let userTokenBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo, getUIAmount, publicKey]
  )

  const getSuccessUnstakeMsg = (): string => `Successfully Unstaked amount of ${unstakeRef.current.value} ${name}!`
  const getSuccessStakeMsg = (): string => `Successfully staked amount of ${stakeRef.current.value} ${name}!`
  const getErrStakeMsg = (): string => `Staking ${name} error!`
  const getErrUntakeMsg = (): string => `Unstaking ${name} error!`
  const Mint = `Mint`
  const Burn = `Burn`
  const Deposit = `Deposit`
  const Withdraw = `Withdraw`
  //const youDeposit

  useEffect(() => {
    setTokenStaked(parseFloat(currentlyStaked))
    setTokenEarned(Math.abs(parseFloat(earned)))
    return null
  }, [earned, currentlyStaked])

  useEffect(() => {
    setOperationPending(isMintLoading || isBurnLoading || isStakeLoading || isUnstakeLoading || isWithdrawLoading)
  }, [isMintLoading, isBurnLoading, isStakeLoading, isUnstakeLoading, isWithdrawLoading])

  const updateStakedValue = () => {
    setTokenStaked((prev) => prev + parseFloat(stakeRef.current.value))
  }

  const enoughSOLInWallet = (): boolean => {
    if (userSOLBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }

  const checkBasicConditions = (amt?: number | undefined): boolean => {
    if (!enoughSOLInWallet()) return true
    if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
    if (
      isNaN(parseFloat(stakeRef.current.value)) ||
      parseFloat(stakeRef.current.value) < 0.000001 ||
      parseFloat(stakeRef.current.value) > parseFloat(userTokenBalance.toFixed(3))
    ) {
      stakeRef.current.value = 0
      notify(invalidInputErrMsg(amt >= 0 ? amt : userTokenBalance, name))
      return true
    }
    return false
  }

  const onClickMint = (availableToMint: number): void => {
    setMintLoading(true)
    let amount = parseFloat(unstakeRef.current.value)
    if (parseFloat(availableToMint.toFixed(3)) == parseFloat(unstakeRef.current.value)) amount = availableToMint
    try {
      executeMint(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setMintLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeRef.current.value, name, network, Mint))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error?.message, signature, network, Mint))
          return
        }
      })
    } catch (err) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(err))
    }
  }
  const onClickBurn = (): void => {
    const amount = parseFloat(unstakeRef.current.value)
    setBurnLoading(true)
    try {
      executeBurn(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setBurnLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeRef.current.value, name, network, Burn))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error?.message, signature, network, Burn))
          return
        }
      })
    } catch (err) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(err))
    }
  }
  const onClickWithdraw = (amount: number): void => {
    setWithdrawLoading(true)

    try {
      executeWithdraw(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setWithdrawLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeRef.current.value, name, network, Withdraw))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error?.message, signature, network, Withdraw))
          return
        }
      })
    } catch (err) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(err))
    }
  }
  const onClickDeposit = (): void => {
    if (checkBasicConditions()) return
    let amount = parseFloat(stakeRef.current.value)
    if (amount === parseFloat(userTokenBalance.toFixed(3))) amount = userTokenBalance
    try {
      setIsStakeLoading(true)
      const confirm = executeDeposit(SSLProgram, wallet, connection, network, amount, name)
      confirm.then((con) => {
        setIsStakeLoading(false)
        //@ts-ignore
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, amount, name, network, Deposit))
          updateStakedValue()
          setTimeout(() => (stakeRef.current.value = 0), 500)
          setCounter((prev) => prev + 1)
        } else {
          //@ts-ignore
          const { signature, error } = con
          notify(sslErrorMessage(name, error?.message, signature, network, Deposit))
          return
        }
      })
    } catch (error) {
      setIsStakeLoading(false)
      notify(genericErrMsg(error))
    }
  }
  const onClickStake = (): void => {
    if (checkBasicConditions()) return
    try {
      setIsStakeLoading(true)
      let amount = parseFloat(stakeRef.current.value)
      if (amount === parseFloat(userTokenBalance.toFixed(3))) amount = userTokenBalance
      const confirm = executeStake(stakeProgram, stakeAccountKey, wallet, connection, network, amount)
      confirm.then((con) => {
        setIsStakeLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(successfulMessage(getSuccessStakeMsg(), signature, stakeRef.current.value, name, network))
          updateStakedValue()
          setCounter((prev) => prev + 1)
          setTimeout(() => (stakeRef.current.value = 0), 500)
        } else {
          const { signature, error } = con
          notify(errorHandlingMessage(getErrStakeMsg(), name, error?.message, signature, network))
          return
        }
      })
    } catch (error) {
      setIsStakeLoading(false)
      notify(genericErrMsg(error))
    }
  }

  const onClickUnstake = (): void => {
    const tokenStakedPlusEarned = tokenStaked + tokenEarned
    if (
      isNaN(parseFloat(unstakeRef.current.value)) ||
      parseFloat(unstakeRef.current.value) < 0.01 ||
      parseFloat(unstakeRef.current.value) > parseFloat(tokenStakedPlusEarned.toFixed(DISPLAY_DECIMAL))
    ) {
      unstakeRef.current.value = 0
      notify(invalidInputErrMsg(tokenStaked + tokenEarned, name))
      return
    }
    if (!enoughSOLInWallet()) return
    try {
      setIsUnstakeLoading(true)
      const tokenInPercent = tokenStakedPlusEarned
        ? (parseFloat(unstakeRef.current.value) / parseFloat(tokenStakedPlusEarned.toFixed(DISPLAY_DECIMAL))) * 100
        : 0
      const confirm = executeUnstakeAndClaim(
        stakeProgram,
        stakeAccountKey,
        wallet,
        connection,
        network,
        tokenInPercent
      )
      confirm.then((con) => {
        const { confirm, signature } = con
        setIsUnstakeLoading(false)
        if (confirm && confirm?.value && confirm.value.err === null) {
          updateStakedValue()
          notify(successfulMessage(getSuccessUnstakeMsg(), signature, unstakeRef.current.value, name, network))
          setCounter((prev) => prev + 1)
          if (parseFloat(unstakeRef.current.value) > tokenStaked) {
            const val = tokenEarned - (parseFloat(unstakeRef.current.value) - tokenStaked)
            setTokenEarned(val <= 0 ? 0 : val)
          }
          const remainingToken = tokenStaked - parseFloat(unstakeRef.current.value)
          setTokenStaked(remainingToken > 0 ? remainingToken : 0)
          setTimeout(() => (unstakeRef.current.value = 0), 1000)
        } else {
          const { signature, error } = con
          notify(errorHandlingMessage(getErrUntakeMsg(), name, error?.message, signature, network))
          return
        }
      })
    } catch (error) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(error))
    }
  }
  const onClickHalf = (buttonId: string): void => {
    if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
    if (buttonId === 'stake') stakeRef.current.value = (userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)
    else unstakeRef.current.value = ((tokenStaked + tokenEarned) / 2).toFixed(DISPLAY_DECIMAL)
  }
  const onClickMax = (buttonId: string): void => {
    //add focus element
    if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
    if (buttonId === 'stake') {
      stakeRef.current.value = userTokenBalance.toFixed(DISPLAY_DECIMAL)
    } else {
      unstakeRef.current.value = (tokenStaked + tokenEarned).toFixed(DISPLAY_DECIMAL)
    }
  }
  return (
    <STYLED_EXPANDED_ROW>
      <div>
        <DisplayRowData rowData={rowData} onExpandIcon={onExpandIcon} />

        <STYLED_EXPANDED_CONTENT>
          {type === 'SSL' ? (
            <SSLButtons
              name={name.toString()}
              wallet={wallet}
              stakeRef={stakeRef}
              unstakeRef={unstakeRef}
              onClickDeposit={onClickDeposit}
              onClickWithdraw={onClickWithdraw}
              onClickMint={onClickMint}
              onClickBurn={onClickBurn}
              isStakeLoading={isStakeLoading}
              isWithdrawLoading={isWithdrawLoading}
              isMintLoading={isMintLoading}
              userSOLBalance={userSOLBalance}
              isBurnLoading={isBurnLoading}
              isUnstakeLoading={isUnstakeLoading}
              rowData={rowData}
            />
          ) : (
            <StakeButtons
              name={name?.toString()}
              wallet={wallet}
              stakeRef={stakeRef}
              unstakeRef={unstakeRef}
              onClickHalf={onClickHalf}
              onClickMax={onClickMax}
              isStakeLoading={isStakeLoading}
              isUnstakeLoading={isUnstakeLoading}
              onClickStake={onClickStake}
              onClickUnstake={onClickUnstake}
              rowData={rowData}
            />
          )}
        </STYLED_EXPANDED_CONTENT>
      </div>
    </STYLED_EXPANDED_ROW>
  )
}
