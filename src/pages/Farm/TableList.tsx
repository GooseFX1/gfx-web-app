import React, { useState, useMemo, useEffect } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { saveLiquidtyVolume, getVolumeApr } from '../../api/SSL'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import styled, { css } from 'styled-components'
import { Table } from 'antd'
//import BN from 'bn.js'
import { columns, mobileColumns } from './Columns'
import { ExpandedDynamicContent } from './ExpandedDynamicContent'
import {
  getStakingAccountKey,
  fetchCurrentAmountStaked,
  getSslAccountKey,
  fetchAllSSLAmountStaked,
  getLiquidityAccountKey,
  getMainVaultKey,
  AccountLayout,
  getNetworkConnection,
  getNetworkConnectionText
} from '../../web3'
import { SSL_LAYOUT, LIQUIDITY_ACCOUNT_LAYOUT, CONTROLLER_LAYOUT, ADDRESSES as SDK_ADDRESS } from 'goosefx-ssl-sdk'
import { useConnectionConfig, usePriceFeedFarm, useFarmContext } from '../../context'
import { ADDRESSES } from '../../web3'
import { MorePoolsSoon } from './MorePoolsSoon'
//import { NATIVE_MINT } from '@solana/spl-token-v2'
import { CONTROLLER_IDL, SSL_IDL } from 'goosefx-ssl-sdk'
import { NETWORK_CONSTANTS, TOKEN_NAMES } from '../../constants'
import { checkMobile } from '../../utils'

//#region styles
export const STYLED_TABLE_LIST = styled(Table)`
  ${({ theme }) => `
  max-width: 100%;
  .ant-table {
    background: ${theme.bg17};
    border-radius: 25px 25px 0px 0px;
    box-shadow: ${theme.tableListBoxShadow};
  }
  .normal-text {
    font-family: Montserrat;
    font-size: 17px;
    font-weight: 600;
    text-align: center;
    color: ${theme.text8};
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    background: none;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 25px;

    @media(max-width: 500px){
      border-top-left-radius: 25px;
      border-bottom-left-radius: 10px;
    }
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 25px;

      @media(max-width: 500px){
        border-top-right-radius: 25px;
        border-bottom-right-radius: 10px;

    }
  }
  .ant-table-thead {
     top: 200px;
     background: ${theme.farmHeaderBg};
    > tr {
      >th:first-child > div {
        width: 105px;
      }
      >th:second-child > div {
        display: flex;
        justify-content: end;
      }
      > th {
        border: none;
        height: 74px;
        font-size: 16px;
        font-weight: 700;
        color: ${theme.text1};
        background-color: transparent;
        &:before {
          content: none !important;
        }
      }
    }
    @media (max-width: 500px){
      height: 68px;
      > tr{
        > th{
          height: 100%;
          padding: 0 5px 0 15px;
        }
      }
    }
  }
  .ant-table-tbody {
    > tr {
      &.ant-table-expanded-row {
        > td {
          padding: 0px;
          border-bottom: 0;
        }
      }
      > td {
        background-color: ${theme.bg17};
        border-bottom: 1px solid #BABABA !important;
        padding: ${theme.margin(3)};

        @media (max-width: 500px){
          padding: 38px 0px 38px 22px;
        }
      }
      &.ant-table-row {
        > td {
          background-color: ${theme.expendedRowBg} !important;
        }
      }
      &.ant-table-row:hover {
        > td {
          background-color: ${theme.hoverTrFarmBg} !important;
        }
      }
    }
  }
  .ant-table-placeholder{
    display: none;
  }
  .hide-row {
    display: none;
  }
  .ant-pagination-item {
    a {
      display: inline;
      color: ${theme.text6};
    }

    &:hover{
      a {
        color: ${theme.text6};
      }
    }

    &:hover{
      border-color: ${theme.text6};
    }
  }
  
  .ant-pagination-item-active {
    border-color: transparent;
    a {
      color: ${theme.text6};
    }

    &:hover {
      border-color: ${theme.grey1};
    }
  }

  .ant-pagination-item-link {
    color: ${theme.text6};

    &:hover {
      border-color: ${theme.text6};
      color: ${theme.text6};
    }
  }

  .expanded-active {
    cursor: pointer;
    transform: rotate(180deg);
  }
`}
`

export const STYLED_EXPAND_ICON = styled.img<{ expanded: boolean }>`
  ${({ expanded }) => css`
    cursor: pointer;
    transform: ${expanded ? 'rotate(180deg)' : 'rotate(0)'};
    filter: ${({ theme }) => theme.filterDownIcon};
  `}
`

export interface IFarmData {
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
}
//#endregion

