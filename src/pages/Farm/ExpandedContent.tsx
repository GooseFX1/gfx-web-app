import React, { useState, useMemo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Program } from '@project-serum/anchor'
import { Button, Row, Col } from 'antd'
import { MainButton } from '../../components'
import { notify } from '../../utils'
import { useTokenRegistry, useAccounts, useCrypto, useConnectionConfig, usePriceFeed } from '../../context'
import { createStakingAccount, executeStake, executeUnstakeAndClaim, fetchCurrentAmountStaked } from '../../web3'

//#region styles
const STYLED_EXPANDED_ROW = styled.div`
  padding-top: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(10)};
  padding-bottom: ${({ theme }) => theme.margin(7)};
  padding-left: ${({ theme }) => theme.margin(4)};
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
    background: #050505;
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
  align-items: center;
  justify-content: space-between;
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

interface ITokenStakedInfo {
  tokenStakedPlusEarned: Number
  tokenStaked: Number
  tokenEarned: Number
}

interface IExpandedContent {
  record: any
  stakeProgam: Program | undefined
  stakeAccountKey: PublicKey | undefined
  stakedInfoParam: any
}

export const ExpandedContent = ({ record, stakeProgam, stakeAccountKey, stakedInfoParam }: IExpandedContent) => {
  const { name, image, liquidity, rewards, connected } = record
  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const tokenInfo = useMemo(() => getTokenInfoFromSymbol(name), [name, publicKey])
  const userSOLBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(getTokenInfoFromSymbol('SOL').address) : 0),
    [getUIAmount, publicKey]
  )
  const userTokenBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo, getUIAmount, publicKey]
  )
  const [stakedInfo, setStakedInfo] = useState(stakedInfoParam)
  const { network } = useConnectionConfig()
  const wallet = useWallet()
  const { prices } = usePriceFeed()
  const { connection } = useConnectionConfig()

  const initState = [
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
  ]
  const [status, setStatus] = useState(initState)
  const [tokenValueInDollars, setTokenValueInDollars] = useState(0)
  const [earnedValueIn$, setEarnedValueIn$] = useState(0)
  const [isStakeLoading, setIsStakeLoading] = useState(false)
  const [isUnstakeLoading, setIsUnstakeLoading] = useState(false)
  const [tokenStaked, setTokenStaked] = useState(0)
  const [tokenEarned, setTokenEarned] = useState(0)
  const stakeRef = useRef(null)
  const unstakeRef = useRef(null)
  const stakeProgram = stakeProgam

  //const tokenStaked = stakedInfo.tokenStaked ? stakedInfo.tokenStaked : 0
  //const tokenEarned = stakedInfo.tokenEarned && stakedInfo.tokenEarned > 0 ? stakedInfo.tokenEarned : 0

  useEffect(() => {
    setTokenStaked(stakedInfo.tokenStaked ? stakedInfo.tokenStaked : 0)
    setTokenEarned(stakedInfo.tokenEarned && stakedInfo.tokenEarned > 0 ? stakedInfo.tokenEarned : 0)
    fetchCurrentAmountStaked(connection, stakeAccountKey, wallet).then((result) => {
      setStakedInfo(result)
    })
  }, [userTokenBalance])

  useEffect(() => {
    const price = prices[name + '/USDC']
    setTokenValueInDollars(price?.current * tokenStaked)
    setEarnedValueIn$(price?.current * tokenEarned)
  }, [userTokenBalance])

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
    if (stakeRef.current.value < 0.000001 || stakeRef.current.value > userTokenBalance) {
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
      const confirm = executeStake(stakeProgram, stakeAccountKey, wallet, connection, network, stakeRef.current.value)
      confirm.then((con) => {
        setIsStakeLoading(false)
        if (con && con?.value && con.value.err === null) {
          notify({
            message: `Deposited amount ${stakeRef.current.value} ${name} Successful`
          })
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
    if (unstakeRef.current.value < 0.1 || unstakeRef.current.value > 100) {
      unstakeRef.current.value = 0
      notify({
        type: 'error',
        message: 'Please give valid input in percentage (1-100%)'
      })
      return
    }
    if (!enoughSOLInWallet()) return
    try {
      setIsUnstakeLoading(true)
      const confirm = executeUnstakeAndClaim(
        stakeProgam,
        stakeAccountKey,
        wallet,
        connection,
        network,
        unstakeRef.current.value
      )
      confirm.then((con) => {
        setIsUnstakeLoading(false)
        if (con && con.value && con.value.err === null) {
          notify({
            message: `Unstake of amount ${unstakeRef.current.value}% Successful`
          })
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
    if (buttonId === 'stake') stakeRef.current.value = userTokenBalance / 2
    else unstakeRef.current.value = 50
  }
  const onClickMax = (buttonId: string) => {
    if (buttonId === 'stake') stakeRef.current.value = userTokenBalance
    else unstakeRef.current.value = 100
  }

  return (
    <STYLED_EXPANDED_ROW>
      <STYLED_EXPANDED_CONTENT>
        <STYLED_LEFT_CONTENT className={`${connected ? 'connected' : 'disconnected'}`}>
          <div className="left-inner">
            <STYLED_IMG src={`/img/crypto/${image}.svg`} alt="" />
            {connected ? (
              <STYLED_STAKED_EARNED_CONTENT>
                <div className="info-item">
                  <div className="title">Staked</div>
                  <div className="value">{`${tokenStaked} ${name}`}</div>
                  <div className="price">{`$1`}</div>
                </div>
                <div className="info-item">
                  <div className="title">Earned</div>
                  <div className="value">{`${tokenEarned} ${name}`}</div>
                  <div className="price">{`$1`}</div>
                </div>
              </STYLED_STAKED_EARNED_CONTENT>
            ) : (
              <Button type="primary">
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </STYLED_LEFT_CONTENT>
        <STYLED_RIGHT_CONTENT className={`${connected ? 'connected' : 'disconnected'}`}>
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
      {connected && (
        <STYLED_DESC>
          <div className="text">{name} Wallet Balance:</div>
          <div className="value">
            {userTokenBalance} {name}
          </div>
        </STYLED_DESC>
      )}
    </STYLED_EXPANDED_ROW>
  )
}
