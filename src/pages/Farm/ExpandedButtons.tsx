import React, { FC, ReactElement, useMemo } from 'react'
import { MainButton } from '../../components'
import { Connect } from '../../layouts/App/Connect'
import styled from 'styled-components'
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react'
import { useFarmContext, usePriceFeed, useAccounts } from '../../context'
import { invalidInputErrMsg } from './FarmClickHandler'
import { notify } from '../../utils'
import { getPTMintKey } from '../../web3'
import { gunzip } from 'zlib'

const STYLED_RIGHT_CONTENT = styled.div`
  display: flex;
  &.connected {
    width: 55%;
  }
  .right-inner {
    display: flex;
    margin-right: 0;
    margin-left: auto;
  }
`
const FLEX = styled.div`
  display: flex;
  width: 392px;
`
const ConnectContainer = styled.div`
  margin-top: 25px;
  margin-left: 25px;
  display: flex;
  height: 50px;
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
const STYLED_STAKED_EARNED_CONTENT = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.margin(3)};
  .info-item {
    min-width: 170px;
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
const STYLED_LEFT_CONTENT = styled.div`
  width: 25%;
  &.connected {
    width: 25%;
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
    background: #3735bb;
    color: #fff;
    opacity: 1;
    &:disabled {
      background-color: ${({ theme }) => theme.stakePillBg} !important;
      opacity: 0.5;
    }
  }

  &.miniButtons {
    width: 125px;
  }
`
const MAX_BUTTON = styled.div`
  cursor: pointer;
