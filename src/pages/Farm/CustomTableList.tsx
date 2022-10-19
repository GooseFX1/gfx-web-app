import React, { useState, useEffect, useRef } from 'react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { saveLiquidtyVolume, getVolumeApr, fetchTotalVolumeTrade } from '../../api/SSL'
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
import { useConnectionConfig, usePriceFeedFarm, useFarmContext, useNavCollapse } from '../../context'
import { ADDRESSES } from '../../web3'
import { MorePoolsSoon } from './MorePoolsSoon'
//import { NATIVE_MINT } from '@solana/spl-token-v2'
import { NETWORK_CONSTANTS, TOKEN_NAMES } from '../../constants'
//import { checkMobile } from '../../utils'
import ExpandRowView from './ExpandRowView'
import tw from 'twin.macro'
import { checkMobile } from '../../utils'
import { ColumnHeadersMobile, ColumnHeadersWeb } from './Columns'

export interface IFarmData {
  // remove this and save in some otehr file
  id: string
  image: string
  name: string
  earned?: number
  apr?: number | string
  rewards?: number
  liquidity: number
  type: string
  ptMinted?: number
  userLiablity?: number
  currentlyStaked: number
  volume?: number | string
}

const WRAPPER = styled.div<{ $navCollapsed }>`
  margin-top: 10px;
  height: calc(75vh + ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
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
    background: ${({ theme }) => theme.bg17};
    border-radius: 20px 20px 0 0;
  }
  .tableHeader {
    position: sticky;
    ${tw`text-base font-semibold	text-white`}
    background: ${({ theme }) => theme.tableHeader};
  }
  .borderRow {
    border-radius: 20px 0px 0px 25px;
    height: 74px;
    @media (max-width: 500px) {
      width: 30%;
      height: 68px;
    }
  }

  .borderRow2 {
    border-radius: 0px 20px 25px 0px;
    color: ${({ theme }) => theme.tableHeader};
  }
`

