import React, {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import Lottie from 'lottie-react'

/* eslint-disable @typescript-eslint/no-unused-vars */
import confettiAnimation from '../../../animations/confettiAnimation.json'
import LoadingAnimation from '../../../animations/Loading_animation.json'

import 'styled-components/macro'
import {
  useAccounts,
  useConnectionConfig,
  useDarkMode,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections
} from '../../../context'
import { Button, GradientText, Loader } from '../../../components'
import { PopupCustom } from '../Popup/PopupCustom'
import { Image } from 'antd'

import { capitalizeFirstLetter, checkMobile, formatSOLDisplay, notify } from '../../../utils'
import { TermsTextNFT } from './AcceptBidModal'
import { useWallet } from '@solana/wallet-adapter-react'
import { NFT_MARKETS } from '../../../api/NFTs'
import { callMagicEdenAPIs, callTensorAPIs } from '../MyNFTBag'
import { getParsedAccountByMint } from '../../../web3/nfts'
import { callExecuteSaleInstruction } from '../../../web3/auction-house-sdk/executeSale'
import { AH_NAME, WRAPPED_SOL_MINT, confirmTransaction } from '../../../web3'
import { pleaseTryAgain, successfulNFTPurchaseMsg } from './AggModals/AggNotifications'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { INFTGeneralData, INFTInBag } from '../../../types/nft_details'
import gfxImageService, { IMAGE_SIZES } from '../../../api/gfxImageService'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { GenericTooltip } from '../../../components/Farm/generic'
import useBreakPoint from '../../../hooks/useBreakPoint'
import { useHistory } from 'react-router-dom'

const STYLED_POPUP = styled(PopupCustom)`
  @media (max-width: 500px) {
    overflow: hidden !important;
  }
  .confettiAnimation {
    position: absolute;
    top: 0px;
    z-index: 3;
    ${tw`h-full w-full absolute`}
    pointer-events: none;
  }
  .loadingAnimation {
    ${tw` rounded-[10px]`}
    scale: 1.7;
    border-radius: 10px;
    @media (max-width: 500px) {
      scale: 1.35;
    }
  }
  .ant-modal-close {
    ${tw`sm:h-[16px] sm:w-[16px] h-4 w-4 top-3 right-4`};
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-body {
    ${tw`!p-1`}
  }
  &.ant-modal {
    ${tw`max-w-full p-3.5 sm:bottom-[-8px] sm:mt-auto sm:absolute sm:h-[600px] rounded-[20px]`}
    background-color: ${({ theme }) => theme.bg25};

    @media (max-width: 500px) {
      border-radius: 10px 10px 0 0;
    }
  }
  .hideScrollbar {
    &::-webkit-scrollbar {
      display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    & {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }
  }
`

const STYLED_INPUT = styled.input`
  ${tw`rounded-[5px] h-[35px] w-[95px] m-0 p-[10%] dark:bg-black-1 sm:dark:bg-black-3  outline-none `};
  border: 1px solid ${({ theme }) => theme.tokenBorder};
  background: ${({ theme }) => theme.sweepModalCard};
  @media (max-width: 500px) {
    background: ${({ theme }) => theme.bg25} !important;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const WRAPPER = styled.div`
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  .background {
    position: fixed;
    background: ${({ theme }) => theme.bg2} !important;
    @media (max-width: 500px) {
      background: ${({ theme }) => theme.bg25} !important;
      position: absolute !important;
    }
  }
`
const CollectionSweeper = (): ReactElement => {
  const { sweeperCount, setSweeperCount, setNftInSweeper, setShowSweeperModal, nftInSweeper } = useNFTAggregator()
  const { mode } = useDarkMode()
  const disableSweepButton = useMemo(() => sweeperCount === 0, [sweeperCount])
  const { singleCollection } = useNFTCollections()
  const { additionalFilters } = useNFTAggregatorFilters()
  useEffect(() => {
    try {
      if (Object.values(nftInSweeper).length === 0) setSweeperCount(0)
    } catch (err) {
      setSweeperCount(0)
    }
  }, [nftInSweeper])

  useEffect(() => {
    setNftInSweeper({})
    setSweeperCount(0)
  }, [singleCollection, additionalFilters])

  // handling removing from sweeper here and adding in single page
  // because i dont have access to nft ask and mint address details here
  const removeNftFromSweeper = useCallback(
    async (index: number) => {
      await setSweeperCount((prev) => (prev > 0 ? prev - 1 : 0))
      if (sweeperCount === 0) return
      setNftInSweeper((prev) => {
        const nfts = Object.values(prev)
        const updatedNfts = nfts.filter((nft) => nft.index !== index)
        const updatedNftObj = updatedNfts.reduce(
          (acc, nft) => ({
            ...acc,
            [nft.mint_address]: nft
          }),
          {}
        )
        return updatedNftObj
      })
    },
    [sweeperCount]
  )

  return (
    <WRAPPER>
      <div
        className="background"
        css={tw`h-[90px] sm:h-[92px] !w-[15vw] !max-w-[247px] !min-w-[242px] sm:!max-w-[100vw] sm:!w-[99vw] bg-grey-5 
        sm:bottom-0 sm:absolute fixed z-[200] flex flex-col items-center dark:bg-black-1 sm:bg-none border-solid 
        bottom-0 `}
      >
        <div css={tw`flex h-8.75 w-[100%] justify-between items-center px-2 `}>
          <div onClick={() => removeNftFromSweeper(sweeperCount)}>
            <img
              tw="h-5 w-5 cursor-pointer sm:h-[30px] sm:w-[30px]"
              src={`/img/assets/minus${mode}.svg`}
              alt="plus"
            />
          </div>
          <div>
            <STYLED_INPUT
              tw="text-center font-semibold w-[127px] sm:w-[200px]"
              value={sweeperCount}
              type="number"
              onChange={(e) => setSweeperCount(+e.target.value)}
            />
          </div>

          <div onClick={() => setSweeperCount((prev) => (prev < 10 ? prev + 1 : 10))}>
            <img
              tw="h-5 w-5 cursor-pointer sm:h-[30px] sm:w-[30px]"
              src={`/img/assets/plus${mode}.svg`}
              alt="plus"
            />
          </div>
        </div>
        <div>
          <Button
            className={!disableSweepButton && 'pinkGradient'}
            onClick={() => setShowSweeperModal(true)}
            disabledColor={tw`sm:dark:bg-black-1 dark:bg-black-2 bg-grey-4`}
            cssStyle={tw`h-8.75 mt-2.5 text-regular sm:w-[calc(100vw - 30px)] 
            w-[228px] font-semibold !text-white`}
            disabled={disableSweepButton}
          >
            Sweep
            <img src="/img/assets/Aggregator/sweep_icon_white.svg" alt="arrow-right" tw="ml-2 h-[25px] w-[25px]" />
          </Button>
        </div>
      </div>
    </WRAPPER>
  )
}

export const SweeperModal = (): ReactElement => {
  const { showSweeperModal, setShowSweeperModal, nftInSweeper, setOperatingNFT } = useNFTAggregator()
  const { additionalFilters } = useNFTAggregatorFilters()

  const filtersApplied = useMemo(() => {
    for (const filter in additionalFilters) {
      if (additionalFilters[filter] !== null) return true
    }
    return false
  }, [additionalFilters])

  const wal = useWallet()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  const { connection } = useConnectionConfig()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [missionAccomplished, setMissionAccomplished] = useState<boolean>(false)
  const { getUIAmount } = useAccounts()
  const breakpoint = useBreakPoint()
  const { singleCollection } = useNFTCollections()
  const { mode } = useDarkMode()
  const solBalance = useMemo(
    () => getUIAmount(WRAPPED_SOL_MINT.toString()),
    [wallet?.adapter, wallet?.adapter?.publicKey]
  )
  const totalPrice = useMemo(() => {
    try {
      const total = Object.values(nftInSweeper).reduce(
        (acc, nft) => acc + parseFloat(nft.buyer_price) / LAMPORTS_PER_SOL,
        0
      )
      return total
    } catch (err) {
      return 0
    }
  }, [nftInSweeper])
  const numberOfNFTs = useMemo(() => Object.keys(nftInSweeper).length, [nftInSweeper])
  const disableButton = useMemo(() => totalPrice > solBalance, [totalPrice, solBalance])
  const insufficientBalance = useMemo(() => totalPrice > solBalance, [totalPrice, solBalance])

  const handleAPIRequest = async (nft, key) => {
    if (nft.marketplace_name === NFT_MARKETS.TENSOR) {
      return { [key]: await callTensorAPIs(nft, publicKey) }
    }
    if (nft.marketplace_name === NFT_MARKETS.MAGIC_EDEN) {
      return { [key]: await callMagicEdenAPIs(nft, publicKey) }
    }
    if (nft.marketplace_name === NFT_MARKETS.GOOSE) {
      const parsedAccounts = await getParsedAccountByMint({
        mintAddress: nft.mint_address,
        connection: connection
      })
      const accountInfo = {
        token_account: parsedAccounts !== undefined ? parsedAccounts.pubkey : null,
        owner: parsedAccounts !== undefined ? parsedAccounts.owner : null
      }
      const general = {
        ...accountInfo,
        ...nft
      }
      // this is for goosefx transaction only
      const gooseFxTx = await callExecuteSaleInstruction(nft, general, publicKey, true, connection, wal)
      const blockhash = (await connection.getLatestBlockhash('finalized')).blockhash

      gooseFxTx.recentBlockhash = blockhash
      gooseFxTx.feePayer = publicKey

      return {
        [key]: gooseFxTx
      }
    }
    return { [key]: undefined }
  }
  const removeFromCartAndProcessingList = useCallback(
    (mintAddress, removeFromProcessing = false, removeFromCart = false) => {
      if (removeFromProcessing) {
        setOperatingNFT((prevSet) => {
          const newSet = new Set(prevSet)
          newSet.delete(mintAddress)
          return newSet
        })
      }
    },
    []
  )

  const handleNotifications = async (signature: string, item: any, index: number) => {
    try {
      // setting this as operating nft , for loading buttons
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      if (confirm.value.err === null) {
        notify(successfulNFTPurchaseMsg(signature, item.nft_name, formatSOLDisplay(item.buyer_price)))
        removeFromCartAndProcessingList(item?.mint_address, false, true)
      }
    } catch (error) {
      // deleting this from list of operating nft, for loading buttons
      removeFromCartAndProcessingList(item?.mint_address, true, false)
      pleaseTryAgain(true, error?.message)
    }
    if (index === 0) {
      setIsLoading(false)
      setMissionAccomplished(true)
    }
  }

  const nftInArrayFormat = useMemo(() => Object.values(nftInSweeper), [nftInSweeper])

  const handleBulkPurchase = async () => {
    setIsLoading(true)

    const promises = Object.keys(nftInSweeper).map((key) => {
      setOperatingNFT((prevSet) => new Set([...Array.from(prevSet), nftInSweeper[key]?.mint_address]))
      return handleAPIRequest(nftInSweeper[key], key)
    })

    const results = await Promise.all(promises)

    const readyTx = Object.assign({}, ...results)
    const builtTxs = []

    Object.keys(readyTx).forEach((key) => {
      builtTxs.push(readyTx[key])
    })
    try {
      const signedTxs = await wal.signAllTransactions(builtTxs)

      const sentTxs = []
      for (const transaction of signedTxs) {
        const rawTransaction = transaction.serialize()
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

      ixResponse.map((ix, index) =>
        handleNotifications(
          ix.txid,
          nftInSweeper[nftInArrayFormat[index].token_account_mint_key],
          ixResponse.indexOf(ix)
        )
      )
    } catch (err) {
      setOperatingNFT(new Set())
      setIsLoading(false)
      pleaseTryAgain(true, err?.message)
    }
  }

  if (isLoading)
    return (
      <STYLED_POPUP
        height={checkMobile() ? '330px' : '413px'}
        width={checkMobile() ? '100%' : '430px'}
        title={null}
        centered={checkMobile() ? false : true}
        visible={showSweeperModal}
        onCancel={() => setShowSweeperModal(false)}
        footer={null}
      >
        <div tw="h-[100%] ">
          <div tw="font-semibold text-lg dark:text-grey-5 text-black-4 flex items-center justify-center">
            Collection Sweeper
            <img src="/img/assets/Aggregator/sweep_icon.svg" tw="w-8.75 h-8.75 sm:h-[25px] sm:w-[25px] ml-2" />
          </div>
          <div
            tw="font-semibold text-regular dark:text-grey-5 text-black-4 flex 
          items-center justify-center mt-2 sm:mt-0"
          >
            Sweeping {Object.values(nftInSweeper).length} NFTs of {singleCollection[0].collection_name}
          </div>
          <div tw="flex items-center justify-center mt-4 sm:mt-1">
            <Lottie animationData={LoadingAnimation} className="loadingAnimation" tw="absolute" />
            <div
              tw="max-h-[164px] mt-[-10.5px] sm:max-h-[125px] sm:max-w-[125px] sm:min-h-[120px] 
            min-h-[162px] w-[173.5px] sm:mt-0"
            >
              <img
                tw="w-[100%] rounded-[5px]"
                src={gfxImageService(
                  IMAGE_SIZES.SQUARE,
                  singleCollection[0].uuid,
                  singleCollection[0].profile_pic_link
                )}
                onError={(e) => (e.currentTarget.src = singleCollection[0].profile_pic_link)}
              />
            </div>
          </div>
          {singleCollection[0]?.is_verified}
          {singleCollection[0]?.is_verified && (
            <div
              tw="font-semibold text-regular dark:text-grey-5 text-black-4 flex items-center
             justify-center mt-5 sm:mt-2 sm:text-tiny"
            >
              This is a verified creator
              <img tw="h-5 w-5 ml-2" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
            </div>
          )}
          <div
            tw="h-[79px] sm:h-[74px] w-[400px] sm:w-[100%] dark:bg-black-1 bg-white bottom-0 absolute ml-[-3px] 
            items-center flex flex-col justify-between p-2 border-solid dark:border-black-4 rounded-[5px]
             border-grey-2 border-1"
          >
            <div tw="mt-2 mb-2 ml-[-25px]">
              <Loader color={mode === 'dark' ? '#fff' : '#A934FF'} />
            </div>
            <div tw="text-regular font-semibold dark:text-grey-5 text-black-4">Sweep in progress..</div>
            <div tw="text-tiny font-semibold text-grey-1">Incoming wallet confirmations</div>
          </div>
        </div>
      </STYLED_POPUP>
    )

  return (
    <STYLED_POPUP
      height={checkMobile() ? '603px' : '660px'}
      width={checkMobile() ? '100%' : '549px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={showSweeperModal}
      onCancel={() => setShowSweeperModal(false)}
      footer={null}
    >
      {missionAccomplished ? (
        <MissionAccomplishedSweeper setShowSweeperModal={setShowSweeperModal} />
      ) : (
        <div tw="h-[100%] ">
          <div tw="font-semibold text-lg dark:text-grey-5 text-black-4 flex items-center justify-center">
            Collection Sweeper
            <img src="/img/assets/Aggregator/sweep_icon.svg" tw="w-8.75 h-8.75 sm:h-[25px] sm:w-[25px] ml-2" />
          </div>

          <div tw="mt-1 dark:text-grey-2 text-grey-1 font-semibold text-regular text-center">
            Here {numberOfNFTs > 1 ? `are` : `is`} the {numberOfNFTs} cheapest NFTs{' '}
            {breakpoint.isDesktop && <br />} of this collection:
          </div>

          {/* Large card if filters applied else small card */}
          {filtersApplied ? (
            <div
              className="hideScrollbar"
              tw="ml-[-16px] pl-4 mr-[-16px] pr-4 sm:h-[245px] h-[290px] overflow-x-visible overflow-y-hidden flex"
            >
              {/* Mission accomplished   */}
              {Object.values(nftInSweeper).map((nft, index) => (
                <NFTCardView nft={nft} key={index} />
              ))}
            </div>
          ) : (
            <div
              className="hideScrollbar"
              css={[Object.values(nftInSweeper).length < 4 && tw`items-center !ml-2 sm:!ml-[-8px]`]}
              tw="ml-[-16px] pl-4 mr-[-16px] 
          pr-4 sm:h-[245px] h-[320px] overflow-x-visible overflow-y-hidden flex  flex-wrap flex-col"
            >
              {Object.values(nftInSweeper).map((nft, index) => (
                <SmallNFTCardView nft={nft} key={index} />
              ))}
            </div>
          )}
          <div>
            {singleCollection[0]?.is_verified && (
              <div
                tw="font-semibold text-regular dark:text-grey-5 text-black-4 flex items-center
             justify-center mt-2 sm:mt-3 sm:text-tiny"
              >
                This is a verified creator
                <img tw="h-5 w-5 ml-2" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
              </div>
            )}
          </div>

          <div tw="absolute bottom-[100px] w-[calc(100% - 12px)] font-semibold text-regular">
            <div tw="flex items-center justify-between dark:text-grey-5 text-black-4">
              <div>Wallet Balance</div>
              <div>{solBalance.toFixed(3)} SOL</div>
            </div>
            <div tw="flex items-center justify-between dark:text-grey-5 text-black-4">
              <div>Estimated price</div>
              <div>{totalPrice.toFixed(3)} SOL</div>
            </div>
            {/* <div tw="flex items-center justify-between">
            <div>Service Fee</div>
            <div> SOL</div>
          </div> */}
            <div tw="flex items-center justify-between dark:text-white text-black-4">
              <div>Total Price</div>
              <div>{totalPrice.toFixed(3)} SOL</div>
            </div>
          </div>
          <div tw="absolute bottom-1 sm:bottom-0 w-[calc(100% - 12px)]">
            <Button
              loading={isLoading}
              onClick={handleBulkPurchase}
              css={[disableButton ? tw`bg-black-4` : tw`!bg-gradient-1`]}
              cssStyle={tw`w-[100%] h-8.75 font-semibold`}
            >
              {insufficientBalance ? `Insufficient SOL` : 'Sweep now'}
            </Button>
            <TermsText />
          </div>
        </div>
      )}
    </STYLED_POPUP>
  )
}

const MissionAccomplishedSweeper: FC<{ setShowSweeperModal: Dispatch<SetStateAction<boolean>> }> = ({
  setShowSweeperModal
}) => {
  const { nftInSweeper, setNftInSweeper } = useNFTAggregator()
  const { additionalFilters } = useNFTAggregatorFilters()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const history = useHistory()
  const filtersApplied = useMemo(() => {
    for (const filter in additionalFilters) {
      if (additionalFilters[filter] !== null) return true
    }
    return false
  }, [additionalFilters])

  useEffect(() => {
    setTimeout(() => {
      setNftInSweeper({})
    }, 135000)
  }, [])

  const totalPrice = useMemo(() => {
    try {
      const total = Object.values(nftInSweeper).reduce(
        (acc, nft) => acc + parseFloat(nft.buyer_price) / LAMPORTS_PER_SOL,
        0
      )
      return total
    } catch (err) {
      return 0
    }
  }, [nftInSweeper])

  return (
    <div tw="h-[100%] ">
      <Lottie animationData={confettiAnimation} className="confettiAnimation" />

      <div tw="font-semibold text-lg dark:text-grey-5 text-black-4 flex items-center justify-center">
        Mission Accomplished!
      </div>

      <div
        tw="flex flex-col items-center mt-2 text-center font-semibold dark:text-grey-2 text-grey-1 text-regular 
      justify-center "
      >
        You are now a proud owner of: <br />
        <div tw="dark:text-grey-5 text-black-4 ml-1"> {Object.values(nftInSweeper)?.length} NFTs by SMB Gen2 </div>
      </div>
      <div tw="mt-4" css={[Object.values(nftInSweeper).length < 4 && tw`pl-[90px] sm:pl-1`]}>
        {filtersApplied ? (
          <div
            className="hideScrollbar"
            css={[Object.values(nftInSweeper).length < 4 && tw`items-center`]}
            tw="ml-[-16px] pl-4 mr-[-16px] 
  pr-4 sm:h-[245px] h-[290px] overflow-x-visible overflow-y-hidden flex"
          >
            {Object.values(nftInSweeper).map((nft, index) => (
              <NFTCardView nft={nft} key={index} />
            ))}
          </div>
        ) : (
          <div
            className="hideScrollbar"
            tw="ml-[-16px] pl-4 mr-[-16px] 
          pr-4 sm:h-[245px] h-[320px] overflow-x-visible overflow-y-hidden flex  flex-wrap flex-col"
          >
            {Object.values(nftInSweeper).map((nft, index) => (
              <SmallNFTCardView nft={nft} key={index} />
            ))}
          </div>
        )}
      </div>
      <div
        tw="flex flex-col items-center justify-center text-lg mt-4 sm:mt-8
       font-semibold text-grey-1 dark:text-grey-2"
      >
        <div tw="mb-2">You Paid</div>
        <div>
          <PriceWithToken
            token="SOL"
            price={formatSOLDisplay(totalPrice, true)}
            cssStyle={tw`h-5 w-5 text-lg ml-2 mt-2`}
          />
        </div>
      </div>
      <div>
        <div tw="absolute  bottom-4">
          <Button
            onClick={() => history.push(`/nfts/profile/${publicKey?.toString()}`)}
            cssStyle={tw`font-semibold bg-blue-1 h-10 w-[full] ml-2 sm:ml-0 w-[500px] sm:w-[90vw]`}
          >
            Go to my collection
          </Button>
        </div>
      </div>
    </div>
  )
}

const SmallNFTCardView: FC<{ nft: INFTInBag | any }> = ({ nft }): ReactElement => {
  const nftId = useMemo(
    () =>
      nft?.nft_name
        ? nft?.nft_name.includes('#')
          ? '#' + nft?.nft_name.split('#')[1]
          : minimizeTheString(nft?.nft_name, checkMobile() ? 10 : 12)
        : null,
    [nft]
  )
  const handleMarketplaceFormat = useCallback((ask) => {
    if (ask?.marketplace_name === null) return AH_NAME(ask?.auction_house_key)
    const name = ask?.marketplace_name
    const splitString = name.split('_')
    const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
    return capString.join(' ')
  }, [])

  return (
    <div
      tw="mt-5 mr-4 dark:bg-black-1 bg-white w-[338px] h-[60px] flex rounded-[5px] border-grey-1 border-1 
    border-solid"
    >
      <div tw="flex items-center p-1 justify-between w-full">
        <div tw="w-[50px]  min-h-[48px] max-h-[50px]  ">
          <div
            tw="flex items-center w-full min-h-[50px] max-h-[50px] sm:!max-h-[50px]  sm:max-w-[50px]
   overflow-hidden rounded-[2.5px] sm:min-h-[50px]"
          >
            <Image
              src={nft?.image_url}
              width={'100%'}
              preview={false}
              onError={(e) => console.error(e)}
              alt="NFT Preview"
            />
          </div>
        </div>
        <div>
          <div tw="text-tiny font-semibold dark:text-grey-2 text-grey-1  w-[65px]">Item</div>
          <div tw="text-regular dark:text-grey-5 text-black-4 font-semibold w-[65px]">
            {' '}
            {nftId ? nftId : '# Nft'}
          </div>
        </div>
        <div>
          <div tw="text-tiny dark:text-grey-2 text-grey-1 font-semibold w-[120px]">Marketplace</div>
          <div tw="text-regular font-semibold dark:text-grey-5 text-black-4 flex text-left w-[120px]">
            <div>{handleMarketplaceFormat(nft)}</div>
            <div>
              <img
                tw="h-5 w-5 ml-1"
                alt="marketplace"
                src={`/img/assets/Aggregator/${handleMarketplaceFormat(nft)}.svg`}
              />
            </div>
          </div>
        </div>
        <div>
          <div tw="text-tiny dark:text-grey-2 text-grey-1 font-semibold">Price</div>
          <div tw="text-regular">
            <PriceWithToken
              token="SOL"
              price={formatSOLDisplay(nft?.buyer_price)}
              cssStyle={tw`h-5 w-5 dark:text-grey-5 text-black-4`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export const NFTCardView: FC<{
  nft: INFTInBag | any
  setSelectedNFT?: Dispatch<SetStateAction<INFTGeneralData>>
  mintAddress?: INFTInBag
  showPrice?: string
  hidePrice?: boolean
}> = ({ nft, setSelectedNFT, mintAddress, showPrice, hidePrice }): ReactElement => {
  const { singleCollection } = useNFTCollections()
  const nftId = useMemo(() => {
    try {
      return nft?.nft_name
        ? nft?.nft_name.includes('#')
          ? '#' + nft?.nft_name.split('#')[1]
          : minimizeTheString(nft?.nft_name, checkMobile() ? 10 : 12)
        : null
    } catch (err) {
      return 'null'
    }
  }, [nft])

  const handleMarketplaceFormat = useCallback((ask) => {
    if (ask?.marketplace_name === null) return AH_NAME(ask?.auction_house_key)
    const name = ask?.marketplace_name
    const splitString = name.split('_')
    const capString = splitString.map((c) => capitalizeFirstLetter(c.toLowerCase()))
    return capString.join(' ')
  }, [])

  return (
    <div
      css={[mintAddress === nft?.mint_address ? tw`bg-gradient-1` : tw`dark:bg-black-4 bg-grey-4`]}
      tw=" mt-5 sm:mt-4 mr-4 w-[196px] h-[270px] sm:w-[145px] sm:h-[222px]
       flex items-center justify-center rounded-[11px] p-[2px]"
    >
      <div
        onClick={setSelectedNFT ? () => setSelectedNFT(nft) : null}
        tw=" dark:bg-black-1 bg-white w-[193px] h-[267.5px] 
        sm:w-[143px] sm:h-[220px] rounded-[10px] flex flex-col p-2.5"
      >
        <div tw="flex">
          <div tw="w-[173px] min-h-[164px] max-h-[174px]">
            <div
              tw="flex items-center w-full min-h-[164px] max-h-[174px] sm:!max-h-[125px] sm:max-w-[157px]
 overflow-hidden rounded-[8px] sm:min-h-[120px]"
            >
              <Image
                src={nft?.image_url}
                width={'100%'}
                preview={false}
                onError={(e) => console.error(e)}
                alt="NFT Preview"
              />
            </div>
            <div tw="flex items-center justify-between mt-2 text-black-4 dark:text-grey-5">
              <div tw="flex font-semibold">
                {nftId ? nftId : '# Nft'}
                {nft?.is_verified && (
                  <img tw="ml-2" src="/img/assets/Aggregator/verifiedNFT.svg" alt={'verified nft'} />
                )}
              </div>
              <div>
                {(nft?.marketplace_name || nft?.auction_house_key) && (
                  <GenericTooltip text={handleMarketplaceFormat(nft)}>
                    <div>
                      <img
                        tw="h-5 w-5"
                        alt="marketplace"
                        src={`/img/assets/Aggregator/${handleMarketplaceFormat(nft)}.svg`}
                      />
                    </div>
                  </GenericTooltip>
                )}
              </div>
            </div>

            <div>
              <GradientText
                text={minimizeTheString(singleCollection[0].collection_name)}
                fontSize={15}
                fontWeight={600}
                lineHeight={18}
              />
            </div>
            {hidePrice === undefined && (
              <div>
                <PriceWithToken
                  token="SOL"
                  price={showPrice ?? formatSOLDisplay(nft?.buyer_price)}
                  cssStyle={tw`h-5 w-5`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
const TermsText = () => {
  const breakpoint = useBreakPoint()
  return (
    <div tw="text-center pt-2 text-grey-1 dark:text-grey-2 ">
      By selecting "Sweep Now" you agree {breakpoint.isMobile && <br />} to{' '}
      <a
        target="_blank"
        tw="dark:text-grey-5 text-blue-1"
        rel="noopener noreferrer"
        href="https://docs.goosefx.io/risks"
      >
        <u tw="text-grey-5 font-semibold"> Terms of Service</u>
      </a>
    </div>
  )
}

export default CollectionSweeper
