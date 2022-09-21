import React, { FC, useState, useMemo } from 'react'
import styled from 'styled-components'
import { MainButton } from '../../components'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useWallet } from '@solana/wallet-adapter-react'
import { useFarmContext, useAccounts, useTokenRegistry } from '../../context'
import tw from 'twin.macro'
import { Loader } from '../Farm/Columns'
import { moneyFormatter } from '../../utils/math'
import { HeaderTooltip } from '../Farm/Columns'
import { Connect } from '../../layouts/App/Connect'
import { IFarmData } from './CustomTableList'

const STYLED_SOL = styled.div`
  ${tw`flex items-center justify-between rounded-[60px] h-[50px] w-[372px] w-[90%] my-[20px] mx-auto`}
  background-color: ${({ theme }) => theme.solPillBg};

  .value {
    ${tw`text-left font-semibold text-[18px]`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text15};
  }
  .textMain {
    ${tw`text-tiny font-semibold text-center flex z-[2] p-[5%] m-0`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text14};
  }
  .textTwo {
    ${tw`ml-3`}
  }
`
const STYLED_INPUT = styled.input`
  ${tw`rounded-[60px] h-full w-[70%] m-0 p-[5%] border-0 border-none outline-none`}
  background-color: ${({ theme }) => theme.solPillBg};
  border: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .textMain {
    ${tw`text-tiny font-semibold text-center flex`}
    font-family: Montserrat;
    color: ${({ theme }) => theme.text14};
  }
  .textTwo {
    ${tw`ml-3`}
  }
`

