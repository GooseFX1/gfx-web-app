import React, { FC, useMemo, useEffect } from 'react'
import { MainButton } from '../../components'
import { Connect } from '../../layouts/App/Connect'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useFarmContext, usePriceFeedFarm, useAccounts, useTokenRegistry, useConnectionConfig } from '../../context'
import { invalidInputErrMsg } from './FarmClickHandler'
import { checkMobile, notify } from '../../utils'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { ADDRESSES } from '../../web3'
import { TOKEN_NAMES } from '../../constants'
import { ExpandedContent } from './ExpandedContent'

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

const STYLED_DESC = styled.div`
  display: flex;
  margin-top: 10px;
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
    background-color: #625c68 !important;
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
  background: ${({ theme }) => theme.primary3};
  line-height: 49px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  opacity: 0.85;
  color: #fff;
  margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
  transition: all 0.3s ease;
  cursor: pointer;
  &.active,
  &:hover,
  &:focus {
    opacity: 1;
  }
  &:disabled {
    opacity: 0.5;
  }

  &.miniButtons {
  }
`
const MAX_BUTTON = styled.div`
  cursor: pointer;
`
const STYLED_MINT = styled(MainButton)``
const DISPLAY_DECIMAL = 3

export const StakeButtons: FC<{
  wallet: any
  name: string
  stakeRef: any
  unstakeRef: any
  onClickHalf: (x: string) => void
  onClickMax: (x: string) => void
  onClickStake: any
  onClickUnstake: any
  isStakeLoading?: boolean
  isUnstakeLoading?: boolean
  rowData: any
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
  isUnstakeLoading,
  rowData
}) => {
  const { farmDataContext } = useFarmContext()
  const { prices } = usePriceFeedFarm()
  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  const { getTokenInfoForFarming } = useTokenRegistry()
  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])
  const userTokenBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo?.address, getUIAmount, publicKey]
  )

  const { current } = useMemo(() => prices[`${name.toUpperCase()}/USDC`], [prices])
  const tokenData = farmDataContext.find((token) => token.name === 'GOFX')

  return (
    <>
      {wallet.publicKey && !checkMobile() ? (
        <>
          <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
            <div className="left-inner">
              <STYLED_STAKED_EARNED_CONTENT>
                <div className="info-item">
                  <div className="title">Daily Rewards</div>
                  <div className="value">{`${tokenData.rewards.toFixed(3)} ${name}`}</div>
                  <div className="price">{`$${(current * tokenData.rewards).toFixed(3)} USDC`}</div>
                </div>
                {wallet.publicKey && (
                  <STYLED_DESC>
                    <div className="text">{name} Wallet Balance:</div>
                    <div className="value">
                      {userTokenBalance?.toFixed(3)} {name}
                    </div>
                  </STYLED_DESC>
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
                  {wallet.publicKey && (
                    <STYLED_DESC>
                      <div className="text">{name} Wallet Balance:</div>
                      <div className="value">
                        {userTokenBalance?.toFixed(3)} {name}
                      </div>
                    </STYLED_DESC>
                  )}
                </STYLED_STAKED_EARNED_CONTENT>
              </div>
            </STYLED_LEFT_CONTENT>
            <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
              <div className="right-inner">
                <div className="SOL-item">
                  <STYLED_SOL>
                    <STYLED_INPUT
                      className="value"
                      type="number"
                      ref={stakeRef}
                      onChange={(e) => setStakeAmt(parseFloat(e.target.value))}
                    />
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
                    disabled={notEnoughFunds || isStakeLoading}
                    onClick={() => onClickStake()}
                  >
                    {notEnoughFunds ? 'Not enough funds' : 'Stake'}
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
                  <STYLED_STAKE_PILL
                    loading={isUnstakeLoading}
                    disabled={isUnstakeLoading}
                    onClick={() => onClickUnstake()}
                  >
                    Unstake and Claim
                  </STYLED_STAKE_PILL>
                </div>
              </div>
            </STYLED_RIGHT_CONTENT>
          </>
        ) : checkMobile() && wallet.publicKey ? (
          <ExpandedContent
            name={name}
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
        ) : (
          <>
            <ConnectContainer>
              <Connect />
            </ConnectContainer>
          </>
        )}
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
  stakeRef: any
  unstakeRef: any
  onClickDeposit: any
  onClickWithdraw: any
  onClickMint: any
  onClickBurn: any
  isStakeLoading: boolean
  isWithdrawLoading: boolean
  isMintLoading: boolean
  userSOLBalance: number
  isBurnLoading: boolean
  isUnstakeLoading?: boolean
  rowData: any
}> = ({
  wallet,
  name,
  stakeRef,
  unstakeRef,
  onClickDeposit,
  onClickWithdraw,
  userSOLBalance,
  onClickMint,
  onClickBurn,
  isStakeLoading,
  isWithdrawLoading,
  isBurnLoading,
  isMintLoading,
  isUnstakeLoading,
  rowData
}) => {
    const miniButtonsClass = document.activeElement === unstakeRef.current ? ' active' : ''
    const depositButtonClass = document.activeElement === stakeRef.current ? ' active' : ''
    const { prices } = usePriceFeedFarm()
    const { farmDataSSLContext, operationPending } = useFarmContext()
    const tokenData = farmDataSSLContext.find((farmData) => farmData.name === name)
    const { getUIAmount } = useAccounts()
    const { publicKey } = useWallet()
    const { getTokenInfoForFarming } = useTokenRegistry()
    const { network } = useConnectionConfig()

    let tokenPrice = useMemo(() => {
      if (name === 'USDC') {
        return { current: 1 }
      }
      // to get price of the token MSOL must be in upper case while to get tokenInfo address mSOL
      return prices[`${name.toUpperCase()}/USDC`]
    }, [prices[`${name.toUpperCase()}/USDC`]])

    const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])
    let userTokenBalance = useMemo(
      () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
      [tokenInfo?.address, getUIAmount, publicKey]
    )
    const userPoolTokenBalance = useMemo(
      () => (publicKey ? getUIAmount(poolTokenAddress['g' + name]) : 0),
      [getUIAmount, publicKey]
    )

    const onClickMax = (buttonId: string) => {
      if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
      if (buttonId === 'deposit') stakeRef.current.value = userTokenBalance.toFixed(DISPLAY_DECIMAL)
      else unstakeRef.current.value = availableToMint.toFixed(DISPLAY_DECIMAL)
    }
    const onClickHalf = (buttonId: string) => {
      if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
      if (buttonId === 'deposit') stakeRef.current.value = (userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)
      else unstakeRef.current.value = (availableToMint / 2).toFixed(DISPLAY_DECIMAL)
    }
    const availableToMint =
      tokenData?.ptMinted >= 0 ? tokenData.currentlyStaked + tokenData.earned - tokenData.ptMinted : 0
    const availableToMintFiat = tokenPrice && availableToMint * tokenPrice.current

    const checkbasicConditions = (amt: number, stakeRefBool?: boolean) => {
      const userAmount = stakeRefBool ? parseFloat(stakeRef.current.value) : parseFloat(unstakeRef.current.value)
      if (isNaN(userAmount) || userAmount < 0.000001 || parseFloat(userAmount.toFixed(3)) > parseFloat(amt.toFixed(3))) {
        stakeRefBool ? (stakeRef.current.value = 0) : (unstakeRef.current.value = 0)
        notify(invalidInputErrMsg(amt >= 0 ? amt : undefined, name))
        return true
      }
      return false
    }
    let notEnough = false
    try {
      let amt = parseFloat(stakeRef.current?.value).toFixed(3)
      notEnough =
        parseFloat(amt) >
        (name === TOKEN_NAMES.SOL ? parseFloat(userSOLBalance.toFixed(3)) : parseFloat(userTokenBalance.toFixed(3)))
    } catch (e) { }

    useEffect(() => {
      try {
        let amt = parseFloat(stakeRef.current?.value).toFixed(3)
        notEnough =
          parseFloat(amt) >
          (name === TOKEN_NAMES.SOL ? parseFloat(userSOLBalance.toFixed(3)) : parseFloat(userTokenBalance.toFixed(3)))
      } catch (e) { }
    }, [stakeRef.current?.value])

    const mintClicked = () => {
      if (checkbasicConditions(availableToMint)) return
      onClickMint(availableToMint)
    }
    const burnClicked = () => {
      if (checkbasicConditions(userPoolTokenBalance)) return
      onClickBurn()
    }
    const withdrawClicked = () => {
      // (amt / userLiablity) * 10000
      if (checkbasicConditions(availableToMint)) return
      const decimals = ADDRESSES[network]?.sslPool[name]?.decimals
      const multiplier = name === 'SOL' || name === 'GMT' || decimals === 9 ? 10000 : 10
      let amountInNative = (unstakeRef.current.value / tokenData?.userLiablity) * LAMPORTS_PER_SOL * multiplier
      if (parseFloat(availableToMint.toFixed(3)) === parseFloat(unstakeRef.current.value)) {
        amountInNative = 100 * 100
      }
      onClickWithdraw(amountInNative)
    }
    return (
      <>
        {wallet.publicKey && !checkMobile() ? (
          <>
            <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
              <div className="left-inner">
                <STYLED_STAKED_EARNED_CONTENT>
                  {tokenPrice && (
                    <div className="info-item">
                      <div className="title">Available to mint</div>
                      <div className="value">{`${availableToMint.toFixed(DISPLAY_DECIMAL)} g${name}`}</div>
                      <div className="price">{`$${availableToMintFiat.toFixed(DISPLAY_DECIMAL)} USDC`}</div>
                    </div>
                  )}
                  <STYLED_DESC>
                    <div className="text">{name} Wallet Balance:</div>
                    <div className="value">
                      {name === TOKEN_NAMES.SOL ? userSOLBalance?.toFixed(DISPLAY_DECIMAL) : userTokenBalance.toFixed(3)}{' '}
                      {name}
                    </div>
                  </STYLED_DESC>
                </STYLED_STAKED_EARNED_CONTENT>
              </div>
            </STYLED_LEFT_CONTENT>
            <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
              <div className="right-inner">
                <div className="SOL-item">
                  <STYLED_SOL>
                    <STYLED_INPUT className="value" type="number" min={10} max={100} ref={stakeRef} />
                    <div className="text">
                      <MAX_BUTTON onClick={() => onClickHalf('deposit')} className="text-1">
                        Half
                      </MAX_BUTTON>
                      <MAX_BUTTON onClick={() => onClickMax('deposit')} className="text-2">
                        Max
                      </MAX_BUTTON>
                    </div>
                  </STYLED_SOL>
                  <FLEX>
                    <STYLED_STAKE_PILL
                      loading={isStakeLoading}
                      className={depositButtonClass}
                      disabled={isStakeLoading || notEnough}
                      onClick={() => onClickDeposit()}
                    >
                      {notEnough ? 'Not enough funds' : 'Deposit'}
                    </STYLED_STAKE_PILL>
                  </FLEX>
                </div>
                <div className="SOL-item">
                  <STYLED_SOL>
                    <STYLED_INPUT className="value" type="number" ref={unstakeRef} />
                    <div className="text">
                      <MAX_BUTTON onClick={() => onClickHalf('mint')} className="text-1">
                        Half
                      </MAX_BUTTON>
                      <MAX_BUTTON onClick={() => onClickMax('mint')} className="text-2">
                        Max
                      </MAX_BUTTON>
                    </div>
                  </STYLED_SOL>
                  <FLEX>
                    <STYLED_STAKE_PILL
                      loading={isWithdrawLoading}
                      disabled={
                        isUnstakeLoading || parseFloat(availableToMint.toFixed(DISPLAY_DECIMAL)) <= 0 || operationPending
                      }
                      className={miniButtonsClass}
                      title={'Withdraw tokens to your wallet'}
                      onClick={() => withdrawClicked()}
                    >
                      Withdraw
                    </STYLED_STAKE_PILL>
                  </FLEX>
                </div>
              </div>
            </STYLED_RIGHT_CONTENT>
          </>
        ) : checkMobile() && wallet.publicKey ? (
          <ExpandedContent
            isSsl={true}
            name={name.toString()}
            wallet={wallet}
            stakeRef={stakeRef}
            unstakeRef={unstakeRef}
            onClickDeposit={onClickDeposit}
            onClickMint={onClickMint}
            onClickBurn={onClickBurn}
            isStakeLoading={isStakeLoading}
            isWithdrawLoading={isWithdrawLoading}
            userSOLBalance={userSOLBalance}
            isUnstakeLoading={isUnstakeLoading}
            withdrawClicked={withdrawClicked}
            rowData={rowData}
          />
        ) : (
          <ConnectContainer>
            <Connect />
          </ConnectContainer>
        )}
      </>
    )
  }

export default {}
