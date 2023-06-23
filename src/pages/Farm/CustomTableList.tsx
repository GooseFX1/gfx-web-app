import React, { useState, useEffect, useRef, FC } from 'react'
import { PublicKey } from '@solana/web3.js'
import { saveLiquidityVolume, getVolumeApr, fetchTotalVolumeTrade, VolumeAprRecord } from '../../api/SSL'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
//import BN from 'bn.js'
import {
  getStakingAccountKey,
  fetchCurrentAmountStaked,
  getSslAccountKey,
  fetchAllSSLAmountStaked,
  getLiquidityAccountKey,
  getMainVaultKey,
  AccountLayout,
  // getNetworkConnection,
  getNetworkConnectionText
} from '../../web3'
import { SSL_LAYOUT, LIQUIDITY_ACCOUNT_LAYOUT, CONTROLLER_LAYOUT, ADDRESSES as SDK_ADDRESS } from 'goosefx-ssl-sdk'
import { useConnectionConfig, usePriceFeedFarm, useFarmContext } from '../../context'
import { ADDRESSES } from '../../web3'
import { MorePoolsSoon } from './MorePoolsSoon'
//import { NATIVE_MINT } from '@solana/spl-token-v2'
import { ZERO, NETWORK_CONSTANTS, TOKEN_NAMES, LAMPORTS_PER_SOL } from '../../constants'
//import { checkMobile } from '../../utils'
import ExpandRowView from './ExpandRowView'
import tw from 'twin.macro'
import { checkMobile, ConditionalData } from '../../utils'
import { ColumnHeadersMobile, ColumnHeadersWeb } from './Columns'

export interface IFarmData {
  // remove this and save in some otehr file
  id: string
  image: string
  name: string
  earned?: number
  apr: ConditionalData<number>
  rewards?: number
  liquidity: number
  type: string
  ptMinted?: number
  userLiablity?: number
  currentlyStaked: number
  volume: ConditionalData<number>
}

const WRAPPER = styled.div<{ $lastRefreshedClass }>`
  margin-top: 5px; // ${({ $lastRefreshedClass }) => (!$lastRefreshedClass ? '45px' : '0px')}
  // window height - banner height - nav height
  height: calc(100vh - 216px);

  transition: 0.5s ease;
  overflow-y: auto;
  overflow-x: hidden;
  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: 100vh !important;
  }

  table {
    @media (max-width: 500px) {
      width: 100vw;
      position: absolute;
      margin-top: 2px;
    }
    width: 100%;
    ${tw`dark:bg-black-3 bg-white`}
    border-radius: 20px 20px 0 0;
  }
  .tableHeader {
    position: sticky;
    ${tw`text-base font-semibold text-white dark:bg-black-2 bg-black-4`}
  }
  .borderRow {
    border-radius: 20px 0px 0px 25px;
    height: 74px;
    border-right: 2px solid ${({ theme }) => theme.tableHeader};
    @media (max-width: 500px) {
      ${tw`h-[68px] w-[30%]`}
    }
  }
  .borderRow2 {
    border-radius: 0px 20px 25px 0px;
    border-left: 2px solid ${({ theme }) => theme.tableHeader};
  }
`

