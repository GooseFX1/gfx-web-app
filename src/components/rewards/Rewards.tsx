import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useBreakPoint from '../../hooks/useBreakPoint'
import { Input, InputRef } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from '../../context'
import useRewards from '../../context/rewardsContext'

import { Connection, PublicKey, TokenAmount } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ADDRESSES as rewardAddresses } from 'goosefx-stake-rewards-sdk/dist/constants'
import tw from 'twin.macro'
import 'styled-components/macro'
import { nFormatter } from '../../utils'
import { Loader } from '../Loader'
import { Connect } from '../../layouts'
import { ADDRESSES as SDK_ADDRESS } from 'goosefx-ssl-sdk/dist/constants/swap'
import { CONTROLLER_LAYOUT } from 'goosefx-ssl-sdk'
import { LAMPORTS_PER_SOL } from '../../constants'
import { StakeBottomBar, UnstakeBottomBar } from './StakeUnstakeBottomBar'
import StakeUnstakeToggle from './StakeUnstakeToggle'
import UnstakeConfirmationModal from './UnstakeConfirmationModal'

const EarnRewards: FC = () => {
  const breakpoints = useBreakPoint()
  const inputRef = useRef<InputRef>(null)
  const { wallet, publicKey, connected } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { stake, rewards, getUiAmount } = useRewards()

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
  // const { rewardToggle } = useRewardToggle()
  const getUserGoFXBalance = useCallback(
    async (publicKey: PublicKey, connection: Connection, network: WalletAdapterNetwork) => {
      if (!publicKey) {
        return
      }
      const currentNetwork =
        network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'
      const gofxMint = rewardAddresses[currentNetwork].GOFX_MINT
      const account = await connection.getTokenAccountsByOwner(publicKey, { mint: gofxMint })
      console.log(account)
      if (account.value[0]) {
        const balance = await connection.getTokenAccountBalance(account.value[0].pubkey, 'confirmed')
        setUserGoFxBalance(() => balance.value)
      }
    },
    []
  )

  useEffect(() => {
    getUserGoFXBalance(publicKey, connection, network)
    // poll user balance
    const interval = setInterval(async () => {
      await getUserGoFXBalance(publicKey, connection, network)
    }, 10000)
    return () => clearInterval(interval)
  }, [publicKey, connection, network])
  const totalStaked = useMemo(
    () => getUiAmount(rewards.user.staking.userMetadata.totalStaked),
    [rewards.user.staking.userMetadata.totalStaked]
  )
  const handleHalf = useCallback(async () => {
    let half = '0'
    if (isStakeSelected) {
      half = (userGoFxBalance.uiAmount / 2).toString()
    } else {
      half = (totalStaked / 2).toString()
    }

    setInputValue(parseFloat(half))
    if (inputRef.current) {
      inputRef.current.input.value = half
    }
  }, [userGoFxBalance, inputRef, totalStaked, isStakeSelected])
  const handleMax = useCallback(async () => {
    let max = userGoFxBalance.uiAmount.toString()
    if (!isStakeSelected) max = totalStaked.toString()
    setInputValue(parseFloat(max))
    if (inputRef.current) {
      inputRef.current.input.value = max
    }
  }, [userGoFxBalance, inputRef, isStakeSelected, totalStaked])
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const handleStakeUnstake = useCallback(async () => {
    if (!wallet || !connection || !connected || !inputRef.current) {
      return
    }
    const amount = parseFloat(inputRef.current?.input.value)
    if (!amount || isNaN(amount)) {
      return
    }

    setStakeLoading(true)
    if (isStakeSelected) {
      try {
        await stake(amount)
        console.log(`Successful Stake: ${publicKey.toBase58()} - ${amount}`)
      } catch (error) {
        console.error(error)
      } finally {
        //
      }
    } else {
      setIsUnstakeConfirmationModalOpen(true)
    }
    setStakeLoading(false)
  }, [stake, inputRef, network, isStakeSelected])

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
    if (inputValue == 0) return false
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
            inputRef={inputRef}
            userGoFxBalance={userGoFxBalance}
            setInputValue={setInputValue}
            isStakeLoading={isStakeLoading}
          />
        )}
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
            {nFormatter(userGoFxBalance.uiAmount)} GOFX
          </p>
        </div>
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
            inputRef={inputRef}
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
            `${isStakeSelected ? 'Stake' : 'Unstake'} ${inputValue > 0.0 ? `${nFormatter(inputValue)} GOFX` : ''} `
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

      {isStakeSelected ? <StakeBottomBar /> : <UnstakeBottomBar />}
    </div>
  )
}

