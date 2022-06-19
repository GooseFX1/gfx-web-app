import React, { useState, useMemo, useEffect } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { fetchSSLVolumeData, fetchSSLAPR } from '../../api/SSL'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import styled, { css } from 'styled-components'
import { Table } from 'antd'
import BN from 'bn.js'
import { columns } from './Columns'
import { ExpandedDynamicContent } from './ExpandedDynamicContent'
import {
  getStakingAccountKey,
  fetchCurrentAmountStaked,
  CONTROLLER_KEY,
  CONTROLLER_LAYOUT,
  fetchSSLAmountStaked,
  getTokenAddresses,
  getSslAccountKey,
  fetchAllSSLAmountStaked,
  SSL_LAYOUT,
  getLiquidityAccountKey,
  LIQUIDITY_ACCOUNT_LAYOUT
} from '../../web3'
import { useConnectionConfig, usePriceFeedFarm, useFarmContext } from '../../context'
import { ADDRESSES } from '../../web3'
import { MorePoolsSoon } from './MorePoolsSoon'

const StakeIDL = require('../../web3/idl/stake.json')
const SSLIDL = require('../../web3/idl/ssl.json')

//#region styles
export const STYLED_TABLE_LIST = styled(Table)`
  ${({ theme }) => `
  max-width: 100%;
  .ant-table {
    background: ${theme.bg17};
    border-radius: 20px 20px 0px 0px;
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
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 25px;
  }
  .ant-table-thead {
     top: 200px;
     background: ${theme.farmHeaderBg};
    > tr {
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

export const TableList = ({ dataSource }: any) => {
  const { prices, priceFetched } = usePriceFeedFarm()
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
  const [columnData, setColumnData] = useState(columns)
  const [farmData, setFarmData] = useState<IFarmData[]>([...farmDataContext, ...farmDataSSLContext])
  const [eKeys, setEKeys] = useState([])
  const [allTokenPrices, setAllTokenPrices] = useState({})
  const PAGE_SIZE = 10

  const gofxPrice = useMemo(() => prices['GOFX/USDC'], [prices])
  useEffect(() => {
    setAllTokenPrices(() => setAllTokenPrices(prices))
    console.log(prices)
  }, [priceFetched])

  const stakeProgram: Program = useMemo(() => {
    return wallet.publicKey
      ? new Program(
          StakeIDL,
          ADDRESSES[network].programs.stake.address,
          new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
        )
      : undefined
  }, [connection, wallet.publicKey])

  const SSLProgram: Program = useMemo(() => {
    return wallet.publicKey
      ? new Program(
          SSLIDL,
          ADDRESSES[network].programs.ssl.address,
          new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
        )
      : undefined
  }, [connection, wallet.publicKey])

  useEffect(() => {
    if (wallet.publicKey) {
      if (accountKey === undefined) {
        getStakingAccountKey(wallet).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return () => {}
  }, [wallet.publicKey, connection])

  const calculateBalances = (sslAccountData, liquidityAccountData, SSLTokenNames: string[]) => {
    const balances = []
    for (let i = 0; i < sslAccountData.length; i++) {
      const { data } = sslAccountData[i]
      const sslData = SSL_LAYOUT.decode(data)
      const tokenName = SSLTokenNames[i]
      const liquidityData = liquidityAccountData[i].data
      const liquidityAccount = LIQUIDITY_ACCOUNT_LAYOUT.decode(liquidityData)
      const tokenPrice = tokenName === 'USDC' ? 1 : prices[`${tokenName.toUpperCase()}/USDC`]?.current
      //@ts-ignore
      let liquidity = sslData.liability + sslData.swappedLiability
      const ptMinted = liquidityAccount ? liquidityAccount.ptMinted : 0
      //@ts-ignore
      const userLiablity = liquidityAccount ? (liquidity * liquidityAccount.share) / sslData.totalShare : 0n
      const amountDeposited = liquidityAccount ? liquidityAccount.amountDeposited : 0
      //@ts-ignore
      const earned = liquidityAccount ? userLiablity - amountDeposited : 0
      const calculations = {
        //@ts-ignore
        earned: Math.max(Number(earned) / Math.pow(10, sslData.decimals), 0),
        image: tokenName,
        name: tokenName,
        type: 'SSL',
        id: tokenName,
        key: tokenName,
        // apr: isNaN(APR) ? '-' : Math.max(APR * 100, 0),
        liquidity: tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0,
        currentlyStaked: Number(amountDeposited) / Math.pow(10, sslData.decimals),
        userLiablity: Number(userLiablity),
        ptMinted: Number(ptMinted) / Math.pow(10, 9)
        //volume: isNaN(volumeDays?.volume) || volumeDays?.volume < 100 ? '-' : volumeDays.volume
      }
      balances.push(calculations)
    }
    return balances
  }
  useEffect(() => {
    ;(async () => {
      if (priceFetched) {
        // fetchSSLData()
        //   .then((farmSSLData) => {
        //     if (farmSSLData) setFarmDataSSLContext(farmSSLData)
        //   })
        //   .catch((err) => console.log(err))
        const promiseData = []
        let SSLTokenNames = []
        farmDataSSLContext.map((data) => SSLTokenNames.push(data.name))
        const SSLAccountKeys = []
        const liquidityAccountKeys = []

        const tokenMintAddresses = []
        for (let i = 0; i < SSLTokenNames.length; i++) {
          try {
            const tokenMint = ADDRESSES[network].sslPool[SSLTokenNames[i]].address
            tokenMintAddresses.push(tokenMint)
            SSLAccountKeys.push(await getSslAccountKey(tokenMint))
            liquidityAccountKeys.push(await getLiquidityAccountKey(wallet, tokenMint))
          } catch (err) {}

          //promiseData.push(fetchSSLData(SSLTokenNames[i]))
        }
        const { sslData, liquidityData } = await fetchAllSSLAmountStaked(
          connection,
          SSLAccountKeys,
          wallet,
          liquidityAccountKeys
        )
        const farmData = calculateBalances(sslData, liquidityData, SSLTokenNames)
        setFarmDataSSLContext(farmData)
        // console.log(tokenMintAddresses)
        //Promise.all(promiseData).then((res) => setFarmDataSSLContext(res))
      }
    })()
  }, [accountKey, counter, priceFetched])

  useEffect(() => {
    if (gofxPrice !== undefined) {
      fetchGOFXData(accountKey)
        .then((farmData) => {
          if (farmData.length > 0) {
            setFarmDataContext(farmData)
          }
        })
        .catch((err) => console.log(err))
    }
  }, [accountKey, gofxPrice, counter])

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

  const fetchSSLData = async (tokenName: any) => {
    let SSLTokenNames = []
    //farmDataSSLContext.map((data) => SSLTokenNames.push(data.name))
    let newFarmDataContext = farmDataSSLContext
    try {
      //    for (let i = 0; i < SSLTokenNames.length; i++) {
      const tokenAddress = ADDRESSES[network].sslPool[tokenName].address
      //  let APR = await fetchSSLAPR(tokenAddress.toString())
      // let volumeDays = await fetchSSLVolumeData(tokenAddress.toString())
      const sslAccountKey = await getSslAccountKey(tokenAddress)
      let { sslData, liquidityAccount } = await fetchSSLAmountStaked(connection, sslAccountKey, wallet, tokenAddress)
      const tokenPrice = tokenName === 'USDC' ? 1 : allTokenPrices[`${tokenName.toUpperCase()}/USDC`]?.current
      //@ts-ignore
      let liquidity = sslData.liability + sslData.swappedLiability
      const ptMinted = liquidityAccount ? liquidityAccount.ptMinted : 0
      //@ts-ignore
      const userLiablity = liquidityAccount ? (liquidity * liquidityAccount.share) / sslData.totalShare : 0n
      const amountDeposited = liquidityAccount ? liquidityAccount.amountDeposited : 0
      //@ts-ignore
      const earned = liquidityAccount ? userLiablity - amountDeposited : 0

      const data = {
        //@ts-ignore
        earned: Math.max(Number(earned) / Math.pow(10, sslData.decimals), 0),
        image: tokenName,
        name: tokenName,
        type: 'SSL',
        id: tokenName,
        key: tokenName,
        // apr: isNaN(APR) ? '-' : Math.max(APR * 100, 0),
        liquidity: tokenPrice ? tokenPrice * (Number(liquidity) / Math.pow(10, sslData.decimals)) : 0,
        currentlyStaked: Number(amountDeposited) / Math.pow(10, sslData.decimals),
        userLiablity: Number(userLiablity),
        ptMinted: Number(ptMinted) / Math.pow(10, 9)
        //volume: isNaN(volumeDays?.volume) || volumeDays?.volume < 100 ? '-' : volumeDays.volume
      }
      return data
      //}
    } catch (err) {
      console.error(err, tokenName)
    }
    return newFarmDataContext
  }
  const fetchGOFXData = async (accountKey: PublicKey) => {
    // pool data take this function to context
    const { data: controllerData } = await connection.getAccountInfo(CONTROLLER_KEY)
    const { staking_balance, daily_reward } = await CONTROLLER_LAYOUT.decode(controllerData)
    const LAMPORT = new BN(LAMPORTS_PER_SOL)
    const liqidity: number = new BN(staking_balance).div(LAMPORT).toNumber()
    const APR: number = (1 / liqidity) * (daily_reward.toNumber() / LAMPORTS_PER_SOL) * 365

    // user account data
    const accountData = await fetchCurrentAmountStaked(connection, accountKey, wallet)
    const currentlyStaked = accountData.tokenStaked ? accountData.tokenStaked : 0
    const dailyRewards = (APR * currentlyStaked) / 365
    const newFarmDataContext = farmDataContext.map((data) => {
      if (data.name === 'GOFX') {
        return {
          ...data,
          earned: accountData.tokenEarned ? accountData.tokenEarned : 0,
          apr: APR * 100,
          rewards: dailyRewards,
          liquidity: gofxPrice.current * liqidity,
          currentlyStaked: currentlyStaked,
          volume: '-'
        }
      } else return data
    })
    return newFarmDataContext
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
        columns={columnData}
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
        expandIconColumnIndex={6}
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