const CustomTableList: FC = () => {
  const { prices, priceFetched, refreshTokenData, setStatsData } = usePriceFeedFarm()
  const { network, connection } = useConnectionConfig()
  const wal = useWallet()
  const { wallet } = useWallet()
  const {
    counter,
    showDeposited,
    poolFilter,
    searchFilter,
    farmDataContext,
    setFarmDataContext,
    farmDataSSLContext,
    setFarmDataSSLContext,
    setRefreshClass,
    lastRefreshedClass
  } = useFarmContext()
  const [accountKey, setAccountKey] = useState<PublicKey>()
  const [farmData, setFarmData] = useState<IFarmData[]>([...farmDataContext, ...farmDataSSLContext])
  const [sslVolume, setSslVolume] = useState<number>(0)
  const [stakeVolume, setStakeVolume] = useState<number>(0)
  const [liquidityObject, setLiquidityObject] = useState<Record<string, number>>({})
  const [aprVolumeData, setAprVolumeData] = useState<VolumeAprRecord>()
  const [savedVolume, setSavedVolume] = useState<boolean>(false)
  const [volume7daySum, setVolume7daySum] = useState<number>(0)
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined)
  const [totalVolumeTrade, setTotalVolumeTrade] = useState<number | undefined>(undefined)

  const tableRef = useRef(null)

  useEffect(() => {
    refreshTokenData()
    ;(async () => {
      const SSLTokenNames = []
      const tokenMintAddresses = []
      if (network !== NETWORK_CONSTANTS.DEVNET) {
        farmDataSSLContext.map((data) => SSLTokenNames.push(data.name))
        for (let i = 0; i < SSLTokenNames.length; i++) {
          const tokenMint = ADDRESSES[network].sslPool[SSLTokenNames[i]].address
          tokenMintAddresses.push(tokenMint)
        }
        const data = await getVolumeApr(
          tokenMintAddresses,
          SSLTokenNames,
          SDK_ADDRESS.MAINNET.GFX_CONTROLLER.toString()
        )
        setAprVolumeData(data)
        const totalVolume = await fetchTotalVolumeTrade()
        setTotalVolumeTrade(totalVolume.totalVolumeTrade)
      }
    })()
  }, [counter])

  useEffect(() => {
    if (
      stakeVolume !== 0 &&
      sslVolume !== 0 &&
      Object.keys(liquidityObject).length > 0 &&
      network === NETWORK_CONSTANTS.MAINNET &&
      savedVolume === false
    ) {
      saveLiquidityVolume(sslVolume, stakeVolume, liquidityObject).then(() => setSavedVolume(true))
    }
  }, [sslVolume, stakeVolume, liquidityObject])

  useEffect(() => {
    setStatsData({
      tvl: stakeVolume !== 0 && sslVolume !== 0 ? sslVolume + stakeVolume : null,
      volume7dSum: volume7daySum !== 0 ? volume7daySum : null,
      totalVolumeTrade: totalVolumeTrade ? totalVolumeTrade : null
    })
  }, [volume7daySum, sslVolume, stakeVolume, totalVolumeTrade])

  useEffect(() => {
    if (wallet?.adapter?.publicKey) {
      if (accountKey === undefined) {
        getStakingAccountKey(wal, network).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return null
  }, [wallet?.adapter?.publicKey, connection])

  const getTokenPrice = (name) => {
    if (name === TOKEN_NAMES.USDC) {
      return prices[`${name.toUpperCase()}/USDT`]
    }
    if (name === TOKEN_NAMES.USDT) {
      return prices[`${name.toUpperCase()}/USD`]
    }
    // to get price of the token MSOL must be in upper case while to get tokenInfo address mSOL
    return prices[`${name.toUpperCase()}/USDC`]
  }

  const calculateBalances = (sslAccountData, mainVault, liquidityAccountData, SSLTokenNames: string[]) => {
    const farmCalculationsArr: IFarmData[] = []
    let totalLiquidity = 0
    let volume7dSum = 0
    const liqObj: Record<string, number> = {}
    sslAccountData.forEach(({ data }, i) => {
      const sslData = SSL_LAYOUT.decode(data)
      const mainVaultData = AccountLayout.decode(mainVault[i].data)
      const tokenName = SSLTokenNames[i]
      const liquidityData =
        liquidityAccountData && liquidityAccountData[i] !== null ? liquidityAccountData[i].data : undefined
      const liquidityAccount = liquidityData ? LIQUIDITY_ACCOUNT_LAYOUT.decode(liquidityData) : undefined
      const tokenPrice = getTokenPrice(tokenName).current

      const liquidity = mainVaultData.amount + sslData.swappedLiabilityNative
      const ptMinted = liquidityAccount ? liquidityAccount.ptMinted : 0

      const userLiablity = liquidityAccount ? (liquidity * liquidityAccount.share) / sslData.totalShare : ZERO
      const amountDeposited = liquidityAccount ? liquidityAccount.amountDeposited : ZERO

      const earned = liquidityAccount ? userLiablity - amountDeposited : 0

      const aprResult = aprVolumeData && aprVolumeData[tokenName]?.apr
      const volumeDays = aprVolumeData && aprVolumeData[tokenName]?.volume

      const apr: ConditionalData<number> = !aprResult
        ? 'not-supported'
        : tokenName === TOKEN_NAMES.GMT
        ? 0
        : Math.max(aprResult * 100, -100)

      const volume: ConditionalData<number> =
        !volumeDays || volumeDays * tokenPrice < 10 ? 'not-supported' : volumeDays * tokenPrice

      const farmCalculation = {
        image: tokenName,
        name: tokenName,
        type: 'SSL',
        id: tokenName,
        apr,
        volume,
        liquidity: tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0,
        currentlyStaked: wallet?.adapter?.publicKey
          ? Number(amountDeposited) / Math.pow(10, sslData.decimals)
          : undefined,
        earned: wallet?.adapter?.publicKey ? Number(earned) / Math.pow(10, sslData.decimals) : undefined,
        userLiablity: Number(userLiablity),
        ptMinted: Number(ptMinted) / Math.pow(10, 9)
      }
      farmCalculationsArr.push(farmCalculation)
      volume7dSum += volumeDays ? volumeDays * tokenPrice : 0
      liqObj[`${tokenName}`] = tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0
      totalLiquidity += tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0
    })
    setFarmDataSSLContext(farmCalculationsArr)
    setSslVolume(totalLiquidity)
    setLiquidityObject(liqObj)
    setVolume7daySum(volume7dSum)
    setTimeout(() => {
      setRefreshClass('')
    }, 1800)
    return
  }

  useEffect(() => {
    ;(async () => {
      if (priceFetched && aprVolumeData) {
        const SSLTokenNames = []
        farmDataSSLContext.map((data) => SSLTokenNames.push(data.name))
        const SSLAccountKeys = []
        const liquidityAccountKeys = []
        const mainVaultKeys = []
        for (let i = 0; i < SSLTokenNames.length; i++) {
          try {
            const tokenMint = ADDRESSES[network].sslPool[SSLTokenNames[i]].address
            SSLAccountKeys.push(await getSslAccountKey(tokenMint, network))
            liquidityAccountKeys.push(await getLiquidityAccountKey(wal, tokenMint, network))
            mainVaultKeys.push(await getMainVaultKey(tokenMint, network))
          } catch (err) {
            console.log(err)
          }
        }

        fetchAllSSLAmountStaked(connection, SSLAccountKeys, wal, liquidityAccountKeys, mainVaultKeys).then((res) =>
          calculateBalances(res.sslData, res.mainVault, res.liquidityData, SSLTokenNames)
        )
      }
    })()
  }, [accountKey, counter, connection, priceFetched, aprVolumeData])

  useEffect(() => {
    if (priceFetched) {
      fetchGOFXData()
        .then((farmData) => {
          if (farmData?.length > 0) {
            setFarmDataContext(farmData)
          }
        })
        .catch((err) => console.log(err))
    }
  }, [accountKey, counter, priceFetched])

  useEffect(() => {
    // this useEffect is to monitor staking and SSL pools button
    const allFarmData = [...farmDataContext, ...farmDataSSLContext]
    let farmDataStaked = []

    if (poolFilter !== 'All pools') farmDataStaked = allFarmData.filter((fData) => fData.type === poolFilter)
    else farmDataStaked = allFarmData

    if (searchFilter)
      farmDataStaked = farmDataStaked.filter((fData) => {
        const tokenName = fData.name.toLowerCase()
        if (tokenName.includes(searchFilter.toLowerCase())) return true
      })

    if (showDeposited && wallet?.adapter?.publicKey)
      farmDataStaked = farmDataStaked.filter((fData) => fData.currentlyStaked > 0)
    if (sortColumn !== undefined) {
      const sortedData = farmDataStaked.sort((a, b) => {
        if (sortColumn === 'name') return a[sortColumn].localeCompare(b[sortColumn])
        else return b[sortColumn] - a[sortColumn]
      })
      farmDataStaked = sortedData
    }
    setFarmData(farmDataStaked)
  }, [poolFilter, searchFilter, showDeposited, farmDataContext, farmDataSSLContext, sortColumn, priceFetched])

  const fetchGOFXData = async () => {
    try {
      // pool data take this function to context
      const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER
      const { data: controllerData } = await connection.getAccountInfo(CONTROLLER_KEY)
      const { stakingBalance, dailyReward } = await CONTROLLER_LAYOUT.decode(controllerData)

      const liqidity = Number(stakingBalance / LAMPORTS_PER_SOL)

      const DR = Number(dailyReward / LAMPORTS_PER_SOL)
      const APR: number = (1 / liqidity) * DR * 365
      // user account data
      const accountData = await fetchCurrentAmountStaked(connection, network, wal)
      const currentlyStaked = liqidity
        ? accountData.tokenStaked !== undefined
          ? accountData.tokenStaked
          : 0
        : undefined
      const earned = liqidity ? (accountData.tokenEarned !== undefined ? accountData.tokenEarned : 0) : undefined
      const dailyRewards = (APR * currentlyStaked) / 365
      const newFarmDataContext: IFarmData[] = farmDataContext.map((data) =>
        data.name === TOKEN_NAMES.GOFX
          ? {
              ...data,
              earned: earned,
              apr: APR * 100,
              rewards: dailyRewards,
              liquidity: getTokenPrice(TOKEN_NAMES.GOFX).current * liqidity,
              currentlyStaked: currentlyStaked,
              volume: 'not-supported'
            }
          : data
      )
      setStakeVolume(getTokenPrice(TOKEN_NAMES.GOFX).current * liqidity)
      return newFarmDataContext
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <WRAPPER $lastRefreshedClass={lastRefreshedClass === 'hide' || lastRefreshedClass === undefined}>
      <table ref={tableRef}>
        <thead className="tableHeader">
          <tr>
            {checkMobile() ? (
              <ColumnHeadersMobile sortColumn={sortColumn} setSortColumn={setSortColumn} />
            ) : (
              <ColumnHeadersWeb sortColumn={sortColumn} setSortColumn={setSortColumn} />
            )}
          </tr>
        </thead>
        <tbody>
          {farmData.map((farm: IFarmData, index: number) => (
            <ExpandRowView key={index} index={index} farm={farm} />
          ))}
          <MorePoolsSoon tableRef={tableRef} length={farmData.length} />
        </tbody>
      </table>
    </WRAPPER>
  )
}

export default CustomTableList