export default EarnRewards

const RewardsRightPanel: FC = () => {
  const [apr, setApr] = useState(0)
  const { connection } = useConnectionConfig()
  const { publicKey } = useWallet()
  const { rewards, getClaimableFees, getUiAmount, claimFees } = useRewards()
  const breakpoints = useBreakPoint()
  const [isClaiming, setIsClaiming] = useState(false)
  const fetchGOFXData = async () => {
    try {
      const { data: controllerData } = await connection.getAccountInfo(SDK_ADDRESS.MAINNET.GFX_CONTROLLER)
      const { stakingBalance, dailyReward } = await CONTROLLER_LAYOUT.decode(controllerData)
      const liqidity = Number(stakingBalance / LAMPORTS_PER_SOL)
      const DR = Number(dailyReward / LAMPORTS_PER_SOL)
      const APR: number = (1 / liqidity) * DR * 365 * 100
      return APR
    } catch (err) {
      return err
    }
    console.log(apr)
  }
  useEffect(() => {
    fetchGOFXData()
      .then((apr) => setApr(apr.toFixed(2)))
      .catch((err) => console.error(err))
  }, [])
  const { usdcClaimable, gofxStaked, totalEarned } = useMemo(
    () => ({
      usdcClaimable: getClaimableFees(),
      gofxStaked: getUiAmount(rewards.user.staking.userMetadata.totalStaked, false),
      totalEarned: getUiAmount(rewards.user.staking.userMetadata.totalEarned)
    }),
    [rewards, getClaimableFees, publicKey, connection]
  )
  console.log(rewards.user.staking.userMetadata.totalEarned.toString())
  const handleClaimFees = useCallback(() => {
    setIsClaiming(true)
    claimFees().finally(() => setIsClaiming(false))
  }, [claimFees])
  return (
    <div
      css={tw`flex h-full py-2.5 sm:pt-3.75 gap-3.75 min-md:gap-0 w-full min-md:pt-[45px] flex-col items-center`}
    >
      <div
        css={[
          tw`flex min-md:gap-3.75 min-md:flex-col items-center text-average font-semibold text-grey-5
      leading-normal`
        ]}
      >
        <p tw={'mb-0 hidden'}>Rewards</p>
        <p tw={' min-md:ml-0 min-md:text-[40px] font-semibold min-md:text-white mb-0 '}>APY Coming Soon</p>
      </div>
      <div
        css={[
          tw`flex flex-col text-center text-[15px] min-md:text-lg gap-[15px] min-md:mt-[61px]
           text-grey-5 `
        ]}
      >
        <span
          css={[
            tw`text-2xl text-grey-5 min-md:text-4xl font-semibold leading-10  h-[42px] min-md:h-auto`,
            totalEarned > 0 ? tw`opacity-100` : tw`opacity-60`
          ]}
        >
          {nFormatter(totalEarned)}
        </span>
        <p tw={'mb-0 text-grey-5 text-regular min-md:text-lg font-semibold leading-normal'}>Past $USDC Earnings</p>
      </div>
      <div css={[tw`flex flex-col w-full  gap-3.75 min-md:gap-0 items-center`]}>
        <p
          css={[
            tw`mb-0 text-regular min-md:text-average font-semibold
         text-grey-5 text-center leading-normal`,
            gofxStaked > 0.0 ? tw`opacity-100` : tw`min-md:opacity-[0.6]`
          ]}
        >
          Total Staked: {nFormatter(gofxStaked)} GOFX
        </p>
        <button
          css={[
            tw` min-md:mt-8 w-full min-md:w-[320px] items-center h-10 bg-white
            text-black-4 border-0 font-semibold text-regular leading-normal opacity-[0.5] rounded-[50px]
            min-md:mb-0 overflow-hidden whitespace-nowrap relative flex items-center justify-center py-3.75
            min-md:text-average
            `,
            usdcClaimable > 0.0 ? tw`opacity-100` : tw``,
            isClaiming ? tw`cursor-not-allowed flex justify-center items-center ` : tw``
          ]}
          disabled={usdcClaimable <= 0.0}
          onClick={handleClaimFees}
        >
          {isClaiming ? (
            <div css={[tw`absolute top-[-5px]`]}>
              <Loader color={'#5855FF'} zIndex={2} />
            </div>
          ) : usdcClaimable > 0.0 ? (
            `Claim ${nFormatter(usdcClaimable)} USDC`
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
