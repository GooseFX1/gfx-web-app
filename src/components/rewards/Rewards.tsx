import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useBreakPoint from '../../hooks/useBreakPoint'
import { Input, InputRef } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig, useDarkMode } from '../../context'
import useRewards from '../../context/rewardsContext'

import { TokenAmount } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ADDRESSES as rewardAddresses } from 'goosefx-stake-rewards-sdk/dist/constants'
import tw from 'twin.macro'
import 'styled-components/macro'
import { getAccurateNumber, numberFormatter } from '../../utils'
import { Loader } from '../Loader'
import { Connect } from '../../layouts'
import { StakeBottomBar, UnstakeBottomBar } from './StakeUnstakeBottomBar'
import StakeUnstakeToggle from './StakeUnstakeToggle'
import UnstakeConfirmationModal from './UnstakeConfirmationModal'
import useSolSub, { SubType } from '../../hooks/useSolSub'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import Skeleton from 'react-loading-skeleton'
import useTimer from '../../hooks/useTimer'
import { Tooltip } from '../Tooltip'

const EarnRewards: FC = () => {
  const breakpoints = useBreakPoint()
  const inputRef = useRef<InputRef>(null)
  const { wallet, publicKey, connected } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { stake, totalStaked, gofxValue } = useRewards()
  const [isStakeSelected, setIsStakeSelected] = useState<boolean>(true)
  const [isStakeLoading, setStakeLoading] = useState<boolean>(false)
  const [userGoFxBalance, setUserGoFxBalance] = useState<TokenAmount>(() => ({
    amount: '0.0',
    decimals: 0,
    uiAmount: 0.0,
    uiAmountString: '0.0'
  }))
  const [inputValue, setInputValue] = useState<number>(0.0)
  const [isUnstakeConfirmationModalOpen, setIsUnstakeConfirmationModalOpen] = useState<boolean>(false)
  const { mode } = useDarkMode()
  // const { rewardToggle } = useRewardToggle()
  // const subs = useMemo(()=>([]),[connection,publicKey])
  const { on, off } = useSolSub(connection)
  useEffect(() => {
    on({
      SubType: SubType.AccountChange,
      id: 'user-gofx-balance-staking',
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
        setUserGoFxBalance(balance.value)
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
    return () => {
      off()
      return
    }
  }, [connection, network, publicKey])
  useEffect(() => {
    if (!publicKey) return
    const getData = async () => {
      const currentNetwork =
        network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'

      const gofxMint = rewardAddresses[currentNetwork].GOFX_MINT
      const account = await connection.getTokenAccountsByOwner(publicKey, { mint: gofxMint })
      if (!account || !account.value.length) return

      const balance = await connection.getTokenAccountBalance(account.value[0].pubkey, 'confirmed')

      setUserGoFxBalance(balance.value)
    }
    void getData()
  }, [publicKey, connection, network])

  const handleHalf = useCallback(async () => {
    let half: number
    if (isStakeSelected) {
      half = userGoFxBalance.uiAmount / 2
    } else {
      half = totalStaked / 2
    }

    setInputValue(getAccurateNumber(half))
  }, [userGoFxBalance, totalStaked, isStakeSelected])
  const handleMax = useCallback(async () => {
    let max = userGoFxBalance.uiAmount
    if (!isStakeSelected) max = totalStaked
    setInputValue(getAccurateNumber(max))
  }, [userGoFxBalance, isStakeSelected, totalStaked])
  // focus input on toggle of stake/unstake
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const handleStakeUnstake = useCallback(async () => {
    if (!wallet || !connection || !connected) {
      console.warn('WALLET NOT CONNECTED')
      return
    }

    if (!inputValue || inputValue <= 0) {
      console.warn('INPUT VALUE IS NOT VALID', inputValue)
      return
    }

    setStakeLoading(true)
    if (isStakeSelected) {
      try {
        await stake(inputValue)
        console.log(`Successful Stake: ${publicKey.toBase58()}
         - ${inputValue}`)
      } catch (error) {
        console.error(error)
      } finally {
        //
      }
    } else {
      setIsUnstakeConfirmationModalOpen(true)
    }
    setStakeLoading(false)
  }, [stake, inputValue, network, isStakeSelected])

  const handleInputChange = useCallback((e) => {
    const value = parseFloat(e.target.value)
    setInputValue(isNaN(value) ? 0.0 : value)
  }, [])

  // const handleGoToSwap = useCallback(() => {
  //   history.push({
  //     pathname: '/swap',
  //     search: '?from=SOL&to=GOFX', // query string
  //     state: {
  //       // location state
  //       update: true
  //     }
  //   })

  //   rewardToggle(false)
  // }, [history, rewardToggle])

  const handleUnstakeConfirmationModalClose = useCallback(() => {
    setIsUnstakeConfirmationModalOpen(false)
  }, [])

  const canStakeOrUnstake = useMemo(() => {
    if (inputValue <= 0) return false
    if (isStakeSelected) {
      return inputValue <= userGoFxBalance.uiAmount
    } else {
      return inputValue <= totalStaked
    }
  }, [inputValue, userGoFxBalance.uiAmount, totalStaked])
  // twin.macro crashing on obj.property nested access
  return (
    <div
      css={tw`h-full flex gap-3.75 flex-col overflow-y-scroll min-md:overflow-auto items-center
    min-md:w-[580px]`}
    >
      <UnstakeConfirmationModal
        amount={inputValue}
        isOpen={isUnstakeConfirmationModalOpen}
        onClose={handleUnstakeConfirmationModalClose}
        setStakeLoading={setStakeLoading}
      />
      <div css={tw`flex flex-row w-full justify-between items-center flex-wrap gap-3.75`}>
        {breakpoints.isMobile && (
          <StakeUnstakeToggle
            setIsStakeSelected={setIsStakeSelected}
            isStakeSelected={isStakeSelected}
            userGoFxBalance={userGoFxBalance}
            setInputValue={setInputValue}
            inputValue={inputValue}
            isStakeLoading={isStakeLoading}
          />
        )}
        <Tooltip
          color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
          infoIcon={false}
          title={
            userGoFxBalance.uiAmount > 0.0
              ? `Approx ${numberFormatter(gofxValue * userGoFxBalance.uiAmount, 2)} USD`
              : ''
          }
        >
          <div tw={' flex flex-col min-md:flex-row gap-1 '}>
            <p
              css={tw`text-[15px] leading-[18px] min-md:text-lg mb-0 font-semibold text-grey-1 dark:text-grey-2 w-max`}
            >
              Wallet Balance:
            </p>
            <p
              css={[
                tw`text-[15px] leading-[18px] min-md:text-lg mb-0 font-semibold text-grey-1 dark:text-grey-1`,
                userGoFxBalance.uiAmount > 0 ? tw`text-black-4 dark:text-grey-2` : tw``
              ]}
            >
              {numberFormatter(userGoFxBalance.uiAmount)} GOFX
            </p>
          </div>
        </Tooltip>
        {/* <button
          css={tw`h-10 mt-auto min-md:mt-0 border-0 rounded-full py-2.25 min-md:px-8 font-semibold flex
          items-center justify-center min-md:w-[158px] w-[146px] whitespace-nowrap
            text-regular px-2.5
          `}
          style={{
            background: `linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%)`
          }}
          onClick={handleGoToSwap}
        >
          Swap GOFX now!
        </button> */}
      </div>

      <div css={tw`flex flex-row w-full gap-2.5 min-md:mt-[15px]`}>
        {!breakpoints.isMobile && (
          <StakeUnstakeToggle
            setIsStakeSelected={setIsStakeSelected}
            isStakeSelected={isStakeSelected}
            inputValue={inputValue}
            userGoFxBalance={userGoFxBalance}
            setInputValue={setInputValue}
            isStakeLoading={isStakeLoading}
          />
        )}
        <div
          onClick={focusInput}
          css={tw`
        relative rounded-[100px] h-[40px] w-full min-md:w-[381px] bg-grey-5 dark:bg-black-1
          dark:border-black-1 items-center flex justify-center
        `}
        >
          <div
            css={tw`text-lg absolute  left-[15px] z-[1] flex flex-row gap-[15px]
            `}
          >
            <p
              onClick={handleHalf}
              css={[
                tw`mb-0 text-grey-1 cursor-not-allowed dark:text-grey-1`,
                userGoFxBalance.uiAmount > 0.0 ? tw`cursor-pointer text-primary-gradient-1 dark:text-grey-5` : tw``
              ]}
            >
              Half
            </p>
            <p
              onClick={handleMax}
              css={[
                tw`mb-0 text-grey-1 cursor-not-allowed dark:text-grey-1`,
                userGoFxBalance.uiAmount > 0.0 ? tw`cursor-pointer text-primary-gradient-1 dark:text-grey-5` : tw``
              ]}
            >
              Max
            </p>
          </div>

          <Input
            css={tw`text-lg h-10 min-md:w-[381px] w-full rounded-[100px] bg-grey-5 text-grey-1
            placeholder-grey-1  border-transparent active:border-grey-1 hover:border-grey-1  focus:border-grey-1
            dark:bg-black-1 dark:text-grey-2 focus:dark:border-grey-2 active:dark:border-grey-2
            hover:dark:border-grey-2 pr-[80px] dark:placeholder-grey-2 h-10
            `}
            ref={inputRef}
            maxLength={12}
            pattern="\d+(\.\d+)?"
            placeholder={'0'}
            onChange={handleInputChange}
            type={'number'}
            value={inputValue > 0.0 ? inputValue : ''}
          />
          <p
            css={tw`mb-0 text-lg absolute right-[15px] z-[1] text-grey-1
            dark:text-grey-2 font-semibold
            `}
          >
            GOFX
          </p>
        </div>
      </div>

      {connected ? (
        <button
          onClick={handleStakeUnstake}
          css={[
            tw`w-full bg-grey-5 dark:bg-black-1 border-0 relative
           rounded-full py-[14px] px-2 text-[18px] leading-[22px] font-semibold text-grey-1 dark:text-grey-2
           h-10 flex items-center justify-center
           `,
            canStakeOrUnstake ? tw`bg-blue-1 text-white dark:bg-blue-1 dark:text-white cursor-pointer` : tw``,
            isStakeLoading ? tw`cursor-not-allowed flex justify-center items-center opacity-80` : tw``
          ]}
          disabled={!canStakeOrUnstake}
        >
          {isStakeLoading ? (
            <div css={[tw`absolute `]}>
              <Loader zIndex={2} />
            </div>
          ) : userGoFxBalance.uiAmount > 0.0 ? (
            `${isStakeSelected ? 'Stake' : 'Unstake'} ${
              inputValue > 0.0
                ? `${numberFormatter(inputValue, inputValue < 0.1 && inputValue > 1e-6 ? 4 : 2)} GOFX`
                : ''
            } `
          ) : (
            'Insufficient GOFX'
          )}
        </button>
      ) : (
        <Connect
          containerStyle={[tw`w-full min-md:w-full h-10`]}
          customButtonStyle={[tw` min-md:h-10 w-full max-w-full`]}
        />
      )}

      {isStakeSelected ? (
        <StakeBottomBar proposedStakeAmount={isStakeSelected ? inputValue : 0.0} />
      ) : (
        <UnstakeBottomBar />
      )}
    </div>
  )
}

export default EarnRewards

const RewardsRightPanel: FC = () => {
  const [apy, setApy] = useState<string | undefined>()
  const {
    totalEarned,
    totalStaked,
    claimable,
    claimFees,
    totalStakedInUSD,
    userStakeRatio,
    totalStakedGlobally,
    gofxValue
  } = useRewards()
  const breakpoints = useBreakPoint()
  const { connected } = useWallet()
  const [isClaiming, setIsClaiming] = useState(false)
  const { mode } = useDarkMode()
  const { time, isDone } = useTimer({
    targetTime: {
      hour: 9,
      minute: 30,
      second: 0
    },
    format: `HH[H] mm[min]`,
    offsetToFuture: true
  })
  useEffect(() => {
    fetch('https://api-services.goosefx.io/gofx-stake/getApy')
      .then((res) => res.json())
      .then((res) => setApy(res.data))
      .catch((err) => console.error('failed to fetch apy', err))
  }, [])
  // retrieves value from rewards hook -> usdcClaimable has already been converte to UI amount

  const handleClaimFees = useCallback(() => {
    setIsClaiming(true)
    claimFees().finally(() => setIsClaiming(false))
  }, [claimFees])
  const stakeRatio = useMemo(() => numberFormatter(userStakeRatio, 2), [userStakeRatio])
  return (
    <div css={tw`flex h-full py-2.5 sm:pt-3.75 gap-3 min-md:gap-16 w-full min-md:pt-[45px] flex-col items-center`}>
      <div
        css={[
          tw`flex min-md:gap-3.75 min-md:flex-col items-center text-average font-semibold text-grey-5 leading-normal`
        ]}
      >
        <p tw={' min-md:ml-0 min-md:text-[40px] font-semibold min-md:text-white mb-0 '}>
          {!apy ? <Skeleton /> : `APY ${apy}%`}
        </p>
      </div>
      <div css={[tw`flex flex-col text-center text-[15px] min-md:text-lg text-grey-5 sm:gap-1 min-md:gap-4`]}>
        <span
          css={[
            tw`text-2xl text-grey-5 min-md:text-4xl font-semibold leading-10 h-[42px] min-md:h-auto`,
            totalEarned > 0 ? tw`opacity-100` : tw`opacity-60`
          ]}
        >
          ${numberFormatter(totalEarned, totalEarned < 0.1 && totalEarned > 1e-6 ? 4 : 2)}
        </span>
        <p tw={'mb-0 text-grey-5 text-regular min-md:text-lg font-semibold leading-normal'}>Past $USDC Earnings</p>
      </div>
      <div css={[tw`flex flex-col w-full  gap-3.75 min-md:gap-0 items-center`]}>
        <div css={[tw`flex flex-row `]}>
          <Tooltip
            color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
            infoIcon={false}
            title={totalStaked > 0.0 ? `Approx. ${numberFormatter(totalStakedInUSD, 2)} USD` : ''}
          >
            <p
              css={[
                tw`mb-0 text-regular min-md:text-average font-semibold
         text-grey-5 text-center leading-normal`,
                totalStaked > 0.0 ? tw`opacity-100` : tw`min-md:opacity-[0.6]`
              ]}
            >
              Total Staked: {numberFormatter(totalStaked)} GOFX
            </p>
          </Tooltip>
          <Tooltip className={'ml-0'} color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}>
            <div css={[tw`flex flex-col gap-1 flex-wrap  `]}>
              <Tooltip
                infoIcon={false}
                color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                title={
                  totalStakedGlobally > 0.0
                    ? `Approx. ${numberFormatter(totalStakedGlobally * gofxValue, 2)} USD`
                    : ''
                }
              >
                <p css={[tw`mb-0`]}>Globally Staked {numberFormatter(totalStakedGlobally, 2)} GOFX</p>
              </Tooltip>
              {totalStaked > 0 && (
                <p css={[tw`mb-0 `, totalStaked > 0.0 ? tw`opacity-100` : tw`min-md:opacity-[0.6]`]}>
                  My Stake Ratio ≈ {stakeRatio == '0.00' ? '<0.01' : stakeRatio}%
                </p>
              )}
            </div>
          </Tooltip>
        </div>
        <button
          css={[
            tw` w-full min-md:w-[320px] items-center h-10 bg-white mt-2 min-md:mb-0
            text-black-4 border-0 font-semibold text-regular leading-normal opacity-[0.5] rounded-[50px]
            overflow-hidden whitespace-nowrap relative flex justify-center py-3.75
            min-md:text-average
            `,
            claimable > 0.0 ? tw`opacity-100` : tw``,
            isClaiming ? tw`cursor-not-allowed flex justify-center items-center ` : tw``
          ]}
          disabled={claimable <= 0.0}
          onClick={handleClaimFees}
        >
          {isClaiming ? (
            <div css={[tw`absolute`]}>
              <Loader color={'#5855FF'} zIndex={2} />
            </div>
          ) : claimable > 0.0 ? (
            `Claim ${numberFormatter(claimable, claimable < 0.1 && claimable > 1e-6 ? 4 : 2)} USDC`
          ) : connected && !isDone && Boolean(time) && totalStaked > 0.0 ? (
            `Claim in ${time}`
          ) : (
            'No USDC Claimable'
          )}
        </button>
      </div>
      {!breakpoints.isMobile && (
        <p css={tw`mt-auto mb-[15px] text-white text-[13px] font-semibold leading-[16px] text-center`}>
          During cooldown no rewards will be earned
        </p>
      )}
    </div>
  )
}

export { RewardsRightPanel }
