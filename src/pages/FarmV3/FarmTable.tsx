import React, { FC, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { ShowDepositedToggle, SkeletonCommon } from '../../components'
import { useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
import { checkMobile, formatUserBalance, truncateBigString } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { SSLToken, poolType, Pool } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'

import { getPriceObject } from '../../web3'

import { USER_CONFIG_CACHE } from '../../types/app_params'
import BN from 'bn.js'
import { AllClaimModal } from './AllClaimModal'
import { Button, cn, Switch } from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import FarmFilter from '@/pages/FarmV3/FarmTableComponents/FarmFilter'
import FarmItems from './FarmTableComponents/FarmItems'

export const FarmTable: FC = () => {
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

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  const numberOfCoinsDeposited = useMemo(() => {
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
        ? farmTableRow.filter((token) =>
            token?.token?.toLocaleLowerCase().includes(searchTokens?.toLocaleLowerCase())
          )
        : [...farmTableRow],
    [searchTokens, farmTableRow, sort]
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
    () => (showDeposited ? numberOfCoinsDeposited : filteredTokens?.length),
    [showDeposited, numberOfCoinsDeposited, filteredTokens]
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

  const isClaimable = useMemo(
    () =>
      allPoolSslData.reduce((accumulator, current) => {
        const tokenMintAddress = current?.mint?.toBase58()
        const reward = rewards[tokenMintAddress]?.toNumber() / Math.pow(10, current?.mintDecimals)
        if (reward) return accumulator + 1
        return accumulator
      }, 0),
    [allPoolSslData, rewards]
  )

  const claimableRewardArray = useMemo(
    () =>
      allPoolSslData.map((token) => {
        const tokenName = token?.token
        const tokenMintAddress = token?.mint?.toBase58()
        const reward = rewards[tokenMintAddress]?.toNumber() / Math.pow(10, token?.mintDecimals)
        return { tokenName, reward }
      }),
    [allPoolSslData, rewards]
  )
  return (
    <div className={'flex flex-col gap-3.75'}>
      {allClaimModal && (
        <AllClaimModal
          allClaimModal={allClaimModal}
          setAllClaimModal={setAllClaimModal}
          rewardsArray={claimableRewardArray}
        />
      )}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <img
            src={`/img/assets/${pool.name}_pools_${mode}.svg`}
            alt="pool-icon"
            className="h-[55px] w-[50px] mr-3.75 duration-500 sm:h-[45] sm:w-[40px]"
          />
          <div className="flex flex-col">
            <h2
              className="text-average font-semibold dark:text-grey-5 text-black-4 capitalize
              sm:text-average sm:mb-0 sm:leading-[22px]"
            >
              {pool.name} Pools
            </h2>
            <p className="text-average font-medium text-grey-1 dark:text-grey-2 sm:text-tiny sm:leading-5">
              {pool.desc}
            </p>
          </div>
        </div>
        {checkMobile() && isClaimable > 0 && pubKey && (
          <Button
            variant={'outline'}
            colorScheme={'secondaryGradient'}
            className={'before:animate-border-spin'}
            onClick={() => setAllClaimModal(true)}
          >
            Claim All
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3.75">
        <RadioOptionGroup
          defaultValue={'all_pools'}
          className={'w-full min-md:w-max gap-1.25 sm:gap-0 sm:grid-cols-4'}
          optionClassName={`min-md:w-[85px]`}
          options={[
            {
              value: 'all_pools',
              label: 'All Pools',
              onClick: () => (operationPending ? null : handleToggle(poolType.all))
            },
            {
              value: 'Stable',
              label: 'Stable',
              onClick: () => (operationPending ? null : handleToggle(poolType.stable))
            },
            {
              value: 'Primary',
              label: 'Primary',
              onClick: () => (operationPending ? null : handleToggle(poolType.primary))
            },
            {
              value: 'Hyper',
              label: 'Hyper',
              onClick: () => (operationPending ? null : handleToggle(poolType.hyper))
            }
          ]}
        />

        {((!breakpoint.isTablet && breakpoint.isLaptop) || breakpoint.isDesktop) && (
          <div className="flex items-center w-full gap-3.75">
            <SearchBar
              onChange={(e) => initiateGlobalSearch(e.target.value)}
              onClear={() => setSearchTokens('')}
              value={searchTokens}
              className={'min-w-[100px]'}
            />
            <div className={'flex flex-row ml-auto gap-3.75'}>
              {isClaimable > 0 && pubKey != null && (
                <Button
                  className={'before:animate-border-spin'}
                  variant={'outline'}
                  colorScheme={'secondaryGradient'}
                  onClick={() => setAllClaimModal(true)}
                  animated
                >
                  Claim All
                </Button>
              )}
              {pubKey != null && (
                <div className={cn('flex items-center mr-2', isClaimable ? `ml-0` : `ml-auto`)}>
                  <ShowDepositedToggle enabled={showDeposited} setEnable={handleShowDepositedToggle} />
                  <div
                    className="h-8.75 leading-5 text-regular text-right dark:text-grey-2 text-grey-1
               font-semibold mt-[-4px] ml-3.75 hidden min-lg:block"
                  >
                    Show <br /> Deposited
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {breakpoint.isMobile && (
        <div className="flex flex-row">
          <SearchBar
            className={pubKey ? 'w-[55%]' : 'min-md:w-[95%]'}
            onChange={(e) => initiateGlobalSearch(e.target.value)}
            onClear={() => setSearchTokens('')}
            value={searchTokens}
          />
          {pubKey && (
            <div className="ml-auto flex items-center">
              <Switch variant={'default'} checked={showDeposited} onClick={handleShowDepositedToggle} />
              <div
                className={`h-8.75 leading-5 text-regular sm:text-tiny sm:leading-[18px] text-right dark:text-grey-2 
                text-grey-1 font-semibold mt-[-4px] ml-2.5 sm:ml-2`}
              >
                Show <br /> Deposited
              </div>
            </div>
          )}
        </div>
      )}
      <FarmFilter poolSize={poolSize} sort={sort} sortType={sortType} handleColumnSort={handleColumnSort} />

      {initialLoad ? (
        <SkeletonCommon height="100px" style={{ marginTop: '15px' }} />
      ) : (
        <FarmItems
          tokens={filteredTokens}
          numberOfCoinsDeposited={numberOfCoinsDeposited}
          searchTokens={searchTokens}
          showDeposited={showDeposited}
        />
      )}
    </div>
  )
}
