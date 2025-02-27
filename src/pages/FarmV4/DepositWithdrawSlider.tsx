import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogOverlay, DialogPortal } from 'gfx-component-lib'
import { useConnectionConfig, useGamma, usePriceFeedFarm } from '@/context'
import DepositWithdrawInput from './DepositWithdrawInput'
import DepositWithdrawToggle from './DepositWithdrawToggle'
import DepositWithdrawAccordion from './DepositWithdrawAccordion'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import { TokenRow } from './TokenRow'
import { ReviewConfirm } from './ReviewConfirm'
import StickyFooter from './StickyFooter'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModeOfOperation } from './constants'
import { DepositWithdrawHeader } from './DepositWithdrawHeader'
import useBreakPoint from '@/hooks/useBreakPoint'
import GammaActionModal from '@/pages/FarmV4/GammaActionModal'
import GammaActionModalContentStack from '@/pages/FarmV4/GammaActionModalContentStack'
import useTransaction from '@/hooks/useTransaction'
import {
  calculateOtherTokenAndLPAmount,
  deposit,
  getAmmConfigId,
  getLiquidityPoolKey,
  getpoolId,
  lpTokensToTradingTokens,
  withdraw,
  getMaxSolDepositAmount
} from '@/web3/Farm'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { withdrawBigStringFarm } from '@/utils/misc'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { bigNumberFormatter } from '@/utils'
import { blob, publicKey as pbk, struct, u128, u64, u8 } from '@/utils/marshmallow'
//import useBoolean from '@/hooks/useBoolean'
//import LottieConfetti from '@/pages/FarmV4/LottieConfetti'
import { u16 } from '@solana/buffer-layout'
import useDebounce from '@/hooks/useDebounce'

const POOL_STATE_LAYOUT = struct([
  blob(8, 'discriminator'),
  pbk('amm_config'),
  pbk('pool_creator'),
  pbk('token_0_vault'),
  pbk('token_1_vault'),
  blob(32, '_padding1'),
  pbk('token_0_mint'),
  pbk('token_1_mint'),
  pbk('token_0_program'),
  pbk('token_1_program'),
  pbk('observation_key'),
  u8('auth_bump'),
  u8('status'),
  u8('_padding2'),
  u8('mint_0_decimals'),
  u8('mint_1_decimals'),
  u64('lp_supply'),
  u64('protocol_fees_token_0'),
  u64('protocol_fees_token_1'),
  u64('fund_fees_token_0'),
  u64('fund_fees_token_1'),
  u64('open_time'),
  u64('recent_epoch'),
  u128('cumulative_trade_fees_token_0'),
  u128('cumulative_trade_fees_token_1'),
  u128('cumulative_volume_token_0'),
  u128('cumulative_volume_token_1'),
  u64('latest_dynamic_fee_rate'),
  u64('max_trade_fee_rate'),
  u64('volatility_factor'),
  u64('token_0_vault_amount'),
  u64('token_1_vault_amount')
])

const USER_POOL_LIQUIDITY_LAYOUT = struct([
  blob(8, 'discriminator'),
  pbk('user'),
  pbk('pool_state'),
  u128('token_0_deposited'),
  u128('token_1_deposited'),
  u128('token_0_withdrawn'),
  u128('token_1_withdrawn'),
  u128('lp_tokens_owned'),
  pbk('referrer')
])

