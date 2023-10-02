import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'styled-components/macro'
import useBreakPoint from '../../../hooks/useBreakPoint'
import { useAccounts, useConnectionConfig, useNFTCollections } from '../../../context'
import { PopupCustom } from '../Popup/PopupCustom'
import { Button } from '../../../components/Button'
import { createPoolOrder, orderDepositSol } from '../../../api/NFTs'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import { useWallet } from '@solana/wallet-adapter-react'
import { VersionedTransaction } from '@solana/web3.js'
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js'
import { confirmTransaction } from '../../../web3'
import { pleaseTryAgain, pleaseTryAgainAMM, successBidAMMMessage } from '../Collection/AggModals/AggNotifications'
import { notify } from '../../../utils'
import { useNFTAMMContext } from '../../../context/nft_amm'

const STYLED_POPUP = styled(PopupCustom)`
  ${tw`dark:bg-black-2 bg-white`};
  .ant-modal-close {
    ${tw`absolute top-5 right-5`}
    .ant-modal-close-x {
      ${tw`sm:h-[18px] sm:w-[18px] h-5 w-5 flex`}
    }
  }
  .disableScroll {
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  .ant-modal-body {
    ${tw`p-4 sm:p-2`}
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-8px] sm:mt-auto sm:absolute sm:h-[600px] !p-4`}
    border-radius: 20px;

    @media (max-width: 500px) {
      border-radius: 20px 20px 0 0;
    }
  }
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
`

const CollectionWideBidPopup = (): ReactElement => {
  const breakpoint = useBreakPoint()
  const { collectionWideBid, setCollectionWideBid } = useNFTAMMContext()
  const { singleCollection } = useNFTCollections()
  const [nftsToBid, setNFTsToBid] = useState<number>(1)
  const [bidPrice, setBidPrice] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const walletContext = useWallet()
  const { connection } = useConnectionConfig()
  const { getUIAmount } = useAccounts()
  const { wallet } = useWallet()
  const solBalance = useMemo(
    () => getUIAmount(WRAPPED_SOL_MINT.toString()),
    [wallet?.adapter, wallet?.adapter?.publicKey]
  )
  const marketFees = useMemo(() => (bidPrice ?? 0) * 0.04, [bidPrice])
  const sellerReceives = useMemo(() => (bidPrice ?? 0) - marketFees, [marketFees, bidPrice])
  const insufficientBalance = useMemo(() => solBalance < bidPrice, [solBalance, bidPrice])
  const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  // here 2 tx are needed , 1 is for creating order, then depositing sol

  const handleNotifications = async (signature: string) => {
    try {
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      if (confirm.value.err === null) {
        notify(successBidAMMMessage(singleCollection[0].collection_name))
        setIsLoading(false)
        setCollectionWideBid(false)
      }
    } catch (error) {
      pleaseTryAgain(true, error?.message)
    }
    setIsLoading(false)
  }
  const handleBidClicked = useCallback(async () => {
    try {
      setIsLoading(true)
      const initialPrice = (bidPrice * LAMPORTS_PER_SOL_NUMBER).toString()
      const createOrderTxRes = await createPoolOrder(
        initialPrice,
        singleCollection[0].slug_tensor,
        '0',
        userCache?.jwtToken
      )
      const pool = createOrderTxRes?.pool

      const createOrderTx = VersionedTransaction.deserialize(createOrderTxRes?.txs[0].tx.data)
      const orderCreatedSig = await walletContext.sendTransaction(createOrderTx, connection)
      const orderCreatedConfirm = await confirmTransaction(connection, orderCreatedSig, 'confirmed')
      if (orderCreatedConfirm && orderCreatedConfirm?.value?.err === null) {
        const price = (bidPrice * nftsToBid * LAMPORTS_PER_SOL_NUMBER).toString()
        const depositSolRes = await orderDepositSol(pool, price, false, userCache?.jwtToken)
        const depositSolTx = await VersionedTransaction.deserialize(depositSolRes?.txs[0].tx.data)
        const depositSolSig = await walletContext.sendTransaction(depositSolTx, connection)
        await handleNotifications(depositSolSig)
      } else {
        pleaseTryAgainAMM('NFT Bid creation failed')
      }
    } catch (err) {
      pleaseTryAgainAMM(err?.message)
      setIsLoading(false)
      console.log(err)
    }
  }, [bidPrice, singleCollection, isLoading])

  return (
    <STYLED_POPUP
      height={breakpoint.isMobile ? '568px' : '692px'}
      width={breakpoint.isMobile ? '100%' : '548px'}
      title={null}
      centered={breakpoint.isDesktop ? true : false}
      visible={collectionWideBid ? true : false}
      onCancel={() => setCollectionWideBid(false)}
      footer={null}
    >
      <div tw="flex flex-col items-center justify-center">
        <div tw="flex  items-center justify-center">
          {breakpoint.isDesktop && <img src="/img/assets/Aggregator/InstantSell.svg" tw="w-[58px] h-[50px]" />}
          <div tw="text-lg ml-1 dark:text-grey-5 font-semibold text-black-4">Collection Bid</div>
        </div>
        <div>
          <img
            tw="h-[173px] w-[173px] sm:h-[125px] sm:w-[125px]
           rounded-[10px] mt-4 sm:mt-2"
            src={singleCollection[0]?.profile_pic_link}
          />
        </div>
        <div tw="flex items-center text-average font-semibold dark:text-grey-5 text-black-4 sm:mt-2 mt-4">
          {singleCollection[0]?.collection_name}
          <img tw="h-5 w-5 ml-2" src="/img/assets/Aggregator/verifiedNFT.svg" />
        </div>
        <div tw="flex items-center text-regular font-semibold dark:text-grey-5 text-black-4 sm:mt-2 mt-6">
          NFTs to Bid
        </div>
        <div tw="flex items-center text-regular font-semibold dark:text-grey-5 text-black-4 mt-2">
          {/* <div onClick={() => setNFTsToBid((prev) => (prev > 0 ? prev - 1 : prev))}>
            <img tw="h-5 w-5 cursor-pointer mx-4" src={`/img/assets/minus${mode}.svg`} alt="plus" />
          </div> */}
          <div>
            <input
              className="disableScroll"
              value={nftsToBid}
              onChange={() => setNFTsToBid(1)} //+e.target.value)} change this
              tw="dark:bg-black-2 bg-grey-5 text-center border-solid border-1 border-grey-1 
              rounded-[10px] w-[278px] h-8.75 font-semibold text-regular outline-none"
            />
          </div>
          {/* <div onClick={() => setNFTsToBid((prev) => (prev < 10 ? prev + 1 : prev))}>
            <img tw="h-5 w-5 cursor-pointer mx-4" src={`/img/assets/plus${mode}.svg`} alt="plus" />
          </div> */}
        </div>
        <div tw="flex items-center text-regular font-semibold dark:text-grey-5 text-black-4 sm:mt-2 mt-4">
          <u> Bid Price</u>{' '}
        </div>
        <div tw="flex items-center text-regular font-semibold dark:text-grey-5 text-black-4 mt-2">
          <input
            placeholder="0.0"
            onChange={(e) => (e.target.value === '' ? setBidPrice(null) : setBidPrice(+e.target.value))}
            value={bidPrice !== undefined ? bidPrice : ''} // to solve the console error
            type="number"
            tw="dark:bg-black-2 bg-grey-5 text-left border-solid border-1 border-grey-1 pl-2
              rounded-[10px] w-[348px] h-8.75 font-semibold text-regular outline-none"
          />
          <img src="/img/crypto/SOL.svg" tw="h-5 w-5 absolute ml-[320px]" />
        </div>

        <div tw=" w-[100%] mt-4 sm:mt-2 font-semibold text-regular">
          <div tw="flex items-center justify-between dark:text-grey-2 text-grey-1">
            <div>Wallet Balance</div>
            <div tw="dark:text-grey-5 text-black-4">{solBalance ? solBalance.toFixed(2) : 0} SOL</div>
          </div>
          <div tw="flex items-center justify-between dark:text-grey-2 text-grey-1">
            <div>Bid Offer/Item </div>
            <div tw="dark:text-grey-5 text-black-4">{bidPrice ? bidPrice.toFixed(2) : 0} SOL</div>
          </div>
          <div tw="flex items-center justify-between dark:text-grey-2 text-grey-1">
            <div>Maker Fees</div>
            <div tw="dark:text-grey-5 text-black-4">{marketFees ? marketFees.toFixed(3) : 0} SOL</div>
          </div>
          <div tw="flex items-center justify-between dark:text-grey-2 text-grey-1">
            <div>Seller Receives</div>
            <div tw="dark:text-grey-5 text-black-4">{sellerReceives ? sellerReceives.toFixed(2) : 0} SOL</div>
          </div>
          <div tw="flex items-center justify-between dark:text-grey-5 text-black-4">
            <div>Total amount to pay</div>
            <div>{bidPrice ?? 0} SOL</div>
          </div>
        </div>

        <Button
          onClick={handleBidClicked}
          loading={isLoading}
          className={!insufficientBalance && bidPrice ? 'pinkGradient' : ''}
          cssStyle={tw` h-10 w-[100%] text-regular font-semibold mt-3`}
          disabledColor={tw`dark:bg-black-1 bg-grey-4`}
          disabled={!(bidPrice > 0) || insufficientBalance}
        >
          {insufficientBalance
            ? `Insufficient SOL`
            : bidPrice
            ? `Place Bid for ${nftsToBid * bidPrice} SOL`
            : `Select # NFTs and Bid Price`}
        </Button>
      </div>
    </STYLED_POPUP>
  )
}
export default CollectionWideBidPopup
