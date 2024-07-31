/* eslint-disable */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { ShowDepositedToggle, SkeletonCommon } from '../../components'
import { useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
import { checkMobile, formatUserBalance, truncateBigString } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { Pool, poolType, SSLToken, SSL_TOKENS } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { getPriceObject } from '../../web3'
import { USER_CONFIG_CACHE } from '../../types/app_params'
import BN from 'bn.js'
import { Icon, Switch, Button } from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import FarmItems from './FarmItems'
import useBoolean from '@/hooks/useBoolean'
import { ChoosePool } from './ChoosePool'

export const FarmContainer: FC = () => {
  const { mode } = useDarkMode()
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  const breakpoint = useBreakPoint()
  const { wallet } = useWallet()
  const {
    operationPending,
    pool,
    setPool,
    sslData,
    filteredLiquidityAccounts,
    sslTableData,
    liquidityAmount,
    setIsFirstPoolOpen,
    rewards,
    allPoolSslData
  } = useSSLContext()
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [showDeposited, setShowDeposited] = useState<boolean>(existingUserCache.farm.showDepositedFilter)
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)
  const { prices } = usePriceFeedFarm()
  const [allClaimModal, setAllClaimModal] = useState<boolean>(false)
  const [poolSelectionModal, setPoolSelectionModal] = useBoolean(false)

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  //TODO::need to change the calculation upon getting onchain data
  const numberOfTokensDeposited = useMemo(() => {
    const count = sslData.reduce((accumulator, data) => {
      const amountInNative = filteredLiquidityAccounts[data?.mint?.toBase58()]?.amountDeposited?.toString()
      const amountInUSD = truncateBigString(amountInNative, data?.mintDecimals)
      if (amountInUSD && amountInUSD !== '0.00') {
        return accumulator + 1
      }
      return accumulator
    }, 0)
    return count
  }, [pool, filteredLiquidityAccounts, sslData, pubKey])

  const farmTableRow = useMemo(
    () =>
      sslData.map((token: SSLToken) => {
        const tokenName = token?.token === 'SOL' ? 'WSOL' : token?.token
        const apy = Number(sslTableData?.[tokenName]?.apy)
        const volume = sslTableData?.[tokenName]?.volume / 1_000_000
        const nativeFees = sslTableData?.[tokenName]?.fee / 10 ** token?.mintDecimals
        const feesInUSD =
          prices[getPriceObject(token?.token)]?.current &&
          prices[getPriceObject(token?.token)]?.current * nativeFees
        const nativeLiquidity = liquidityAmount?.[token?.mint?.toBase58()]
        const liquidityInUSD =
          prices[getPriceObject(token?.token)]?.current &&
          prices[getPriceObject(token?.token)]?.current * nativeLiquidity
        const account = filteredLiquidityAccounts[token?.mint?.toBase58()]
        const amountDeposited = formatUserBalance(account?.amountDeposited?.toString(), token?.mintDecimals)
        const beforeDecimal = amountDeposited?.beforeDecimalBN
        const dataObj = {
          ...token,
          apy: apy,
          volume: volume,
          fee: feesInUSD,
          liquidity: liquidityInUSD,
          beforeDecimal: beforeDecimal
        }
        return dataObj
      }),
    [sslData, sslTableData, liquidityAmount, filteredLiquidityAccounts]
  )

  const filteredTokens = useMemo(
    () =>
      searchTokens
        ? SSL_TOKENS.filter((token) =>
            token?.sourceToken?.toLocaleLowerCase().includes(searchTokens?.toLocaleLowerCase()) ||
            token?.targetToken?.toLocaleLowerCase().includes(searchTokens?.toLocaleLowerCase())
          )
        : [...SSL_TOKENS],
    [searchTokens, SSL_TOKENS, sort]
  )

  useEffect(() => {
    if (pubKey === null)
      setShowDeposited(() => {
        window.localStorage.setItem(
          'gfx-user-cache',
          JSON.stringify({
            ...existingUserCache,
            farm: { ...existingUserCache.farm, showDepositedFilter: false }
          })
        )
        return false
      })
  }, [pubKey])

  useEffect(() => {
    sslData?.length && setInitialLoad(false)
  }, [sslData])

  const poolSize = useMemo(
    () => (showDeposited ? numberOfTokensDeposited : filteredTokens?.length),
    [showDeposited, numberOfTokensDeposited, filteredTokens]
  )

  const sortUserBalances = (sortValue: string) => {
    farmTableRow.sort((a, b) => {
      let firstBN = a?.beforeDecimal
      let secondBN = b?.beforeDecimal
      if (!firstBN) firstBN = new BN(0)
      if (!secondBN) secondBN = new BN(0)
      if (sort === 'DESC') return firstBN.gt(secondBN) ? -1 : 1
      else return firstBN.lt(secondBN) ? -1 : 1
    })
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortType(sortValue)
  }

  const initiateGlobalSearch = (value: string) => {
    setIsFirstPoolOpen(false)
    setPool(poolType.all)
    setSearchTokens(value)
  }

  const handleColumnSort = (sortValue: string) => {
    if (sortValue === 'balance') {
      sortUserBalances(sortValue)
      return
    }
    farmTableRow.sort((a, b) => {
      if (sort === 'DESC') return a[sortValue] > b[sortValue] ? -1 : 1
      else return a[sortValue] > b[sortValue] ? 1 : -1
    })
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortType(sortValue)
  }

  const handleToggle = (pooltype: Pool) => {
    setPool(pooltype)
    setIsFirstPoolOpen(false)
  }

  const handleShowDepositedToggle = () => {
    setShowDeposited((prev) => {
      window.localStorage.setItem(
        'gfx-user-cache',
        JSON.stringify({
          ...existingUserCache,
          farm: { ...existingUserCache.farm, showDepositedFilter: !prev }
        })
      )
      return !prev
    })
    setIsFirstPoolOpen(false)
  }

  return (
    <div className={'flex flex-col gap-3.75'}>
      {poolSelectionModal && (
        <ChoosePool poolSelectionModal={poolSelectionModal} setPoolSelectionModal={setPoolSelectionModal.set} />
      )}
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
              onClick: () => (operationPending ? null : handleToggle(poolType.all))
            },
            {
              value: poolType.primary.name,
              label: 'Primary',
              onClick: () => (operationPending ? null : handleToggle(poolType.primary))
            },
            {
              value: poolType.hyper.name,
              label: 'Hyper',
              onClick: () => (operationPending ? null : handleToggle(poolType.hyper))
            }
          ]}
        />

        <div className="flex items-center w-full justify-between">
          <SearchBar
            onChange={(e) => initiateGlobalSearch(e.target.value)}
            onClear={() => setSearchTokens('')}
            value={searchTokens}
            className={'!max-w-full flex-1'}
          />
          <div className="flex justify-between ml-3">
            {((!breakpoint.isTablet && breakpoint.isLaptop) || breakpoint.isDesktop) && (
              <Button
                className="ml-auto p-0 !h-[35px] !w-[35px] mr-3"
                variant={'ghost'}
                onClick={setPoolSelectionModal.on}
              >
                <Icon
                  src="/img/assets/question-icn.svg"
                  alt="?-icon"
                  className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px]'}
                />
              </Button>
            )}
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
                  <ShowDepositedToggle enabled={showDeposited} setEnable={handleShowDepositedToggle} />
                  <div className="h-full text-xs text-right dark:text-grey-2 text-grey-1 font-semibold ml-2 hidden min-lg:block">
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
    </div>
  )
}