//eslint-disable-next-line
export const TableList = ({ dataSource }: any) => {
  const { prices, priceFetched, refreshTokenData } = usePriceFeedFarm()
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
    setFarmDataSSLContext
  } = useFarmContext()
  const [accountKey, setAccountKey] = useState<PublicKey>()
  const [columnData] = useState(columns)
  const [mobileColumnData] = useState(mobileColumns)
  const [farmData, setFarmData] = useState<IFarmData[]>([...farmDataContext, ...farmDataSSLContext])
  const [eKeys, setEKeys] = useState([])
  //const PAGE_SIZE = 10
  //const controllerStr = SDK_ADDRESS[getNetworkConnection(network)].GFX_CONTROLLER.toString()
  const [sslVolume, setSslVolume] = useState<number>(0)
  const [stakeVolume, setStakeVolume] = useState<number>(0)
  const [liquidityObject, setLiquidityObject] = useState({})
  const [aprVolumeData, setAprVolumeData] = useState({})

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
      }
    })()
  }, [])

  useEffect(() => {
    if (
      stakeVolume !== 0 &&
      sslVolume !== 0 &&
      Object.keys(liquidityObject).length > 0 &&
      network === NETWORK_CONSTANTS.MAINNET
    ) {
      saveLiquidtyVolume(sslVolume, stakeVolume, liquidityObject)
    }
  }, [sslVolume, stakeVolume, liquidityObject])

  const stakeProgram: Program = useMemo(() => {
    return wallet.publicKey
      ? new Program(
          CONTROLLER_IDL as any,
          SDK_ADDRESS[getNetworkConnection(network)].CONTROLLER_PROGRAM_ID,
          new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
        )
      : undefined
  }, [connection, wallet.publicKey, network])

  const SSLProgram: Program = useMemo(() => {
    return wallet.publicKey
      ? new Program(
          SSL_IDL as any,
          SDK_ADDRESS[getNetworkConnection(network)].SSL_PROGRAM_ID,
          new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
        )
      : undefined
  }, [connection, wallet.publicKey])

  useEffect(() => {
    if (wallet.publicKey) {
      if (accountKey === undefined) {
        getStakingAccountKey(wallet, network).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return () => {}
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

      const APR = aprVolumeData[tokenName]?.apr
      const volumeDays = aprVolumeData[tokenName]?.volume

      const farmCalculation = {
        //@ts-ignore
        earned: Math.max(Number(earned) / Math.pow(10, sslData.decimals), 0),
        image: tokenName,
        name: tokenName,
        type: 'SSL',
        id: tokenName,
        key: tokenName,
        apr: isNaN(APR) ? '-' : Math.max(APR * 100, 0),
        liquidity: tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0,
        currentlyStaked: Number(amountDeposited) / Math.pow(10, sslData.decimals),
        userLiablity: Number(userLiablity),
        ptMinted: Number(ptMinted) / Math.pow(10, 9),
        volume: isNaN(volumeDays) || volumeDays * tokenPrice < 10 ? '-' : volumeDays * tokenPrice
      }
      farmCalculationsArr.push(farmCalculation)
      liqObj[`${tokenName}`] = tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0
      totalLiquidity += tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0
    }
    setFarmDataSSLContext(farmCalculationsArr)
    setSslVolume(totalLiquidity)
    setLiquidityObject(liqObj)

    return
  }

  useEffect(() => {
    ;(async () => {
      if (priceFetched) {
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

        fetchAllSSLAmountStaked(connection, SSLAccountKeys, wallet, liquidityAccountKeys, mainVaultKeys).then((res) =>
          calculateBalances(res.sslData, res.mainVault, res.liquidityData, SSLTokenNames)
        )
      }
    })()
  }, [accountKey, counter, connection, priceFetched])

  useEffect(() => {
    if (priceFetched) {
      fetchGOFXData(accountKey)
        .then((farmData) => {
          if (farmData.length > 0) {
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

    if (showDeposited && wallet.publicKey) farmDataStaked = farmDataStaked.filter((fData) => fData.currentlyStaked > 0)

    setFarmData(farmDataStaked)
  }, [poolFilter, searchFilter, showDeposited, farmDataContext, farmDataSSLContext, priceFetched])

  //eslint-disable-next-line
  const fetchGOFXData = async (accountKey: PublicKey) => {
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
      const currentlyStaked = accountData.tokenStaked ? accountData.tokenStaked : 0
      const dailyRewards = (APR * currentlyStaked) / 365
      const newFarmDataContext = farmDataContext.map((data) => {
        if (data.name === TOKEN_NAMES.GOFX) {
          return {
            ...data,
            earned: accountData.tokenEarned ? Math.max(accountData.tokenEarned, 0) : 0,
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

  const onExpandIcon = (id) => {
    const temp = [...eKeys]
    const j = temp.indexOf(id)
    if (j > -1) temp.splice(j, 1)
    else temp.push(id)
    setEKeys(temp)
  }
  const TableData = (
    <div>
      <STYLED_TABLE_LIST
        rowKey="id"
        columns={checkMobile() ? mobileColumnData : columnData}
        dataSource={farmData}
        pagination={false}
        bordered={false}
        rowClassName={(record: IFarmData) => (eKeys.indexOf(record.id) >= 0 ? 'hide-row' : '')}
        expandedRowKeys={eKeys}
        onRow={(record: IFarmData) => ({
          onClick: () => onExpandIcon(record.id)
        })}
        expandRowByClick={true}
        expandedRowRender={(rowData: IFarmData) => {
          return (
            <ExpandedDynamicContent
              rowData={rowData}
              onExpandIcon={onExpandIcon}
              stakeProgram={stakeProgram}
              SSLProgram={SSLProgram}
              stakeAccountKey={accountKey}
            />
          )
        }}
        expandIcon={(ps) => <ExpandIcon {...ps} onClick={onExpandIcon} />}
        expandIconColumnIndex={checkMobile() ? -1 : 6}
      />
      <MorePoolsSoon />
    </div>
  )

  return TableData
}

const ExpandIcon = (props) => {
  const { expanded, record, onClick } = props
  return (
    <STYLED_EXPAND_ICON
      expanded={expanded}
      src={`/img/assets/arrow-down-large.svg`}
      onClick={() => onClick(record.id)}
      alt=""
    />
  )
}
