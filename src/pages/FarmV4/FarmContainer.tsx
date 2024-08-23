import { FC, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useDarkMode, useFarmContext, useRewardToggle } from '../../context'
import { poolType, SSL_TOKENS } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Icon, Switch } from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import FarmItems from './FarmItems'
import Portfolio from './Portfolio'
import useUserCache from '@/hooks/useUserCache'

export const FarmContainer: FC = () => {
  const { mode } = useDarkMode()
  const { userCache, updateUserCache } = useUserCache()

  const { wallet } = useWallet()
  const {
    operationPending,
    pool,
    setPool
  } = useFarmContext()
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const { isPortfolio } = useRewardToggle()

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  //TODO::need to change the calculation upon getting onchain data
  const numberOfTokensDeposited = 0

  // const farmTableRow = useMemo(
  //   () =>
  //     sslData.map((token: SSLToken) => {
  //       const tokenName = token?.token === 'SOL' ? 'WSOL' : token?.token
  //       const apy = Number(sslTableData?.[tokenName]?.apy)
  //       const volume = sslTableData?.[tokenName]?.volume / 1_000_000
  //       const nativeFees = sslTableData?.[tokenName]?.fee / 10 ** token?.mintDecimals
  //       const feesInUSD =
  //         prices[getPriceObject(token?.token)]?.current &&
  //         prices[getPriceObject(token?.token)]?.current * nativeFees
  //       const nativeLiquidity = liquidityAmount?.[token?.mint?.toBase58()]
  //       const liquidityInUSD =
  //         prices[getPriceObject(token?.token)]?.current &&
  //         prices[getPriceObject(token?.token)]?.current * nativeLiquidity
  //       const account = filteredLiquidityAccounts[token?.mint?.toBase58()]
  //       const amountDeposited = formatUserBalance(account?.amountDeposited?.toString(), token?.mintDecimals)
  //       const beforeDecimal = amountDeposited?.beforeDecimalBN
  //       const dataObj = {
  //         ...token,
  //         apy: apy,
  //         volume: volume,
  //         fee: feesInUSD,
  //         liquidity: liquidityInUSD,
  //         beforeDecimal: beforeDecimal
  //       }
  //       return dataObj
  //     }),
  //   [sslData, sslTableData, liquidityAmount, filteredLiquidityAccounts]
  // )

  const filteredTokens = useMemo(
    () =>
      searchTokens
        ? SSL_TOKENS.filter(
          (token) =>
            token?.sourceToken?.toLocaleLowerCase().includes(searchTokens?.toLocaleLowerCase()) ||
            token?.targetToken?.toLocaleLowerCase().includes(searchTokens?.toLocaleLowerCase())
        )
        : [...SSL_TOKENS],
    [searchTokens, SSL_TOKENS]
  )

  useEffect(() => {
    if (pubKey === null && userCache.farm.showDepositedFilter)
      setShowDeposited(() => {
        updateUserCache({
          farm: {
            ...userCache.farm,
            showDepositedFilter: false
          }
        })
        return false
      })
  }, [pubKey,userCache])

  // useEffect(() => {
  //   sslData?.length && setInitialLoad(false)
  // }, [sslData])

  const initiateGlobalSearch = (value: string) => {
    setPool(poolType.all)
    setSearchTokens(value)
  }

  const handleShowDepositedToggle = () => {
    setShowDeposited((prev) => {
      updateUserCache({
        farm: {
          ...userCache.farm,
          showDepositedFilter: !prev
        }
      })

      return !prev
    })
  }

  return (
    <div className={'flex flex-col gap-3.75'}>
      {!isPortfolio ? (
        <>
          <div className="flex items-center max-sm:flex-col max-sm:gap-4">
            <RadioOptionGroup
              defaultValue={'All'}
              value={pool.name}
              className={'w-full min-md:w-max gap-1.25 max-sm:gap-0 max-sm:grid-cols-4 mr-2'}
              optionClassName={`min-md:w-[85px]`}
              options={[
                {
                  value: poolType.all.name,
                  label: 'All',
                  onClick: () => (operationPending ? null : setPool(poolType.all))
                },
                {
                  value: poolType.primary.name,
                  label: 'Primary',
                  onClick: () => (operationPending ? null : setPool(poolType.primary))
                },
                {
                  value: poolType.hyper.name,
                  label: 'Hyper',
                  onClick: () => (operationPending ? null : setPool(poolType.hyper))
                }
              ]}
            />
            <div className="flex items-center w-full justify-between">
              <SearchBar
                onChange={(e) => initiateGlobalSearch(e.target.value)}
                onClear={() => setSearchTokens('')}
                value={searchTokens}
                className={'!max-w-full flex-1 bg-white dark:bg-black-2'}
              />
              <div className="flex justify-between ml-3">
                <Button
                  className="ml-auto p-0 !h-[35px] !w-[35px] mr-3"
                  variant={'ghost'}
                  onClick={() => console.log('filter')}
                >
                  <Icon
                    src={`img/assets/farm_filter_${mode}.svg`}
                    size={'md'}
                    className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px]'}
                  />
                </Button>
                <div className={'flex flex-row ml-auto gap-3.75'}>
                  {pubKey != null && (
                    <div className="flex items-center mr-2">
                      <Switch
                        variant={'default'}
                        size={'sm'}
                        colorScheme={'primary'}
                        checked={showDeposited}
                        onClick={handleShowDepositedToggle}
                      />
                      <div className="h-full text-tiny text-left dark:text-grey-2 text-grey-1 
                        font-semibold ml-2 hidden min-lg:block">
                        Show <br /> Deposited
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <FarmItems
            tokens={filteredTokens}
            numberOfTokensDeposited={numberOfTokensDeposited}
            searchTokens={searchTokens}
            showDeposited={showDeposited}
          />
        </>
      ) : (
        <Portfolio />
      )}
    </div>
  )
}
