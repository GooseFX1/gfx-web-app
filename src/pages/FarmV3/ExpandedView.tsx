import { FC, useMemo, useState, useEffect } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from '../../components'
import { useAccounts, useConnectionConfig, useFarmContext, usePriceFeedFarm } from '../../context'
import { executeDeposit, executeWithdraw, getPriceObject, getPoolRegistryAccountKeys, SSLToken } from '../../web3'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import {
  ModeOfOperation,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidWithdrawErrMsg,
  genericErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage
} from './constants'
import { notify } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'

export const ExpandedView: FC<{ isExpanded: boolean; coin: SSLToken }> = ({ isExpanded, coin }) => {
  const { wallet } = useWallet()
  const wal = useWallet()
  const { network } = useConnectionConfig()
  const connection = new Connection('https://api.devnet.solana.com')
  const breakpoint = useBreakPoint()
  const { getUIAmount } = useAccounts()
  const { prices, SSLProgram } = usePriceFeedFarm() //sslchange ssl program
  const { setCounter, setOperationPending } = useFarmContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [poolToken, setPoolToken] = useState<SSLToken>(coin)
  const tokenMintAddress = poolToken?.address
  const [userSolBalance, setUserSOLBalance] = useState<number>()
  const [depositAmount, setDepositAmount] = useState<number>()
  const [withdrawAmount, setWithdrawAmount] = useState<number>()
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (SSLProgram) {
        const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
        const sslPool = await SSLProgram.account.poolRegistry.fetch(poolRegistryAccountKey)
        const sslPoolEntry = sslPool.entries.filter(
          (token: any) => token?.mint?.toString() === tokenMintAddress.toString()
        )
        setPoolToken({ ...poolToken, assetType: sslPoolEntry[0].assetType })
        //sslchange: remove logs
        console.log(
          'sslPoolEntry',
          sslPoolEntry[0]?.totalLiquidityDeposits.toString(),
          sslPoolEntry[0]?.totalAccumulatedLpReward.toString()
        )
      }
    })()
  }, [SSLProgram])
  useEffect(() => {
    ;(async () => {
      if (wallet?.adapter?.publicKey) {
        const SOL = await connection.getAccountInfo(wallet?.adapter?.publicKey)
        setUserSOLBalance(SOL.lamports / LAMPORTS_PER_SOL)
      }
    })()
  }, [wallet?.adapter?.publicKey])
  const userTokenBalance = useMemo(
    () => (userPublicKey && tokenMintAddress ? getUIAmount(tokenMintAddress.toString()) : 0),
    [tokenMintAddress, getUIAmount, userPublicKey]
  )
  const userTokenBalanceInUSD = useMemo(
    () => prices[getPriceObject(poolToken?.token)]?.current * userTokenBalance,
    [prices, poolToken, prices[getPriceObject(poolToken?.token)], userTokenBalance]
  )
  const enoughSOLInWallet = (): boolean => {
    if (userSolBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }
  const checkConditionsForDepositWithdraw = (isDeposit: boolean) => {
    if (!enoughSOLInWallet()) return true
    if (isDeposit) {
      if (
        isNaN(depositAmount) ||
        depositAmount < 0.000001 ||
        depositAmount > parseFloat(userTokenBalance && userTokenBalance.toFixed(3))
      ) {
        setDepositAmount(0)
        notify(invalidDepositErrMsg(userTokenBalance, coin?.token))
        return true
      }
      return false
    } else {
      if (isNaN(withdrawAmount) || withdrawAmount < 0.000001) {
        setWithdrawAmount(0)
        notify(invalidWithdrawErrMsg(coin?.token))
        return true
      }
      return false
    }
  }
  const handleDeposit = (): void => {
    if (checkConditionsForDepositWithdraw(true)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      const confirm = executeDeposit(SSLProgram, wal, connection, depositAmount, poolToken, userPublicKey)
      confirm.then((con) => {
        setOperationPending(false)
        setIsButtonLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, depositAmount, poolToken?.token, network, 'Deposit'))
          setTimeout(() => setDepositAmount(0), 500)
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(poolToken?.token, error?.message, signature, network, 'Deposit'))
          return
        }
      })
    } catch (error) {
      setOperationPending(false)
      setIsButtonLoading(false)
      notify(genericErrMsg(error))
    }
  }
  const handleWithdraw = (): void => {
    if (checkConditionsForDepositWithdraw(false)) return
    try {
      setIsButtonLoading(true)
      // this is because the the user must not be able to switch between deposit and withdraw stable and alpha pools
      setOperationPending(true)
      executeWithdraw(SSLProgram, wal, connection, poolToken, withdrawAmount, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, withdrawAmount, poolToken?.token, network, 'Withdraw'))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(poolToken?.token, error?.message, signature, network, 'Withdraw'))
          return
        }
      })
    } catch (err) {
      setIsButtonLoading(false)
      notify(genericErrMsg(err))
    }
  }
  const handleInputChange = (input: string) => {
    const inputValue = +input
    if (!isNaN(inputValue)) {
      if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(inputValue)
      else setWithdrawAmount(inputValue)
    }
  }

  return (
    <div
      css={[
        tw`dark:bg-black-2 bg-white mx-3.75 sm:mx-3 rounded-[0 0 15px 15px] duration-300 
            flex justify-between sm:flex-col`,
        isExpanded
          ? tw`h-[135px] sm:h-[382px] visible text-regular p-5 sm:p-4`
          : tw`h-0 invisible text-[0px] p-0 opacity-0 w-0`
      ]}
    >
      <div tw="flex flex-col">
        {breakpoint.isMobile && isExpanded && (
          <div tw="flex flex-col">
            <FarmStats isExpanded={isExpanded} keyStr="Liquidity" value={`${2} ${poolToken}`} />
            <FarmStats isExpanded={isExpanded} keyStr="24H Volume" value={`${3} ${poolToken}`} />
            <FarmStats isExpanded={isExpanded} keyStr="24H Fees" value={`${4} ${poolToken}`} />
            <FarmStats isExpanded={isExpanded} keyStr="Balance" value={`${4} ${poolToken}`} />
            <FarmStats
              isExpanded={isExpanded}
              keyStr="Wallet Balance"
              value={`${userTokenBalance.toFixed(2)} ${poolToken}`}
            />
            <FarmStats isExpanded={isExpanded} keyStr="Total Earnings" value={`2.5 ${poolToken}`} />
            <FarmStats isExpanded={isExpanded} keyStr="Balance" value={`2.5 ${coin}`} />
          </div>
        )}
        {isExpanded && (
          <>
            <div tw="flex font-semibold duration-500 relative sm:mt-2">
              <div
                css={[
                  tw`bg-blue-1 h-8.75 sm:h-10 w-[100px] sm:w-[50%] rounded-full`,
                  modeOfOperation === ModeOfOperation.WITHDRAW
                    ? tw`absolute ml-[100px] sm:ml-[50%] duration-500`
                    : tw`absolute ml-0 duration-500`
                ]}
              ></div>
              <div
                css={[
                  tw`h-[35px] w-[100px] sm:h-10 sm:w-[50%] z-10 flex items-center justify-center cursor-pointer`,
                  modeOfOperation === ModeOfOperation.DEPOSIT && tw`!text-white`
                ]}
                onClick={() => setModeOfOperation(ModeOfOperation.DEPOSIT)}
              >
                Deposit
              </div>
              <div
                css={[
                  tw`h-[35px] w-[100px] sm:h-10 sm:w-[50%] z-10 flex items-center justify-center cursor-pointer`,
                  modeOfOperation === ModeOfOperation.WITHDRAW && tw`!text-white`
                ]}
                onClick={() => setModeOfOperation(ModeOfOperation.WITHDRAW)}
              >
                Withdraw
              </div>
            </div>
          </>
        )}
        {breakpoint.isDesktop && (
          <div tw="mt-5">
            <FarmStats
              isExpanded={isExpanded}
              keyStr="Wallet Balance"
              value={`${userTokenBalance.toFixed(2)} ${poolToken?.token} ($ ${userTokenBalanceInUSD.toFixed(
                2
              )} USD)`}
            />
          </div>
        )}
      </div>

      <div>
        <div tw="flex relative">
          <div tw="absolute flex z-[100]">
            <div
              onClick={() =>
                modeOfOperation === ModeOfOperation.DEPOSIT
                  ? setDepositAmount(userTokenBalance ? parseFloat((userTokenBalance / 2).toFixed(2)) : 0)
                  : setWithdrawAmount(userTokenBalance ? parseFloat((userTokenBalance / 2).toFixed(2)) : 0)
              }
              tw="font-semibold text-grey-1 dark:text-grey-2 mt-1.5 ml-4 cursor-pointer"
            >
              Min
            </div>
            <div
              onClick={() =>
                modeOfOperation === ModeOfOperation.DEPOSIT
                  ? setDepositAmount(parseFloat(userTokenBalance && userTokenBalance.toFixed(2)))
                  : setWithdrawAmount(parseFloat(userTokenBalance && userTokenBalance.toFixed(2)))
              }
              tw="font-semibold text-grey-1 dark:text-grey-2 mt-1.5 ml-2 cursor-pointer"
            >
              Max
            </div>
          </div>

          <input
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={isExpanded ? `0.00` : ``}
            value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount : withdrawAmount}
            css={[
              tw`duration-500 rounded-[50px] relative text-regular font-semibold outline-none dark:bg-black-1 
                bg-grey-5 border-none`,
              isExpanded
                ? tw`w-[400px] h-8.75 sm:w-[100%] p-4 pl-[100px] pr-[64px] text-right sm:pl-[65%]`
                : tw`h-0 w-0 pl-0 invisible`
            ]}
            type="number"
          />
          <div tw="font-semibold text-grey-1 dark:text-grey-2 absolute ml-[345px] sm:ml-[85%] mt-1.5">
            {poolToken?.token}
          </div>
        </div>

        {isExpanded && (
          <div tw="mt-4">
            {wallet?.adapter?.publicKey ? (
              <div>
                <Button
                  height="35px"
                  disabled={isButtonLoading}
                  cssStyle={tw`duration-500 w-[400px] sm:w-[100%]  h-8.75 bg-blue-1 text-regular border-none
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
                  onClick={modeOfOperation === ModeOfOperation.DEPOSIT ? handleDeposit : handleWithdraw}
                  loading={isButtonLoading}
                >
                  {modeOfOperation}
                </Button>
              </div>
            ) : (
              <Connect customButtonStyle={[tw`sm:w-[80vw] w-[400px] h-8.75`]} />
            )}
          </div>
        )}
      </div>

      {breakpoint.isDesktop && isExpanded && (
        <div>
          <FarmStats
            alignRight={true}
            isExpanded={isExpanded}
            keyStr="Total Earnings"
            value={`2.5 ${poolToken?.token} ($12 USD)`}
          />
          <div tw="mt-2">
            <FarmStats
              alignRight={true}
              isExpanded={isExpanded}
              keyStr="Balance"
              value={`2.5 ${poolToken?.token} ($12 USD)`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const FarmStats: FC<{ keyStr: string; value: string; isExpanded: boolean; alignRight?: boolean }> = ({
  keyStr,
  value,
  isExpanded,
  alignRight
}) => (
  <div
    css={[
      tw`font-semibold duration-500 sm:flex sm:w-[100%] sm:justify-between sm:mb-1`,
      isExpanded ? tw`text-regular opacity-100` : tw`text-[0px] invisible opacity-0`
    ]}
  >
    <div tw="text-grey-1" css={[!!alignRight && tw`text-right`]}>
      {keyStr}
    </div>
    <div tw="text-grey-2">{value}</div>
  </div>
)
