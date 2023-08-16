/* eslint-disable */
import { FC, useMemo, Dispatch, SetStateAction, useState, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { ArrowClicker, Button, SearchBar } from '../../components'
import { useAccounts, useConnectionConfig, useDarkMode, useFarmContext, usePriceFeedFarm } from '../../context'
import { ADDRESSES, executeDeposit, executeWithdraw, getPriceObject } from '../../web3'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
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
import { checkMobile, notify } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'

const WRAPPER = styled.div<{ $poolIndex }>`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  .slider-animation-web {
    ${tw`absolute w-2/5 h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .inputContainer {
    ${tw`w-[400px] h-10`}
  }
  .selectedBackground {
    ${tw`bg-blue-1 !text-white`};
  }
  .tableRowGradient {
    ${tw`duration-500`};
    background: linear-gradient(111deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
  }
  table {
    ${tw`sm:dark:bg-black-3 sm:bg-white mt-[10px] w-full `}
    border-radius: 20px 20px 0 0;
    overflow-x: hidden;

    @media (max-width: 500px) {
      ${tw`sticky mt-[0px] w-[calc(100vw - 30px)]`}
    }
  }

  thead,
  tbody,
  tr,
  td,
  th {
    display: block;
  }

  thead {
    ${tw`text-base font-semibold bg-grey-5 dark:bg-black-1 
    sm:h-[52px] rounded-[20px 20px 5px 5px] text-regular`}

    tr {
      ${tw`h-[40px] sm:h-full`}
      border-bottom: 1px solid ${({ theme }) => theme.tokenBorder};

      th {
        ${tw`h-full dark:text-grey-2 text-grey-1 text-center`}

        & > div {
          ${tw`h-full `}
        }
      }
    }
  }

  tbody {
    ${tw`dark:bg-black-1 bg-grey-5 overflow-hidden`}
    ${({ theme }) => theme.customScrollBar('1px')}
    tr {
      ${tw`dark:bg-black-2 bg-white  mt-[15px] dark:border-black-2 border-white
      sm:mb-0 rounded-small cursor-pointer h-[60px] sm:h-[70px]`}

      /* &:hover {
        ${tw`border-grey-2 rounded-[13px] sm:rounded-[8px] `}
      } */

      &:after {
        content: ' ';
        display: block;
        visibility: hidden;
        clear: both;
      }
    }
    td {
      ${tw`h-[100%] flex items-center justify-center  text-[20px] font-semibold text-center
       dark:text-grey-5 text-black-4 `}
      text-align: center;
    }
  }

  tbody td,
  thead th {
    width: 15%;
    float: left;
    text-align: center;

    @media (max-width: 500px) {
      ${tw`w-[33%] `}
    }
  }
`

export const FarmTable: FC<{ poolIndex: number; setPoolIndex: Dispatch<SetStateAction<number>> }> = ({
  poolIndex,
  setPoolIndex
}) => {
  const { mode } = useDarkMode()
  const poolTypes = ['stable', 'hyper']
  const [selectedPool, setSelectedPool] = useState<string>(poolTypes[0])
  const [searchTokens, setSearchTokens] = useState<string>()
  const breakpoint = useBreakPoint()
  const arr = useMemo(() => Object.keys(ADDRESSES['mainnet-beta'][selectedPool]).map((coin) => coin), [poolTypes])
  const filteredTokens = useMemo(
    () => (searchTokens ? arr.filter((ar) => ar.toLocaleLowerCase().includes(searchTokens)) : [...arr]),
    [searchTokens, arr]
  )
  const handlePoolSelection = (pool, index) => {
    setPoolIndex(index)
    setSelectedPool(pool)
  }
  return (
    <WRAPPER>
      <div tw="flex flex-row items-end mb-5 sm:items-stretch sm:pr-4 sm:mb-3.75">
        <img
          src={`/img/assets/${selectedPool}_pools.svg`}
          alt="pool-icon"
          height={77}
          width={70}
          tw="mr-3.75 duration-500"
        />
        <div tw="flex flex-col">
          <div tw="text-[25px] font-semibold dark:text-grey-5 text-black-4 capitalize sm:text-average sm:mb-1.5">
            {selectedPool === 'stable' ? 'Stable' : 'Alpha'} Pools
          </div>

          <div tw="text-regular font-medium text-grey-1 dark:text-grey-2 mt-[-4px] sm:text-tiny sm:leading-5">
            {poolIndex === 0 ? (
              <>
                If you're looking for stable returns with balanced risk,
                {!checkMobile() && <br />} Stable pools are the way to go.
              </>
            ) : (
              <>
                If you're looking for high returns with a bit more risk,
                {!checkMobile() && <br />} Hyper pools are the way to go.
              </>
            )}
          </div>
        </div>
      </div>
      <div tw="flex items-center">
        <div tw="flex cursor-pointer relative">
          <div
            css={[tw`duration-500`, poolIndex === 1 ? tw`ml-[95px] ` : tw`ml-0`]}
            tw="h-[35px] bg-blue-1 w-[95px] absolute rounded-[50px]"
          ></div>
          <div
            css={[poolIndex === 0 ? tw`!text-white ` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold w-[95px]  "
            onClick={() => handlePoolSelection(poolTypes[0], 0)}
          >
            Stable
          </div>
          <div
            css={[poolIndex === 1 ? tw`!text-white ` : tw`text-grey-1`]}
            tw="h-[35px] flex items-center justify-center z-[100] font-semibold w-[95px] "
            onClick={() => handlePoolSelection(poolTypes[1], 1)}
          >
            Alpha
          </div>
        </div>
        {breakpoint.isDesktop && (
          <SearchBar
            width={`425px`}
            setSearchFilter={setSearchTokens}
            placeholder="Search by token symbol"
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
          />
        )}
      </div>
      {breakpoint.isMobile && (
        <div tw="sm:mt-4">
          <SearchBar
            width={`95%`}
            setSearchFilter={setSearchTokens}
            placeholder="Search by token symbol"
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
          />
        </div>
      )}
      <div>
        <table tw="mt-4">
          <FarmTableHeaders poolSize={filteredTokens && filteredTokens.length && filteredTokens.length} />
          <tbody>
            {filteredTokens && filteredTokens.length ? (
              filteredTokens.map((coin, index) => (
                <FarmTableCoin key={index} coin={coin} selectedPool={selectedPool} />
              ))
            ) : (
              <tr>
                <div
                  tw="h-full flex flex-row justify-center items-center text-regular 
                  font-semibold dark:text-white text-black"
                >
                  No results found!
                </div>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </WRAPPER>
  )
}

const FarmTableHeaders: FC<{ poolSize: number }> = ({ poolSize }) => (
  <thead>
    <tr>
      <th tw="!text-left !justify-start pl-2 !flex"> {TableHeaderTitle('Asset', null, true)} </th>
      <th>{TableHeaderTitle('APY', null, true)} </th>
      {!checkMobile() && <th>{TableHeaderTitle('Liquidity', null, true)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('24H Volume', null, true)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('24H Fees', null, true)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('Balance', null, true)} </th>}
      <th tw="!text-right !justify-end !flex !w-[10%] sm:!w-[33%]">
        {TableHeaderTitle(`Pools: ${poolSize}`, null, false)}
      </th>
    </tr>
  </thead>
)

const FarmTableCoin: FC<{ coin: any; selectedPool: string }> = ({ coin, selectedPool }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  return (
    <>
      <tr className={isExpanded ? 'tableRowGradient' : ''} onClick={() => setIsExpanded((prev) => !prev)}>
        <td tw="!justify-start">
          <img tw="h-10 w-10 ml-4 sm:ml-2" src={`/img/crypto/${coin}.svg`} />
          <div tw="ml-2.5">{coin}</div>
        </td>
        <td>4.56 %</td>
        {!checkMobile() && <td>$550,111.22</td>}
        {!checkMobile() && <td>$80,596</td>}
        {!checkMobile() && <td>$30,596</td>}
        {!checkMobile() && <td>0.0</td>}
        <td tw="!w-[10%] sm:!w-[33%]">
          <Button className="pinkGradient" cssStyle={tw`h-[35px] text-white font-semibold text-regular`}>
            Stats
          </Button>
          <ArrowClicker cssStyle={tw`h-5 w-5`} arrowRotation={isExpanded} />
        </td>
      </tr>
      {<ExpandedView isExpanded={isExpanded} coin={coin} selectedPool={selectedPool} />}
    </>
  )
}

const ExpandedView: FC<{ isExpanded: boolean; coin: string; selectedPool: string }> = ({
  isExpanded,
  coin,
  selectedPool
}) => {
  const { wallet } = useWallet()
  const wal = useWallet()
  const { network } = useConnectionConfig()
  const connection = new Connection('https://api.devnet.solana.com')
  const breakpoint = useBreakPoint()
  const { getUIAmount } = useAccounts()
  const { prices, SSLProgram } = usePriceFeedFarm() //sslchange ssl program
  const { setCounter, setOperationPending } = useFarmContext()
  const tokenAddress = ADDRESSES['mainnet-beta']?.[selectedPool][coin].address // sslchange this later
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSolBalance, setUserSOLBalance] = useState<number>()
  const [depositAmount, setDepositAmount] = useState<number>()
  const [withdrawAmount, setWithdrawAmount] = useState<number>()
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  //sslchange: to use when ssl program is ready
  useEffect(() => {
    //program.account.sslPool.fetchAll()
    //.assetType
    ;async () => {
      if (SSLProgram) {
        const sslPool = await SSLProgram.account.sslPool.all()
        return sslPool
      }
    }
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
    () => (userPublicKey && tokenAddress ? getUIAmount(tokenAddress.toString()) : 0),
    [tokenAddress, getUIAmount, userPublicKey]
  )
  const userTokenBalanceInUSD = useMemo(
    () => prices[getPriceObject(coin)]?.current * userTokenBalance,
    [prices, coin, prices[getPriceObject(coin)], userTokenBalance]
  )
  const enoughSOLInWallet = (): boolean => {
    console.log('userSolBalance', userSolBalance)
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
        notify(invalidDepositErrMsg(userTokenBalance, coin))
        return true
      }
      return false
    } else {
      if (isNaN(withdrawAmount) || withdrawAmount < 0.000001) {
        setWithdrawAmount(0)
        notify(invalidWithdrawErrMsg(coin))
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
      const confirm = executeDeposit(SSLProgram, wal, connection, network, depositAmount, coin, userPublicKey)
      confirm.then((con) => {
        setOperationPending(false)
        setIsButtonLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, depositAmount, coin, network, 'Deposit'))
          setTimeout(() => setDepositAmount(0), 500)
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(coin, error?.message, signature, network, 'Deposit'))
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
      setOperationPending(true)
      executeWithdraw(SSLProgram, wal, connection, network, coin, withdrawAmount, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, withdrawAmount, coin, network, 'Withdraw'))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(coin, error?.message, signature, network, 'Withdraw'))
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
        tw`dark:bg-black-2 bg-white mx-3.75 sm:mx-5 rounded-[0 0 15px 15px] duration-300 
          flex justify-between sm:flex-col`,
        isExpanded
          ? tw`h-[135px] sm:h-[382px] visible text-regular p-5 sm:p-4`
          : tw`h-0 invisible text-[0px] p-0 opacity-0 w-0`
      ]}
    >
      <div tw="flex flex-col">
        {isExpanded && breakpoint.isMobile && (
          <div tw="flex flex-col">
            <FarmStats isExpanded={isExpanded} keyStr="Liquidity" value={`${2} ${coin}`} />
            <FarmStats isExpanded={isExpanded} keyStr="24H Volume" value={`${3} ${coin}`} />
            <FarmStats isExpanded={isExpanded} keyStr="24H Fees" value={`${4} ${coin}`} />
            <FarmStats isExpanded={isExpanded} keyStr="Balance" value={`${4} ${coin}`} />
            <FarmStats
              isExpanded={isExpanded}
              keyStr="Wallet Balance"
              value={`${userTokenBalance.toFixed(2)} ${coin}`}
            />
            <FarmStats isExpanded={isExpanded} keyStr="Total Earnings" value={`2.5 ${coin}`} />
            <FarmStats isExpanded={isExpanded} keyStr="Balance" value={`2.5 ${coin}`} />
          </div>
        )}
        {isExpanded && (
          <>
            <div tw="flex font-semibold duration-500 relative sm:mt-2">
              <div
                css={[
                  tw`bg-blue-1 h-8 sm:h-10 w-[100px] sm:w-[50%] rounded-full`,
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
              value={`${userTokenBalance.toFixed(2)} ${coin} ($ ${userTokenBalanceInUSD.toFixed(2)} USD)`}
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
                ? tw`w-[400px] h-8.75 sm:w-[100%] p-4 pl-[100px] pr-[60px] text-right sm:pl-[72%]`
                : tw`h-0 w-0 pl-0 invisible`
            ]}
            type="number"
          />
          <div tw="font-semibold text-grey-1 dark:text-grey-2 absolute ml-[345px] sm:ml-[85%] mt-1.5">{coin}</div>
        </div>

        {isExpanded && (
          <div tw="mt-4">
            {wallet?.adapter?.publicKey ? (
              <div>
                <Button
                  cssStyle={tw`duration-500 w-[400px] sm:w-[100%]  h-8.75 bg-blue-1 text-regular !text-white font-semibold
                   rounded-[50px] flex items-center justify-center outline-none border-none`}
                  onClick={modeOfOperation === ModeOfOperation.DEPOSIT ? handleDeposit : handleWithdraw}
                  loading={isButtonLoading}
                >
                  {modeOfOperation}
                </Button>
              </div>
            ) : (
              <Connect customButtonStyle={[tw`w-[400px] h-8.75`]} />
            )}
          </div>
        )}
      </div>

      {breakpoint.isDesktop && (
        <div>
          <FarmStats
            alignRight={true}
            isExpanded={isExpanded}
            keyStr="Total Earnings"
            value={`2.5 ${coin} ($12 USD)`}
          />
          <div tw="mt-2">
            <FarmStats
              alignRight={true}
              isExpanded={isExpanded}
              keyStr="Balance"
              value={`2.5 ${coin} ($12 USD)`}
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
