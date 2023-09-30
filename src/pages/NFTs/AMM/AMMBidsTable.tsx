import React, { FC, ReactElement, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useNFTAMMContext } from '../../../context/nft_amm'
import { IActiveOrdersAMM } from '../../../types/nft_collections'
import { formatSOLDisplay, notify, parseUnixTimestamp, truncateAddress } from '../../../utils'
import { Button } from '../../../components'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import InstantSellPopup from './InstantSellPopup'
import { useConnectionConfig, useNFTCollections } from '../../../context'
import { getCloseOrderPoolTx, orderDepositSol } from '../../../api/NFTs'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import { VersionedTransaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { confirmTransaction } from '../../../web3'
import { pleaseTryAgain, successBidAMMMessage } from '../Collection/AggModals/AggNotifications'

const WRAPPER_TABLE = styled.div<{ $cssStyle }>`
  overflow-x: hidden;
  width: 100%;
  ${tw`dark:bg-black-1 bg-grey-6`}
  ${({ $cssStyle }) => $cssStyle};
  ${({ theme }) => theme.customScrollBar('0px')}
  @media(max-width: 500px) {
    height: 100vh !important;
  }
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  table {
    @media (max-width: 500px) {
      width: 100%;
    }
    ${tw`w-full`}
  }
  thead,
  tbody,
  tr,
  td,
  th {
    display: block;
  }

  tr:after {
    content: ' ';
    /* display: block; */
    visibility: hidden;
    clear: both;
  }
  thead th {
    height: 26px;
    text-align: center;
    width: 14.25%;
  }
  tbody {
    height: calc(100vh - 80px);
    overflow-y: auto;
    transition: 0.5s ease;
    ${tw`sm:h-[100%] w-[100%]`}
  }
  td {
    ${tw`h-[50px] sm:h-[56px] w-[14.25%] pt-3`}
  }
  tbody td,
  thead th {
    float: left;
    text-align: center;
  }

  tbody {
    overflow-y: auto;
    ${({ theme }) => theme.customScrollBar('0px')}
  }
  th {
    color: ${({ theme }) => theme.text33};
  }
  td {
    text-align: center;
    ${tw`text-[15px] font-semibold`}
    color: ${({ theme }) => theme.text20};
  }
  .tableRow {
    ${tw`h-14 sm:h-[65px]`}
    @media(max-width: 500px) {
      /* border-bottom: 1px solid ${({ theme }) => theme.borderBottom} ; */
    }
  }
`
const AMMBidsTable = (): ReactElement => {
  const { activeOrders, instantSellClicked, setRefreshAPI } = useNFTAMMContext()
  useEffect(() => {
    setRefreshAPI((prev) => prev + 1)
  }, [])

  const handleModals = useCallback(() => {
    if (instantSellClicked) return <InstantSellPopup />
  }, [instantSellClicked])

  return (
    <WRAPPER_TABLE $cssStyle={tw``}>
      {handleModals()}
      <table>
        <thead>
          <NFTAMMTitles />
        </thead>
        {/* <NFTActiveBidsRow activeBids={activeOrders} /> */}
        <tbody>
          <NFTActiveBidsRow activeBids={activeOrders} />
        </tbody>
      </table>
    </WRAPPER_TABLE>
  )
}

const NFTActiveBidsRow: FC<{ activeBids: IActiveOrdersAMM[] }> = ({ activeBids }): ReactElement => {
  const { setInstantSell, setSelectedBidFromOrders, setRefreshAPI } = useNFTAMMContext()
  const { myNFTsByCollection } = useNFTCollections()
  const userCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const disableAcceptBtn = useMemo(() => myNFTsByCollection.length === 0, [myNFTsByCollection])
  const walletContext = useWallet()
  const { singleCollection } = useNFTCollections()
  const { connection } = useConnectionConfig()
  const publicKey = useMemo(
    () => walletContext?.wallet?.adapter?.publicKey,
    [walletContext?.wallet?.adapter, walletContext?.wallet?.adapter?.publicKey]
  )
  const getHumanReadableTime = useCallback((bid: IActiveOrdersAMM) => {
    const timeStr = parseUnixTimestamp(bid?.updatedAt.toString()).split(',')[1]
    const length = timeStr.length
    return timeStr.slice(0, length - 6) + ' ' + timeStr.slice(length - 3, length)
  }, [])

  const handleAcceptClicked = useCallback(
    (bid: IActiveOrdersAMM) => {
      setInstantSell(true)
      setSelectedBidFromOrders(bid)
    },
    [activeBids]
  )
  const handleCancelClick = useCallback(
    async (bid: IActiveOrdersAMM) => {
      try {
        const closeOrderPoolTx = await getCloseOrderPoolTx(bid?.address, userCache?.jwtToken)
        const closeTx = VersionedTransaction.deserialize(closeOrderPoolTx?.txs[0].tx.data)
        const depositSolRes = await orderDepositSol(bid?.address, bid?.solBalance, true, userCache?.jwtToken)
        const withdrawTx = VersionedTransaction.deserialize(depositSolRes?.txs[0].tx.data)
        const signedTxs = await walletContext.signAllTransactions([closeTx, withdrawTx])
        const sentTxs = []
        for (const signedTx of signedTxs) {
          const rawTransaction = signedTx.serialize()
          const options = {
            skipPreflight: false,
            commitment: 'confirmed'
          }
          sentTxs.push(connection.sendRawTransaction(rawTransaction, options))
        }
        const ixResponse = (await Promise.all(sentTxs)).map((id) => ({
          txid: id,
          slot: 0
        }))
        const confirm = await confirmTransaction(connection, ixResponse[1].txid, 'confirmed')

        if (confirm.value.err === null) {
          notify(successBidAMMMessage(singleCollection[0].collection_name))
          setTimeout(() => {
            setRefreshAPI((prev) => prev + 1)
          }, 5000)
        } else {
          pleaseTryAgain(false, 'NFT Bid creation failed')
        }
      } catch (err) {
        pleaseTryAgain(false, err?.message)
      }
    },
    [userCache]
  )

  useEffect(() => () => setSelectedBidFromOrders(null), [])
  return (
    <>
      {activeBids.map((bid: IActiveOrdersAMM, index) => (
        <tr key={index}>
          <td tw="pl-2 !text-left">
            {formatSOLDisplay((parseFloat(bid.sellNowPrice) / LAMPORTS_PER_SOL_NUMBER) * 0.94)}
          </td>{' '}
          <td>{formatSOLDisplay(bid.sellNowPrice)}</td> {/* Bid  */}
          <td>1</td> {/* Quantity */}
          <td>{truncateAddress(bid.ownerAddress)}</td> {/* User */}
          <td>
            <div tw="flex justify-center items-center">
              <div>
                <img tw="h-5 w-5 mr-2" src={`/img/assets/Aggregator/Tensor.svg`} />
              </div>
              <div>Tensor</div>
            </div>
          </td>{' '}
          {/* Market */}
          <td>{getHumanReadableTime(bid)}</td> {/* Time */}
          <td tw="!text-right flex">
            {publicKey.toString() === bid?.ownerAddress ? (
              <div onClick={() => handleCancelClick(bid)}>Cancel</div>
            ) : (
              <Button
                className={!disableAcceptBtn && 'pinkGradient'}
                disabled={disableAcceptBtn}
                disabledColor={tw`dark:bg-black-2 bg-grey-4`}
                onClick={() => handleAcceptClicked(bid)}
                tw="h-[30px] w-[110px] text-white ml-auto"
              >
                Accept Bid
              </Button>
            )}
          </td>{' '}
          {/* Accept bid */}
        </tr>
      ))}
    </>
  )
}
const NFTAMMTitles = (): ReactElement => (
  <tr>
    <th tw="!text-left pl-2">Seller Receives</th>
    <th>Bid Price</th>
    <th>Quantity</th>
    <th>User</th>
    <th>Market</th>
    <th>Time</th>
    <th tw="!text-right pr-2">Accept Bid</th>
  </tr>
)
export default AMMBidsTable
