import React, { useState, useMemo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'
import { MainButton } from '../../components'
import { Connect } from '../../layouts/App/Connect'
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
import { Collapse } from 'antd'
import { SSLButtons, StakeButtons } from './ExpandedButtons'
import DisplayRowData from './DisplayRowData'

//#region styles
const STYLED_EXPANDED_ROW = styled.div`
  padding-bottom: ${({ theme }) => theme.margin(4)};
  padding-left: ${({ theme }) => theme.margin(0)};
  padding-right: ${({ theme }) => theme.margin(2)};
  background: ${({ theme }) => theme.expendedRowBg};
`

const STYLED_EXPANDED_CONTENT = styled.div`
  display: flex;
  align-items: center;
`
const STYLED_LEFT_CONTENT = styled.div`
  width: 23%;
  &.connected {
    width: 20%;
  }
  .left-inner {
    display: flex;
    align-items: center;
  }
  &.disconnected {
    .left-inner {
      max-width: 270px;
    }
  }
  .farm-logo {
    width: 60px;
    height: 60px;
  }
  button {
    width: 169px;
    height: 52px;
    line-height: 42px;
    border-radius: 52px;
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    color: #fff;
    background-color: #6b33b0 !important;
    border-color: #6b33b0 !important;
    margin-left: ${({ theme }) => theme.margin(4)};
    &:hover {
      opacity: 0.8;
    }
  }
`

const STYLED_SOL = styled.div`
  width: 372px;
  height: 60px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 0 ${({ theme }) => theme.margin(4)};
  margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)}; */
  .value {
    font-family: Montserrat;
    font-size: 22px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.text15};
  }
  &.active {
    .value {
      color: #fff;
      font-weight: 600;
    }
  }
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.text14};
    display: flex;
    z-index: 2;
    margin-bottom: 6px;
    margin-left: -100px;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margin(1.5)};
  }
`
const STYLED_STAKE_PILL = styled(MainButton)`
  width: 372px;
  height: 44px;
  border-radius: 51px;
  background-color: ${({ theme }) => theme.stakePillBg};
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  opacity: 0.5;
  color: ${({ theme }) => theme.text14};
  margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
  transition: all 0.3s ease;
  cursor: pointer;
  &.active,
  &:hover {
    background: ${({ theme }) => theme.primary3};
    color: #fff;
    opacity: 1;
  }
`

const STYLED_STAKED_EARNED_CONTENT = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.margin(4)};
  .info-item {
    max-width: 150px;
    min-width: 130px;
    margin-right: ${({ theme }) => theme.margin(7)};
    .title,
    .value {
      font-family: Montserrat;
      font-size: 20px;
      font-weight: 600;
      color: ${({ theme }) => theme.text7};
    }
    .price {
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 500;
      color: ${({ theme }) => theme.text13};
    }
    .value,
    .price {
      margin-bottom: ${({ theme }) => theme.margin(0.5)};
    }
  }
`
const STYLED_IMG = styled.img`
  transform: scale(1.3);
`

const STYLED_DESC = styled.div`
  display: flex;
  .text {
    margin-right: ${({ theme }) => theme.margin(1)};
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text7};
  }
  .value {
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    color: ${({ theme }) => theme.text8};
  }
`

const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;

  .m-title {
    margin-bottom: 16px;
  }

  .m-icon {
    width: 20.5px;
    height: 20px;
  }

  p {
    line-height: 1.3;
    max-width: 200px;
  }
`
const MAX_BUTTON = styled.div`
  cursor: pointer;
`
const ROW_DATA = styled.div`
  width: 100%;
  height: 75px;
  cursor: pointer;
`
const STYLED_INPUT = styled.input`
  width: 372px;
  height: 44px;
  background-color: ${({ theme }) => theme.solPillBg};
  border-radius: 60px;
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  padding: 0 ${({ theme }) => theme.margin(4)};
  margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)};
  .value {
    font-family: Montserrat;
    font-size: 22px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.text15};
  }
  &.active {
    .value {
      color: #fff;
      font-weight: 600;
    }
  }
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.text14};
    display: flex;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margin(1.5)};
  }
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
  const { name, image, earned, currentlyStaked, type } = rowData
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

  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])

  useEffect(() => {
    if (wallet.publicKey) {
      const SOL = connection.getAccountInfo(wallet.publicKey)
      SOL.then((res) => setSOLBalance(res.lamports / LAMPORTS_PER_SOL))
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
  }, [earned, currentlyStaked])

  useEffect(() => {
    setOperationPending(isMintLoading || isBurnLoading || isStakeLoading || isUnstakeLoading || isWithdrawLoading)
  }, [isMintLoading, isBurnLoading, isStakeLoading, isUnstakeLoading, isWithdrawLoading])

  const updateStakedValue = () => {
    setTokenStaked((prev) => prev + parseFloat(stakeRef.current.value))
  }

  const enoughSOLInWallet = (): Boolean => {
    if (userSOLBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }

  const checkBasicConditions = (amt?: number | undefined): boolean => {
    if (!enoughSOLInWallet()) return true
    if (name === 'SOL') userTokenBalance = userSOLBalance
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
      const confirm = executeMint(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setMintLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeRef.current.value, name, network, Mint))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error.message, signature, network, Mint))
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
      const confirm = executeBurn(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setBurnLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeRef.current.value, name, network, Burn))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error.message, signature, network, Burn))
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
      const confirm = executeWithdraw(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setWithdrawLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeRef.current.value, name, network, Withdraw))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error.message, signature, network, Withdraw))
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
          notify(errorHandlingMessage(getErrStakeMsg(), name, error.message, signature, network))
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
      const confirm = executeUnstakeAndClaim(stakeProgram, stakeAccountKey, wallet, connection, network, tokenInPercent)
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
          notify(errorHandlingMessage(getErrUntakeMsg(), name, error.message, signature, network))
          return
        }
      })
    } catch (error) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(error))
    }
  }
  const onClickHalf = (buttonId: string): void => {
    if (name === 'SOL') userTokenBalance = userSOLBalance
    if (buttonId === 'stake') stakeRef.current.value = (userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)
    else unstakeRef.current.value = ((tokenStaked + tokenEarned) / 2).toFixed(DISPLAY_DECIMAL)
  }
  const onClickMax = (buttonId: string): void => {
    //add focus element
    if (name === 'SOL') userTokenBalance = userSOLBalance
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
            />
          )}
        </STYLED_EXPANDED_CONTENT>
      </div>
    </STYLED_EXPANDED_ROW>
  )
}
