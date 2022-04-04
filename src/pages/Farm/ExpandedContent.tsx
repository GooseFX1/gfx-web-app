import React, { useState, useMemo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'
import { Button } from 'antd'
import { MainButton } from '../../components'
import { Connect } from '../../layouts/App/Connect'

import { notify } from '../../utils'
import { useTokenRegistry, useAccounts, useConnectionConfig, usePriceFeed } from '../../context'
import { executeStake, executeUnstakeAndClaim } from '../../web3'

//#region styles
const STYLED_EXPANDED_ROW = styled.div`
  padding-top: ${({ theme }) => theme.margin(4)};
  padding-bottom: ${({ theme }) => theme.margin(7)};
  padding-left: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(4)};
  background-image: ${({ theme }) => theme.expendedRowBg};
`

const STYLED_EXPANDED_CONTENT = styled.div`
  display: flex;
  align-items: center;
`
const STYLED_LEFT_CONTENT = styled.div`
  width: 23%;
  &.connected {
    width: 36%;
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
const STYLED_RIGHT_CONTENT = styled.div`
  width: 77%;
  display: flex;
  &.connected {
    width: 64%;
  }
  .right-inner {
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
const STYLED_SOL = styled.div`
  width: 300px;
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
    margin-left: -150px;
  }
  .text-2 {
    margin-left: ${({ theme }) => theme.margin(1.5)};
  }
`
const STYLED_STAKE_PILL = styled(MainButton)`
  width: 300px;
  height: 51px;
  border-radius: 51px;
  background-color: ${({ theme }) => theme.stakePillBg};
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.text14};
  margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
  transition: all 0.3s ease;
  cursor: pointer;
  &.active,
  &:hover {
    background: #3735bb;
    color: #fff;
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
const STYLED_INPUT = styled.input`
  width: 300px;
  height: 60px;
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
  stakeAccountKey: PublicKey | undefined
}

export const ExpandedContent = ({ rowData, stakeProgram, stakeAccountKey }: IExpandedContent) => {
  const { name, image, earned, currentlyStaked } = rowData
  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  const { getTokenInfoForFarming } = useTokenRegistry()
  const { network } = useConnectionConfig()
  const wallet = useWallet()
  const { prices } = usePriceFeed()
  const { connection } = useConnectionConfig()

  const [status, setStatus] = useState([
    {
      id: 0,
      selected: false,
      isLoading: false
    },
    {
      id: 1,
      selected: false,
      isLoading: false
    }
  ])
  const [isStakeLoading, setIsStakeLoading] = useState<boolean>(false)
  const [isUnstakeLoading, setIsUnstakeLoading] = useState<boolean>(false)
  const [tokenStaked, setTokenStaked] = useState<number>(parseFloat(currentlyStaked))
  const [tokenEarned, setTokenEarned] = useState<number>(parseFloat(earned))
  console.log(earned, 'earned')
  const stakeRef = useRef(null)
  const unstakeRef = useRef(null)

  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])

  const userSOLBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(getTokenInfoForFarming('SOL').address) : 0),
    [getUIAmount, publicKey]
  )

  const userTokenBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo, getUIAmount, publicKey]
  )

  const fiatStakedAmount = useMemo(() => {
    const price = prices[name + '/USDC']
    return tokenStaked ? tokenStaked * price?.current : 0
  }, [tokenStaked])

  const fiatEarnedAmount = useMemo(() => {
    const price = prices[name + '/USDC']
    return tokenEarned ? tokenEarned * price?.current : 0
  }, [tokenEarned])

  useEffect(() => {
    setTokenStaked(parseFloat(currentlyStaked))
    setTokenEarned(Math.abs(parseFloat(earned)))
  }, [earned, currentlyStaked])

  const updateStakedValue = () => {
    setTokenStaked((prev) => prev + parseFloat(stakeRef.current.value))
  }

  const enoughSOLInWallet = (): Boolean => {
    if (userSOLBalance < 0.000001) {
      notify({
        type: 'error',
        message: 'You need minimum of 0.000001 SOL in your wallet to perform this transaction'
      })
      return false
    }
    return true
  }

  const onClickStake = () => {
    if (
      isNaN(parseFloat(stakeRef.current.value)) ||
      parseFloat(stakeRef.current.value) < 0.000001 ||
      parseFloat(stakeRef.current.value) - 0.001 > userTokenBalance
    ) {
      unstakeRef.current.value = 0
      notify({
        type: 'error',
        message: `Please give valid input from 0.00001 to ${userTokenBalance} ${name}`
      })
      return
    }
    if (!enoughSOLInWallet()) return
    try {
      setIsStakeLoading(true)
      const confirm = executeStake(
        stakeProgram,
        stakeAccountKey,
        wallet,
        connection,
        network,
        parseFloat(stakeRef.current.value) - 0.001
      )
      confirm.then((con) => {
        setIsStakeLoading(false)
        if (con && con?.value && con.value.err === null) {
          notify({
            message: `Deposited amount ${stakeRef.current.value} ${name} Successful`
          })
          updateStakedValue()
          setTimeout(() => (stakeRef.current.value = 0), 500)
        } else {
          notify({
            type: 'error',
            message: con?.message
          })
          return
        }
      })
    } catch (error) {
      setIsStakeLoading(false)
      notify({
        type: 'error',
        message: error
      })
    }
  }

  const onClickUnstake = () => {
    const tokenStakedPlusEarned = tokenStaked + tokenEarned
    if (
      isNaN(parseFloat(unstakeRef.current.value)) ||
      parseFloat(unstakeRef.current.value) < 0.01 ||
      parseFloat(unstakeRef.current.value) > parseFloat(tokenStakedPlusEarned.toFixed(3))
    ) {
      unstakeRef.current.value = 0
      notify({
        type: 'error',
        message: `Please give valid input from 0 - ${tokenStaked + tokenEarned}`
      })
      return
    }
    if (!enoughSOLInWallet()) return
    try {
      setIsUnstakeLoading(true)
      const tokenInPercent = tokenStakedPlusEarned
        ? (parseFloat(unstakeRef.current.value) / parseFloat(tokenStakedPlusEarned.toFixed(3))) * 100
        : 0
      const confirm = executeUnstakeAndClaim(stakeProgram, stakeAccountKey, wallet, connection, network, tokenInPercent)
      confirm.then((con) => {
        setIsUnstakeLoading(false)
        if (con && con.value && con.value.err === null) {
          updateStakedValue()
          notify({
            message: `Unstake of amount ${unstakeRef.current.value} ${name} Successful`
          })
          if (parseFloat(unstakeRef.current.value) > tokenStaked) {
            const val = tokenEarned - (parseFloat(unstakeRef.current.value) - tokenStaked)
            setTokenEarned(val <= 0 ? 0 : val)
          }
          const remainingToken = tokenStaked - parseFloat(unstakeRef.current.value)
          setTokenStaked(remainingToken > 0 ? remainingToken : 0)
          setTimeout(() => (unstakeRef.current.value = 0), 1000)
        } else {
          notify({
            type: 'error',
            message: con.message
          })
        }
      })
    } catch (error) {
      setIsUnstakeLoading(false)
      notify({
        type: 'error',
        message: error
      })
    }
  }
  const onClickHalf = (buttonId: string) => {
    if (buttonId === 'stake') stakeRef.current.value = (userTokenBalance / 2).toFixed(3)
    else unstakeRef.current.value = ((tokenStaked + tokenEarned) / 2).toFixed(3)
  }
  const onClickMax = (buttonId: string) => {
    if (buttonId === 'stake') stakeRef.current.value = userTokenBalance.toFixed(3)
    else unstakeRef.current.value = (tokenStaked + tokenEarned).toFixed(3)
  }

  return (
    <STYLED_EXPANDED_ROW>
      <STYLED_EXPANDED_CONTENT>
        <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
          <div className="left-inner">
            <STYLED_IMG src={`/img/crypto/${image}.svg`} alt="" />
            {wallet.publicKey ? (
              <STYLED_STAKED_EARNED_CONTENT>
                <div className="info-item">
                  <div className="title">Staked</div>
                  <div className="value">{`${tokenStaked.toFixed(3)} ${name}`}</div>
                  <div className="price">{`$${fiatStakedAmount.toFixed(3)}`}</div>
                </div>
                <div className="info-item" key={'item?'}>
                  <div className="title">Earned</div>
                  <div className="value">{`${tokenEarned.toFixed(3)} ${name}`}</div>
                  <div className="price">{`$${fiatEarnedAmount.toFixed(3)}`}</div>
                </div>
              </STYLED_STAKED_EARNED_CONTENT>
            ) : (
              <Connect />
            )}
          </div>
        </STYLED_LEFT_CONTENT>
        <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
          <div className="right-inner">
            <div className="SOL-item">
              <STYLED_SOL className={status[0].selected ? 'active' : ''}>
                <STYLED_INPUT className="value" ref={stakeRef} type="number" />
                <div className="text">
                  <MAX_BUTTON onClick={() => onClickHalf('stake')} className="text-1">
                    Half
                  </MAX_BUTTON>
                  <MAX_BUTTON onClick={() => onClickMax('stake')} className="text-2">
                    Max
                  </MAX_BUTTON>
                </div>
              </STYLED_SOL>
              <STYLED_STAKE_PILL
                className={status[0].selected ? 'active' : ''}
                loading={isStakeLoading}
                disabled={isStakeLoading}
                onClick={() => onClickStake()}
              >
                Stake
              </STYLED_STAKE_PILL>
            </div>
            <div className="SOL-item">
              <STYLED_SOL className={status[1].selected ? 'active' : ''}>
                <STYLED_INPUT className="value" ref={unstakeRef} type="number" min="0" max="100" />
                <div className="text">
                  <MAX_BUTTON onClick={() => onClickHalf('unstake')} className="text-1">
                    Half
                  </MAX_BUTTON>
                  <MAX_BUTTON onClick={() => onClickMax('unstake')} className="text-2">
                    Max
                  </MAX_BUTTON>
                </div>
              </STYLED_SOL>
              <STYLED_STAKE_PILL
                className={status[1].selected ? 'active' : ''}
                loading={isUnstakeLoading}
                disabled={isUnstakeLoading}
                onClick={() => onClickUnstake()}
              >
                Unstake and Claim
              </STYLED_STAKE_PILL>
            </div>
          </div>
        </STYLED_RIGHT_CONTENT>
      </STYLED_EXPANDED_CONTENT>
      {wallet.publicKey && (
        <STYLED_DESC>
          <div className="text">{name} Wallet Balance:</div>
          <div className="value">
            {userTokenBalance.toFixed(3)} {name}
          </div>
        </STYLED_DESC>
      )}
    </STYLED_EXPANDED_ROW>
  )
}