const STYLED_STAKE_PILL = styled(MainButton)`
  ${tw`w-[90%] mt-0 mx-auto mb-5 h-12.5 text-base font-semibold rounded-circle bg-[#131313] text-center opacity-50`}
  line-height: normal;
  font-family: Montserrat;
  color: ${({ theme }) => theme.text14};
  transition: all 0.3s ease;
  &:hover,
  &:focus {
    background: ${({ theme }) => theme.primary3};
    ${tw`text-white opacity-100`}
    &:disabled {
      ${tw`opacity-50`}
    }
  }
`
const MAX_BUTTON = styled.div`
  ${tw`cursor-pointer`}
`

const EXPAND_WRAPPER = styled.td`
  ${tw`font-semibold text-base absolute w-full mt-10 left-0`}
  .details {
    font-family: Montserrat;
    line-height: normal;
    color: ${({ theme }) => theme.text1};
  }
`

const ROW = styled.div`
  ${tw`flex justify-between mb-3.5`}
`
const Tooltip_holder = styled.div`
  ${tw`flex`}
`
const ROW_WRAPPER = styled.div`
  ${tw`px-5 pb-6`}
`

const STAKE_UNSTAKE = styled.div`
  ${tw`flex justify-center px-[2%]`}

  .selected {
    ${tw`text-white`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
  }
`

const BUTTONS = styled.button`
  ${tw`w-1/2 h-10 rounded-[36px] border-0 border-none 
  font-semibold text-tiny text-[#b5b5b5] text-center cursor-pointer`}
  font-family: 'Montserrat';
  background: none;
  :disabled {
    cursor: wait;
  }
`

const Reward = styled.div`
  ${tw`text-center font-semibold text-tiny`}
  font-family: Montserrat;
  color: ${({ theme }) => theme.text1};
`
const ConnectWrapper = styled.div`
  ${tw`flex flex-row justify-center`}
`

export const ExpandedContentMobile: FC<{
  onClickHalf?: (x: string) => void
  onClickMax?: (x: string) => void
  onClickStake?: any
  onClickUnstake?: any
  onClickDeposit?: any
  onClickWithdraw?: any
  isStakeLoading?: boolean
  isWithdrawLoading?: boolean
  userSOLBalance?: number
  isUnstakeLoading?: boolean
  isSsl?: boolean
  withdrawClicked?: () => void
  farm: IFarmData
}> = ({
  onClickHalf,
  onClickMax,
  onClickStake,
  onClickUnstake,
  isStakeLoading,
  isUnstakeLoading,
  onClickDeposit,
  userSOLBalance,
  isWithdrawLoading,
  isSsl,
  withdrawClicked,
  farm
}) => {
  const { farmDataContext, farmDataSSLContext } = useFarmContext()
  //const { prices } = usePriceFeedFarm()
  const wallet = useWallet()
  const { name } = farm

  const { getUIAmount } = useAccounts()
  const { publicKey } = useWallet()
  const { getTokenInfoForFarming } = useTokenRegistry()
  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, publicKey])
  const [process, setProcess] = useState<string>('Stake')
  const DISPLAY_DECIMAL = 3

  const userTokenBalance = useMemo(
    () => (publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo?.address, getUIAmount, publicKey]
  )
  const tokenData = !isSsl
    ? farmDataContext.find((token) => token.name === 'GOFX')
    : farmDataSSLContext.find((farmData) => farmData.name === name)

  // const tokenPrice = useMemo(() => {
  //   if (name === 'USDC') {
  //     return { current: 1 }
  //   }
  //   // to get price of the token MSOL must be in upper case while to get tokenInfo address mSOL
  //   return prices[`${name.toUpperCase()}/USDC`]
  // }, [prices[`${name.toUpperCase()}/USDC`]])

  const availableToMint =
    tokenData?.ptMinted >= 0 ? tokenData.currentlyStaked + tokenData.earned - tokenData.ptMinted : 0
  //const availableToMintFiat = tokenPrice && availableToMint * tokenPrice.current
  console.log(availableToMint)

  // const onClickHalfSsl = (buttonId: string) => {
  //     if (name === 'SOL') userTokenBalance = userSOLBalance
  //     if (buttonId === 'deposit') stakeRef.current.value = (userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)
  //     else unstakeRef.current.value = (availableToMint / 2).toFixed(DISPLAY_DECIMAL)
  // }

  // const onClickMaxSsl = (buttonId: string) => {
  //     if (name === 'SOL') userTokenBalance = userSOLBalance
  //     if (buttonId === 'deposit') stakeRef.current.value = userTokenBalance.toFixed(DISPLAY_DECIMAL)
  //     else unstakeRef.current.value = availableToMint.toFixed(DISPLAY_DECIMAL)
  // }

  // let notEnough
  // try {
  //   const amt = parseFloat(stakeRef.current?.value).toFixed(3)
  //   notEnough =
  //     parseFloat(amt) >
  //     (name === 'SOL' ? parseFloat(userSOLBalance.toFixed(3)) : parseFloat(userTokenBalance.toFixed(3)))
  // } catch (e) {
  //   console.log(e);
  // }

  return (
    <>
      <EXPAND_WRAPPER>
        <ROW_WRAPPER>
          <ROW>
            <span className="details">Balance</span>
            <span className="details">
              {' '}
              {farm?.currentlyStaked >= 0 ? ` ${moneyFormatter(farm.currentlyStaked)}` : <Loader />}
            </span>
          </ROW>
          <ROW>
            <Tooltip_holder>
              <span className="details">Total Earned</span>
              {HeaderTooltip(
                `The total profit and loss from SSL and is measured
                                     by comparing the total value of a pool’s assets (
                  excluding trading fees) to their value if they had not been traded and instead were just held`
              )}
            </Tooltip_holder>
            <span className="details"> {farm?.earned >= 0 ? `${moneyFormatter(farm?.earned)}` : <Loader />}</span>
          </ROW>
          <ROW>
            <Tooltip_holder>
              <span className="details">Liquidity</span>
              {HeaderTooltip("Total value of funds in this farm's liquidity pool.")}
            </Tooltip_holder>
            <span className="details">
              {farm?.liquidity >= 0 ? `$ ${moneyFormatter(farm?.liquidity)}` : <Loader />}
            </span>
          </ROW>
          <ROW>
            <span className="details">7d Volume</span>
            <span className="details">
              {' '}
              {farm?.volume === '-' ? (
                '-'
              ) : farm.volume >= 0 ? (
                //@ts-ignore
                `$ ${moneyFormatter(farm?.volume)}`
              ) : (
                <Loader />
              )}
            </span>
          </ROW>
          <ROW>
            <span className="details">{name} Wallet Balance:</span>
            <span className="details">{userTokenBalance?.toFixed(3)}</span>
          </ROW>
        </ROW_WRAPPER>
        {wallet.publicKey ? (
          <>
            <STAKE_UNSTAKE>
              <BUTTONS
                className={process === 'Stake' ? 'selected' : ''}
                onClick={() => {
                  setProcess('Stake')
                }}
              >
                Stake
              </BUTTONS>
              <BUTTONS
                className={process !== 'Stake' ? 'selected' : ''}
                onClick={() => {
                  setProcess('Claim')
                }}
              >
                Unstake and claim
              </BUTTONS>
            </STAKE_UNSTAKE>
            <STYLED_SOL>
              <STYLED_INPUT
                className="value"
                type="number"
                placeholder={`0.00 ${name}`}
                // ref={process === 'Stake' ? stakeRef : unstakeRef}
              />
              {!isSsl ? (
                <div className="textMain">
                  <MAX_BUTTON
                    onClick={() => onClickHalf(process === 'Stake' ? 'stake' : 'unstake')}
                    className="textOne"
                  >
                    HALF
                  </MAX_BUTTON>
                  <MAX_BUTTON
                    onClick={() => onClickMax(process === 'Stake' ? 'stake' : 'unstake')}
                    className="textTwo"
                  >
                    MAX
                  </MAX_BUTTON>
                </div>
              ) : (
                <div className="textMain">
                  <MAX_BUTTON
                    // onClick={() => onClickHalfSsl(process === 'Stake' ? 'deposit' : 'mint')}
                    className="textOne"
                  >
                    HALF
                  </MAX_BUTTON>
                  <MAX_BUTTON
                    // onClick={() => onClickMaxSsl(process === 'Stake' ? 'deposit' : 'mint')}
                    className="textTwo"
                  >
                    MAX
                  </MAX_BUTTON>
                </div>
              )}
            </STYLED_SOL>
            {!isSsl ? (
              <STYLED_STAKE_PILL
                loading={process === 'Stake' ? isStakeLoading : isUnstakeLoading}
                disabled={process === 'Stake' ? isStakeLoading : isUnstakeLoading}
                onClick={() => (process === 'Stake' ? onClickStake() : onClickUnstake())}
              >
                {process === 'Stake' ? 'Stake' : 'Unstake and Claim'}
              </STYLED_STAKE_PILL>
            ) : (
              <STYLED_STAKE_PILL
                loading={process === 'Stake' ? isStakeLoading : isWithdrawLoading}
                onClick={() => (process === 'Stake' ? onClickDeposit() : withdrawClicked())}
              >
                {process === 'Stake' ? 'Stake' : 'Unstake and Claim'}
              </STYLED_STAKE_PILL>
            )}
            {name === 'GOFX' ? <Reward>Daily rewards: {`${tokenData.rewards.toFixed(3)} ${name}`}</Reward> : ''}
          </>
        ) : (
          <ConnectWrapper>
            <Connect />
          </ConnectWrapper>
        )}
      </EXPAND_WRAPPER>
    </>
  )
}