const AMM_CONFIG_LAYOUT = struct([
  blob(8, 'discriminator'),
  u8('bump'),
  u8('disable_create_pool'),
  u16('index'),
  u64('trade_fee_rate')
])

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const { isMobile } = useBreakPoint()
  const { connection } = useConnectionConfig()
  const {
    selectedCard,
    openDepositWithdrawSlider,
    setOpenDepositWithdrawSlider,
    selectedCardPool,
    modeOfOperation,
    setModeOfOperation,
    setSelectedCard,
    setSelectedCardPool,
    slippage,
    sendingTransaction,
    setSendingTransaction,
    selectedCardLiquidityAcc,
    setSelectedCardLiquidityAcc,
    forceCronAndUpdateLocalData
  } = useGamma()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<number>()
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<number>()
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<string>('')
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<string>('')
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<string>('')
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<string>('')
  const [transactionLPAmount, setTransactionLPAmount] = useState<BN>()
  //const [isButtonLoading, setIsButtonLoading] = useBoolean()
  //const [isClaim, setIsClaim] = useBoolean(false)
  const [actionType, setActionType] = useState<string>('')
  const isDeposit = useMemo(() => modeOfOperation === ModeOfOperation.DEPOSIT, [modeOfOperation])
  const { GammaProgram } = usePriceFeedFarm()
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { balance, publicKey } = useWalletBalance()
  const [updatedPoolState, setUpdatedPoolState] = useState<any>({})
  const [withdrawableBalanceA, setWithdrawableBalanceA] = useState<BN>(new BN(0))
  const [withdrawableBalanceB, setWithdrawableBalanceB] = useState<BN>(new BN(0))
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false)
  const [isSolMaxDeposit, setIsSolMaxDeposit] = useState<boolean>(false)
  const [userSourceTokenType, setUserSourceTokenType] = useState<'spl-token' | 'native' | 'spl-token-2022' | ''>(
    ''
  )
  const [userTargetTokenType, setUserTargetTokenType] = useState<'spl-token' | 'native' | 'spl-token-2022' | ''>(
    ''
  )
  const {debounce, abortDebounce} = useDebounce()

  useEffect(() => {
    ;(async () => {
      if (Object.keys(selectedCardPool)?.length && userPublicKey) {
        try {
          let id = null
          const poolIdKey = await getpoolId(selectedCard)
          const liquidityAcc = await getLiquidityPoolKey(poolIdKey, userPublicKey)
          id = connection.onAccountChange(liquidityAcc, async (info) => {
            const decodedAccount = USER_POOL_LIQUIDITY_LAYOUT.decode(info.data)
            const updatedLiqAcc = {
              user: decodedAccount.user,
              lpTokensOwned: decodedAccount.lp_tokens_owned,
              poolState: decodedAccount.pool_state,
              referrer: decodedAccount.referrer,
              token0Deposited: decodedAccount.token_0_deposited,
              token1Deposited: decodedAccount.token_1_deposited,
              token0Withdrawn: decodedAccount.token_0_withdrawn,
              token1Withdrawn: decodedAccount.token_1_withdrawn
            }
            setSelectedCardLiquidityAcc(updatedLiqAcc)
            connection.removeAccountChangeListener(id)
          })
        } catch (e) {
          console.log('Error in getting the updated liquidity account on account change', e)
        }
        try {
          const poolIdKey = await getpoolId(selectedCard)
          const id = connection.onAccountChange(poolIdKey, async (info) => {
            const decodedAccount = POOL_STATE_LAYOUT.decode(info.data)
            const updatedPoolData = {
              ...selectedCardPool,
              lpSupply: decodedAccount.lp_supply,
              protocolFeesToken0: decodedAccount.protocol_fees_token_0,
              protocolFeesToken1: decodedAccount.protocol_fees_token_1,
              cumulativeTradeFeesToken0: decodedAccount.cumulative_trade_fees_token_0,
              cumulativeTradeFeesToken1: decodedAccount.cumulative_trade_fees_token_1,
              latestDynamicFeeRate: decodedAccount.latest_dynamic_fee_rate,
              fundFeesToken0: decodedAccount.fund_fees_token_0,
              fundFeesToken1: decodedAccount.fund_fees_token_1,
              token0Vault: decodedAccount.token_0_vault,
              token1Vault: decodedAccount.token_1_vault,
              mint0Decimals: selectedCardPool?.mint0Decimals,
              mint1Decimals: selectedCardPool?.mint1Decimals
            }
            setUpdatedPoolState(updatedPoolData)
            connection.removeAccountChangeListener(id)
          })
        } catch (e) {
          console.log('Error in getting the updated pool state account on account change', e)
        }
      }
    })()
  }, [selectedCardLiquidityAcc, updatedPoolState, selectedCardPool, userPublicKey])

  useEffect(() => {
    ;(async () => {
      try {
        if (Object.keys(selectedCard)?.length > 0) {
          const poolIdKey = await getpoolId(selectedCard)
          const accountInfo = await connection.getAccountInfo(poolIdKey)
          const decodedAccount = POOL_STATE_LAYOUT.decode(accountInfo.data)
          const updatedPoolData = {
            ...selectedCardPool,
            lpSupply: decodedAccount.lp_supply,
            protocolFeesToken0: decodedAccount.protocol_fees_token_0,
            protocolFeesToken1: decodedAccount.protocol_fees_token_1,
            comulativeTradeFeesToken0: decodedAccount.cumulative_trade_fees_token_0,
            comulativeTradeFeesToken1: decodedAccount.cumulative_trade_fees_token_1,
            latestDynamicFeeRate: decodedAccount.latest_dynamic_fee_rate,
            fundFeesToken0: decodedAccount.fund_fees_token_0,
            fundFeesToken1: decodedAccount.fund_fees_token_1,
            token0Vault: decodedAccount.token_0_vault,
            token1Vault: decodedAccount.token_1_vault,
            mint0Decimals: selectedCardPool?.mint0Decimals,
            mint1Decimals: selectedCardPool?.mint1Decimals
          }
          setUpdatedPoolState(updatedPoolData)
        }
      } catch (e) {
        console.log('Error in getting the pool state account', e)
      }

      try {
        const configKey = await getAmmConfigId(0)
        const accountInfo = await connection.getAccountInfo(configKey)
        const decodedAccount = AMM_CONFIG_LAYOUT.decode(accountInfo.data)
        const updatedPoolData = {
          ...selectedCardPool,
          trade_fee_rate: decodedAccount.trade_fee_rate
        }
        setUpdatedPoolState(updatedPoolData)
      } catch (e) {
        console.log('Error in getting the config account info', e)
      }
    })()
  }, [selectedCardPool])

  useEffect(() => {
    ;(async () => {
      try {
        if (Object.keys(selectedCardLiquidityAcc)?.length > 0 && Object.keys(selectedCardPool)?.length > 0) {
          const { tokenAmount0, tokenAmount1 } = await lpTokensToTradingTokens(
            selectedCardLiquidityAcc?.lpTokensOwned,
            Object.keys(updatedPoolState)?.length > 0 ? updatedPoolState : selectedCardPool,
            connection
          )
          //console.log("tokenAmount", tokenAmount0?.toNumber(), tokenAmount1?.toNumber())
          setWithdrawableBalanceA(tokenAmount0)
          setWithdrawableBalanceB(tokenAmount1)
        } else {
          setWithdrawableBalanceA(new BN(0))
          setWithdrawableBalanceB(new BN(0))
        }
      } catch (e) {
        console.log('Error while setting token amounts for withdrawing', e)
      }
    })()
  }, [selectedCardLiquidityAcc, selectedCardPool, updatedPoolState])

  // console.log('selectedCardLiquidityAcc',
  //   selectedCardLiquidityAcc?.lpTokensOwned?.toNumber(),
  //   selectedCardLiquidityAcc?.token0Deposited?.toNumber(),
  //   selectedCardLiquidityAcc?.token0Withdrawn?.toNumber(),
  //   selectedCardLiquidityAcc?.token1Deposited?.toNumber(),
  //   selectedCardLiquidityAcc?.token1Withdrawn?.toNumber()
  // )

  // console.log('poolState',
  //   selectedCardPool?.lpSupply?.toNumber(),
  //   selectedCardPool?.token0Vault?.toBase58(),
  //   selectedCardPool?.token1Vault?.toBase58(),
  //   selectedCardPool?.protocolFeesToken0?.toNumber(),
  //   selectedCardPool?.protocolFeesToken0?.toNumber(),
  //   selectedCardPool?.fundFeesToken0?.toNumber(),
  //   selectedCardPool?.fundFeesToken1?.toNumber()
  // )

  // console.log('updatedPoolstate',
  //   updatedPoolState?.lpSupply?.toNumber(),
  //   updatedPoolState?.token0Vault?.toBase58(),
  //   updatedPoolState?.token1Vault?.toBase58(),
  //   updatedPoolState?.protocolFeesToken0?.toNumber(),
  //   updatedPoolState?.protocolFeesToken0?.toNumber(),
  //   updatedPoolState?.fundFeesToken0?.toNumber(),
  //   updatedPoolState?.fundFeesToken1?.toNumber()
  // )

  //eslint-disable-next-line
  useEffect(() => {
    return () => {
      handleClose()
    }
  }, [])

  useEffect(() => {
    if (selectedCard && userPublicKey) {
      setUserSourceTokenBal(balance[selectedCard?.mintA?.address].tokenAmount.uiAmount)
      setUserTargetTokenBal(balance[selectedCard?.mintB?.address].tokenAmount.uiAmount)
    }
  }, [selectedCard, balance, userPublicKey])

  useEffect(() => {
    if (selectedCard && userPublicKey) {
      setUserSourceTokenType(balance[selectedCard?.mintA?.address].tokenType)
      setUserTargetTokenType(balance[selectedCard?.mintB?.address].tokenType)
    }
  }, [selectedCard, balance, userPublicKey])

  const handleClose = () => {
    setUserSourceDepositAmount('')
    setUserSourceWithdrawAmount('')
    setUserTargetDepositAmount('')
    setUserTargetWithdrawAmount('')
    setSelectedCard({})
    setSelectedCardPool({})
    setSelectedCardLiquidityAcc({})
    setUpdatedPoolState({})
    setModeOfOperation(ModeOfOperation?.DEPOSIT)
  }

  const handleInputChange = async (input: string, sourceToken: boolean) => {
    abortDebounce();
    setIsUserTyping(true)
    setIsSolMaxDeposit(false)
    if (input === '') {
      if (isDeposit) {
        setUserSourceDepositAmount('')
        setUserTargetDepositAmount('')
      } else {
        setUserSourceWithdrawAmount('')
        setUserTargetWithdrawAmount('')
      }
      setIsUserTyping(false)
      return
    }
    if (isNaN(+input)) {
      setIsUserTyping(false)
      return
    }
    let funcToCallInDebounce
    const debouncedFunc = async () => {
      if (Object.keys(selectedCardPool)?.length) {
        const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
          input,
          sourceToken ? 0 : 1,
          Object.keys(updatedPoolState)?.length > 0 ? updatedPoolState : selectedCardPool,
          connection
        )
        setTransactionLPAmount(lpTokenAmount)
        funcToCallInDebounce(otherTokenAmountInString)
      }
    }

    switch (true) {
      case isDeposit && sourceToken: // deposit source
        setUserSourceDepositAmount(input)
        funcToCallInDebounce = setUserTargetDepositAmount
        console.log('deposit source')
        break;
      case isDeposit && !sourceToken: // deposit target
        setUserTargetDepositAmount(input)
        funcToCallInDebounce = setUserSourceDepositAmount
        console.log('deposit target')
        break;
      case !isDeposit && sourceToken: // withdraw source
        setUserSourceWithdrawAmount(input)
        funcToCallInDebounce = setUserTargetWithdrawAmount
        console.log('withdraw source')
        break;
      case !isDeposit && !sourceToken: // withdraw target
        setUserTargetWithdrawAmount(input)
        funcToCallInDebounce = setUserSourceWithdrawAmount
        console.log('withdraw target')
        break;
      default:
        break;
    }

    debounce(debouncedFunc, 333)

    setIsUserTyping(false)
  }

  const actionButtonText = useMemo(() => {
    if (isDeposit && !userSourceTokenBal && !userTargetTokenBal) return `Insufficient Tokens`
    else if (isDeposit && !userSourceTokenBal) return `Insufficient ${selectedCard?.mintA?.symbol}`
    else if (isDeposit && !userTargetTokenBal) return `Insufficient ${selectedCard?.mintB?.symbol}`
    else if (
      isDeposit &&
      (+userSourceDepositAmount > userSourceTokenBal || +userTargetDepositAmount > userTargetTokenBal)
    )
      return `Insufficient funds!`
    else if (
      isDeposit &&
      (!userSourceDepositAmount ||
        new BigNumber(userSourceDepositAmount)?.isZero() ||
        !userTargetDepositAmount ||
        new BigNumber(userTargetDepositAmount)?.isZero())
    )
      return `Enter Amounts`
    else if (
      !isDeposit &&
      (!userSourceWithdrawAmount ||
        new BigNumber(userSourceWithdrawAmount)?.isZero() ||
        !userTargetWithdrawAmount ||
        new BigNumber(userTargetWithdrawAmount)?.isZero())
    )
      return `Enter Amounts`
    else if (
      !isDeposit &&
      (new BigNumber(userSourceWithdrawAmount)?.isGreaterThan(
        new BigNumber(withdrawBigStringFarm(withdrawableBalanceA?.toString(), selectedCardPool?.mint0Decimals))
      ) ||
        new BigNumber(userTargetWithdrawAmount)?.isGreaterThan(
          new BigNumber(withdrawBigStringFarm(withdrawableBalanceB?.toString(), selectedCardPool?.mint1Decimals))
        ))
    )
      return `Insufficient funds!`
    else if (isDeposit) return `Deposit`
    else return `Withdraw`
  }, [
    selectedCard,
    userSourceTokenBal,
    userTargetTokenBal,
    userTargetWithdrawAmount,
    userSourceDepositAmount,
    userTargetDepositAmount,
    isDeposit,
    userSourceWithdrawAmount,
    selectedCardLiquidityAcc
  ])

  const isActionButtonDisabled = useMemo(() => {
    if (isDeposit && (!userSourceTokenBal || !userTargetTokenBal)) return true
    else if (
      isDeposit &&
      (!userSourceDepositAmount ||
        new BigNumber(userSourceDepositAmount)?.isZero() ||
        !userTargetDepositAmount ||
        new BigNumber(userTargetDepositAmount)?.isZero())
    )
      return true
    else if (
      !isDeposit &&
      (!userSourceWithdrawAmount ||
        new BigNumber(userSourceWithdrawAmount)?.isZero() ||
        !userTargetWithdrawAmount ||
        new BigNumber(userTargetWithdrawAmount)?.isZero())
    )
      return true
    else if (
      isDeposit &&
      (+userSourceDepositAmount > userSourceTokenBal || +userTargetDepositAmount > userTargetTokenBal)
    )
      return true
    else if (
      !isDeposit &&
      (new BigNumber(userSourceWithdrawAmount)?.isGreaterThan(
        new BigNumber(withdrawBigStringFarm(withdrawableBalanceA?.toString(), selectedCardPool?.mint0Decimals))
      ) ||
        new BigNumber(userTargetWithdrawAmount)?.isGreaterThan(
          new BigNumber(withdrawBigStringFarm(withdrawableBalanceB?.toString(), selectedCardPool?.mint1Decimals))
        ))
    )
      return true
  }, [
    userSourceTokenBal,
    userTargetTokenBal,
    userTargetWithdrawAmount,
    userSourceDepositAmount,
    userTargetDepositAmount,
    isDeposit,
    userSourceWithdrawAmount,
    selectedCardLiquidityAcc,
    withdrawableBalanceA,
    withdrawableBalanceB,
    selectedCardPool
  ])

  const handleHalf = useCallback(
    async (sourceToken: boolean) => {
      setIsUserTyping(true)
      setIsSolMaxDeposit(false)
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(userSourceTokenBal ? (userSourceTokenBal / 2)?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              (userSourceTokenBal / 2)?.toString(),
              0,
              Object.keys(updatedPoolState)?.length > 0 ? updatedPoolState : selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetDepositAmount(otherTokenAmountInString)
          }
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? (userTargetTokenBal / 2)?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              (userTargetTokenBal / 2)?.toString(),
              1,
              Object.keys(updatedPoolState)?.length > 0 ? updatedPoolState : selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceDepositAmount(otherTokenAmountInString)
          }
        }
      } else {
        setTransactionLPAmount(selectedCardLiquidityAcc?.lpTokensOwned?.div(new BN(2)))
        setUserSourceWithdrawAmount(
          withdrawBigStringFarm(withdrawableBalanceA?.div(new BN(2))?.toString(), selectedCardPool?.mint0Decimals)
        )
        setUserTargetWithdrawAmount(
          withdrawBigStringFarm(withdrawableBalanceB?.div(new BN(2))?.toString(), selectedCardPool?.mint1Decimals)
        )
      }
      setIsUserTyping(false)
    },
    [
      modeOfOperation,
      userSourceTokenBal,
      userTargetTokenBal,
      selectedCardPool,
      updatedPoolState,
      selectedCardLiquidityAcc,
      withdrawableBalanceA,
      withdrawableBalanceB
    ]
  )

  const handleMax = useCallback(
    async (sourceToken: boolean) => {
      setIsUserTyping(true)
      if (isDeposit) {
        if (sourceToken) {
          selectedCard?.mintA?.symbol === 'SOL' ? setIsSolMaxDeposit(true) : setIsSolMaxDeposit(false)
          setUserSourceDepositAmount(userSourceTokenBal ? userSourceTokenBal?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              selectedCard?.mintA?.symbol === 'SOL'
                ? await getMaxSolDepositAmount(userSourceTokenBal, connection)
                : userSourceTokenBal?.toString(),
              0,
              Object.keys(updatedPoolState)?.length > 0 ? updatedPoolState : selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetDepositAmount(otherTokenAmountInString)
          }
        } else {
          selectedCard?.mintB?.symbol === 'SOL' ? setIsSolMaxDeposit(true) : setIsSolMaxDeposit(false)
          setUserTargetDepositAmount(userTargetTokenBal ? userTargetTokenBal?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              selectedCard?.mintB?.symbol === 'SOL'
                ? await getMaxSolDepositAmount(userTargetTokenBal, connection)
                : userTargetTokenBal?.toString(),
              1,
              Object.keys(updatedPoolState)?.length > 0 ? updatedPoolState : selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceDepositAmount(otherTokenAmountInString)
          }
        }
      } else {
        setTransactionLPAmount(selectedCardLiquidityAcc?.lpTokensOwned)
        setUserSourceWithdrawAmount(
          withdrawBigStringFarm(withdrawableBalanceA.toString(), selectedCardPool?.mint0Decimals)
        )
        setUserTargetWithdrawAmount(
          withdrawBigStringFarm(withdrawableBalanceB.toString(), selectedCardPool?.mint1Decimals)
        )
      }
      setIsUserTyping(false)
    },
    [
      modeOfOperation,
      userSourceTokenBal,
      userTargetTokenBal,
      selectedCardPool,
      updatedPoolState,
      selectedCardLiquidityAcc,
      withdrawableBalanceA,
      withdrawableBalanceB
    ]
  )

  const handleDeposit = async () => {
    try {
      const txBuilder = createTransactionBuilder()
      const tx = await deposit(
        userSourceDepositAmount,
        userTargetDepositAmount,
        transactionLPAmount,
        slippage,
        selectedCard,
        userPublicKey,
        GammaProgram,
        connection,
        userSourceTokenType,
        userTargetTokenType,
        isSolMaxDeposit
      )
      txBuilder.add(tx)
      setSendingTransaction(true)
      const poolMessage = `(${selectedCard?.mintA?.symbol}-${selectedCard?.mintB?.symbol}) pool.`
      // eslint-disable-next-line max-len
      const sourceAmount = `${bigNumberFormatter(
        new BigNumber(isDeposit ? userSourceDepositAmount : userSourceWithdrawAmount)
      )} ${selectedCard?.mintA?.symbol}`
      // eslint-disable-next-line max-len
      const targetAmount = `${bigNumberFormatter(
        new BigNumber(isDeposit ? userTargetDepositAmount : userTargetWithdrawAmount)
      )} ${selectedCard?.mintB?.symbol}`
      const type = isDeposit ? 'deposited' : 'withdrew'
      const direction = isDeposit ? 'into' : 'from'
      const { success, txSig } = await sendTransaction(txBuilder, {
        successMessage: `You successfully ${type} ${sourceAmount}, ${targetAmount} ${direction} ${poolMessage}`
      })
      //console.log('success', success)
      console.log('DepositResponse', success)
      if (!success) {
        //off(connectionId)
        console.log('An error occurred while depositing!')
        setSendingTransaction(false)
        return
      } else {
        setSendingTransaction(false)
        setUserSourceDepositAmount('')
        setUserTargetDepositAmount('')
        await forceCronAndUpdateLocalData(txSig)
        //setOpenDepositWithdrawSlider(false)
        //setSelectedCardLiquidityAcc({})
      }
    } catch (e) {
      setSendingTransaction(false)
      console.log('An error occurred while depositing.', e)
    }
  }

  const handleWithdraw = async () => {
    try {
      const txBuilder = createTransactionBuilder()
      const tx = await withdraw(
        userSourceWithdrawAmount,
        userTargetWithdrawAmount,
        transactionLPAmount,
        slippage,
        selectedCard,
        userPublicKey,
        GammaProgram,
        connection,
        userSourceTokenType,
        userTargetTokenType
      )
      txBuilder.add(tx)
      setSendingTransaction(true)
      const { success, txSig } = await sendTransaction(txBuilder)

      if (!success) {
        //off(connectionId)
        console.log('An error occurred while withdrawing!')
        setSendingTransaction(false)
        return
      } else {
        setSendingTransaction(false)
        setUserSourceWithdrawAmount('')
        setUserTargetWithdrawAmount('')
        setActionType('')
        await forceCronAndUpdateLocalData(txSig)
        // setOpenDepositWithdrawSlider(false)
        // setSelectedCardLiquidityAcc({})
        // setModeOfOperation(ModeOfOperation.DEPOSIT)
      }
    } catch (e) {
      setSendingTransaction(false)
      console.log('An error occurred while withdrawing.', e)
    }
  }

  // const handleClaim = () => {
  //   console.log('withdraw')
  //   setIsButtonLoading.on()
  //   setActionType('claim')
  // }

  //eslint-disable-next-line
  const handleProcessStart = (type: 'claim' | 'withdraw') => {
    return () => {
      // if (type === 'claim') {
      //   setIsClaim.on()
      // }
      //console.log('performing', type)
      setOpenDepositWithdrawSlider(true)
      setActionType(type)
    }
  }

  const handleActionCancel = () => {
    setActionType('')
    //setIsClaim.off()
    //setIsButtonLoading.off()
  }

  //const claimableReward = 0

  const { actionLabel, actionModalTitle } = useMemo(() => {
    const actionModalTitle = 'Withdraw'
    const actionLabel = `Withdraw ${(+userSourceWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintA?.symbol} +
     ${(+userTargetWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintB?.symbol}`

    // if (isClaim) {
    //   actionModalTitle = 'Claim'
    //   actionLabel = `Claim ${claimableReward} SOME REWARD HERE`
    // }

    return { actionLabel, actionModalTitle }
  }, [isDeposit, userSourceWithdrawAmount, userTargetWithdrawAmount])

  return (
    <Dialog open={openDepositWithdrawSlider} onOpenChange={setOpenDepositWithdrawSlider}>
      <DialogPortal>
        <DialogOverlay />

        {/*This one for not closing on click outside*/}
        {/*<div*/}
        {/*  className={cn(`fixed top-0 left-0 w-screen h-screen z-10 bg-black-4 dark:bg-black-4 bg-opacity-50*/}
        {/*dark:bg-opacity-50 backdrop-blur-sm*/}
        {/*`)}*/}
        {/*/>*/}
        <DialogContent
          className={`sm:w-[393px] sm:max-h-screen border-1 border-solid sm:border-r-0 dark:border-black-4
      sm:rounded-none border-b-0 rounded-b-[0px] max-h-[calc(100vh-56px)] gap-0
      `}
          fullScreen={true}
          placement={isMobile ? 'bottom' : 'right'}
          // onInteractOutside={(e) => e.preventDefault()}
          aria-describedby={null}
          onCloseAutoFocus={() => {
            handleClose()
          }}
        >
          <GammaActionModal
            isOpen={actionType != '' && actionType != 'deposit'}
            setIsOpen={(b) => {
              if (!b) {
                handleActionCancel()
              }
            }}
            title={actionModalTitle}
            actionLabel={actionLabel}
            onActionClick={!isDeposit ? handleWithdraw : handleDeposit}
            actionType={actionType}
            loading={sendingTransaction}
          >
            <GammaActionModalContentStack
              options={[
                {
                  textLeft: `${selectedCard?.mintA?.symbol} Amount`,
                  textRight: `≈ ${(+userSourceWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintA?.symbol}`
                },
                {
                  textLeft: `${selectedCard?.mintB?.symbol} Amount`,
                  textRight: `≈ ${(+userTargetWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintB?.symbol}`
                },
                // {
                //   textLeft: 'Claim Reward',
                //   textRight: '2500 GOFX'
                // },
                {
                  textLeft: 'Total Amount in USDC',
                  textRight: `≈ $${bigNumberFormatter(
                    new BigNumber(balance[selectedCard?.mintA?.address]?.price)
                      .multipliedBy(userSourceWithdrawAmount)
                      .plus(
                        new BigNumber(balance[selectedCard?.mintB?.address]?.price).multipliedBy(
                          userTargetWithdrawAmount
                        )
                      ),
                    4
                  )}`
                }
              ]}
            />
          </GammaActionModal>
          <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block overflow-y-hidden`}>
            <DepositWithdrawHeader />
            <div className="flex flex-col overflow-y-scroll h-full pb-[110px]">
              <DepositWithdrawToggle
                setUserSourceDepositAmount={setUserSourceDepositAmount}
                setUserSourceWithdrawAmount={setUserSourceWithdrawAmount}
                setUserTargetDepositAmount={setUserTargetDepositAmount}
                setUserTargetWithdrawAmount={setUserTargetWithdrawAmount}
              />
              <DepositWithdrawAccordion
                withdrawableBalanceA={withdrawableBalanceA}
                withdrawableBalanceB={withdrawableBalanceB}
              />
              <DepositWithdrawLabel text={'1. Enter Amounts'} />
              <TokenRow
                isMintA={true}
                token={selectedCard?.mintA}
                balance={userSourceTokenBal}
                isDeposit={isDeposit}
              />
              <DepositWithdrawInput
                isDeposit={isDeposit}
                onChange={(e) => handleInputChange(e.target.value, true)}
                depositAmount={userSourceDepositAmount}
                withdrawAmount={userSourceWithdrawAmount}
                handleHalf={() => handleHalf(true)}
                handleMax={() => handleMax(true)}
                disabled={
                  publicKey == null || (isDeposit ? userSourceTokenBal <= 0 : withdrawableBalanceA?.lte(new BN(0)))
                }
              />
              <TokenRow
                isMintA={false}
                token={selectedCard?.mintB}
                balance={userTargetTokenBal}
                isDeposit={isDeposit}
              />
              <DepositWithdrawInput
                isDeposit={isDeposit}
                onChange={(e) => handleInputChange(e.target.value, false)}
                depositAmount={userTargetDepositAmount}
                withdrawAmount={userTargetWithdrawAmount}
                handleHalf={() => handleHalf(false)}
                handleMax={() => handleMax(false)}
                disabled={
                  publicKey == null || (isDeposit ? userTargetTokenBal <= 0 : withdrawableBalanceB?.lte(new BN(0)))
                }
              />
              <ReviewConfirm
                tokenAActionValue={isDeposit ? userSourceDepositAmount : userSourceWithdrawAmount}
                tokenBActionValue={isDeposit ? userTargetDepositAmount : userTargetWithdrawAmount}
                isDeposit={isDeposit}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <StickyFooter
              disableActionButton={isActionButtonDisabled}
              isLoading={sendingTransaction || isUserTyping}
              onActionClick={isDeposit ? handleDeposit : handleProcessStart('withdraw')}
              isDeposit={isDeposit}
              // canClaim={true || isClaim}
              // claimText={'Claim 0.5 SOL + 12.0 USDC'}
              // onClaimClick={handleProcessStart('claim')}
              actionButtonText={actionButtonText}
            />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