const CustomTableList = () => {
  const { prices, priceFetched, refreshTokenData, setStatsData } = usePriceFeedFarm()
  const { network, connection } = useConnectionConfig()
  const wallet = useWallet()
  const {
    counter,
    showDeposited,
    poolFilter,
    searchFilter,
    farmDataContext,
    setFarmDataContext,
    farmDataSSLContext,
    setFarmDataSSLContext,
    setRefreshClass
  } = useFarmContext()
  const [accountKey, setAccountKey] = useState<PublicKey>()
  const [farmData, setFarmData] = useState<IFarmData[]>([...farmDataContext, ...farmDataSSLContext])
  const [sslVolume, setSslVolume] = useState<number>(0)
  const [stakeVolume, setStakeVolume] = useState<number>(0)
  const [liquidityObject, setLiquidityObject] = useState({})
  const [aprVolumeData, setAprVolumeData] = useState<any>()
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
        const { data } = await getVolumeApr(
          tokenMintAddresses,
          SSLTokenNames,
          SDK_ADDRESS.MAINNET.GFX_CONTROLLER.toString()
        )
        setAprVolumeData(data)
        const totalVolumeTrade = await fetchTotalVolumeTrade()
        console.log(totalVolumeTrade)
        setTotalVolumeTrade(isNaN(totalVolumeTrade) ? totalVolumeTrade.totalVolumeTrade : totalVolumeTrade)
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
      saveLiquidtyVolume(sslVolume, stakeVolume, liquidityObject)
      setSavedVolume(true)
    }
  }, [sslVolume, stakeVolume, liquidityObject])

  useEffect(() => {
    if (stakeVolume !== 0 && sslVolume !== 0 && volume7daySum !== 0 && totalVolumeTrade)
      setStatsData({
        tvl: sslVolume + stakeVolume,
        volume7dSum: volume7daySum,
        totalVolumeTrade: totalVolumeTrade
      })
  }, [volume7daySum, sslVolume, stakeVolume])

  useEffect(() => {
    if (wallet.publicKey) {
      if (accountKey === undefined) {
        getStakingAccountKey(wallet, network).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return null
  }, [wallet.publicKey, connection])

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
    const farmCalculationsArr = []
    let totalLiquidity = 0
    let volume7dSum = 0
    const liqObj = {}
    for (let i = 0; i < sslAccountData.length; i++) {
      const { data } = sslAccountData[i]
      const sslData = SSL_LAYOUT.decode(data)
      const mainVaultData = AccountLayout.decode(mainVault[i].data)
      const tokenName = SSLTokenNames[i]
      const liquidityData =
        liquidityAccountData && liquidityAccountData[i] !== null ? liquidityAccountData[i].data : undefined
      const liquidityAccount = liquidityData ? LIQUIDITY_ACCOUNT_LAYOUT.decode(liquidityData) : undefined
      const tokenPrice = getTokenPrice(tokenName).current
      //@ts-ignore
      const liquidity = mainVaultData.amount + sslData.swappedLiabilityNative
      const ptMinted = liquidityAccount ? liquidityAccount.ptMinted : 0
      //@ts-ignore
      const userLiablity = liquidityAccount ? (liquidity * liquidityAccount.share) / sslData.totalShare : 0n
      const amountDeposited = liquidityAccount ? liquidityAccount.amountDeposited : 0
      //@ts-ignore
      const earned = liquidityAccount ? userLiablity - amountDeposited : 0

      const APR = aprVolumeData && aprVolumeData[tokenName]?.apr
      const volumeDays = aprVolumeData && aprVolumeData[tokenName]?.volume

      const farmCalculation = {
        //@ts-ignore
        image: tokenName,
        name: tokenName,
        type: 'SSL',
        id: tokenName,
        key: tokenName,
        apr: isNaN(APR) ? '-' : tokenName === TOKEN_NAMES.GMT ? 0 : Math.max(APR * 100, -100),
        liquidity: tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0,
        currentlyStaked: wallet.publicKey ? Number(amountDeposited) / Math.pow(10, sslData.decimals) : undefined,
        earned: wallet.publicKey ? Math.max(Number(earned) / Math.pow(10, sslData.decimals), 0) : undefined,
        userLiablity: Number(userLiablity),
        ptMinted: Number(ptMinted) / Math.pow(10, 9),
        volume: isNaN(volumeDays) || volumeDays * tokenPrice < 10 ? '-' : volumeDays * tokenPrice
      }
      farmCalculationsArr.push(farmCalculation)
      volume7dSum += volumeDays ? volumeDays * tokenPrice : 0
      liqObj[`${tokenName}`] = tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0
      totalLiquidity += tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0
    }
    setFarmDataSSLContext(farmCalculationsArr)
    setSslVolume(totalLiquidity)
    setLiquidityObject(liqObj)
    setVolume7daySum(volume7dSum)
    setRefreshClass('')
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
            liquidityAccountKeys.push(await getLiquidityAccountKey(wallet, tokenMint, network))
            mainVaultKeys.push(await getMainVaultKey(tokenMint, network))
          } catch (err) {
            console.log(err)
          }
        }

        fetchAllSSLAmountStaked(connection, SSLAccountKeys, wallet, liquidityAccountKeys, mainVaultKeys).then(
          (res) => calculateBalances(res.sslData, res.mainVault, res.liquidityData, SSLTokenNames)
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

    if (showDeposited && wallet.publicKey)
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
      //@ts-ignore
      const liqidity = Number(stakingBalance / BigInt(LAMPORTS_PER_SOL))
      //@ts-ignore
      const DR = Number(dailyReward / BigInt(LAMPORTS_PER_SOL))
      const APR: number = (1 / liqidity) * DR * 365
      // user account data
      const accountData = await fetchCurrentAmountStaked(connection, network, wallet)
      const currentlyStaked = accountData.tokenStaked !== undefined ? accountData.tokenStaked : undefined

      const dailyRewards = (APR * currentlyStaked) / 365
      const newFarmDataContext = farmDataContext.map((data) => {
        if (data.name === TOKEN_NAMES.GOFX) {
          return {
            ...data,
            earned: accountData.tokenEarned !== undefined ? accountData.tokenEarned : undefined,
            apr: APR * 100,
            rewards: dailyRewards,
            liquidity: getTokenPrice(TOKEN_NAMES.GOFX).current * liqidity,
            currentlyStaked: currentlyStaked,
            volume: '-'
          }
        } else return data
      })
      setStakeVolume(getTokenPrice(TOKEN_NAMES.GOFX).current * liqidity)
      return newFarmDataContext
    } catch (err) {
      console.log(err)
    }
  }
  const { isCollapsed } = useNavCollapse()
  return (
    <WRAPPER $navCollapsed={isCollapsed}>
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