`
const STYLED_MINT = styled(MainButton)``

export const StakeButtons: FC<{
  wallet: any
  name: string
  stakeRef: any
  unstakeRef: any
  onClickHalf: (x: string) => void
  onClickMax: (x: string) => void
  onClickStake: any
  onClickUnstake: any
  isStakeLoading?: any
  isUnstakeLoading?: boolean
}> = ({
  wallet,
  name,
  stakeRef,
  unstakeRef,
  onClickHalf,
  onClickMax,
  onClickStake,
  onClickUnstake,
  isStakeLoading,
  isUnstakeLoading
}) => {
  const { farmDataContext } = useFarmContext()
  const { prices } = usePriceFeed()

  const { current } = useMemo(() => prices[`${name}/USDC`], [prices])
  const tokenData = farmDataContext.find((token) => token.name === 'GOFX')
  return (
    <>
      <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
        <div className="left-inner">
          <STYLED_STAKED_EARNED_CONTENT>
            <div className="info-item">
              <div className="title">Daily Rewards</div>
              <div className="value">{`${tokenData.rewards.toFixed(0)} ${name}`}</div>
              <div className="price">{`$${(current * tokenData.rewards).toFixed(0)} USDC`}</div>
            </div>
          </STYLED_STAKED_EARNED_CONTENT>
        </div>
      </STYLED_LEFT_CONTENT>
      <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
        <div className="right-inner">
          <div className="SOL-item">
            <STYLED_SOL>
              <STYLED_INPUT className="value" type="number" ref={stakeRef} />
              <div className="text">
                <MAX_BUTTON onClick={() => onClickHalf('stake')} className="text-1">
                  Half
                </MAX_BUTTON>
                <MAX_BUTTON onClick={() => onClickMax('stake')} className="text-2">
                  Max
                </MAX_BUTTON>
              </div>
            </STYLED_SOL>
            <STYLED_STAKE_PILL loading={isStakeLoading} disabled={isStakeLoading} onClick={() => onClickStake()}>
              Stake
            </STYLED_STAKE_PILL>
          </div>

          <div className="SOL-item">
            <STYLED_SOL>
              <STYLED_INPUT className="value" type="number" min="0" max="100" ref={unstakeRef} />
              <div className="text">
                <MAX_BUTTON onClick={() => onClickHalf('unstake')} className="text-1">
                  Half
                </MAX_BUTTON>
                <MAX_BUTTON onClick={() => onClickMax('unstake')} className="text-2">
                  Max
                </MAX_BUTTON>
              </div>
            </STYLED_SOL>
            <STYLED_STAKE_PILL loading={isUnstakeLoading} disabled={isUnstakeLoading} onClick={() => onClickUnstake()}>
              Unstake and Claim
            </STYLED_STAKE_PILL>
          </div>
        </div>
      </STYLED_RIGHT_CONTENT>
    </>
  )
}

const poolTokenAddress = {
  gUSDC: '7Hvq1zbYWmBpJ7qb4AZSpC1gLC95eBdQgdT3aLQyq6pG',
  gSOL: 'CiBddaPynSdAG2SkbrusBfyrUKdCSXVPHs6rTgSEkfsV'
}

export const SSLButtons: FC<{
  wallet: any
  name: string
  onClickHalf: (x: string) => void
  onClickMax: (x: string) => void
  stakeRef: any
  unstakeRef: any
  onClickDeposit: any
  onClickWithdraw: any
  onClickMint: any
  onClickBurn: any
  isStakeLoading: boolean
  isUnstakeLoading?: boolean
}> = ({
  wallet,
  name,
  onClickHalf,
  onClickMax,
  stakeRef,
  unstakeRef,
  onClickDeposit,
  onClickWithdraw,
  onClickMint,
  onClickBurn,
  isStakeLoading,
  isUnstakeLoading
}) => {
  const miniButtonsClass = document.activeElement === unstakeRef.current ? 'miniButtons active' : 'miniButtons'
  const depositButtonClass = document.activeElement === stakeRef.current ? ' active' : ''
  const { prices } = usePriceFeed()
  const { farmDataContext } = useFarmContext()
  const tokenData = farmDataContext.find((farmData) => farmData.name === name)
  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  let tokenPrice = useMemo(() => {
    if (name === 'USDC') {
      return { current: 1 }
    }
    return prices[`${name}/USDC`]
  }, [prices])
  const userPoolTokenBalance = useMemo(
    () => (publicKey ? getUIAmount(poolTokenAddress['g' + name]) : 0),
    [getUIAmount, publicKey]
  )
  console.log(userPoolTokenBalance)

  const availableToMint = tokenData?.ptMinted ? tokenData.ptMinted : 0
  const availableToMintFiat = tokenPrice && availableToMint * tokenPrice.current

  const checkbasicConditions = (amt: number) => {
    if (
      isNaN(parseFloat(unstakeRef.current.value)) ||
      parseFloat(unstakeRef.current.value) < 0.000001 ||
      parseFloat(unstakeRef.current.value) - 0.0001 > amt
    ) {
      unstakeRef.current.value = 0
      notify(invalidInputErrMsg(amt ? amt : undefined, name))
      return true
    }
    return false
  }

  const mintClicked = () => {
    if (checkbasicConditions(availableToMint)) return
    onClickMint()
  }
  const burnClicked = () => {
    if (checkbasicConditions(userPoolTokenBalance)) return
    onClickBurn()
  }
  const withdrawClicked = () => {
    // (amt / userLiablity) * 10000
    if (checkbasicConditions(availableToMint)) return
    const amountInNative = (unstakeRef.current.value / tokenData?.userLiablity) * 10000
    onClickWithdraw(amountInNative)
  }
  return (
    <>
      {wallet.publicKey ? (
        <>
          <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
            <div className="left-inner">
              <STYLED_STAKED_EARNED_CONTENT>
                {tokenPrice && (
                  <div className="info-item">
                    <div className="title">Available to mint</div>
                    <div className="value">{`${availableToMint.toFixed(3)} g${name}`}</div>
                    <div className="price">{`$${availableToMintFiat.toFixed(3)} USDC`}</div>
                  </div>
                )}
              </STYLED_STAKED_EARNED_CONTENT>
            </div>
          </STYLED_LEFT_CONTENT>
          <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
            <div className="right-inner">
              <div className="SOL-item">
                <STYLED_SOL>
                  <STYLED_INPUT className="value" type="number" ref={stakeRef} />
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
                  loading={isStakeLoading}
                  className={depositButtonClass}
                  disabled={isStakeLoading}
                  onClick={() => onClickDeposit()}
                >
                  Deposit
                </STYLED_STAKE_PILL>
              </div>
              <div className="SOL-item">
                <STYLED_SOL>
                  <STYLED_INPUT className="value" type="number" ref={unstakeRef} />
                  {/* <div className="text">
                    <MAX_BUTTON onClick={() => onClickHalf('unstake')} className="text-1">
                      Half
                    </MAX_BUTTON>
                    <MAX_BUTTON onClick={() => onClickMax('unstake')} className="text-2">
                      Max
                    </MAX_BUTTON>
                  </div> */}
                </STYLED_SOL>
                <FLEX>
                  {parseFloat(availableToMint.toFixed(3)) > 0}
                  <STYLED_STAKE_PILL
                    loading={isUnstakeLoading}
                    disabled={isUnstakeLoading || parseFloat(availableToMint.toFixed(3)) <= 0}
                    className={miniButtonsClass}
                    onClick={() => mintClicked()}
                  >
                    Mint
                  </STYLED_STAKE_PILL>
                  <STYLED_STAKE_PILL
                    loading={isUnstakeLoading}
                    disabled={isUnstakeLoading}
                    className={miniButtonsClass}
                    onClick={() => burnClicked()}
                  >
                    Burn
                  </STYLED_STAKE_PILL>
                  <STYLED_STAKE_PILL
                    loading={isUnstakeLoading}
                    disabled={isUnstakeLoading}
                    className={miniButtonsClass}
                    onClick={() => withdrawClicked()}
                  >
                    Withdraw
                  </STYLED_STAKE_PILL>
                </FLEX>
              </div>
            </div>
          </STYLED_RIGHT_CONTENT>
        </>
      ) : (
        <ConnectContainer>
          <Connect />
        </ConnectContainer>
      )}
    </>
  )
}

export default {}
